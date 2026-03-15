use rusqlite::{Connection, Result as SqlResult};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

/// Global state holding the app data directory path
pub struct AppState {
    pub data_dir: PathBuf,
    /// Cache of open connections per character ID
    pub connections: Mutex<HashMap<String, Mutex<Connection>>>,
    /// Wiki connection
    pub wiki_conn: Mutex<Connection>,
    /// Campaign database connection (DM side)
    pub campaign_conn: Mutex<Option<Connection>>,
    /// Currently active campaign ID
    pub active_campaign: Mutex<Option<String>>,
}

impl AppState {
    pub fn new(data_dir: PathBuf, wiki_conn: Connection) -> Self {
        Self {
            data_dir,
            connections: Mutex::new(HashMap::new()),
            wiki_conn: Mutex::new(wiki_conn),
            campaign_conn: Mutex::new(None),
            active_campaign: Mutex::new(None),
        }
    }

    pub fn characters_dir(&self) -> PathBuf {
        self.data_dir.join("characters")
    }

    pub fn char_db_path(&self, character_id: &str) -> PathBuf {
        // Sanitize: only allow alphanumeric and hyphens
        let safe_id: String = character_id
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '-')
            .collect();
        self.characters_dir().join(format!("{}.db", safe_id))
    }

    /// Get or create a connection for a character
    pub fn get_char_conn(&self, character_id: &str) -> Result<(), String> {
        let mut conns = self.connections.lock().map_err(|_| {
            "Database is temporarily busy. Please try again.".to_string()
        })?;
        if conns.contains_key(character_id) {
            return Ok(());
        }
        // Limit cached connections to prevent memory exhaustion
        if conns.len() >= 100 {
            eprintln!("[db] Connection cache full ({} entries), evicting oldest", conns.len());
            // Remove a random entry to make room (all are equally valid to evict)
            if let Some(key) = conns.keys().next().cloned() {
                conns.remove(&key);
            }
        }
        let db_path = self.char_db_path(character_id);
        let conn = open_connection(&db_path).map_err(|e| {
            format!("Failed to open character database: {}", e)
        })?;
        // Always ensure tables exist (handles DBs that exist but have no schema)
        init_character_tables(&conn).map_err(|e| {
            format!("Failed to initialize character tables: {}", e)
        })?;
        migrate_character_db(&conn).map_err(|e| {
            format!("Failed to migrate character database: {}", e)
        })?;
        init_defaults(&conn).map_err(|e| {
            format!("Failed to initialize defaults: {}", e)
        })?;
        ensure_conditions(&conn).map_err(|e| {
            format!("Failed to initialize conditions: {}", e)
        })?;
        conns.insert(character_id.to_string(), Mutex::new(conn));
        Ok(())
    }

    /// Execute a closure with a character's connection
    pub fn with_char_conn<F, T>(&self, character_id: &str, f: F) -> Result<T, String>
    where
        F: FnOnce(&Connection) -> Result<T, String>,
    {
        self.get_char_conn(character_id)?;
        let conns = self.connections.lock().map_err(|_| {
            "Database is temporarily busy. Please try again.".to_string()
        })?;
        let conn_mutex = conns.get(character_id).ok_or(
            "Character database connection not found. Please try again.".to_string()
        )?;
        let conn = conn_mutex.lock().map_err(|_| {
            "Character database is locked by another operation. Please try again.".to_string()
        })?;
        f(&conn)
    }

    /// Remove a character's connection from the cache
    pub fn remove_char_conn(&self, character_id: &str) -> Result<(), String> {
        let mut conns = self.connections.lock().map_err(|_| {
            "Database is temporarily busy. Please try again.".to_string()
        })?;
        conns.remove(character_id);
        Ok(())
    }
}

/// Open a SQLite connection with WAL mode, foreign keys, and performance tuning
pub fn open_connection(path: &Path) -> SqlResult<Connection> {
    let conn = Connection::open(path)?;
    conn.busy_timeout(std::time::Duration::from_secs(5))?;
    conn.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA foreign_keys=ON;
         PRAGMA synchronous=NORMAL;
         PRAGMA cache_size=-8000;
         PRAGMA temp_store=MEMORY;
         PRAGMA mmap_size=30000000;"
    )?;
    Ok(conn)
}

