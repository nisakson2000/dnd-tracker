use rusqlite::params;
use tauri::{Manager, State};
use uuid::Uuid;

use crate::campaign_helpers::with_campaign_conn;
use crate::db::AppState;

/// Add a monster to an encounter.
#[tauri::command]
pub fn add_monster_to_encounter(
    encounter_id: String,
    name: String,
    hp_max: i32,
    ac: i32,
    stat_block_json: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();

    with_campaign_conn(&state, |conn| {
        // Verify encounter exists
        let exists: bool = conn.query_row(
            "SELECT COUNT(*) > 0 FROM encounters WHERE id = ?1",
            params![encounter_id],
            |row| row.get(0),
        ).unwrap_or(false);

        if !exists {
            return Err("Encounter not found.".to_string());
        }

        conn.execute(
            "INSERT INTO monsters (id, encounter_id, name, hp_current, hp_max, ac, conditions_json, stat_block_json, alive) \
             VALUES (?1, ?2, ?3, ?4, ?4, ?5, '[]', ?6, 1)",
            params![id, encounter_id, name, hp_max, ac, stat_block_json],
        ).map_err(|e| format!("Failed to add monster: {}", e))?;

        Ok(id)
    })
}

/// Remove a monster from an encounter.
#[tauri::command]
pub fn remove_monster(
    monster_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "DELETE FROM monsters WHERE id = ?1",
            params![monster_id],
        ).map_err(|e| format!("Failed to remove monster: {}", e))?;

        if rows == 0 {
            return Err("Monster not found.".to_string());
        }
        Ok(())
    })
}

/// Apply HP delta to a monster. Returns new HP and monster name.
#[tauri::command]
pub fn update_monster_hp(
    monster_id: String,
    hp_delta: i32,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        let (name, hp_current, hp_max): (String, i32, i32) = conn.query_row(
            "SELECT name, hp_current, hp_max FROM monsters WHERE id = ?1",
            params![monster_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        ).map_err(|_| "Monster not found.".to_string())?;

        let new_hp = (hp_current + hp_delta).max(0).min(hp_max);

        conn.execute(
            "UPDATE monsters SET hp_current = ?1 WHERE id = ?2",
            params![new_hp, monster_id],
        ).map_err(|e| format!("Failed to update monster HP: {}", e))?;

        Ok(serde_json::json!({
            "new_hp": new_hp,
            "hp_max": hp_max,
            "monster_name": name,
            "monster_id": monster_id,
        }))
    })
}

/// Kill a monster (set alive = 0). Returns monster name for broadcast.
#[tauri::command]
pub fn kill_monster(
    monster_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    with_campaign_conn(&state, |conn| {
        let name: String = conn.query_row(
            "SELECT name FROM monsters WHERE id = ?1",
            params![monster_id],
            |row| row.get(0),
        ).unwrap_or_else(|_| "Unknown".to_string());

        let rows = conn.execute(
            "UPDATE monsters SET alive = 0, hp_current = 0 WHERE id = ?1",
            params![monster_id],
        ).map_err(|e| format!("Failed to kill monster: {}", e))?;

        if rows == 0 {
            return Err("Monster not found.".to_string());
        }
        Ok(serde_json::json!({
            "monster_id": monster_id,
            "monster_name": name,
        }))
    })
}

/// Get all monsters for an encounter.
#[tauri::command]
pub fn get_encounter_monsters(
    encounter_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, encounter_id, name, hp_current, hp_max, ac, conditions_json, stat_block_json, alive \
             FROM monsters WHERE encounter_id = ?1 ORDER BY name"
        ).map_err(|e| format!("Failed to query monsters: {}", e))?;

        let monsters: Vec<serde_json::Value> = stmt.query_map(params![encounter_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "encounter_id": row.get::<_, String>(1)?,
                "name": row.get::<_, String>(2)?,
                "hp_current": row.get::<_, i32>(3)?,
                "hp_max": row.get::<_, i32>(4)?,
                "ac": row.get::<_, i32>(5).unwrap_or(10),
                "conditions_json": row.get::<_, String>(6).unwrap_or_else(|_| "[]".to_string()),
                "stat_block_json": row.get::<_, Option<String>>(7).unwrap_or(None),
                "alive": row.get::<_, i32>(8).unwrap_or(1) != 0,
            }))
        }).map_err(|e| format!("Failed to read monsters: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        Ok(monsters)
    })
}

/// Search bundled SRD monsters.
#[tauri::command]
pub fn search_srd_monsters(
    query: String,
    app: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    // Suppress unused variable warning - state is required for Tauri command pattern
    let _ = &state;

    let query_lower = query.to_lowercase();

    // Try to load SRD monsters from bundled resources
    let monsters = load_srd_monsters(&app)?;

    let results: Vec<serde_json::Value> = monsters
        .iter()
        .filter(|m| {
            let name = m.get("name").and_then(|n| n.as_str()).unwrap_or("");
            let mtype = m.get("type").and_then(|t| t.as_str()).unwrap_or("");
            let cr = m.get("cr").and_then(|c| c.as_str()).unwrap_or("");
            name.to_lowercase().contains(&query_lower)
                || mtype.to_lowercase().contains(&query_lower)
                || cr == query_lower
        })
        .cloned()
        .collect();

    Ok(results)
}

fn load_srd_monsters(app: &tauri::AppHandle) -> Result<Vec<serde_json::Value>, String> {
    // Try resource dir first (production), then fallback to relative path (dev)
    let resource_path = app.path().resource_dir()
        .map(|d: std::path::PathBuf| d.join("resources").join("srd_monsters.json"))
        .map_err(|e| format!("Failed to resolve resource dir: {}", e))?;

    let data = if resource_path.exists() {
        std::fs::read_to_string(&resource_path)
            .map_err(|e| format!("Failed to read SRD monsters: {}", e))?
    } else {
        // Dev fallback: try relative to executable
        let alt_path = std::path::PathBuf::from("resources").join("srd_monsters.json");
        if alt_path.exists() {
            std::fs::read_to_string(&alt_path)
                .map_err(|e| format!("Failed to read SRD monsters (dev): {}", e))?
        } else {
            // Inline minimal fallback
            return Ok(Vec::new());
        }
    };

    let monsters: Vec<serde_json::Value> = serde_json::from_str(&data)
        .map_err(|e| format!("Failed to parse SRD monsters JSON: {}", e))?;

    Ok(monsters)
}
