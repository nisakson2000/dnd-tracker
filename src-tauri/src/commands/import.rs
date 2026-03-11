use tauri::State;

use crate::db::{self, AppState};

fn safe_str(val: &serde_json::Value, default: &str) -> String {
    match val {
        serde_json::Value::String(s) => s.clone(),
        serde_json::Value::Null => default.to_string(),
        other => other.to_string().trim_matches('"').to_string(),
    }
}

fn safe_i64(val: &serde_json::Value, default: i64) -> i64 {
    match val {
        serde_json::Value::Number(n) => n.as_i64().unwrap_or(default),
        serde_json::Value::String(s) => s.parse().unwrap_or(default),
        _ => default,
    }
}

fn safe_f64(val: &serde_json::Value, default: f64) -> f64 {
    match val {
        serde_json::Value::Number(n) => n.as_f64().unwrap_or(default),
        serde_json::Value::String(s) => s.parse().unwrap_or(default),
        _ => default,
    }
}

fn safe_bool(val: &serde_json::Value, default: bool) -> bool {
    match val {
        serde_json::Value::Bool(b) => *b,
        serde_json::Value::Number(n) => n.as_i64().unwrap_or(0) != 0,
        serde_json::Value::String(s) => matches!(s.to_lowercase().as_str(), "true" | "1" | "yes"),
        _ => default,
    }
}

