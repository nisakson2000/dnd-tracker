use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct FeatureData {
    pub id: Option<i64>,
    pub name: String,
    pub source: String,
    pub source_level: i64,
    pub feature_type: String,
    pub description: String,
    pub uses_total: i64,
    pub uses_remaining: i64,
    pub recharge: String,
}

#[tauri::command]
pub fn get_features(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<FeatureData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT id, name, source, source_level, feature_type, description, uses_total, uses_remaining, recharge FROM features")
            .map_err(|e| e.to_string())?;
        let features = stmt
            .query_map([], |row| {
                Ok(FeatureData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    source: row.get(2).unwrap_or_default(),
                    source_level: row.get(3).unwrap_or(0),
                    feature_type: row.get(4).unwrap_or_else(|_| "class".to_string()),
                    description: row.get(5).unwrap_or_default(),
                    uses_total: row.get(6).unwrap_or(0),
                    uses_remaining: row.get(7).unwrap_or(0),
                    recharge: row.get(8).unwrap_or_default(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(features)
    })
}

#[tauri::command]
pub fn add_feature(
    state: State<'_, AppState>,
    character_id: String,
    payload: FeatureData,
) -> Result<FeatureData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO features (name, source, source_level, feature_type, description, uses_total, uses_remaining, recharge)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                payload.name, payload.source, payload.source_level,
                payload.feature_type, payload.description,
                payload.uses_total, payload.uses_remaining, payload.recharge,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(FeatureData { id: Some(id), ..payload })
    })
}

#[tauri::command]
pub fn update_feature(
    state: State<'_, AppState>,
    character_id: String,
    feature_id: i64,
    payload: FeatureData,
) -> Result<FeatureData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE features SET name=?1, source=?2, source_level=?3, feature_type=?4, description=?5, uses_total=?6, uses_remaining=?7, recharge=?8 WHERE id=?9",
                rusqlite::params![
                    payload.name, payload.source, payload.source_level,
                    payload.feature_type, payload.description,
                    payload.uses_total, payload.uses_remaining, payload.recharge,
                    feature_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Feature not found".to_string());
        }
        Ok(FeatureData { id: Some(feature_id), ..payload })
    })
}

#[tauri::command]
pub fn delete_feature(
    state: State<'_, AppState>,
    character_id: String,
    feature_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM features WHERE id=?1", [feature_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Feature not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}
