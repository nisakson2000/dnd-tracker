use rusqlite::params;
use tauri::State;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

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
