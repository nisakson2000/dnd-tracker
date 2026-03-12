use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tauri::Emitter;
use tokio::net::UdpSocket;
use tokio::sync::{Mutex, RwLock};

const BEACON_PORT: u16 = 8799;
const BEACON_INTERVAL: Duration = Duration::from_secs(3);
const PEER_TIMEOUT: Duration = Duration::from_secs(20);
const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Debug, Clone, Serialize, Deserialize)]
struct BeaconMessage {
    msg_type: String, // "heartbeat" | "update_pushed" | "chat"
    dev_name: String,
    dev_ip: String,
    #[serde(default)]
    version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    commit_message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    chat_text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    active_section: Option<String>,
    #[serde(default)]
    listen_port: Option<u16>,
    /// Random UUID generated per app instance — used for bulletproof self-filtering.
    /// Two machines with the same hostname + IP fallback won't accidentally filter each other.
    #[serde(default)]
    instance_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub dev_name: String,
    pub message: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Serialize)]
pub struct DevPeer {
    pub name: String,
    pub ip: String,
    pub version: String,
    pub last_seen_ms: u64,
    pub active_section: Option<String>,
}

pub struct DevPresence {
    instance_id: String,
    peers: Arc<RwLock<HashMap<String, (DevPeer, Instant)>>>,
    running: Arc<Mutex<bool>>,
    socket: Arc<Mutex<Option<Arc<UdpSocket>>>>,
    local_name: String,
    local_ip: String,
    bound_port: Arc<Mutex<u16>>,
    chat_messages: Arc<RwLock<Vec<ChatMessage>>>,
    active_section: Arc<RwLock<Option<String>>>,
    // Diagnostics
    beacons_sent: Arc<Mutex<u64>>,
    beacons_received: Arc<Mutex<u64>>,
    last_error: Arc<RwLock<Option<String>>>,
}

/// Generate a simple random ID without pulling in uuid crate
fn random_instance_id() -> String {
    use std::time::SystemTime;
    let t = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos();
    let pid = std::process::id();
    format!("{:x}-{:x}", t, pid)
}

