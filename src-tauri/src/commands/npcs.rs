use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct NPCData {
    pub id: Option<i64>,
    pub name: String,
    pub role: String,
    pub race: String,
    pub npc_class: String,
    pub location: String,
    pub description: String,
    pub notes: String,
    pub status: String,
}

#[tauri::command]
pub fn get_npcs(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<NPCData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT id, name, role, race, npc_class, location, description, notes, status FROM npcs ORDER BY name")
            .map_err(|e| e.to_string())?;
        let npcs = stmt
            .query_map([], |row| {
                Ok(NPCData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    role: row.get(2).unwrap_or_else(|_| "neutral".to_string()),
                    race: row.get(3).unwrap_or_default(),
                    npc_class: row.get(4).unwrap_or_default(),
                    location: row.get(5).unwrap_or_default(),
                    description: row.get(6).unwrap_or_default(),
                    notes: row.get(7).unwrap_or_default(),
                    status: row.get(8).unwrap_or_else(|_| "alive".to_string()),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(npcs)
    })
}

#[tauri::command]
pub fn add_npc(
    state: State<'_, AppState>,
    character_id: String,
    payload: NPCData,
) -> Result<NPCData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO npcs (name, role, race, npc_class, location, description, notes, status)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
            rusqlite::params![
                payload.name, payload.role, payload.race, payload.npc_class,
                payload.location, payload.description, payload.notes, payload.status,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(NPCData { id: Some(id), ..payload })
    })
}

#[tauri::command]
pub fn update_npc(
    state: State<'_, AppState>,
    character_id: String,
    npc_id: i64,
    payload: NPCData,
) -> Result<NPCData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE npcs SET name=?1, role=?2, race=?3, npc_class=?4, location=?5, description=?6, notes=?7, status=?8 WHERE id=?9",
                rusqlite::params![
                    payload.name, payload.role, payload.race, payload.npc_class,
                    payload.location, payload.description, payload.notes, payload.status, npc_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("NPC not found".to_string());
        }
        Ok(NPCData { id: Some(npc_id), ..payload })
    })
}

#[tauri::command]
pub fn delete_npc(
    state: State<'_, AppState>,
    character_id: String,
    npc_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM npcs WHERE id=?1", [npc_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("NPC not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}
