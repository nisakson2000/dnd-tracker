use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_helpers::{with_campaign_conn, require_active_campaign};
use crate::db::AppState;

// ── Create a consequence ──
#[tauri::command]
pub fn create_consequence(
    trigger_action: String,
    trigger_actor: String,
    consequence_type: String,
    severity: String,
    description: String,
    target_type: Option<String>,
    target_id: Option<String>,
    mechanical_effect_json: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();
    let target_type = target_type.unwrap_or_default();
    let target_id = target_id.unwrap_or_default();
    let effect = mechanical_effect_json.unwrap_or_else(|| "{}".to_string());

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO consequences (id, campaign_id, trigger_action, trigger_actor, consequence_type, severity, description, target_type, target_id, mechanical_effect_json, status, dm_approved, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'pending', 0, ?11)",
            params![id, campaign_id, trigger_action, trigger_actor, consequence_type, severity, description, target_type, target_id, effect, now],
        ).map_err(|e| format!("Failed to create consequence: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "campaign_id": campaign_id,
            "trigger_action": trigger_action,
            "trigger_actor": trigger_actor,
            "consequence_type": consequence_type,
            "severity": severity,
            "description": description,
            "target_type": target_type,
            "target_id": target_id,
            "mechanical_effect_json": effect,
            "status": "pending",
            "dm_approved": false,
            "created_at": now,
        }))
    })
}

// ── List consequences (pending, approved, or all) ──
#[tauri::command]
pub fn list_consequences(
    status_filter: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let (query, filter_params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = match status_filter.as_deref() {
            Some(status) => (
                "SELECT id, trigger_action, trigger_actor, consequence_type, severity, description, target_type, target_id, mechanical_effect_json, status, dm_approved, created_at, resolved_at FROM consequences WHERE campaign_id = ?1 AND status = ?2 ORDER BY created_at DESC".to_string(),
                vec![Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>, Box::new(status.to_string())],
            ),
            None => (
                "SELECT id, trigger_action, trigger_actor, consequence_type, severity, description, target_type, target_id, mechanical_effect_json, status, dm_approved, created_at, resolved_at FROM consequences WHERE campaign_id = ?1 ORDER BY created_at DESC".to_string(),
                vec![Box::new(campaign_id.clone()) as Box<dyn rusqlite::types::ToSql>],
            ),
        };

        let mut stmt = conn.prepare(&query)
            .map_err(|e| format!("Failed to query consequences: {}", e))?;

        let param_refs: Vec<&dyn rusqlite::types::ToSql> = filter_params.iter().map(|p| p.as_ref()).collect();

        let rows: Vec<serde_json::Value> = stmt.query_map(param_refs.as_slice(), |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "trigger_action": row.get::<_, String>(1).unwrap_or_default(),
                "trigger_actor": row.get::<_, String>(2).unwrap_or_default(),
                "consequence_type": row.get::<_, String>(3).unwrap_or_default(),
                "severity": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "target_type": row.get::<_, String>(6).unwrap_or_default(),
                "target_id": row.get::<_, String>(7).unwrap_or_default(),
                "mechanical_effect_json": row.get::<_, String>(8).unwrap_or_else(|_| "{}".to_string()),
                "status": row.get::<_, String>(9).unwrap_or_else(|_| "pending".to_string()),
                "dm_approved": row.get::<_, i64>(10).unwrap_or(0) != 0,
                "created_at": row.get::<_, i64>(11).unwrap_or(0),
                "resolved_at": row.get::<_, Option<i64>>(12).unwrap_or(None),
            }))
        }).map_err(|e| format!("Failed to read consequences: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

// ── Approve a consequence ──
#[tauri::command]
pub fn approve_consequence(
    consequence_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE consequences SET dm_approved = 1, status = 'approved' WHERE id = ?1",
            params![consequence_id],
        ).map_err(|e| format!("Failed to approve consequence: {}", e))?;

        if rows == 0 {
            return Err("Consequence not found.".to_string());
        }
        Ok(())
    })
}

// ── Dismiss a consequence ──
#[tauri::command]
pub fn dismiss_consequence(
    consequence_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE consequences SET status = 'dismissed' WHERE id = ?1",
            params![consequence_id],
        ).map_err(|e| format!("Failed to dismiss consequence: {}", e))?;

        if rows == 0 {
            return Err("Consequence not found.".to_string());
        }
        Ok(())
    })
}

// ── Resolve a consequence (mark as applied) ──
#[tauri::command]
pub fn resolve_consequence(
    consequence_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE consequences SET status = 'resolved', resolved_at = ?1 WHERE id = ?2",
            params![now, consequence_id],
        ).map_err(|e| format!("Failed to resolve consequence: {}", e))?;

        if rows == 0 {
            return Err("Consequence not found.".to_string());
        }
        Ok(())
    })
}

// ── Delete a consequence ──
#[tauri::command]
pub fn delete_consequence(
    consequence_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    with_campaign_conn(&state, |conn| {
        conn.execute("DELETE FROM consequences WHERE id = ?1", params![consequence_id])
            .map_err(|e| format!("Failed to delete consequence: {}", e))?;
        Ok(())
    })
}
