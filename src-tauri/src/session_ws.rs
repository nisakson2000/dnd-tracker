use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, mpsc, Mutex};
use tokio_tungstenite::tungstenite::Message;

pub const SESSION_PORT: u16 = 7878;
const MAX_MESSAGE_SIZE: usize = 131_072; // 128KB

// ── GameEvent enum ───────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type")]
pub enum GameEvent {
    // Player -> DM
    ClientHello {
        player_uuid: String,
        display_name: String,
        character_summary: serde_json::Value,
    },
    CharUpdate {
        player_uuid: String,
        field: String,
        value: serde_json::Value,
    },
    RollBroadcast {
        player_uuid: String,
        expression: String,
        result: Vec<i32>,
        total: i32,
        label: String,
    },
    ConcentrationUpdate {
        player_uuid: String,
        spell: Option<String>,
    },

    // DM -> Players
    FullStateSnapshot {
        campaign_id: String,
        state: serde_json::Value,
    },
    SceneAdvance {
        campaign_id: String,
        scene_id: String,
        scene_name: String,
        phase: String,
    },
    EncounterStart {
        campaign_id: String,
        encounter_id: String,
        initiative_json: String,
    },
    EncounterEnd {
        campaign_id: String,
    },
    TurnAdvance {
        campaign_id: String,
        combatant_id: String,
        round: u32,
    },
    HpDelta {
        campaign_id: String,
        target_id: String,
        delta: i32,
        source: String,
    },
    ConditionApplied {
        campaign_id: String,
        target_id: String,
        condition: String,
        duration: Option<u32>,
    },
    ConditionRemoved {
        campaign_id: String,
        target_id: String,
        condition_name: String,
    },
    QuestFlagSet {
        campaign_id: String,
        flag: String,
        value: String,
    },
    RestCompleted {
        campaign_id: String,
        rest_type: String,
    },
    HandoutRevealed {
        campaign_id: String,
        handout_id: String,
        title: String,
        content: String,
    },
    InspirationAwarded {
        campaign_id: String,
        player_id: String,
    },
    XpAwarded {
        campaign_id: String,
        amount: u32,
        reason: String,
    },
    MonsterKilled {
        campaign_id: String,
        monster_id: String,
        monster_name: String,
    },
    LevelUp {
        campaign_id: String,
        player_id: String,
        player_name: String,
        new_level: i32,
    },
    SessionEnd {
        campaign_id: String,
    },

    // Player -> DM action requests
    ActionRequest {
        request_id: String,
        player_uuid: String,
        action_type: String,
        description: String,
        details: Option<serde_json::Value>,
    },
    // DM -> Player action responses
    ActionApproved {
        request_id: String,
        player_uuid: String,
        dm_note: Option<String>,
    },
    ActionDenied {
        request_id: String,
        player_uuid: String,
        reason: String,
    },

    // DM -> Players: Campaign data sync
    NPCDiscovered {
        campaign_id: String,
        npc_id: String,
        npc_name: String,
        role: String,
        description: String,
    },
    NPCInfoRevealed {
        campaign_id: String,
        npc_id: String,
        npc_name: String,
        info: String,
    },
    WorldStateChanged {
        campaign_id: String,
        key: String,
        value: serde_json::Value,
        category: String,
    },
    QuestRevealed {
        campaign_id: String,
        quest_id: String,
        title: String,
        giver: String,
        description: String,
        objectives: serde_json::Value,
    },
    QuestUpdated {
        campaign_id: String,
        quest_id: String,
        title: String,
        status: String,
        objectives: serde_json::Value,
    },
    SceneRevealed {
        campaign_id: String,
        scene_id: String,
        scene_name: String,
        player_description: String,
        location: String,
        mood: String,
    },
    ArcUpdated {
        campaign_id: String,
        character_id: String,
        arc_title: String,
        status: String,
        latest_entry: Option<String>,
    },

    // DM -> Specific Player
    JoinApproved {
        player_uuid: String,
    },
    JoinDenied {
        player_uuid: String,
        reason: String,
    },

    // Both directions
    ChatMessage {
        sender: String,
        message: String,
        whisper_target: Option<String>,
        timestamp: Option<i64>,
    },
    Ping {},
    Pong {},
}

// ── Pending player waiting for DM approval ───────────────────────────────────

pub struct PendingPlayer {
    pub display_name: String,
    pub _character_summary: serde_json::Value,
    pub sender: mpsc::UnboundedSender<Message>,
}

// ── Client connection for a player-side WS link to a DM ─────────────────────

pub struct ClientConnection {
    pub sender: mpsc::UnboundedSender<Message>,
    pub shutdown_tx: broadcast::Sender<()>,
}