/// Initialize all tables for a character database
pub fn init_character_tables(conn: &Connection) -> SqlResult<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS character_overview (
            id INTEGER PRIMARY KEY DEFAULT 1,
            name TEXT NOT NULL DEFAULT 'New Character',
            race TEXT DEFAULT '',
            subrace TEXT DEFAULT '',
            primary_class TEXT DEFAULT '',
            primary_subclass TEXT DEFAULT '',
            level INTEGER DEFAULT 1,
            background TEXT DEFAULT '',
            alignment TEXT DEFAULT '',
            experience_points INTEGER DEFAULT 0,
            max_hp INTEGER DEFAULT 10,
            current_hp INTEGER DEFAULT 10,
            temp_hp INTEGER DEFAULT 0,
            armor_class INTEGER DEFAULT 10,
            speed INTEGER DEFAULT 30,
            hit_dice_total TEXT DEFAULT '1d10',
            hit_dice_used INTEGER DEFAULT 0,
            death_save_successes INTEGER DEFAULT 0,
            death_save_failures INTEGER DEFAULT 0,
            inspiration INTEGER DEFAULT 0,
            senses TEXT DEFAULT '',
            languages TEXT DEFAULT 'Common',
            proficiencies_armor TEXT DEFAULT '',
            proficiencies_weapons TEXT DEFAULT '',
            proficiencies_tools TEXT DEFAULT '',
            campaign_name TEXT DEFAULT '',
            exhaustion_level INTEGER DEFAULT 0,
            ruleset TEXT DEFAULT '5e-2014',
            multiclass_data TEXT DEFAULT '[]',
            updated_at TEXT DEFAULT '',
            notes TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS ability_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ability TEXT NOT NULL UNIQUE,
            score INTEGER DEFAULT 10
        );

        CREATE TABLE IF NOT EXISTS saving_throws (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ability TEXT NOT NULL UNIQUE,
            proficient INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            proficient INTEGER DEFAULT 0,
            expertise INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS backstory (
            id INTEGER PRIMARY KEY DEFAULT 1,
            backstory_text TEXT DEFAULT '',
            personality_traits TEXT DEFAULT '',
            ideals TEXT DEFAULT '',
            bonds TEXT DEFAULT '',
            flaws TEXT DEFAULT '',
            age TEXT DEFAULT '',
            height TEXT DEFAULT '',
            weight TEXT DEFAULT '',
            eyes TEXT DEFAULT '',
            hair TEXT DEFAULT '',
            skin TEXT DEFAULT '',
            portrait_data TEXT DEFAULT '',
            allies_organizations TEXT DEFAULT '',
            appearance_notes TEXT DEFAULT '',
            goals_motivations TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS spells (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level INTEGER DEFAULT 0,
            school TEXT DEFAULT '',
            casting_time TEXT DEFAULT '',
            spell_range TEXT DEFAULT '',
            components TEXT DEFAULT '',
            material TEXT DEFAULT '',
            duration TEXT DEFAULT '',
            concentration INTEGER DEFAULT 0,
            ritual INTEGER DEFAULT 0,
            description TEXT DEFAULT '',
            upcast_notes TEXT DEFAULT '',
            prepared INTEGER DEFAULT 0,
            source TEXT DEFAULT 'PHB'
        );

        CREATE TABLE IF NOT EXISTS spell_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_level INTEGER NOT NULL UNIQUE,
            max_slots INTEGER DEFAULT 0,
            used_slots INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            item_type TEXT DEFAULT 'misc',
            weight REAL DEFAULT 0.0,
            value_gp REAL DEFAULT 0.0,
            quantity INTEGER DEFAULT 1,
            description TEXT DEFAULT '',
            attunement INTEGER DEFAULT 0,
            attuned INTEGER DEFAULT 0,
            equipped INTEGER DEFAULT 0,
            equipment_slot TEXT DEFAULT '',
            stat_modifiers TEXT DEFAULT '{}',
            rarity TEXT DEFAULT 'common'
        );

        CREATE TABLE IF NOT EXISTS currency (
            id INTEGER PRIMARY KEY DEFAULT 1,
            cp INTEGER DEFAULT 0,
            sp INTEGER DEFAULT 0,
            ep INTEGER DEFAULT 0,
            gp INTEGER DEFAULT 0,
            pp INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS features (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            source TEXT DEFAULT '',
            source_level INTEGER DEFAULT 0,
            feature_type TEXT DEFAULT 'class',
            description TEXT DEFAULT '',
            uses_total INTEGER DEFAULT 0,
            uses_remaining INTEGER DEFAULT 0,
            recharge TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS attacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            attack_bonus TEXT DEFAULT '+0',
            damage_dice TEXT DEFAULT '1d6',
            damage_type TEXT DEFAULT '',
            attack_range TEXT DEFAULT '',
            notes TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS conditions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            active INTEGER DEFAULT 0,
            duration_rounds INTEGER DEFAULT 0,
            rounds_remaining INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS combat_notes (
            id INTEGER PRIMARY KEY DEFAULT 1,
            actions TEXT DEFAULT '',
            bonus_actions TEXT DEFAULT '',
            reactions TEXT DEFAULT '',
            legendary_actions TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS journal_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            session_number INTEGER DEFAULT 0,
            real_date TEXT DEFAULT '',
            ingame_date TEXT DEFAULT '',
            body TEXT DEFAULT '',
            tags TEXT DEFAULT '',
            npcs_mentioned TEXT DEFAULT '',
            pinned INTEGER DEFAULT 0,
            created_at TEXT DEFAULT '',
            updated_at TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS npcs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'neutral',
            race TEXT DEFAULT '',
            npc_class TEXT DEFAULT '',
            location TEXT DEFAULT '',
            description TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            status TEXT DEFAULT 'alive'
        );

        CREATE TABLE IF NOT EXISTS quests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            giver TEXT DEFAULT '',
            description TEXT DEFAULT '',
            status TEXT DEFAULT 'active',
            notes TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS quest_objectives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS lore_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT DEFAULT '',
            body TEXT DEFAULT '',
            related_to TEXT DEFAULT '',
            created_at TEXT DEFAULT '',
            updated_at TEXT DEFAULT ''
        );"
    )?;
    Ok(())
}

