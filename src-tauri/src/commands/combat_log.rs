use rusqlite::params;
use serde::Serialize;
use tauri::State;
use uuid::Uuid;

use crate::campaign_db;
use crate::db::AppState;

/// Helper: ensure the campaign_conn is initialized.
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

fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| {
        "Campaign state is temporarily busy.".to_string()
    })?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

#[derive(Serialize)]
pub struct CombatLogEntry {
    pub id: String,
    pub campaign_id: String,
    pub session_id: String,
    pub round: i64,
    pub turn_order: i64,
    pub entry_type: String,
    pub actor_name: String,
    pub target_name: String,
    pub description: String,
    pub details_json: String,
    pub ts: i64,
}

/// Insert a combat log entry.
#[tauri::command]
pub fn insert_combat_log(
    session_id: String,
    round: i64,
    turn_order: i64,
    entry_type: String,
    actor_name: String,
    target_name: String,
    description: String,
    details_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let details = details_json.unwrap_or_else(|| "{}".to_string());

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO combat_log (id, campaign_id, session_id, round, turn_order, entry_type, actor_name, target_name, description, details_json, ts)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
            params![id, campaign_id, session_id, round, turn_order, entry_type, actor_name, target_name, description, details, now],
        ).map_err(|e| format!("Failed to insert combat log: {}", e))?;
        Ok(id)
    })
}

/// Get combat log entries for a session (most recent first).
#[tauri::command]
pub fn get_combat_log(
    session_id: Option<String>,
    limit: Option<i64>,
    state: State<'_, AppState>,
) -> Result<Vec<CombatLogEntry>, String> {
    let campaign_id = require_active_campaign(&state)?;
    let max = limit.unwrap_or(100);

    with_campaign_conn(&state, |conn| {
        let (sql, params_vec): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref sid) = session_id {
            (
                "SELECT id, campaign_id, session_id, round, turn_order, entry_type, actor_name, target_name, description, details_json, ts
                 FROM combat_log WHERE campaign_id = ?1 AND session_id = ?2 ORDER BY ts DESC LIMIT ?3".to_string(),
                vec![
                    Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>,
                    Box::new(sid.clone()),
                    Box::new(max),
                ],
            )
        } else {
            (
                "SELECT id, campaign_id, session_id, round, turn_order, entry_type, actor_name, target_name, description, details_json, ts
                 FROM combat_log WHERE campaign_id = ?1 ORDER BY ts DESC LIMIT ?2".to_string(),
                vec![
                    Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>,
                    Box::new(max),
                ],
            )
        };

        let mut stmt = conn.prepare(&sql).map_err(|e| format!("Failed to prepare combat log query: {}", e))?;
        let params_refs: Vec<&dyn rusqlite::types::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();
        let rows = stmt.query_map(params_refs.as_slice(), |row| {
            Ok(CombatLogEntry {
                id: row.get(0)?,
                campaign_id: row.get(1)?,
                session_id: row.get::<_, Option<String>>(2)?.unwrap_or_default(),
                round: row.get(3)?,
                turn_order: row.get(4)?,
                entry_type: row.get(5)?,
                actor_name: row.get(6)?,
                target_name: row.get::<_, Option<String>>(7)?.unwrap_or_default(),
                description: row.get(8)?,
                details_json: row.get::<_, Option<String>>(9)?.unwrap_or_else(|| "{}".to_string()),
                ts: row.get(10)?,
            })
        }).map_err(|e| format!("Failed to query combat log: {}", e))?;

        let mut entries = Vec::new();
        for row in rows {
            entries.push(row.map_err(|e| format!("Failed to read combat log row: {}", e))?);
        }
        Ok(entries)
    })
}

/// Clear combat log for a session.
#[tauri::command]
pub fn clear_combat_log(
    session_id: Option<String>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        if let Some(sid) = session_id {
            conn.execute(
                "DELETE FROM combat_log WHERE campaign_id = ?1 AND session_id = ?2",
                params![campaign_id, sid],
            ).map_err(|e| format!("Failed to clear combat log: {}", e))?;
        } else {
            conn.execute(
                "DELETE FROM combat_log WHERE campaign_id = ?1",
                params![campaign_id],
            ).map_err(|e| format!("Failed to clear combat log: {}", e))?;
        }
        Ok(())
    })
}
