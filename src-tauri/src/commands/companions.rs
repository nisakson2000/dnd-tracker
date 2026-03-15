use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct CompanionData {
    pub id: Option<i64>,
    pub name: String,
    pub creature_type: String,
    pub species: String,
    pub hp_current: i64,
    pub hp_max: i64,
    pub ac: i64,
    pub speed: String,
    pub str_score: i64,
    pub dex_score: i64,
    pub con_score: i64,
    pub int_score: i64,
    pub wis_score: i64,
    pub cha_score: i64,
    pub attacks_json: String,
    pub abilities_json: String,
    pub senses: String,
    pub notes: String,
    pub active: i64,
}

#[tauri::command]
pub fn get_companions(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<CompanionData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT id, name, creature_type, species, hp_current, hp_max, ac, speed, str_score, dex_score, con_score, int_score, wis_score, cha_score, attacks_json, abilities_json, senses, notes, active FROM companions ORDER BY name")
            .map_err(|e| e.to_string())?;
        let companions = stmt
            .query_map([], |row| {
                Ok(CompanionData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    creature_type: row.get(2).unwrap_or_else(|_| "familiar".to_string()),
                    species: row.get(3).unwrap_or_default(),
                    hp_current: row.get(4).unwrap_or(1),
                    hp_max: row.get(5).unwrap_or(1),
                    ac: row.get(6).unwrap_or(10),
                    speed: row.get(7).unwrap_or_else(|_| "30 ft.".to_string()),
                    str_score: row.get(8).unwrap_or(10),
                    dex_score: row.get(9).unwrap_or(10),
                    con_score: row.get(10).unwrap_or(10),
                    int_score: row.get(11).unwrap_or(10),
                    wis_score: row.get(12).unwrap_or(10),
                    cha_score: row.get(13).unwrap_or(10),
                    attacks_json: row.get(14).unwrap_or_else(|_| "[]".to_string()),
                    abilities_json: row.get(15).unwrap_or_else(|_| "[]".to_string()),
                    senses: row.get(16).unwrap_or_default(),
                    notes: row.get(17).unwrap_or_default(),
                    active: row.get(18).unwrap_or(1),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(companions)
    })
}

#[tauri::command]
pub fn add_companion(
    state: State<'_, AppState>,
    character_id: String,
    payload: CompanionData,
) -> Result<CompanionData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO companions (name, creature_type, species, hp_current, hp_max, ac, speed, str_score, dex_score, con_score, int_score, wis_score, cha_score, attacks_json, abilities_json, senses, notes, active)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18)",
            rusqlite::params![
                payload.name, payload.creature_type, payload.species,
                payload.hp_current, payload.hp_max, payload.ac, payload.speed,
                payload.str_score, payload.dex_score, payload.con_score,
                payload.int_score, payload.wis_score, payload.cha_score,
                payload.attacks_json, payload.abilities_json,
                payload.senses, payload.notes, payload.active,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(CompanionData { id: Some(id), ..payload })
    })
}

#[tauri::command]
pub fn update_companion(
    state: State<'_, AppState>,
    character_id: String,
    companion_id: i64,
    payload: CompanionData,
) -> Result<CompanionData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE companions SET name=?1, creature_type=?2, species=?3, hp_current=?4, hp_max=?5, ac=?6, speed=?7, str_score=?8, dex_score=?9, con_score=?10, int_score=?11, wis_score=?12, cha_score=?13, attacks_json=?14, abilities_json=?15, senses=?16, notes=?17, active=?18 WHERE id=?19",
                rusqlite::params![
                    payload.name, payload.creature_type, payload.species,
                    payload.hp_current, payload.hp_max, payload.ac, payload.speed,
                    payload.str_score, payload.dex_score, payload.con_score,
                    payload.int_score, payload.wis_score, payload.cha_score,
                    payload.attacks_json, payload.abilities_json,
                    payload.senses, payload.notes, payload.active, companion_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Companion not found".to_string());
        }
        Ok(CompanionData { id: Some(companion_id), ..payload })
    })
}

#[tauri::command]
pub fn delete_companion(
    state: State<'_, AppState>,
    character_id: String,
    companion_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM companions WHERE id=?1", [companion_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Companion not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}
