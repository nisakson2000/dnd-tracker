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

// ── Create a memory for an NPC ──
#[tauri::command]
pub fn create_npc_memory(
    npc_id: String,
    memory_type: String,
    event_description: String,
    emotional_impact: String,
    intensity: i64,
    session_number: i64,
    actors_json: Option<String>,
    tags_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let actors = actors_json.unwrap_or_else(|| "[]".to_string());
    let tags = tags_json.unwrap_or_else(|| "[]".to_string());
    // Higher intensity = slower decay
    let decay_rate = if intensity >= 8 { 0.0 } else { 1.0 - (intensity as f64 * 0.1) };

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO npc_memories (id, campaign_id, npc_id, memory_type, event_description, emotional_impact, intensity, session_number, actors_json, tags_json, decay_rate, is_forgotten, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 0, ?12)",
            params![id, campaign_id, npc_id, memory_type, event_description, emotional_impact, intensity, session_number, actors, tags, decay_rate, now],
        ).map_err(|e| format!("Failed to create NPC memory: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "npc_id": npc_id,
            "memory_type": memory_type,
            "event_description": event_description,
            "emotional_impact": emotional_impact,
            "intensity": intensity,
            "session_number": session_number,
            "actors_json": actors,
            "tags_json": tags,
            "decay_rate": decay_rate,
            "is_forgotten": false,
            "created_at": now,
        }))
    })
}

// ── List memories for an NPC ──
#[tauri::command]
pub fn list_npc_memories(
    npc_id: String,
    include_forgotten: Option<bool>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;
    let show_forgotten = include_forgotten.unwrap_or(false);

    with_campaign_conn(&state, |conn| {
        let query = if show_forgotten {
            "SELECT id, memory_type, event_description, emotional_impact, intensity, session_number, actors_json, tags_json, decay_rate, is_forgotten, created_at FROM npc_memories WHERE campaign_id = ?1 AND npc_id = ?2 ORDER BY created_at DESC"
        } else {
            "SELECT id, memory_type, event_description, emotional_impact, intensity, session_number, actors_json, tags_json, decay_rate, is_forgotten, created_at FROM npc_memories WHERE campaign_id = ?1 AND npc_id = ?2 AND is_forgotten = 0 ORDER BY created_at DESC"
        };

        let mut stmt = conn.prepare(query)
            .map_err(|e| format!("Failed to query NPC memories: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id, npc_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "memory_type": row.get::<_, String>(1).unwrap_or_default(),
                "event_description": row.get::<_, String>(2).unwrap_or_default(),
                "emotional_impact": row.get::<_, String>(3).unwrap_or_default(),
                "intensity": row.get::<_, i64>(4).unwrap_or(5),
                "session_number": row.get::<_, i64>(5).unwrap_or(0),
                "actors_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "tags_json": row.get::<_, String>(7).unwrap_or_else(|_| "[]".to_string()),
                "decay_rate": row.get::<_, f64>(8).unwrap_or(0.5),
                "is_forgotten": row.get::<_, i64>(9).unwrap_or(0) != 0,
                "created_at": row.get::<_, i64>(10).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read NPC memories: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

// ── Delete a memory ──
#[tauri::command]
pub fn delete_npc_memory(
    memory_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM npc_memories WHERE id = ?1", params![memory_id])
            .map_err(|e| format!("Failed to delete NPC memory: {}", e))?;
        Ok(())
    })
}

// ── Decay memories (run once per session advance) ──
#[tauri::command]
pub fn decay_npc_memories(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        // Reduce intensity by decay_rate for all non-traumatic memories
        conn.execute(
            "UPDATE npc_memories SET intensity = MAX(0, intensity - CAST(decay_rate AS INTEGER))
             WHERE campaign_id = ?1 AND is_forgotten = 0 AND decay_rate > 0",
            params![campaign_id],
        ).map_err(|e| format!("Failed to decay memories: {}", e))?;

        // Mark memories below threshold as forgotten
        let forgotten = conn.execute(
            "UPDATE npc_memories SET is_forgotten = 1
             WHERE campaign_id = ?1 AND is_forgotten = 0 AND intensity <= 1 AND decay_rate > 0",
            params![campaign_id],
        ).map_err(|e| format!("Failed to mark forgotten memories: {}", e))?;

        Ok(serde_json::json!({
            "memories_forgotten": forgotten,
        }))
    })
}

// ── Update NPC personality data ──
#[tauri::command]
pub fn update_npc_personality(
    npc_id: String,
    personality_json: String,
    motivations_json: String,
    fear_courage: Option<i64>,
    intelligence: Option<i64>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let fear_courage = fear_courage.unwrap_or(50);
    let intelligence = intelligence.unwrap_or(10);

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_npcs SET personality_json = ?1, motivations_json = ?2, fear_courage = ?3, intelligence = ?4 WHERE id = ?5",
            params![personality_json, motivations_json, fear_courage, intelligence, npc_id],
        ).map_err(|e| format!("Failed to update NPC personality: {}", e))?;

        if rows == 0 {
            return Err("NPC not found.".to_string());
        }
        Ok(())
    })
}

// ── Update NPC trust score ──
#[tauri::command]
pub fn update_npc_trust(
    npc_id: String,
    trust_score: i64,
    state: State<'_, AppState>,
) -> Result<(), String> {
    // Clamp to -100..100
    let clamped = trust_score.max(-100).min(100);

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE campaign_npcs SET trust_score = ?1 WHERE id = ?2",
            params![clamped, npc_id],
        ).map_err(|e| format!("Failed to update NPC trust: {}", e))?;

        if rows == 0 {
            return Err("NPC not found.".to_string());
        }
        Ok(())
    })
}

// ── Get NPC with full intelligence data ──
#[tauri::command]
pub fn get_npc_intelligence(
    npc_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        let result = conn.query_row(
            "SELECT id, name, role, disposition, disposition_score, trust_score, fear_courage, intelligence, personality_json, motivations_json, faction_id
             FROM campaign_npcs WHERE id = ?1",
            params![npc_id],
            |row| {
                Ok(serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "role": row.get::<_, String>(2).unwrap_or_default(),
                    "disposition": row.get::<_, String>(3).unwrap_or_else(|_| "Neutral".to_string()),
                    "disposition_score": row.get::<_, i64>(4).unwrap_or(0),
                    "trust_score": row.get::<_, i64>(5).unwrap_or(0),
                    "fear_courage": row.get::<_, i64>(6).unwrap_or(50),
                    "intelligence": row.get::<_, i64>(7).unwrap_or(10),
                    "personality_json": row.get::<_, String>(8).unwrap_or_else(|_| "{}".to_string()),
                    "motivations_json": row.get::<_, String>(9).unwrap_or_else(|_| "[]".to_string()),
                    "faction_id": row.get::<_, String>(10).unwrap_or_default(),
                }))
            },
        ).map_err(|e| format!("NPC not found: {}", e))?;

        Ok(result)
    })
}
