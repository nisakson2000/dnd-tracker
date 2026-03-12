use crate::db::AppState;
use serde_json::json;
use std::collections::VecDeque;
use std::sync::Mutex;

// ─── Dev Log Buffer ────────────────────────────────────────────────────────

pub struct DevLogBuffer {
    pub entries: Mutex<VecDeque<String>>,
    start_time: std::time::Instant,
}

impl DevLogBuffer {
    pub fn new() -> Self {
        Self {
            entries: Mutex::new(VecDeque::with_capacity(500)),
            start_time: std::time::Instant::now(),
        }
    }

    #[allow(dead_code)]
    pub fn push(&self, level: &str, msg: &str) {
        if let Ok(mut entries) = self.entries.lock() {
            let elapsed = self.start_time.elapsed().as_secs_f64();
            let line = format!("[{:.2}s] [{}] {}", elapsed, level, msg);
            if entries.len() >= 500 {
                entries.pop_front();
            }
            entries.push_back(line);
        }
    }
}

/// Helper to log to both stderr and the dev buffer
#[macro_export]
macro_rules! dev_log {
    ($buffer:expr, $level:expr, $($arg:tt)*) => {
        {
            let msg = format!($($arg)*);
            eprintln!("[{}] {}", $level, msg);
            $buffer.push($level, &msg);
        }
    };
}

// ─── DB Inspector ───────────────────────────────────────────────────────────

#[tauri::command]
pub fn dev_list_tables(
    state: tauri::State<'_, AppState>,
    character_id: Option<String>,
) -> Result<serde_json::Value, String> {
    match character_id {
        Some(id) => state.with_char_conn(&id, |conn| list_tables_from_conn(conn)),
        None => {
            let conn = state.wiki_conn.lock().map_err(|_| "Wiki DB locked".to_string())?;
            list_tables_from_conn(&conn)
        }
    }
}

