use rusqlite::{Connection, params};

/// A named, versioned migration. Migrations run in order and are tracked in
/// the `schema_versions` table so they never run twice.
pub struct Migration {
    pub name: &'static str,
    pub sql: &'static str,
}

/// Run all pending migrations against a database connection.
/// Creates the `schema_versions` tracking table if it doesn't exist.
/// Each migration runs exactly once — already-applied migrations are skipped.
///
/// ALTER TABLE statements are executed individually so that "duplicate column"
/// errors (from partially-applied migrations) are silently skipped rather than
/// aborting the whole migration.
pub fn run_migrations(conn: &Connection, migrations: &[Migration]) -> Result<(), String> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_versions (
            version INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at INTEGER NOT NULL
        )"
    ).map_err(|e| format!("Failed to create schema_versions table: {}", e))?;

    let current: i64 = conn.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM schema_versions", [], |r| r.get(0)
    ).unwrap_or(0);

    for (i, migration) in migrations.iter().enumerate() {
        let version = (i + 1) as i64;
        if version <= current {
            continue;
        }

        eprintln!("[migrations] Applying #{}: {}", version, migration.name);

        // Split SQL into individual statements and run each one.
        // ALTER TABLE "duplicate column" errors are skipped gracefully
        // so partially-applied migrations can complete on retry.
        for raw_stmt in migration.sql.split(';') {
            // Strip leading SQL comment lines before checking if empty
            let stmt: String = raw_stmt.lines()
                .map(|l| l.trim())
                .filter(|l| !l.starts_with("--") && !l.is_empty())
                .collect::<Vec<_>>()
                .join("\n");
            let stmt = stmt.trim();
            if stmt.is_empty() {
                continue;
            }
            match conn.execute_batch(stmt) {
                Ok(_) => {}
                Err(e) => {
                    let err_msg = e.to_string().to_lowercase();
                    if err_msg.contains("duplicate column name")
                        || err_msg.contains("already exists")
                    {
                        eprintln!("[migrations] Skipping (already exists): {}", stmt.chars().take(80).collect::<String>());
                        continue;
                    }
                    return Err(format!(
                        "Migration #{} '{}' failed: {}",
                        version, migration.name, e
                    ));
                }
            }
        }

        conn.execute(
            "INSERT INTO schema_versions (version, name, applied_at) VALUES (?1, ?2, ?3)",
            params![version, migration.name, chrono::Utc::now().timestamp()],
        ).map_err(|e| format!(
            "Failed to record migration #{} '{}': {}",
            version, migration.name, e
        ))?;

        eprintln!("[migrations] Applied #{}: {}", version, migration.name);
    }

    Ok(())
}

// ─────────────────────────────────────────────────────────────────────────────
// Campaign database migrations
// ─────────────────────────────────────────────────────────────────────────────

