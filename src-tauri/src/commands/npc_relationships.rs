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
        if let Some(v) = &relationship_type {
            conn.execute("UPDATE npc_relationships SET relationship_type = ?1, updated_at = ?2 WHERE id = ?3", params![v, now, relationship_id])
                .map_err(|e| format!("Failed to update relationship_type: {}", e))?;
        }
        if let Some(v) = &label {
            conn.execute("UPDATE npc_relationships SET label = ?1, updated_at = ?2 WHERE id = ?3", params![v, now, relationship_id])
                .map_err(|e| format!("Failed to update label: {}", e))?;
        }
        if let Some(v) = &description {
            conn.execute("UPDATE npc_relationships SET description = ?1, updated_at = ?2 WHERE id = ?3", params![v, now, relationship_id])
                .map_err(|e| format!("Failed to update description: {}", e))?;
        }
        if let Some(v) = strength {
            conn.execute("UPDATE npc_relationships SET strength = ?1, updated_at = ?2 WHERE id = ?3", params![v, now, relationship_id])
                .map_err(|e| format!("Failed to update strength: {}", e))?;
        }
        if let Some(v) = is_secret {
            let secret_int = if v { 1 } else { 0 };
            conn.execute("UPDATE npc_relationships SET is_secret = ?1, updated_at = ?2 WHERE id = ?3", params![secret_int, now, relationship_id])
                .map_err(|e| format!("Failed to update is_secret: {}", e))?;
        }
        if let Some(v) = &dm_notes {
            conn.execute("UPDATE npc_relationships SET dm_notes = ?1, updated_at = ?2 WHERE id = ?3", params![v, now, relationship_id])
                .map_err(|e| format!("Failed to update dm_notes: {}", e))?;
        }

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

        // Check for quests involving this NPC
        let mut quest_stmt = conn.prepare(
            "SELECT id, title, status FROM campaign_quests WHERE campaign_id = ?1 AND status != 'completed'"
        ).map_err(|e| format!("Failed to prepare quest query: {}", e))?;

        // Simple text search for NPC name in quest descriptions — not perfect but functional
        let quest_rows = quest_stmt.query_map(params![campaign_id], |row| {
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
