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
    campaign_type: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let ctype = campaign_type.unwrap_or_else(|| "homebrew".to_string());

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaigns (id, name, description, ruleset, campaign_type, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)",
            params![id, name, description, ruleset, ctype, now],
        ).map_err(|e| format!("Failed to create campaign: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "name": name,
            "description": description,
            "ruleset": ruleset,
            "campaign_type": ctype,
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
            "SELECT id, name, description, ruleset, created_at, updated_at, last_session, active_scene_id, campaign_type FROM campaigns ORDER BY updated_at DESC"
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
                "campaign_type": row.get::<_, String>(8).unwrap_or_else(|_| "homebrew".to_string()),
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
            "SELECT id, name, description, ruleset, created_at, updated_at, last_session, active_scene_id, campaign_type FROM campaigns WHERE id = ?1"
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
                "campaign_type": row.get::<_, String>(8).unwrap_or_else(|_| "homebrew".to_string()),
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

#[tauri::command]
pub fn archive_campaign(
    campaign_id: String,
    archived: bool,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();
    let status = if archived { "archived" } else { "active" };

    with_campaign_conn(&state, |conn| {
        // Ensure the status column exists (migration)
        let _ = conn.execute("ALTER TABLE campaigns ADD COLUMN status TEXT DEFAULT 'active'", []);

        let rows = conn.execute(
            "UPDATE campaigns SET status = ?1, updated_at = ?2 WHERE id = ?3",
            params![status, now, campaign_id],
        ).map_err(|e| format!("Failed to archive campaign: {}", e))?;

        if rows == 0 {
            return Err("Campaign not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn export_campaign(
    campaign_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        // Campaign metadata
        let campaign: serde_json::Value = conn.prepare(
            "SELECT id, name, description, ruleset, campaign_type, created_at FROM campaigns WHERE id = ?1"
        ).map_err(|e| format!("Query error: {}", e))?
        .query_row(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "ruleset": row.get::<_, String>(3).unwrap_or_else(|_| "dnd5e-2024".to_string()),
                "campaign_type": row.get::<_, String>(4).unwrap_or_else(|_| "homebrew".to_string()),
                "created_at": row.get::<_, i64>(5)?,
            }))
        }).map_err(|e| format!("Campaign not found: {}", e))?;

        // Scenes
        let mut scenes_stmt = conn.prepare(
            "SELECT id, name, description, location, phase, dm_notes, sort_order, completed, player_visible, player_description, mood FROM scenes WHERE campaign_id = ?1 ORDER BY sort_order"
        ).map_err(|e| format!("Query error: {}", e))?;
        let scenes: Vec<serde_json::Value> = scenes_stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "location": row.get::<_, String>(3).unwrap_or_default(),
                "phase": row.get::<_, String>(4).unwrap_or_default(),
                "dm_notes": row.get::<_, String>(5).unwrap_or_default(),
                "sort_order": row.get::<_, i64>(6).unwrap_or(0),
                "completed": row.get::<_, i64>(7).unwrap_or(0),
                "player_visible": row.get::<_, i64>(8).unwrap_or(0),
                "player_description": row.get::<_, String>(9).unwrap_or_default(),
                "mood": row.get::<_, String>(10).unwrap_or_default(),
            }))
        }).map_err(|e| format!("Query error: {}", e))?
        .filter_map(|r| r.ok()).collect();

        // NPCs
        let mut npcs_stmt = conn.prepare(
            "SELECT id, name, role, race, location, description, dm_notes, visibility, known_info_json, status FROM campaign_npcs WHERE campaign_id = ?1"
        ).map_err(|e| format!("Query error: {}", e))?;
        let npcs: Vec<serde_json::Value> = npcs_stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "name": row.get::<_, String>(1)?,
                "role": row.get::<_, String>(2).unwrap_or_default(),
                "race": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "dm_notes": row.get::<_, String>(6).unwrap_or_default(),
                "visibility": row.get::<_, String>(7).unwrap_or_else(|_| "dm_only".to_string()),
                "known_info_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "status": row.get::<_, String>(9).unwrap_or_else(|_| "alive".to_string()),
            }))
        }).map_err(|e| format!("Query error: {}", e))?
        .filter_map(|r| r.ok()).collect();

        // Quests
        let mut quests_stmt = conn.prepare(
            "SELECT title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, reward_items_json FROM campaign_quests WHERE campaign_id = ?1"
        ).map_err(|e| format!("Query error: {}", e))?;
        let quests: Vec<serde_json::Value> = quests_stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "title": row.get::<_, String>(0)?,
                "giver": row.get::<_, String>(1).unwrap_or_default(),
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "status": row.get::<_, String>(3).unwrap_or_default(),
                "visibility": row.get::<_, String>(4).unwrap_or_else(|_| "dm_only".to_string()),
                "objectives_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "reward_xp": row.get::<_, i64>(6).unwrap_or(0),
                "reward_gold": row.get::<_, i64>(7).unwrap_or(0),
                "reward_items_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
            }))
        }).map_err(|e| format!("Query error: {}", e))?
        .filter_map(|r| r.ok()).collect();

        // Handouts
        let mut handouts_stmt = conn.prepare(
            "SELECT title, content, revealed FROM handouts WHERE campaign_id = ?1"
        ).map_err(|e| format!("Query error: {}", e))?;
        let handouts: Vec<serde_json::Value> = handouts_stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "title": row.get::<_, String>(0)?,
                "content": row.get::<_, String>(1).unwrap_or_default(),
                "revealed": row.get::<_, i64>(2).unwrap_or(0),
            }))
        }).map_err(|e| format!("Query error: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(serde_json::json!({
            "_format": "codex-campaign-export",
            "_version": 1,
            "campaign": campaign,
            "scenes": scenes,
            "npcs": npcs,
            "quests": quests,
            "handouts": handouts,
        }))
    })
}

