use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::AppState;

#[derive(Serialize, Deserialize, Clone)]
pub struct OverviewData {
    pub name: String,
    pub race: String,
    pub subrace: String,
    pub primary_class: String,
    pub primary_subclass: String,
    pub level: i64,
    pub background: String,
    pub alignment: String,
    pub experience_points: i64,
    pub max_hp: i64,
    pub current_hp: i64,
    pub temp_hp: i64,
    pub armor_class: i64,
    pub speed: i64,
    pub hit_dice_total: String,
    pub hit_dice_used: i64,
    pub death_save_successes: i64,
    pub death_save_failures: i64,
    pub inspiration: bool,
    pub senses: String,
    pub languages: String,
    pub proficiencies_armor: String,
    pub proficiencies_weapons: String,
    pub proficiencies_tools: String,
    pub campaign_name: String,
    pub exhaustion_level: i64,
    pub ruleset: String,
    pub multiclass_data: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AbilityScoreData {
    pub ability: String,
    pub score: i64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SavingThrowData {
    pub ability: String,
    pub proficient: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SkillData {
    pub name: String,
    pub proficient: bool,
    pub expertise: bool,
}

#[derive(Serialize, Clone)]
pub struct FullOverviewResponse {
    pub overview: OverviewData,
    pub ability_scores: Vec<AbilityScoreData>,
    pub saving_throws: Vec<SavingThrowData>,
    pub skills: Vec<SkillData>,
}

#[tauri::command]
pub fn get_overview(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<FullOverviewResponse, String> {
    state.with_char_conn(&character_id, |conn| {
        let overview = conn
            .query_row(
                "SELECT name, race, subrace, primary_class, primary_subclass, level,
                        background, alignment, experience_points, max_hp, current_hp,
                        temp_hp, armor_class, speed, hit_dice_total, hit_dice_used,
                        death_save_successes, death_save_failures, inspiration,
                        senses, languages, proficiencies_armor, proficiencies_weapons,
                        proficiencies_tools, campaign_name, exhaustion_level, ruleset,
                        multiclass_data
                 FROM character_overview LIMIT 1",
                [],
                |row| {
                    Ok(OverviewData {
                        name: row.get(0).unwrap_or_default(),
                        race: row.get(1).unwrap_or_default(),
                        subrace: row.get(2).unwrap_or_default(),
                        primary_class: row.get(3).unwrap_or_default(),
                        primary_subclass: row.get(4).unwrap_or_default(),
                        level: row.get(5).unwrap_or(1),
                        background: row.get(6).unwrap_or_default(),
                        alignment: row.get(7).unwrap_or_default(),
                        experience_points: row.get(8).unwrap_or(0),
                        max_hp: row.get(9).unwrap_or(10),
                        current_hp: row.get(10).unwrap_or(10),
                        temp_hp: row.get(11).unwrap_or(0),
                        armor_class: row.get(12).unwrap_or(10),
                        speed: row.get(13).unwrap_or(30),
                        hit_dice_total: row.get(14).unwrap_or_else(|_| "1d10".to_string()),
                        hit_dice_used: row.get(15).unwrap_or(0),
                        death_save_successes: row.get(16).unwrap_or(0),
                        death_save_failures: row.get(17).unwrap_or(0),
                        inspiration: row.get::<_, i64>(18).unwrap_or(0) != 0,
                        senses: row.get(19).unwrap_or_default(),
                        languages: row.get(20).unwrap_or_else(|_| "Common".to_string()),
                        proficiencies_armor: row.get(21).unwrap_or_default(),
                        proficiencies_weapons: row.get(22).unwrap_or_default(),
                        proficiencies_tools: row.get(23).unwrap_or_default(),
                        campaign_name: row.get(24).unwrap_or_default(),
                        exhaustion_level: row.get(25).unwrap_or(0),
                        ruleset: row.get(26).unwrap_or_else(|_| "5e-2014".to_string()),
                        multiclass_data: row.get(27).unwrap_or_else(|_| "[]".to_string()),
                    })
                },
            )
            .map_err(|e| format!("Failed to load character overview: {}", e))?;

        let mut abs_stmt = conn
            .prepare("SELECT ability, score FROM ability_scores")
            .map_err(|e| format!("Failed to load ability scores: {}", e))?;
        let ability_scores: Vec<AbilityScoreData> = abs_stmt
            .query_map([], |row| {
                Ok(AbilityScoreData {
                    ability: row.get(0)?,
                    score: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        let mut st_stmt = conn
            .prepare("SELECT ability, proficient FROM saving_throws")
            .map_err(|e| format!("Failed to load saving throws: {}", e))?;
        let saving_throws: Vec<SavingThrowData> = st_stmt
            .query_map([], |row| {
                Ok(SavingThrowData {
                    ability: row.get(0)?,
                    proficient: row.get::<_, i64>(1)? != 0,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        let mut sk_stmt = conn
            .prepare("SELECT name, proficient, expertise FROM skills")
            .map_err(|e| format!("Failed to load skills: {}", e))?;
        let skills: Vec<SkillData> = sk_stmt
            .query_map([], |row| {
                Ok(SkillData {
                    name: row.get(0)?,
                    proficient: row.get::<_, i64>(1)? != 0,
                    expertise: row.get::<_, i64>(2)? != 0,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|r| r.ok())
            .collect();

        Ok(FullOverviewResponse {
            overview,
            ability_scores,
            saving_throws,
            skills,
        })
    })
}

#[tauri::command]
pub fn update_overview(
    state: State<'_, AppState>,
    character_id: String,
    payload: OverviewData,
) -> Result<serde_json::Value, String> {
    // Validate and clamp values
    let mut payload = payload;
    payload.level = payload.level.clamp(1, 20);
    payload.max_hp = payload.max_hp.max(0);
    payload.current_hp = payload.current_hp.clamp(0, payload.max_hp.max(1));
    payload.temp_hp = payload.temp_hp.max(0);
    payload.armor_class = payload.armor_class.max(0);
    payload.speed = payload.speed.max(0);
    payload.exhaustion_level = payload.exhaustion_level.clamp(0, 10);
    payload.death_save_successes = payload.death_save_successes.clamp(0, 3);
    payload.death_save_failures = payload.death_save_failures.clamp(0, 3);
    payload.hit_dice_used = payload.hit_dice_used.clamp(0, payload.level);

    state.with_char_conn(&character_id, |conn| {
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "UPDATE character_overview SET
                name=?1, race=?2, subrace=?3, primary_class=?4, primary_subclass=?5,
                level=?6, background=?7, alignment=?8, experience_points=?9,
                max_hp=?10, current_hp=?11, temp_hp=?12, armor_class=?13, speed=?14,
                hit_dice_total=?15, hit_dice_used=?16, death_save_successes=?17,
                death_save_failures=?18, inspiration=?19, senses=?20, languages=?21,
                proficiencies_armor=?22, proficiencies_weapons=?23, proficiencies_tools=?24,
                campaign_name=?25, exhaustion_level=?26, ruleset=?27, multiclass_data=?28,
                updated_at=?29
             WHERE id=1",
            rusqlite::params![
                payload.name, payload.race, payload.subrace, payload.primary_class,
                payload.primary_subclass, payload.level, payload.background, payload.alignment,
                payload.experience_points, payload.max_hp, payload.current_hp, payload.temp_hp,
                payload.armor_class, payload.speed, payload.hit_dice_total, payload.hit_dice_used,
                payload.death_save_successes, payload.death_save_failures,
                payload.inspiration as i64, payload.senses, payload.languages,
                payload.proficiencies_armor, payload.proficiencies_weapons,
                payload.proficiencies_tools, payload.campaign_name, payload.exhaustion_level,
                payload.ruleset, payload.multiclass_data, now,
            ],
        )
        .map_err(|e| format!("Failed to save character overview: {}", e))?;
        Ok(serde_json::json!({"status": "saved"}))
    })
}

#[tauri::command]
pub fn update_ability_scores(
    state: State<'_, AppState>,
    character_id: String,
    payload: Vec<AbilityScoreData>,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        for item in &payload {
            let score = item.score.clamp(1, 30);
            let updated = conn
                .execute(
                    "UPDATE ability_scores SET score=?1 WHERE ability=?2",
                    rusqlite::params![score, item.ability],
                )
                .map_err(|e| e.to_string())?;
            if updated == 0 {
                conn.execute(
                    "INSERT INTO ability_scores (ability, score) VALUES (?1, ?2)",
                    rusqlite::params![item.ability, score],
                )
                .map_err(|e| e.to_string())?;
            }
        }
        Ok(serde_json::json!({"status": "saved"}))
    })
}

#[tauri::command]
pub fn update_saving_throws(
    state: State<'_, AppState>,
    character_id: String,
    payload: Vec<SavingThrowData>,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        for item in &payload {
            conn.execute(
                "UPDATE saving_throws SET proficient=?1 WHERE ability=?2",
                rusqlite::params![item.proficient as i64, item.ability],
            )
            .map_err(|e| e.to_string())?;
        }
        Ok(serde_json::json!({"status": "saved"}))
    })
}

#[tauri::command]
pub fn update_skills(
    state: State<'_, AppState>,
    character_id: String,
    payload: Vec<SkillData>,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        for item in &payload {
            conn.execute(
                "UPDATE skills SET proficient=?1, expertise=?2 WHERE name=?3",
                rusqlite::params![item.proficient as i64, item.expertise as i64, item.name],
            )
            .map_err(|e| e.to_string())?;
        }
        Ok(serde_json::json!({"status": "saved"}))
    })
}
