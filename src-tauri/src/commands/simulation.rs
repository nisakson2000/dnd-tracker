use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::campaign_db;
use crate::db::AppState;

fn ensure_campaign_conn(state: &AppState) -> Result<(), String> {
    let mut conn_guard = state.campaign_conn.lock().map_err(|_| {
        "Campaign database is temporarily busy.".to_string()
    })?;
    if conn_guard.is_none() {
        let conn = campaign_db::init_campaign_db(&state.data_dir)?;
        *conn_guard = Some(conn);
    }
    Ok(())
}

fn with_campaign_conn<F, T>(state: &AppState, f: F) -> Result<T, String>
where
    F: FnOnce(&rusqlite::Connection) -> Result<T, String>,
{
    ensure_campaign_conn(state)?;
    let conn_guard = state.campaign_conn.lock().map_err(|_| {
        "Campaign database is temporarily busy.".to_string()
    })?;
    let conn = conn_guard.as_ref().ok_or("Campaign database not initialized.".to_string())?;
    f(conn)
}

fn require_active_campaign(state: &AppState) -> Result<String, String> {
    let active = state.active_campaign.lock().map_err(|_| "Failed to read active campaign.".to_string())?;
    active.clone().ok_or("No active campaign selected.".to_string())
}

// ─────────────────────────────────────────────────────────────────────────────
// Weather helpers
// ─────────────────────────────────────────────────────────────────────────────

fn mechanical_effects_for(precipitation: &str, wind: &str, temperature: &str) -> serde_json::Value {
    let mut effects = Vec::new();

    match precipitation {
        "heavy_rain" => {
            effects.push("Disadvantage on Perception checks that rely on sight or hearing");
            effects.push("Ranged attack disadvantage beyond normal range");
        }
        "blizzard" => {
            effects.push("Difficult terrain");
            effects.push("Disadvantage on ranged attack rolls");
            effects.push("Disadvantage on Perception checks that rely on sight");
        }
        "hail" => {
            effects.push("Difficult terrain");
            effects.push("1d4 bludgeoning damage per minute exposed");
        }
        "fog" | "mist" => {
            effects.push("Heavily obscured beyond 30 feet (fog) or 60 feet (mist)");
        }
        "snow" => {
            effects.push("Difficult terrain in accumulation");
        }
        _ => {}
    }

    match wind {
        "gale" => {
            effects.push("Disadvantage on ranged attack rolls");
            effects.push("DC 10 STR check to move against the wind");
        }
        "storm" => {
            effects.push("Disadvantage on ranged attack rolls");
            effects.push("Disadvantage on Perception checks that rely on hearing");
            effects.push("DC 15 STR check to move against the wind");
        }
        _ => {}
    }

    match temperature {
        "freezing" => {
            effects.push("DC 10 CON save each hour or gain 1 level of exhaustion (extreme cold)");
        }
        "scorching" => {
            effects.push("DC 10 CON save each hour or gain 1 level of exhaustion (extreme heat)");
        }
        _ => {}
    }

    if effects.is_empty() {
        effects.push("No special mechanical effects");
    }

    serde_json::json!({ "effects": effects })
}

