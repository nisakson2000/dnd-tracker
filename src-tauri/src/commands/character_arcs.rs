use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

#[tauri::command]
pub fn create_character_arc(
    character_id: String,
    character_name: String,
    title: String,
    description: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO character_arcs (id, campaign_id, character_id, character_name, title, description, status, resolution, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'active', '', ?7)",
            params![id, campaign_id, character_id, character_name, title, description, now],
        ).map_err(|e| format!("Failed to create character arc: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "character_id": character_id,
            "character_name": character_name,
            "title": title,
            "description": description,
            "status": "active",
            "resolution": "",
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_character_arcs(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, character_id, character_name, title, description, status, resolution, created_at, resolved_at FROM character_arcs WHERE campaign_id = ?1 ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to query character arcs: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "character_id": row.get::<_, String>(1)?,
                "character_name": row.get::<_, String>(2).unwrap_or_default(),
                "title": row.get::<_, String>(3)?,
                "description": row.get::<_, String>(4).unwrap_or_default(),
                "status": row.get::<_, String>(5).unwrap_or_else(|_| "active".to_string()),
                "resolution": row.get::<_, String>(6).unwrap_or_default(),
                "created_at": row.get::<_, i64>(7).unwrap_or(0),
                "resolved_at": row.get::<_, Option<i64>>(8).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read character arcs: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn add_arc_entry(
    arc_id: String,
    session_number: i64,
    description: String,
    entry_type: String,
    npc_involved: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO arc_entries (id, arc_id, session_number, description, entry_type, npc_involved, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![id, arc_id, session_number, description, entry_type, npc_involved, now],
        ).map_err(|e| format!("Failed to add arc entry: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "arc_id": arc_id,
            "session_number": session_number,
            "description": description,
            "entry_type": entry_type,
            "npc_involved": npc_involved,
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_arc_entries(
    arc_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, session_number, description, entry_type, npc_involved, created_at FROM arc_entries WHERE arc_id = ?1 ORDER BY session_number ASC, created_at ASC"
        ).map_err(|e| format!("Failed to query arc entries: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![arc_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "session_number": row.get::<_, i64>(1).unwrap_or(0),
                "description": row.get::<_, String>(2)?,
                "entry_type": row.get::<_, String>(3).unwrap_or_else(|_| "development".to_string()),
                "npc_involved": row.get::<_, String>(4).unwrap_or_default(),
                "created_at": row.get::<_, i64>(5).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read arc entries: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn resolve_arc(
    arc_id: String,
    resolution: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE character_arcs SET status = 'resolved', resolution = ?1, resolved_at = ?2 WHERE id = ?3",
            params![resolution, now, arc_id],
        ).map_err(|e| format!("Failed to resolve arc: {}", e))?;

        if rows == 0 {
            return Err("Character arc not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_character_arc(
    arc_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Delete entries first
        conn.execute("DELETE FROM arc_entries WHERE arc_id = ?1", params![arc_id])
            .map_err(|e| format!("Failed to delete arc entries: {}", e))?;
        conn.execute("DELETE FROM character_arcs WHERE id = ?1", params![arc_id])
            .map_err(|e| format!("Failed to delete character arc: {}", e))?;
        Ok(())
    })
}
