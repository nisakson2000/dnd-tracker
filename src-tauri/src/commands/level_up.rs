use rusqlite::params;
use tauri::State;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

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
