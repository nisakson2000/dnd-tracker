use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct JournalEntryData {
    pub id: Option<i64>,
    pub title: String,
    pub session_number: i64,
    pub real_date: String,
    pub ingame_date: String,
    pub body: String,
    pub tags: String,
    pub npcs_mentioned: String,
    pub pinned: i64,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[tauri::command]
pub fn get_journal_entries(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<JournalEntryData>, String> {
    state.with_char_conn(&character_id, |conn| {
        let mut stmt = conn
            .prepare(
                "SELECT id, title, session_number, real_date, ingame_date, body, tags, npcs_mentioned, pinned, created_at, updated_at
                 FROM journal_entries ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;
        let entries = stmt
            .query_map([], |row| {
                Ok(JournalEntryData {
                    id: Some(row.get(0)?),
                    title: row.get(1)?,
                    session_number: row.get(2).unwrap_or(0),
                    real_date: row.get(3).unwrap_or_default(),
                    ingame_date: row.get(4).unwrap_or_default(),
                    body: row.get(5).unwrap_or_default(),
                    tags: row.get(6).unwrap_or_default(),
                    npcs_mentioned: row.get(7).unwrap_or_default(),
                    pinned: row.get(8).unwrap_or(0),
                    created_at: row.get(9).ok(),
                    updated_at: row.get(10).ok(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();
        Ok(entries)
    })
}

#[tauri::command]
pub fn add_journal_entry(
    state: State<'_, AppState>,
    character_id: String,
    payload: JournalEntryData,
) -> Result<JournalEntryData, String> {
    state.with_char_conn(&character_id, |conn| {
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "INSERT INTO journal_entries (title, session_number, real_date, ingame_date, body, tags, npcs_mentioned, pinned, created_at, updated_at)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)",
            rusqlite::params![
                payload.title, payload.session_number, payload.real_date,
                payload.ingame_date, payload.body, payload.tags, payload.npcs_mentioned, payload.pinned, now, now,
            ],
        )
        .map_err(|e| e.to_string())?;
        let id = conn.last_insert_rowid();
        Ok(JournalEntryData {
            id: Some(id),
            created_at: Some(now.clone()),
            updated_at: Some(now),
            ..payload
        })
    })
}

#[tauri::command]
pub fn update_journal_entry(
    state: State<'_, AppState>,
    character_id: String,
    entry_id: i64,
    payload: JournalEntryData,
) -> Result<JournalEntryData, String> {
    state.with_char_conn(&character_id, |conn| {
        let now = chrono::Utc::now().to_rfc3339();
        let updated = conn
            .execute(
                "UPDATE journal_entries SET title=?1, session_number=?2, real_date=?3,
                    ingame_date=?4, body=?5, tags=?6, npcs_mentioned=?7, pinned=?8, updated_at=?9
                 WHERE id=?10",
                rusqlite::params![
                    payload.title, payload.session_number, payload.real_date,
                    payload.ingame_date, payload.body, payload.tags, payload.npcs_mentioned, payload.pinned, now, entry_id,
                ],
            )
            .map_err(|e| e.to_string())?;
        if updated == 0 {
            return Err("Journal entry not found".to_string());
        }
        Ok(JournalEntryData {
            id: Some(entry_id),
            updated_at: Some(now),
            ..payload
        })
    })
}

#[tauri::command]
pub fn delete_journal_entry(
    state: State<'_, AppState>,
    character_id: String,
    entry_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        let deleted = conn
            .execute("DELETE FROM journal_entries WHERE id=?1", [entry_id])
            .map_err(|e| e.to_string())?;
        if deleted == 0 {
            return Err("Journal entry not found".to_string());
        }
        Ok(serde_json::json!({"status": "deleted"}))
    })
}
