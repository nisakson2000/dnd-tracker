use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

#[tauri::command]
pub fn create_handout(
    title: String,
    content: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO handouts (id, campaign_id, title, content, revealed, revealed_at) VALUES (?1, ?2, ?3, ?4, 0, NULL)",
            params![id, campaign_id, title, content],
        ).map_err(|e| format!("Failed to create handout: {}", e))?;
        Ok(serde_json::json!({"id": id, "title": title}))
    })
}

#[tauri::command]
pub fn list_handouts(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, content, revealed, revealed_at FROM handouts WHERE campaign_id = ?1 ORDER BY title"
        ).map_err(|e| format!("Failed to query handouts: {}", e))?;
        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "content": row.get::<_, String>(2)?,
                "revealed": row.get::<_, i32>(3).unwrap_or(0) != 0,
                "revealed_at": row.get::<_, Option<i64>>(4).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read handouts: {}", e))?
        .filter_map(|r| r.ok()).collect();
        Ok(rows)
    })
}

#[tauri::command]
pub fn reveal_handout(
    handout_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "UPDATE handouts SET revealed = 1, revealed_at = ?1 WHERE id = ?2",
            params![now, handout_id],
        ).map_err(|e| format!("Failed to reveal handout: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn delete_handout(
    handout_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM handouts WHERE id = ?1", params![handout_id])
            .map_err(|e| format!("Failed to delete handout: {}", e))?;
        Ok(())
    })
}
