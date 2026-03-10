use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::{self, AppState};

#[derive(Serialize, Deserialize, Clone)]
pub struct AttackData {
    pub id: Option<i64>,
    pub name: String,
    pub attack_bonus: String,
    pub damage_dice: String,
    pub damage_type: String,
    pub attack_range: String,
    pub notes: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ConditionData {
    pub name: String,
    pub active: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CombatNotesData {
    pub actions: String,
    pub bonus_actions: String,
    pub reactions: String,
    pub legendary_actions: String,
}

#[tauri::command]
pub fn get_attacks(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<AttackData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT id, name, attack_bonus, damage_dice, damage_type, attack_range, notes FROM attacks")
            .map_err(|e| e.to_string())?;
        let attacks = stmt
            .query_map([], |row| {
                Ok(AttackData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    attack_bonus: row.get(2).unwrap_or_else(|_| "+0".to_string()),
                    damage_dice: row.get(3).unwrap_or_else(|_| "1d6".to_string()),
                    damage_type: row.get(4).unwrap_or_default(),
                    attack_range: row.get(5).unwrap_or_default(),
                    notes: row.get(6).unwrap_or_default(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(attacks)
    })
}

#[tauri::command]
pub fn add_attack(
    state: State<'_, AppState>,
    character_id: String,
    payload: AttackData,
) -> Result<AttackData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO attacks (name, attack_bonus, damage_dice, damage_type, attack_range, notes)
             VALUES (?1,?2,?3,?4,?5,?6)",
            rusqlite::params![
                payload.name, payload.attack_bonus, payload.damage_dice,
                payload.damage_type, payload.attack_range, payload.notes,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(AttackData { id: Some(id), ..payload })
    })
}

#[tauri::command]
pub fn update_attack(
    state: State<'_, AppState>,
    character_id: String,
    attack_id: i64,
    payload: AttackData,
) -> Result<AttackData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE attacks SET name=?1, attack_bonus=?2, damage_dice=?3, damage_type=?4, attack_range=?5, notes=?6 WHERE id=?7",
                rusqlite::params![
                    payload.name, payload.attack_bonus, payload.damage_dice,
                    payload.damage_type, payload.attack_range, payload.notes, attack_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Attack not found".to_string());
        }
        Ok(AttackData { id: Some(attack_id), ..payload })
    })
}

#[tauri::command]
pub fn delete_attack(
    state: State<'_, AppState>,
    character_id: String,
    attack_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM attacks WHERE id=?1", [attack_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Attack not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}

#[tauri::command]
pub fn get_conditions(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<ConditionData>, String> {
    state.with_char_conn(&character_id, |conn| {
        db::ensure_conditions(conn).map_err(|e| e.to_string())?;
        let mut stmt = conn
            .prepare("SELECT name, active FROM conditions ORDER BY name")
            .map_err(|e| e.to_string())?;
        let conditions = stmt
            .query_map([], |row| {
                Ok(ConditionData {
                    name: row.get(0)?,
                    active: row.get::<_, i64>(1)? != 0,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(conditions)
    })
}

#[tauri::command]
pub fn update_conditions(
    state: State<'_, AppState>,
    character_id: String,
    payload: Vec<ConditionData>,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        for item in &payload {
            conn.execute(
                "UPDATE conditions SET active=?1 WHERE name=?2",
                rusqlite::params![item.active as i64, item.name],
            )
            .map_err(|e| e.to_string())?;
        }
        Ok(serde_json::json!({"status": "saved"}))
    })
}

#[tauri::command]
pub fn get_combat_notes(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<CombatNotesData, String> {
    state.with_char_conn(&character_id, |conn| {
        let result = conn.query_row(
            "SELECT actions, bonus_actions, reactions, legendary_actions FROM combat_notes LIMIT 1",
            [],
            |row| {
                Ok(CombatNotesData {
                    actions: row.get(0).unwrap_or_default(),
                    bonus_actions: row.get(1).unwrap_or_default(),
                    reactions: row.get(2).unwrap_or_default(),
                    legendary_actions: row.get(3).unwrap_or_default(),
                })
            },
        );
        match result {
            Ok(n) => Ok(n),
            Err(_) => {
                conn.execute("INSERT OR IGNORE INTO combat_notes (id) VALUES (1)", [])
                    .map_err(|e| e.to_string())?;
                Ok(CombatNotesData {
                    actions: String::new(),
                    bonus_actions: String::new(),
                    reactions: String::new(),
                    legendary_actions: String::new(),
                })
            }
        }
    })
}

#[tauri::command]
pub fn update_combat_notes(
    state: State<'_, AppState>,
    character_id: String,
    payload: CombatNotesData,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("INSERT OR IGNORE INTO combat_notes (id) VALUES (1)", [])
            .map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE combat_notes SET actions=?1, bonus_actions=?2, reactions=?3, legendary_actions=?4 WHERE id=1",
            rusqlite::params![payload.actions, payload.bonus_actions, payload.reactions, payload.legendary_actions],
        )
        .map_err(|e| e.to_string())?;
        Ok(serde_json::json!({"status": "saved"}))
    })
}
