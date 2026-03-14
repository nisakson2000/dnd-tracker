use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_db;
use crate::db::AppState;

fn ensure_campaign_conn(state: &AppState) -> Result<(), String> {
    let mut conn_guard = state.campaign_conn.lock().map_err(|_| {
        "Campaign database is temporarily busy.".to_string()
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
        "Campaign database is temporarily busy.".to_string()
    })?;
    let conn = conn_guard.as_ref().ok_or("Campaign database not initialized.".to_string())?;
    f(conn)
}

fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| "Failed to read active campaign.".to_string())?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

#[tauri::command]
pub fn create_campaign_npc(
    name: String,
    role: String,
    race: String,
    location: String,
    description: String,
    dm_notes: String,
    visibility: String,
    disposition: Option<String>,
    disposition_score: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let disposition = disposition.unwrap_or_else(|| "Neutral".to_string());
    let disposition_score = disposition_score.unwrap_or(0);

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_npcs (id, campaign_id, name, role, race, location, description, dm_notes, visibility, known_info_json, status, disposition, disposition_score, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, '[]', 'alive', ?10, ?11, ?12)",
            params![id, campaign_id, name, role, race, location, description, dm_notes, visibility, disposition, disposition_score, now],
        ).map_err(|e| format!("Failed to create campaign NPC: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "name": name,
            "role": role,
            "race": race,
            "location": location,
            "description": description,
            "dm_notes": dm_notes,
            "visibility": visibility,
            "known_info_json": "[]",
            "status": "alive",
            "disposition": disposition,
            "disposition_score": disposition_score,
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_campaign_npcs(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, name, role, race, location, description, dm_notes, visibility, known_info_json, status, created_at, disposition, disposition_score FROM campaign_npcs WHERE campaign_id = ?1 ORDER BY name"
        ).map_err(|e| format!("Failed to query campaign NPCs: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "role": row.get::<_, String>(2).unwrap_or_default(),
                "race": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "dm_notes": row.get::<_, String>(6).unwrap_or_default(),
                "visibility": row.get::<_, String>(7).unwrap_or_else(|_| "dm_only".to_string()),
                "known_info_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "status": row.get::<_, String>(9).unwrap_or_else(|_| "alive".to_string()),
                "created_at": row.get::<_, i64>(10).unwrap_or(0),
                "disposition": row.get::<_, String>(11).unwrap_or_else(|_| "Neutral".to_string()),
                "disposition_score": row.get::<_, i64>(12).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read campaign NPCs: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn list_campaign_npcs_player(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, name, role, race, location, description, visibility, known_info_json, status, disposition FROM campaign_npcs WHERE campaign_id = ?1 AND visibility != 'dm_only' ORDER BY name"
        ).map_err(|e| format!("Failed to query campaign NPCs: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            let raw_disposition = row.get::<_, String>(9).unwrap_or_else(|_| "Neutral".to_string());
            let simplified_disposition = match raw_disposition.as_str() {
                "Hostile" | "Unfriendly" => "Unfriendly",
                "Friendly" | "Allied" => "Friendly",
                _ => "Neutral",
            };
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "role": row.get::<_, String>(2).unwrap_or_default(),
                "race": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "visibility": row.get::<_, String>(6).unwrap_or_else(|_| "discovered".to_string()),
                "known_info_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "status": row.get::<_, String>(8).unwrap_or_else(|_| "alive".to_string()),
                "disposition": simplified_disposition,
            }))
        }).map_err(|e| format!("Failed to read campaign NPCs: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_campaign_npc(
    npc_id: String,
    name: String,
    role: String,
    race: String,
    location: String,
    description: String,
    dm_notes: String,
    visibility: String,
    disposition: Option<String>,
    disposition_score: Option<i64>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let disposition = disposition.unwrap_or_else(|| "Neutral".to_string());
    let disposition_score = disposition_score.unwrap_or(0);

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_npcs SET name = ?1, role = ?2, race = ?3, location = ?4, description = ?5, dm_notes = ?6, visibility = ?7, disposition = ?8, disposition_score = ?9 WHERE id = ?10",
            params![name, role, race, location, description, dm_notes, visibility, disposition, disposition_score, npc_id],
        ).map_err(|e| format!("Failed to update campaign NPC: {}", e))?;

        if rows == 0 {
            return Err("Campaign NPC not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_campaign_npc(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_npcs WHERE id = ?1", params![npc_id])
            .map_err(|e| format!("Failed to delete campaign NPC: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn discover_npc(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_npcs SET visibility = 'discovered' WHERE id = ?1 AND visibility = 'dm_only'",
            params![npc_id],
        ).map_err(|e| format!("Failed to discover NPC: {}", e))?;

        if rows == 0 {
            return Err("NPC not found or already discovered.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn share_npc_info(
    npc_id: String,
    info: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Read current known_info_json
        let current_json: String = conn.query_row(
            "SELECT known_info_json FROM campaign_npcs WHERE id = ?1",
            params![npc_id],
            |row| row.get(0),
        ).map_err(|e| format!("NPC not found: {}", e))?;

        // Parse, append, serialize
        let mut arr: Vec<serde_json::Value> = serde_json::from_str(&current_json)
            .unwrap_or_else(|_| Vec::new());
        arr.push(serde_json::Value::String(info));
        let updated = serde_json::to_string(&arr)
            .map_err(|e| format!("Failed to serialize known info: {}", e))?;

        conn.execute(
            "UPDATE campaign_npcs SET known_info_json = ?1 WHERE id = ?2",
            params![updated, npc_id],
        ).map_err(|e| format!("Failed to update NPC info: {}", e))?;

        Ok(())
    })
}

#[tauri::command]
pub fn update_npc_disposition(
    npc_id: String,
    disposition: String,
    disposition_score: i64,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_npcs SET disposition = ?1, disposition_score = ?2 WHERE id = ?3",
            params![disposition, disposition_score, npc_id],
        ).map_err(|e| format!("Failed to update NPC disposition: {}", e))?;
        if rows == 0 {
            return Err("NPC not found.".to_string());
        }
        Ok(())
    })
}
