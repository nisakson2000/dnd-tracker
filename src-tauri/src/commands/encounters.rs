use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

#[tauri::command]
pub fn create_encounter(
    scene_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Verify scene belongs to active campaign
        let exists: bool = conn.query_row(
            "SELECT COUNT(*) > 0 FROM scenes WHERE id = ?1 AND campaign_id = ?2",
            params![scene_id, campaign_id],
            |row| row.get(0),
        ).unwrap_or(false);

        if !exists {
            return Err("Scene not found in active campaign.".to_string());
        }

        conn.execute(
            "INSERT INTO encounters (id, scene_id, campaign_id, status, round, initiative_json, created_at) VALUES (?1, ?2, ?3, 'pending', 0, '[]', ?4)",
            params![id, scene_id, campaign_id, now],
        ).map_err(|e| format!("Failed to create encounter: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "scene_id": scene_id,
            "campaign_id": campaign_id,
            "status": "pending",
            "round": 0,
            "initiative_json": "[]",
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_encounter(
    encounter_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, scene_id, campaign_id, status, round, initiative_json, created_at FROM encounters WHERE id = ?1"
        ).map_err(|e| format!("Failed to query encounter: {}", e))?;

        stmt.query_row(params![encounter_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "scene_id": row.get::<_, String>(1)?,
                "campaign_id": row.get::<_, String>(2)?,
                "status": row.get::<_, String>(3).unwrap_or_else(|_| "pending".to_string()),
                "round": row.get::<_, i64>(4).unwrap_or(0),
                "initiative_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "created_at": row.get::<_, i64>(6)?,
            }))
        }).map_err(|e| format!("Encounter not found: {}", e))
    })
}

#[tauri::command]
pub fn start_encounter(
    encounter_id: String,
    initiative_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE encounters SET status = 'active', initiative_json = ?1, round = 1 WHERE id = ?2",
            params![initiative_json, encounter_id],
        ).map_err(|e| format!("Failed to start encounter: {}", e))?;

        if rows == 0 {
            return Err("Encounter not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn end_encounter(
    encounter_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE encounters SET status = 'done' WHERE id = ?1",
            params![encounter_id],
        ).map_err(|e| format!("Failed to end encounter: {}", e))?;

        if rows == 0 {
            return Err("Encounter not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn advance_turn(
    encounter_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        // Get current initiative state
        let (initiative_json, current_round): (String, i64) = conn.query_row(
            "SELECT initiative_json, round FROM encounters WHERE id = ?1 AND status = 'active'",
            params![encounter_id],
            |row| Ok((
                row.get::<_, String>(0).unwrap_or_else(|_| "[]".to_string()),
                row.get::<_, i64>(1).unwrap_or(1),
            )),
        ).map_err(|e| format!("Active encounter not found: {}", e))?;

        // Parse initiative order
        let initiative: Vec<serde_json::Value> = serde_json::from_str(&initiative_json)
            .unwrap_or_default();

        if initiative.is_empty() {
            return Err("No combatants in initiative order.".to_string());
        }

        // Find current turn index and advance
        let current_idx = initiative.iter().position(|entry| {
            entry.get("active").and_then(|v| v.as_bool()).unwrap_or(false)
        }).unwrap_or(0);

        let next_idx = (current_idx + 1) % initiative.len();
        let new_round = if next_idx == 0 { current_round + 1 } else { current_round };

        // Update active flags
        let mut new_initiative = initiative.clone();
        for (i, entry) in new_initiative.iter_mut().enumerate() {
            if let Some(obj) = entry.as_object_mut() {
                obj.insert("active".to_string(), serde_json::Value::Bool(i == next_idx));
            }
        }

        let new_initiative_json = serde_json::to_string(&new_initiative)
            .map_err(|e| format!("Failed to serialize initiative: {}", e))?;

        conn.execute(
            "UPDATE encounters SET initiative_json = ?1, round = ?2 WHERE id = ?3",
            params![new_initiative_json, new_round, encounter_id],
        ).map_err(|e| format!("Failed to advance turn: {}", e))?;

        Ok(serde_json::json!({
            "round": new_round,
            "current_index": next_idx,
            "initiative_json": new_initiative_json,
        }))
    })
}

#[tauri::command]
pub fn update_initiative(
    encounter_id: String,
    initiative_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE encounters SET initiative_json = ?1 WHERE id = ?2",
            params![initiative_json, encounter_id],
        ).map_err(|e| format!("Failed to update initiative: {}", e))?;

        if rows == 0 {
            return Err("Encounter not found.".to_string());
        }
        Ok(())
    })
}