#[tauri::command]
pub fn import_character(
    state: State<'_, AppState>,
    character_id: String,
    payload: serde_json::Value,
) -> Result<serde_json::Value, String> {
    // Ensure DB exists and is initialized
    let chars_dir = state.characters_dir();
    std::fs::create_dir_all(&chars_dir).map_err(|e| e.to_string())?;

    let db_path = state.char_db_path(&character_id);
    if !db_path.exists() {
        let conn = db::open_connection(&db_path).map_err(|e| e.to_string())?;
        db::init_character_tables(&conn).map_err(|e| e.to_string())?;
        db::init_defaults(&conn).map_err(|e| e.to_string())?;
        let mut conns = state.connections.lock().map_err(|e| e.to_string())?;
        conns.insert(character_id.clone(), std::sync::Mutex::new(conn));
    } else {
        state.get_char_conn(&character_id)?;
    }

    state.with_char_conn(&character_id, |conn| {
        // Wrap entire import in a transaction — if anything fails, ALL changes roll back.
        // Without this, a failure mid-import (e.g. after deleting spells but before inserting
        // new ones) would leave the character with missing data and no way to recover.
        conn.execute("BEGIN TRANSACTION", []).map_err(|e| e.to_string())?;

        let result = (|| -> Result<serde_json::Value, String> {
        let mut imported = serde_json::Map::new();

        // Overview
        if let Some(ov) = payload.get("overview").and_then(|v| v.as_object()) {
            // Ensure row exists
            conn.execute("INSERT OR IGNORE INTO character_overview (id, name) VALUES (1, 'New Character')", []).map_err(|e| e.to_string())?;

            // SAFETY: field names are from hardcoded arrays below, not user input — no injection risk.
            let str_fields = ["name", "race", "subrace", "primary_class", "primary_subclass",
                "background", "alignment", "senses", "languages", "proficiencies_armor",
                "proficiencies_weapons", "proficiencies_tools", "campaign_name", "hit_dice_total", "multiclass_data"];
            for field in &str_fields {
                if let Some(val) = ov.get(*field) {
                    let sql = format!("UPDATE character_overview SET {} = ?1 WHERE id=1", field);
                    conn.execute(&sql, [safe_str(val, "")]).map_err(|e| format!("Failed to import field '{}': {}", field, e))?;
                }
            }
            let int_fields = ["level", "experience_points", "max_hp", "current_hp", "temp_hp",
                "armor_class", "speed", "hit_dice_used", "death_save_successes",
                "death_save_failures", "exhaustion_level"];
            for field in &int_fields {
                if let Some(val) = ov.get(*field) {
                    let sql = format!("UPDATE character_overview SET {} = ?1 WHERE id=1", field);
                    conn.execute(&sql, [safe_i64(val, 0)]).map_err(|e| format!("Failed to import field '{}': {}", field, e))?;
                }
            }
            if let Some(val) = ov.get("inspiration") {
                conn.execute("UPDATE character_overview SET inspiration = ?1 WHERE id=1", [safe_bool(val, false) as i64]).map_err(|e| e.to_string())?;
            }
            if let Some(val) = ov.get("ruleset") {
                conn.execute("UPDATE character_overview SET ruleset = ?1 WHERE id=1", [safe_str(val, "5e-2014")]).map_err(|e| e.to_string())?;
            }
            imported.insert("overview".to_string(), serde_json::json!(true));
        }

        // Ability scores
        if let Some(abs) = payload.get("ability_scores") {
            if let Some(obj) = abs.as_object() {
                for (ability, score) in obj {
                    let s = safe_i64(score, 10);
                    let updated = conn.execute("UPDATE ability_scores SET score=?1 WHERE ability=?2", rusqlite::params![s, ability]).map_err(|e| e.to_string())?;
                    if updated == 0 {
                        conn.execute("INSERT INTO ability_scores (ability, score) VALUES (?1, ?2)", rusqlite::params![ability, s]).map_err(|e| e.to_string())?;
                    }
                }
            } else if let Some(arr) = abs.as_array() {
                for item in arr {
                    if let Some(ability) = item.get("ability").and_then(|v| v.as_str()) {
                        let score = safe_i64(item.get("score").unwrap_or(&serde_json::json!(10)), 10);
                        let updated = conn.execute("UPDATE ability_scores SET score=?1 WHERE ability=?2", rusqlite::params![score, ability]).map_err(|e| e.to_string())?;
                        if updated == 0 {
                            conn.execute("INSERT INTO ability_scores (ability, score) VALUES (?1, ?2)", rusqlite::params![ability, score]).map_err(|e| e.to_string())?;
                        }
                    }
                }
            }
            imported.insert("ability_scores".to_string(), serde_json::json!(true));
        }

        // Saving throw proficiencies
        if let Some(profs) = payload.get("saving_throw_proficiencies").and_then(|v| v.as_array()) {
            let prof_set: Vec<String> = profs.iter().filter_map(|v| v.as_str().map(|s| s.to_string())).collect();
            for ability in &["STR", "DEX", "CON", "INT", "WIS", "CHA"] {
                let prof = prof_set.contains(&ability.to_string());
                conn.execute("UPDATE saving_throws SET proficient=?1 WHERE ability=?2", rusqlite::params![prof as i64, ability]).map_err(|e| e.to_string())?;
            }
            imported.insert("saving_throws".to_string(), serde_json::json!(true));
        }

        // Skills
        if let Some(skills) = payload.get("skills").and_then(|v| v.as_array()) {
            for sk in skills {
                if let Some(name) = sk.get("name").and_then(|v| v.as_str()) {
                    let prof = safe_bool(sk.get("proficient").unwrap_or(&serde_json::json!(false)), false);
                    let exp = safe_bool(sk.get("expertise").unwrap_or(&serde_json::json!(false)), false);
                    conn.execute("UPDATE skills SET proficient=?1, expertise=?2 WHERE name=?3", rusqlite::params![prof as i64, exp as i64, name]).map_err(|e| e.to_string())?;
                }
            }
            imported.insert("skills".to_string(), serde_json::json!(true));
        }

        // Backstory
        if let Some(bs) = payload.get("backstory").and_then(|v| v.as_object()) {
            conn.execute("INSERT OR IGNORE INTO backstory (id) VALUES (1)", []).map_err(|e| e.to_string())?;
            // SAFETY: field names are from hardcoded array below, not user input.
            let fields = ["backstory_text", "personality_traits", "ideals", "bonds", "flaws",
                "age", "height", "weight", "eyes", "hair", "skin",
                "allies_organizations", "appearance_notes", "goals_motivations"];
            for field in &fields {
                if let Some(val) = bs.get(*field) {
                    let sql = format!("UPDATE backstory SET {} = ?1 WHERE id=1", field);
                    conn.execute(&sql, [safe_str(val, "")]).map_err(|e| format!("Failed to import backstory field '{}': {}", field, e))?;
                }
            }
            imported.insert("backstory".to_string(), serde_json::json!(true));
        }

        // Spells
        if let Some(spells) = payload.get("spells").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM spells", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for sp in spells {
                let name = sp.get("name").and_then(|v| v.as_str()).unwrap_or("");
                if name.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO spells (name, level, school, casting_time, spell_range, components, material, duration, concentration, ritual, description, upcast_notes, prepared, source) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)",
                    rusqlite::params![
                        name,
                        safe_i64(sp.get("level").unwrap_or(&serde_json::json!(0)), 0),
                        safe_str(sp.get("school").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("casting_time").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("spell_range").or_else(|| sp.get("range")).unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("components").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("material").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("duration").unwrap_or(&serde_json::json!("")), ""),
                        safe_bool(sp.get("concentration").unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_bool(sp.get("ritual").unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_str(sp.get("description").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(sp.get("upcast_notes").or_else(|| sp.get("at_higher_levels")).unwrap_or(&serde_json::json!("")), ""),
                        safe_bool(sp.get("prepared").unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_str(sp.get("source").unwrap_or(&serde_json::json!("PHB")), "PHB"),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("spells".to_string(), serde_json::json!(count));
        }

        // Spell slots
        if let Some(slots) = payload.get("spell_slots").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM spell_slots", []).map_err(|e| e.to_string())?;
            for sl in slots {
                let level = safe_i64(sl.get("level").or_else(|| sl.get("slot_level")).unwrap_or(&serde_json::json!(0)), 0);
                let max_s = safe_i64(sl.get("max").or_else(|| sl.get("max_slots")).unwrap_or(&serde_json::json!(0)), 0);
                let used_s = safe_i64(sl.get("used").or_else(|| sl.get("used_slots")).unwrap_or(&serde_json::json!(0)), 0);
                if level > 0 {
                    conn.execute("INSERT INTO spell_slots (slot_level, max_slots, used_slots) VALUES (?1,?2,?3)", rusqlite::params![level, max_s, used_s]).map_err(|e| e.to_string())?;
                }
            }
            imported.insert("spell_slots".to_string(), serde_json::json!(true));
        }

        // Inventory
        if let Some(items) = payload.get("inventory").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM items", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for it in items {
                let name = it.get("name").and_then(|v| v.as_str()).unwrap_or("");
                if name.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO items (name, item_type, weight, value_gp, quantity, description, attunement, attuned, equipped, equipment_slot) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)",
                    rusqlite::params![
                        name,
                        safe_str(it.get("item_type").or_else(|| it.get("type")).unwrap_or(&serde_json::json!("misc")), "misc"),
                        safe_f64(it.get("weight").unwrap_or(&serde_json::json!(0.0)), 0.0),
                        safe_f64(it.get("value_gp").or_else(|| it.get("value")).unwrap_or(&serde_json::json!(0.0)), 0.0),
                        safe_i64(it.get("quantity").unwrap_or(&serde_json::json!(1)), 1),
                        safe_str(it.get("description").unwrap_or(&serde_json::json!("")), ""),
                        safe_bool(it.get("attunement").or_else(|| it.get("requires_attunement")).unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_bool(it.get("attuned").unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_bool(it.get("equipped").unwrap_or(&serde_json::json!(false)), false) as i64,
                        safe_str(it.get("equipment_slot").unwrap_or(&serde_json::json!("")), ""),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("inventory".to_string(), serde_json::json!(count));
        }

        // Currency
        if let Some(c) = payload.get("currency").and_then(|v| v.as_object()) {
            conn.execute("INSERT OR IGNORE INTO currency (id) VALUES (1)", []).map_err(|e| e.to_string())?;
            conn.execute("UPDATE currency SET cp=?1, sp=?2, ep=?3, gp=?4, pp=?5 WHERE id=1", rusqlite::params![
                safe_i64(c.get("cp").unwrap_or(&serde_json::json!(0)), 0),
                safe_i64(c.get("sp").unwrap_or(&serde_json::json!(0)), 0),
                safe_i64(c.get("ep").unwrap_or(&serde_json::json!(0)), 0),
                safe_i64(c.get("gp").unwrap_or(&serde_json::json!(0)), 0),
                safe_i64(c.get("pp").unwrap_or(&serde_json::json!(0)), 0),
            ]).map_err(|e| e.to_string())?;
            imported.insert("currency".to_string(), serde_json::json!(true));
        }

        // Features
        if let Some(features) = payload.get("features").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM features", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for f in features {
                let name = f.get("name").and_then(|v| v.as_str()).unwrap_or("");
                if name.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO features (name, source, source_level, feature_type, description) VALUES (?1,?2,?3,?4,?5)",
                    rusqlite::params![
                        name,
                        safe_str(f.get("source").unwrap_or(&serde_json::json!("")), ""),
                        safe_i64(f.get("source_level").or_else(|| f.get("level")).unwrap_or(&serde_json::json!(0)), 0),
                        safe_str(f.get("feature_type").or_else(|| f.get("type")).unwrap_or(&serde_json::json!("class")), "class"),
                        safe_str(f.get("description").unwrap_or(&serde_json::json!("")), ""),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("features".to_string(), serde_json::json!(count));
        }

        // Attacks
        if let Some(attacks) = payload.get("attacks").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM attacks", []).map_err(|e| e.to_string())?;
            for a in attacks {
                let name = a.get("name").and_then(|v| v.as_str()).unwrap_or("");
                if name.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO attacks (name, attack_bonus, damage_dice, damage_type, attack_range, notes) VALUES (?1,?2,?3,?4,?5,?6)",
                    rusqlite::params![
                        name,
                        safe_str(a.get("attack_bonus").unwrap_or(&serde_json::json!("+0")), "+0"),
                        safe_str(a.get("damage_dice").or_else(|| a.get("damage")).unwrap_or(&serde_json::json!("1d6")), "1d6"),
                        safe_str(a.get("damage_type").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(a.get("attack_range").or_else(|| a.get("range")).unwrap_or(&serde_json::json!("")), ""),
                        safe_str(a.get("notes").unwrap_or(&serde_json::json!("")), ""),
                    ],
                ).map_err(|e| e.to_string())?;
            }
            imported.insert("attacks".to_string(), serde_json::json!(true));
        }

        // Combat notes
        if let Some(cn) = payload.get("combat_notes").and_then(|v| v.as_object()) {
            conn.execute("INSERT OR IGNORE INTO combat_notes (id) VALUES (1)", []).map_err(|e| e.to_string())?;
            conn.execute("UPDATE combat_notes SET actions=?1, bonus_actions=?2, reactions=?3, legendary_actions=?4 WHERE id=1", rusqlite::params![
                safe_str(cn.get("actions").unwrap_or(&serde_json::json!("")), ""),
                safe_str(cn.get("bonus_actions").unwrap_or(&serde_json::json!("")), ""),
                safe_str(cn.get("reactions").unwrap_or(&serde_json::json!("")), ""),
                safe_str(cn.get("legendary_actions").unwrap_or(&serde_json::json!("")), ""),
            ]).map_err(|e| e.to_string())?;
            imported.insert("combat_notes".to_string(), serde_json::json!(true));
        }

        // Active conditions
        if let Some(conds) = payload.get("active_conditions").and_then(|v| v.as_array()) {
            let cond_names: Vec<String> = conds.iter().filter_map(|v| v.as_str().map(|s| s.to_string())).collect();
            db::ensure_conditions(conn).map_err(|e| e.to_string())?;
            // Set all inactive first
            conn.execute("UPDATE conditions SET active=0", []).map_err(|e| e.to_string())?;
            for name in &cond_names {
                conn.execute("UPDATE conditions SET active=1 WHERE name=?1", [name]).map_err(|e| e.to_string())?;
            }
            imported.insert("conditions".to_string(), serde_json::json!(true));
        }

        // Journal
        if let Some(entries) = payload.get("journal_entries").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM journal_entries", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for j in entries {
                let title = j.get("title").and_then(|v| v.as_str()).unwrap_or("");
                if title.is_empty() { continue; }
                let now = chrono::Utc::now().to_rfc3339();
                conn.execute(
                    "INSERT INTO journal_entries (title, session_number, real_date, ingame_date, body, tags, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
                    rusqlite::params![
                        title,
                        safe_i64(j.get("session_number").unwrap_or(&serde_json::json!(0)), 0),
                        safe_str(j.get("real_date").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(j.get("ingame_date").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(j.get("body").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(j.get("tags").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(j.get("created_at").unwrap_or(&serde_json::Value::String(now.clone())), &now),
                        safe_str(j.get("updated_at").unwrap_or(&serde_json::Value::String(now.clone())), &now),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("journal".to_string(), serde_json::json!(count));
        }

        // NPCs
        if let Some(npcs) = payload.get("npcs").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM npcs", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for n in npcs {
                let name = n.get("name").and_then(|v| v.as_str()).unwrap_or("");
                if name.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO npcs (name, role, race, npc_class, location, description, notes, status) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
                    rusqlite::params![
                        name,
                        safe_str(n.get("role").unwrap_or(&serde_json::json!("neutral")), "neutral"),
                        safe_str(n.get("race").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(n.get("npc_class").or_else(|| n.get("class")).unwrap_or(&serde_json::json!("")), ""),
                        safe_str(n.get("location").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(n.get("description").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(n.get("notes").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(n.get("status").unwrap_or(&serde_json::json!("alive")), "alive"),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("npcs".to_string(), serde_json::json!(count));
        }

        // Quests
        if let Some(quests) = payload.get("quests").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM quest_objectives", []).map_err(|e| e.to_string())?;
            conn.execute("DELETE FROM quests", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for q in quests {
                let title = q.get("title").and_then(|v| v.as_str()).unwrap_or("");
                if title.is_empty() { continue; }
                conn.execute(
                    "INSERT INTO quests (title, giver, description, status, notes) VALUES (?1,?2,?3,?4,?5)",
                    rusqlite::params![
                        title,
                        safe_str(q.get("giver").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(q.get("description").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(q.get("status").unwrap_or(&serde_json::json!("active")), "active"),
                        safe_str(q.get("notes").unwrap_or(&serde_json::json!("")), ""),
                    ],
                ).map_err(|e| e.to_string())?;
                let quest_id = conn.last_insert_rowid();
                if let Some(objectives) = q.get("objectives").and_then(|v| v.as_array()) {
                    for obj in objectives {
                        conn.execute(
                            "INSERT INTO quest_objectives (quest_id, text, completed) VALUES (?1,?2,?3)",
                            rusqlite::params![
                                quest_id,
                                safe_str(obj.get("text").unwrap_or(&serde_json::json!("")), ""),
                                safe_bool(obj.get("completed").unwrap_or(&serde_json::json!(false)), false) as i64,
                            ],
                        ).map_err(|e| e.to_string())?;
                    }
                }
                count += 1;
            }
            imported.insert("quests".to_string(), serde_json::json!(count));
        }

        // Lore
        if let Some(lore) = payload.get("lore_notes").and_then(|v| v.as_array()) {
            conn.execute("DELETE FROM lore_notes", []).map_err(|e| e.to_string())?;
            let mut count = 0;
            for l in lore {
                let title = l.get("title").and_then(|v| v.as_str()).unwrap_or("");
                if title.is_empty() { continue; }
                let now = chrono::Utc::now().to_rfc3339();
                conn.execute(
                    "INSERT INTO lore_notes (title, category, body, created_at, updated_at) VALUES (?1,?2,?3,?4,?5)",
                    rusqlite::params![
                        title,
                        safe_str(l.get("category").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(l.get("body").unwrap_or(&serde_json::json!("")), ""),
                        safe_str(l.get("created_at").unwrap_or(&serde_json::Value::String(now.clone())), &now),
                        safe_str(l.get("updated_at").unwrap_or(&serde_json::Value::String(now.clone())), &now),
                    ],
                ).map_err(|e| e.to_string())?;
                count += 1;
            }
            imported.insert("lore".to_string(), serde_json::json!(count));
        }

        Ok(serde_json::json!({"status": "imported", "imported": imported, "errors": []}))
        })();

        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| e.to_string())?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(format!("Import failed (rolled back): {}", e))
            }
        }
    })
}
