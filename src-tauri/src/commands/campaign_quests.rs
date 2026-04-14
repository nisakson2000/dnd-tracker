use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

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
            "SELECT id, title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, reward_items_json, parent_quest_id, linked_arc_id, created_at, completed_at, active_beat_id, plot_summary FROM campaign_quests WHERE campaign_id = ?1 ORDER BY created_at DESC"
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
                "active_beat_id": row.get::<_, Option<String>>(14).unwrap_or(None),
                "plot_summary": row.get::<_, String>(15).unwrap_or_default(),
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
            "SELECT id, title, giver, description, status, objectives_json, reward_xp, reward_gold, completed_at, active_beat_id, plot_summary FROM campaign_quests WHERE campaign_id = ?1 AND status != 'hidden' AND visibility != 'dm_only' ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to query campaign quests: {}", e))?;

        let rows: Vec<(serde_json::Value, String, Option<String>)> = stmt.query_map(params![campaign_id], |row| {
            let quest_id: String = row.get(0)?;
            let active_beat_id: Option<String> = row.get::<_, Option<String>>(9).unwrap_or(None);

            Ok((serde_json::json!({
                "id": quest_id,
                "title": row.get::<_, String>(1)?,
                "giver": row.get::<_, String>(2).unwrap_or_default(),
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "status": row.get::<_, String>(4).unwrap_or_else(|_| "active".to_string()),
                "objectives_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "reward_xp": row.get::<_, i64>(6).unwrap_or(0),
                "reward_gold": row.get::<_, i64>(7).unwrap_or(0),
                "completed_at": row.get::<_, Option<i64>>(8).unwrap_or(None),
                "active_beat_id": active_beat_id.clone(),
                "plot_summary": row.get::<_, String>(10).unwrap_or_default(),
            }), quest_id, active_beat_id))
        }).map_err(|e| format!("Failed to read campaign quests: {}", e))?
        .filter_map(|r| r.ok()).collect();

        // For each quest, build a player-visible beat timeline
        let mut result: Vec<serde_json::Value> = Vec::new();
        for (mut quest_json, quest_id, active_beat_id) in rows {
            let mut beat_stmt = conn.prepare(
                "SELECT id, title, status, sort_order FROM quest_beats WHERE quest_id = ?1 ORDER BY sort_order ASC"
            ).map_err(|e| format!("Failed to query quest beats: {}", e))?;

            let beats: Vec<serde_json::Value> = beat_stmt.query_map(params![quest_id], |brow| {
                let beat_id: String = brow.get(0)?;
                let beat_title: String = brow.get(1)?;
                let beat_status: String = brow.get::<_, String>(2).unwrap_or_else(|_| "pending".to_string());

                let is_active = active_beat_id.as_deref() == Some(beat_id.as_str());
                let is_completed = beat_status == "completed";

                // Players see completed beat titles and active beat title; future beats show as "???"
                let visible_title = if is_completed || is_active {
                    beat_title
                } else {
                    "???".to_string()
                };

                Ok(serde_json::json!({
                    "id": beat_id,
                    "title": visible_title,
                    "status": if is_active { "active".to_string() } else { beat_status },
                    "is_active": is_active,
                }))
            }).map_err(|e| format!("Failed to read quest beats: {}", e))?
            .filter_map(|r| r.ok()).collect();

            if let Some(obj) = quest_json.as_object_mut() {
                obj.insert("beats".to_string(), serde_json::json!(beats));
            }
            result.push(quest_json);
        }

        Ok(result)
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

// ─────────────────────────────────────────────────────────────────────────────
// Quest Beats CRUD
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn create_quest_beat(
    quest_id: String,
    campaign_id: String,
    title: String,
    description: String,
    dm_notes: String,
    sort_order: i64,
    beat_type: String,
    linked_scene_id: Option<String>,
    linked_encounter_json: String,
    linked_npc_ids_json: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let id = Uuid::new_v4().to_string();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO quest_beats (id, quest_id, campaign_id, title, description, dm_notes, sort_order, status, beat_type, linked_scene_id, linked_encounter_json, linked_npc_ids_json)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'pending', ?8, ?9, ?10, ?11)",
            params![id, quest_id, campaign_id, title, description, dm_notes, sort_order, beat_type, linked_scene_id, linked_encounter_json, linked_npc_ids_json],
        ).map_err(|e| format!("Failed to create quest beat: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "quest_id": quest_id,
            "campaign_id": campaign_id,
            "title": title,
            "description": description,
            "dm_notes": dm_notes,
            "sort_order": sort_order,
            "status": "pending",
            "beat_type": beat_type,
            "linked_scene_id": linked_scene_id,
            "linked_encounter_json": linked_encounter_json,
            "linked_npc_ids_json": linked_npc_ids_json,
            "completed_at": null,
        }))
    })
}

