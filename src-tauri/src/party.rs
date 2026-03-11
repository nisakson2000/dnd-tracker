use futures_util::{SinkExt, StreamExt};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{mpsc, oneshot, Mutex, RwLock};
use warp::ws::{Message, WebSocket};
use warp::Filter;

pub const PARTY_PORT: u16 = 8787;
const SAFE_CHARS: &[u8] = b"ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const MAX_ROOM_ATTEMPTS: usize = 100;
const MAX_MESSAGE_SIZE: usize = 65_536; // 64KB per message

type Tx = mpsc::UnboundedSender<Message>;

struct Client {
    tx: Tx,
    room_code: Option<String>,
    character_id: String, // the D&D character ID this client owns
    character: Value,
}

struct Room {
    members: Vec<String>, // client_ids
    host_id: String,      // client_id of the host
}

pub struct PartyServer {
    clients: RwLock<HashMap<String, Client>>,
    rooms: RwLock<HashMap<String, Room>>,
    shutdown: Mutex<Option<oneshot::Sender<()>>>,
    running: RwLock<bool>,
}

impl PartyServer {
    pub fn new() -> Arc<Self> {
        Arc::new(Self {
            clients: RwLock::new(HashMap::new()),
            rooms: RwLock::new(HashMap::new()),
            shutdown: Mutex::new(None),
            running: RwLock::new(false),
        })
    }

    pub async fn start(self: &Arc<Self>) -> Result<u16, String> {
        if *self.running.read().await {
            return Ok(PARTY_PORT);
        }

        let (shutdown_tx, shutdown_rx) = oneshot::channel::<()>();
        *self.shutdown.lock().await = Some(shutdown_tx);
        *self.running.write().await = true;

        let state = self.clone();
        let state2 = self.clone();

        let create_room = warp::path!("party" / "rooms")
            .and(warp::post())
            .and(warp::any().map(move || state.clone()))
            .then(handle_create_room);

        let ws_route = warp::path!("party" / "ws")
            .and(warp::ws())
            .and(warp::any().map(move || state2.clone()))
            .map(|ws: warp::ws::Ws, state: Arc<PartyServer>| {
                ws.on_upgrade(move |socket| handle_ws_connection(socket, state))
            });

        let cors = warp::cors()
            .allow_any_origin()
            .allow_methods(vec!["GET", "POST"])
            .allow_headers(vec!["content-type"]);

        let routes = create_room.or(ws_route).with(cors);

        let result = warp::serve(routes)
            .try_bind_with_graceful_shutdown(([0, 0, 0, 0], PARTY_PORT), async {
                shutdown_rx.await.ok();
            });

        match result {
            Ok((_addr, server)) => {
                tokio::spawn(server);
                Ok(PARTY_PORT)
            }
            Err(e) => {
                *self.running.write().await = false;
                *self.shutdown.lock().await = None;
                Err(format!("Failed to start party server on port {}: {}", PARTY_PORT, e))
            }
        }
    }

    pub async fn stop(self: &Arc<Self>) {
        if let Some(tx) = self.shutdown.lock().await.take() {
            let _ = tx.send(());
        }
        *self.running.write().await = false;
        self.clients.write().await.clear();
        self.rooms.write().await.clear();
    }

    fn generate_room_code() -> String {
        let id = uuid::Uuid::new_v4();
        let bytes = id.as_bytes();
        (0..4)
            .map(|i| SAFE_CHARS[bytes[i] as usize % SAFE_CHARS.len()] as char)
            .collect()
    }

    fn timestamp() -> String {
        chrono::Utc::now().to_rfc3339()
    }

    async fn create_room(self: &Arc<Self>) -> Result<String, String> {
        let mut rooms = self.rooms.write().await;
        for _ in 0..MAX_ROOM_ATTEMPTS {
            let code = Self::generate_room_code();
            if !rooms.contains_key(&code) {
                rooms.insert(
                    code.clone(),
                    Room {
                        members: Vec::new(),
                        host_id: String::new(), // set when first client joins
                    },
                );
                return Ok(code);
            }
        }
        Err("Could not generate unique room code".to_string())
    }

    async fn add_client(self: &Arc<Self>, client_id: String, tx: Tx) {
        self.clients.write().await.insert(
            client_id,
            Client {
                tx,
                room_code: None,
                character_id: String::new(),
                character: json!({}),
            },
        );
    }