// ── SessionServer ────────────────────────────────────────────────────────────

pub struct SessionServer {
    /// Map of player_uuid -> sender channel (approved clients)
    clients: Arc<Mutex<HashMap<String, mpsc::UnboundedSender<Message>>>>,
    /// Display names for approved clients
    client_names: Arc<Mutex<HashMap<String, String>>>,
    /// Pending join requests (not yet approved)
    pending: Arc<Mutex<HashMap<String, PendingPlayer>>>,
    /// Server shutdown signal
    shutdown_tx: Option<broadcast::Sender<()>>,
    /// Port the server is running on
    pub port: u16,
    /// Recent event buffer for reconnection replay (last 50 events)
    pub event_buffer: Arc<Mutex<Vec<String>>>,
}

impl SessionServer {
    pub fn new() -> Self {
        Self {
            clients: Arc::new(Mutex::new(HashMap::new())),
            client_names: Arc::new(Mutex::new(HashMap::new())),
            pending: Arc::new(Mutex::new(HashMap::new())),
            shutdown_tx: None,
            port: SESSION_PORT,
            event_buffer: Arc::new(Mutex::new(Vec::new())),
        }
    }

    /// Buffer an event for replay on reconnection (keeps last 50)
    pub async fn buffer_event(&self, event_json: &str) {
        let mut buf = self.event_buffer.lock().await;
        buf.push(event_json.to_string());
        if buf.len() > 50 {
            let excess = buf.len() - 50;
            buf.drain(..excess);
        }
    }

    /// Get buffered events for replay
    pub async fn get_buffered_events(&self) -> Vec<String> {
        self.event_buffer.lock().await.clone()
    }

    /// Start the WebSocket server on the given port.
    pub async fn start(&mut self, port: u16, app_handle: AppHandle) -> Result<String, String> {
        if self.shutdown_tx.is_some() {
            return Err("Session server is already running.".to_string());
        }

        self.port = port;
        let addr = format!("0.0.0.0:{}", port);
        let listener = TcpListener::bind(&addr)
            .await
            .map_err(|e| format!("Failed to bind session server on {}: {}", addr, e))?;

        let (shutdown_tx, _) = broadcast::channel::<()>(1);
        self.shutdown_tx = Some(shutdown_tx.clone());

        let clients = self.clients.clone();
        let client_names = self.client_names.clone();
        let pending = self.pending.clone();

        eprintln!("[session_ws] Server started on port {}", port);

        tokio::spawn(async move {
            let mut shutdown_rx = shutdown_tx.subscribe();
            loop {
                tokio::select! {
                    accept_result = listener.accept() => {
                        match accept_result {
                            Ok((stream, peer_addr)) => {
                                eprintln!("[session_ws] New connection from {}", peer_addr);
                                let clients = clients.clone();
                                let client_names = client_names.clone();
                                let pending = pending.clone();
                                let app = app_handle.clone();
                                let mut conn_shutdown = shutdown_tx.subscribe();
                                tokio::spawn(async move {
                                    handle_connection(stream, clients, client_names, pending, app, &mut conn_shutdown).await;
                                });
                            }
                            Err(e) => {
                                eprintln!("[session_ws] Accept error: {}", e);
                            }
                        }
                    }
                    _ = shutdown_rx.recv() => {
                        eprintln!("[session_ws] Server shutting down");
                        break;
                    }
                }
            }
        });

        let ip = get_local_ip();
        Ok(format!("{}:{}", ip, port))
    }

