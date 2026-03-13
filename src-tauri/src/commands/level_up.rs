use rusqlite::params;
use tauri::State;

use crate::campaign_db;
use crate::db::AppState;

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

#[tauri::command]
pub fn campaign_level_up(
    player_id: String,
    new_level: i32,
    hp_increase: i32,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Get current player data for the event log
        let display_name: String = conn.query_row(
            "SELECT display_name FROM players WHERE id = ?1 AND campaign_id = ?2",
            params![player_id, campaign_id],
            |row| row.get(0),
        ).unwrap_or_else(|_| "Unknown".to_string());

        // Update player level and HP
        conn.execute(
            "UPDATE players SET class_level = ?1, hp_max = hp_max + ?2, hp_current = hp_current + ?2, updated_at = ?3 WHERE id = ?4 AND campaign_id = ?5",
            params![new_level.to_string(), hp_increase, now, player_id, campaign_id],
        ).map_err(|e| format!("Failed to level up player: {}", e))?;

        // Log the level up event
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'level_up', ?2, '', ?3)",
            params![
                campaign_id,
                serde_json::json!({
                    "player_id": player_id,
                    "player": display_name,
                    "new_level": new_level,
                    "hp_increase": hp_increase,
                }).to_string(),
                now,
            ],
        ).map_err(|e| format!("Failed to log level up: {}", e))?;

        Ok(serde_json::json!({
            "player_id": player_id,
            "player_name": display_name,
            "new_level": new_level,
            "hp_increase": hp_increase,
        }))
    })
}
