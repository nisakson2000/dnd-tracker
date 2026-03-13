use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_db;
use crate::db::AppState;

/// Ensure the campaign_conn is initialized, lazily opening campaigns.db if needed.
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

#[tauri::command]
pub fn create_campaign(
    name: String,
    description: String,
    ruleset: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaigns (id, name, description, ruleset, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)",
            params![id, name, description, ruleset, now],
        ).map_err(|e| format!("Failed to create campaign: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "name": name,
            "description": description,
            "ruleset": ruleset,
            "created_at": now,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_campaigns(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, ruleset, created_at, updated_at, last_session, active_scene_id FROM campaigns ORDER BY updated_at DESC"
        ).map_err(|e| format!("Failed to query campaigns: {}", e))?;

        let rows = stmt.query_map([], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "ruleset": row.get::<_, String>(3).unwrap_or_else(|_| "dnd5e-2024".to_string()),
                "created_at": row.get::<_, i64>(4)?,
                "updated_at": row.get::<_, Option<i64>>(5).unwrap_or(None),
                "last_session": row.get::<_, Option<i64>>(6).unwrap_or(None),
                "active_scene_id": row.get::<_, Option<String>>(7).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to list campaigns: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read campaign row: {}", e))?);
        }
        Ok(results)
    })
}

#[tauri::command]
pub fn select_campaign(
    campaign_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign = with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, ruleset, created_at, updated_at, last_session, active_scene_id FROM campaigns WHERE id = ?1"
        ).map_err(|e| format!("Failed to query campaign: {}", e))?;

        stmt.query_row(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "ruleset": row.get::<_, String>(3).unwrap_or_else(|_| "dnd5e-2024".to_string()),
                "created_at": row.get::<_, i64>(4)?,
                "updated_at": row.get::<_, Option<i64>>(5).unwrap_or(None),
                "last_session": row.get::<_, Option<i64>>(6).unwrap_or(None),
                "active_scene_id": row.get::<_, Option<String>>(7).unwrap_or(None),
            }))
        }).map_err(|e| format!("Campaign not found: {}", e))
    })?;

    // Set active campaign
    let mut active = state.active_campaign.lock().map_err(|_| {
        "Failed to set active campaign.".to_string()
    })?;
    *active = Some(campaign_id);

    Ok(campaign)
}

#[tauri::command]
pub fn get_active_campaign(
    state: State<'_, AppState>,
) -> Result<Option<String>, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Failed to read active campaign.".to_string()
    })?;
    Ok(active.clone())
}

#[tauri::command]
pub fn delete_campaign(
    campaign_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Delete in dependency order
        conn.execute("DELETE FROM monsters WHERE encounter_id IN (SELECT id FROM encounters WHERE campaign_id = ?1)", params![campaign_id])
            .map_err(|e| format!("Failed to delete monsters: {}", e))?;
        conn.execute("DELETE FROM encounters WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete encounters: {}", e))?;
        conn.execute("DELETE FROM action_buttons WHERE scene_id IN (SELECT id FROM scenes WHERE campaign_id = ?1)", params![campaign_id])
            .map_err(|e| format!("Failed to delete action buttons: {}", e))?;
        conn.execute("DELETE FROM scenes WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete scenes: {}", e))?;
        conn.execute("DELETE FROM players WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete players: {}", e))?;
        conn.execute("DELETE FROM quest_flags WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete quest flags: {}", e))?;
        conn.execute("DELETE FROM event_log WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete event log: {}", e))?;
        conn.execute("DELETE FROM handouts WHERE campaign_id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete handouts: {}", e))?;
        conn.execute("DELETE FROM campaigns WHERE id = ?1", params![campaign_id])
            .map_err(|e| format!("Failed to delete campaign: {}", e))?;

        Ok(())
    })?;

    // Clear active campaign if it was the deleted one
    let mut active = state.active_campaign.lock().map_err(|_| {
        "Failed to update active campaign.".to_string()
    })?;
    if active.as_deref() == Some(&campaign_id) {
        *active = None;
    }

    Ok(())
}

#[tauri::command]
pub fn update_campaign(
    campaign_id: String,
    name: String,
    description: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaigns SET name = ?1, description = ?2, updated_at = ?3 WHERE id = ?4",
            params![name, description, now, campaign_id],
        ).map_err(|e| format!("Failed to update campaign: {}", e))?;

        if rows == 0 {
            return Err("Campaign not found.".to_string());
        }
        Ok(())
    })
}
