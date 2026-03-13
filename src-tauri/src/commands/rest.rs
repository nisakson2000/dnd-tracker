use tauri::State;

use crate::db::AppState;

#[tauri::command]
pub fn long_rest(
    state: State<'_, AppState>,
    character_id: String,
) -> Result<serde_json::Value, String> {
    state.with_char_conn(&character_id, |conn| {
        conn.execute("BEGIN", []).map_err(|e| format!("Failed to begin transaction: {}", e))?;
        let result = (|| -> Result<serde_json::Value, String> {
            let mut restored: Vec<String> = Vec::new();

            // Get overview
            let (current_hp, max_hp, temp_hp, death_successes, death_failures, exhaustion, level, hit_dice_used): (i64, i64, i64, i64, i64, i64, i64, i64) = conn
                .query_row(
                    "SELECT current_hp, max_hp, temp_hp, death_save_successes, death_save_failures, exhaustion_level, level, hit_dice_used FROM character_overview LIMIT 1",
                    [],
                    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?, row.get(5)?, row.get(6)?, row.get(7)?)),
                )
                .map_err(|_| "Character not found".to_string())?;

            let mut new_hp = current_hp;
            let mut new_temp_hp = temp_hp;
            let mut new_death_s = death_successes;
            let mut new_death_f = death_failures;
            let mut new_exhaustion = exhaustion;
            let mut new_hit_dice_used = hit_dice_used;

            // Restore HP
            if current_hp < max_hp {
                restored.push(format!("HP restored: {} → {}", current_hp, max_hp));
                new_hp = max_hp;
            }

            // Remove temp HP
            if temp_hp > 0 {
                restored.push("Temporary HP removed".to_string());
                new_temp_hp = 0;
            }

            // Reset death saves
            if death_successes > 0 || death_failures > 0 {
                restored.push("Death saves reset".to_string());
                new_death_s = 0;
                new_death_f = 0;
            }

            // Reduce exhaustion
            if exhaustion > 0 {
                let old = exhaustion;
                new_exhaustion = (exhaustion - 1).max(0);
                restored.push(format!("Exhaustion reduced: {} → {}", old, new_exhaustion));
            }

            // Recover half hit dice (rounded up)
            let max_recover = (1_i64).max((level + 1) / 2);
            if hit_dice_used > 0 {
                let recovered = hit_dice_used.min(max_recover);
                new_hit_dice_used = (hit_dice_used - recovered).max(0);
                restored.push(format!("Hit dice recovered: {} (used: {} remaining)", recovered, new_hit_dice_used));
            }

            conn.execute(
                "UPDATE character_overview SET current_hp=?1, temp_hp=?2, death_save_successes=?3, death_save_failures=?4, exhaustion_level=?5, hit_dice_used=?6 WHERE id=1",
                rusqlite::params![new_hp, new_temp_hp, new_death_s, new_death_f, new_exhaustion, new_hit_dice_used],
            ).map_err(|e| format!("Failed to update character stats: {}", e))?;

            // Reset all spell slots
            let slots_updated = conn
                .execute("UPDATE spell_slots SET used_slots=0 WHERE used_slots > 0", [])
                .map_err(|e| format!("Failed to reset spell slots: {}", e))?;
            if slots_updated > 0 {
                restored.push("Spell slots fully restored".to_string());
            }

            if restored.is_empty() {
                restored.push("Already fully rested".to_string());
            }

            Ok(serde_json::json!({"status": "long_rest_complete", "restored": restored}))
        })();
        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| format!("Failed to commit: {}", e))?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(e)
            }
        }
    })
}

#[tauri::command]
pub fn short_rest(
    state: State<'_, AppState>,
    character_id: String,
    hit_dice_to_spend: Option<i64>,
) -> Result<serde_json::Value, String> {
    let hit_dice_to_spend = hit_dice_to_spend.unwrap_or(0);

    state.with_char_conn(&character_id, |conn| {
        conn.execute("BEGIN", []).map_err(|e| format!("Failed to begin transaction: {}", e))?;
        let result = (|| -> Result<serde_json::Value, String> {
            let mut restored: Vec<String> = Vec::new();

            let (level, hit_dice_used, primary_class): (i64, i64, String) = conn
                .query_row(
                    "SELECT level, hit_dice_used, primary_class FROM character_overview LIMIT 1",
                    [],
                    |row| Ok((row.get(0)?, row.get(1)?, row.get(2).unwrap_or_default())),
                )
                .map_err(|_| "Character not found".to_string())?;

            // Reset death saves (RAW: short rest resets death saves)
            let (death_s, death_f): (i64, i64) = conn
                .query_row(
                    "SELECT death_save_successes, death_save_failures FROM character_overview LIMIT 1",
                    [],
                    |row| Ok((row.get(0)?, row.get(1)?)),
                )
                .map_err(|e| format!("Failed to read death saves: {}", e))?;
            if death_s > 0 || death_f > 0 {
                conn.execute(
                    "UPDATE character_overview SET death_save_successes=0, death_save_failures=0 WHERE id=1",
                    [],
                )
                .map_err(|e| format!("Failed to reset death saves: {}", e))?;
                restored.push("Death saves reset".to_string());
            }

            // Spend hit dice
            if hit_dice_to_spend > 0 {
                let available = (level - hit_dice_used).max(0);
                let actual_spend = hit_dice_to_spend.max(0).min(available);
                if actual_spend > 0 {
                    conn.execute(
                        "UPDATE character_overview SET hit_dice_used = hit_dice_used + ?1 WHERE id=1",
                        [actual_spend],
                    )
                    .map_err(|e| format!("Failed to update hit dice: {}", e))?;
                    restored.push(format!("Spent {} hit dice (apply rolled HP manually)", actual_spend));
                }
            }

            // Warlock pact magic — check primary class and multiclass data
            let multiclass_data: String = conn
                .query_row("SELECT multiclass_data FROM character_overview LIMIT 1", [], |row| row.get(0))
                .unwrap_or_else(|_| "[]".to_string());
            let has_warlock = primary_class == "Warlock"
                || multiclass_data.to_lowercase().contains("warlock");
            if has_warlock {
                let slots_updated = conn
                    .execute("UPDATE spell_slots SET used_slots=0 WHERE used_slots > 0", [])
                    .map_err(|e| format!("Failed to reset pact magic slots: {}", e))?;
                if slots_updated > 0 {
                    restored.push("Pact Magic slots restored".to_string());
                }
            }

            if restored.is_empty() {
                restored.push("Short rest complete".to_string());
            }

            Ok(serde_json::json!({"status": "short_rest_complete", "restored": restored}))
        })();
        match result {
            Ok(val) => {
                conn.execute("COMMIT", []).map_err(|e| format!("Failed to commit: {}", e))?;
                Ok(val)
            }
            Err(e) => {
                let _ = conn.execute("ROLLBACK", []);
                Err(e)
            }
        }
    })
}
