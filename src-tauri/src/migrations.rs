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

        conn.execute_batch(migration.sql)
            .map_err(|e| format!(
                "Migration #{} '{}' failed: {}",
                version, migration.name, e
            ))?;

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

    // ── Future migrations go here ──
    // Migration 2: dm_notes table (M5)
    // Migration 3: battle_maps table (M3)
    // Migration 4: campaign_calendar + calendar_events (M2)
    // Migration 5: homebrew_items (M4)
    // Migration 6: combat state columns on encounters + monsters (M6)
];