    /// Stop the server and disconnect all clients.
    pub async fn stop(&mut self) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        // Close all client channels
        self.clients.lock().await.clear();
        self.client_names.lock().await.clear();
        // Close all pending channels
        self.pending.lock().await.clear();
        eprintln!("[session_ws] Server stopped");
    }

    /// Broadcast an event to all approved clients.
    pub async fn broadcast(&self, event: &GameEvent) {
        let text = match serde_json::to_string(event) {
            Ok(t) => t,
            Err(e) => {
                eprintln!("[session_ws] Failed to serialize broadcast: {}", e);
                return;
            }
        };
        // Buffer for reconnection replay
        self.buffer_event(&text).await;
        let clients = self.clients.lock().await;
        let msg = Message::Text(text);
        for (uuid, tx) in clients.iter() {
            if tx.send(msg.clone()).is_err() {
                eprintln!("[session_ws] Failed to send to client {}", uuid);
            }
        }
    }

    /// Broadcast raw JSON string to all connected clients (for extensible event types).
    pub async fn broadcast_raw(&self, json: &str) {
        self.buffer_event(json).await;
        let clients = self.clients.lock().await;
        let msg = Message::Text(json.to_string());
        for (uuid, tx) in clients.iter() {
            if tx.send(msg.clone()).is_err() {
                eprintln!("[session_ws] Failed to send raw to client {}", uuid);
            }
        }
    }

    /// Send an event to a specific approved client.
    pub async fn send_to(&self, player_uuid: &str, event: &GameEvent) -> Result<(), String> {
        let text = serde_json::to_string(event)
            .map_err(|e| format!("Failed to serialize event: {}", e))?;
        let clients = self.clients.lock().await;
        if let Some(tx) = clients.get(player_uuid) {
            tx.send(Message::Text(text))
                .map_err(|_| format!("Client {} channel closed", player_uuid))?;
            Ok(())
        } else {
            Err(format!("Client {} not found in approved list", player_uuid))
        }
    }


    /// Approve a pending player: move from pending to clients, send JoinApproved.
    pub async fn approve_player(
        &self,
        player_uuid: &str,
        snapshot: Option<GameEvent>,
    ) -> Result<(), String> {
        let player = {
            let mut pending = self.pending.lock().await;
            pending
                .remove(player_uuid)
                .ok_or_else(|| format!("No pending player with UUID {}", player_uuid))?
        };

        // Send JoinApproved
        let approved = GameEvent::JoinApproved {
            player_uuid: player_uuid.to_string(),
        };
        let text = serde_json::to_string(&approved)
            .map_err(|e| format!("Serialize error: {}", e))?;
        player
            .sender
            .send(Message::Text(text))
            .map_err(|_| "Player channel closed before approval".to_string())?;

        // Send FullStateSnapshot if provided
        if let Some(snap) = snapshot {
            let snap_text = serde_json::to_string(&snap)
                .map_err(|e| format!("Serialize snapshot error: {}", e))?;
            let _ = player.sender.send(Message::Text(snap_text));
        }

        // Move to approved clients — acquire both locks atomically
        {
            let mut clients = self.clients.lock().await;
            let mut names = self.client_names.lock().await;
            clients.insert(player_uuid.to_string(), player.sender);
            names.insert(player_uuid.to_string(), player.display_name);
        }

        Ok(())
    }

    /// Reject a pending player: send JoinDenied, drop.
    pub async fn reject_player(
        &self,
        player_uuid: &str,
        reason: &str,
    ) -> Result<(), String> {
        let player = {
            let mut pending = self.pending.lock().await;
            pending
                .remove(player_uuid)
                .ok_or_else(|| format!("No pending player with UUID {}", player_uuid))?
        };

        let denied = GameEvent::JoinDenied {
            player_uuid: player_uuid.to_string(),
            reason: reason.to_string(),
        };
        let text = serde_json::to_string(&denied)
            .map_err(|e| format!("Serialize error: {}", e))?;
        let _ = player.sender.send(Message::Text(text));
        // Channel will be dropped, closing the connection
        Ok(())
    }

    /// Get info about all connected and pending players as JSON values.
    pub async fn get_all_player_info(&self) -> Vec<serde_json::Value> {
        let mut result = Vec::new();
        {
            let clients = self.clients.lock().await;
            let names = self.client_names.lock().await;
            for uuid in clients.keys() {
                let name = names
                    .get(uuid)
                    .cloned()
                    .unwrap_or_else(|| "Unknown".to_string());
                result.push(serde_json::json!({
                    "player_uuid": uuid,
                    "display_name": name,
                    "status": "connected",
                }));
            }
        }
        {
            let pending = self.pending.lock().await;
            for (uuid, p) in pending.iter() {
                result.push(serde_json::json!({
                    "player_uuid": uuid,
                    "display_name": p.display_name,
                    "status": "pending",
                }));
            }
        }
        result
    }
}

// ── Connection handler ───────────────────────────────────────────────────────

