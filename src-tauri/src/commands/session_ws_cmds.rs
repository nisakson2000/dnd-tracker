use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use tokio::sync::Mutex;

use crate::session_ws::{ClientConnection, GameEvent, SessionServer, SESSION_PORT};

/// Wrapper type for session server state managed by Tauri.
pub type SessionServerState = Arc<Mutex<Option<SessionServer>>>;
/// Wrapper type for session client state managed by Tauri.
pub type SessionClientState = Arc<Mutex<Option<ClientConnection>>>;

/// Start the WebSocket session server. Returns the LAN IP + port string.
#[tauri::command]
pub async fn ws_start_server(
    port: Option<u16>,
    state: State<'_, SessionServerState>,
    app: AppHandle,
) -> Result<String, String> {
    let mut guard = state.lock().await;
    if guard.is_some() {
        return Err("Session server is already running.".to_string());
    }
    let port = port.unwrap_or(SESSION_PORT);
    let mut server = SessionServer::new();
    let addr = server.start(port, app).await?;
    *guard = Some(server);
    Ok(addr)
}

/// Stop the WebSocket session server.
#[tauri::command]
pub async fn ws_stop_server(
    state: State<'_, SessionServerState>,
) -> Result<(), String> {
    let mut guard = state.lock().await;
    if let Some(ref mut server) = *guard {
        server.stop().await;
    }
    *guard = None;
    Ok(())
}

/// Approve a pending player — moves them from pending to clients, sends JoinApproved + optional FullStateSnapshot.
#[tauri::command]
pub async fn ws_approve_player(
    player_uuid: String,
    snapshot_json: Option<String>,
    state: State<'_, SessionServerState>,
    app: AppHandle,
) -> Result<(), String> {
    let guard = state.lock().await;
    let server = guard
        .as_ref()
        .ok_or("Session server is not running.".to_string())?;

    let snapshot = match snapshot_json {
        Some(json_str) => {
            let event: GameEvent = serde_json::from_str(&json_str)
                .map_err(|e| format!("Invalid snapshot JSON: {}", e))?;
            Some(event)
        }
        None => None,
    };

    server.approve_player(&player_uuid, snapshot).await?;

    let _ = app.emit(
        "session-player-joined",
        serde_json::json!({ "player_uuid": player_uuid }),
    );

    Ok(())
}

/// Reject a pending player — sends JoinDenied, drops connection.
#[tauri::command]
pub async fn ws_reject_player(
    player_uuid: String,
    reason: String,
    state: State<'_, SessionServerState>,
) -> Result<(), String> {
    let guard = state.lock().await;
    let server = guard
        .as_ref()
        .ok_or("Session server is not running.".to_string())?;

    server.reject_player(&player_uuid, &reason).await
}

/// Broadcast any GameEvent to all connected players.
#[tauri::command]
pub async fn ws_broadcast_event(
    event_json: String,
    state: State<'_, SessionServerState>,
) -> Result<(), String> {
    let guard = state.lock().await;
    let server = guard
        .as_ref()
        .ok_or("Session server is not running.".to_string())?;

    let event: GameEvent = serde_json::from_str(&event_json)
        .map_err(|e| format!("Invalid event JSON: {}", e))?;

    server.broadcast(&event).await;
    Ok(())
}

/// Send event to a specific player.
#[tauri::command]
pub async fn ws_send_to_player(
    player_uuid: String,
    event_json: String,
    state: State<'_, SessionServerState>,
) -> Result<(), String> {
    let guard = state.lock().await;
    let server = guard
        .as_ref()
        .ok_or("Session server is not running.".to_string())?;

    let event: GameEvent = serde_json::from_str(&event_json)
        .map_err(|e| format!("Invalid event JSON: {}", e))?;

    server.send_to(&player_uuid, &event).await
}

/// Get list of connected + pending players.
#[tauri::command]
pub async fn ws_get_connected(
    state: State<'_, SessionServerState>,
) -> Result<Vec<serde_json::Value>, String> {
    let guard = state.lock().await;
    let server = guard
        .as_ref()
        .ok_or("Session server is not running.".to_string())?;

    Ok(server.get_all_player_info().await)
}

/// Player-side: connect to DM's WebSocket server, send ClientHello, listen for events.
#[tauri::command]
pub async fn ws_connect_to_dm(
    ip: String,
    port: u16,
    player_uuid: String,
    display_name: String,
    character_summary: String,
    state: State<'_, SessionClientState>,
    app: AppHandle,
) -> Result<(), String> {
    let mut guard = state.lock().await;
    if guard.is_some() {
        return Err("Already connected to a DM session.".to_string());
    }

    let summary: serde_json::Value = serde_json::from_str(&character_summary)
        .map_err(|e| format!("Invalid character_summary JSON: {}", e))?;

    let connection = crate::session_ws::connect_to_dm(
        &ip,
        port,
        &player_uuid,
        &display_name,
        summary,
        app,
    )
    .await?;

    *guard = Some(connection);
    Ok(())
}

/// Player-side: disconnect from DM's session.
#[tauri::command]
pub async fn ws_disconnect_from_dm(
    state: State<'_, SessionClientState>,
) -> Result<(), String> {
    let mut guard = state.lock().await;
    if let Some(conn) = guard.take() {
        let _ = conn.shutdown_tx.send(());
    }
    Ok(())
}

/// Player-side: send a GameEvent to the DM.
#[tauri::command]
pub async fn ws_send_to_dm(
    event_json: String,
    state: State<'_, SessionClientState>,
) -> Result<(), String> {
    let guard = state.lock().await;
    let conn = guard
        .as_ref()
        .ok_or("Not connected to a DM session.".to_string())?;

    let _event: GameEvent = serde_json::from_str(&event_json)
        .map_err(|e| format!("Invalid event JSON: {}", e))?;

    conn.sender
        .send(tokio_tungstenite::tungstenite::Message::Text(event_json))
        .map_err(|_| "Failed to send — connection may be closed.".to_string())?;

    Ok(())
}
