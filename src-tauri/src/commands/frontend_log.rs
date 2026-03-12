use crate::db::AppState;
use std::fs::OpenOptions;
use std::io::Write;
use tauri::State;

#[tauri::command]
pub fn frontend_log(
    state: State<'_, AppState>,
    level: String,
    message: String,
    context: Option<String>,
) -> Result<(), String> {
    let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f");
    let lvl = level.to_uppercase();
    let ctx = context.unwrap_or_default();

    let line = if ctx.is_empty() {
        format!("[{timestamp}] [{lvl}] {message}\n")
    } else {
        format!("[{timestamp}] [{lvl}] {message} | {ctx}\n")
    };

    // Print to stderr so it appears in terminal during dev
    eprint!("{}", line);

    // Also write to log file
    let log_path = state.data_dir.join("frontend.log");
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
    {
        let _ = file.write_all(line.as_bytes());

        // Truncate if over 500KB
        if let Ok(meta) = file.metadata() {
            if meta.len() > 512_000 {
                if let Ok(contents) = std::fs::read_to_string(&log_path) {
                    // Keep last ~250KB
                    let keep = &contents[contents.len().saturating_sub(256_000)..];
                    let _ = std::fs::write(&log_path, keep);
                }
            }
        }
    }

    Ok(())
}