pub const CAMPAIGN_MIGRATIONS: &[Migration] = &[
    // ── Migration 1: Baseline schema ──
    // All original tables from init_campaign_db's execute_batch block.
    // For fresh installs this creates everything; for existing installs
    // these are all CREATE TABLE IF NOT EXISTS so they're safe no-ops,
    // and we record that migration 1 has been applied.
    Migration {
        name: "baseline_schema",
        sql: "
            CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                ruleset TEXT DEFAULT 'dnd5e-2024',
                campaign_type TEXT DEFAULT 'homebrew',
                created_at INTEGER NOT NULL,
                updated_at INTEGER,
                last_session INTEGER,
                active_scene_id TEXT
            );

            CREATE TABLE IF NOT EXISTS scenes (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                location TEXT DEFAULT '',
                phase TEXT DEFAULT 'exploration',
                dm_notes TEXT DEFAULT '',
                sort_order INTEGER DEFAULT 0,
                completed INTEGER DEFAULT 0,
                player_visible INTEGER DEFAULT 0,
                player_description TEXT DEFAULT '',
                mood TEXT DEFAULT ''
            );

            CREATE TABLE IF NOT EXISTS encounters (
                id TEXT PRIMARY KEY,
                scene_id TEXT NOT NULL REFERENCES scenes(id),
                campaign_id TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                round INTEGER DEFAULT 0,
                initiative_json TEXT DEFAULT '[]',
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS monsters (
                id TEXT PRIMARY KEY,
                encounter_id TEXT NOT NULL REFERENCES encounters(id),
                name TEXT NOT NULL,
                hp_current INTEGER NOT NULL,
                hp_max INTEGER NOT NULL,
                ac INTEGER DEFAULT 10,
                conditions_json TEXT DEFAULT '[]',
                stat_block_json TEXT,
                alive INTEGER DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS quest_flags (
                campaign_id TEXT NOT NULL,
                flag TEXT NOT NULL,
                value TEXT NOT NULL DEFAULT 'true',
                set_at INTEGER NOT NULL,
                PRIMARY KEY (campaign_id, flag)
            );

            CREATE TABLE IF NOT EXISTS players (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                player_uuid TEXT NOT NULL,
                display_name TEXT NOT NULL,
                character_id TEXT,
                class_level TEXT,
                hp_current INTEGER DEFAULT 0,
                hp_max INTEGER DEFAULT 0,
                temp_hp INTEGER DEFAULT 0,
                ac INTEGER DEFAULT 10,
                spell_slots_json TEXT DEFAULT '{}',
                conditions_json TEXT DEFAULT '[]',
                death_saves_json TEXT DEFAULT '{\"success\":0,\"fail\":0}',
                inspiration INTEGER DEFAULT 0,
                xp INTEGER DEFAULT 0,
                passive_perception INTEGER DEFAULT 10,
                concentration_spell TEXT,
                version INTEGER DEFAULT 0,
                approved INTEGER DEFAULT 0,
                updated_at INTEGER
            );

            CREATE TABLE IF NOT EXISTS action_buttons (
                id TEXT PRIMARY KEY,
                scene_id TEXT NOT NULL REFERENCES scenes(id),
                phase TEXT NOT NULL,
                label TEXT NOT NULL,
                effect_notes TEXT,
                sort_order INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS event_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                session_id TEXT NOT NULL,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_event_log_session
                ON event_log(campaign_id, session_id);

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS handouts (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                revealed INTEGER DEFAULT 0,
                revealed_at INTEGER
            );

            CREATE TABLE IF NOT EXISTS campaign_npcs (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                name TEXT NOT NULL,
                role TEXT DEFAULT '',
                race TEXT DEFAULT '',
                location TEXT DEFAULT '',
                description TEXT DEFAULT '',
                dm_notes TEXT DEFAULT '',
                visibility TEXT DEFAULT 'dm_only',
                known_info_json TEXT DEFAULT '[]',
                status TEXT DEFAULT 'alive',
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS world_state (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                key TEXT NOT NULL,
                value_json TEXT NOT NULL DEFAULT '{}',
                category TEXT DEFAULT 'general',
                visibility TEXT DEFAULT 'dm_only',
                revealed_at INTEGER,
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, key)
            );

            CREATE TABLE IF NOT EXISTS character_arcs (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                character_id TEXT NOT NULL,
                character_name TEXT DEFAULT '',
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                status TEXT DEFAULT 'active',
                resolution TEXT DEFAULT '',
                created_at INTEGER NOT NULL,
                resolved_at INTEGER
            );

            CREATE TABLE IF NOT EXISTS arc_entries (
                id TEXT PRIMARY KEY,
                arc_id TEXT NOT NULL REFERENCES character_arcs(id),
                session_number INTEGER DEFAULT 0,
                description TEXT NOT NULL,
                entry_type TEXT DEFAULT 'development',
                npc_involved TEXT DEFAULT '',
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS campaign_quests (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                giver TEXT DEFAULT '',
                description TEXT DEFAULT '',
                status TEXT DEFAULT 'hidden',
                visibility TEXT DEFAULT 'dm_only',
                objectives_json TEXT DEFAULT '[]',
                reward_xp INTEGER DEFAULT 0,
                reward_gold INTEGER DEFAULT 0,
                reward_items_json TEXT DEFAULT '[]',
                parent_quest_id TEXT,
                linked_arc_id TEXT,
                created_at INTEGER NOT NULL,
                completed_at INTEGER
            );
        ",
    },

    // ── Migration 2: NPC disposition tracking ──
    Migration {
        name: "npc_disposition",
        sql: "
            ALTER TABLE campaign_npcs ADD COLUMN disposition TEXT DEFAULT 'Neutral';
            ALTER TABLE campaign_npcs ADD COLUMN disposition_score INTEGER DEFAULT 0;
        ",
    },

    // ── Migration 3: Quest beats table ──
    Migration {
        name: "quest_beats",
        sql: "
            CREATE TABLE IF NOT EXISTS quest_beats (
                id TEXT PRIMARY KEY,
                quest_id TEXT NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,
                campaign_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                dm_notes TEXT DEFAULT '',
                sort_order INTEGER DEFAULT 0,
                status TEXT DEFAULT 'pending',
                beat_type TEXT DEFAULT 'story',
                linked_scene_id TEXT,
                linked_encounter_json TEXT DEFAULT '{}',
                linked_npc_ids_json TEXT DEFAULT '[]',
                completed_at INTEGER
            );

            ALTER TABLE campaign_quests ADD COLUMN active_beat_id TEXT;
            ALTER TABLE campaign_quests ADD COLUMN plot_summary TEXT DEFAULT '';
        ",
    },

    // ── Migration 4: Combat log persistence ──
    Migration {
        name: "combat_log",
        sql: "
            CREATE TABLE IF NOT EXISTS combat_log (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                session_id TEXT,
                round INTEGER DEFAULT 0,
                turn_order INTEGER DEFAULT 0,
                entry_type TEXT NOT NULL,
                actor_name TEXT DEFAULT '',
                target_name TEXT DEFAULT '',
                description TEXT NOT NULL,
                details_json TEXT DEFAULT '{}',
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_combat_log_campaign
                ON combat_log(campaign_id, session_id);
            CREATE INDEX IF NOT EXISTS idx_combat_log_ts
                ON combat_log(campaign_id, ts);

            ALTER TABLE campaigns ADD COLUMN combat_log_enabled INTEGER DEFAULT 1;
        ",
    },

    // ── Migration 5: World simulation tables ──
    Migration {
        name: "world_simulation",
        sql: "
            CREATE TABLE IF NOT EXISTS campaign_factions (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                leader TEXT DEFAULT '',
                headquarters TEXT DEFAULT '',
                alignment TEXT DEFAULT 'neutral',
                military INTEGER DEFAULT 50,
                wealth INTEGER DEFAULT 50,
                influence INTEGER DEFAULT 50,
                territory_json TEXT DEFAULT '[]',
                goals_json TEXT DEFAULT '[]',
                status TEXT DEFAULT 'active',
                visibility TEXT DEFAULT 'dm_only',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS faction_relations (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                faction_a_id TEXT NOT NULL REFERENCES campaign_factions(id),
                faction_b_id TEXT NOT NULL REFERENCES campaign_factions(id),
                relation_type TEXT DEFAULT 'neutral',
                score INTEGER DEFAULT 0,
                notes TEXT DEFAULT '',
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, faction_a_id, faction_b_id)
            );

            CREATE TABLE IF NOT EXISTS faction_reputation (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                faction_id TEXT NOT NULL REFERENCES campaign_factions(id),
                character_id TEXT NOT NULL,
                character_name TEXT DEFAULT '',
                score INTEGER DEFAULT 0,
                rank TEXT DEFAULT 'unknown',
                notes TEXT DEFAULT '',
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, faction_id, character_id)
            );

            CREATE TABLE IF NOT EXISTS campaign_weather (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                region TEXT DEFAULT 'default',
                season TEXT DEFAULT 'spring',
                temperature TEXT DEFAULT 'mild',
                precipitation TEXT DEFAULT 'none',
                wind TEXT DEFAULT 'calm',
                special_effects TEXT DEFAULT '',
                mechanical_effects_json TEXT DEFAULT '{}',
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, region)
            );

            CREATE TABLE IF NOT EXISTS campaign_economy (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                region TEXT DEFAULT 'default',
                prosperity TEXT DEFAULT 'moderate',
                tax_rate REAL DEFAULT 0.1,
                trade_goods_json TEXT DEFAULT '[]',
                price_modifier REAL DEFAULT 1.0,
                notes TEXT DEFAULT '',
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, region)
            );

            CREATE TABLE IF NOT EXISTS world_events (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                event_type TEXT DEFAULT 'political',
                severity TEXT DEFAULT 'minor',
                trigger_conditions_json TEXT DEFAULT '{}',
                effects_json TEXT DEFAULT '{}',
                status TEXT DEFAULT 'pending',
                calendar_day INTEGER,
                calendar_month INTEGER,
                created_at INTEGER NOT NULL,
                resolved_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_world_events_campaign ON world_events(campaign_id, status);

            CREATE TABLE IF NOT EXISTS world_timeline (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                category TEXT DEFAULT 'event',
                calendar_day INTEGER DEFAULT 1,
                calendar_month INTEGER DEFAULT 1,
                calendar_year INTEGER DEFAULT 1,
                session_number INTEGER,
                visibility TEXT DEFAULT 'dm_only',
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_world_timeline_campaign ON world_timeline(campaign_id, calendar_year, calendar_month);
        ",
    },

    // ── Migration 6: NPC Intelligence + Decision Engines (Phase 6) ──
    Migration {
        name: "npc_intelligence",
        sql: "
            -- NPC personality and behavior data
            ALTER TABLE campaign_npcs ADD COLUMN personality_json TEXT DEFAULT '{}';
            ALTER TABLE campaign_npcs ADD COLUMN motivations_json TEXT DEFAULT '[]';
            ALTER TABLE campaign_npcs ADD COLUMN trust_score INTEGER DEFAULT 0;
            ALTER TABLE campaign_npcs ADD COLUMN fear_courage INTEGER DEFAULT 50;
            ALTER TABLE campaign_npcs ADD COLUMN intelligence INTEGER DEFAULT 10;
            ALTER TABLE campaign_npcs ADD COLUMN faction_id TEXT DEFAULT '';

            -- NPC memory system
            CREATE TABLE IF NOT EXISTS npc_memories (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                npc_id TEXT NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
                memory_type TEXT DEFAULT 'interaction',
                event_description TEXT NOT NULL,
                emotional_impact TEXT DEFAULT 'neutral',
                intensity INTEGER DEFAULT 5,
                session_number INTEGER DEFAULT 0,
                actors_json TEXT DEFAULT '[]',
                tags_json TEXT DEFAULT '[]',
                decay_rate REAL DEFAULT 0.5,
                is_forgotten INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_npc_memories_npc ON npc_memories(npc_id, is_forgotten);
            CREATE INDEX IF NOT EXISTS idx_npc_memories_campaign ON npc_memories(campaign_id, npc_id);

            -- Consequence tracking
            CREATE TABLE IF NOT EXISTS consequences (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                trigger_action TEXT NOT NULL,
                trigger_actor TEXT DEFAULT '',
                consequence_type TEXT DEFAULT 'reputation_change',
                severity TEXT DEFAULT 'moderate',
                description TEXT NOT NULL,
                target_type TEXT DEFAULT '',
                target_id TEXT DEFAULT '',
                mechanical_effect_json TEXT DEFAULT '{}',
                status TEXT DEFAULT 'pending',
                dm_approved INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL,
                resolved_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_consequences_campaign ON consequences(campaign_id, status);

            -- Merchant/shop system
            CREATE TABLE IF NOT EXISTS shops (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                name TEXT NOT NULL,
                shop_type TEXT DEFAULT 'general',
                scene_id TEXT DEFAULT '',
                inventory_json TEXT DEFAULT '[]',
                gold_available INTEGER DEFAULT 500,
                location_type TEXT DEFAULT 'town',
                npc_id TEXT DEFAULT '',
                price_modifier REAL DEFAULT 1.0,
                restock_interval INTEGER DEFAULT 7,
                last_restock INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL
            );
        ",
    },

    // ── Migration 7: Dynamic Story + Memory Systems (Phase 7) ──
    Migration {
        name: "story_memory_systems",
        sql: "
            -- Story threads: major plotlines with branching states
            CREATE TABLE IF NOT EXISTS story_threads (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                thread_type TEXT DEFAULT 'main_campaign',
                status TEXT DEFAULT 'dormant',
                current_phase TEXT DEFAULT '',
                phases_json TEXT DEFAULT '[]',
                linked_quest_ids_json TEXT DEFAULT '[]',
                linked_npc_ids_json TEXT DEFAULT '[]',
                dm_notes TEXT DEFAULT '',
                priority TEXT DEFAULT 'medium',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_story_threads_campaign ON story_threads(campaign_id, status);

            -- Story branches: decision points in threads
            CREATE TABLE IF NOT EXISTS story_branches (
                id TEXT PRIMARY KEY,
                thread_id TEXT NOT NULL REFERENCES story_threads(id) ON DELETE CASCADE,
                campaign_id TEXT NOT NULL,
                decision_prompt TEXT NOT NULL,
                chosen_branch TEXT DEFAULT '',
                branches_json TEXT DEFAULT '[]',
                session_number INTEGER DEFAULT 0,
                consequences_json TEXT DEFAULT '[]',
                created_at INTEGER NOT NULL,
                resolved_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_story_branches_thread ON story_branches(thread_id);

            -- Villain profiles: extends NPC data
            CREATE TABLE IF NOT EXISTS villain_profiles (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                npc_id TEXT NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
                master_plan_json TEXT DEFAULT '[]',
                power_level INTEGER DEFAULT 1,
                resources_json TEXT DEFAULT '{}',
                adaptations_json TEXT DEFAULT '[]',
                weaknesses_json TEXT DEFAULT '[]',
                current_phase INTEGER DEFAULT 1,
                phase_descriptions_json TEXT DEFAULT '[]',
                is_active INTEGER DEFAULT 1,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                UNIQUE(campaign_id, npc_id)
            );

            -- Campaign arcs: high-level narrative arcs
            CREATE TABLE IF NOT EXISTS campaign_arcs (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                arc_type TEXT DEFAULT 'main_campaign',
                status TEXT DEFAULT 'setup',
                linked_quest_ids_json TEXT DEFAULT '[]',
                linked_npc_ids_json TEXT DEFAULT '[]',
                linked_thread_ids_json TEXT DEFAULT '[]',
                key_moments_json TEXT DEFAULT '[]',
                sessions_active_json TEXT DEFAULT '[]',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_campaign_arcs ON campaign_arcs(campaign_id, status);

            -- Campaign history: unified event archive
            CREATE TABLE IF NOT EXISTS campaign_history (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                session_id TEXT DEFAULT '',
                session_number INTEGER DEFAULT 0,
                event_type TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                actors_json TEXT DEFAULT '[]',
                location TEXT DEFAULT '',
                mechanical_data_json TEXT DEFAULT '{}',
                narrative_significance INTEGER DEFAULT 1,
                tags_json TEXT DEFAULT '[]',
                is_bookmarked INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_campaign_history ON campaign_history(campaign_id, session_number);
            CREATE INDEX IF NOT EXISTS idx_campaign_history_type ON campaign_history(campaign_id, category);
            CREATE INDEX IF NOT EXISTS idx_campaign_history_bookmark ON campaign_history(campaign_id, is_bookmarked);

            -- Secrets tracking
            CREATE TABLE IF NOT EXISTS campaign_secrets (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                content TEXT NOT NULL,
                secret_type TEXT DEFAULT 'personal',
                known_by_json TEXT DEFAULT '[]',
                reveal_conditions TEXT DEFAULT '',
                narrative_impact TEXT DEFAULT 'moderate',
                urgency TEXT DEFAULT 'low',
                is_revealed INTEGER DEFAULT 0,
                dm_notes TEXT DEFAULT '',
                created_at INTEGER NOT NULL,
                revealed_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_campaign_secrets ON campaign_secrets(campaign_id, is_revealed);
        ",
    },

    // ── Migration 8: Advanced Systems (Phases 8-9) ──
    Migration {
        name: "advanced_systems",
        sql: "
            -- Session replay for multiplayer hardening (Phase 8)
            CREATE TABLE IF NOT EXISTS session_replays (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                event_sequence INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                actor TEXT DEFAULT '',
                payload_json TEXT DEFAULT '{}',
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_session_replays ON session_replays(campaign_id, session_id, event_sequence);

            -- Roll verification log (Phase 8)
            CREATE TABLE IF NOT EXISTS verified_rolls (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                player_id TEXT DEFAULT '',
                roll_type TEXT NOT NULL,
                dice_expression TEXT NOT NULL,
                result INTEGER NOT NULL,
                server_verified INTEGER DEFAULT 0,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_verified_rolls ON verified_rolls(campaign_id, session_id);

            -- Investigation clues (Phase 9)
            CREATE TABLE IF NOT EXISTS campaign_clues (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                mystery_name TEXT DEFAULT '',
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                clue_type TEXT DEFAULT 'physical',
                location_found TEXT DEFAULT '',
                discovered_by TEXT DEFAULT '',
                links_to_clues_json TEXT DEFAULT '[]',
                red_herring INTEGER DEFAULT 0,
                required_for_solution INTEGER DEFAULT 0,
                discovery_dc INTEGER DEFAULT 10,
                is_discovered INTEGER DEFAULT 0,
                dm_notes TEXT DEFAULT '',
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_campaign_clues ON campaign_clues(campaign_id, is_discovered);

            -- Rumors (Phase 9)
            CREATE TABLE IF NOT EXISTS campaign_rumors (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                content TEXT NOT NULL,
                truth_percentage INTEGER DEFAULT 50,
                origin_location TEXT DEFAULT '',
                origin_npc TEXT DEFAULT '',
                current_locations_json TEXT DEFAULT '[]',
                spread_rate REAL DEFAULT 0.3,
                distortion_level INTEGER DEFAULT 0,
                tags_json TEXT DEFAULT '[]',
                expiry_sessions INTEGER DEFAULT 10,
                is_active INTEGER DEFAULT 1,
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_campaign_rumors ON campaign_rumors(campaign_id, is_active);

            -- World crises (Phase 9)
            CREATE TABLE IF NOT EXISTS world_crises (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL REFERENCES campaigns(id),
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                crisis_type TEXT DEFAULT 'natural',
                severity INTEGER DEFAULT 5,
                affected_regions_json TEXT DEFAULT '[]',
                escalation_timeline_json TEXT DEFAULT '[]',
                current_phase INTEGER DEFAULT 1,
                resolution_conditions_json TEXT DEFAULT '[]',
                consequences_json TEXT DEFAULT '[]',
                status TEXT DEFAULT 'active',
                created_at INTEGER NOT NULL,
                resolved_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_world_crises ON world_crises(campaign_id, status);

            -- Artifact evolution (Phase 9)
            CREATE TABLE IF NOT EXISTS artifact_profiles (
                id TEXT PRIMARY KEY,
                campaign_id TEXT NOT NULL,
                item_name TEXT NOT NULL,
                wielder TEXT DEFAULT '',
                awakening_level INTEGER DEFAULT 0,
                xp_absorbed INTEGER DEFAULT 0,
                xp_to_next INTEGER DEFAULT 1000,
                abilities_json TEXT DEFAULT '[]',
                personality_json TEXT DEFAULT '{}',
                wielder_bond INTEGER DEFAULT 0,
                curse_stage INTEGER DEFAULT 0,
                lore_revealed_json TEXT DEFAULT '[]',
                dm_notes TEXT DEFAULT '',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_artifact_profiles ON artifact_profiles(campaign_id);
        ",
    },

    // ── Future migrations go here ──
];
