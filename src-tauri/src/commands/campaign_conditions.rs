use rusqlite::params;
use tauri::State;

use crate::campaign_db;
use crate::db::AppState;

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

fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Failed to read active campaign.".to_string()
    })?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

/// Apply a condition to a player or monster in the campaign.
/// Returns the target name for broadcast purposes.
#[tauri::command]
pub fn campaign_apply_condition(
    target_id: String,
    condition: String,
    duration: Option<u32>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let now = chrono::Utc::now().timestamp();
        let mut target_name = String::from("Unknown");

        // Try updating player first
        let player_row: Option<(String, String)> = conn.query_row(
            "SELECT display_name, conditions_json FROM players WHERE id = ?1 AND campaign_id = ?2",
            params![target_id, campaign_id],
            |row| Ok((row.get(0)?, row.get::<_, String>(1).unwrap_or_else(|_| "[]".to_string()))),
        ).ok();

        if let Some((name, cond_json)) = player_row {
            target_name = name;
            let mut conditions: Vec<serde_json::Value> = serde_json::from_str(&cond_json)
                .unwrap_or_default();

            // Remove existing condition of the same name
            conditions.retain(|c| c.get("name").and_then(|n| n.as_str()) != Some(&condition));

            // Add new condition
            conditions.push(serde_json::json!({
                "name": condition,
                "duration": duration,
                "rounds_remaining": duration,
            }));

            let new_json = serde_json::to_string(&conditions)
                .map_err(|e| format!("Failed to serialize conditions: {}", e))?;

            conn.execute(
                "UPDATE players SET conditions_json = ?1 WHERE id = ?2",
                params![new_json, target_id],
            ).map_err(|e| format!("Failed to update player conditions: {}", e))?;
        } else {
            // Try monster
            let monster_row: Option<(String, String)> = conn.query_row(
                "SELECT name, conditions_json FROM monsters WHERE id = ?1",
                params![target_id],
                |row| Ok((row.get(0)?, row.get::<_, String>(1).unwrap_or_else(|_| "[]".to_string()))),
            ).ok();

            if let Some((name, cond_json)) = monster_row {
                target_name = name;
                let mut conditions: Vec<serde_json::Value> = serde_json::from_str(&cond_json)
                    .unwrap_or_default();

                conditions.retain(|c| c.get("name").and_then(|n| n.as_str()) != Some(&condition));
                conditions.push(serde_json::json!({
                    "name": condition,
                    "duration": duration,
                    "rounds_remaining": duration,
                }));

                let new_json = serde_json::to_string(&conditions)
                    .map_err(|e| format!("Failed to serialize conditions: {}", e))?;

                conn.execute(
                    "UPDATE monsters SET conditions_json = ?1 WHERE id = ?2",
                    params![new_json, target_id],
                ).map_err(|e| format!("Failed to update monster conditions: {}", e))?;
            } else {
                return Err(format!("Target '{}' not found as player or monster.", target_id));
            }
        }

        // Log event
        let session_id = get_latest_session_id(conn, &campaign_id);
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'condition_applied', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"target_id": target_id, "condition": condition, "duration": duration}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log condition event: {}", e))?;

        Ok(serde_json::json!({
            "target_id": target_id,
            "target_name": target_name,
            "condition": condition,
            "duration": duration,
        }))
    })
}

/// Remove a condition from a player or monster.
/// Returns target name for broadcast purposes.
#[tauri::command]
pub fn campaign_remove_condition(
    target_id: String,
    condition_name: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let now = chrono::Utc::now().timestamp();
        let mut target_name = String::from("Unknown");

        // Try player first
        let player_row: Option<(String, String)> = conn.query_row(
            "SELECT display_name, conditions_json FROM players WHERE id = ?1 AND campaign_id = ?2",
            params![target_id, campaign_id],
            |row| Ok((row.get(0)?, row.get::<_, String>(1).unwrap_or_else(|_| "[]".to_string()))),
        ).ok();

        if let Some((name, cond_json)) = player_row {
            target_name = name;
            let mut conditions: Vec<serde_json::Value> = serde_json::from_str(&cond_json)
                .unwrap_or_default();

            conditions.retain(|c| c.get("name").and_then(|n| n.as_str()) != Some(condition_name.as_str()));

            let new_json = serde_json::to_string(&conditions)
                .map_err(|e| format!("Failed to serialize conditions: {}", e))?;

            conn.execute(
                "UPDATE players SET conditions_json = ?1 WHERE id = ?2",
                params![new_json, target_id],
            ).map_err(|e| format!("Failed to update player conditions: {}", e))?;
        } else {
            // Try monster
            let monster_row: Option<(String, String)> = conn.query_row(
                "SELECT name, conditions_json FROM monsters WHERE id = ?1",
                params![target_id],
                |row| Ok((row.get(0)?, row.get::<_, String>(1).unwrap_or_else(|_| "[]".to_string()))),
            ).ok();

            if let Some((name, cond_json)) = monster_row {
                target_name = name;
                let mut conditions: Vec<serde_json::Value> = serde_json::from_str(&cond_json)
                    .unwrap_or_default();

                conditions.retain(|c| c.get("name").and_then(|n| n.as_str()) != Some(condition_name.as_str()));

                let new_json = serde_json::to_string(&conditions)
                    .map_err(|e| format!("Failed to serialize conditions: {}", e))?;

                conn.execute(
                    "UPDATE monsters SET conditions_json = ?1 WHERE id = ?2",
                    params![new_json, target_id],
                ).map_err(|e| format!("Failed to update monster conditions: {}", e))?;
            } else {
                return Err(format!("Target '{}' not found as player or monster.", target_id));
            }
        }

        // Log event
        let session_id = get_latest_session_id(conn, &campaign_id);
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'condition_removed', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"target_id": target_id, "condition_name": condition_name}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log condition removal: {}", e))?;

        Ok(serde_json::json!({
            "target_id": target_id,
            "target_name": target_name,
            "condition_name": condition_name,
        }))
    })
}