#[tauri::command]
pub fn import_campaign(
    payload: serde_json::Value,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_data = payload.get("campaign").ok_or("Missing campaign data")?;
    let name = campaign_data.get("name").and_then(|n| n.as_str()).ok_or("Missing campaign name")?;
    let description = campaign_data.get("description").and_then(|d| d.as_str()).unwrap_or("");
    let ruleset = campaign_data.get("ruleset").and_then(|r| r.as_str()).unwrap_or("dnd5e-2024");
    let campaign_type = campaign_data.get("campaign_type").and_then(|t| t.as_str()).unwrap_or("homebrew");

    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaigns (id, name, description, ruleset, campaign_type, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)",
            params![id, format!("{} (imported)", name), description, ruleset, campaign_type, now],
        ).map_err(|e| format!("Failed to create campaign: {}", e))?;

        // Import scenes
        if let Some(scenes) = payload.get("scenes").and_then(|s| s.as_array()) {
            for scene in scenes {
                let scene_id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO scenes (id, campaign_id, name, description, location, phase, dm_notes, sort_order, completed, player_visible, player_description, mood) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
                    params![
                        scene_id, id,
                        scene.get("name").and_then(|n| n.as_str()).unwrap_or(""),
                        scene.get("description").and_then(|d| d.as_str()).unwrap_or(""),
                        scene.get("location").and_then(|l| l.as_str()).unwrap_or(""),
                        scene.get("phase").and_then(|p| p.as_str()).unwrap_or("exploration"),
                        scene.get("dm_notes").and_then(|n| n.as_str()).unwrap_or(""),
                        scene.get("sort_order").and_then(|s| s.as_i64()).unwrap_or(0),
                        scene.get("completed").and_then(|c| c.as_i64()).unwrap_or(0),
                        scene.get("player_visible").and_then(|p| p.as_i64()).unwrap_or(0),
                        scene.get("player_description").and_then(|d| d.as_str()).unwrap_or(""),
                        scene.get("mood").and_then(|m| m.as_str()).unwrap_or(""),
                    ],
                ).map_err(|e| format!("Failed to import scene: {}", e))?;
            }
        }

        // Import NPCs
        if let Some(npcs) = payload.get("npcs").and_then(|n| n.as_array()) {
            for npc in npcs {
                let npc_id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO campaign_npcs (id, campaign_id, name, role, race, location, description, dm_notes, visibility, known_info_json, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
                    params![
                        npc_id, id,
                        npc.get("name").and_then(|n| n.as_str()).unwrap_or("Unknown"),
                        npc.get("role").and_then(|r| r.as_str()).unwrap_or(""),
                        npc.get("race").and_then(|r| r.as_str()).unwrap_or(""),
                        npc.get("location").and_then(|l| l.as_str()).unwrap_or(""),
                        npc.get("description").and_then(|d| d.as_str()).unwrap_or(""),
                        npc.get("dm_notes").and_then(|n| n.as_str()).unwrap_or(""),
                        npc.get("visibility").and_then(|v| v.as_str()).unwrap_or("dm_only"),
                        npc.get("known_info_json").and_then(|k| k.as_str()).unwrap_or("[]"),
                        npc.get("status").and_then(|s| s.as_str()).unwrap_or("alive"),
                        now,
                    ],
                ).map_err(|e| format!("Failed to import NPC: {}", e))?;
            }
        }

        // Import quests
        if let Some(quests) = payload.get("quests").and_then(|q| q.as_array()) {
            for quest in quests {
                let quest_id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO campaign_quests (id, campaign_id, title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, reward_items_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
                    params![
                        quest_id, id,
                        quest.get("title").and_then(|t| t.as_str()).unwrap_or("Untitled"),
                        quest.get("giver").and_then(|g| g.as_str()).unwrap_or(""),
                        quest.get("description").and_then(|d| d.as_str()).unwrap_or(""),
                        quest.get("status").and_then(|s| s.as_str()).unwrap_or("active"),
                        quest.get("visibility").and_then(|v| v.as_str()).unwrap_or("dm_only"),
                        quest.get("objectives_json").and_then(|o| o.as_str()).unwrap_or("[]"),
                        quest.get("reward_xp").and_then(|x| x.as_i64()).unwrap_or(0),
                        quest.get("reward_gold").and_then(|g| g.as_i64()).unwrap_or(0),
                        quest.get("reward_items_json").and_then(|i| i.as_str()).unwrap_or("[]"),
                        now,
                    ],
                ).map_err(|e| format!("Failed to import quest: {}", e))?;
            }
        }

        // Import handouts
        if let Some(handouts) = payload.get("handouts").and_then(|h| h.as_array()) {
            for handout in handouts {
                let handout_id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO handouts (id, campaign_id, title, content, revealed) VALUES (?1, ?2, ?3, ?4, ?5)",
                    params![
                        handout_id, id,
                        handout.get("title").and_then(|t| t.as_str()).unwrap_or("Untitled"),
                        handout.get("content").and_then(|c| c.as_str()).unwrap_or(""),
                        handout.get("revealed").and_then(|r| r.as_i64()).unwrap_or(0),
                    ],
                ).map_err(|e| format!("Failed to import handout: {}", e))?;
            }
        }

        Ok(serde_json::json!({
            "id": id,
            "name": format!("{} (imported)", name),
        }))
    })
}