    async fn remove_client(self: &Arc<Self>, client_id: &str) {
        let room_code = {
            let clients = self.clients.read().await;
            clients.get(client_id).and_then(|c| c.room_code.clone())
        };

        if let Some(code) = &room_code {
            let mut should_remove_room = false;
            {
                let mut rooms = self.rooms.write().await;
                if let Some(room) = rooms.get_mut(code) {
                    room.members.retain(|id| id != client_id);
                    if room.members.is_empty() {
                        should_remove_room = true;
                    }
                }
                if should_remove_room {
                    rooms.remove(code);
                }
            }

            if !should_remove_room {
                self.broadcast_to_room(
                    code,
                    &json!({
                        "type": "player_disconnected",
                        "client_id": client_id,
                        "timestamp": Self::timestamp(),
                    }),
                    Some(client_id),
                )
                .await;
            }
        }

        self.clients.write().await.remove(client_id);
    }

    fn send_error(client: &Client, message: &str) {
        let _ = client.tx.send(Message::text(
            json!({ "type": "error", "message": message, "timestamp": Self::timestamp() }).to_string(),
        ));
    }

    async fn handle_join(self: &Arc<Self>, client_id: &str, room: &str, character: Value) {
        let room_exists = self.rooms.read().await.contains_key(room);
        if !room_exists {
            let clients = self.clients.read().await;
            if let Some(client) = clients.get(client_id) {
                Self::send_error(client, "Room not found");
            }
            return;
        }

        // Extract character_id from the character payload for ownership tracking
        let char_id = character
            .get("id")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();

        // Update client info
        {
            let mut clients = self.clients.write().await;
            if let Some(client) = clients.get_mut(client_id) {
                client.room_code = Some(room.to_string());
                client.character_id = char_id;
                client.character = character;
            }
        }

        // Add to room, set host if first member
        {
            let mut rooms = self.rooms.write().await;
            if let Some(r) = rooms.get_mut(room) {
                if !r.members.contains(&client_id.to_string()) {
                    r.members.push(client_id.to_string());
                }
                if r.host_id.is_empty() {
                    r.host_id = client_id.to_string();
                }
            }
        }

        // Send welcome with full member list
        let members = self.get_room_members(room).await;
        let is_host = {
            let rooms = self.rooms.read().await;
            rooms.get(room).map_or(false, |r| r.host_id == client_id)
        };
        {
            let clients = self.clients.read().await;
            if let Some(client) = clients.get(client_id) {
                let _ = client.tx.send(Message::text(
                    json!({
                        "type": "welcome",
                        "members": members,
                        "you": client_id,
                        "is_host": is_host,
                        "timestamp": Self::timestamp(),
                    })
                    .to_string(),
                ));
            }
        }

        // Broadcast join to others
        let char_data = {
            let clients = self.clients.read().await;
            clients
                .get(client_id)
                .map(|c| c.character.clone())
                .unwrap_or(json!({}))
        };
        self.broadcast_to_room(
            room,
            &json!({
                "type": "player_joined",
                "member": { "client_id": client_id, "character": char_data },
                "timestamp": Self::timestamp(),
            }),
            Some(client_id),
        )
        .await;
    }

    /// Handle granular sync events — only the fields that changed
    async fn handle_event(self: &Arc<Self>, client_id: &str, event: &Value) {
        let room_code = {
            let clients = self.clients.read().await;
            clients.get(client_id).and_then(|c| c.room_code.clone())
        };
        let Some(code) = room_code else { return };

        let event_type = event
            .get("event")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown");

        // Update the stored character snapshot with the changed fields
        {
            let mut clients = self.clients.write().await;
            if let Some(client) = clients.get_mut(client_id) {
                if let Some(changes) = event.get("data").and_then(|d| d.as_object()) {
                    if let Some(char_obj) = client.character.as_object_mut() {
                        for (key, val) in changes {
                            char_obj.insert(key.clone(), val.clone());
                        }
                    }
                }
            }
        }

        // Broadcast the granular event to room
        self.broadcast_to_room(
            &code,
            &json!({
                "type": "sync_event",
                "client_id": client_id,
                "event": event_type,
                "data": event.get("data").unwrap_or(&json!({})),
                "timestamp": Self::timestamp(),
            }),
            Some(client_id),
        )
        .await;
    }

