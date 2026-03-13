use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_db;
use crate::db::AppState;

/// Ensure the campaign_conn is initialized.
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

/// Get the active campaign ID or return an error.
fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Failed to read active campaign.".to_string()
    })?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

#[tauri::command]
pub fn start_session(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let session_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'session_start', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"started_at": now}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log session start: {}", e))?;

        Ok(serde_json::json!({
            "session_id": session_id,
            "campaign_id": campaign_id,
            "started_at": now,
        }))
    })
}

#[tauri::command]
pub fn end_session(
    session_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        // Write session_end event
        conn.execute(
            "INSERT INTO event_log (campaign_id, event_type, payload_json, session_id, ts) VALUES (?1, 'session_end', ?2, ?3, ?4)",
            params![
                campaign_id,
                serde_json::json!({"ended_at": now}).to_string(),
                session_id,
                now,
            ],
        ).map_err(|e| format!("Failed to log session end: {}", e))?;

        // Update campaign last_session timestamp
        conn.execute(
            "UPDATE campaigns SET last_session = ?1, updated_at = ?1 WHERE id = ?2",
            params![now, campaign_id],
        ).map_err(|e| format!("Failed to update campaign last_session: {}", e))?;

        Ok(())
    })
}

#[tauri::command]
pub fn get_session_log(
    session_id: String,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, campaign_id, event_type, payload_json, session_id, ts FROM event_log WHERE session_id = ?1 ORDER BY ts ASC"
        ).map_err(|e| format!("Failed to query session log: {}", e))?;

        let rows = stmt.query_map(params![session_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, i64>(0)?,
                "campaign_id": row.get::<_, String>(1)?,
                "event_type": row.get::<_, String>(2)?,
                "payload_json": row.get::<_, String>(3).unwrap_or_else(|_| "{}".to_string()),
                "session_id": row.get::<_, String>(4)?,
                "ts": row.get::<_, i64>(5)?,
            }))
        }).map_err(|e| format!("Failed to read session log: {}", e))?;

        let mut results = Vec::new();
        for row in rows {
            results.push(row.map_err(|e| format!("Failed to read event row: {}", e))?);
        }
        Ok(results)
    })
}

#[tauri::command]
pub fn generate_session_recap(
    session_id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT event_type, payload_json, ts FROM event_log WHERE session_id = ?1 ORDER BY ts ASC"
        ).map_err(|e| format!("Failed to query session log: {}", e))?;

        let rows: Vec<(String, String, i64)> = stmt.query_map(params![session_id], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1).unwrap_or_else(|_| "{}".to_string()),
                row.get::<_, i64>(2)?,
            ))
        })
        .map_err(|e| format!("Failed to read session log: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        if rows.is_empty() {
            return Ok("# Session Recap\n\n*No events were recorded for this session.*".to_string());
        }

        let mut markdown = String::from("# Session Recap\n\n");
        let mut current_round = 0u32;

        for (event_type, payload_json, ts) in &rows {
            let payload: serde_json::Value = serde_json::from_str(payload_json)
                .unwrap_or(serde_json::json!({}));

            let time_str = {
                let dt = chrono::DateTime::from_timestamp(*ts, 0)
                    .unwrap_or_default();
                dt.format("%H:%M:%S").to_string()
            };

            match event_type.as_str() {
                "session_start" => {
                    markdown.push_str(&format!("**Session Started** at {}\n\n", time_str));
                }
                "session_end" => {
                    markdown.push_str(&format!("\n**Session Ended** at {}\n", time_str));
                }
                "round_start" => {
                    let round = payload["round"].as_u64().unwrap_or(0) as u32;
                    current_round = round;
                    markdown.push_str(&format!("\n---\n\n## Round {}\n\n", round));
                }
                "attack" => {
                    let attacker = payload["attacker"].as_str().unwrap_or("Someone");
                    let target = payload["target"].as_str().unwrap_or("a target");
                    let damage = payload["damage"].as_u64().unwrap_or(0);
                    let weapon = payload["weapon"].as_str().unwrap_or("an attack");
                    markdown.push_str(&format!(
                        "- **{}** attacked **{}** with {} for **{} damage**\n",
                        attacker, target, weapon, damage
                    ));
                }
                "kill" | "death" => {
                    let victim = payload["name"].as_str()
                        .or_else(|| payload["target"].as_str())
                        .unwrap_or("A creature");
                    let killer = payload["killer"].as_str().unwrap_or("");
                    if killer.is_empty() {
                        markdown.push_str(&format!("- **{}** was slain!\n", victim));
                    } else {
                        markdown.push_str(&format!("- **{}** was slain by **{}**!\n", victim, killer));
                    }
                }
                "spell_cast" => {
                    let caster = payload["caster"].as_str().unwrap_or("Someone");
                    let spell = payload["spell"].as_str().unwrap_or("a spell");
                    let target = payload["target"].as_str().unwrap_or("");
                    if target.is_empty() {
                        markdown.push_str(&format!("- **{}** cast **{}**\n", caster, spell));
                    } else {
                        markdown.push_str(&format!("- **{}** cast **{}** on **{}**\n", caster, spell, target));
                    }
                }
                "heal" => {
                    let healer = payload["healer"].as_str().unwrap_or("Someone");
                    let target = payload["target"].as_str().unwrap_or("an ally");
                    let amount = payload["amount"].as_u64().unwrap_or(0);
                    markdown.push_str(&format!(
                        "- **{}** healed **{}** for **{} HP**\n",
                        healer, target, amount
                    ));
                }
                "xp_awarded" => {
                    let amount = payload["amount"].as_u64().unwrap_or(0);
                    let reason = payload["reason"].as_str().unwrap_or("quest completion");
                    markdown.push_str(&format!("- **{} XP** awarded for {}\n", amount, reason));
                }
                "handout_revealed" | "HandoutRevealed" => {
                    let title = payload["title"].as_str().unwrap_or("a handout");
                    markdown.push_str(&format!("- Handout revealed: **{}**\n", title));
                }
                "scene_change" => {
                    let name = payload["name"].as_str()
                        .or_else(|| payload["scene_name"].as_str())
                        .unwrap_or("a new scene");
                    markdown.push_str(&format!("\n### Scene: {}\n\n", name));
                }
                "level_up" => {
                    let player = payload["player"].as_str().unwrap_or("A player");
                    let new_level = payload["new_level"].as_u64().unwrap_or(0);
                    markdown.push_str(&format!("- **{}** reached **Level {}**!\n", player, new_level));
                }
                _ => {
                    // Generic event
                    let desc = payload["description"].as_str()
                        .or_else(|| payload["text"].as_str())
                        .or_else(|| payload["message"].as_str());
                    if let Some(d) = desc {
                        markdown.push_str(&format!("- [{}] {}\n", time_str, d));
                    } else {
                        markdown.push_str(&format!("- [{}] {}\n", time_str, event_type));
                    }
                }
            }
        }

        let _ = current_round; // suppress unused warning
        Ok(markdown)
    })
}
