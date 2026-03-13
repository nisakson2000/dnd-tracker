use rusqlite::params;
use std::process::Command;
use tauri::State;

use crate::db::AppState;

const REPO: &str = "nisakson2000/dnd-tracker";

/// Ensure the reports queue table exists in campaign DB (or a standalone DB).
/// We use the app data dir to store a reports.db for pending offline reports.
fn ensure_reports_db(data_dir: &std::path::Path) -> Result<rusqlite::Connection, String> {
    let db_path = data_dir.join("reports.db");
    let conn = crate::db::open_connection(&db_path)
        .map_err(|e| format!("Failed to open reports.db: {}", e))?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS pending_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_type TEXT NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );"
    ).map_err(|e| format!("Failed to create pending_reports table: {}", e))?;
    Ok(conn)
}

/// Check if gh CLI is available and authenticated.
fn gh_available() -> bool {
    Command::new("gh")
        .args(["auth", "status"])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

/// Create a GitHub issue using gh CLI.
fn create_gh_issue(title: &str, body: &str, label: &str) -> Result<String, String> {
    let output = Command::new("gh")
        .args([
            "issue", "create",
            "--repo", REPO,
            "--title", title,
            "--body", body,
            "--label", label,
        ])
        .output()
        .map_err(|e| format!("Failed to run gh CLI: {}", e))?;

    if output.status.success() {
        let url = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(url)
    } else {
        let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
        Err(format!("gh issue create failed: {}", err))
    }
}

/// Submit a bug report — creates a GitHub issue or queues for later.
#[tauri::command]
pub fn submit_bug_report(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Also write to local log file (keep existing behavior)
    let _ = super::bug_report::write_bug_report(body.clone());

    if gh_available() {
        match create_gh_issue(&title, &body, "bug") {
            Ok(url) => Ok(serde_json::json!({ "status": "submitted", "url": url })),
            Err(_) => {
                // Queue for later
                queue_report(&state.data_dir, "bug", &title, &body)?;
                Ok(serde_json::json!({ "status": "queued", "reason": "GitHub API failed, will retry later" }))
            }
        }
    } else {
        queue_report(&state.data_dir, "bug", &title, &body)?;
        Ok(serde_json::json!({ "status": "queued", "reason": "No internet connection, will submit when online" }))
    }
}

/// Submit a feature request — creates a GitHub issue or queues for later.
#[tauri::command]
pub fn submit_feature_request(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Also write to local log file (keep existing behavior)
    let _ = super::feature_request::write_feature_request(body.clone());

    if gh_available() {
        match create_gh_issue(&title, &body, "enhancement") {
            Ok(url) => Ok(serde_json::json!({ "status": "submitted", "url": url })),
            Err(_) => {
                queue_report(&state.data_dir, "feature", &title, &body)?;
                Ok(serde_json::json!({ "status": "queued", "reason": "GitHub API failed, will retry later" }))
            }
        }
    } else {
        queue_report(&state.data_dir, "feature", &title, &body)?;
        Ok(serde_json::json!({ "status": "queued", "reason": "No internet connection, will submit when online" }))
    }
}

/// Queue a report for later submission.
fn queue_report(data_dir: &std::path::Path, report_type: &str, title: &str, body: &str) -> Result<(), String> {
    let conn = ensure_reports_db(data_dir)?;
    let now = chrono::Utc::now().timestamp();
    conn.execute(
        "INSERT INTO pending_reports (report_type, title, body, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![report_type, title, body, now],
    ).map_err(|e| format!("Failed to queue report: {}", e))?;
    Ok(())
}

/// Flush any pending reports (called on app startup when online).
#[tauri::command]
pub fn flush_pending_reports(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    if !gh_available() {
        return Ok(serde_json::json!({ "flushed": 0, "reason": "gh CLI not available" }));
    }

    let conn = ensure_reports_db(&state.data_dir)?;
    let mut stmt = conn.prepare(
        "SELECT id, report_type, title, body FROM pending_reports ORDER BY created_at ASC"
    ).map_err(|e| format!("Failed to query pending reports: {}", e))?;

    let rows: Vec<(i64, String, String, String)> = stmt.query_map([], |row| {
        Ok((
            row.get(0)?,
            row.get(1)?,
            row.get(2)?,
            row.get(3)?,
        ))
    }).map_err(|e| format!("Failed to read pending reports: {}", e))?
    .filter_map(|r| r.ok())
    .collect();

    let mut flushed = 0;
    for (id, report_type, title, body) in &rows {
        let label = if report_type == "bug" { "bug" } else { "enhancement" };
        if create_gh_issue(title, body, label).is_ok() {
            let _ = conn.execute("DELETE FROM pending_reports WHERE id = ?1", params![id]);
            flushed += 1;
        }
    }

    Ok(serde_json::json!({ "flushed": flushed, "remaining": rows.len() - flushed }))
}

/// Get count of pending (queued) reports.
#[tauri::command]
pub fn get_pending_report_count(
    state: State<'_, AppState>,
) -> Result<i64, String> {
    let conn = ensure_reports_db(&state.data_dir)?;
    conn.query_row(
        "SELECT COUNT(*) FROM pending_reports",
        [],
        |row| row.get(0),
    ).map_err(|e| format!("Failed to count pending reports: {}", e))
}
