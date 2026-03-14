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

// ─────────────────────────────────────────────────────────────────────────────
// Faction CRUD
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn create_faction(
    name: String,
    description: String,
    leader: String,
    headquarters: String,
    alignment: String,
    visibility: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_factions (id, campaign_id, name, description, leader, headquarters, alignment, visibility, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![id, campaign_id, name, description, leader, headquarters, alignment, visibility, now, now],
        ).map_err(|e| format!("Failed to create faction: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "name": name,
            "description": description,
            "leader": leader,
            "headquarters": headquarters,
            "alignment": alignment,
            "military": 50,
            "wealth": 50,
            "influence": 50,
            "territory_json": "[]",
            "goals_json": "[]",
            "status": "active",
            "visibility": visibility,
            "created_at": now,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_factions(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, name, description, leader, headquarters, alignment, military, wealth, influence, territory_json, goals_json, status, visibility, created_at, updated_at
             FROM campaign_factions WHERE campaign_id = ?1 ORDER BY name"
        ).map_err(|e| format!("Failed to query factions: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "leader": row.get::<_, String>(3).unwrap_or_default(),
                "headquarters": row.get::<_, String>(4).unwrap_or_default(),
                "alignment": row.get::<_, String>(5).unwrap_or_else(|_| "neutral".to_string()),
                "military": row.get::<_, i64>(6).unwrap_or(50),
                "wealth": row.get::<_, i64>(7).unwrap_or(50),
                "influence": row.get::<_, i64>(8).unwrap_or(50),
                "territory_json": row.get::<_, String>(9).unwrap_or_else(|_| "[]".to_string()),
                "goals_json": row.get::<_, String>(10).unwrap_or_else(|_| "[]".to_string()),
                "status": row.get::<_, String>(11).unwrap_or_else(|_| "active".to_string()),
                "visibility": row.get::<_, String>(12).unwrap_or_else(|_| "dm_only".to_string()),
                "created_at": row.get::<_, i64>(13).unwrap_or(0),
                "updated_at": row.get::<_, i64>(14).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read factions: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn update_faction(
    faction_id: String,
    name: String,
    description: String,
    leader: String,
    headquarters: String,
    alignment: String,
    military: i64,
    wealth: i64,
    influence: i64,
    territory_json: String,
    goals_json: String,
    status: String,
    visibility: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_factions SET name = ?1, description = ?2, leader = ?3, headquarters = ?4, alignment = ?5, military = ?6, wealth = ?7, influence = ?8, territory_json = ?9, goals_json = ?10, status = ?11, visibility = ?12, updated_at = ?13 WHERE id = ?14",
            params![name, description, leader, headquarters, alignment, military, wealth, influence, territory_json, goals_json, status, visibility, now, faction_id],
        ).map_err(|e| format!("Failed to update faction: {}", e))?;

        if rows == 0 {
            return Err("Faction not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_faction(
    faction_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        // Delete related reputation entries
        conn.execute(
            "DELETE FROM faction_reputation WHERE faction_id = ?1",
            params![faction_id],
        ).map_err(|e| format!("Failed to delete faction reputation entries: {}", e))?;

        // Delete related faction relations (both directions)
        conn.execute(
            "DELETE FROM faction_relations WHERE faction_a_id = ?1 OR faction_b_id = ?1",
            params![faction_id],
        ).map_err(|e| format!("Failed to delete faction relations: {}", e))?;

        // Delete the faction itself
        conn.execute(
            "DELETE FROM campaign_factions WHERE id = ?1",
            params![faction_id],
        ).map_err(|e| format!("Failed to delete faction: {}", e))?;

        Ok(())
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Faction Relations
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn set_faction_relation(
    faction_a_id: String,
    faction_b_id: String,
    relation_type: String,
    score: i64,
    notes: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO faction_relations (id, campaign_id, faction_a_id, faction_b_id, relation_type, score, notes, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
             ON CONFLICT(campaign_id, faction_a_id, faction_b_id)
             DO UPDATE SET relation_type = excluded.relation_type, score = excluded.score, notes = excluded.notes, updated_at = excluded.updated_at",
            params![id, campaign_id, faction_a_id, faction_b_id, relation_type, score, notes, now],
        ).map_err(|e| format!("Failed to set faction relation: {}", e))?;

        Ok(serde_json::json!({
            "campaign_id": campaign_id,
            "faction_a_id": faction_a_id,
            "faction_b_id": faction_b_id,
            "relation_type": relation_type,
            "score": score,
            "notes": notes,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_faction_relations(
    faction_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, faction_a_id, faction_b_id, relation_type, score, notes, updated_at
             FROM faction_relations
             WHERE campaign_id = ?1 AND (faction_a_id = ?2 OR faction_b_id = ?2)
             ORDER BY updated_at DESC"
        ).map_err(|e| format!("Failed to query faction relations: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id, faction_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "faction_a_id": row.get::<_, String>(1)?,
                "faction_b_id": row.get::<_, String>(2)?,
                "relation_type": row.get::<_, String>(3).unwrap_or_else(|_| "neutral".to_string()),
                "score": row.get::<_, i64>(4).unwrap_or(0),
                "notes": row.get::<_, String>(5).unwrap_or_default(),
                "updated_at": row.get::<_, i64>(6).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read faction relations: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Faction Reputation (player ↔ faction)
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn set_faction_reputation(
    faction_id: String,
    character_id: String,
    character_name: String,
    score: i64,
    rank: String,
    notes: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO faction_reputation (id, campaign_id, faction_id, character_id, character_name, score, rank, notes, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(campaign_id, faction_id, character_id)
             DO UPDATE SET character_name = excluded.character_name, score = excluded.score, rank = excluded.rank, notes = excluded.notes, updated_at = excluded.updated_at",
            params![id, campaign_id, faction_id, character_id, character_name, score, rank, notes, now],
        ).map_err(|e| format!("Failed to set faction reputation: {}", e))?;

        Ok(serde_json::json!({
            "campaign_id": campaign_id,
            "faction_id": faction_id,
            "character_id": character_id,
            "character_name": character_name,
            "score": score,
            "rank": rank,
            "notes": notes,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_faction_reputations(
    faction_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, character_id, character_name, score, rank, notes, updated_at
             FROM faction_reputation
             WHERE campaign_id = ?1 AND faction_id = ?2
             ORDER BY character_name"
        ).map_err(|e| format!("Failed to query faction reputations: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id, faction_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "faction_id": faction_id,
                "character_id": row.get::<_, String>(1)?,
                "character_name": row.get::<_, String>(2).unwrap_or_default(),
                "score": row.get::<_, i64>(3).unwrap_or(0),
                "rank": row.get::<_, String>(4).unwrap_or_else(|_| "unknown".to_string()),
                "notes": row.get::<_, String>(5).unwrap_or_default(),
                "updated_at": row.get::<_, i64>(6).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read faction reputations: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn get_player_reputations(
    character_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT fr.id, fr.faction_id, cf.name AS faction_name, fr.score, fr.rank, fr.notes, fr.updated_at
             FROM faction_reputation fr
             LEFT JOIN campaign_factions cf ON cf.id = fr.faction_id
             WHERE fr.campaign_id = ?1 AND fr.character_id = ?2
             ORDER BY cf.name"
        ).map_err(|e| format!("Failed to query player reputations: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id, character_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "faction_id": row.get::<_, String>(1)?,
                "faction_name": row.get::<_, String>(2).unwrap_or_default(),
                "character_id": character_id,
                "score": row.get::<_, i64>(3).unwrap_or(0),
                "rank": row.get::<_, String>(4).unwrap_or_else(|_| "unknown".to_string()),
                "notes": row.get::<_, String>(5).unwrap_or_default(),
                "updated_at": row.get::<_, i64>(6).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read player reputations: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}