fn list_tables_from_conn(conn: &rusqlite::Connection) -> Result<serde_json::Value, String> {
    let mut stmt = conn
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        .map_err(|e| e.to_string())?;

    let tables: Vec<serde_json::Value> = stmt
        .query_map([], |row| {
            let name: String = row.get(0)?;
            Ok(name)
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .map(|table_name| {
            // Get column info
            let cols: Vec<serde_json::Value> = conn
                .prepare(&format!("PRAGMA table_info(\"{}\")", table_name))
                .and_then(|mut s| {
                    s.query_map([], |row| {
                        Ok(json!({
                            "name": row.get::<_, String>(1)?,
                            "type": row.get::<_, String>(2)?,
                            "notnull": row.get::<_, i32>(3)?,
                            "pk": row.get::<_, i32>(5)?,
                        }))
                    })
                    .map(|rows| rows.filter_map(|r| r.ok()).collect())
                })
                .unwrap_or_default();

            // Get row count
            let count: i64 = conn
                .query_row(&format!("SELECT COUNT(*) FROM \"{}\"", table_name), [], |row| row.get(0))
                .unwrap_or(0);

            json!({
                "name": table_name,
                "columns": cols,
                "row_count": count,
            })
        })
        .collect();

    Ok(json!(tables))
}

#[tauri::command]
pub fn dev_query_db(
    state: tauri::State<'_, AppState>,
    character_id: Option<String>,
    query: String,
) -> Result<serde_json::Value, String> {
    // Block destructive queries
    let upper = query.trim().to_uppercase();
    if upper.starts_with("DROP") || upper.starts_with("ALTER") || upper.starts_with("DELETE") || upper.starts_with("TRUNCATE") {
        return Err("Destructive queries (DROP/ALTER/DELETE/TRUNCATE) are blocked in the dev inspector".to_string());
    }

    match character_id {
        Some(id) => state.with_char_conn(&id, |conn| run_query(conn, &query)),
        None => {
            let conn = state.wiki_conn.lock().map_err(|_| "Wiki DB locked".to_string())?;
            run_query(&conn, &query)
        }
    }
}

fn run_query(conn: &rusqlite::Connection, query: &str) -> Result<serde_json::Value, String> {
    let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;
    let col_names: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();
    let col_count = col_names.len();

    let rows: Vec<Vec<serde_json::Value>> = stmt
        .query_map([], |row| {
            let mut vals = Vec::with_capacity(col_count);
            for i in 0..col_count {
                let val = match row.get_ref(i) {
                    Ok(val_ref) => match val_ref.data_type() {
                        rusqlite::types::Type::Null => serde_json::Value::Null,
                        rusqlite::types::Type::Integer => {
                            serde_json::Value::Number(row.get::<_, i64>(i).unwrap_or(0).into())
                        }
                        rusqlite::types::Type::Real => {
                            let f: f64 = row.get(i).unwrap_or(0.0);
                            serde_json::Number::from_f64(f)
                                .map(serde_json::Value::Number)
                                .unwrap_or(serde_json::Value::Null)
                        }
                        rusqlite::types::Type::Text => {
                            serde_json::Value::String(row.get::<_, String>(i).unwrap_or_default())
                        }
                        rusqlite::types::Type::Blob => {
                            serde_json::Value::String("[blob]".to_string())
                        }
                    },
                    Err(_) => serde_json::Value::Null,
                };
                vals.push(val);
            }
            Ok(vals)
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .take(500) // Limit results
        .collect();

    Ok(json!({
        "columns": col_names,
        "rows": rows,
        "row_count": rows.len(),
    }))
}

// ─── Log Viewer ─────────────────────────────────────────────────────────────

#[tauri::command]
pub fn dev_get_log_buffer(
    state: tauri::State<'_, DevLogBuffer>,
) -> Result<Vec<String>, String> {
    let entries = state.entries.lock().map_err(|_| "Log buffer locked".to_string())?;
    Ok(entries.iter().cloned().collect())
}

// ─── Environment Check ─────────────────────────────────────────────────────

#[tauri::command]
pub fn dev_check_environment(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let run = |cmd: &str, args: &[&str]| -> String {
        std::process::Command::new(cmd)
            .args(args)
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|_| "not found".to_string())
    };

    let git_sha = run("git", &["rev-parse", "--short", "HEAD"]);
    let git_branch = run("git", &["branch", "--show-current"]);
    let node_version = run("node", &["--version"]);
    let npm_version = run("npm", &["--version"]);
    let rustc_version = run("rustc", &["--version"]);

    // DB schema hash — hash of all CREATE TABLE statements
    let schema_hash = state.with_char_conn(
        &crate::db::list_character_files(&state.characters_dir())
            .first()
            .cloned()
            .unwrap_or_default(),
        |conn| {
            let sql: String = conn
                .prepare("SELECT GROUP_CONCAT(sql, '|') FROM sqlite_master WHERE type='table' ORDER BY name")
                .and_then(|mut s| s.query_row([], |row| row.get(0)))
                .unwrap_or_default();
            // Simple hash
            let hash: u64 = sql.bytes().enumerate().fold(0u64, |acc, (i, b)| {
                acc.wrapping_add((b as u64).wrapping_mul(31u64.wrapping_pow(i as u32)))
            });
            Ok(format!("{:x}", hash))
        },
    )
    .unwrap_or_else(|_| "no characters".to_string());

    Ok(json!({
        "app_version": env!("CARGO_PKG_VERSION"),
        "git_sha": git_sha,
        "git_branch": git_branch,
        "node_version": node_version,
        "npm_version": npm_version,
        "rustc_version": rustc_version,
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "schema_hash": schema_hash,
        "data_dir": state.data_dir.display().to_string(),
    }))
}

// ─── Test Character Generator ───────────────────────────────────────────────

#[tauri::command]
pub fn dev_generate_test_character(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    use uuid::Uuid;

    let char_id = Uuid::new_v4().to_string();
    let db_path = state.char_db_path(&char_id);
    let conn = crate::db::open_connection(&db_path).map_err(|e| e.to_string())?;
    crate::db::init_character_tables(&conn).map_err(|e| e.to_string())?;
    crate::db::init_defaults(&conn).map_err(|e| e.to_string())?;
    crate::db::ensure_conditions(&conn).map_err(|e| e.to_string())?;

    // Random selection helper
    let pick = |opts: &[&str]| -> String {
        let idx = (std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .subsec_nanos() as usize)
            % opts.len();
        opts[idx].to_string()
    };

    let names = ["Thorin Ironforge", "Elara Moonwhisper", "Grimjaw the Bold", "Lyra Shadowstep",
                 "Darius Flameheart", "Mira Starweaver", "Brok Stonefist", "Seraphina Dawnlight",
                 "Kael Nightbringer", "Vex Thornwood", "Zara Windwalker", "Oric Battleborn"];
    let races = ["Human", "Elf", "Dwarf", "Halfling", "Tiefling", "Dragonborn", "Gnome", "Half-Orc"];
    let classes = ["Fighter", "Wizard", "Rogue", "Cleric", "Ranger", "Paladin", "Bard", "Barbarian", "Warlock", "Sorcerer"];
    let backgrounds = ["Acolyte", "Criminal", "Folk Hero", "Noble", "Sage", "Soldier", "Outlander", "Entertainer"];
    let alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral"];

    let name = pick(&names);
    let race = pick(&races);
    let class = pick(&classes);
    let level: u32 = (std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos() % 15 + 1) as u32;
    let background = pick(&backgrounds);
    let alignment = pick(&alignments);
    let max_hp = 10 + (level * 6);

    // Overview
    conn.execute(
        "INSERT OR REPLACE INTO character_overview (id, name, race, primary_class, level, background, alignment, max_hp, current_hp, armor_class, speed, hit_dice_total, languages, campaign_name, ruleset)
         VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7, ?8, 30, ?9, 'Common, Elvish', 'Test Campaign', '5e-2014')",
        rusqlite::params![name, race, class, level, background, alignment, max_hp, 10 + (level / 2), format!("{}d10", level)],
    ).map_err(|e| e.to_string())?;

    // Random ability scores (4d6 drop lowest simulation — just use varied numbers)
    let scores = [
        ("STR", 8 + (level % 6) as i32),
        ("DEX", 10 + (level % 5) as i32),
        ("CON", 12 + (level % 4) as i32),
        ("INT", 14 - (level % 3) as i32),
        ("WIS", 11 + (level % 5) as i32),
        ("CHA", 13 - (level % 4) as i32),
    ];
    for (ab, score) in &scores {
        conn.execute("UPDATE ability_scores SET score = ?1 WHERE ability = ?2", rusqlite::params![score, ab])
            .map_err(|e| e.to_string())?;
    }

    // Backstory
    conn.execute(
        "INSERT OR REPLACE INTO backstory (id, backstory_text, personality_traits, ideals, bonds, flaws, age, height, weight, eyes, hair)
         VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        rusqlite::params![
            format!("{} grew up in a small village on the edge of the Sword Coast. After a devastating attack by a dragon, they swore to protect the innocent and seek out ancient artifacts of power.", name),
            "I am always calm, no matter the situation. I never raise my voice or let my emotions control me.",
            "Knowledge. The path to power and self-improvement is through knowledge.",
            "I owe my life to the priest who took me in when my parents died.",
            "I have trouble trusting in my allies.",
            format!("{}", 20 + level * 2),
            "5'10\"", "170 lbs", "Green", "Dark Brown"
        ],
    ).map_err(|e| e.to_string())?;

    // Spells
    let spell_data = [
        ("Fire Bolt", 0, "Evocation", "1 action", "120 feet", "V, S", "Instantaneous", "A beam of crackling fire at a creature", 0),
        ("Shield", 1, "Abjuration", "1 reaction", "Self", "V, S", "1 round", "An invisible barrier of magical force appears", 0),
        ("Magic Missile", 1, "Evocation", "1 action", "120 feet", "V, S", "Instantaneous", "Three glowing darts of magical force", 0),
        ("Fireball", 3, "Evocation", "1 action", "150 feet", "V, S, M", "Instantaneous", "A bright streak flashes to a point and explodes", 1),
        ("Cure Wounds", 1, "Evocation", "1 action", "Touch", "V, S", "Instantaneous", "A creature you touch regains hit points", 1),
        ("Mage Armor", 1, "Abjuration", "1 action", "Touch", "V, S, M", "8 hours", "You touch a willing creature and a protective magical force surrounds it", 0),
    ];
    for (sname, slevel, school, cast, range, comp, dur, desc, prep) in &spell_data {
        if *slevel <= (level / 2 + 1) as i32 {
            conn.execute(
                "INSERT INTO spells (name, level, school, casting_time, spell_range, components, duration, description, prepared) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
                rusqlite::params![sname, slevel, school, cast, range, comp, dur, desc, prep],
            ).map_err(|e| e.to_string())?;
        }
    }

    // Spell slots
    for slot_level in 1..=4u32 {
        if slot_level <= level / 2 + 1 {
            let max = if slot_level == 1 { 4 } else if slot_level == 2 { 3 } else { 2 };
            conn.execute(
                "INSERT INTO spell_slots (slot_level, max_slots, used_slots) VALUES (?1, ?2, 0)",
                rusqlite::params![slot_level, max],
            ).map_err(|e| e.to_string())?;
        }
    }

    // Items
    let items = [
        ("Longsword", "weapon", 3.0, 15.0, "A finely crafted steel longsword"),
        ("Chain Mail", "armor", 55.0, 75.0, "Heavy armor made of interlocking metal rings"),
        ("Shield", "armor", 6.0, 10.0, "A wooden shield with iron reinforcements"),
        ("Healing Potion", "consumable", 0.5, 50.0, "Restores 2d4+2 hit points"),
        ("Rope (50 ft)", "gear", 10.0, 1.0, "Hempen rope, 50 feet"),
        ("Torch (x5)", "gear", 5.0, 0.05, "A bundle of five torches"),
        ("Backpack", "gear", 5.0, 2.0, "A leather backpack"),
    ];
    for (iname, itype, weight, value, desc) in &items {
        conn.execute(
            "INSERT INTO items (name, item_type, weight, value_gp, quantity, description) VALUES (?1,?2,?3,?4,1,?5)",
            rusqlite::params![iname, itype, weight, value, desc],
        ).map_err(|e| e.to_string())?;
    }

    // Currency
    conn.execute(
        "INSERT OR REPLACE INTO currency (id, cp, sp, ep, gp, pp) VALUES (1, 45, 23, 5, 150, 3)",
        [],
    ).map_err(|e| e.to_string())?;

    // Features
    let feats = [
        ("Second Wind", "Fighter", "class", "Regain 1d10 + fighter level HP as a bonus action", 1, "short rest"),
        ("Action Surge", "Fighter", "class", "Take one additional action on your turn", 1, "short rest"),
        ("Dark Vision", &race, "racial", "See in dim light within 60 feet as if it were bright light", 0, ""),
    ];
    for (fname, src, ftype, desc, uses, recharge) in &feats {
        conn.execute(
            "INSERT INTO features (name, source, feature_type, description, uses_total, uses_remaining, recharge) VALUES (?1,?2,?3,?4,?5,?5,?6)",
            rusqlite::params![fname, src, ftype, desc, uses, recharge],
        ).map_err(|e| e.to_string())?;
    }

    // Attacks
    conn.execute(
        "INSERT INTO attacks (name, attack_bonus, damage_dice, damage_type, attack_range, notes) VALUES ('Longsword', '+5', '1d8+3', 'Slashing', '5 ft', 'Versatile (1d10)')",
        [],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO attacks (name, attack_bonus, damage_dice, damage_type, attack_range, notes) VALUES ('Handaxe', '+5', '1d6+3', 'Slashing', '20/60 ft', 'Light, thrown')",
        [],
    ).map_err(|e| e.to_string())?;

    // Combat notes
    conn.execute(
        "INSERT OR REPLACE INTO combat_notes (id, actions, bonus_actions, reactions) VALUES (1, 'Attack, Dash, Dodge, Disengage, Help, Hide, Ready, Use Object', 'Second Wind, Off-hand Attack', 'Opportunity Attack')",
        [],
    ).map_err(|e| e.to_string())?;

    // NPCs
    let npc_data = [
        ("Gandrel the Wise", "ally", "Human", "Wizard", "Waterdeep", "An elderly wizard and mentor"),
        ("Vex Shadowfang", "enemy", "Tiefling", "Rogue", "Undermountain", "A cunning assassin who seeks the same artifact"),
        ("Innkeeper Marta", "neutral", "Halfling", "", "The Rusty Flagon", "A cheerful innkeeper with useful gossip"),
    ];
    for (nname, role, nrace, nclass, loc, desc) in &npc_data {
        conn.execute(
            "INSERT INTO npcs (name, role, race, npc_class, location, description) VALUES (?1,?2,?3,?4,?5,?6)",
            rusqlite::params![nname, role, nrace, nclass, loc, desc],
        ).map_err(|e| e.to_string())?;
    }

    // Quests
    conn.execute(
        "INSERT INTO quests (title, giver, description, status, notes) VALUES ('The Lost Artifact', 'Gandrel the Wise', 'Find the Staff of Arcane Power hidden in the Tomb of the Last King', 'active', 'Rumored to be guarded by an ancient dragon')",
        [],
    ).map_err(|e| e.to_string())?;
    let quest_id: i64 = conn.last_insert_rowid();
    conn.execute("INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1, 'Find the entrance to the Tomb', 1)", rusqlite::params![quest_id]).map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1, 'Defeat the guardian', 0)", rusqlite::params![quest_id]).map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1, 'Retrieve the Staff', 0)", rusqlite::params![quest_id]).map_err(|e| e.to_string())?;

    // Journal entries
    conn.execute(
        "INSERT INTO journal_entries (title, session_number, real_date, ingame_date, body, tags, pinned) VALUES ('The Journey Begins', 1, '2024-01-15', 'Day 1', 'We set out from Waterdeep at dawn. Gandrel gave us a map and warned us of dangers ahead.', 'travel,quest-start', 0)",
        [],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO journal_entries (title, session_number, real_date, ingame_date, body, tags, pinned) VALUES ('Ambush at the Crossroads', 2, '2024-01-22', 'Day 3', 'Bandits attacked us at the forest crossroads. We defeated them but took heavy damage.', 'combat,bandits', 1)",
        [],
    ).map_err(|e| e.to_string())?;

    // Lore notes
    conn.execute(
        "INSERT INTO lore_notes (title, category, body, related_to) VALUES ('The Tomb of the Last King', 'Location', 'An ancient burial site hidden deep in the Greypeak Mountains. Said to contain powerful artifacts from a forgotten age.', 'The Lost Artifact')",
        [],
    ).map_err(|e| e.to_string())?;

    Ok(json!({
        "character_id": char_id,
        "name": name,
        "class": class,
        "level": level,
        "race": race,
    }))
}

