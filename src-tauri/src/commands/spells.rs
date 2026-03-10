use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct SpellData {
    pub id: Option<i64>,
    pub name: String,
    pub level: i64,
    pub school: String,
    pub casting_time: String,
    pub spell_range: String,
    pub components: String,
    pub material: String,
    pub duration: String,
    pub concentration: bool,
    pub ritual: bool,
    pub description: String,
    pub upcast_notes: String,
    pub prepared: bool,
    pub source: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SpellSlotData {
    pub slot_level: i64,
    pub max_slots: i64,
    pub used_slots: i64,
}

#[tauri::command]
pub fn get_spells(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<SpellData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare(
                "SELECT id, name, level, school, casting_time, spell_range, components,
                        material, duration, concentration, ritual, description,
                        upcast_notes, prepared, source
                 FROM spells ORDER BY level, name",
            )
            .map_err(|e| e.to_string())?;
        let spells = stmt
            .query_map([], |row| {
                Ok(SpellData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    level: row.get(2)?,
                    school: row.get(3).unwrap_or_default(),
                    casting_time: row.get(4).unwrap_or_default(),
                    spell_range: row.get(5).unwrap_or_default(),
                    components: row.get(6).unwrap_or_default(),
                    material: row.get(7).unwrap_or_default(),
                    duration: row.get(8).unwrap_or_default(),
                    concentration: row.get::<_, i64>(9).unwrap_or(0) != 0,
                    ritual: row.get::<_, i64>(10).unwrap_or(0) != 0,
                    description: row.get(11).unwrap_or_default(),
                    upcast_notes: row.get(12).unwrap_or_default(),
                    prepared: row.get::<_, i64>(13).unwrap_or(0) != 0,
                    source: row.get(14).unwrap_or_else(|_| "PHB".to_string()),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(spells)
    })
}

#[tauri::command]
pub fn add_spell(
    state: State<'_, AppState>,
    character_id: String,
    payload: SpellData,
) -> Result<SpellData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO spells (name, level, school, casting_time, spell_range, components,
                                 material, duration, concentration, ritual, description,
                                 upcast_notes, prepared, source)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)",
            rusqlite::params![
                payload.name, payload.level, payload.school, payload.casting_time,
                payload.spell_range, payload.components, payload.material, payload.duration,
                payload.concentration as i64, payload.ritual as i64, payload.description,
                payload.upcast_notes, payload.prepared as i64, payload.source,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(SpellData {
            id: Some(id),
            ..payload
        })
    })
}

#[tauri::command]
pub fn update_spell(
    state: State<'_, AppState>,
    character_id: String,
    spell_id: i64,
    payload: SpellData,
) -> Result<SpellData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE spells SET name=?1, level=?2, school=?3, casting_time=?4,
                    spell_range=?5, components=?6, material=?7, duration=?8,
                    concentration=?9, ritual=?10, description=?11, upcast_notes=?12,
                    prepared=?13, source=?14
                 WHERE id=?15",
                rusqlite::params![
                    payload.name, payload.level, payload.school, payload.casting_time,
                    payload.spell_range, payload.components, payload.material, payload.duration,
                    payload.concentration as i64, payload.ritual as i64, payload.description,
                    payload.upcast_notes, payload.prepared as i64, payload.source, spell_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Spell not found".to_string());
        }
        Ok(SpellData {
            id: Some(spell_id),
            ..payload
        })
    })
}

#[tauri::command]
pub fn delete_spell(
    state: State<'_, AppState>,
    character_id: String,
    spell_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM spells WHERE id=?1", [spell_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Spell not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}

#[tauri::command]
pub fn get_spell_slots(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<SpellSlotData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT slot_level, max_slots, used_slots FROM spell_slots ORDER BY slot_level")
            .map_err(|e| e.to_string())?;
        let slots = stmt
            .query_map([], |row| {
                Ok(SpellSlotData {
                    slot_level: row.get(0)?,
                    max_slots: row.get(1)?,
                    used_slots: row.get(2)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(slots)
    })
}

#[tauri::command]
pub fn update_spell_slots(
    state: State<'_, AppState>,
    character_id: String,
    payload: Vec<SpellSlotData>,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        for item in &payload {
            let updated = conn
                .execute(
                    "UPDATE spell_slots SET max_slots=?1, used_slots=?2 WHERE slot_level=?3",
                    rusqlite::params![item.max_slots, item.used_slots, item.slot_level],
                )
                .map_err(|e| e.to_string())?;
            if updated == 0 {
                conn.execute(
                    "INSERT INTO spell_slots (slot_level, max_slots, used_slots) VALUES (?1,?2,?3)",
                    rusqlite::params![item.slot_level, item.max_slots, item.used_slots],
                )
                .map_err(|e| e.to_string())?;
            }
        }
        Ok(serde_json::json!({"status": "saved"}))
    })
}

#[tauri::command]
pub fn reset_spell_slots(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("UPDATE spell_slots SET used_slots=0", [])
            .map_err(|e| e.to_string())?;
        Ok(serde_json::json!({"status": "reset"}))
    })
}
