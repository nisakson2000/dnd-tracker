use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

// ════════════════════════════════════════════════════════════════════════
// Story Threads
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_story_thread(
    title: String,
    description: String,
    thread_type: Option<String>,
    priority: Option<String>,
    linked_quest_ids_json: Option<String>,
    linked_npc_ids_json: Option<String>,
    phases_json: Option<String>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO story_threads (id, campaign_id, title, description, thread_type, status, current_phase, phases_json, linked_quest_ids_json, linked_npc_ids_json, dm_notes, priority, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, 'dormant', '', ?6, ?7, ?8, ?9, ?10, ?11, ?11)",
            params![
                id, campaign_id, title, description,
                thread_type.unwrap_or_else(|| "main_campaign".to_string()),
                phases_json.unwrap_or_else(|| "[]".to_string()),
                linked_quest_ids_json.unwrap_or_else(|| "[]".to_string()),
                linked_npc_ids_json.unwrap_or_else(|| "[]".to_string()),
                dm_notes.unwrap_or_default(),
                priority.unwrap_or_else(|| "medium".to_string()),
                now,
            ],
        ).map_err(|e| format!("Failed to create story thread: {}", e))?;

        Ok(serde_json::json!({ "id": id, "title": title, "status": "dormant", "created_at": now }))
    })
}

#[tauri::command]
pub fn list_story_threads(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, description, thread_type, status, current_phase, phases_json, linked_quest_ids_json, linked_npc_ids_json, dm_notes, priority, created_at, updated_at
             FROM story_threads WHERE campaign_id = ?1 ORDER BY
             CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, updated_at DESC"
        ).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "thread_type": row.get::<_, String>(3).unwrap_or_default(),
                "status": row.get::<_, String>(4).unwrap_or_default(),
                "current_phase": row.get::<_, String>(5).unwrap_or_default(),
                "phases_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "linked_quest_ids_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "linked_npc_ids_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "dm_notes": row.get::<_, String>(9).unwrap_or_default(),
                "priority": row.get::<_, String>(10).unwrap_or_default(),
                "created_at": row.get::<_, i64>(11).unwrap_or(0),
                "updated_at": row.get::<_, i64>(12).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read threads: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_story_thread(
    thread_id: String,
    title: String,
    description: String,
    thread_type: String,
    status: String,
    current_phase: String,
    phases_json: String,
    linked_quest_ids_json: String,
    linked_npc_ids_json: String,
    dm_notes: String,
    priority: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE story_threads SET title=?1, description=?2, thread_type=?3, status=?4, current_phase=?5, phases_json=?6, linked_quest_ids_json=?7, linked_npc_ids_json=?8, dm_notes=?9, priority=?10, updated_at=?11 WHERE id=?12",
            params![title, description, thread_type, status, current_phase, phases_json, linked_quest_ids_json, linked_npc_ids_json, dm_notes, priority, now, thread_id],
        ).map_err(|e| format!("Failed to update thread: {}", e))?;

        if rows == 0 { return Err("Thread not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_story_thread(
    thread_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM story_threads WHERE id = ?1", params![thread_id])
            .map_err(|e| format!("Failed to delete thread: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Story Branches (Decision Points)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_story_branch(
    thread_id: String,
    decision_prompt: String,
    branches_json: String,
    session_number: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO story_branches (id, thread_id, campaign_id, decision_prompt, chosen_branch, branches_json, session_number, consequences_json, created_at)
             VALUES (?1, ?2, ?3, ?4, '', ?5, ?6, '[]', ?7)",
            params![id, thread_id, campaign_id, decision_prompt, branches_json, session_number.unwrap_or(0), now],
        ).map_err(|e| format!("Failed to create branch: {}", e))?;

        Ok(serde_json::json!({ "id": id, "thread_id": thread_id, "decision_prompt": decision_prompt }))
    })
}

