use rusqlite::params;
use tauri::State;

use crate::campaign_db;
use crate::db::AppState;

/// Ensure the campaign_conn is initialized.
fn ensure_campaign_conn(state: &AppState) -> Result<(), String> {
    let mut conn_guard = state.campaign_conn.lock().map_err(|_| {
        "Campaign database is temporarily busy. Please try again.".to_string()
    })?;
    if conn_guard.is_none() {
        let conn = campaign_db::init_campaign_db(&state.data_dir)?;
        *conn_guard = Some(conn);
    }
    Ok(())
}

fn with_campaign_conn<F, T>(state: &AppState, f: F) -> Result<T, String>
where
    F: FnOnce(&rusqlite::Connection) -> Result<T, String>,
{
    ensure_campaign_conn(state)?;
    let conn_guard = state.campaign_conn.lock().map_err(|_| {
        "Campaign database is temporarily busy. Please try again.".to_string()
    })?;
    let conn = conn_guard.as_ref().ok_or("Campaign database not initialized.".to_string())?;
    f(conn)
}

fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Failed to read active campaign.".to_string()
    })?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

/// Campaign-wide long rest: reset HP, clear temp HP, restore spell slots, clear death saves.
#[tauri::command]
pub fn campaign_long_rest(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let now = chrono::Utc::now().timestamp();
        let mut summary: Vec<String> = Vec::new();

        // Get all players in the campaign
        let mut stmt = conn.prepare(
            "SELECT id, display_name, hp_current, hp_max FROM players WHERE campaign_id = ?1"
        ).map_err(|e| format!("Failed to query players: {}", e))?;

        let players: Vec<(String, String, i64, i64)> = stmt.query_map(params![campaign_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, i64>(2).unwrap_or(0),
                row.get::<_, i64>(3).unwrap_or(0),
            ))
        }).map_err(|e| format!("Failed to read players: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        if players.is_empty() {
            return Err("No players in the active campaign.".to_string());
        }

        for (player_id, display_name, hp_current, hp_max) in &players {
            let mut restored: Vec<String> = Vec::new();

            // Restore HP to max
            if *hp_current < *hp_max {
                restored.push(format!("HP {}/{} -> {}/{}", hp_current, hp_max, hp_max, hp_max));
            }

            // Update player: reset hp, clear temp_hp, clear death saves, clear conditions, restore spell slots
            conn.execute(
                "UPDATE players SET hp_current = hp_max, temp_hp = 0, \
                 death_saves_json = '{\"success\":0,\"fail\":0}', \
                 conditions_json = '[]', \
                 spell_slots_json = '{}' \
                 WHERE id = ?1",
                params![player_id],
            ).map_err(|e| format!("Failed to update player {}: {}", display_name, e))?;

            if restored.is_empty() {
                restored.push("already fully rested".to_string());
            }
            summary.push(format!("{}: {}", display_name, restored.join(", ")));
        }

        // Log to event_log
        let session_id = get_latest_session_id(conn, &campaign_id);
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'long_rest', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"rest_type": "long", "players_restored": summary.len()}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log rest event: {}", e))?;

        Ok(serde_json::json!({
            "status": "long_rest_complete",
            "summary": summary,
            "players_restored": players.len(),
        }))
    })
}

/// Campaign-wide short rest: only resets death saves, keeps HP as-is.
#[tauri::command]
pub fn campaign_short_rest(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let now = chrono::Utc::now().timestamp();
        let mut summary: Vec<String> = Vec::new();

        let mut stmt = conn.prepare(
            "SELECT id, display_name FROM players WHERE campaign_id = ?1"
        ).map_err(|e| format!("Failed to query players: {}", e))?;

        let players: Vec<(String, String)> = stmt.query_map(params![campaign_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
            ))
        }).map_err(|e| format!("Failed to read players: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        if players.is_empty() {
            return Err("No players in the active campaign.".to_string());
        }

        for (player_id, display_name) in &players {
            // Short rest: clear death saves only
            conn.execute(
                "UPDATE players SET death_saves_json = '{\"success\":0,\"fail\":0}' WHERE id = ?1",
                params![player_id],
            ).map_err(|e| format!("Failed to update player {}: {}", display_name, e))?;

            summary.push(format!("{}: death saves reset", display_name));
        }

        // Log to event_log
        let session_id = get_latest_session_id(conn, &campaign_id);
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'short_rest', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"rest_type": "short", "players_count": summary.len()}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log rest event: {}", e))?;

        Ok(serde_json::json!({
            "status": "short_rest_complete",
            "summary": summary,
            "players_count": players.len(),
        }))
    })
}

/// Helper to get the latest session ID for event logging.
fn get_latest_session_id(conn: &rusqlite::Connection, campaign_id: &str) -> String {
    conn.query_row(
        "SELECT session_id FROM event_log WHERE campaign_id = ?1 AND event_type = 'session_start' ORDER BY ts DESC LIMIT 1",
        params![campaign_id],
        |row| row.get::<_, String>(0),
    ).unwrap_or_else(|_| "no_session".to_string())
}
