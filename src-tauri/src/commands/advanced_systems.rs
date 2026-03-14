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

// ════════════════════════════════════════════════════════════════════════
// Investigation / Clue System (Phase 9C)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_clue(
    mystery_name: String,
    name: String,
    description: String,
    clue_type: Option<String>,
    location_found: Option<String>,
    links_to_clues_json: Option<String>,
    red_herring: Option<bool>,
    required_for_solution: Option<bool>,
    discovery_dc: Option<i64>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_clues (id, campaign_id, mystery_name, name, description, clue_type, location_found, discovered_by, links_to_clues_json, red_herring, required_for_solution, discovery_dc, is_discovered, dm_notes, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, '', ?8, ?9, ?10, ?11, 0, ?12, ?13)",
            params![
                id, campaign_id, mystery_name, name, description,
                clue_type.unwrap_or_else(|| "physical".to_string()),
                location_found.unwrap_or_default(),
                links_to_clues_json.unwrap_or_else(|| "[]".to_string()),
                red_herring.unwrap_or(false) as i64,
                required_for_solution.unwrap_or(false) as i64,
                discovery_dc.unwrap_or(10),
                dm_notes.unwrap_or_default(),
                now,
            ],
        ).map_err(|e| format!("Failed to create clue: {}", e))?;

        Ok(serde_json::json!({ "id": id, "name": name, "created_at": now }))
    })
}