fn advance_weather_for_season(season: &str) -> (String, String, String) {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seed = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos() as usize;

    let temperatures = ["freezing", "cold", "cool", "mild", "warm", "hot", "scorching"];
    let precipitations = ["none", "light_rain", "rain", "heavy_rain", "drizzle", "snow", "blizzard", "hail", "fog", "mist"];
    let winds = ["calm", "light_breeze", "breezy", "windy", "gale", "storm"];

    let (temp_range, precip_range, wind_range): (&[usize], &[usize], &[usize]) = match season {
        "winter" => (
            &[0, 0, 1, 1, 1, 2, 2],       // freezing-cool bias
            &[0, 5, 5, 5, 6, 6, 8, 9, 0],  // snow/blizzard bias
            &[0, 1, 2, 2, 3, 3, 4],         // breezy-windy bias
        ),
        "summer" => (
            &[3, 4, 4, 4, 5, 5, 5, 6],     // warm-hot bias
            &[0, 0, 0, 0, 1, 1, 4, 0],      // mostly clear
            &[0, 0, 1, 1, 1, 2, 2],         // calm-light bias
        ),
        "autumn" => (
            &[1, 2, 2, 3, 3, 3, 4],         // cool-mild bias
            &[0, 0, 1, 2, 4, 8, 9, 0],      // rain/fog bias
            &[1, 2, 2, 3, 3, 3, 4],         // breezy-windy bias
        ),
        _ => {
            // spring
            (
                &[2, 2, 3, 3, 3, 4, 4],     // cool-warm bias
                &[0, 0, 1, 1, 2, 4, 8, 9],  // light rain bias
                &[0, 1, 1, 2, 2, 2, 3],     // light breeze bias
            )
        }
    };

    let temp_idx = temp_range[seed % temp_range.len()];
    let precip_idx = precip_range[(seed / 7) % precip_range.len()];
    let wind_idx = wind_range[(seed / 13) % wind_range.len()];

    (
        temperatures[temp_idx].to_string(),
        precipitations[precip_idx].to_string(),
        winds[wind_idx].to_string(),
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Weather commands
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn set_weather(
    region: String,
    season: String,
    temperature: String,
    precipitation: String,
    wind: String,
    special_effects: String,
    mechanical_effects_json: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    let effects = if mechanical_effects_json.is_empty() || mechanical_effects_json == "{}" {
        serde_json::to_string(&mechanical_effects_for(&precipitation, &wind, &temperature))
            .unwrap_or_else(|_| "{}".to_string())
    } else {
        mechanical_effects_json.clone()
    };

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_weather (id, campaign_id, region, season, temperature, precipitation, wind, special_effects, mechanical_effects_json, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
             ON CONFLICT(campaign_id, region) DO UPDATE SET season = ?4, temperature = ?5, precipitation = ?6, wind = ?7, special_effects = ?8, mechanical_effects_json = ?9, updated_at = ?10",
            params![id, campaign_id, region, season, temperature, precipitation, wind, special_effects, effects, now],
        ).map_err(|e| format!("Failed to set weather: {}", e))?;

        Ok(serde_json::json!({
            "region": region,
            "season": season,
            "temperature": temperature,
            "precipitation": precipitation,
            "wind": wind,
            "special_effects": special_effects,
            "mechanical_effects_json": effects,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_weather(
    region: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let region = region.unwrap_or_else(|| "default".to_string());

    with_campaign_conn(&state, |conn| {
        let result = conn.query_row(
            "SELECT id, region, season, temperature, precipitation, wind, special_effects, mechanical_effects_json, updated_at
             FROM campaign_weather WHERE campaign_id = ?1 AND region = ?2",
            params![campaign_id, region],
            |row| {
                Ok(serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "region": row.get::<_, String>(1)?,
                    "season": row.get::<_, String>(2).unwrap_or_default(),
                    "temperature": row.get::<_, String>(3).unwrap_or_default(),
                    "precipitation": row.get::<_, String>(4).unwrap_or_default(),
                    "wind": row.get::<_, String>(5).unwrap_or_default(),
                    "special_effects": row.get::<_, String>(6).unwrap_or_default(),
                    "mechanical_effects_json": row.get::<_, String>(7).unwrap_or_else(|_| "{}".to_string()),
                    "updated_at": row.get::<_, i64>(8).unwrap_or(0),
                }))
            },
        );

        match result {
            Ok(val) => Ok(val),
            Err(_) => Ok(serde_json::json!({
                "region": region,
                "season": "spring",
                "temperature": "mild",
                "precipitation": "none",
                "wind": "calm",
                "special_effects": "",
                "mechanical_effects_json": "{}",
                "updated_at": 0,
            })),
        }
    })
}

#[tauri::command]
pub fn get_all_weather(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, region, season, temperature, precipitation, wind, special_effects, mechanical_effects_json, updated_at
             FROM campaign_weather WHERE campaign_id = ?1 ORDER BY region"
        ).map_err(|e| format!("Failed to query weather: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "region": row.get::<_, String>(1)?,
                "season": row.get::<_, String>(2).unwrap_or_default(),
                "temperature": row.get::<_, String>(3).unwrap_or_default(),
                "precipitation": row.get::<_, String>(4).unwrap_or_default(),
                "wind": row.get::<_, String>(5).unwrap_or_default(),
                "special_effects": row.get::<_, String>(6).unwrap_or_default(),
                "mechanical_effects_json": row.get::<_, String>(7).unwrap_or_else(|_| "{}".to_string()),
                "updated_at": row.get::<_, i64>(8).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read weather: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn advance_weather(
    region: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let region = region.unwrap_or_else(|| "default".to_string());

    // Get current season for this region
    let current_season = with_campaign_conn(&state, |conn| {
        let result: Result<String, _> = conn.query_row(
            "SELECT season FROM campaign_weather WHERE campaign_id = ?1 AND region = ?2",
            params![campaign_id, region],
            |row| row.get(0),
        );
        Ok(result.unwrap_or_else(|_| "spring".to_string()))
    })?;

    let (temperature, precipitation, wind) = advance_weather_for_season(&current_season);
    let effects = mechanical_effects_for(&precipitation, &wind, &temperature);
    let effects_str = serde_json::to_string(&effects).unwrap_or_else(|_| "{}".to_string());

    set_weather(
        region,
        current_season,
        temperature,
        precipitation,
        wind,
        String::new(),
        effects_str,
        state,
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Economy commands
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn set_economy(
    region: String,
    prosperity: String,
    tax_rate: f64,
    trade_goods_json: String,
    price_modifier: f64,
    notes: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO campaign_economy (id, campaign_id, region, prosperity, tax_rate, trade_goods_json, price_modifier, notes, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(campaign_id, region) DO UPDATE SET prosperity = ?4, tax_rate = ?5, trade_goods_json = ?6, price_modifier = ?7, notes = ?8, updated_at = ?9",
            params![id, campaign_id, region, prosperity, tax_rate, trade_goods_json, price_modifier, notes, now],
        ).map_err(|e| format!("Failed to set economy: {}", e))?;

        Ok(serde_json::json!({
            "region": region,
            "prosperity": prosperity,
            "tax_rate": tax_rate,
            "trade_goods_json": trade_goods_json,
            "price_modifier": price_modifier,
            "notes": notes,
            "updated_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_economy(
    region: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let region = region.unwrap_or_else(|| "default".to_string());

    with_campaign_conn(&state, |conn| {
        let result = conn.query_row(
            "SELECT id, region, prosperity, tax_rate, trade_goods_json, price_modifier, notes, updated_at
             FROM campaign_economy WHERE campaign_id = ?1 AND region = ?2",
            params![campaign_id, region],
            |row| {
                Ok(serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "region": row.get::<_, String>(1)?,
                    "prosperity": row.get::<_, String>(2).unwrap_or_else(|_| "moderate".to_string()),
                    "tax_rate": row.get::<_, f64>(3).unwrap_or(0.1),
                    "trade_goods_json": row.get::<_, String>(4).unwrap_or_else(|_| "[]".to_string()),
                    "price_modifier": row.get::<_, f64>(5).unwrap_or(1.0),
                    "notes": row.get::<_, String>(6).unwrap_or_default(),
                    "updated_at": row.get::<_, i64>(7).unwrap_or(0),
                }))
            },
        );

        match result {
            Ok(val) => Ok(val),
            Err(_) => Ok(serde_json::json!({
                "region": region,
                "prosperity": "moderate",
                "tax_rate": 0.1,
                "trade_goods_json": "[]",
                "price_modifier": 1.0,
                "notes": "",
                "updated_at": 0,
            })),
        }
    })
}

#[tauri::command]
pub fn get_all_economies(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, region, prosperity, tax_rate, trade_goods_json, price_modifier, notes, updated_at
             FROM campaign_economy WHERE campaign_id = ?1 ORDER BY region"
        ).map_err(|e| format!("Failed to query economies: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "region": row.get::<_, String>(1)?,
                "prosperity": row.get::<_, String>(2).unwrap_or_else(|_| "moderate".to_string()),
                "tax_rate": row.get::<_, f64>(3).unwrap_or(0.1),
                "trade_goods_json": row.get::<_, String>(4).unwrap_or_else(|_| "[]".to_string()),
                "price_modifier": row.get::<_, f64>(5).unwrap_or(1.0),
                "notes": row.get::<_, String>(6).unwrap_or_default(),
                "updated_at": row.get::<_, i64>(7).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read economies: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Travel calculator
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn calculate_travel(
    origin: String,
    destination: String,
    terrain: String,
    pace: String,
    party_size: i64,
) -> Result<serde_json::Value, String> {
    let base_miles_per_day: f64 = match terrain.as_str() {
        "road" => 30.0,
        "trail" => 20.0,
        "wilderness" => 15.0,
        "mountain" => 10.0,
        "swamp" => 8.0,
        "desert" => 12.0,
        _ => 15.0, // default to wilderness
    };

    let (pace_adjustment, pace_notes): (f64, &str) = match pace.as_str() {
        "fast" => (10.0, "Disadvantage on Perception checks"),
        "slow" => (-5.0, "Can use Stealth"),
        _ => (0.0, "Normal pace"),
    };

    let miles_per_day = (base_miles_per_day + pace_adjustment).max(1.0);

    let encounter_chance: f64 = match terrain.as_str() {
        "road" => 0.10,
        "trail" => 0.15,
        "wilderness" => 0.25,
        "mountain" => 0.20,
        "swamp" => 0.30,
        "desert" => 0.20,
        _ => 0.25,
    };

    // Distance is calculated as a single day's travel for the terrain type
    // (since we don't have a real map, distance = base rate for a 1-day journey,
    // but we expose miles_per_day so the frontend can multiply)
    let distance_miles = base_miles_per_day;
    let travel_days = (distance_miles / miles_per_day).ceil() as i64;
    let rations_needed = travel_days * party_size;

    Ok(serde_json::json!({
        "origin": origin,
        "destination": destination,
        "terrain": terrain,
        "pace": pace,
        "party_size": party_size,
        "distance_miles": distance_miles,
        "miles_per_day": miles_per_day,
        "travel_days": travel_days,
        "rations_needed": rations_needed,
        "encounter_chance_per_day": encounter_chance,
        "total_encounter_checks": travel_days,
        "pace_notes": pace_notes,
    }))
}

// ─────────────────────────────────────────────────────────────────────────────
// World Events commands
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn create_world_event(
    title: String,
    description: String,
    event_type: String,
    severity: String,
    trigger_conditions_json: String,
    effects_json: String,
    calendar_day: Option<i64>,
    calendar_month: Option<i64>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO world_events (id, campaign_id, title, description, event_type, severity, trigger_conditions_json, effects_json, calendar_day, calendar_month, status, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'pending', ?11)",
            params![id, campaign_id, title, description, event_type, severity, trigger_conditions_json, effects_json, calendar_day, calendar_month, now],
        ).map_err(|e| format!("Failed to create world event: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "title": title,
            "description": description,
            "event_type": event_type,
            "severity": severity,
            "trigger_conditions_json": trigger_conditions_json,
            "effects_json": effects_json,
            "calendar_day": calendar_day,
            "calendar_month": calendar_month,
            "status": "pending",
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn list_world_events(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, description, event_type, severity, trigger_conditions_json, effects_json, calendar_day, calendar_month, status, resolved_at, created_at
             FROM world_events WHERE campaign_id = ?1 ORDER BY created_at DESC"
        ).map_err(|e| format!("Failed to query world events: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "event_type": row.get::<_, String>(3).unwrap_or_else(|_| "general".to_string()),
                "severity": row.get::<_, String>(4).unwrap_or_else(|_| "minor".to_string()),
                "trigger_conditions_json": row.get::<_, String>(5).unwrap_or_else(|_| "{}".to_string()),
                "effects_json": row.get::<_, String>(6).unwrap_or_else(|_| "{}".to_string()),
                "calendar_day": row.get::<_, Option<i64>>(7).unwrap_or(None),
                "calendar_month": row.get::<_, Option<i64>>(8).unwrap_or(None),
                "status": row.get::<_, String>(9).unwrap_or_else(|_| "pending".to_string()),
                "resolved_at": row.get::<_, Option<i64>>(10).unwrap_or(None),
                "created_at": row.get::<_, i64>(11).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read world events: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn resolve_world_event(
    event_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;
    let now = chrono::Utc::now().timestamp();

    with_campaign_conn(&state, |conn| {
        let rows = conn.execute(
            "UPDATE world_events SET status = 'resolved', resolved_at = ?1 WHERE id = ?2 AND campaign_id = ?3",
            params![now, event_id, campaign_id],
        ).map_err(|e| format!("Failed to resolve world event: {}", e))?;

        if rows == 0 {
            return Err("World event not found.".to_string());
        }
        Ok(())
    })
}

#[tauri::command]
pub fn delete_world_event(
    event_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "DELETE FROM world_events WHERE id = ?1 AND campaign_id = ?2",
            params![event_id, campaign_id],
        ).map_err(|e| format!("Failed to delete world event: {}", e))?;
        Ok(())
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// World Timeline commands
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn add_timeline_entry(
    title: String,
    description: String,
    category: String,
    calendar_day: Option<i64>,
    calendar_month: Option<i64>,
    calendar_year: Option<i64>,
    session_number: Option<i64>,
    visibility: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp();

    let day = calendar_day.unwrap_or(0);
    let month = calendar_month.unwrap_or(0);
    let year = calendar_year.unwrap_or(0);
    let session = session_number.unwrap_or(0);

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "INSERT INTO world_timeline (id, campaign_id, title, description, category, calendar_day, calendar_month, calendar_year, session_number, visibility, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
            params![id, campaign_id, title, description, category, day, month, year, session, visibility, now],
        ).map_err(|e| format!("Failed to add timeline entry: {}", e))?;

        Ok(serde_json::json!({
            "id": id,
            "title": title,
            "description": description,
            "category": category,
            "calendar_day": day,
            "calendar_month": month,
            "calendar_year": year,
            "session_number": session,
            "visibility": visibility,
            "created_at": now,
        }))
    })
}

#[tauri::command]
pub fn get_timeline(
    state: State<'_, AppState>,
) -> Result<Vec<serde_json::Value>, String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        let mut stmt = conn.prepare(
            "SELECT id, title, description, category, calendar_day, calendar_month, calendar_year, session_number, visibility, created_at
             FROM world_timeline WHERE campaign_id = ?1 ORDER BY calendar_year, calendar_month, calendar_day"
        ).map_err(|e| format!("Failed to query timeline: {}", e))?;

        let rows: Vec<serde_json::Value> = stmt.query_map(params![campaign_id], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, String>(2).unwrap_or_default(),
                "category": row.get::<_, String>(3).unwrap_or_else(|_| "event".to_string()),
                "calendar_day": row.get::<_, i64>(4).unwrap_or(0),
                "calendar_month": row.get::<_, i64>(5).unwrap_or(0),
                "calendar_year": row.get::<_, i64>(6).unwrap_or(0),
                "session_number": row.get::<_, i64>(7).unwrap_or(0),
                "visibility": row.get::<_, String>(8).unwrap_or_else(|_| "dm_only".to_string()),
                "created_at": row.get::<_, i64>(9).unwrap_or(0),
            }))
        }).map_err(|e| format!("Failed to read timeline: {}", e))?
        .filter_map(|r| r.ok()).collect();

        Ok(rows)
    })
}

#[tauri::command]
pub fn delete_timeline_entry(
    entry_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let campaign_id = require_active_campaign(&state)?;

    with_campaign_conn(&state, |conn| {
        conn.execute(
            "DELETE FROM world_timeline WHERE id = ?1 AND campaign_id = ?2",
            params![entry_id, campaign_id],
        ).map_err(|e| format!("Failed to delete timeline entry: {}", e))?;
        Ok(())
    })
}