async fn handle_connection(
    stream: TcpStream,
    clients: Arc<Mutex<HashMap<String, mpsc::UnboundedSender<Message>>>>,
    client_names: Arc<Mutex<HashMap<String, String>>>,
    pending: Arc<Mutex<HashMap<String, PendingPlayer>>>,
    app: AppHandle,
    shutdown_rx: &mut broadcast::Receiver<()>,
) {
    let ws_stream = match tokio_tungstenite::accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("[session_ws] WebSocket handshake failed: {}", e);
            return;
        }
    };

    let (mut ws_tx, mut ws_rx) = ws_stream.split();
    let (outgoing_tx, mut outgoing_rx) = mpsc::unbounded_channel::<Message>();

    // Forward outgoing channel to WebSocket sink
    let forward_handle = tokio::spawn(async move {
        while let Some(msg) = outgoing_rx.recv().await {
            if ws_tx.send(msg).await.is_err() {
                break;
            }
        }
        let _ = ws_tx.close().await;
    });

    // Wait for the first message — must be ClientHello
    let player_uuid: String;

    // Use a timeout for the initial handshake
    let hello_result = tokio::time::timeout(std::time::Duration::from_secs(10), ws_rx.next()).await;
    match hello_result {
        Ok(Some(Ok(msg))) => {
            if let Ok(text) = msg.to_text() {
                if text.len() > MAX_MESSAGE_SIZE {
                    eprintln!("[session_ws] Oversized ClientHello, dropping connection");
                    forward_handle.abort();
                    return;
                }
                match serde_json::from_str::<GameEvent>(text) {
                    Ok(GameEvent::ClientHello {
                        player_uuid: uuid,
                        display_name,
                        character_summary,
                    }) => {
                        eprintln!(
                            "[session_ws] ClientHello from {} ({})",
                            display_name, uuid
                        );
                        player_uuid = uuid.clone();

                        // Store as pending
                        {
                            let mut pend = pending.lock().await;
                            pend.insert(
                                uuid.clone(),
                                PendingPlayer {
                                    display_name: display_name.clone(),
                                    _character_summary: character_summary.clone(),
                                    sender: outgoing_tx.clone(),
                                },
                            );
                        }

                        // Emit Tauri event so DM frontend can show approval UI
                        let _ = app.emit(
                            "session-join-request",
                            serde_json::json!({
                                "player_uuid": uuid,
                                "display_name": display_name,
                                "character_summary": character_summary,
                            }),
                        );
                    }
                    _ => {
                        eprintln!("[session_ws] First message was not ClientHello, dropping");
                        forward_handle.abort();
                        return;
                    }
                }
            } else {
                eprintln!("[session_ws] Non-text first message, dropping");
                forward_handle.abort();
                return;
            }
        }
        _ => {
            eprintln!("[session_ws] Handshake timeout or error, dropping");
            forward_handle.abort();
            return;
        }
    }

    // Now listen for subsequent messages. The player may still be pending at this point,
    // but we keep the connection alive. Once approved, messages get forwarded as events.
    loop {
        tokio::select! {
            msg_opt = ws_rx.next() => {
                match msg_opt {
                    Some(Ok(msg)) => {
                        if msg.is_close() {
                            break;
                        }
                        if let Ok(text) = msg.to_text() {
                            if text.len() > MAX_MESSAGE_SIZE {
                                eprintln!("[session_ws] Oversized message from {}", player_uuid);
                                continue;
                            }
                            match serde_json::from_str::<GameEvent>(text) {
                                Ok(GameEvent::Ping {}) => {
                                    let pong = serde_json::to_string(&GameEvent::Pong {})
                                        .unwrap_or_default();
                                    let _ = outgoing_tx.send(Message::Text(pong));
                                }
                                Ok(event) => {
                                    // Only forward events from approved clients
                                    // Hold lock during emit to prevent TOCTOU race
                                    let cl = clients.lock().await;
                                    if cl.contains_key(&player_uuid) {
                                        let _ = app.emit(
                                            "session-game-event",
                                            serde_json::json!({
                                                "from": player_uuid,
                                                "event": event,
                                            }),
                                        );
                                    }
                                    drop(cl);
                                }
                                Err(e) => {
                                    eprintln!("[session_ws] Bad message from {}: {}", player_uuid, e);
                                }
                            }
                        }
                    }
                    Some(Err(e)) => {
                        eprintln!("[session_ws] Connection error from {}: {}", player_uuid, e);
                        break;
                    }
                    None => {
                        break;
                    }
                }
            }
            _ = shutdown_rx.recv() => {
                eprintln!("[session_ws] Connection {} shutting down (server stop)", player_uuid);
                break;
            }
        }
    }

    // Cleanup: remove from pending or clients
    {
        let mut pend = pending.lock().await;
        pend.remove(&player_uuid);
    }
    {
        let mut cl = clients.lock().await;
        cl.remove(&player_uuid);
    }
    {
        let mut names = client_names.lock().await;
        names.remove(&player_uuid);
    }

    let _ = app.emit(
        "session-player-left",
        serde_json::json!({ "player_uuid": player_uuid }),
    );

    eprintln!("[session_ws] Client {} disconnected", player_uuid);
    forward_handle.abort();
}

// ── Player-side client ───────────────────────────────────────────────────────

