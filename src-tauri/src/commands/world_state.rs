use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

#[tauri::command]
pub fn set_world_state(
    key: String,
    value_json: String,
    category: String,
    visibility: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO world_state (id, campaign_id, key, value_json, category, visibility, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
             ON CONFLICT(campaign_id, key) DO UPDATE SET value_json = ?4, category = ?5, visibility = ?6, updated_at = ?7",
            params![id, campaign_id, key, value_json, category, visibility, now],
        ).map_err(|e| format!("Failed to set world state: {}", e))?;

        Ok(serde_json::json!({
            "key": key,
            "value_json": value_json,
            "category": category,
            "visibility": visibility,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_world_state(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, key, value_json, category, visibility, revealed_at, updated_at FROM world_state WHERE campaign_id = ?1 ORDER BY category, key"
        ).map_err(|e| format!("Failed to query world state: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "key": row.get::<_, String>(1)?,
                "value_json": row.get::<_, String>(2)?,
                "category": row.get::<_, String>(3).unwrap_or_default(),
                "visibility": row.get::<_, String>(4).unwrap_or_else(|_| "dm_only".to_string()),
                "revealed_at": row.get::<_, Option<i64>>(5).unwrap_or(None),
                "updated_at": row.get::<_, i64>(6).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read world state: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn get_world_state_player(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, key, value_json, category, revealed_at, updated_at FROM world_state WHERE campaign_id = ?1 AND visibility = 'players' ORDER BY category, key"
        ).map_err(|e| format!("Failed to query world state: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "key": row.get::<_, String>(1)?,
                "value_json": row.get::<_, String>(2)?,
                "category": row.get::<_, String>(3).unwrap_or_default(),
                "revealed_at": row.get::<_, Option<i64>>(4).unwrap_or(None),
                "updated_at": row.get::<_, i64>(5).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read world state: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn reveal_world_state(
    key: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE world_state SET visibility = 'players', revealed_at = ?1 WHERE campaign_id = ?2 AND key = ?3",
            params![now, campaign_id, key],
        ).map_err(|e| format!("Failed to reveal world state: {}", e))?;

        if rows == 0 {
            return Err("World state entry not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_world_state(
    key: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "DELETE FROM world_state WHERE campaign_id = ?1 AND key = ?2",
            params![campaign_id, key],
        ).map_err(|e| format!("Failed to delete world state: {}", e))?;
        Ok(())
    })
}
