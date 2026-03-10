use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct BackstoryData {
    pub backstory_text: String,
    pub personality_traits: String,
    pub ideals: String,
    pub bonds: String,
    pub flaws: String,
    pub age: String,
    pub height: String,
    pub weight: String,
    pub eyes: String,
    pub hair: String,
    pub skin: String,
    pub portrait_data: String,
    pub allies_organizations: String,
    pub appearance_notes: String,
    pub goals_motivations: String,
}

#[tauri::command]
pub fn get_backstory(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<BackstoryData, String> {
    state.with_char_conn(&character_id, |conn| {
        let result = conn.query_row(
            "SELECT backstory_text, personality_traits, ideals, bonds, flaws,
                    age, height, weight, eyes, hair, skin, portrait_data,
                    allies_organizations, appearance_notes, goals_motivations
             FROM backstory LIMIT 1",
            [],
            |row| {
                Ok(BackstoryData {
                    backstory_text: row.get(0).unwrap_or_default(),
                    personality_traits: row.get(1).unwrap_or_default(),
                    ideals: row.get(2).unwrap_or_default(),
                    bonds: row.get(3).unwrap_or_default(),
                    flaws: row.get(4).unwrap_or_default(),
                    age: row.get(5).unwrap_or_default(),
                    height: row.get(6).unwrap_or_default(),
                    weight: row.get(7).unwrap_or_default(),
                    eyes: row.get(8).unwrap_or_default(),
                    hair: row.get(9).unwrap_or_default(),
                    skin: row.get(10).unwrap_or_default(),
                    portrait_data: row.get(11).unwrap_or_default(),
                    allies_organizations: row.get(12).unwrap_or_default(),
                    appearance_notes: row.get(13).unwrap_or_default(),
                    goals_motivations: row.get(14).unwrap_or_default(),
                })
            },
        );
        match result {
            Ok(bs) => Ok(bs),
            Err(_) => {
                // Create default backstory
                conn.execute(
                    "INSERT OR IGNORE INTO backstory (id) VALUES (1)",
                    [],
                )
                .map_err(|e| e.to_string())?;
                Ok(BackstoryData {
                    backstory_text: String::new(),
                    personality_traits: String::new(),
                    ideals: String::new(),
                    bonds: String::new(),
                    flaws: String::new(),
                    age: String::new(),
                    height: String::new(),
                    weight: String::new(),
                    eyes: String::new(),
                    hair: String::new(),
                    skin: String::new(),
                    portrait_data: String::new(),
                    allies_organizations: String::new(),
                    appearance_notes: String::new(),
                    goals_motivations: String::new(),
                })
            }
        }
    })
}

#[tauri::command]
pub fn update_backstory(
    state: State<'_, AppState>,
    character_id: String,
    payload: BackstoryData,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        // Ensure row exists
        conn.execute("INSERT OR IGNORE INTO backstory (id) VALUES (1)", [])
            .map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE backstory SET
                backstory_text=?1, personality_traits=?2, ideals=?3, bonds=?4, flaws=?5,
                age=?6, height=?7, weight=?8, eyes=?9, hair=?10, skin=?11,
                portrait_data=?12, allies_organizations=?13, appearance_notes=?14,
                goals_motivations=?15
             WHERE id=1",
            rusqlite::params![
                payload.backstory_text, payload.personality_traits, payload.ideals,
                payload.bonds, payload.flaws, payload.age, payload.height, payload.weight,
                payload.eyes, payload.hair, payload.skin, payload.portrait_data,
                payload.allies_organizations, payload.appearance_notes, payload.goals_motivations,
            ],
        )
        .map_err(|e| e.to_string())?;
        Ok(serde_json::json!({"status": "saved"}))
    })
}
