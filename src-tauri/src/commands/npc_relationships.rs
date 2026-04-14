use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

// ── Create a relationship between two NPCs ──
#[tauri::command]
pub fn create_npc_relationship(
    npc_id_a: String,
    npc_id_b: String,
    relationship_type: String,
    label: Option<String>,
    description: Option<String>,
    strength: Option<i64>,
    is_secret: Option<bool>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let label = label.unwrap_or_default();
    let description = description.unwrap_or_default();
    let strength = strength.unwrap_or(50);
    let is_secret = if is_secret.unwrap_or(false) { 1 } else { 0 };
    let dm_notes = dm_notes.unwrap_or_default();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO npc_relationships (id, campaign_id, npc_id_a, npc_id_b, relationship_type, label, description, strength, is_secret, dm_notes, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![id, campaign_id, npc_id_a, npc_id_b, relationship_type, label, description, strength, is_secret, dm_notes, now, now],
        ).map_err(|e| format!("Failed to create NPC relationship: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "npc_id_a": npc_id_a,
            "npc_id_b": npc_id_b,
            "relationship_type": relationship_type,
            "label": label,
            "description": description,
            "strength": strength,
            "is_secret": is_secret == 1,
            "dm_notes": dm_notes,
            "created_at": now,
            "updated_at": now,
        }))
    })
}

// ── List all relationships for a campaign ──
#[tauri::command]
pub fn list_npc_relationships(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT r.id, r.npc_id_a, r.npc_id_b, r.relationship_type, r.label, r.description,
                    r.strength, r.is_secret, r.dm_notes, r.created_at, r.updated_at,
                    a.name AS name_a, b.name AS name_b
             FROM npc_relationships r
             LEFT JOIN campaign_npcs a ON r.npc_id_a = a.id
             LEFT JOIN campaign_npcs b ON r.npc_id_b = b.id
             WHERE r.campaign_id = ?1
             ORDER BY r.created_at DESC"
        ).map_err(|e| format!("Failed to prepare query: {}", e))?;

        let rows = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "npc_id_a": row.get::<_, String>(1)?,
                "npc_id_b": row.get::<_, String>(2)?,
                "relationship_type": row.get::<_, String>(3)?,
                "label": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "strength": row.get::<_, i64>(6).unwrap_or(50),
                "is_secret": row.get::<_, i64>(7).unwrap_or(0) == 1,
                "dm_notes": row.get::<_, String>(8).unwrap_or_default(),
                "created_at": row.get::<_, i64>(9)?,
                "updated_at": row.get::<_, i64>(10)?,
                "name_a": row.get::<_, String>(11).unwrap_or_else(|_| "Unknown".to_string()),
                "name_b": row.get::<_, String>(12).unwrap_or_else(|_| "Unknown".to_string()),
            }))
        }).map_err(|e| format!("Failed to query relationships: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read row: {}", e))?);
        }
        Ok(results)
    })
}

// ── Get all relationships for a specific NPC ──
#[tauri::command]
pub fn get_npc_relationships(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT r.id, r.npc_id_a, r.npc_id_b, r.relationship_type, r.label, r.description,
                    r.strength, r.is_secret, r.dm_notes, r.created_at, r.updated_at,
                    a.name AS name_a, b.name AS name_b
             FROM npc_relationships r
             LEFT JOIN campaign_npcs a ON r.npc_id_a = a.id
             LEFT JOIN campaign_npcs b ON r.npc_id_b = b.id
             WHERE r.campaign_id = ?1 AND (r.npc_id_a = ?2 OR r.npc_id_b = ?2)
             ORDER BY r.strength DESC"
        ).map_err(|e| format!("Failed to prepare query: {}", e))?;

        let rows = stmt.query_map(params![campaign_id, npc_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "npc_id_a": row.get::<_, String>(1)?,
                "npc_id_b": row.get::<_, String>(2)?,
                "relationship_type": row.get::<_, String>(3)?,
                "label": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "strength": row.get::<_, i64>(6).unwrap_or(50),
                "is_secret": row.get::<_, i64>(7).unwrap_or(0) == 1,
                "dm_notes": row.get::<_, String>(8).unwrap_or_default(),
                "created_at": row.get::<_, i64>(9)?,
                "updated_at": row.get::<_, i64>(10)?,
                "name_a": row.get::<_, String>(11).unwrap_or_else(|_| "Unknown".to_string()),
                "name_b": row.get::<_, String>(12).unwrap_or_else(|_| "Unknown".to_string()),
            }))
        }).map_err(|e| format!("Failed to query relationships: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read row: {}", e))?);
        }
        Ok(results)
    })
}

