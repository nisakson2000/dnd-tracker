use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct LoreNoteData {
    pub id: Option<i64>,
    pub title: String,
    pub category: String,
    pub body: String,
    pub related_to: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[tauri::command]
pub fn get_lore_notes(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<LoreNoteData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare("SELECT id, title, category, body, related_to, created_at, updated_at FROM lore_notes ORDER BY updated_at DESC")
            .map_err(|e| e.to_string())?;
        let notes = stmt
            .query_map([], |row| {
                Ok(LoreNoteData {
                    id: Some(row.get(0)?),
                    title: row.get(1)?,
                    category: row.get(2).unwrap_or_default(),
                    body: row.get(3).unwrap_or_default(),
                    related_to: row.get(4).unwrap_or_default(),
                    created_at: row.get(5).ok(),
                    updated_at: row.get(6).ok(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(notes)
    })
}

#[tauri::command]
pub fn add_lore_note(
    state: State<'_, AppState>,
    character_id: String,
    payload: LoreNoteData,
) -> Result<LoreNoteData, String> {
    state.with_char_conn(&character_id, |conn| {
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "INSERT INTO lore_notes (title, category, body, related_to, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6)",
            rusqlite::params![payload.title, payload.category, payload.body, payload.related_to, now, now],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(LoreNoteData {
            id: Some(id),
            created_at: Some(now.clone()),
            updated_at: Some(now),
            ..payload
        })
    })
}

#[tauri::command]
pub fn update_lore_note(
    state: State<'_, AppState>,
    character_id: String,
    note_id: i64,
    payload: LoreNoteData,
) -> Result<LoreNoteData, String> {
    state.with_char_conn(&character_id, |conn| {
        let now = chrono::Utc::now().to_rfc3339();
        let updated = conn
            .execute(
                "UPDATE lore_notes SET title=?1, category=?2, body=?3, related_to=?4, updated_at=?5 WHERE id=?6",
                rusqlite::params![payload.title, payload.category, payload.body, payload.related_to, now, note_id],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Lore note not found".to_string());
        }
        Ok(LoreNoteData {
            id: Some(note_id),
            updated_at: Some(now),
            ..payload
        })
    })
}

#[tauri::command]
pub fn delete_lore_note(
    state: State<'_, AppState>,
    character_id: String,
    note_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM lore_notes WHERE id=?1", [note_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Lore note not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}