// ─── Enhanced Bug Report ────────────────────────────────────────────────────

#[tauri::command]
pub fn dev_collect_bug_report(
    state: tauri::State<'_, AppState>,
    log_buffer: tauri::State<'_, DevLogBuffer>,
    character_id: Option<String>,
) -> Result<serde_json::Value, String> {
    let run = |cmd: &str, args: &[&str]| -> String {
        std::process::Command::new(cmd)
            .args(args)
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|_| "unavailable".to_string())
    };

    let git_sha = run("git", &["rev-parse", "--short", "HEAD"]);
    let git_branch = run("git", &["branch", "--show-current"]);
    let git_dirty = run("git", &["status", "--porcelain"]);

    let logs: Vec<String> = log_buffer.entries.lock()
        .map(|e| e.iter().rev().take(50).cloned().collect())
        .unwrap_or_default();

    // Character snapshot if provided
    let char_snapshot = character_id.as_ref().map(|id| {
        state.with_char_conn(id, |conn| {
            let overview: String = conn
                .prepare("SELECT * FROM character_overview WHERE id=1")
                .and_then(|mut s| s.query_row([], |row| {
                    Ok(format!("{} (Lv{} {})",
                        row.get::<_, String>(1).unwrap_or_default(),
                        row.get::<_, i32>(5).unwrap_or(0),
                        row.get::<_, String>(4).unwrap_or_default(),
                    ))
                }))
                .unwrap_or_else(|_| "unknown".to_string());
            Ok(overview)
        }).unwrap_or_else(|e| e)
    });

    Ok(json!({
        "app_version": env!("CARGO_PKG_VERSION"),
        "git_sha": git_sha,
        "git_branch": git_branch,
        "git_dirty": !git_dirty.is_empty(),
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "character_summary": char_snapshot,
        "recent_logs": logs,
        "data_dir": state.data_dir.display().to_string(),
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

// ─── Schema Diff / Migration Runner ─────────────────────────────────────────

#[tauri::command]
pub fn dev_get_schema_diff(
    state: tauri::State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        // Get current schema
        let mut stmt = conn
            .prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
            .map_err(|e| e.to_string())?;

        let current: Vec<(String, String)> = stmt
            .query_map([], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, String>(1).unwrap_or_default()))
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        // Run migration check (dry-run style — just compare)
        let mut issues = Vec::new();

        // Check expected tables exist
        let expected_tables = [
            "character_overview", "ability_scores", "saving_throws", "skills",
            "backstory", "spells", "spell_slots", "items", "currency",
            "features", "attacks", "conditions", "combat_notes",
            "journal_entries", "npcs", "quests", "quest_objectives", "lore_notes",
        ];

        let current_names: Vec<&str> = current.iter().map(|(n, _)| n.as_str()).collect();

        for table in &expected_tables {
            if !current_names.contains(table) {
                issues.push(json!({
                    "type": "missing_table",
                    "table": table,
                    "severity": "error",
                }));
            }
        }

        // Check for expected columns in character_overview
        let overview_sql = current.iter()
            .find(|(n, _)| n == "character_overview")
            .map(|(_, sql)| sql.as_str())
            .unwrap_or("");

        let expected_cols = [
            "ruleset", "multiclass_data", "exhaustion_level", "campaign_name",
            "senses", "proficiencies_armor", "proficiencies_weapons", "proficiencies_tools",
        ];
        for col in &expected_cols {
            if !overview_sql.contains(col) {
                issues.push(json!({
                    "type": "missing_column",
                    "table": "character_overview",
                    "column": col,
                    "severity": "warning",
                }));
            }
        }

        Ok(json!({
            "tables": current.iter().map(|(n, s)| json!({"name": n, "sql": s})).collect::<Vec<_>>(),
            "issues": issues,
            "issue_count": issues.len(),
        }))
    })
}

#[tauri::command]
pub fn dev_run_migrations(
    state: tauri::State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        // Run the existing migration system
        crate::db::migrate_character_db(conn).map_err(|e| e.to_string())?;
        crate::db::ensure_conditions(conn).map_err(|e| e.to_string())?;

        Ok(json!({
            "success": true,
            "message": "Migrations applied successfully",
        }))
    })
}
