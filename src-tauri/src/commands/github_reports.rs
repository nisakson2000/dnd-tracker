use rusqlite::params;
use std::fs;
use std::path::PathBuf;
use tauri::State;

use crate::db::AppState;

const GITHUB_REPO: &str = "nisakson2000/dnd-tracker";
/// Set via CODEX_REPORTS_TOKEN env var at build time.
/// If not set, GitHub submissions will be queued locally.
const GITHUB_TOKEN: Option<&str> = option_env!("CODEX_REPORTS_TOKEN");

/// Create a GitHub issue via the REST API.
async fn create_github_issue(title: &str, body: &str, labels: &[&str]) -> Result<serde_json::Value, String> {
    let token = GITHUB_TOKEN.ok_or("No GitHub token configured — report saved locally")?;
    let url = format!("https://api.github.com/repos/{}/issues", GITHUB_REPO);

    let client = reqwest::Client::new();
    let resp = client
        .post(&url)
        .header("Authorization", format!("Bearer {}", token))
        .header("Accept", "application/vnd.github+json")
        .header("User-Agent", "TheCodex-DnD")
        .header("X-GitHub-Api-Version", "2022-11-28")
        .json(&serde_json::json!({
            "title": title,
            "body": body,
            "labels": labels,
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach GitHub: {}", e))?;

    let status = resp.status();
    let resp_body: serde_json::Value = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse GitHub response: {}", e))?;

    if status.is_success() {
        let issue_url = resp_body["html_url"].as_str().unwrap_or("").to_string();
        let issue_number = resp_body["number"].as_u64().unwrap_or(0);
        eprintln!("[reports] Created GitHub issue #{}: {}", issue_number, issue_url);
        Ok(serde_json::json!({
            "status": "submitted",
            "url": issue_url,
            "issue_number": issue_number,
        }))
    } else {
        let msg = resp_body["message"].as_str().unwrap_or("Unknown error");
        eprintln!("[reports] GitHub API error ({}): {}", status, msg);
        Err(format!("GitHub API error: {} — {}", status, msg))
    }
}

/// Get the reports directory inside the app data folder (local backup).
fn reports_dir(data_dir: &std::path::Path, report_type: &str) -> PathBuf {
    let folder = if report_type == "bug" { "bugs" } else { "feature-requests" };
    data_dir.join("reports").join(folder)
}

/// Write a local backup of the report.
fn write_report_file(data_dir: &std::path::Path, report_type: &str, title: &str, body: &str) -> Result<PathBuf, String> {
    let dir = reports_dir(data_dir, report_type);
    if !dir.is_dir() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Failed to create reports dir: {}", e))?;
    }

    let now = chrono::Local::now();
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

    Ok(filepath)
}

/// Ensure the reports queue table exists (for offline queuing).
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

/// Queue a report for later submission (offline fallback).
fn queue_report(data_dir: &std::path::Path, report_type: &str, title: &str, body: &str) -> Result<(), String> {
    let conn = ensure_reports_db(data_dir)?;
    let now = chrono::Utc::now().timestamp();
    conn.execute(
        "INSERT INTO pending_reports (report_type, title, body, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![report_type, title, body, now],
    ).map_err(|e| format!("Failed to queue report: {}", e))?;
    Ok(())
}

/// Submit a bug report — creates a GitHub issue, with local backup + offline queue.
#[tauri::command]
pub async fn submit_bug_report(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Clone data_dir so we don't hold State across await
    let data_dir = state.data_dir.clone();

    // Always save a local backup
    let _ = write_report_file(&data_dir, "bug", &title, &body);

    // Try to create a GitHub issue
    match create_github_issue(&title, &body, &["bug"]).await {
        Ok(result) => Ok(result),
        Err(e) => {
            eprintln!("[reports] GitHub submission failed, queuing: {}", e);
            let _ = queue_report(&data_dir, "bug", &title, &body);
            Ok(serde_json::json!({
                "status": "queued",
                "message": "Saved locally — will retry when online",
            }))
        }
    }
}

/// Submit a feature request — creates a GitHub issue, with local backup + offline queue.
#[tauri::command]
pub async fn submit_feature_request(
    title: String,
    body: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let data_dir = state.data_dir.clone();

    // Always save a local backup
    let _ = write_report_file(&data_dir, "feature", &title, &body);

    // Try to create a GitHub issue
    match create_github_issue(&title, &body, &["enhancement"]).await {
        Ok(result) => Ok(result),
        Err(e) => {
            eprintln!("[reports] GitHub submission failed, queuing: {}", e);
            let _ = queue_report(&data_dir, "feature", &title, &body);
            Ok(serde_json::json!({
                "status": "queued",
                "message": "Saved locally — will retry when online",
            }))
        }
    }
}

/// Flush any pending reports (called on app startup when online).
#[tauri::command]
pub async fn flush_pending_reports(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let data_dir = state.data_dir.clone();

    // Read all pending reports from DB before any async work
    let reports = {
        let conn = ensure_reports_db(&data_dir)?;
        let mut stmt = conn.prepare(
            "SELECT id, report_type, title, body FROM pending_reports ORDER BY created_at ASC LIMIT 10"
        ).map_err(|e| format!("Failed to query pending reports: {}", e))?;

        let r: Vec<(i64, String, String, String)> = stmt
            .query_map([], |row| {
                Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?))
            })
            .map_err(|e| format!("Failed to read pending reports: {}", e))?
            .filter_map(|r| r.ok())
            .collect();
        r
    };

    // Now do async GitHub submissions
    let mut flushed_ids: Vec<i64> = Vec::new();
    for (id, report_type, title, body) in &reports {
        let labels: &[&str] = if report_type == "bug" { &["bug"] } else { &["enhancement"] };
        match create_github_issue(title, body, labels).await {
            Ok(_) => { flushed_ids.push(*id); }
            Err(e) => {
                eprintln!("[reports] Failed to flush report {}: {}", id, e);
                break;
            }
        }
    }

    // Delete flushed reports from DB
    let remaining = {
        let conn = ensure_reports_db(&data_dir)?;
        for id in &flushed_ids {
            let _ = conn.execute("DELETE FROM pending_reports WHERE id = ?1", params![id]);
        }
        conn.query_row(
            "SELECT COUNT(*) FROM pending_reports", [], |row| row.get::<_, i64>(0),
        ).map_err(|e| format!("Failed to count remaining: {}", e))?
    };

    Ok(serde_json::json!({ "flushed": flushed_ids.len(), "remaining": remaining }))
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
