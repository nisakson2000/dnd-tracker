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
pub fn create_campaign_quest(
    title: String,
    giver: String,
    description: String,
    objectives_json: String,
    reward_xp: i64,
    reward_gold: i64,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_quests (id, campaign_id, title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, 'hidden', 'dm_only', ?6, ?7, ?8, ?9)",
            params![id, campaign_id, title, giver, description, objectives_json, reward_xp, reward_gold, now],
        ).map_err(|e| format!("Failed to create campaign quest: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "title": title,
            "giver": giver,
            "description": description,
            "status": "hidden",
            "visibility": "dm_only",
            "objectives_json": objectives_json,
            "reward_xp": reward_xp,
            "reward_gold": reward_gold,
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_campaign_quests(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, reward_items_json, parent_quest_id, linked_arc_id, created_at, completed_at FROM campaign_quests WHERE campaign_id = ?1 ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to query campaign quests: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "giver": row.get::<_, String>(2).unwrap_or_default(),
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "status": row.get::<_, String>(4).unwrap_or_else(|_| "hidden".to_string()),
                "visibility": row.get::<_, String>(5).unwrap_or_else(|_| "dm_only".to_string()),
                "objectives_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "reward_xp": row.get::<_, i64>(7).unwrap_or(0),
                "reward_gold": row.get::<_, i64>(8).unwrap_or(0),
                "reward_items_json": row.get::<_, String>(9).unwrap_or_else(|_| "[]".to_string()),
                "parent_quest_id": row.get::<_, Option<String>>(10).unwrap_or(None),
                "linked_arc_id": row.get::<_, Option<String>>(11).unwrap_or(None),
                "created_at": row.get::<_, i64>(12).unwrap_or(0),
                "completed_at": row.get::<_, Option<i64>>(13).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read campaign quests: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn list_campaign_quests_player(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, giver, description, status, objectives_json, reward_xp, reward_gold, completed_at FROM campaign_quests WHERE campaign_id = ?1 AND status != 'hidden' AND visibility != 'dm_only' ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to query campaign quests: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "giver": row.get::<_, String>(2).unwrap_or_default(),
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "status": row.get::<_, String>(4).unwrap_or_else(|_| "active".to_string()),
                "objectives_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "reward_xp": row.get::<_, i64>(6).unwrap_or(0),
                "reward_gold": row.get::<_, i64>(7).unwrap_or(0),
                "completed_at": row.get::<_, Option<i64>>(8).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read campaign quests: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_campaign_quest(
    quest_id: String,
    title: String,
    giver: String,
    description: String,
    status: String,
    visibility: String,
    objectives_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_quests SET title = ?1, giver = ?2, description = ?3, status = ?4, visibility = ?5, objectives_json = ?6 WHERE id = ?7",
            params![title, giver, description, status, visibility, objectives_json, quest_id],
        ).map_err(|e| format!("Failed to update campaign quest: {}", e))?;

        if rows == 0 {
            return Err("Campaign quest not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_campaign_quest(
    quest_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_quests WHERE id = ?1", params![quest_id])
            .map_err(|e| format!("Failed to delete campaign quest: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn complete_quest_objective(
    quest_id: String,
    objective_index: usize,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Read current objectives
        let current_json: String = conn.query_row(
            "SELECT objectives_json FROM campaign_quests WHERE id = ?1",
            params![quest_id],
            |row| row.get(0),
        ).map_err(|e| format!("Quest not found: {}", e))?;

        // Parse, mark objective complete, serialize
        let mut objectives: Vec<serde_json::Value> = serde_json::from_str(&current_json)
            .unwrap_or_else(|_| Vec::new());

        if objective_index >= objectives.len() {
            return Err("Objective index out of range.".to_string());
        }

        // Mark the objective as completed (set "completed" field to true)
        if let Some(obj) = objectives.get_mut(objective_index) {
            if let Some(map) = obj.as_object_mut() {
                map.insert("completed".to_string(), serde_json::Value::Bool(true));
            }
        }

        let updated = serde_json::to_string(&objectives)
            .map_err(|e| format!("Failed to serialize objectives: {}", e))?;

        conn.execute(
            "UPDATE campaign_quests SET objectives_json = ?1 WHERE id = ?2",
            params![updated, quest_id],
        ).map_err(|e| format!("Failed to update quest objectives: {}", e))?;

        Ok(())
    })
}