    /// Full character update (backwards compatible)
    async fn handle_update(self: &Arc<Self>, client_id: &str, character: Value) {
        let room_code = {
            let mut clients = self.clients.write().await;
            if let Some(client) = clients.get_mut(client_id) {
                client.character = character.clone();
                client.room_code.clone()
            } else {
                None
            }
        };

        if let Some(code) = room_code {
            self.broadcast_to_room(
                &code,
                &json!({
                    "type": "updated",
                    "member": { "client_id": client_id, "character": character },
                    "timestamp": Self::timestamp(),
                }),
                None,
            )
            .await;
        }
    }

    async fn get_room_members(self: &Arc<Self>, room: &str) -> Vec<Value> {
        let rooms = self.rooms.read().await;
        let clients = self.clients.read().await;
        rooms
            .get(room)
            .map(|r| {
                r.members
                    .iter()
                    .filter_map(|id| {
                        clients
                            .get(id)
                            .map(|c| json!({ "client_id": id, "character": c.character }))
                    })
                    .collect()
            })
            .unwrap_or_default()
    }

    async fn broadcast_to_room(self: &Arc<Self>, room: &str, msg: &Value, exclude: Option<&str>) {
        let rooms = self.rooms.read().await;
        let clients = self.clients.read().await;
        if let Some(r) = rooms.get(room) {
            let text = msg.to_string();
            for id in &r.members {
                if exclude.map_or(true, |ex| ex != id) {
                    if let Some(client) = clients.get(id) {
                        let _ = client.tx.send(Message::text(text.clone()));
                    }
                }
            }
        }
    }
}

// ── Warp handlers ────────────────────────────────────────────────────────────

async fn handle_create_room(state: Arc<PartyServer>) -> impl warp::Reply {
    match state.create_room().await {
        Ok(code) => warp::reply::json(&json!({ "room_code": code })),
        Err(msg) => warp::reply::json(&json!({ "error": msg })),
    }
}

async fn handle_ws_connection(ws: WebSocket, state: Arc<PartyServer>) {
    let client_id = uuid::Uuid::new_v4().to_string()[..8].to_string();
    let (mut ws_tx, mut ws_rx) = ws.split();
    let (tx, mut rx) = mpsc::unbounded_channel::<Message>();

    state.add_client(client_id.clone(), tx).await;

    // Forward channel messages to WebSocket
    let forward = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if ws_tx.send(msg).await.is_err() {
                break;
            }
        }
    });

    // Process incoming messages
    while let Some(Ok(msg)) = ws_rx.next().await {
        if msg.is_text() {
            if let Ok(text) = msg.to_str() {
                // Size guard
                if text.len() > MAX_MESSAGE_SIZE {
                    let clients = state.clients.read().await;
                    if let Some(client) = clients.get(&client_id) {
                        PartyServer::send_error(client, "Message too large");
                    }
                    continue;
                }

                if let Ok(parsed) = serde_json::from_str::<Value>(text) {
                    match parsed.get("type").and_then(|t| t.as_str()) {
                        Some("join") => {
                            let room = parsed
                                .get("room")
                                .and_then(|r| r.as_str())
                                .unwrap_or("");
                            let character =
                                parsed.get("character").cloned().unwrap_or(json!({}));
                            state.handle_join(&client_id, room, character).await;
                        }
                        // Granular sync events:
                        // { type: "event", event: "hp_changed", data: { hp: 25, max_hp: 40 } }
                        Some("event") => {
                            state.handle_event(&client_id, &parsed).await;
                        }
                        // Full character update (backwards compatible)
                        Some("update") => {
                            let character =
                                parsed.get("character").cloned().unwrap_or(json!({}));
                            state.handle_update(&client_id, character).await;
                        }
                        Some("ping") => {
                            let clients = state.clients.read().await;
                            if let Some(client) = clients.get(&client_id) {
                                let _ = client.tx.send(Message::text(
                                    json!({"type": "pong", "timestamp": PartyServer::timestamp()})
                                        .to_string(),
                                ));
                            }
                        }
                        _ => {}
                    }
                }
            }
        } else if msg.is_close() {
            break;
        }
    }

    state.remove_client(&client_id).await;
    forward.abort();
}

// ── Tauri commands ───────────────────────────────────────────────────────────

#[tauri::command]
pub async fn start_party_server(
    party: tauri::State<'_, Arc<PartyServer>>,
) -> Result<u16, String> {
    party.start().await
}

#[tauri::command]
pub async fn stop_party_server(
    party: tauri::State<'_, Arc<PartyServer>>,
) -> Result<(), String> {
    party.stop().await;
    Ok(())
}