#[tauri::command]
pub fn list_clues(
    mystery_filter: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let (query, bind): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = match mystery_filter {
            Some(ref mystery) => (
                "SELECT id, mystery_name, name, description, clue_type, location_found, discovered_by, links_to_clues_json, red_herring, required_for_solution, discovery_dc, is_discovered, dm_notes, created_at FROM campaign_clues WHERE campaign_id = ?1 AND mystery_name = ?2 ORDER BY created_at".to_string(),
                vec![Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>, Box::new(mystery.clone())],
            ),
            None => (
                "SELECT id, mystery_name, name, description, clue_type, location_found, discovered_by, links_to_clues_json, red_herring, required_for_solution, discovery_dc, is_discovered, dm_notes, created_at FROM campaign_clues WHERE campaign_id = ?1 ORDER BY mystery_name, created_at".to_string(),
                vec![Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>],
            ),
        };

        let mut stmt = conn.prepare(&query).map_err(|e| format!("Query failed: {}", e))?;
        let refs: Vec<&dyn rusqlite::types::ToSql> = bind.iter().map(|p| p.as_ref()).collect();

        let rows = stmt.query_map(refs.as_slice(), |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "mystery_name": row.get::<_, String>(1).unwrap_or_default(),
                "name": row.get::<_, String>(2)?,
                "description": row.get::<_, String>(3).unwrap_or_default(),
                "clue_type": row.get::<_, String>(4).unwrap_or_default(),
                "location_found": row.get::<_, String>(5).unwrap_or_default(),
                "discovered_by": row.get::<_, String>(6).unwrap_or_default(),
                "links_to_clues_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "red_herring": row.get::<_, i64>(8).unwrap_or(0) != 0,
                "required_for_solution": row.get::<_, i64>(9).unwrap_or(0) != 0,
                "discovery_dc": row.get::<_, i64>(10).unwrap_or(10),
                "is_discovered": row.get::<_, i64>(11).unwrap_or(0) != 0,
                "dm_notes": row.get::<_, String>(12).unwrap_or_default(),
                "created_at": row.get::<_, i64>(13).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read clues: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn discover_clue(
    clue_id: String,
    discovered_by: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "UPDATE campaign_clues SET is_discovered = 1, discovered_by = ?1 WHERE id = ?2",
            params![discovered_by, clue_id],
        ).map_err(|e| format!("Failed to discover clue: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn delete_clue(
    clue_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_clues WHERE id = ?1", params![clue_id])
            .map_err(|e| format!("Failed to delete clue: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Rumor System (Phase 9E)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_rumor(
    content: String,
    truth_percentage: Option<i64>,
    origin_location: Option<String>,
    origin_npc: Option<String>,
    tags_json: Option<String>,
    expiry_sessions: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let origin_loc = origin_location.unwrap_or_default();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_rumors (id, campaign_id, content, truth_percentage, origin_location, origin_npc, current_locations_json, spread_rate, distortion_level, tags_json, expiry_sessions, is_active, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 0.3, 0, ?8, ?9, 1, ?10)",
            params![
                id, campaign_id, content,
                truth_percentage.unwrap_or(50),
                origin_loc,
                origin_npc.unwrap_or_default(),
                format!("[\"{}\"]", origin_loc), // starts at origin location
                tags_json.unwrap_or_else(|| "[]".to_string()),
                expiry_sessions.unwrap_or(10),
                now,
            ],
        ).map_err(|e| format!("Failed to create rumor: {}", e))?;

        Ok(serde_json::json!({ "id": id, "content": content, "created_at": now }))
    })
}

#[tauri::command]
pub fn list_rumors(
    active_only: Option<bool>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let query = if active_only.unwrap_or(true) {
            "SELECT id, content, truth_percentage, origin_location, origin_npc, current_locations_json, spread_rate, distortion_level, tags_json, expiry_sessions, is_active, created_at FROM campaign_rumors WHERE campaign_id = ?1 AND is_active = 1 ORDER BY created_at DESC"
        } else {
            "SELECT id, content, truth_percentage, origin_location, origin_npc, current_locations_json, spread_rate, distortion_level, tags_json, expiry_sessions, is_active, created_at FROM campaign_rumors WHERE campaign_id = ?1 ORDER BY created_at DESC"
        };

        let mut stmt = conn.prepare(query).map_err(|e| format!("Query failed: {}", e))?;
        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "content": row.get::<_, String>(1).unwrap_or_default(),
                "truth_percentage": row.get::<_, i64>(2).unwrap_or(50),
                "origin_location": row.get::<_, String>(3).unwrap_or_default(),
                "origin_npc": row.get::<_, String>(4).unwrap_or_default(),
                "current_locations_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "spread_rate": row.get::<_, f64>(6).unwrap_or(0.3),
                "distortion_level": row.get::<_, i64>(7).unwrap_or(0),
                "tags_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "expiry_sessions": row.get::<_, i64>(9).unwrap_or(10),
                "is_active": row.get::<_, i64>(10).unwrap_or(1) != 0,
                "created_at": row.get::<_, i64>(11).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read rumors: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn spread_rumors(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        // Increase distortion and decrement expiry for all active rumors
        let spread = conn.execute(
            "UPDATE campaign_rumors SET distortion_level = distortion_level + 1, expiry_sessions = expiry_sessions - 1 WHERE campaign_id = ?1 AND is_active = 1",
            params![campaign_id],
        ).map_err(|e| format!("Failed to spread rumors: {}", e))?;

        // Deactivate expired rumors
        let expired = conn.execute(
            "UPDATE campaign_rumors SET is_active = 0 WHERE campaign_id = ?1 AND expiry_sessions <= 0",
            params![campaign_id],
        ).map_err(|e| format!("Failed to expire rumors: {}", e))?;

        Ok(serde_json::json!({ "rumors_spread": spread, "rumors_expired": expired }))
    })
}

#[tauri::command]
pub fn delete_rumor(
    rumor_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM campaign_rumors WHERE id = ?1", params![rumor_id])
            .map_err(|e| format!("Failed to delete rumor: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// World Crisis Engine (Phase 9H)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_world_crisis(
    title: String,
    description: String,
    crisis_type: Option<String>,
    severity: Option<i64>,
    affected_regions_json: Option<String>,
    escalation_timeline_json: Option<String>,
    resolution_conditions_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO world_crises (id, campaign_id, title, description, crisis_type, severity, affected_regions_json, escalation_timeline_json, current_phase, resolution_conditions_json, consequences_json, status, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1, ?9, '[]', 'active', ?10)",
            params![
                id, campaign_id, title, description,
                crisis_type.unwrap_or_else(|| "natural".to_string()),
                severity.unwrap_or(5),
                affected_regions_json.unwrap_or_else(|| "[]".to_string()),
                escalation_timeline_json.unwrap_or_else(|| "[]".to_string()),
                resolution_conditions_json.unwrap_or_else(|| "[]".to_string()),
                now,
            ],
        ).map_err(|e| format!("Failed to create crisis: {}", e))?;

        Ok(serde_json::json!({ "id": id, "title": title, "status": "active", "created_at": now }))
    })
}

