// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod campaign_db;
pub mod campaign_helpers;
mod migrations;
mod party;
mod dev_presence;
mod session_ws;

use db::AppState;
use std::fs;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

fn main() {
    // Compute the OTA dist override path for the custom protocol.
    // This must match Tauri's app_data_dir: %APPDATA%/{identifier}/
    let ota_dist_path = dirs::data_dir()
        .unwrap_or_default()
        .join("com.codex.dndtracker")
        .join("dist_update");

    let ota_path_clone = ota_dist_path.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        // Register "codex://" protocol to serve OTA-updated frontend files
        .register_uri_scheme_protocol("codex", move |_app, request| {
            let path = request.uri().path();
            let path = if path == "/" || path.is_empty() {
                "index.html"
            } else {
                path.trim_start_matches('/')
            };
            // Also strip any query string
            let path = path.split('?').next().unwrap_or(path);
            let file_path = ota_path_clone.join(path);

            if file_path.exists() && file_path.is_file() {
                let content = std::fs::read(&file_path).unwrap_or_default();
                let mime = commands::ota_update::guess_mime(&file_path);
                tauri::http::Response::builder()
                    .header("content-type", mime)
                    .header("access-control-allow-origin", "*")
                    .body(content)
                    .unwrap_or_else(|_| {
                        tauri::http::Response::builder()
                            .status(500)
                            .body(Vec::new())
                            .unwrap()
                    })
            } else {
                eprintln!("[codex://] 404: {}", file_path.display());
                tauri::http::Response::builder()
                    .status(404)
                    .body(Vec::new())
                    .unwrap_or_else(|_| {
                        tauri::http::Response::builder()
                            .status(500)
                            .body(Vec::new())
                            .unwrap()
                    })
            }
        })
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

            // Pre-initialize campaign DB at startup so errors surface immediately
            if let Err(e) = campaign_db::init_campaign_db(&app_data_dir) {
                eprintln!("[init] Campaign DB pre-init failed (will retry lazily): {}", e);
            }

            app.manage(AppState::new(app_data_dir.clone(), wiki_conn));
            app.manage(party::PartyServer::new());
            app.manage(party::PartyIpcClient::new());
            app.manage(dev_presence::DevPresence::new());
            app.manage(commands::dev_tools::DevLogBuffer::new());
            // Session WebSocket state (DM server + player client)
            app.manage(Arc::new(Mutex::new(None::<session_ws::SessionServer>)) as commands::session_ws_cmds::SessionServerState);
            app.manage(Arc::new(Mutex::new(None::<session_ws::ClientConnection>)) as commands::session_ws_cmds::SessionClientState);

            // OTA frontend update — clear any stale dist_update to prevent black screen.
            // The codex:// protocol approach is unreliable in production, so we disable it.
            // Updates are detected via version.json and shown as a banner instead.
            let ota_dir = app_data_dir.join("dist_update");
            if ota_dir.exists() {
                eprintln!("[init] Clearing stale OTA dist_update to prevent black screen");
                let _ = fs::remove_dir_all(&ota_dir);
                let _ = fs::remove_file(app_data_dir.join("ota_version.txt"));
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Characters
            commands::characters::list_characters,
            commands::characters::create_character,
            commands::characters::clone_character,
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
            commands::combat::use_attack,
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
            // Companions
            commands::companions::get_companions,
            commands::companions::add_companion,
            commands::companions::update_companion,
            commands::companions::delete_companion,
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
            commands::ollama::ollama_setup_status,
            commands::ollama::ollama_start,
            commands::ollama::ollama_auto_install,
            commands::ollama::ollama_generate,
            commands::ollama::ollama_generate_stream,
            // Party
            party::start_party_server,
            party::stop_party_server,
            party::create_party_room,
            party::get_local_ip,
            party::party_ipc_join,
            party::party_ipc_connect,
            party::party_ipc_send,
            party::party_ipc_disconnect,
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
            commands::campaigns::set_active_campaign_id,
            commands::campaigns::delete_campaign,
            commands::campaigns::update_campaign,
            commands::campaigns::export_campaign,
            commands::campaigns::import_campaign,
            commands::campaigns::update_campaign_status,
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
            commands::session_mgmt::log_session_event,
            commands::session_mgmt::list_sessions,
            commands::session_mgmt::save_session_snapshot,
            commands::session_mgmt::get_latest_incomplete_session,
            commands::session_mgmt::mark_session_complete,
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
            // Shop system
            commands::session_mgmt::create_shop,
            commands::session_mgmt::get_shops,
            commands::session_mgmt::add_shop_item,
            commands::session_mgmt::get_shop_items,
            commands::session_mgmt::update_shop_item_quantity,
            commands::session_mgmt::delete_shop,
            // Session recap (M-12)
            commands::session_mgmt::generate_session_recap,
            commands::session_mgmt::export_session_markdown,
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
            commands::ollama::generate_npc,
            commands::ollama::generate_location,
            commands::ollama::generate_lore,
            commands::ollama::generate_encounter,
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
            commands::campaign_npcs::update_npc_disposition,
            // NPC Relationships
            commands::npc_relationships::create_npc_relationship,
            commands::npc_relationships::list_npc_relationships,
            commands::npc_relationships::get_npc_relationships,
            commands::npc_relationships::update_npc_relationship,
            commands::npc_relationships::delete_npc_relationship,
            commands::npc_relationships::add_relationship_event,
            commands::npc_relationships::list_relationship_events,
            commands::npc_relationships::get_death_cascade,
            // Campaign Quests
            commands::campaign_quests::create_campaign_quest,
            commands::campaign_quests::list_campaign_quests,
            commands::campaign_quests::list_campaign_quests_player,
            commands::campaign_quests::update_campaign_quest,
            commands::campaign_quests::delete_campaign_quest,
            commands::campaign_quests::complete_quest_objective,
            commands::campaign_quests::create_quest_beat,
            commands::campaign_quests::list_quest_beats,
            commands::campaign_quests::update_quest_beat,
            commands::campaign_quests::delete_quest_beat,
            commands::campaign_quests::advance_quest_beat,
            commands::campaign_quests::get_quest_with_beats,
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
            commands::github_reports::get_reports_path,
            // Combat Log
            commands::combat_log::insert_combat_log,
            commands::combat_log::get_combat_log,
            commands::combat_log::clear_combat_log,
            commands::combat_log::archive_combat_session,
            // Factions
            commands::factions::create_faction,
            commands::factions::list_factions,
            commands::factions::update_faction,
            commands::factions::delete_faction,
            commands::factions::set_faction_relation,
            commands::factions::get_faction_relations,
            commands::factions::set_faction_reputation,
            commands::factions::get_faction_reputations,
            commands::factions::get_player_reputations,
            // Simulation — Weather
            commands::simulation::set_weather,
            commands::simulation::get_weather,
            commands::simulation::get_all_weather,
            commands::simulation::advance_weather,
            // Simulation — Economy
            commands::simulation::set_economy,
            commands::simulation::get_economy,
            commands::simulation::get_all_economies,
            // Simulation — Travel
            commands::simulation::calculate_travel,
            // Simulation — World Events
            commands::simulation::create_world_event,
            commands::simulation::list_world_events,
            commands::simulation::resolve_world_event,
            commands::simulation::delete_world_event,
            // Simulation — Timeline
            commands::simulation::add_timeline_entry,
            commands::simulation::get_timeline,
            commands::simulation::delete_timeline_entry,
            // NPC Memory + Intelligence (Phase 6)
            commands::npc_memory::create_npc_memory,
            commands::npc_memory::list_npc_memories,
            commands::npc_memory::delete_npc_memory,
            commands::npc_memory::decay_npc_memories,
            commands::npc_memory::update_npc_personality,
            commands::npc_memory::update_npc_trust,
            commands::npc_memory::get_npc_intelligence,
            // Consequence Engine (Phase 6)
            commands::consequence_engine::create_consequence,
            commands::consequence_engine::list_consequences,
            commands::consequence_engine::approve_consequence,
            commands::consequence_engine::dismiss_consequence,
            commands::consequence_engine::resolve_consequence,
            commands::consequence_engine::delete_consequence,
            // Story Engine (Phase 7)
            commands::story_engine::create_story_thread,
            commands::story_engine::list_story_threads,
            commands::story_engine::update_story_thread,
            commands::story_engine::delete_story_thread,
            commands::story_engine::create_story_branch,
            commands::story_engine::resolve_story_branch,
            commands::story_engine::list_story_branches,
            // Villain Profiles (Phase 7)
            commands::story_engine::create_villain_profile,
            commands::story_engine::get_villain_profile,
            commands::story_engine::update_villain_profile,
            // Campaign Arcs (Phase 7)
            commands::story_engine::create_campaign_arc,
            commands::story_engine::list_campaign_arcs,
            commands::story_engine::update_campaign_arc,
            commands::story_engine::delete_campaign_arc,
            // Campaign History (Phase 7)
            commands::story_engine::add_history_entry,
            commands::story_engine::get_campaign_history,
            commands::story_engine::toggle_history_bookmark,
            commands::story_engine::delete_history_entry,
            // Campaign Secrets (Phase 7)
            commands::story_engine::create_campaign_secret,
            commands::story_engine::list_campaign_secrets,
            commands::story_engine::reveal_campaign_secret,
            commands::story_engine::update_secret_known_by,
            commands::story_engine::delete_campaign_secret,
            // Investigation / Clues (Phase 9)
            commands::advanced_systems::create_clue,
            commands::advanced_systems::list_clues,
            commands::advanced_systems::discover_clue,
            commands::advanced_systems::delete_clue,
            // Rumors (Phase 9)
            commands::advanced_systems::create_rumor,
            commands::advanced_systems::list_rumors,
            commands::advanced_systems::spread_rumors,
            commands::advanced_systems::delete_rumor,
            // World Crises (Phase 9)
            commands::advanced_systems::create_world_crisis,
            commands::advanced_systems::list_world_crises,
            commands::advanced_systems::escalate_crisis,
            commands::advanced_systems::resolve_crisis,
            commands::advanced_systems::delete_crisis,
            // Artifact Evolution (Phase 9)
            commands::advanced_systems::create_artifact_profile,
            commands::advanced_systems::list_artifact_profiles,
            commands::advanced_systems::add_artifact_xp,
            commands::advanced_systems::update_artifact_profile,
            commands::advanced_systems::delete_artifact_profile,
            // Auth
            commands::auth::verify_dev_passphrase,
            // OTA frontend updates
            commands::ota_update::ota_has_update,
            commands::ota_update::ota_download_update,
            commands::ota_update::ota_clear_update,
        ])
        .run(tauri::generate_context!())
        .expect("Fatal: failed to start Tauri application");
}