impl DevPresence {
    pub fn new() -> Self {
        let local_name = hostname::get()
            .map(|h| h.to_string_lossy().to_string())
            .unwrap_or_else(|_| "unknown".to_string());

        let local_ip = get_local_ip_sync().unwrap_or_else(|| "127.0.0.1".to_string());
        let instance_id = random_instance_id();

        eprintln!("[dev-presence] Init: name={}, ip={}, instance={}", local_name, local_ip, instance_id);

        Self {
            instance_id,
            peers: Arc::new(RwLock::new(HashMap::new())),
            running: Arc::new(Mutex::new(false)),
            socket: Arc::new(Mutex::new(None)),
            local_name,
            local_ip,
            bound_port: Arc::new(Mutex::new(BEACON_PORT)),
            chat_messages: Arc::new(RwLock::new(Vec::new())),
            active_section: Arc::new(RwLock::new(None)),
            beacons_sent: Arc::new(Mutex::new(0)),
            beacons_received: Arc::new(Mutex::new(0)),
            last_error: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn start(&self, app_handle: tauri::AppHandle) -> Result<(), String> {
        let mut running = self.running.lock().await;
        if *running {
            return Ok(());
        }

        // Try primary port, then fallback
        let (socket, actual_port) = match UdpSocket::bind(format!("0.0.0.0:{}", BEACON_PORT)).await {
            Ok(s) => {
                eprintln!("[dev-presence] Bound to port {}", BEACON_PORT);
                (s, BEACON_PORT)
            }
            Err(e) => {
                eprintln!("[dev-presence] Port {} in use, trying {}: {}", BEACON_PORT, BEACON_PORT + 1, e);
                let s = UdpSocket::bind(format!("0.0.0.0:{}", BEACON_PORT + 1))
                    .await
                    .map_err(|e2| {
                        let msg = format!("Failed to bind UDP on port {} or {}: {}", BEACON_PORT, BEACON_PORT + 1, e2);
                        eprintln!("[dev-presence] {}", msg);
                        msg
                    })?;
                eprintln!("[dev-presence] Bound to fallback port {}", BEACON_PORT + 1);
                (s, BEACON_PORT + 1)
            }
        };

        socket.set_broadcast(true).map_err(|e| format!("Failed to enable broadcast: {}", e))?;

        let socket = Arc::new(socket);
        *self.socket.lock().await = Some(socket.clone());
        *self.bound_port.lock().await = actual_port;
        *running = true;

        eprintln!("[dev-presence] Started on port {} — {} ({})", actual_port, self.local_name, self.local_ip);

        // Build broadcast addresses — limited broadcast + subnet broadcast
        let mut broadcast_addrs: Vec<SocketAddr> = vec![
            format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap(),
            format!("255.255.255.255:{}", BEACON_PORT + 1).parse().unwrap(),
        ];

        if let Some(subnet_broadcast) = get_subnet_broadcast(&self.local_ip) {
            for port in [BEACON_PORT, BEACON_PORT + 1] {
                if let Ok(addr) = format!("{}:{}", subnet_broadcast, port).parse::<SocketAddr>() {
                    broadcast_addrs.push(addr);
                }
            }
            eprintln!("[dev-presence] Subnet broadcast: {}", subnet_broadcast);
        }

        // ── Heartbeat sender ────────────────────────────────────────────────
        let send_socket = socket.clone();
        let name = self.local_name.clone();
        let ip = self.local_ip.clone();
        let iid = self.instance_id.clone();
        let running_flag = self.running.clone();
        let active_section_ref = self.active_section.clone();
        let peers_for_sender = self.peers.clone();
        let bound_port_for_sender = actual_port;
        let sent_counter = self.beacons_sent.clone();

        tokio::spawn(async move {
            let mut heartbeat_count: u64 = 0;
            loop {
                {
                    let is_running = running_flag.lock().await;
                    if !*is_running { break; }
                }

                let section = active_section_ref.read().await.clone();

                let msg = BeaconMessage {
                    msg_type: "heartbeat".to_string(),
                    dev_name: name.clone(),
                    dev_ip: ip.clone(),
                    version: Some(APP_VERSION.to_string()),
                    commit_message: None,
                    chat_text: None,
                    active_section: section,
                    listen_port: Some(bound_port_for_sender),
                    instance_id: Some(iid.clone()),
                };

                if let Ok(data) = serde_json::to_vec(&msg) {
                    // 1. Broadcast to all broadcast addresses
                    for addr in &broadcast_addrs {
                        let _ = send_socket.send_to(&data, addr).await;
                    }

                    // 2. Direct unicast to each known peer IP
                    let known_peers = peers_for_sender.read().await;
                    for (_key, (peer, _)) in known_peers.iter() {
                        if peer.ip.starts_with("host-") || peer.ip == "127.0.0.1" {
                            continue;
                        }
                        for port in [BEACON_PORT, BEACON_PORT + 1] {
                            if let Ok(addr) = format!("{}:{}", peer.ip, port).parse::<SocketAddr>() {
                                let _ = send_socket.send_to(&data, addr).await;
                            }
                        }
                    }

                    heartbeat_count += 1;
                    *sent_counter.lock().await = heartbeat_count;
                    if heartbeat_count % 10 == 1 {
                        eprintln!("[dev-presence] heartbeat #{} — {} peer(s)", heartbeat_count, known_peers.len());
                    }
                }

                tokio::time::sleep(BEACON_INTERVAL).await;
            }
        });

        // ── Listener ────────────────────────────────────────────────────────
        let recv_socket = socket.clone();
        let peers = self.peers.clone();
        let my_instance_id = self.instance_id.clone();
        let my_ip = self.local_ip.clone();
        let my_name = self.local_name.clone();
        let running_flag2 = self.running.clone();
        let chat_messages = self.chat_messages.clone();
        let recv_counter = self.beacons_received.clone();
        let last_error = self.last_error.clone();

        tokio::spawn(async move {
            let mut buf = [0u8; 4096];
            let mut recv_count: u64 = 0;
            loop {
                {
                    let is_running = running_flag2.lock().await;
                    if !*is_running { break; }
                }

                match tokio::time::timeout(Duration::from_secs(2), recv_socket.recv_from(&mut buf)).await {
                    Ok(Ok((len, src_addr))) => {
                        if let Ok(msg) = serde_json::from_slice::<BeaconMessage>(&buf[..len]) {
                            // ── Self-filter: use instance_id if available (bulletproof),
                            // fall back to name+ip for older versions ──
                            let is_self = if let Some(ref their_id) = msg.instance_id {
                                *their_id == my_instance_id
                            } else {
                                msg.dev_name == my_name && msg.dev_ip == my_ip
                            };
                            if is_self { continue; }

                            recv_count += 1;
                            *recv_counter.lock().await = recv_count;
                            let peer_version = msg.version.clone().unwrap_or_else(|| "unknown".to_string());

                            // Use actual source IP when self-reported IP is a hostname fallback
                            let peer_ip = if msg.dev_ip.starts_with("host-") {
                                src_addr.ip().to_string()
                            } else {
                                msg.dev_ip.clone()
                            };

                            match msg.msg_type.as_str() {
                                "heartbeat" => {
                                    if recv_count <= 5 || recv_count % 20 == 0 {
                                        eprintln!("[dev-presence] recv #{} heartbeat from {} ({}) v{} via {}", recv_count, msg.dev_name, peer_ip, peer_version, src_addr);
                                    }
                                    let peer = DevPeer {
                                        name: msg.dev_name,
                                        ip: peer_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(peer_ip, (peer, Instant::now()));
                                }
                                "update_pushed" => {
                                    eprintln!("[dev-presence] recv update_pushed from {} — {:?}", msg.dev_name, msg.commit_message);
                                    let payload = serde_json::json!({
                                        "dev_name": msg.dev_name,
                                        "commit_message": msg.commit_message,
                                    });
                                    let _ = app_handle.emit("dev-update-pushed", payload);

                                    let peer = DevPeer {
                                        name: msg.dev_name.clone(),
                                        ip: peer_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(peer_ip, (peer, Instant::now()));
                                }
                                "chat" => {
                                    if let Some(text) = msg.chat_text {
                                        let timestamp = std::time::SystemTime::now()
                                            .duration_since(std::time::UNIX_EPOCH)
                                            .unwrap_or_default()
                                            .as_secs();
                                        let chat_msg = ChatMessage {
                                            dev_name: msg.dev_name.clone(),
                                            message: text,
                                            timestamp,
                                        };
                                        let _ = app_handle.emit("dev-chat-message", &chat_msg);

                                        let mut msgs = chat_messages.write().await;
                                        msgs.push(chat_msg);
                                        if msgs.len() > 200 {
                                            let drain_count = msgs.len() - 200;
                                            msgs.drain(..drain_count);
                                        }
                                    }

                                    let peer = DevPeer {
                                        name: msg.dev_name.clone(),
                                        ip: peer_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(peer_ip, (peer, Instant::now()));
                                }
                                _ => {}
                            }

                            // Cleanup stale peers
                            let now = Instant::now();
                            peers.write().await.retain(|_, (_, last_seen)| {
                                now.duration_since(*last_seen) < PEER_TIMEOUT
                            });
                        }
                    }
                    Ok(Err(e)) => {
                        let err_msg = format!("recv error: {}", e);
                        eprintln!("[dev-presence] {}", err_msg);
                        *last_error.write().await = Some(err_msg);
                    }
                    Err(_) => {} // timeout, just loop
                }
            }
        });

        Ok(())
    }

    pub async fn stop(&self) {
        let mut running = self.running.lock().await;
        *running = false;
        *self.socket.lock().await = None;
        self.peers.write().await.clear();
    }

    pub async fn get_peers(&self) -> Vec<DevPeer> {
        let now = Instant::now();
        let peers = self.peers.read().await;
        peers
            .values()
            .filter(|(_, last_seen)| now.duration_since(*last_seen) < PEER_TIMEOUT)
            .map(|(peer, last_seen)| DevPeer {
                name: peer.name.clone(),
                ip: peer.ip.clone(),
                version: peer.version.clone(),
                last_seen_ms: now.duration_since(*last_seen).as_millis() as u64,
                active_section: peer.active_section.clone(),
            })
            .collect()
    }

    /// Send to all broadcast + direct unicast to known peers
    async fn send_to_all(&self, data: &[u8]) -> Result<(), String> {
        let socket_guard = self.socket.lock().await;
        let socket = socket_guard.as_ref().ok_or("Dev presence not running")?;

        for port in [BEACON_PORT, BEACON_PORT + 1] {
            let addr: SocketAddr = format!("255.255.255.255:{}", port).parse().unwrap();
            let _ = socket.send_to(data, addr).await;
        }

        if let Some(subnet_broadcast) = get_subnet_broadcast(&self.local_ip) {
            for port in [BEACON_PORT, BEACON_PORT + 1] {
                if let Ok(addr) = format!("{}:{}", subnet_broadcast, port).parse::<SocketAddr>() {
                    let _ = socket.send_to(data, addr).await;
                }
            }
        }

        let known_peers = self.peers.read().await;
        for (_key, (peer, _)) in known_peers.iter() {
            if peer.ip.starts_with("host-") || peer.ip == "127.0.0.1" {
                continue;
            }
            for port in [BEACON_PORT, BEACON_PORT + 1] {
                if let Ok(addr) = format!("{}:{}", peer.ip, port).parse::<SocketAddr>() {
                    let _ = socket.send_to(data, addr).await;
                }
            }
        }

        Ok(())
    }

    pub async fn broadcast_update_pushed(&self, commit_message: Option<String>) -> Result<(), String> {
        let section = self.active_section.read().await.clone();
        let bound_port = *self.bound_port.lock().await;

        let msg = BeaconMessage {
            msg_type: "update_pushed".to_string(),
            dev_name: self.local_name.clone(),
            dev_ip: self.local_ip.clone(),
            version: Some(APP_VERSION.to_string()),
            commit_message,
            chat_text: None,
            active_section: section,
            listen_port: Some(bound_port),
            instance_id: Some(self.instance_id.clone()),
        };

        let data = serde_json::to_vec(&msg).map_err(|e| format!("Serialize failed: {}", e))?;
        self.send_to_all(&data).await
    }

    pub async fn send_chat(&self, message: String) -> Result<(), String> {
        let section = self.active_section.read().await.clone();
        let bound_port = *self.bound_port.lock().await;

        let msg = BeaconMessage {
            msg_type: "chat".to_string(),
            dev_name: self.local_name.clone(),
            dev_ip: self.local_ip.clone(),
            version: Some(APP_VERSION.to_string()),
            commit_message: None,
            chat_text: Some(message.clone()),
            active_section: section,
            listen_port: Some(bound_port),
            instance_id: Some(self.instance_id.clone()),
        };

        let data = serde_json::to_vec(&msg).map_err(|e| format!("Serialize failed: {}", e))?;
        self.send_to_all(&data).await?;

        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        let chat_msg = ChatMessage {
            dev_name: self.local_name.clone(),
            message,
            timestamp,
        };
        let mut msgs = self.chat_messages.write().await;
        msgs.push(chat_msg);
        if msgs.len() > 200 {
            let drain_count = msgs.len() - 200;
            msgs.drain(..drain_count);
        }

        Ok(())
    }

    pub async fn get_chat_messages(&self) -> Vec<ChatMessage> {
        self.chat_messages.read().await.clone()
    }

    pub async fn set_active_section(&self, section: Option<String>) {
        *self.active_section.write().await = section;
    }

    /// Return diagnostic info for debugging peer detection issues
    pub async fn diagnostics(&self) -> serde_json::Value {
        let running = *self.running.lock().await;
        let port = *self.bound_port.lock().await;
        let sent = *self.beacons_sent.lock().await;
        let received = *self.beacons_received.lock().await;
        let error = self.last_error.read().await.clone();
        let peer_count = self.peers.read().await.len();

        serde_json::json!({
            "running": running,
            "instance_id": self.instance_id,
            "local_name": self.local_name,
            "local_ip": self.local_ip,
            "bound_port": port,
            "beacons_sent": sent,
            "beacons_received": received,
            "peer_count": peer_count,
            "last_error": error,
            "version": APP_VERSION,
        })
    }
}

fn get_local_ip_sync() -> Option<String> {
    // Primary: probe a public DNS to discover which local interface is used
    if let Ok(socket) = std::net::UdpSocket::bind("0.0.0.0:0") {
        if socket.connect("8.8.8.8:80").is_ok() {
            if let Ok(addr) = socket.local_addr() {
                let ip = addr.ip().to_string();
                if ip != "127.0.0.1" {
                    return Some(ip);
                }
            }
        }
    }

    // Fallback: use hostname to get an IP (works without internet)
    if let Ok(host) = hostname::get() {
        let host_str = host.to_string_lossy().to_string();
        return Some(format!("host-{}", host_str));
    }

    None
}

/// Compute subnet broadcast address from a local IP (assumes /24 subnet).
fn get_subnet_broadcast(local_ip: &str) -> Option<String> {
    if local_ip.starts_with("host-") || local_ip == "127.0.0.1" {
        return None;
    }
    let parts: Vec<&str> = local_ip.split('.').collect();
    if parts.len() == 4 {
        Some(format!("{}.{}.{}.255", parts[0], parts[1], parts[2]))
    } else {
        None
    }
}

// ─── Tauri Commands ──────────────────────────────────────────────────────────

#[tauri::command]
pub async fn start_dev_presence(
    state: tauri::State<'_, DevPresence>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    state.start(app_handle).await
}

#[tauri::command]
pub async fn stop_dev_presence(state: tauri::State<'_, DevPresence>) -> Result<(), String> {
    state.stop().await;
    Ok(())
}

#[tauri::command]
pub async fn get_dev_peers(state: tauri::State<'_, DevPresence>) -> Result<Vec<DevPeer>, String> {
    Ok(state.get_peers().await)
}

#[tauri::command]
pub async fn broadcast_dev_update(
    state: tauri::State<'_, DevPresence>,
    commit_message: Option<String>,
) -> Result<(), String> {
    state.broadcast_update_pushed(commit_message).await
}

#[tauri::command]
pub async fn dev_send_chat(
    state: tauri::State<'_, DevPresence>,
    message: String,
) -> Result<(), String> {
    state.send_chat(message).await
}

#[tauri::command]
pub async fn dev_get_chat_messages(
    state: tauri::State<'_, DevPresence>,
) -> Result<Vec<ChatMessage>, String> {
    Ok(state.get_chat_messages().await)
}

#[tauri::command]
pub async fn dev_set_active_section(
    state: tauri::State<'_, DevPresence>,
    section: Option<String>,
) -> Result<(), String> {
    state.set_active_section(section).await;
    Ok(())
}

#[tauri::command]
pub async fn dev_presence_diagnostics(
    state: tauri::State<'_, DevPresence>,
) -> Result<serde_json::Value, String> {
    Ok(state.diagnostics().await)
}