#[tauri::command]
pub fn list_quest_beats(
    quest_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, quest_id, campaign_id, title, description, dm_notes, sort_order, status, beat_type, linked_scene_id, linked_encounter_json, linked_npc_ids_json, completed_at FROM quest_beats WHERE quest_id = ?1 ORDER BY sort_order ASC"
        ).map_err(|e| format!("Failed to query quest beats: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![quest_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "quest_id": row.get::<_, String>(1)?,
                "campaign_id": row.get::<_, String>(2)?,
                "title": row.get::<_, String>(3)?,
                "description": row.get::<_, String>(4).unwrap_or_default(),
                "dm_notes": row.get::<_, String>(5).unwrap_or_default(),
                "sort_order": row.get::<_, i64>(6).unwrap_or(0),
                "status": row.get::<_, String>(7).unwrap_or_else(|_| "pending".to_string()),
                "beat_type": row.get::<_, String>(8).unwrap_or_else(|_| "story".to_string()),
                "linked_scene_id": row.get::<_, Option<String>>(9).unwrap_or(None),
                "linked_encounter_json": row.get::<_, String>(10).unwrap_or_else(|_| "{}".to_string()),
                "linked_npc_ids_json": row.get::<_, String>(11).unwrap_or_else(|_| "[]".to_string()),
                "completed_at": row.get::<_, Option<i64>>(12).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read quest beats: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_quest_beat(
    beat_id: String,
    title: String,
    description: String,
    dm_notes: String,
    sort_order: i64,
    beat_type: String,
    status: String,
    linked_scene_id: Option<String>,
    linked_encounter_json: String,
    linked_npc_ids_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE quest_beats SET title = ?1, description = ?2, dm_notes = ?3, sort_order = ?4, beat_type = ?5, status = ?6, linked_scene_id = ?7, linked_encounter_json = ?8, linked_npc_ids_json = ?9 WHERE id = ?10",
            params![title, description, dm_notes, sort_order, beat_type, status, linked_scene_id, linked_encounter_json, linked_npc_ids_json, beat_id],
        ).map_err(|e| format!("Failed to update quest beat: {}", e))?;

        if rows == 0 {
            return Err("Quest beat not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_quest_beat(
    beat_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM quest_beats WHERE id = ?1", params![beat_id])
            .map_err(|e| format!("Failed to delete quest beat: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn advance_quest_beat(
    quest_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Get current active_beat_id from the quest
        let active_beat_id: Option<String> = conn.query_row(
            "SELECT active_beat_id FROM campaign_quests WHERE id = ?1",
            params![quest_id],
            |row| row.get(0),
        ).map_err(|e| format!("Quest not found: {}", e))?;

        // If there's a current active beat, mark it completed
        if let Some(ref current_id) = active_beat_id {
            conn.execute(
                "UPDATE quest_beats SET status = 'completed', completed_at = ?1 WHERE id = ?2",
                params![now, current_id],
            ).map_err(|e| format!("Failed to complete current beat: {}", e))?;
        }

        // Find the next beat by sort_order
        let next_beat: Option<(String, String)> = if let Some(ref current_id) = active_beat_id {
            // Get current beat's sort_order, then find the next one
            let current_sort: i64 = conn.query_row(
                "SELECT sort_order FROM quest_beats WHERE id = ?1",
                params![current_id],
                |row| row.get(0),
            ).unwrap_or(0);

            conn.query_row(
                "SELECT id, title FROM quest_beats WHERE quest_id = ?1 AND sort_order > ?2 ORDER BY sort_order ASC LIMIT 1",
                params![quest_id, current_sort],
                |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
            ).ok()
        } else {
            // No active beat yet — pick the first one
            conn.query_row(
                "SELECT id, title FROM quest_beats WHERE quest_id = ?1 ORDER BY sort_order ASC LIMIT 1",
                params![quest_id],
                |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
            ).ok()
        };

        // Update the quest's active_beat_id
        let new_active_id = next_beat.as_ref().map(|(id, _)| id.clone());
        conn.execute(
            "UPDATE campaign_quests SET active_beat_id = ?1 WHERE id = ?2",
            params![new_active_id, quest_id],
        ).map_err(|e| format!("Failed to update active beat on quest: {}", e))?;

        match next_beat {
            Some((beat_id, beat_title)) => Ok(serde_json::json!({
                "active_beat_id": beat_id,
                "title": beat_title,
                "quest_id": quest_id,
                "advanced": true,
            })),
            None => Ok(serde_json::json!({
                "active_beat_id": null,
                "quest_id": quest_id,
                "advanced": false,
                "message": "No more beats — quest timeline complete.",
            })),
        }
    })
}

#[tauri::command]
pub fn get_quest_with_beats(
    quest_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        // Get the quest row
        let quest = conn.query_row(
            "SELECT id, campaign_id, title, giver, description, status, visibility, objectives_json, reward_xp, reward_gold, reward_items_json, parent_quest_id, linked_arc_id, created_at, completed_at, active_beat_id, plot_summary FROM campaign_quests WHERE id = ?1",
            params![quest_id],
            |row| {
                Ok(serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "campaign_id": row.get::<_, String>(1)?,
                    "title": row.get::<_, String>(2)?,
                    "giver": row.get::<_, String>(3).unwrap_or_default(),
                    "description": row.get::<_, String>(4).unwrap_or_default(),
                    "status": row.get::<_, String>(5).unwrap_or_else(|_| "hidden".to_string()),
                    "visibility": row.get::<_, String>(6).unwrap_or_else(|_| "dm_only".to_string()),
                    "objectives_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                    "reward_xp": row.get::<_, i64>(8).unwrap_or(0),
                    "reward_gold": row.get::<_, i64>(9).unwrap_or(0),
                    "reward_items_json": row.get::<_, String>(10).unwrap_or_else(|_| "[]".to_string()),
                    "parent_quest_id": row.get::<_, Option<String>>(11).unwrap_or(None),
                    "linked_arc_id": row.get::<_, Option<String>>(12).unwrap_or(None),
                    "created_at": row.get::<_, i64>(13).unwrap_or(0),
                    "completed_at": row.get::<_, Option<i64>>(14).unwrap_or(None),
                    "active_beat_id": row.get::<_, Option<String>>(15).unwrap_or(None),
                    "plot_summary": row.get::<_, String>(16).unwrap_or_default(),
                }))
            },
        ).map_err(|e| format!("Quest not found: {}", e))?;

        // Get all beats for this quest
        let mut stmt = conn.prepare(
            "SELECT id, quest_id, campaign_id, title, description, dm_notes, sort_order, status, beat_type, linked_scene_id, linked_encounter_json, linked_npc_ids_json, completed_at FROM quest_beats WHERE quest_id = ?1 ORDER BY sort_order ASC"
        ).map_err(|e| format!("Failed to query quest beats: {}", e))?;

        let beats: Vec<serde_json::Value> = stmt.query_map(params![quest_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "quest_id": row.get::<_, String>(1)?,
                "campaign_id": row.get::<_, String>(2)?,
                "title": row.get::<_, String>(3)?,
                "description": row.get::<_, String>(4).unwrap_or_default(),
                "dm_notes": row.get::<_, String>(5).unwrap_or_default(),
                "sort_order": row.get::<_, i64>(6).unwrap_or(0),
                "status": row.get::<_, String>(7).unwrap_or_else(|_| "pending".to_string()),
                "beat_type": row.get::<_, String>(8).unwrap_or_else(|_| "story".to_string()),
                "linked_scene_id": row.get::<_, Option<String>>(9).unwrap_or(None),
                "linked_encounter_json": row.get::<_, String>(10).unwrap_or_else(|_| "{}".to_string()),
                "linked_npc_ids_json": row.get::<_, String>(11).unwrap_or_else(|_| "[]".to_string()),
                "completed_at": row.get::<_, Option<i64>>(12).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read quest beats: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(serde_json::json!({
            "quest": quest,
            "beats": beats,
        }))
    })
}