/// Connect to a DM's session server as a player.
pub async fn connect_to_dm(
    ip: &str,
    port: u16,
    player_uuid: &str,
    display_name: &str,
    character_summary: serde_json::Value,
    app: AppHandle,
) -> Result<ClientConnection, String> {
    let url = format!("ws://{}:{}", ip, port);
    eprintln!("[session_ws] Connecting to DM at {}", url);

    let _ = app.emit(
        "session-connection-status",
        serde_json::json!({ "status": "connecting", "url": url }),
    );

    let (ws_stream, _) = tokio_tungstenite::connect_async(&url)
        .await
        .map_err(|e| format!("Failed to connect to DM: {}", e))?;

    let (mut ws_tx, mut ws_rx) = ws_stream.split();
    let (outgoing_tx, mut outgoing_rx) = mpsc::unbounded_channel::<Message>();
    let (shutdown_tx, _) = broadcast::channel::<()>(1);
    let mut shutdown_rx = shutdown_tx.subscribe();

    // Send ClientHello
    let hello = GameEvent::ClientHello {
        player_uuid: player_uuid.to_string(),
        display_name: display_name.to_string(),
        character_summary,
    };
    let hello_text = serde_json::to_string(&hello)
        .map_err(|e| format!("Failed to serialize ClientHello: {}", e))?;
    ws_tx
        .send(Message::Text(hello_text))
        .await
        .map_err(|e| format!("Failed to send ClientHello: {}", e))?;

    let _ = app.emit(
        "session-connection-status",
        serde_json::json!({ "status": "waiting_approval" }),
    );

    let app_clone = app.clone();

    // Spawn outgoing forwarder
    tokio::spawn(async move {
        while let Some(msg) = outgoing_rx.recv().await {
            if ws_tx.send(msg).await.is_err() {
                break;
            }
        }
        let _ = ws_tx.close().await;
    });

    // Spawn incoming listener
    tokio::spawn(async move {
        loop {
            tokio::select! {
                msg_opt = ws_rx.next() => {
                    match msg_opt {
                        Some(Ok(msg)) => {
                            if msg.is_close() {
                                let _ = app_clone.emit(
                                    "session-connection-status",
                                    serde_json::json!({ "status": "disconnected", "reason": "server_closed" }),
                                );
                                break;
                            }
                            if let Ok(text) = msg.to_text() {
                                match serde_json::from_str::<GameEvent>(text) {
                                    Ok(GameEvent::JoinApproved { .. }) => {
                                        let _ = app_clone.emit(
                                            "session-connection-status",
                                            serde_json::json!({ "status": "connected" }),
                                        );
                                        let _ = app_clone.emit(
                                            "session-game-event",
                                            serde_json::json!({ "from": "dm", "event": { "type": "JoinApproved" } }),
                                        );
                                    }
                                    Ok(GameEvent::JoinDenied { reason, .. }) => {
                                        let _ = app_clone.emit(
                                            "session-connection-status",
                                            serde_json::json!({ "status": "denied", "reason": reason }),
                                        );
                                        break;
                                    }
                                    Ok(GameEvent::Ping {}) => {
                                        // Auto-respond with Pong — not forwarded to frontend
                                    }
                                    Ok(event) => {
                                        let _ = app_clone.emit(
                                            "session-game-event",
                                            serde_json::json!({ "from": "dm", "event": event }),
                                        );
                                    }
                                    Err(e) => {
                                        eprintln!("[session_ws] Bad message from DM: {}", e);
                                    }
                                }
                            }
                        }
                        Some(Err(e)) => {
                            eprintln!("[session_ws] DM connection error: {}", e);
                            let _ = app_clone.emit(
                                "session-connection-status",
                                serde_json::json!({ "status": "disconnected", "reason": format!("{}", e) }),
                            );
                            break;
                        }
                        None => {
                            let _ = app_clone.emit(
                                "session-connection-status",
                                serde_json::json!({ "status": "disconnected", "reason": "stream_ended" }),
                            );
                            break;
                        }
                    }
                }
                _ = shutdown_rx.recv() => {
                    let _ = app_clone.emit(
                        "session-connection-status",
                        serde_json::json!({ "status": "disconnected", "reason": "user_disconnect" }),
                    );
                    break;
                }
            }
        }
    });

    Ok(ClientConnection {
        sender: outgoing_tx,
        shutdown_tx,
    })
}

// ── Utility ──────────────────────────────────────────────────────────────────

fn get_local_ip() -> String {
    use std::net::UdpSocket;
    UdpSocket::bind("0.0.0.0:0")
        .and_then(|s| {
            s.connect("8.8.8.8:80")?;
            s.local_addr()
        })
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|_| "127.0.0.1".to_string())
}
