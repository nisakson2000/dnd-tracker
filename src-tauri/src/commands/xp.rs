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

/// XP thresholds for each level (5e standard)
fn xp_for_level(level: u32) -> u32 {
    match level {
        1 => 0,
        2 => 300,
        3 => 900,
        4 => 2_700,
        5 => 6_500,
        6 => 14_000,
        7 => 23_000,
        8 => 34_000,
        9 => 48_000,
        10 => 64_000,
        11 => 85_000,
        12 => 100_000,
        13 => 120_000,
        14 => 140_000,
        15 => 165_000,
        16 => 195_000,
        17 => 225_000,
        18 => 265_000,
        19 => 305_000,
        20 => 355_000,
        _ => 355_000,
    }
}

#[tauri::command]
pub fn award_xp(
    player_ids: Vec<String>,
    amount: u32,
    reason: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        for player_id in &player_ids {
            conn.execute(
                "UPDATE players SET xp = xp + ?1, updated_at = ?2 WHERE id = ?3 AND campaign_id = ?4",
                params![amount, now, player_id, campaign_id],
            ).map_err(|e| format!("Failed to award XP to {}: {}", player_id, e))?;
        }

        // Log the XP award event
        let session_id = ""; // Will be empty if no active session — that's fine
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'xp_awarded', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({
                    "player_ids": player_ids,
                    "amount": amount,
                    "reason": reason,
                }).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log XP award: {}", e))?;

        Ok(())
    })
}

#[tauri::command]
pub fn get_player_xp(
    player_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT xp, class_level FROM players WHERE id = ?1 AND campaign_id = ?2"
        ).map_err(|e| format!("Failed to query player XP: {}", e))?;

        let result = stmt.query_row(params![player_id, campaign_id], |row| {
            let xp: u32 = row.get::<_, i32>(0).unwrap_or(0) as u32;
            let class_level_str: String = row.get::<_, String>(1).unwrap_or_else(|_| "1".to_string());
            // class_level can be like "Fighter 5" or just "5"
            let current_level: u32 = class_level_str
                .split_whitespace()
                .last()
                .and_then(|s| s.parse().ok())
                .unwrap_or(1);

            let next_level = current_level + 1;
            let next_threshold = xp_for_level(next_level);
            let current_threshold = xp_for_level(current_level);

            Ok(serde_json::json!({
                "xp": xp,
                "current_level": current_level,
                "next_level_xp": next_threshold,
                "current_level_xp": current_threshold,
                "xp_to_next": if next_threshold > xp { next_threshold - xp } else { 0 },
            }))
        }).map_err(|e| format!("Player not found: {}", e))?;

        Ok(result)
    })
}