#[tauri::command]
pub fn list_world_crises(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, description, crisis_type, severity, affected_regions_json, escalation_timeline_json, current_phase, resolution_conditions_json, consequences_json, status, created_at, resolved_at FROM world_crises WHERE campaign_id = ?1 ORDER BY severity DESC, created_at DESC"
        ).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "crisis_type": row.get::<_, String>(3).unwrap_or_default(),
                "severity": row.get::<_, i64>(4).unwrap_or(5),
                "affected_regions_json": row.get::<_, String>(5).unwrap_or_else(|_| "[]".to_string()),
                "escalation_timeline_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "current_phase": row.get::<_, i64>(7).unwrap_or(1),
                "resolution_conditions_json": row.get::<_, String>(8).unwrap_or_else(|_| "[]".to_string()),
                "consequences_json": row.get::<_, String>(9).unwrap_or_else(|_| "[]".to_string()),
                "status": row.get::<_, String>(10).unwrap_or_default(),
                "created_at": row.get::<_, i64>(11).unwrap_or(0),
                "resolved_at": row.get::<_, Option<i64>>(12).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read crises: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn escalate_crisis(
    crisis_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        conn.execute(
            "UPDATE world_crises SET current_phase = current_phase + 1, severity = MIN(10, severity + 1) WHERE id = ?1 AND status = 'active'",
            params![crisis_id],
        ).map_err(|e| format!("Failed to escalate crisis: {}", e))?;

        let phase: i64 = conn.query_row(
            "SELECT current_phase FROM world_crises WHERE id = ?1",
            params![crisis_id],
            |row| row.get(0),
        ).unwrap_or(1);

        Ok(serde_json::json!({ "crisis_id": crisis_id, "new_phase": phase }))
    })
}

#[tauri::command]
pub fn resolve_crisis(
    crisis_id: String,
    consequences_json: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "UPDATE world_crises SET status = 'resolved', consequences_json = ?1, resolved_at = ?2 WHERE id = ?3",
            params![consequences_json, now, crisis_id],
        ).map_err(|e| format!("Failed to resolve crisis: {}", e))?;
        Ok(())
    })
}

#[tauri::command]
pub fn delete_crisis(
    crisis_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM world_crises WHERE id = ?1", params![crisis_id])
            .map_err(|e| format!("Failed to delete crisis: {}", e))?;
        Ok(())
    })
}

// ════════════════════════════════════════════════════════════════════════
// Artifact Evolution (Phase 9G)
// ════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn create_artifact_profile(
    item_name: String,
    wielder: Option<String>,
    abilities_json: Option<String>,
    personality_json: Option<String>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO artifact_profiles (id, campaign_id, item_name, wielder, awakening_level, xp_absorbed, xp_to_next, abilities_json, personality_json, wielder_bond, curse_stage, lore_revealed_json, dm_notes, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, 0, 0, 1000, ?5, ?6, 0, 0, '[]', ?7, ?8, ?8)",
            params![
                id, campaign_id, item_name,
                wielder.unwrap_or_default(),
                abilities_json.unwrap_or_else(|| "[]".to_string()),
                personality_json.unwrap_or_else(|| "{}".to_string()),
                dm_notes.unwrap_or_default(),
                now,
            ],
        ).map_err(|e| format!("Failed to create artifact: {}", e))?;

        Ok(serde_json::json!({ "id": id, "item_name": item_name, "created_at": now }))
    })
}

