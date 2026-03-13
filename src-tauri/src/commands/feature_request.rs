use std::fs::OpenOptions;
use std::io::Write;

const MAX_LOG_SIZE: u64 = 10 * 1024 * 1024; // 10 MB

/// Appends a feature request entry to `codex-feature-requests.log` on the user's Desktop.
/// Rotates the log file if it exceeds 10 MB.
#[tauri::command]
pub fn write_feature_request(report: String) -> Result<String, String> {
    let desktop = dirs::desktop_dir().ok_or("Could not locate Desktop directory")?;
    let log_path = desktop.join("codex-feature-requests.log");

    // Rotate if file exceeds MAX_LOG_SIZE
    if log_path.exists() {
        if let Ok(metadata) = std::fs::metadata(&log_path) {
            if metadata.len() > MAX_LOG_SIZE {
                let old_path = desktop.join("codex-feature-requests.old.log");
                let _ = std::fs::rename(&log_path, &old_path);
            }
        }
    }

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .map_err(|e| format!("Failed to open log file: {}", e))?;

    file.write_all(report.as_bytes())
        .map_err(|e| format!("Failed to write request: {}", e))?;

    file.write_all(b"\n")
        .map_err(|e| format!("Failed to write newline: {}", e))?;

    Ok(log_path.to_string_lossy().to_string())
}
