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
