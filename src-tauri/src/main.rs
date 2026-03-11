// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod party;

use db::AppState;
use std::fs;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            fs::create_dir_all(&app_data_dir).expect("Failed to create app data dir");

            let chars_dir = app_data_dir.join("characters");
            fs::create_dir_all(&chars_dir).expect("Failed to create characters dir");

            // Copy bundled wiki.db to app data dir on first run
            let wiki_dest = app_data_dir.join("wiki.db");
            if !wiki_dest.exists() {
                let resource_dir = app.path().resource_dir().expect("Failed to get resource dir");
                let wiki_src = resource_dir.join("resources").join("wiki.db");
                if wiki_src.exists() {
                    fs::copy(&wiki_src, &wiki_dest)
                        .expect("Failed to copy wiki.db to app data dir");
                } else {
                    // Try alternate path (development)
                    let alt_src = resource_dir.join("wiki.db");
                    if alt_src.exists() {
                        fs::copy(&alt_src, &wiki_dest)
                            .expect("Failed to copy wiki.db to app data dir");
                    }
                }
            }

            // Open wiki connection
            let wiki_conn = if wiki_dest.exists() {
                db::open_connection(&wiki_dest).expect("Failed to open wiki.db")
            } else {
                // Create empty wiki.db as fallback
                let conn = db::open_connection(&wiki_dest).expect("Failed to create wiki.db");
                conn.execute_batch(
                    "CREATE TABLE IF NOT EXISTS wiki_articles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        slug TEXT UNIQUE NOT NULL,
                        title TEXT NOT NULL,
                        category TEXT NOT NULL,
                        subcategory TEXT DEFAULT '',
                        ruleset TEXT NOT NULL DEFAULT 'universal',
                        summary TEXT DEFAULT '',
                        content TEXT NOT NULL DEFAULT '',
                        metadata_json TEXT DEFAULT '{}',
                        tags TEXT DEFAULT '',
                        source TEXT DEFAULT 'SRD 5.1',
                        sort_order INTEGER DEFAULT 0,
                        created_at TEXT DEFAULT '',
                        updated_at TEXT DEFAULT ''
                    );
                    CREATE TABLE IF NOT EXISTS wiki_cross_references (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        source_article_id INTEGER NOT NULL REFERENCES wiki_articles(id) ON DELETE CASCADE,
                        target_article_id INTEGER NOT NULL REFERENCES wiki_articles(id) ON DELETE CASCADE,
                        relationship_type TEXT DEFAULT 'related'
                    );
                    CREATE VIRTUAL TABLE IF NOT EXISTS wiki_articles_fts USING fts5(
                        title, summary, content,
                        content='wiki_articles',
                        content_rowid='id'
                    );"
                ).expect("Failed to initialize wiki tables");
                conn
            };

            app.manage(AppState::new(app_data_dir, wiki_conn));
            app.manage(party::PartyServer::new());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Characters
            commands::characters::list_characters,
            commands::characters::create_character,
            commands::characters::delete_character,
            // Overview
            commands::overview::get_overview,
            commands::overview::update_overview,
            commands::overview::update_ability_scores,
            commands::overview::update_saving_throws,
            commands::overview::update_skills,
            // Backstory
            commands::backstory::get_backstory,
            commands::backstory::update_backstory,
            // Spells
            commands::spells::get_spells,
            commands::spells::add_spell,
            commands::spells::update_spell,
            commands::spells::delete_spell,
            commands::spells::get_spell_slots,
            commands::spells::update_spell_slots,
            commands::spells::reset_spell_slots,
            // Inventory
            commands::inventory::get_items,
            commands::inventory::add_item,
            commands::inventory::update_item,
            commands::inventory::delete_item,
            commands::inventory::get_currency,
            commands::inventory::update_currency,
            // Features
            commands::features::get_features,
            commands::features::add_feature,
            commands::features::update_feature,
            commands::features::delete_feature,
            // Combat
            commands::combat::get_attacks,
            commands::combat::add_attack,
            commands::combat::update_attack,
            commands::combat::delete_attack,
            commands::combat::get_conditions,
            commands::combat::update_conditions,
            commands::combat::get_combat_notes,
            commands::combat::update_combat_notes,
            // Journal
            commands::journal::get_journal_entries,
            commands::journal::add_journal_entry,
            commands::journal::update_journal_entry,
            commands::journal::delete_journal_entry,
            // NPCs
            commands::npcs::get_npcs,
            commands::npcs::add_npc,
            commands::npcs::update_npc,
            commands::npcs::delete_npc,
            // Quests
            commands::quests::get_quests,
            commands::quests::add_quest,
            commands::quests::update_quest,
            commands::quests::delete_quest,
            // Lore
            commands::lore::get_lore_notes,
            commands::lore::add_lore_note,
            commands::lore::update_lore_note,
            commands::lore::delete_lore_note,
            // Rest
            commands::rest::long_rest,
            commands::rest::short_rest,
            // Export / Import
            commands::export::export_character,
            commands::export::autosave_character,
            commands::import::import_character,
            // Wiki
            commands::wiki::wiki_search,
            commands::wiki::wiki_categories,
            commands::wiki::wiki_list_articles,
            commands::wiki::wiki_get_article,
            commands::wiki::wiki_get_related,
            // Party
            party::start_party_server,
            party::stop_party_server,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
