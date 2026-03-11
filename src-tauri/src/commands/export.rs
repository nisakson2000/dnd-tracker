use rusqlite::Connection;
use std::fs;
use tauri::State;

use crate::db::AppState;

fn query_json_list(conn: &Connection, sql: &str, params: &[&dyn rusqlite::types::ToSql], mapper: fn(&rusqlite::Row) -> rusqlite::Result<serde_json::Value>) -> Result<Vec<serde_json::Value>, String> {
    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params, mapper).map_err(|e| e.to_string())?;
    let result: Vec<serde_json::Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(result)
}

fn query_string_list(conn: &Connection, sql: &str) -> Result<Vec<String>, String> {
    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| row.get(0)).map_err(|e| e.to_string())?;
    let result: Vec<String> = rows.filter_map(|r| r.ok()).collect();
    Ok(result)
}

fn do_export(state: &AppState, character_id: &str) -> Result<serde_json::Value, String> {
    state.with_char_conn(character_id, |conn| {
        // Overview
        let overview = conn
            .query_row(
                "SELECT name, race, subrace, primary_class, primary_subclass, level,
                        background, alignment, experience_points, max_hp, current_hp,
                        temp_hp, armor_class, speed, hit_dice_total, hit_dice_used,
                        death_save_successes, death_save_failures, inspiration,
                        senses, languages, proficiencies_armor, proficiencies_weapons,
                        proficiencies_tools, campaign_name, exhaustion_level, ruleset,
                        multiclass_data, updated_at
                 FROM character_overview LIMIT 1",
                [],
                |row| {
                    Ok(serde_json::json!({
                        "name": row.get::<_, String>(0).unwrap_or_default(),
                        "race": row.get::<_, String>(1).unwrap_or_default(),
                        "subrace": row.get::<_, String>(2).unwrap_or_default(),
                        "primary_class": row.get::<_, String>(3).unwrap_or_default(),
                        "primary_subclass": row.get::<_, String>(4).unwrap_or_default(),
                        "level": row.get::<_, i64>(5).unwrap_or(1),
                        "background": row.get::<_, String>(6).unwrap_or_default(),
                        "alignment": row.get::<_, String>(7).unwrap_or_default(),
                        "experience_points": row.get::<_, i64>(8).unwrap_or(0),
                        "max_hp": row.get::<_, i64>(9).unwrap_or(10),
                        "current_hp": row.get::<_, i64>(10).unwrap_or(10),
                        "temp_hp": row.get::<_, i64>(11).unwrap_or(0),
                        "armor_class": row.get::<_, i64>(12).unwrap_or(10),
                        "speed": row.get::<_, i64>(13).unwrap_or(30),
                        "hit_dice_total": row.get::<_, String>(14).unwrap_or_else(|_| "1d10".to_string()),
                        "hit_dice_used": row.get::<_, i64>(15).unwrap_or(0),
                        "death_save_successes": row.get::<_, i64>(16).unwrap_or(0),
                        "death_save_failures": row.get::<_, i64>(17).unwrap_or(0),
                        "inspiration": row.get::<_, i64>(18).unwrap_or(0) != 0,
                        "senses": row.get::<_, String>(19).unwrap_or_default(),
                        "languages": row.get::<_, String>(20).unwrap_or_default(),
                        "proficiencies_armor": row.get::<_, String>(21).unwrap_or_default(),
                        "proficiencies_weapons": row.get::<_, String>(22).unwrap_or_default(),
                        "proficiencies_tools": row.get::<_, String>(23).unwrap_or_default(),
                        "campaign_name": row.get::<_, String>(24).unwrap_or_default(),
                        "exhaustion_level": row.get::<_, i64>(25).unwrap_or(0),
                        "ruleset": row.get::<_, String>(26).unwrap_or_else(|_| "5e-2014".to_string()),
                        "multiclass_data": row.get::<_, String>(27).unwrap_or_else(|_| "[]".to_string()),
                        "updated_at": row.get::<_, Option<String>>(28).unwrap_or(None),
                    }))
                },
            )
            .map_err(|_| "Character not found".to_string())?;

        // Ability scores as dict
        let mut ability_scores = serde_json::Map::new();
        {
            let mut stmt = conn.prepare("SELECT ability, score FROM ability_scores").map_err(|e| e.to_string())?;
            let rows = stmt.query_map([], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, i64>(1)?))
            }).map_err(|e| e.to_string())?;
            for row in rows.flatten() {
                ability_scores.insert(row.0, serde_json::json!(row.1));
            }
        }

        let saving_throw_profs = query_string_list(conn, "SELECT ability FROM saving_throws WHERE proficient=1")?;

        let skills = query_json_list(conn, "SELECT name, proficient, expertise FROM skills", &[], |row| {
            Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?,
                "proficient": row.get::<_, i64>(1)? != 0,
                "expertise": row.get::<_, i64>(2)? != 0,
            }))
        })?;

        let backstory = conn.query_row(
            "SELECT backstory_text, personality_traits, ideals, bonds, flaws,
                    age, height, weight, eyes, hair, skin,
                    allies_organizations, appearance_notes, goals_motivations, portrait_data
             FROM backstory LIMIT 1", [],
            |row| Ok(serde_json::json!({
                "backstory_text": row.get::<_, String>(0).unwrap_or_default(),
                "personality_traits": row.get::<_, String>(1).unwrap_or_default(),
                "ideals": row.get::<_, String>(2).unwrap_or_default(),
                "bonds": row.get::<_, String>(3).unwrap_or_default(),
                "flaws": row.get::<_, String>(4).unwrap_or_default(),
                "age": row.get::<_, String>(5).unwrap_or_default(),
                "height": row.get::<_, String>(6).unwrap_or_default(),
                "weight": row.get::<_, String>(7).unwrap_or_default(),
                "eyes": row.get::<_, String>(8).unwrap_or_default(),
                "hair": row.get::<_, String>(9).unwrap_or_default(),
                "skin": row.get::<_, String>(10).unwrap_or_default(),
                "allies_organizations": row.get::<_, String>(11).unwrap_or_default(),
                "appearance_notes": row.get::<_, String>(12).unwrap_or_default(),
                "goals_motivations": row.get::<_, String>(13).unwrap_or_default(),
                "portrait_data": row.get::<_, String>(14).unwrap_or_default(),
            })),
        ).ok();

        let spells = query_json_list(conn,
            "SELECT name, level, school, casting_time, spell_range, components, material, duration, concentration, ritual, description, upcast_notes, prepared, source FROM spells ORDER BY level, name",
            &[], |row| Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?, "level": row.get::<_, i64>(1)?,
                "school": row.get::<_, String>(2).unwrap_or_default(),
                "casting_time": row.get::<_, String>(3).unwrap_or_default(),
                "spell_range": row.get::<_, String>(4).unwrap_or_default(),
                "components": row.get::<_, String>(5).unwrap_or_default(),
                "material": row.get::<_, String>(6).unwrap_or_default(),
                "duration": row.get::<_, String>(7).unwrap_or_default(),
                "concentration": row.get::<_, i64>(8).unwrap_or(0) != 0,
                "ritual": row.get::<_, i64>(9).unwrap_or(0) != 0,
                "description": row.get::<_, String>(10).unwrap_or_default(),
                "upcast_notes": row.get::<_, String>(11).unwrap_or_default(),
                "prepared": row.get::<_, i64>(12).unwrap_or(0) != 0,
                "source": row.get::<_, String>(13).unwrap_or_else(|_| "PHB".to_string()),
            })))?;

        let spell_slots = query_json_list(conn,
            "SELECT slot_level, max_slots, used_slots FROM spell_slots WHERE max_slots > 0 ORDER BY slot_level",
            &[], |row| Ok(serde_json::json!({
                "level": row.get::<_, i64>(0)?, "max": row.get::<_, i64>(1)?, "used": row.get::<_, i64>(2)?,
            })))?;

        let inventory = query_json_list(conn,
            "SELECT name, item_type, weight, value_gp, quantity, description, attunement, attuned, equipped, equipment_slot FROM items",
            &[], |row| Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?,
                "item_type": row.get::<_, String>(1).unwrap_or_else(|_| "misc".to_string()),
                "weight": row.get::<_, f64>(2).unwrap_or(0.0),
                "value_gp": row.get::<_, f64>(3).unwrap_or(0.0),
                "quantity": row.get::<_, i64>(4).unwrap_or(1),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "attunement": row.get::<_, i64>(6).unwrap_or(0) != 0,
                "attuned": row.get::<_, i64>(7).unwrap_or(0) != 0,
                "equipped": row.get::<_, i64>(8).unwrap_or(0) != 0,
                "equipment_slot": row.get::<_, String>(9).unwrap_or_default(),
            })))?;

        let currency = conn.query_row("SELECT cp, sp, ep, gp, pp FROM currency LIMIT 1", [], |row| {
            Ok(serde_json::json!({"cp": row.get::<_, i64>(0)?, "sp": row.get::<_, i64>(1)?, "ep": row.get::<_, i64>(2)?, "gp": row.get::<_, i64>(3)?, "pp": row.get::<_, i64>(4)?}))
        }).ok();

        let features = query_json_list(conn,
            "SELECT name, source, source_level, feature_type, description FROM features",
            &[], |row| Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?,
                "source": row.get::<_, String>(1).unwrap_or_default(),
                "source_level": row.get::<_, i64>(2).unwrap_or(0),
                "feature_type": row.get::<_, String>(3).unwrap_or_else(|_| "class".to_string()),
                "description": row.get::<_, String>(4).unwrap_or_default(),
            })))?;

        let attacks = query_json_list(conn,
            "SELECT name, attack_bonus, damage_dice, damage_type, attack_range, notes FROM attacks",
            &[], |row| Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?,
                "attack_bonus": row.get::<_, String>(1).unwrap_or_else(|_| "+0".to_string()),
                "damage_dice": row.get::<_, String>(2).unwrap_or_else(|_| "1d6".to_string()),
                "damage_type": row.get::<_, String>(3).unwrap_or_default(),
                "attack_range": row.get::<_, String>(4).unwrap_or_default(),
                "notes": row.get::<_, String>(5).unwrap_or_default(),
            })))?;

        let active_conditions = query_string_list(conn, "SELECT name FROM conditions WHERE active=1")?;

        let combat_notes = conn.query_row(
            "SELECT actions, bonus_actions, reactions, legendary_actions FROM combat_notes LIMIT 1", [],
            |row| Ok(serde_json::json!({
                "actions": row.get::<_, String>(0).unwrap_or_default(),
                "bonus_actions": row.get::<_, String>(1).unwrap_or_default(),
                "reactions": row.get::<_, String>(2).unwrap_or_default(),
                "legendary_actions": row.get::<_, String>(3).unwrap_or_default(),
            })),
        ).ok();

        let journal_entries = query_json_list(conn,
            "SELECT title, session_number, real_date, ingame_date, body, tags, created_at, updated_at FROM journal_entries ORDER BY created_at DESC",
            &[], |row| Ok(serde_json::json!({
                "title": row.get::<_, String>(0)?,
                "session_number": row.get::<_, i64>(1).unwrap_or(0),
                "real_date": row.get::<_, String>(2).unwrap_or_default(),
                "ingame_date": row.get::<_, String>(3).unwrap_or_default(),
                "body": row.get::<_, String>(4).unwrap_or_default(),
                "tags": row.get::<_, String>(5).unwrap_or_default(),
                "created_at": row.get::<_, Option<String>>(6).unwrap_or(None),
                "updated_at": row.get::<_, Option<String>>(7).unwrap_or(None),
            })))?;

        let npcs = query_json_list(conn,
            "SELECT name, role, race, npc_class, location, description, notes, status FROM npcs ORDER BY name",
            &[], |row| Ok(serde_json::json!({
                "name": row.get::<_, String>(0)?,
                "role": row.get::<_, String>(1).unwrap_or_default(),
                "race": row.get::<_, String>(2).unwrap_or_default(),
                "npc_class": row.get::<_, String>(3).unwrap_or_default(),
                "location": row.get::<_, String>(4).unwrap_or_default(),
                "description": row.get::<_, String>(5).unwrap_or_default(),
                "notes": row.get::<_, String>(6).unwrap_or_default(),
                "status": row.get::<_, String>(7).unwrap_or_default(),
            })))?;

        // Quests with objectives
        let quests: Vec<serde_json::Value> = {
            let mut stmt = conn.prepare("SELECT id, title, giver, description, status, notes FROM quests").map_err(|e| e.to_string())?;
            let quest_rows: Vec<(i64, String, String, String, String, String)> = stmt.query_map([], |row| {
                Ok((row.get(0)?, row.get(1)?, row.get::<_, String>(2).unwrap_or_default(), row.get::<_, String>(3).unwrap_or_default(), row.get::<_, String>(4).unwrap_or_default(), row.get::<_, String>(5).unwrap_or_default()))
            }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

            let mut result = Vec::new();
            for (qid, title, giver, desc, status, notes) in quest_rows {
                let objectives = query_json_list(conn,
                    "SELECT text, completed FROM quest_objectives WHERE quest_id=?1",
                    &[&qid], |row| {
                        Ok(serde_json::json!({"text": row.get::<_, String>(0)?, "completed": row.get::<_, i64>(1)? != 0}))
                    })?;
                result.push(serde_json::json!({
                    "title": title, "giver": giver, "description": desc,
                    "status": status, "notes": notes, "objectives": objectives,
                }));
            }
            result
        };

        let lore_notes = query_json_list(conn,
            "SELECT title, category, body, created_at, updated_at FROM lore_notes",
            &[], |row| Ok(serde_json::json!({
                "title": row.get::<_, String>(0)?,
                "category": row.get::<_, String>(1).unwrap_or_default(),
                "body": row.get::<_, String>(2).unwrap_or_default(),
                "created_at": row.get::<_, Option<String>>(3).unwrap_or(None),
                "updated_at": row.get::<_, Option<String>>(4).unwrap_or(None),
            })))?;

        Ok(serde_json::json!({
            "character_id": character_id,
            "overview": overview,
            "ability_scores": ability_scores,
            "saving_throw_proficiencies": saving_throw_profs,
            "skills": skills,
            "backstory": backstory,
            "spells": spells,
            "spell_slots": spell_slots,
            "inventory": inventory,
            "currency": currency,
            "features": features,
            "attacks": attacks,
            "active_conditions": active_conditions,
            "combat_notes": combat_notes,
            "journal_entries": journal_entries,
            "npcs": npcs,
            "quests": quests,
            "lore_notes": lore_notes,
        }))
    })
}

#[tauri::command]
pub fn export_character(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    do_export(&state, &character_id)
}

#[tauri::command]
pub fn autosave_character(
    state: State<'_, AppState>,
    character_id: String,
    character_name: String,
) -> Result<String, String> {
    let data = do_export(&state, &character_id)?;

    // Write to a fixed autosave file in the app data dir (overwrites each time)
    let autosave_dir = state.data_dir.join("autosaves");
    fs::create_dir_all(&autosave_dir).map_err(|e| e.to_string())?;

    let safe_name: String = character_name
        .chars()
        .map(|c| if c.is_alphanumeric() || c == '-' || c == '_' || c == ' ' { c } else { '_' })
        .collect();
    let filename = format!("{}_autosave.json", safe_name.trim().replace(' ', "_"));
    let path = autosave_dir.join(&filename);

    let json_string = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    fs::write(&path, json_string).map_err(|e| e.to_string())?;

    Ok(path.to_string_lossy().to_string())
}
