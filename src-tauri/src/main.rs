// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod campaign_db;
mod party;
mod dev_presence;
mod session_ws;

use db::AppState;
use std::fs;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().map_err(|e| {
                eprintln!("[init] Failed to get app data dir: {}", e);
                Box::new(e) as Box<dyn std::error::Error>
            })?;
            fs::create_dir_all(&app_data_dir).map_err(|e| {
                eprintln!("[init] Failed to create app data dir: {}", e);
                Box::new(e) as Box<dyn std::error::Error>
            })?;

            let chars_dir = app_data_dir.join("characters");
            fs::create_dir_all(&chars_dir).map_err(|e| {
                eprintln!("[init] Failed to create characters dir: {}", e);
                Box::new(e) as Box<dyn std::error::Error>
            })?;

            // Copy bundled wiki.db to app data dir on first run
            let wiki_dest = app_data_dir.join("wiki.db");
            if !wiki_dest.exists() {
                if let Ok(resource_dir) = app.path().resource_dir() {
                    let wiki_src = resource_dir.join("resources").join("wiki.db");
                    if wiki_src.exists() {
                        if let Err(e) = fs::copy(&wiki_src, &wiki_dest) {
                            eprintln!("[init] Failed to copy wiki.db from resources: {}", e);
                        }
                    } else {
                        // Try alternate path (development)
                        let alt_src = resource_dir.join("wiki.db");
                        if alt_src.exists() {
                            if let Err(e) = fs::copy(&alt_src, &wiki_dest) {
                                eprintln!("[init] Failed to copy wiki.db from alt path: {}", e);
                            }
                        }
                    }
                } else {
                    eprintln!("[init] Could not resolve resource dir — wiki.db not copied");
                }
            }

            // Open wiki connection
            let wiki_conn = if wiki_dest.exists() {
                db::open_connection(&wiki_dest).map_err(|e| {
                    eprintln!("[init] Failed to open wiki.db: {}", e);
                    Box::new(e) as Box<dyn std::error::Error>
                })?
            } else {
                // Create empty wiki.db as fallback
                let conn = db::open_connection(&wiki_dest).map_err(|e| {
                    eprintln!("[init] Failed to create wiki.db: {}", e);
                    Box::new(e) as Box<dyn std::error::Error>
                })?;
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
                ).map_err(|e| {
                    eprintln!("[init] Failed to initialize wiki tables: {}", e);
                    Box::new(e) as Box<dyn std::error::Error>
                })?;
                conn
            };

            app.manage(AppState::new(app_data_dir, wiki_conn));
            app.manage(party::PartyServer::new());
            app.manage(dev_presence::DevPresence::new());
            app.manage(commands::dev_tools::DevLogBuffer::new());
            // Session WebSocket state (DM server + player client)
            app.manage(Arc::new(Mutex::new(None::<session_ws::SessionServer>)) as commands::session_ws_cmds::SessionServerState);
            app.manage(Arc::new(Mutex::new(None::<session_ws::ClientConnection>)) as commands::session_ws_cmds::SessionClientState);
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
            commands::wiki::wiki_stats,
            commands::wiki::wiki_subcategories,
            commands::wiki::wiki_random_articles,
            commands::wiki::wiki_adjacent_articles,
            // Bug Report & Feature Request
            commands::bug_report::write_bug_report,
            commands::feature_request::write_feature_request,
            // Frontend logging
            commands::frontend_log::frontend_log,
            // Ollama
            commands::ollama::check_ollama,
            commands::ollama::ollama_chat,
            commands::ollama::ollama_pull,
            // Party
            party::start_party_server,
            party::stop_party_server,
            party::get_local_ip,
            // Dev updates
            commands::dev_updates::check_git_updates,
            commands::dev_updates::pull_git_updates,
            commands::dev_updates::dev_preview_incoming,
            commands::dev_updates::dev_rollback_update,
            commands::dev_updates::dev_check_build_health,
            commands::dev_updates::dev_check_conflicts,
            commands::dev_updates::dev_smart_pull,
            // Dev presence (LAN discovery)
            dev_presence::start_dev_presence,
            dev_presence::stop_dev_presence,
            dev_presence::get_dev_peers,
            dev_presence::broadcast_dev_update,
            dev_presence::dev_send_chat,
            dev_presence::dev_get_chat_messages,
            dev_presence::dev_set_active_section,
            dev_presence::dev_presence_diagnostics,
            // Dev tools
            commands::dev_tools::dev_list_tables,
            commands::dev_tools::dev_query_db,
            commands::dev_tools::dev_get_log_buffer,
            commands::dev_tools::dev_check_environment,
            commands::dev_tools::dev_generate_test_character,
            commands::dev_tools::dev_collect_bug_report,
            commands::dev_tools::dev_get_schema_diff,
            commands::dev_tools::dev_run_migrations,
            // Git panel
            commands::dev_tools::dev_git_status,
            commands::dev_tools::dev_git_stage,
            commands::dev_tools::dev_git_commit,
            commands::dev_tools::dev_git_push,
            commands::dev_tools::dev_git_pull,
            commands::dev_tools::dev_git_diff,
            commands::dev_tools::dev_git_branch_info,
            commands::dev_tools::dev_git_log_detailed,
            commands::dev_tools::dev_git_stash,
            commands::dev_tools::dev_git_session_summary,
            // Campaigns
            commands::campaigns::create_campaign,
            commands::campaigns::list_campaigns,
            commands::campaigns::select_campaign,
            commands::campaigns::get_active_campaign,
            commands::campaigns::delete_campaign,
            commands::campaigns::update_campaign,
            commands::campaigns::archive_campaign,
            commands::campaigns::export_campaign,
            commands::campaigns::import_campaign,
            // Scenes
            commands::scenes::create_scene,
            commands::scenes::list_scenes,
            commands::scenes::update_scene,
            commands::scenes::delete_scene,
            commands::scenes::reorder_scenes,
            commands::scenes::advance_scene,
            // Encounters
            commands::encounters::create_encounter,
            commands::encounters::get_encounter,
            commands::encounters::start_encounter,
            commands::encounters::end_encounter,
            commands::encounters::advance_turn,
            commands::encounters::update_initiative,
            // Session management
            commands::session_mgmt::start_session,
            commands::session_mgmt::end_session,
            commands::session_mgmt::get_session_log,
            // Session WebSocket (DM server + player client)
            commands::session_ws_cmds::ws_start_server,
            commands::session_ws_cmds::ws_stop_server,
            commands::session_ws_cmds::ws_approve_player,
            commands::session_ws_cmds::ws_reject_player,
            commands::session_ws_cmds::ws_broadcast_event,
            commands::session_ws_cmds::ws_send_to_player,
            commands::session_ws_cmds::ws_get_connected,
            commands::session_ws_cmds::ws_connect_to_dm,
            commands::session_ws_cmds::ws_disconnect_from_dm,
            commands::session_ws_cmds::ws_send_to_dm,
            // Campaign Rest
            commands::campaign_rest::campaign_long_rest,
            commands::campaign_rest::campaign_short_rest,
            // Campaign Conditions
            commands::campaign_conditions::campaign_apply_condition,
            commands::campaign_conditions::campaign_remove_condition,
            commands::campaign_conditions::campaign_tick_conditions,
            // Concentration
            commands::concentration::set_concentration,
            commands::concentration::check_concentration_save,
            // Monsters
            commands::monsters::add_monster_to_encounter,
            commands::monsters::remove_monster,
            commands::monsters::update_monster_hp,
            commands::monsters::kill_monster,
            commands::monsters::get_encounter_monsters,
            commands::monsters::search_srd_monsters,
            // Session recap (M-12)
            commands::session_mgmt::generate_session_recap,
            // Handouts (M-13)
            commands::handouts::create_handout,
            commands::handouts::list_handouts,
            commands::handouts::reveal_handout,
            commands::handouts::delete_handout,
            // XP tracking (M-14)
            commands::xp::award_xp,
            commands::xp::get_player_xp,
            // Level up (M-15)
            commands::level_up::campaign_level_up,
            // Inspiration (M-16)
            commands::campaign_extras::toggle_inspiration,
            // Campaign settings (M-19)
            commands::campaign_extras::get_campaign_setting,
            commands::campaign_extras::set_campaign_setting,
            // AI Quest generation (M-20)
            commands::ollama::generate_quest,
            // World State
            commands::world_state::set_world_state,
            commands::world_state::get_world_state,
            commands::world_state::get_world_state_player,
            commands::world_state::reveal_world_state,
            commands::world_state::delete_world_state,
            // Campaign NPCs
            commands::campaign_npcs::create_campaign_npc,
            commands::campaign_npcs::list_campaign_npcs,
            commands::campaign_npcs::list_campaign_npcs_player,
            commands::campaign_npcs::update_campaign_npc,
            commands::campaign_npcs::delete_campaign_npc,
            commands::campaign_npcs::discover_npc,
            commands::campaign_npcs::share_npc_info,
            // Campaign Quests
            commands::campaign_quests::create_campaign_quest,
            commands::campaign_quests::list_campaign_quests,
            commands::campaign_quests::list_campaign_quests_player,
            commands::campaign_quests::update_campaign_quest,
            commands::campaign_quests::delete_campaign_quest,
            commands::campaign_quests::complete_quest_objective,
            // Character Arcs
            commands::character_arcs::create_character_arc,
            commands::character_arcs::list_character_arcs,
            commands::character_arcs::add_arc_entry,
            commands::character_arcs::get_arc_entries,
            commands::character_arcs::resolve_arc,
            commands::character_arcs::delete_character_arc,
            // Scene (new player command)
            commands::scenes::list_scenes_player,
            // GitHub reports (bug reports + feature requests → GitHub Issues)
            commands::github_reports::submit_bug_report,
            commands::github_reports::submit_feature_request,
            commands::github_reports::flush_pending_reports,
            commands::github_reports::get_pending_report_count,
        ])
        .run(tauri::generate_context!())
        .expect("Fatal: failed to start Tauri application");
}