// ── Update a relationship ──
#[tauri::command]
pub fn update_npc_relationship(
    relationship_id: String,
    relationship_type: Option<String>,
    label: Option<String>,
    description: Option<String>,
    strength: Option<i64>,
    is_secret: Option<bool>,
    dm_notes: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let _campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let mut set_clauses: Vec<String> = Vec::new();
        let mut param_values: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

        if let Some(v) = relationship_type {
            set_clauses.push(format!("relationship_type = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(v));
        }
        if let Some(v) = label {
            set_clauses.push(format!("label = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(v));
        }
        if let Some(v) = description {
            set_clauses.push(format!("description = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(v));
        }
        if let Some(v) = strength {
            set_clauses.push(format!("strength = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(v));
        }
        if let Some(v) = is_secret {
            let secret_int: i64 = if v { 1 } else { 0 };
            set_clauses.push(format!("is_secret = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(secret_int));
        }
        if let Some(v) = dm_notes {
            set_clauses.push(format!("dm_notes = ?{}", set_clauses.len() + 1));
            param_values.push(Box::new(v));
        }

        if set_clauses.is_empty() {
            return Ok(serde_json::json!({ "id": relationship_id, "updated_at": now }));
        }

        // Always set updated_at
        set_clauses.push(format!("updated_at = ?{}", set_clauses.len() + 1));
        param_values.push(Box::new(now));

        let id_param_idx = set_clauses.len() + 1;
        let sql = format!(
            "UPDATE npc_relationships SET {} WHERE id = ?{}",
            set_clauses.join(", "),
            id_param_idx
        );
        param_values.push(Box::new(relationship_id.clone()));

        let params_ref: Vec<&dyn rusqlite::types::ToSql> = param_values.iter().map(|p| p.as_ref()).collect();
        conn.execute(&sql, params_ref.as_slice())
            .map_err(|e| format!("Failed to update relationship: {}", e))?;

        Ok(serde_json::json!({ "id": relationship_id, "updated_at": now }))
    })
}

// ── Delete a relationship ──
#[tauri::command]
pub fn delete_npc_relationship(
    relationship_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let _campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM npc_relationship_events WHERE relationship_id = ?1", params![relationship_id])
            .map_err(|e| format!("Failed to delete relationship events: {}", e))?;
        conn.execute("DELETE FROM npc_relationships WHERE id = ?1", params![relationship_id])
            .map_err(|e| format!("Failed to delete relationship: {}", e))?;

        Ok(serde_json::json!({ "deleted": relationship_id }))
    })
}

// ── Add an event to a relationship (trust change, interaction, etc.) ──
#[tauri::command]
pub fn add_relationship_event(
    relationship_id: String,
    event_description: String,
    impact: Option<i64>,
    session_number: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let impact = impact.unwrap_or(0);

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO npc_relationship_events (id, campaign_id, relationship_id, event_description, impact, session_number, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![id, campaign_id, relationship_id, event_description, impact, session_number, now],
        ).map_err(|e| format!("Failed to add relationship event: {}", e))?;

        // Update relationship strength based on impact
        if impact != 0 {
            conn.execute(
                "UPDATE npc_relationships SET strength = MIN(100, MAX(0, strength + ?1)), updated_at = ?2 WHERE id = ?3",
                params![impact, now, relationship_id],
            ).map_err(|e| format!("Failed to update relationship strength: {}", e))?;
        }

        Ok(serde_json::json!({
            "id": id,
            "relationship_id": relationship_id,
            "event_description": event_description,
            "impact": impact,
            "session_number": session_number,
            "created_at": now,
        }))
    })
}

// ── Get events for a relationship ──
#[tauri::command]
pub fn list_relationship_events(
    relationship_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let _campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, event_description, impact, session_number, created_at
             FROM npc_relationship_events
             WHERE relationship_id = ?1
             ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to prepare query: {}", e))?;

        let rows = stmt.query_map(params![relationship_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "event_description": row.get::<_, String>(1)?,
                "impact": row.get::<_, i64>(2).unwrap_or(0),
                "session_number": row.get::<_, Option<i64>>(3).unwrap_or(None),
                "created_at": row.get::<_, i64>(4)?,
            }))
        }).map_err(|e| format!("Failed to query events: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read row: {}", e))?);
        }
        Ok(results)
    })
}