#[tauri::command]
pub fn resolve_story_branch(
    branch_id: String,
    chosen_branch: String,
    consequences_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE story_branches SET chosen_branch = ?1, consequences_json = ?2, resolved_at = ?3 WHERE id = ?4",
            params![chosen_branch, consequences_json, now, branch_id],
        ).map_err(|e| format!("Failed to resolve branch: {}", e))?;

        if rows == 0 { return Err("Branch not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn list_story_branches(
    thread_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, decision_prompt, chosen_branch, branches_json, session_number, consequences_json, created_at, resolved_at
             FROM story_branches WHERE thread_id = ?1 ORDER BY created_at"
        ).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![thread_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "decision_prompt": row.get::<_, String>(1).unwrap_or_default(),
                "chosen_branch": row.get::<_, String>(2).unwrap_or_default(),
                "branches_json": row.get::<_, String>(3).unwrap_or_else(|_| "[]".to_string()),
                "session_number": row.get::<_, i64>(4).unwrap_or(0),
                "consequences_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "created_at": row.get::<_, i64>(6).unwrap_or(0),
                "resolved_at": row.get::<_, Option<i64>>(7).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read branches: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

// ════════════════════════════════════════════════════════════════════════
// Villain Profiles
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_villain_profile(
    npc_id: String,
    master_plan_json: String,
    power_level: Option<i64>,
    resources_json: Option<String>,
    weaknesses_json: Option<String>,
    phase_descriptions_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO villain_profiles (id, campaign_id, npc_id, master_plan_json, power_level, resources_json, adaptations_json, weaknesses_json, current_phase, phase_descriptions_json, is_active, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, '[]', ?7, 1, ?8, 1, ?9, ?9)",
            params![
                id, campaign_id, npc_id, master_plan_json,
                power_level.unwrap_or(1),
                resources_json.unwrap_or_else(|| "{}".to_string()),
                weaknesses_json.unwrap_or_else(|| "[]".to_string()),
                phase_descriptions_json.unwrap_or_else(|| "[]".to_string()),
                now,
            ],
        ).map_err(|e| format!("Failed to create villain profile: {}", e))?;

        Ok(serde_json::json!({ "id": id, "npc_id": npc_id, "created_at": now }))
    })
}

#[tauri::command]
pub fn get_villain_profile(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        conn.query_row(
            "SELECT id, master_plan_json, power_level, resources_json, adaptations_json, weaknesses_json, current_phase, phase_descriptions_json, is_active, created_at, updated_at
             FROM villain_profiles WHERE campaign_id = ?1 AND npc_id = ?2",
            params![campaign_id, npc_id],
            |row| {
                Ok(serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "npc_id": npc_id,
                    "master_plan_json": row.get::<_, String>(1).unwrap_or_else(|_| "[]".to_string()),
                    "power_level": row.get::<_, i64>(2).unwrap_or(1),
                    "resources_json": row.get::<_, String>(3).unwrap_or_else(|_| "{}".to_string()),
                    "adaptations_json": row.get::<_, String>(4).unwrap_or_else(|_| "[]".to_string()),
                    "weaknesses_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                    "current_phase": row.get::<_, i64>(6).unwrap_or(1),
                    "phase_descriptions_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                    "is_active": row.get::<_, i64>(8).unwrap_or(1) != 0,
                    "created_at": row.get::<_, i64>(9).unwrap_or(0),
                    "updated_at": row.get::<_, i64>(10).unwrap_or(0),
                }))
            },
        ).map_err(|e| format!("Villain profile not found: {}", e))
    })
}

#[tauri::command]
pub fn update_villain_profile(
    npc_id: String,
    master_plan_json: String,
    power_level: i64,
    resources_json: String,
    adaptations_json: String,
    weaknesses_json: String,
    current_phase: i64,
    phase_descriptions_json: String,
    is_active: bool,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE villain_profiles SET master_plan_json=?1, power_level=?2, resources_json=?3, adaptations_json=?4, weaknesses_json=?5, current_phase=?6, phase_descriptions_json=?7, is_active=?8, updated_at=?9
             WHERE campaign_id=?10 AND npc_id=?11",
            params![master_plan_json, power_level, resources_json, adaptations_json, weaknesses_json, current_phase, phase_descriptions_json, is_active as i64, now, campaign_id, npc_id],
        ).map_err(|e| format!("Failed to update villain: {}", e))?;

        if rows == 0 { return Err("Villain profile not found.".to_string()); }
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Campaign Arcs
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_campaign_arc(
    title: String,
    description: String,
    arc_type: Option<String>,
    linked_quest_ids_json: Option<String>,
    linked_npc_ids_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_arcs (id, campaign_id, title, description, arc_type, status, linked_quest_ids_json, linked_npc_ids_json, linked_thread_ids_json, key_moments_json, sessions_active_json, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, 'setup', ?6, ?7, '[]', '[]', '[]', ?8, ?8)",
            params![
                id, campaign_id, title, description,
                arc_type.unwrap_or_else(|| "main_campaign".to_string()),
                linked_quest_ids_json.unwrap_or_else(|| "[]".to_string()),
                linked_npc_ids_json.unwrap_or_else(|| "[]".to_string()),
                now,
            ],
        ).map_err(|e| format!("Failed to create arc: {}", e))?;

        Ok(serde_json::json!({ "id": id, "title": title, "status": "setup", "created_at": now }))
    })
}

