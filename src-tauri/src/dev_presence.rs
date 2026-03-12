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
    msg_type: String, // "heartbeat" | "update_pushed"
    dev_name: String,
    dev_ip: String,
    #[serde(default)]
    version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    commit_message: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DevPeer {
    pub name: String,
    pub ip: String,
    pub version: String,
    pub last_seen_ms: u64,
}

pub struct DevPresence {
    peers: Arc<RwLock<HashMap<String, (DevPeer, Instant)>>>,
    running: Arc<Mutex<bool>>,
    socket: Arc<Mutex<Option<Arc<UdpSocket>>>>,
    local_name: String,
    local_ip: String,
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

        tokio::spawn(async move {
            let broadcast_addr: SocketAddr = format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap();
            loop {
                {
                    let is_running = running_flag.lock().await;
                    if !*is_running {
                        break;
                    }
                }

                let msg = BeaconMessage {
                    msg_type: "heartbeat".to_string(),
                    dev_name: name.clone(),
                    dev_ip: ip.clone(),
                    version: Some(APP_VERSION.to_string()),
                    commit_message: None,
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

        tokio::spawn(async move {
            let mut buf = [0u8; 2048];
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
            })
            .collect()
    }

    pub async fn broadcast_update_pushed(&self, commit_message: Option<String>) -> Result<(), String> {
        let socket_guard = self.socket.lock().await;
        let socket = socket_guard.as_ref().ok_or("Dev presence not running")?;

        let msg = BeaconMessage {
            msg_type: "update_pushed".to_string(),
            dev_name: self.local_name.clone(),
            dev_ip: self.local_ip.clone(),
            version: Some(APP_VERSION.to_string()),
            commit_message,
        };

        let data = serde_json::to_vec(&msg).map_err(|e| format!("Serialize failed: {}", e))?;
        let broadcast_addr: SocketAddr = format!("255.255.255.255:{}", BEACON_PORT).parse().unwrap();

        socket
            .send_to(&data, broadcast_addr)
            .await
            .map_err(|e| format!("Broadcast failed: {}", e))?;

        Ok(())
    }
}

fn get_local_ip_sync() -> Option<String> {
    let socket = std::net::UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    socket.local_addr().ok().map(|a| a.ip().to_string())
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