#[tauri::command]
pub fn list_artifact_profiles(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, item_name, wielder, awakening_level, xp_absorbed, xp_to_next, abilities_json, personality_json, wielder_bond, curse_stage, lore_revealed_json, dm_notes, created_at, updated_at FROM artifact_profiles WHERE campaign_id = ?1 ORDER BY item_name"
        ).map_err(|e| format!("Query failed: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "item_name": row.get::<_, String>(1)?,
                "wielder": row.get::<_, String>(2).unwrap_or_default(),
                "awakening_level": row.get::<_, i64>(3).unwrap_or(0),
                "xp_absorbed": row.get::<_, i64>(4).unwrap_or(0),
                "xp_to_next": row.get::<_, i64>(5).unwrap_or(1000),
                "abilities_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "personality_json": row.get::<_, String>(7).unwrap_or_else(|_| "{}".to_string()),
                "wielder_bond": row.get::<_, i64>(8).unwrap_or(0),
                "curse_stage": row.get::<_, i64>(9).unwrap_or(0),
                "lore_revealed_json": row.get::<_, String>(10).unwrap_or_else(|_| "[]".to_string()),
                "dm_notes": row.get::<_, String>(11).unwrap_or_default(),
                "created_at": row.get::<_, i64>(12).unwrap_or(0),
                "updated_at": row.get::<_, i64>(13).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read artifacts: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn add_artifact_xp(
    artifact_id: String,
    xp_amount: i64,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Get current state
        let (current_xp, xp_to_next, level): (i64, i64, i64) = conn.query_row(
            "SELECT xp_absorbed, xp_to_next, awakening_level FROM artifact_profiles WHERE id = ?1",
            params![artifact_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        ).map_err(|e| format!("Artifact not found: {}", e))?;

        let new_xp = current_xp + xp_amount;
        let leveled_up = new_xp >= xp_to_next && level < 5;

        if leveled_up {
            let new_level = level + 1;
            let new_threshold = xp_to_next * 2; // Each level requires double XP
            conn.execute(
                "UPDATE artifact_profiles SET xp_absorbed = ?1, awakening_level = ?2, xp_to_next = ?3, updated_at = ?4 WHERE id = ?5",
                params![new_xp, new_level, new_threshold, now, artifact_id],
            ).map_err(|e| format!("Failed to level artifact: {}", e))?;

            Ok(serde_json::json!({
                "artifact_id": artifact_id,
                "leveled_up": true,
                "new_level": new_level,
                "xp_absorbed": new_xp,
                "xp_to_next": new_threshold,
            }))
        } else {
            conn.execute(
                "UPDATE artifact_profiles SET xp_absorbed = ?1, updated_at = ?2 WHERE id = ?3",
                params![new_xp, now, artifact_id],
            ).map_err(|e| format!("Failed to add artifact XP: {}", e))?;

            Ok(serde_json::json!({
                "artifact_id": artifact_id,
                "leveled_up": false,
                "xp_absorbed": new_xp,
                "xp_to_next": xp_to_next,
                "xp_remaining": xp_to_next - new_xp,
            }))
        }
    })
}

#[tauri::command]
pub fn update_artifact_profile(
    artifact_id: String,
    item_name: String,
    wielder: String,
    abilities_json: String,
    personality_json: String,
    wielder_bond: i64,
    curse_stage: i64,
    lore_revealed_json: String,
    dm_notes: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE artifact_profiles SET item_name=?1, wielder=?2, abilities_json=?3, personality_json=?4, wielder_bond=?5, curse_stage=?6, lore_revealed_json=?7, dm_notes=?8, updated_at=?9 WHERE id=?10",
            params![item_name, wielder, abilities_json, personality_json, wielder_bond, curse_stage, lore_revealed_json, dm_notes, now, artifact_id],
        ).map_err(|e| format!("Failed to update artifact: {}", e))?;

        if rows == 0 { return Err("Artifact not found.".to_string()); }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_artifact_profile(
    artifact_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM artifact_profiles WHERE id = ?1", params![artifact_id])
            .map_err(|e| format!("Failed to delete artifact: {}", e))?;
        Ok(())
    })
}