/// Safely add a column if it doesn't exist (ALTER TABLE is a no-op when column exists in SQLite
/// only if we catch the error, so we just ignore "duplicate column" errors)
fn add_column_if_missing(conn: &Connection, table: &str, column: &str, col_type: &str, default: &str) {
    let sql = format!(
        "ALTER TABLE {} ADD COLUMN {} {} DEFAULT {}",
        table, column, col_type, default
    );
    // SQLite returns "duplicate column name" error if already exists — safe to ignore
    let _ = conn.execute(&sql, []);
}

/// Migrate schema for older character databases.
/// This runs every time a connection is opened and is fully idempotent.
/// Each migration safely adds missing columns — existing data is NEVER lost.
pub fn migrate_character_db(conn: &Connection) -> SqlResult<()> {
    // ── Schema version tracking ──
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_meta (
            key TEXT PRIMARY KEY,
            value TEXT DEFAULT ''
        );"
    )?;

    // ── character_overview columns ──
    add_column_if_missing(conn, "character_overview", "ruleset", "TEXT", "'5e-2014'");
    add_column_if_missing(conn, "character_overview", "multiclass_data", "TEXT", "'[]'");
    add_column_if_missing(conn, "character_overview", "updated_at", "TEXT", "''");
    add_column_if_missing(conn, "character_overview", "notes", "TEXT", "''");
    add_column_if_missing(conn, "character_overview", "climb_speed", "INTEGER", "0");
    add_column_if_missing(conn, "character_overview", "swim_speed", "INTEGER", "0");
    add_column_if_missing(conn, "character_overview", "fly_speed", "INTEGER", "0");

    // ── features columns ──
    add_column_if_missing(conn, "features", "uses_total", "INTEGER", "0");
    add_column_if_missing(conn, "features", "uses_remaining", "INTEGER", "0");
    add_column_if_missing(conn, "features", "recharge", "TEXT", "''");

    // ── conditions columns ──
    add_column_if_missing(conn, "conditions", "duration_rounds", "INTEGER", "0");
    add_column_if_missing(conn, "conditions", "rounds_remaining", "INTEGER", "0");

    // ── journal_entries columns ──
    add_column_if_missing(conn, "journal_entries", "npcs_mentioned", "TEXT", "''");
    add_column_if_missing(conn, "journal_entries", "pinned", "INTEGER", "0");

    // ── lore_notes columns ──
    add_column_if_missing(conn, "lore_notes", "related_to", "TEXT", "''");

    // ── backstory columns (future-proofing) ──
    add_column_if_missing(conn, "backstory", "goals_motivations", "TEXT", "''");

    // ── items columns ──
    add_column_if_missing(conn, "items", "equipment_slot", "TEXT", "''");
    add_column_if_missing(conn, "items", "stat_modifiers", "TEXT", "'{}'");
    add_column_if_missing(conn, "items", "rarity", "TEXT", "'common'");

    // ── Automation engine columns ──
    add_column_if_missing(conn, "character_overview", "hp_calc_method", "TEXT", "'auto'");
    add_column_if_missing(conn, "character_overview", "initiative_bonus", "INTEGER", "0");
    add_column_if_missing(conn, "character_overview", "spell_attack_bonus", "INTEGER", "0");

    // ── Damage modifiers (resistances, immunities, vulnerabilities) ──
    add_column_if_missing(conn, "character_overview", "damage_modifiers", "TEXT", "'{}'");

    // ── Update schema version ──
    conn.execute(
        "INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('schema_version', '5')",
        [],
    )?;

    Ok(())
}

