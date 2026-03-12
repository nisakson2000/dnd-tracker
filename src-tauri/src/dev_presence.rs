use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tauri::Emitter;
use tokio::net::UdpSocket;
use tokio::sync::{Mutex, RwLock};

const BEACON_PORT: u16 = 8799;
const BEACON_INTERVAL: Duration = Duration::from_secs(5);
const PEER_TIMEOUT: Duration = Duration::from_secs(15);
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
    peers: Arc<RwLock<HashMap<String, (DevPeer, Instant)>>>,
    running: Arc<Mutex<bool>>,
    socket: Arc<Mutex<Option<Arc<UdpSocket>>>>,
    local_name: String,
    local_ip: String,
    chat_messages: Arc<RwLock<Vec<ChatMessage>>>,
    active_section: Arc<RwLock<Option<String>>>,
}

impl DevPresence {
    pub fn new() -> Self {
        let local_name = hostname::get()
            .map(|h| h.to_string_lossy().to_string())
            .unwrap_or_else(|_| "unknown".to_string());

        let local_ip = get_local_ip_sync().unwrap_or_else(|| "127.0.0.1".to_string());

        Self {
            peers: Arc::new(RwLock::new(HashMap::new())),
            running: Arc::new(Mutex::new(false)),
            socket: Arc::new(Mutex::new(None)),
            local_name,
            local_ip,
            chat_messages: Arc::new(RwLock::new(Vec::new())),
            active_section: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn start(&self, app_handle: tauri::AppHandle) -> Result<(), String> {
        let mut running = self.running.lock().await;
        if *running {
            return Ok(());
        }

        let socket = UdpSocket::bind(format!("0.0.0.0:{}", BEACON_PORT))
            .await
            .map_err(|e| format!("Failed to bind UDP socket on port {}: {}", BEACON_PORT, e))?;

        socket.set_broadcast(true).map_err(|e| format!("Failed to enable broadcast: {}", e))?;

        let socket = Arc::new(socket);
        *self.socket.lock().await = Some(socket.clone());
        *running = true;

        // Spawn heartbeat sender
        let send_socket = socket.clone();
        let name = self.local_name.clone();
        let ip = self.local_ip.clone();
        let running_flag = self.running.clone();
        let active_section_ref = self.active_section.clone();

        tokio::spawn(async move {
            let broadcast_addr: SocketAddr = format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap();
            loop {
                {
                    let is_running = running_flag.lock().await;
                    if !*is_running {
                        break;
                    }
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
                };

                if let Ok(data) = serde_json::to_vec(&msg) {
                    let _ = send_socket.send_to(&data, broadcast_addr).await;
                }

                tokio::time::sleep(BEACON_INTERVAL).await;
            }
        });

        // Spawn listener
        let recv_socket = socket.clone();
        let peers = self.peers.clone();
        let my_ip = self.local_ip.clone();
        let running_flag2 = self.running.clone();
        let chat_messages = self.chat_messages.clone();

        tokio::spawn(async move {
            let mut buf = [0u8; 4096];
            loop {
                {
                    let is_running = running_flag2.lock().await;
                    if !*is_running {
                        break;
                    }
                }

                match tokio::time::timeout(Duration::from_secs(2), recv_socket.recv_from(&mut buf)).await {
                    Ok(Ok((len, _addr))) => {
                        if let Ok(msg) = serde_json::from_slice::<BeaconMessage>(&buf[..len]) {
                            // Skip our own messages
                            if msg.dev_ip == my_ip {
                                continue;
                            }

                            let peer_version = msg.version.clone().unwrap_or_else(|| "unknown".to_string());

                            match msg.msg_type.as_str() {
                                "heartbeat" => {
                                    let peer = DevPeer {
                                        name: msg.dev_name,
                                        ip: msg.dev_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(msg.dev_ip, (peer, Instant::now()));
                                }
                                "update_pushed" => {
                                    // Another dev pushed — emit Tauri event so frontend
                                    // can immediately trigger a git check
                                    let payload = serde_json::json!({
                                        "dev_name": msg.dev_name,
                                        "commit_message": msg.commit_message,
                                    });
                                    let _ = app_handle.emit("dev-update-pushed", payload);

                                    // Also update peer presence
                                    let peer = DevPeer {
                                        name: msg.dev_name.clone(),
                                        ip: msg.dev_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(msg.dev_ip, (peer, Instant::now()));
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

                                        // Emit Tauri event for instant frontend update
                                        let _ = app_handle.emit("dev-chat-message", &chat_msg);

                                        // Store in buffer
                                        let mut msgs = chat_messages.write().await;
                                        msgs.push(chat_msg);
                                        // Keep last 200 messages
                                        if msgs.len() > 200 {
                                            let drain_count = msgs.len() - 200;
                                            msgs.drain(..drain_count);
                                        }
                                    }

                                    // Also update peer presence
                                    let peer = DevPeer {
                                        name: msg.dev_name.clone(),
                                        ip: msg.dev_ip.clone(),
                                        version: peer_version,
                                        last_seen_ms: 0,
                                        active_section: msg.active_section,
                                    };
                                    peers.write().await.insert(msg.dev_ip, (peer, Instant::now()));
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
                    Ok(Err(_)) => {}
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

    pub async fn broadcast_update_pushed(&self, commit_message: Option<String>) -> Result<(), String> {
        let socket_guard = self.socket.lock().await;
        let socket = socket_guard.as_ref().ok_or("Dev presence not running")?;

        let section = self.active_section.read().await.clone();

        let msg = BeaconMessage {
            msg_type: "update_pushed".to_string(),
            dev_name: self.local_name.clone(),
            dev_ip: self.local_ip.clone(),
            version: Some(APP_VERSION.to_string()),
            commit_message,
            chat_text: None,
            active_section: section,
        };

        let data = serde_json::to_vec(&msg).map_err(|e| format!("Serialize failed: {}", e))?;
        let broadcast_addr: SocketAddr = format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap();

        socket
            .send_to(&data, broadcast_addr)
            .await
            .map_err(|e| format!("Broadcast failed: {}", e))?;

        Ok(())
    }

    pub async fn send_chat(&self, message: String) -> Result<(), String> {
        let socket_guard = self.socket.lock().await;
        let socket = socket_guard.as_ref().ok_or("Dev presence not running")?;

        let section = self.active_section.read().await.clone();

        let msg = BeaconMessage {
            msg_type: "chat".to_string(),
            dev_name: self.local_name.clone(),
            dev_ip: self.local_ip.clone(),
            version: Some(APP_VERSION.to_string()),
            commit_message: None,
            chat_text: Some(message.clone()),
            active_section: section,
        };

        let data = serde_json::to_vec(&msg).map_err(|e| format!("Serialize failed: {}", e))?;
        let broadcast_addr: SocketAddr = format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap();

        socket
            .send_to(&data, broadcast_addr)
            .await
            .map_err(|e| format!("Broadcast failed: {}", e))?;

        // Also store our own message locally
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
        let mut s = self.active_section.write().await;
        *s = section;
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
        // Use the hostname as a unique identifier even if we can't get the IP
        // This prevents two devs from both getting 127.0.0.1 and filtering each other
        return Some(format!("host-{}", host_str));
    }

    None
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