#[tauri::command]
pub fn list_campaign_arcs(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, description, arc_type, status, linked_quest_ids_json, linked_npc_ids_json, linked_thread_ids_json, key_moments_json, sessions_active_json, created_at, updated_at
             FROM campaign_arcs WHERE campaign_id = ?1 ORDER BY updated_at DESC"
        ).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "arc_type": row.get::<_, String>(3).unwrap_or_default(),
                "status": row.get::<_, String>(4).unwrap_or_default(),
                "linked_quest_ids_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "linked_npc_ids_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "linked_thread_ids_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "key_moments_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "sessions_active_json": row.get::<_, String>(9).unwrap_or_else(|_| "[]".to_string()),
                "created_at": row.get::<_, i64>(10).unwrap_or(0),
                "updated_at": row.get::<_, i64>(11).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read arcs: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_campaign_arc(
    arc_id: String,
    title: String,
    description: String,
    arc_type: String,
    status: String,
    linked_quest_ids_json: String,
    linked_npc_ids_json: String,
    linked_thread_ids_json: String,
    key_moments_json: String,
    sessions_active_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_arcs SET title=?1, description=?2, arc_type=?3, status=?4, linked_quest_ids_json=?5, linked_npc_ids_json=?6, linked_thread_ids_json=?7, key_moments_json=?8, sessions_active_json=?9, updated_at=?10 WHERE id=?11",
            params![title, description, arc_type, status, linked_quest_ids_json, linked_npc_ids_json, linked_thread_ids_json, key_moments_json, sessions_active_json, now, arc_id],
        ).map_err(|e| format!("Failed to update arc: {}", e))?;

        if rows == 0 { return Err("Arc not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_campaign_arc(
    arc_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_arcs WHERE id = ?1", params![arc_id])
            .map_err(|e| format!("Failed to delete arc: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Campaign History (Unified Event Archive)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn add_history_entry(
    event_type: String,
    category: String,
    title: String,
    description: String,
    session_id: Option<String>,
    session_number: Option<i64>,
    actors_json: Option<String>,
    location: Option<String>,
    mechanical_data_json: Option<String>,
    narrative_significance: Option<i64>,
    tags_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_history (id, campaign_id, session_id, session_number, event_type, category, title, description, actors_json, location, mechanical_data_json, narrative_significance, tags_json, is_bookmarked, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, 0, ?14)",
            params![
                id, campaign_id,
                session_id.unwrap_or_default(),
                session_number.unwrap_or(0),
                event_type, category, title, description,
                actors_json.unwrap_or_else(|| "[]".to_string()),
                location.unwrap_or_default(),
                mechanical_data_json.unwrap_or_else(|| "{}".to_string()),
                narrative_significance.unwrap_or(1),
                tags_json.unwrap_or_else(|| "[]".to_string()),
                now,
            ],
        ).map_err(|e| format!("Failed to add history entry: {}", e))?;

        Ok(serde_json::json!({ "id": id, "title": title, "created_at": now }))
    })
}

