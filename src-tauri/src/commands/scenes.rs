use rusqlite::params;
use tauri::State;
use uuid::Uuid;

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

/// Helper: execute a closure with the campaign connection.
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

/// Get the active campaign ID or return an error.
fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Failed to read active campaign.".to_string()
    })?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

#[tauri::command]
pub fn create_scene(
    name: String,
    description: String,
    location: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();

    with_campaign_conn(&state, |conn| {
        // Get next sort_order
        let sort_order: i64 = conn.query_row(
            "SELECT COALESCE(MAX(sort_order), -1) + 1 FROM scenes WHERE campaign_id = ?1",
            params![campaign_id],
            |row| row.get(0),
        ).unwrap_or(0);

        conn.execute(
            "INSERT INTO scenes (id, campaign_id, name, description, location, sort_order, player_visible, player_description, mood) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, '', '')",
            params![id, campaign_id, name, description, location, sort_order],
        ).map_err(|e| format!("Failed to create scene: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "name": name,
            "description": description,
            "location": location,
            "phase": "exploration",
            "dm_notes": "",
            "sort_order": sort_order,
            "completed": 0,
            "player_visible": 0,
            "player_description": "",
            "mood": "",
        }))
    })
}

#[tauri::command]
pub fn list_scenes(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, campaign_id, name, description, location, phase, dm_notes, sort_order, completed, player_visible, player_description, mood FROM scenes WHERE campaign_id = ?1 ORDER BY sort_order ASC"
        ).map_err(|e| format!("Failed to query scenes: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "campaign_id": row.get::<_, String>(1)?,
                "name": row.get::<_, String>(2)?,
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "phase": row.get::<_, String>(5).unwrap_or_else(|_| "exploration".to_string()),
                "dm_notes": row.get::<_, String>(6).unwrap_or_default(),
                "sort_order": row.get::<_, i64>(7).unwrap_or(0),
                "completed": row.get::<_, i64>(8).unwrap_or(0),
                "player_visible": row.get::<_, i64>(9).unwrap_or(0),
                "player_description": row.get::<_, String>(10).unwrap_or_default(),
                "mood": row.get::<_, String>(11).unwrap_or_default(),
            }))
        }).map_err(|e| format!("Failed to list scenes: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read scene row: {}", e))?);
        }
        Ok(results)
    })
}

#[tauri::command]
pub fn update_scene(
    scene_id: String,
    name: String,
    description: String,
    location: String,
    phase: String,
    dm_notes: String,
    player_description: String,
    mood: String,
    player_visible: bool,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let visible_int: i64 = if player_visible { 1 } else { 0 };
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE scenes SET name = ?1, description = ?2, location = ?3, phase = ?4, dm_notes = ?5, player_description = ?6, mood = ?7, player_visible = ?8 WHERE id = ?9",
            params![name, description, location, phase, dm_notes, player_description, mood, visible_int, scene_id],
        ).map_err(|e| format!("Failed to update scene: {}", e))?;

        if rows == 0 {
            return Err("Scene not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn list_scenes_player(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, campaign_id, name, player_description, location, phase, sort_order, completed, mood FROM scenes WHERE campaign_id = ?1 AND player_visible = 1 ORDER BY sort_order ASC"
        ).map_err(|e| format!("Failed to query scenes: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "campaign_id": row.get::<_, String>(1)?,
                "name": row.get::<_, String>(2)?,
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "phase": row.get::<_, String>(5).unwrap_or_else(|_| "exploration".to_string()),
                "sort_order": row.get::<_, i64>(6).unwrap_or(0),
                "completed": row.get::<_, i64>(7).unwrap_or(0),
                "mood": row.get::<_, String>(8).unwrap_or_default(),
            }))
        }).map_err(|e| format!("Failed to list player scenes: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read scene row: {}", e))?);
        }
        Ok(results)
    })
}

#[tauri::command]
pub fn delete_scene(
    scene_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Delete dependent data first
        conn.execute(
            "DELETE FROM monsters WHERE encounter_id IN (SELECT id FROM encounters WHERE scene_id = ?1)",
            params![scene_id],
        ).map_err(|e| format!("Failed to delete scene monsters: {}", e))?;
        conn.execute("DELETE FROM encounters WHERE scene_id = ?1", params![scene_id])
            .map_err(|e| format!("Failed to delete scene encounters: {}", e))?;
        conn.execute("DELETE FROM action_buttons WHERE scene_id = ?1", params![scene_id])
            .map_err(|e| format!("Failed to delete scene action buttons: {}", e))?;
        conn.execute("DELETE FROM scenes WHERE id = ?1", params![scene_id])
            .map_err(|e| format!("Failed to delete scene: {}", e))?;

        Ok(())
    })
}

#[tauri::command]
pub fn reorder_scenes(
    scene_ids: Vec<String>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        for (i, scene_id) in scene_ids.iter().enumerate() {
            conn.execute(
                "UPDATE scenes SET sort_order = ?1 WHERE id = ?2",
                params![i as i64, scene_id],
            ).map_err(|e| format!("Failed to reorder scene: {}", e))?;
        }
        Ok(())
    })
}

#[tauri::command]
pub fn advance_scene(
    scene_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Verify scene exists and belongs to campaign
        let exists: bool = conn.query_row(
            "SELECT COUNT(*) > 0 FROM scenes WHERE id = ?1 AND campaign_id = ?2",
            params![scene_id, campaign_id],
            |row| row.get(0),
        ).unwrap_or(false);

        if !exists {
            return Err("Scene not found in active campaign.".to_string());
        }

        conn.execute(
            "UPDATE campaigns SET active_scene_id = ?1, updated_at = ?2 WHERE id = ?3",
            params![scene_id, now, campaign_id],
        ).map_err(|e| format!("Failed to advance scene: {}", e))?;

        Ok(())
    })
}
