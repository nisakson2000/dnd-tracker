use std::fs::{self, OpenOptions};
use std::io::Write;

const MAX_LOG_SIZE: u64 = 10 * 1024 * 1024; // 10 MB

/// Appends a bug report entry to `codex-bug-reports.log` on the user's Desktop.
/// Rotates the log file if it exceeds 10 MB.
#[tauri::command]
pub fn write_bug_report(report: String) -> Result<String, String> {
    let desktop = dirs::desktop_dir().ok_or("Could not locate Desktop directory")?;
    let log_path = desktop.join("codex-bug-reports.log");

    // Rotate if file exceeds MAX_LOG_SIZE
    if log_path.exists() {
        if let Ok(metadata) = fs::metadata(&log_path) {
            if metadata.len() > MAX_LOG_SIZE {
                let old_path = desktop.join("codex-bug-reports.old.log");
                // Best-effort rotation: if rename fails, continue writing to current file
                let _ = fs::rename(&log_path, &old_path);
            }
        }
    }

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .map_err(|e| format!("Failed to open log file: {}", e))?;

    file.write_all(report.as_bytes())
        .map_err(|e| format!("Failed to write report: {}", e))?;

    file.write_all(b"\n")
        .map_err(|e| format!("Failed to write newline: {}", e))?;

    Ok(log_path.to_string_lossy().to_string())
}
