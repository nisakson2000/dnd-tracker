use rusqlite::params;
use tauri::State;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

// ── M-16: Inspiration Toggle ──

#[tauri::command]
pub fn toggle_inspiration(
    player_id: String,
    state: State<'_, AppState>,
) -> Result<bool, String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let current: i32 = conn.query_row(
            "SELECT inspiration FROM players WHERE id = ?1 AND campaign_id = ?2",
            params![player_id, campaign_id],
            |row| row.get(0),
        ).map_err(|e| format!("Player not found: {}", e))?;

        let new_val = if current == 0 { 1 } else { 0 };

        conn.execute(
            "UPDATE players SET inspiration = ?1, updated_at = ?2 WHERE id = ?3 AND campaign_id = ?4",
            params![new_val, now, player_id, campaign_id],
        ).map_err(|e| format!("Failed to toggle inspiration: {}", e))?;

        Ok(new_val == 1)
    })
}

// ── M-19: Campaign Settings ──

#[tauri::command]
pub fn get_campaign_setting(
    key: String,
    state: State<'_, AppState>,
) -> Result<Option<String>, String> {
    with_campaign_conn(&state, |conn| {
        let result = conn.query_row(
            "SELECT value FROM settings WHERE key = ?1",
            params![key],
            |row| row.get::<_, String>(0),
        );

        match result {
            Ok(val) => Ok(Some(val)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to read setting: {}", e)),
        }
    })
}

#[tauri::command]
pub fn set_campaign_setting(
    key: String,
    value: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
            params![key, value],
        ).map_err(|e| format!("Failed to save setting: {}", e))?;
        Ok(())
    })
}
