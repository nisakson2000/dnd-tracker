use rusqlite::params;
use std::fs;
use std::path::PathBuf;
use tauri::State;

use crate::db::AppState;

/// Get the reports directory inside the app data folder.
fn reports_dir(data_dir: &std::path::Path, report_type: &str) -> PathBuf {
    let folder = if report_type == "bug" { "bugs" } else { "feature-requests" };
    data_dir.join("reports").join(folder)
}

/// Write a report as a text file in the app data reports folder.
/// Filename: "March 13 2026 11-45 PM.txt"
fn write_report_file(data_dir: &std::path::Path, report_type: &str, title: &str, body: &str) -> Result<PathBuf, String> {
    let dir = reports_dir(data_dir, report_type);
    if !dir.is_dir() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Failed to create reports dir: {}", e))?;
    }

    let now = chrono::Local::now();
    // Filename: "March 13 2026 11-45 PM.txt"
    let filename = format!("{}.txt", now.format("%B %d %Y %I-%M %p"));
    let filepath = dir.join(&filename);

    let type_label = if report_type == "bug" { "Bug Report" } else { "Feature Request" };
    let content = format!(
        "{}\nTitle: {}\nDate: {}\n\n{}\n",
        type_label,
        title,
        now.format("%B %d, %Y at %I:%M %p"),
        body,
    );

    fs::write(&filepath, &content)
        .map_err(|e| format!("Failed to write report: {}", e))?;

    eprintln!("[reports] Saved {} report to {}", report_type, filepath.display());
    Ok(filepath)
}

/// Ensure the reports queue table exists.
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

/// Submit a bug report — saves to local file and queues for GitHub.
#[tauri::command]
pub fn submit_bug_report(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Write to local log file (keep existing behavior)
    let _ = super::bug_report::write_bug_report(body.clone());
    // Write as markdown file to app data reports folder
    let path = write_report_file(&state.data_dir, "bug", &title, &body)?;
    // Also queue in DB for potential future GitHub submission
    let _ = queue_report(&state.data_dir, "bug", &title, &body);

    Ok(serde_json::json!({
        "status": "submitted",
        "path": path.display().to_string()
    }))
}

/// Submit a feature request — saves to local file and queues for GitHub.
#[tauri::command]
pub fn submit_feature_request(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Write to local log file (keep existing behavior)
    let _ = super::feature_request::write_feature_request(body.clone());
    // Write as markdown file to app data reports folder
    let path = write_report_file(&state.data_dir, "feature", &title, &body)?;
    // Also queue in DB for potential future GitHub submission
    let _ = queue_report(&state.data_dir, "feature", &title, &body);

    Ok(serde_json::json!({
        "status": "submitted",
        "path": path.display().to_string()
    }))
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
    // For now, just report the count — GitHub submission requires gh CLI or a token
    let conn = ensure_reports_db(&state.data_dir)?;
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM pending_reports", [], |row| row.get(0),
    ).map_err(|e| format!("Failed to count pending reports: {}", e))?;

    Ok(serde_json::json!({ "flushed": 0, "remaining": count }))
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

/// Get the path to the reports folder so the frontend can show it.
#[tauri::command]
pub fn get_reports_path(
    state: State<'_, AppState>,
) -> Result<String, String> {
    let dir = state.data_dir.join("reports");
    Ok(dir.display().to_string())
}
