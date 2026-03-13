use std::fs;
use std::io::Read;
use std::path::PathBuf;
use tauri::State;

use crate::db::AppState;

const DIST_ZIP_URL: &str =
    "https://raw.githubusercontent.com/nisakson2000/dnd-tracker/main/frontend/dist.zip";

const VERSION_MANIFEST_URL: &str =
    "https://raw.githubusercontent.com/nisakson2000/dnd-tracker/main/version.json";

/// Get the directory where OTA frontend updates are stored.
fn ota_dist_dir(data_dir: &std::path::Path) -> PathBuf {
    data_dir.join("dist_update")
}

/// Check if an OTA frontend override exists.
#[tauri::command]
pub fn ota_has_update(state: State<'_, AppState>) -> bool {
    ota_dist_dir(&state.data_dir).join("index.html").exists()
}

/// Check the version manifest and download the latest frontend if newer.
/// Returns info about what happened.
#[tauri::command]
pub async fn ota_download_update(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let data_dir = state.data_dir.clone();
    let dist_dir = ota_dist_dir(&data_dir);

    // 1. Check version manifest
    eprintln!("[ota] Checking version manifest...");
    let manifest: serde_json::Value = reqwest::get(VERSION_MANIFEST_URL)
        .await
        .map_err(|e| format!("Failed to fetch version manifest: {}", e))?
        .json()
        .await
        .map_err(|e| format!("Failed to parse version manifest: {}", e))?;

    let remote_version = manifest["version"]
        .as_str()
        .unwrap_or("0.0.0")
        .to_string();
    eprintln!("[ota] Remote version: {}", remote_version);

    // Check local version marker
    let version_file = data_dir.join("ota_version.txt");
    let local_ota_version = fs::read_to_string(&version_file).unwrap_or_default();

    // Also check the app's compiled version
    let app_version = env!("CARGO_PKG_VERSION");
    eprintln!("[ota] App version: {}, OTA version: {}", app_version, local_ota_version.trim());

    // If OTA version matches remote, no update needed
    if local_ota_version.trim() == remote_version {
        return Ok(serde_json::json!({
            "status": "up_to_date",
            "version": remote_version,
        }));
    }

    // 2. Download dist.zip
    eprintln!("[ota] Downloading dist.zip from GitHub...");
    let response = reqwest::get(DIST_ZIP_URL)
        .await
        .map_err(|e| format!("Failed to download dist.zip: {}", e))?;

    if !response.status().is_success() {
        return Err(format!(
            "dist.zip download failed with status {}",
            response.status()
        ));
    }

    let zip_bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read dist.zip bytes: {}", e))?;

    eprintln!("[ota] Downloaded {} bytes", zip_bytes.len());

    // 3. Extract to dist_update/
    // Clear old update dir
    if dist_dir.exists() {
        let _ = fs::remove_dir_all(&dist_dir);
    }
    fs::create_dir_all(&dist_dir)
        .map_err(|e| format!("Failed to create dist_update dir: {}", e))?;

    let cursor = std::io::Cursor::new(zip_bytes.to_vec());
    let mut archive = zip::ZipArchive::new(cursor)
        .map_err(|e| format!("Failed to open dist.zip: {}", e))?;

    let mut extracted = 0;
    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to read zip entry {}: {}", i, e))?;

        let name = file.name().to_string();

        // Strip leading "dist/" prefix if present
        let relative = name
            .strip_prefix("dist/")
            .or_else(|| name.strip_prefix("frontend/dist/"))
            .unwrap_or(&name);

        if relative.is_empty() || file.is_dir() {
            let dir_path = dist_dir.join(relative);
            let _ = fs::create_dir_all(&dir_path);
            continue;
        }

        let out_path = dist_dir.join(relative);
        if let Some(parent) = out_path.parent() {
            let _ = fs::create_dir_all(parent);
        }

        let mut buf = Vec::new();
        file.read_to_end(&mut buf)
            .map_err(|e| format!("Failed to read file {}: {}", name, e))?;
        fs::write(&out_path, &buf)
            .map_err(|e| format!("Failed to write {}: {}", out_path.display(), e))?;
        extracted += 1;
    }

    // 4. Write version marker
    fs::write(&version_file, &remote_version)
        .map_err(|e| format!("Failed to write version marker: {}", e))?;

    eprintln!(
        "[ota] Extracted {} files to {}, version {}",
        extracted,
        dist_dir.display(),
        remote_version
    );

    Ok(serde_json::json!({
        "status": "updated",
        "version": remote_version,
        "files_extracted": extracted,
    }))
}

/// Clear the OTA update so the app falls back to embedded frontend.
#[tauri::command]
pub fn ota_clear_update(state: State<'_, AppState>) -> Result<(), String> {
    let dist_dir = ota_dist_dir(&state.data_dir);
    if dist_dir.exists() {
        fs::remove_dir_all(&dist_dir)
            .map_err(|e| format!("Failed to clear OTA update: {}", e))?;
    }
    let version_file = state.data_dir.join("ota_version.txt");
    let _ = fs::remove_file(&version_file);
    Ok(())
}

/// Helper: guess MIME type from file extension.
pub fn guess_mime(path: &std::path::Path) -> &'static str {
    match path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase()
        .as_str()
    {
        "html" => "text/html; charset=utf-8",
        "js" | "mjs" => "application/javascript; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "json" => "application/json; charset=utf-8",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "ico" => "image/x-icon",
        "woff" => "font/woff",
        "woff2" => "font/woff2",
        "ttf" => "font/ttf",
        "otf" => "font/otf",
        "wasm" => "application/wasm",
        "webp" => "image/webp",
        "mp3" => "audio/mpeg",
        "ogg" => "audio/ogg",
        "wav" => "audio/wav",
        "webm" => "video/webm",
        "mp4" => "video/mp4",
        "txt" => "text/plain; charset=utf-8",
        "xml" => "application/xml; charset=utf-8",
        _ => "application/octet-stream",
    }
}