/// Tick all round-based conditions for the active encounter. Returns structured list of expired conditions.
#[tauri::command]
pub fn campaign_tick_conditions(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;
    let mut expired: Vec<serde_json::Value> = Vec::new();

    with_campaign_conn(&state, |conn| {
        // Tick player conditions
        let mut stmt = conn.prepare(
            "SELECT id, display_name, conditions_json FROM players WHERE campaign_id = ?1"
        ).map_err(|e| format!("Failed to query players: {}", e))?;

        let players: Vec<(String, String, String)> = stmt.query_map(params![campaign_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2).unwrap_or_else(|_| "[]".to_string()),
            ))
        }).map_err(|e| format!("Failed to read players: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        for (player_id, display_name, cond_json) in &players {
            let mut conditions: Vec<serde_json::Value> = serde_json::from_str(cond_json)
                .unwrap_or_default();

            let mut changed = false;
            conditions.retain_mut(|c| {
                if let Some(remaining) = c.get("rounds_remaining").and_then(|v| v.as_u64()) {
                    if remaining > 0 {
                        let new_remaining = remaining - 1;
                        if let Some(obj) = c.as_object_mut() {
                            obj.insert("rounds_remaining".to_string(), serde_json::json!(new_remaining));
                        }
                        changed = true;
                        if new_remaining == 0 {
                            let name = c.get("name").and_then(|n| n.as_str()).unwrap_or("unknown");
                            expired.push(serde_json::json!({
                                "target_id": player_id,
                                "target_name": display_name,
                                "condition_name": name,
                            }));
                            return false; // Remove expired condition
                        }
                    }
                }
                true
            });

            if changed {
                let new_json = serde_json::to_string(&conditions)
                    .map_err(|e| format!("Failed to serialize conditions: {}", e))?;
                conn.execute(
                    "UPDATE players SET conditions_json = ?1 WHERE id = ?2",
                    params![new_json, player_id],
                ).map_err(|e| format!("Failed to update player conditions: {}", e))?;
            }
        }

        // Tick monster conditions
        let mut stmt = conn.prepare(
            "SELECT m.id, m.name, m.conditions_json FROM monsters m \
             JOIN encounters e ON m.encounter_id = e.id \
             WHERE e.campaign_id = ?1 AND e.status = 'active' AND m.alive = 1"
        ).map_err(|e| format!("Failed to query monsters: {}", e))?;

        let monsters: Vec<(String, String, String)> = stmt.query_map(params![campaign_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2).unwrap_or_else(|_| "[]".to_string()),
            ))
        }).map_err(|e| format!("Failed to read monsters: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        for (monster_id, monster_name, cond_json) in &monsters {
            let mut conditions: Vec<serde_json::Value> = serde_json::from_str(cond_json)
                .unwrap_or_default();

            let mut changed = false;
            conditions.retain_mut(|c| {
                if let Some(remaining) = c.get("rounds_remaining").and_then(|v| v.as_u64()) {
                    if remaining > 0 {
                        let new_remaining = remaining - 1;
                        if let Some(obj) = c.as_object_mut() {
                            obj.insert("rounds_remaining".to_string(), serde_json::json!(new_remaining));
                        }
                        changed = true;
                        if new_remaining == 0 {
                            let name = c.get("name").and_then(|n| n.as_str()).unwrap_or("unknown");
                            expired.push(serde_json::json!({
                                "target_id": monster_id,
                                "target_name": monster_name,
                                "condition_name": name,
                            }));
                            return false;
                        }
                    }
                }
                true
            });

            if changed {
                let new_json = serde_json::to_string(&conditions)
                    .map_err(|e| format!("Failed to serialize conditions: {}", e))?;
                conn.execute(
                    "UPDATE monsters SET conditions_json = ?1 WHERE id = ?2",
                    params![new_json, monster_id],
                ).map_err(|e| format!("Failed to update monster conditions: {}", e))?;
            }
        }

        Ok(expired)
    })
}

fn get_latest_session_id(conn: &rusqlite::Connection, campaign_id: &str) -> String {
    conn.query_row(
        "SELECT session_id FROM event_log WHERE campaign_id = ?1 AND event_type = 'session_start' ORDER BY ts DESC LIMIT 1",
        params![campaign_id],
        |row| row.get::<_, String>(0),
    ).unwrap_or_else(|_| "no_session".to_string())
}