// ── Get death cascade — find all NPCs affected when an NPC dies ──
#[tauri::command]
pub fn get_death_cascade(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        // Get the dying NPC's name
        let npc_name: String = conn.query_row(
            "SELECT name FROM campaign_npcs WHERE id = ?1 AND campaign_id = ?2",
            params![npc_id, campaign_id],
            |row| row.get(0),
        ).unwrap_or_else(|_| "Unknown NPC".to_string());

        // Get all relationships involving this NPC
        let mut stmt = conn.prepare(
            "SELECT r.id, r.npc_id_a, r.npc_id_b, r.relationship_type, r.label, r.strength,
                    a.name AS name_a, b.name AS name_b
             FROM npc_relationships r
             LEFT JOIN campaign_npcs a ON r.npc_id_a = a.id
             LEFT JOIN campaign_npcs b ON r.npc_id_b = b.id
             WHERE r.campaign_id = ?1 AND (r.npc_id_a = ?2 OR r.npc_id_b = ?2)"
        ).map_err(|e| format!("Failed to prepare cascade query: {}", e))?;

        let rows = stmt.query_map(params![campaign_id, npc_id], |row| {
            let rel_type: String = row.get(3)?;
            let strength: i64 = row.get::<_, i64>(5).unwrap_or(50);
            let npc_id_a: String = row.get(1)?;
            let other_name = if npc_id_a == npc_id {
                row.get::<_, String>(7).unwrap_or_else(|_| "Unknown".to_string())
            } else {
                row.get::<_, String>(6).unwrap_or_else(|_| "Unknown".to_string())
            };
            let other_id = if npc_id_a == npc_id {
                row.get::<_, String>(2)?
            } else {
                row.get::<_, String>(1)?
            };

            // Determine emotional reaction based on relationship type and strength
            let reaction = match rel_type.as_str() {
                "family" | "romance" | "mentor" => {
                    if strength > 70 { "Devastated — may seek revenge or fall into despair" }
                    else if strength > 40 { "Deeply grieving — will mourn and may change behavior" }
                    else { "Saddened — will attend funeral but life continues" }
                },
                "alliance" | "friend" => {
                    if strength > 70 { "Grief and anger — may seek to avenge or honor their memory" }
                    else { "Mourning — will miss their ally" }
                },
                "employer" | "employee" => {
                    if strength > 50 { "Concerned — power vacuum, seeks replacement or takes over" }
                    else { "Pragmatic — adjusts plans, moves on" }
                },
                "rival" | "enemy" => {
                    if strength > 70 { "Triumphant — celebrates, may claim their territory" }
                    else { "Relieved — one less threat to worry about" }
                },
                "secret" => "Complicated — hidden feelings surface, may reveal the secret",
                _ => "Affected — relationship was meaningful",
            };

            Ok(serde_json::json!({
                "npc_id": other_id,
                "npc_name": other_name,
                "relationship_type": rel_type,
                "strength": strength,
                "reaction": reaction,
            }))
        }).map_err(|e| format!("Failed to query cascade: {}", e))?;

        let mut affected = Vec::new();
        for row in rows {
            affected.push(row.map_err(|e| format!("Failed to read row: {}", e))?);
        }

        // Check for quests involving this NPC (text search by NPC name in title/description)
        let npc_pattern = format!("%{}%", npc_name);
        let mut quest_stmt = conn.prepare(
            "SELECT id, title, status FROM campaign_quests WHERE campaign_id = ?1 AND status != 'completed' AND (title LIKE ?2 OR description LIKE ?2)"
        ).map_err(|e| format!("Failed to prepare quest query: {}", e))?;

        let quest_rows = quest_stmt.query_map(params![campaign_id, npc_pattern], |row| {
            Ok(serde_json::json!({
                "quest_id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "status": row.get::<_, String>(2)?,
            }))
        }).map_err(|e| format!("Failed to query quests: {}", e))?;

        let mut affected_quests = Vec::new();
        for row in quest_rows {
            if let Ok(q) = row {
                affected_quests.push(q);
            }
        }

        Ok(serde_json::json!({
            "deceased_npc": npc_name,
            "deceased_npc_id": npc_id,
            "affected_npcs": affected,
            "potentially_affected_quests": affected_quests,
            "cascade_summary": format!("{} NPCs affected by {}'s death", affected.len(), npc_name),
        }))
    })
}