/// Initialize default ability scores, saving throws, skills, and overview row
pub fn init_defaults(conn: &Connection) -> SqlResult<()> {
    // Ensure a default overview row exists (won't overwrite existing data)
    conn.execute(
        "INSERT OR IGNORE INTO character_overview (id) VALUES (1)",
        [],
    )?;

    let abilities = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    for ab in &abilities {
        conn.execute(
            "INSERT OR IGNORE INTO ability_scores (ability, score) VALUES (?1, 10)",
            [ab],
        )?;
        conn.execute(
            "INSERT OR IGNORE INTO saving_throws (ability, proficient) VALUES (?1, 0)",
            [ab],
        )?;
    }

    let skills = [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics",
        "Deception", "History", "Insight", "Intimidation",
        "Investigation", "Medicine", "Nature", "Perception",
        "Performance", "Persuasion", "Religion", "Sleight of Hand",
        "Stealth", "Survival",
    ];
    for sk in &skills {
        conn.execute(
            "INSERT OR IGNORE INTO skills (name, proficient, expertise) VALUES (?1, 0, 0)",
            [sk],
        )?;
    }

    Ok(())
}

/// Ensure default conditions exist
pub fn ensure_conditions(conn: &Connection) -> SqlResult<()> {
    let conditions = [
        "Blinded", "Charmed", "Deafened", "Frightened", "Grappled",
        "Incapacitated", "Invisible", "Paralyzed", "Petrified",
        "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious",
    ];
    for cond in &conditions {
        conn.execute(
            "INSERT OR IGNORE INTO conditions (name, active) VALUES (?1, 0)",
            [cond],
        )?;
    }
    Ok(())
}

/// List all character .db files in the characters directory
pub fn list_character_files(characters_dir: &Path) -> Vec<String> {
    let mut ids = Vec::new();
    if let Ok(entries) = fs::read_dir(characters_dir) {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.ends_with(".db") {
                ids.push(name.trim_end_matches(".db").to_string());
            }
        }
    }
    ids
}

/// Delete a character database and its WAL files
pub fn delete_character_files(db_path: &Path) -> Result<(), String> {
    for suffix in &["", "-wal", "-shm"] {
        let p = format!("{}{}", db_path.display(), suffix);
        let path = Path::new(&p);
        if path.exists() {
            fs::remove_file(path).map_err(|e| format!("Failed to delete {}: {}", p, e))?;
        }
    }
    Ok(())
}
