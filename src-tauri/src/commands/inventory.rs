use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct ItemData {
    pub id: Option<i64>,
    pub name: String,
    pub item_type: String,
    pub weight: f64,
    pub value_gp: f64,
    pub quantity: i64,
    pub description: String,
    pub attunement: bool,
    pub attuned: bool,
    pub equipped: bool,
    pub equipment_slot: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CurrencyData {
    pub cp: i64,
    pub sp: i64,
    pub ep: i64,
    pub gp: i64,
    pub pp: i64,
}

#[tauri::command]
pub fn get_items(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<ItemData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare(
                "SELECT id, name, item_type, weight, value_gp, quantity, description,
                        attunement, attuned, equipped, equipment_slot
                 FROM items",
            )
            .map_err(|e| e.to_string())?;
        let items = stmt
            .query_map([], |row| {
                Ok(ItemData {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    item_type: row.get(2).unwrap_or_else(|_| "misc".to_string()),
                    weight: row.get(3).unwrap_or(0.0),
                    value_gp: row.get(4).unwrap_or(0.0),
                    quantity: row.get(5).unwrap_or(1),
                    description: row.get(6).unwrap_or_default(),
                    attunement: row.get::<_, i64>(7).unwrap_or(0) != 0,
                    attuned: row.get::<_, i64>(8).unwrap_or(0) != 0,
                    equipped: row.get::<_, i64>(9).unwrap_or(0) != 0,
                    equipment_slot: row.get(10).unwrap_or_default(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(items)
    })
}

#[tauri::command]
pub fn add_item(
    state: State<'_, AppState>,
    character_id: String,
    payload: ItemData,
) -> Result<ItemData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute(
            "INSERT INTO items (name, item_type, weight, value_gp, quantity, description,
                                attunement, attuned, equipped, equipment_slot)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)",
            rusqlite::params![
                payload.name, payload.item_type, payload.weight, payload.value_gp,
                payload.quantity, payload.description, payload.attunement as i64,
                payload.attuned as i64, payload.equipped as i64, payload.equipment_slot,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(ItemData { id: Some(id), ..payload })
    })
}

#[tauri::command]
pub fn update_item(
    state: State<'_, AppState>,
    character_id: String,
    item_id: i64,
    payload: ItemData,
) -> Result<ItemData, String> {
    state.with_char_conn(&character_id, |conn| {
        let updated = conn
            .execute(
                "UPDATE items SET name=?1, item_type=?2, weight=?3, value_gp=?4,
                    quantity=?5, description=?6, attunement=?7, attuned=?8,
                    equipped=?9, equipment_slot=?10
                 WHERE id=?11",
                rusqlite::params![
                    payload.name, payload.item_type, payload.weight, payload.value_gp,
                    payload.quantity, payload.description, payload.attunement as i64,
                    payload.attuned as i64, payload.equipped as i64, payload.equipment_slot,
                    item_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Item not found".to_string());
        }
        Ok(ItemData { id: Some(item_id), ..payload })
    })
}

#[tauri::command]
pub fn delete_item(
    state: State<'_, AppState>,
    character_id: String,
    item_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM items WHERE id=?1", [item_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Item not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}

#[tauri::command]
pub fn get_currency(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<CurrencyData, String> {
    state.with_char_conn(&character_id, |conn| {
        let result = conn.query_row(
            "SELECT cp, sp, ep, gp, pp FROM currency LIMIT 1",
            [],
            |row| {
                Ok(CurrencyData {
                    cp: row.get(0).unwrap_or(0),
                    sp: row.get(1).unwrap_or(0),
                    ep: row.get(2).unwrap_or(0),
                    gp: row.get(3).unwrap_or(0),
                    pp: row.get(4).unwrap_or(0),
                })
            },
        );
        match result {
            Ok(c) => Ok(c),
            Err(_) => {
                conn.execute("INSERT OR IGNORE INTO currency (id) VALUES (1)", [])
                    .map_err(|e| e.to_string())?;
                Ok(CurrencyData { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 })
            }
        }
    })
}

#[tauri::command]
pub fn update_currency(
    state: State<'_, AppState>,
    character_id: String,
    payload: CurrencyData,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("INSERT OR IGNORE INTO currency (id) VALUES (1)", [])
            .map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE currency SET cp=?1, sp=?2, ep=?3, gp=?4, pp=?5 WHERE id=1",
            rusqlite::params![payload.cp, payload.sp, payload.ep, payload.gp, payload.pp],
        )
        .map_err(|e| e.to_string())?;
        Ok(serde_json::json!({"status": "saved"}))
    })
}
