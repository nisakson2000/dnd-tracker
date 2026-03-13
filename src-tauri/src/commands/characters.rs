use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

use crate::db::{self, AppState};

/// Create indexes for frequently queried columns. Idempotent (IF NOT EXISTS).
fn ensure_indexes(conn: &rusqlite::Connection) {
    let indexes = [
        "CREATE INDEX IF NOT EXISTS idx_quest_objectives_quest_id ON quest_objectives(quest_id)",
        "CREATE INDEX IF NOT EXISTS idx_spells_level ON spells(level)",
        "CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at)",
        "CREATE INDEX IF NOT EXISTS idx_lore_notes_updated_at ON lore_notes(updated_at)",
        "CREATE INDEX IF NOT EXISTS idx_lore_notes_category ON lore_notes(category)",
        "CREATE INDEX IF NOT EXISTS idx_npcs_name ON npcs(name)",
        "CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status)",
        "CREATE INDEX IF NOT EXISTS idx_features_feature_type ON features(feature_type)",
        "CREATE INDEX IF NOT EXISTS idx_items_item_type ON items(item_type)",
    ];
    for sql in &indexes {
        let _ = conn.execute(sql, []);
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CharacterSummary {
    pub id: String,
    pub name: String,
    pub race: String,
    pub primary_class: String,
    pub level: i64,
    pub max_hp: i64,
    pub current_hp: i64,
    pub armor_class: i64,
    pub campaign_name: String,
    pub ruleset: String,
    pub updated_at: Option<String>,
}

#[derive(Deserialize)]
pub struct CharacterCreate {
    pub name: Option<String>,
    pub ruleset: Option<String>,
    pub race: Option<String>,
    pub primary_class: Option<String>,
    pub primary_subclass: Option<String>,
}

#[tauri::command]
pub fn list_characters(state: State<'_, AppState>) -> Result<Vec<CharacterSummary>, String> {
    let chars_dir = state.characters_dir();
    let ids = db::list_character_files(&chars_dir);
    let mut results = Vec::new();

    for char_id in ids {
        state.get_char_conn(&char_id)?;
        let summary = state.with_char_conn(&char_id, |conn| {
            db::migrate_character_db(conn).map_err(|e| e.to_string())?;
            ensure_indexes(conn);
            let mut stmt = conn
                .prepare("SELECT name, race, primary_class, level, campaign_name, ruleset, updated_at, max_hp, current_hp, armor_class FROM character_overview LIMIT 1")
                .map_err(|e| e.to_string())?;
            let result = stmt.query_row([], |row| {
                Ok(CharacterSummary {
                    id: char_id.clone(),
                    name: row.get::<_, String>(0).unwrap_or_default(),
                    race: row.get::<_, String>(1).unwrap_or_default(),
                    primary_class: row.get::<_, String>(2).unwrap_or_default(),
                    level: row.get::<_, i64>(3).unwrap_or(1),
                    campaign_name: row.get::<_, String>(4).unwrap_or_default(),
                    ruleset: row.get::<_, String>(5).unwrap_or_else(|_| "5e-2014".to_string()),
                    updated_at: row.get::<_, Option<String>>(6).unwrap_or(None),
                    max_hp: row.get::<_, i64>(7).unwrap_or(0),
                    current_hp: row.get::<_, i64>(8).unwrap_or(0),
                    armor_class: row.get::<_, i64>(9).unwrap_or(0),
                })
            });
            match result {
                Ok(s) => Ok(s),
                Err(_) => Ok(CharacterSummary {
                    id: char_id.clone(),
                    name: char_id.clone(),
                    race: String::new(),
                    primary_class: String::new(),
                    level: 1,
                    max_hp: 0,
                    current_hp: 0,
                    armor_class: 0,
                    campaign_name: String::new(),
                    ruleset: "5e-2014".to_string(),
                    updated_at: None,
                }),
            }
        })?;
        results.push(summary);
    }

    Ok(results)
}

#[tauri::command]
pub fn create_character(
    state: State<'_, AppState>,
    payload: CharacterCreate,
) -> Result<CharacterSummary, String> {
    let char_id = Uuid::new_v4().to_string()[..8].to_string();
    let name = payload.name.unwrap_or_else(|| "New Character".to_string());
    let ruleset = payload.ruleset.unwrap_or_else(|| "5e-2014".to_string());
    let race = payload.race.unwrap_or_default();
    let primary_class = payload.primary_class.unwrap_or_default();
    let primary_subclass = payload.primary_subclass.unwrap_or_default();

    // Ensure characters directory exists
    let chars_dir = state.characters_dir();
    std::fs::create_dir_all(&chars_dir).map_err(|e| e.to_string())?;

    // Create and initialize the database
    let db_path = state.char_db_path(&char_id);
    let conn = db::open_connection(&db_path).map_err(|e| e.to_string())?;
    db::init_character_tables(&conn).map_err(|e| e.to_string())?;
    db::migrate_character_db(&conn).map_err(|e| e.to_string())?;

    // Insert overview with race, class, subclass
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO character_overview (id, name, ruleset, race, primary_class, primary_subclass, updated_at) VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![name, ruleset, race, primary_class, primary_subclass, now],
    )
    .map_err(|e| e.to_string())?;

    // Init defaults
    db::init_defaults(&conn).map_err(|e| e.to_string())?;

    // Create performance indexes
    ensure_indexes(&conn);

    // Store connection in cache
    {
        let mut conns = state.connections.lock().map_err(|e| e.to_string())?;
        conns.insert(char_id.clone(), std::sync::Mutex::new(conn));
    }

    Ok(CharacterSummary {
        id: char_id,
        name,
        race,
        primary_class,
        level: 1,
        max_hp: 0,
        current_hp: 0,
        armor_class: 0,
        campaign_name: String::new(),
        ruleset,
        updated_at: Some(now),
    })
}

#[tauri::command]
pub fn delete_character(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    // Remove from cache first
    state.remove_char_conn(&character_id)?;

    let db_path = state.char_db_path(&character_id);
    db::delete_character_files(&db_path)?;

    Ok(serde_json::json!({"status": "deleted"}))
}
