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

/// Set or clear concentration for a player in the campaign.
#[tauri::command]
pub fn set_concentration(
    character_id: String,
    spell_name: Option<String>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE players SET concentration_spell = ?1 WHERE id = ?2 AND campaign_id = ?3",
            params![spell_name, character_id, campaign_id],
        ).map_err(|e| format!("Failed to set concentration: {}", e))?;

        if rows == 0 {
            return Err(format!("Player '{}' not found in active campaign.", character_id));
        }

        Ok(())
    })
}

/// Check if a character needs a concentration save and return the DC.
/// DC = max(10, damage / 2)
#[tauri::command]
pub fn check_concentration_save(
    character_id: String,
    damage: i32,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let spell: Option<String> = conn.query_row(
            "SELECT concentration_spell FROM players WHERE id = ?1 AND campaign_id = ?2",
            params![character_id, campaign_id],
            |row| row.get(0),
        ).map_err(|e| format!("Failed to query player: {}", e))?;

        match spell {
            Some(ref s) if !s.is_empty() => {
                let dc = std::cmp::max(10, damage / 2);
                Ok(serde_json::json!({
                    "concentrating": true,
                    "spell": s,
                    "dc": dc,
                    "damage_taken": damage,
                    "save_required": true,
                    "save_type": "CON",
                }))
            }
            _ => {
                Ok(serde_json::json!({
                    "concentrating": false,
                    "save_required": false,
                }))
            }
        }
    })
}
