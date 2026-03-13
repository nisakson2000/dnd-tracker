use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct QuestObjectiveData {
    pub id: Option<i64>,
    pub text: String,
    pub completed: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct QuestData {
    pub id: Option<i64>,
    pub title: String,
    pub giver: String,
    pub description: String,
    pub status: String,
    pub notes: String,
    pub objectives: Vec<QuestObjectiveData>,
}

fn load_quest_with_objectives(conn: &rusqlite::Connection, quest_id: i64) -> Result<QuestData, String> {
    let quest = conn
        .query_row(
            "SELECT id, title, giver, description, status, notes FROM quests WHERE id=?1",
            [quest_id],
            |row| {
                Ok(QuestData {
                    id: Some(row.get(0)?),
                    title: row.get(1)?,
                    giver: row.get(2).unwrap_or_default(),
                    description: row.get(3).unwrap_or_default(),
                    status: row.get(4).unwrap_or_else(|_| "active".to_string()),
                    notes: row.get(5).unwrap_or_default(),
                    objectives: Vec::new(),
                })
            },
        )
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, text, completed FROM quest_objectives WHERE quest_id=?1")
        .map_err(|e| e.to_string())?;
    let objectives = stmt
        .query_map([quest_id], |row| {
            Ok(QuestObjectiveData {
                id: Some(row.get(0)?),
                text: row.get(1)?,
                completed: row.get::<_, i64>(2)? != 0,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(QuestData { objectives, ..quest })
}

#[tauri::command]
pub fn get_quests(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<Vec<QuestData>, String> {
    state.with_char_conn(&character_id, |conn| {
        // Fetch all quests in one query
        let mut quest_stmt = conn
            .prepare("SELECT id, title, giver, description, status, notes FROM quests ORDER BY status, title")
            .map_err(|e| e.to_string())?;
        let mut quests: Vec<QuestData> = quest_stmt
            .query_map([], |row| {
                Ok(QuestData {
                    id: Some(row.get(0)?),
                    title: row.get(1)?,
                    giver: row.get(2).unwrap_or_default(),
                    description: row.get(3).unwrap_or_default(),
                    status: row.get(4).unwrap_or_else(|_| "active".to_string()),
                    notes: row.get(5).unwrap_or_default(),
                    objectives: Vec::new(),
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        // Fetch all objectives in one query and group by quest_id
        let mut obj_stmt = conn
            .prepare("SELECT quest_id, id, text, completed FROM quest_objectives")
            .map_err(|e| e.to_string())?;
        let mut objectives_by_quest: HashMap<i64, Vec<QuestObjectiveData>> = HashMap::new();
        let obj_rows = obj_stmt
            .query_map([], |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    QuestObjectiveData {
                        id: Some(row.get(1)?),
                        text: row.get(2)?,
                        completed: row.get::<_, i64>(3)? != 0,
                    },
                ))
            })
            .map_err(|e| e.to_string())?;
        for obj_row in obj_rows {
            if let Ok((quest_id, obj)) = obj_row {
                objectives_by_quest.entry(quest_id).or_default().push(obj);
            }
        }

        // Attach objectives to their quests
        for quest in &mut quests {
            if let Some(qid) = quest.id {
                quest.objectives = objectives_by_quest.remove(&qid).unwrap_or_default();
            }
        }

        Ok(quests)
    })
}

#[tauri::command]
pub fn add_quest(
    state: State<'_, AppState>,
    character_id: String,
    payload: QuestData,
) -> Result<QuestData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("BEGIN", []).map_err(|e| format!("Failed to begin transaction: {}", e))?;
        let result = (|| -> Result<QuestData, String> {
            conn.execute(
                "INSERT INTO quests (title, giver, description, status, notes) VALUES (?1,?2,?3,?4,?5)",
                rusqlite::params![payload.title, payload.giver, payload.description, payload.status, payload.notes],
            )
            .map_err(|e| format!("Failed to create quest: {}", e))?;
            let quest_id = conn.last_insert_rowid();

            for obj in &payload.objectives {
                conn.execute(
                    "INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1,?2,?3)",
                    rusqlite::params![quest_id, obj.text, obj.completed as i64],
                )
                .map_err(|e| format!("Failed to add quest objective: {}", e))?;
            }

            load_quest_with_objectives(conn, quest_id)
        })();
        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| format!("Failed to commit: {}", e))?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(e)
            }
        }
    })
}

#[tauri::command]
pub fn update_quest(
    state: State<'_, AppState>,
    character_id: String,
    quest_id: i64,
    payload: QuestData,
) -> Result<QuestData, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("BEGIN", []).map_err(|e| format!("Failed to begin transaction: {}", e))?;
        let result = (|| -> Result<QuestData, String> {
            let updated = conn
                .execute(
                    "UPDATE quests SET title=?1, giver=?2, description=?3, status=?4, notes=?5 WHERE id=?6",
                    rusqlite::params![payload.title, payload.giver, payload.description, payload.status, payload.notes, quest_id],
                )
                .map_err(|e| format!("Failed to update quest: {}", e))?;
            if updated == 0 {
                return Err("Quest not found".to_string());
            }

            // Replace objectives
            conn.execute("DELETE FROM quest_objectives WHERE quest_id=?1", [quest_id])
                .map_err(|e| format!("Failed to clear quest objectives: {}", e))?;
            for obj in &payload.objectives {
                conn.execute(
                    "INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1,?2,?3)",
                    rusqlite::params![quest_id, obj.text, obj.completed as i64],
                )
                .map_err(|e| format!("Failed to add quest objective: {}", e))?;
            }

            load_quest_with_objectives(conn, quest_id)
        })();
        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| format!("Failed to commit: {}", e))?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(e)
            }
        }
    })
}

#[tauri::command]
pub fn delete_quest(
    state: State<'_, AppState>,
    character_id: String,
    quest_id: i64,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("BEGIN", []).map_err(|e| format!("Failed to begin transaction: {}", e))?;
        let result = (|| -> Result<serde_json::Value, String> {
            conn.execute("DELETE FROM quest_objectives WHERE quest_id=?1", [quest_id])
                .map_err(|e| format!("Failed to delete quest objectives: {}", e))?;
            let deleted = conn
                .execute("DELETE FROM quests WHERE id=?1", [quest_id])
                .map_err(|e| format!("Failed to delete quest: {}", e))?;
            if deleted == 0 {
                return Err("Quest not found".to_string());
            }
            Ok(serde_json::json!({"status": "deleted"}))
        })();
        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| format!("Failed to commit: {}", e))?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(e)
            }
        }
    })
}
