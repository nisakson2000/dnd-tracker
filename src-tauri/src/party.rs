use futures_util::{SinkExt, StreamExt};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::{mpsc, oneshot, Mutex, RwLock};
use warp::ws::{Message, WebSocket};
use warp::Filter;

pub const PARTY_PORT: u16 = 8787;
const SAFE_CHARS: &[u8] = b"ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const MAX_ROOM_ATTEMPTS: usize = 100;
const MAX_MESSAGE_SIZE: usize = 65_536; // 64KB per message
const CLIENT_TIMEOUT_SECS: u64 = 90; // Remove clients with no activity after 90s
const CHANNEL_BUFFER_SIZE: usize = 256; // Bounded channel — drops slow clients
const MAX_ROOMS: usize = 50; // Prevent memory exhaustion from room spam
const RATE_LIMIT_MSGS: u32 = 10; // Max messages per second before warning
const RATE_LIMIT_WINDOW: std::time::Duration = std::time::Duration::from_secs(1);

type Tx = mpsc::Sender<Message>;

struct Client {
    tx: Tx,
    room_code: Option<String>,
    character_id: String,
    character: Value,
    last_seen: Instant,
    msg_count: u32,
    msg_window_start: Instant,
    rate_warned: bool,
}

struct Room {
    members: Vec<String>, // client_ids
    host_id: String,
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
        let state3 = self.clone();

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
                eprintln!("[party] Server started on port {}", PARTY_PORT);
                tokio::spawn(server);
                // Start zombie cleanup task
                tokio::spawn(async move {
                    loop {
                        tokio::time::sleep(std::time::Duration::from_secs(30)).await;
                        if !*state3.running.read().await {
                            break;
                        }
                        state3.cleanup_zombies().await;
                    }
                });
                Ok(PARTY_PORT)
            }
            Err(e) => {
                eprintln!("[party] Failed to start server on port {}: {}", PARTY_PORT, e);
                *self.running.write().await = false;
                *self.shutdown.lock().await = None;
                Err(format!(
                    "Failed to start party server on port {}: {}",
                    PARTY_PORT, e
                ))
            }
        }
    }

    pub async fn stop(self: &Arc<Self>) {
        // Send graceful shutdown message to all connected clients
        {
            let clients = self.clients.read().await;
            let msg = Message::text(
                json!({
                    "type": "host_ended",
                    "message": "The host ended the session.",
                    "timestamp": Self::timestamp(),
                })
                .to_string(),
            );
            for client in clients.values() {
                let _ = client.tx.try_send(msg.clone());
            }
        }

        // Small delay so messages can flush
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;

        if let Some(tx) = self.shutdown.lock().await.take() {
            let _ = tx.send(());
        }
        *self.running.write().await = false;
        self.clients.write().await.clear();
        self.rooms.write().await.clear();
    }

    /// Remove clients that haven't sent any message in CLIENT_TIMEOUT_SECS
    async fn cleanup_zombies(self: &Arc<Self>) {
        let now = Instant::now();
        let stale_ids: Vec<String> = {
            let clients = self.clients.read().await;
            clients
                .iter()
                .filter(|(_, c)| now.duration_since(c.last_seen).as_secs() > CLIENT_TIMEOUT_SECS)
                .map(|(id, _)| id.clone())
                .collect()
        };
        for id in stale_ids {
            self.remove_client(&id).await;
        }
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
        if rooms.len() >= MAX_ROOMS {
            eprintln!("[party] Room limit reached ({} rooms), rejecting create request", rooms.len());
            return Err(format!("Server room limit reached (max {}). Try again later.", MAX_ROOMS));
        }
        for _ in 0..MAX_ROOM_ATTEMPTS {
            let code = Self::generate_room_code();
            if !rooms.contains_key(&code) {
                rooms.insert(
                    code.clone(),
                    Room {
                        members: Vec::new(),
                        host_id: String::new(),
                    },
                );
                return Ok(code);
            }
        }
        Err("Could not generate unique room code".to_string())
    }

    async fn add_client(self: &Arc<Self>, client_id: String, tx: Tx) {
        let now = Instant::now();
        self.clients.write().await.insert(
            client_id,
            Client {
                tx,
                room_code: None,
                character_id: String::new(),
                character: json!({}),
                last_seen: now,
                msg_count: 0,
                msg_window_start: now,
                rate_warned: false,
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
            let mut needs_host_reassign = false;
            let mut new_host_id = None;
            {
                let mut rooms = self.rooms.write().await;
                if let Some(room) = rooms.get_mut(code) {
                    room.members.retain(|id| id != client_id);
                    if room.members.is_empty() {
                        should_remove_room = true;
                    } else if room.host_id == client_id {
                        // Reassign host to first remaining member
                        if let Some(first) = room.members.first() {
                            needs_host_reassign = true;
                            room.host_id = first.clone();
                            new_host_id = Some(first.clone());
                        }
                    }
                }
                if should_remove_room {
                    rooms.remove(code);
                }
            }

            if !should_remove_room {
                // Notify room that player disconnected
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

                // Notify new host if host was reassigned
                if needs_host_reassign {
                    if let Some(new_id) = &new_host_id {
                        let clients = self.clients.read().await;
                        if let Some(client) = clients.get(new_id) {
                            let _ = client.tx.try_send(Message::text(
                                json!({
                                    "type": "host_promoted",
                                    "message": "You are now the host",
                                    "timestamp": Self::timestamp(),
                                })
                                .to_string(),
                            ));
                        }
                    }
                }
            }
        }

        self.clients.write().await.remove(client_id);
    }

    fn send_error(client: &Client, message: &str) {
        let _ = client.tx.try_send(Message::text(
            json!({ "type": "error", "message": message, "timestamp": Self::timestamp() })
                .to_string(),
        ));
    }

    async fn handle_join(self: &Arc<Self>, client_id: &str, room: &str, character: Value) {
        // Use a single write lock to check + join atomically
        let room_exists = {
            let mut rooms = self.rooms.write().await;
            if let Some(r) = rooms.get_mut(room) {
                // Add to room while we hold the lock
                if !r.members.contains(&client_id.to_string()) {
                    r.members.push(client_id.to_string());
                }
                if r.host_id.is_empty() {
                    r.host_id = client_id.to_string();
                }
                true
            } else {
                false
            }
        };

        if !room_exists {
            let clients = self.clients.read().await;
            if let Some(client) = clients.get(client_id) {
                Self::send_error(client, "Room not found");
            }
            return;
        }

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
                client.last_seen = Instant::now();
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
                let _ = client.tx.try_send(Message::text(
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

        {
            let mut clients = self.clients.write().await;
            if let Some(client) = clients.get_mut(client_id) {
                client.last_seen = Instant::now();
                if let Some(changes) = event.get("data").and_then(|d| d.as_object()) {
                    if let Some(char_obj) = client.character.as_object_mut() {
                        for (key, val) in changes {
                            char_obj.insert(key.clone(), val.clone());
                        }
                    }
                }
            }
        }

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

    async fn handle_update(self: &Arc<Self>, client_id: &str, character: Value) {
        let room_code = {
            let mut clients = self.clients.write().await;
            if let Some(client) = clients.get_mut(client_id) {
                client.character = character.clone();
                client.last_seen = Instant::now();
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
                Some(client_id), // Exclude sender — prevents echo/state flicker
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

    async fn broadcast_to_room(
        self: &Arc<Self>,
        room: &str,
        msg: &Value,
        exclude: Option<&str>,
    ) {
        let rooms = self.rooms.read().await;
        let clients = self.clients.read().await;
        if let Some(r) = rooms.get(room) {
            let text = msg.to_string();
            for id in &r.members {
                if exclude.map_or(true, |ex| ex != id) {
                    if let Some(client) = clients.get(id) {
                        // Use try_send — if buffer is full, skip this client (they're too slow)
                        let _ = client.tx.try_send(Message::text(text.clone()));
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
    let (tx, mut rx) = mpsc::channel::<Message>(CHANNEL_BUFFER_SIZE);

    state.add_client(client_id.clone(), tx).await;
    eprintln!("[party] Client {} connected", client_id);

    // Forward channel messages to WebSocket
    let forward = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if ws_tx.send(msg).await.is_err() {
                break;
            }
        }
        // Gracefully close the WebSocket when channel closes
        let _ = ws_tx.close().await;
    });

    // Process incoming messages
    while let Some(result) = ws_rx.next().await {
        let msg = match result {
            Ok(m) => m,
            Err(e) => {
                eprintln!("[party] Client {} connection error: {}", client_id, e);
                break;
            }
        };
        if msg.is_text() {
            if let Ok(text) = msg.to_str() {
                if text.len() > MAX_MESSAGE_SIZE {
                    eprintln!("[party] Client {} sent oversized message ({} bytes)", client_id, text.len());
                    let clients = state.clients.read().await;
                    if let Some(client) = clients.get(&client_id) {
                        PartyServer::send_error(client, "Message too large");
                    }
                    continue;
                }

                // Rate limiting check
                {
                    let mut clients = state.clients.write().await;
                    if let Some(client) = clients.get_mut(&client_id) {
                        let now = Instant::now();
                        if now.duration_since(client.msg_window_start) >= RATE_LIMIT_WINDOW {
                            client.msg_count = 0;
                            client.msg_window_start = now;
                            client.rate_warned = false;
                        }
                        client.msg_count += 1;
                        if client.msg_count > RATE_LIMIT_MSGS && !client.rate_warned {
                            client.rate_warned = true;
                            eprintln!("[party] Client {} exceeding rate limit ({} msgs/sec)", client_id, client.msg_count);
                            let _ = client.tx.try_send(Message::text(
                                json!({
                                    "type": "warning",
                                    "message": "Slow down — you are sending messages too quickly",
                                    "timestamp": PartyServer::timestamp(),
                                }).to_string(),
                            ));
                        }
                    }
                }

                let parsed = match serde_json::from_str::<Value>(text) {
                    Ok(v) => v,
                    Err(e) => {
                        eprintln!("[party] Client {} sent malformed JSON: {}", client_id, e);
                        let clients = state.clients.read().await;
                        if let Some(client) = clients.get(&client_id) {
                            PartyServer::send_error(client, "Invalid message format");
                        }
                        continue;
                    }
                };
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
                        Some("event") => {
                            state.handle_event(&client_id, &parsed).await;
                        }
                        Some("update") => {
                            let character =
                                parsed.get("character").cloned().unwrap_or(json!({}));
                            state.handle_update(&client_id, character).await;
                        }
                        Some("bug_report") => {
                            // Broadcast bug reports to ALL clients (including sender)
                            // so dev builds can capture them
                            let room_code = {
                                let clients = state.clients.read().await;
                                clients.get(&client_id).and_then(|c| c.room_code.clone())
                            };
                            if let Some(code) = room_code {
                                let report_data = parsed.get("report").cloned().unwrap_or(json!({}));
                                let reporter = {
                                    let clients = state.clients.read().await;
                                    clients.get(&client_id)
                                        .map(|c| c.character.get("name").and_then(|n| n.as_str()).unwrap_or("Unknown").to_string())
                                        .unwrap_or_else(|| "Unknown".to_string())
                                };
                                state.broadcast_to_room(
                                    &code,
                                    &json!({
                                        "type": "bug_report",
                                        "client_id": client_id,
                                        "reporter": reporter,
                                        "report": report_data,
                                        "timestamp": PartyServer::timestamp(),
                                    }),
                                    None, // Send to everyone including sender
                                ).await;
                            }
                        }
                        Some("ping") => {
                            // Update last_seen timestamp
                            {
                                let mut clients = state.clients.write().await;
                                if let Some(client) = clients.get_mut(&client_id) {
                                    client.last_seen = Instant::now();
                                }
                            }
                            let clients = state.clients.read().await;
                            if let Some(client) = clients.get(&client_id) {
                                let _ = client.tx.try_send(Message::text(
                                    json!({"type": "pong", "timestamp": PartyServer::timestamp()})
                                        .to_string(),
                                ));
                            }
                        }
                        _ => {}
                    }
            }
        } else if msg.is_close() {
            break;
        }
    }

    eprintln!("[party] Client {} disconnected", client_id);
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

/// Create a party room via IPC (bypasses CSP/mixed-content issues in production).
#[tauri::command]
pub async fn create_party_room(
    party: tauri::State<'_, Arc<PartyServer>>,
) -> Result<String, String> {
    party.create_room().await
}

/// Returns the machine's LAN IP so the host can share it with players.
#[tauri::command]
pub fn get_local_ip() -> String {
    use std::net::UdpSocket;
    UdpSocket::bind("0.0.0.0:0")
        .and_then(|s| {
            s.connect("8.8.8.8:80")?;
            s.local_addr()
        })
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|_| "127.0.0.1".to_string())
}