#[tauri::command]
pub fn get_campaign_history(
    category_filter: Option<String>,
    session_filter: Option<i64>,
    bookmarked_only: Option<bool>,
    limit: Option<i64>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;
    let max_rows = limit.unwrap_or(200);

    with_campaign_conn(&state, |conn| {
        let mut query = String::from(
            "SELECT id, session_id, session_number, event_type, category, title, description, actors_json, location, mechanical_data_json, narrative_significance, tags_json, is_bookmarked, created_at
             FROM campaign_history WHERE campaign_id = ?1"
        );
        let mut bind_values: Vec<Box<dyn rusqlite::types::ToSql>> = vec![Box::new(campaign_id.clone())];
        let mut param_idx = 2;

        if let Some(ref cat) = category_filter {
            query.push_str(&format!(" AND category = ?{}", param_idx));
            bind_values.push(Box::new(cat.clone()));
            param_idx += 1;
        }
        if let Some(session) = session_filter {
            query.push_str(&format!(" AND session_number = ?{}", param_idx));
            bind_values.push(Box::new(session));
            param_idx += 1;
        }
        if bookmarked_only.unwrap_or(false) {
            query.push_str(&format!(" AND is_bookmarked = 1"));
        }
        query.push_str(&format!(" ORDER BY created_at DESC LIMIT ?{}", param_idx));
        bind_values.push(Box::new(max_rows));

        let mut stmt = conn.prepare(&query).map_err(|e| format!("Query failed: {}", e))?;
        let param_refs: Vec<&dyn rusqlite::types::ToSql> = bind_values.iter().map(|p| p.as_ref()).collect();

        let rows: Vec<serde_json::Value> = stmt.query_map(param_refs.as_slice(), |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "session_id": row.get::<_, String>(1).unwrap_or_default(),
                "session_number": row.get::<_, i64>(2).unwrap_or(0),
                "event_type": row.get::<_, String>(3).unwrap_or_default(),
                "category": row.get::<_, String>(4).unwrap_or_default(),
                "title": row.get::<_, String>(5).unwrap_or_default(),
                "description": row.get::<_, String>(6).unwrap_or_default(),
                "actors_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "location": row.get::<_, String>(8).unwrap_or_default(),
                "mechanical_data_json": row.get::<_, String>(9).unwrap_or_else(|_| "{}".to_string()),
                "narrative_significance": row.get::<_, i64>(10).unwrap_or(1),
                "tags_json": row.get::<_, String>(11).unwrap_or_else(|_| "[]".to_string()),
                "is_bookmarked": row.get::<_, i64>(12).unwrap_or(0) != 0,
                "created_at": row.get::<_, i64>(13).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read history: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn toggle_history_bookmark(
    entry_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "UPDATE campaign_history SET is_bookmarked = CASE WHEN is_bookmarked = 0 THEN 1 ELSE 0 END WHERE id = ?1",
            params![entry_id],
        ).map_err(|e| format!("Failed to toggle bookmark: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn delete_history_entry(
    entry_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_history WHERE id = ?1", params![entry_id])
            .map_err(|e| format!("Failed to delete history: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Campaign Secrets
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_campaign_secret(
    content: String,
    secret_type: Option<String>,
    known_by_json: Option<String>,
    reveal_conditions: Option<String>,
    narrative_impact: Option<String>,
    urgency: Option<String>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_secrets (id, campaign_id, content, secret_type, known_by_json, reveal_conditions, narrative_impact, urgency, is_revealed, dm_notes, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 0, ?9, ?10)",
            params![
                id, campaign_id, content,
                secret_type.unwrap_or_else(|| "personal".to_string()),
                known_by_json.unwrap_or_else(|| "[]".to_string()),
                reveal_conditions.unwrap_or_default(),
                narrative_impact.unwrap_or_else(|| "moderate".to_string()),
                urgency.unwrap_or_else(|| "low".to_string()),
                dm_notes.unwrap_or_default(),
                now,
            ],
        ).map_err(|e| format!("Failed to create secret: {}", e))?;

        Ok(serde_json::json!({ "id": id, "content": content, "created_at": now }))
    })
}

#[tauri::command]
pub fn list_campaign_secrets(
    include_revealed: Option<bool>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;
    let show_revealed = include_revealed.unwrap_or(true);

    with_campaign_conn(&state, |conn| {
        let query = if show_revealed {
            "SELECT id, content, secret_type, known_by_json, reveal_conditions, narrative_impact, urgency, is_revealed, dm_notes, created_at, revealed_at FROM campaign_secrets WHERE campaign_id = ?1 ORDER BY created_at DESC"
        } else {
            "SELECT id, content, secret_type, known_by_json, reveal_conditions, narrative_impact, urgency, is_revealed, dm_notes, created_at, revealed_at FROM campaign_secrets WHERE campaign_id = ?1 AND is_revealed = 0 ORDER BY created_at DESC"
        };

        let mut stmt = conn.prepare(query).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "content": row.get::<_, String>(1).unwrap_or_default(),
                "secret_type": row.get::<_, String>(2).unwrap_or_default(),
                "known_by_json": row.get::<_, String>(3).unwrap_or_else(|_| "[]".to_string()),
                "reveal_conditions": row.get::<_, String>(4).unwrap_or_default(),
                "narrative_impact": row.get::<_, String>(5).unwrap_or_default(),
                "urgency": row.get::<_, String>(6).unwrap_or_default(),
                "is_revealed": row.get::<_, i64>(7).unwrap_or(0) != 0,
                "dm_notes": row.get::<_, String>(8).unwrap_or_default(),
                "created_at": row.get::<_, i64>(9).unwrap_or(0),
                "revealed_at": row.get::<_, Option<i64>>(10).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read secrets: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn reveal_campaign_secret(
    secret_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_secrets SET is_revealed = 1, revealed_at = ?1 WHERE id = ?2",
            params![now, secret_id],
        ).map_err(|e| format!("Failed to reveal secret: {}", e))?;

        if rows == 0 { return Err("Secret not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn update_secret_known_by(
    secret_id: String,
    known_by_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_secrets SET known_by_json = ?1 WHERE id = ?2",
            params![known_by_json, secret_id],
        ).map_err(|e| format!("Failed to update secret: {}", e))?;

        if rows == 0 { return Err("Secret not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_campaign_secret(
    secret_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_secrets WHERE id = ?1", params![secret_id])
            .map_err(|e| format!("Failed to delete secret: {}", e))?;
        Ok(())
    })
}
