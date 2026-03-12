use std::process::Command;
use std::path::PathBuf;

fn repo_root() -> PathBuf {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    PathBuf::from(manifest_dir)
        .parent()
        .unwrap_or_else(|| std::path::Path::new("."))
        .to_path_buf()
}

fn short_sha(sha: &str) -> &str {
    sha.get(..7).unwrap_or(sha)
}

#[tauri::command]
pub fn check_git_updates() -> Result<serde_json::Value, String> {
    let root = repo_root();

    // Verify this is a git repo
    if !root.join(".git").exists() {
        return Err("Not a git repository".to_string());
    }

    // Check that origin remote exists
    let remote_check = Command::new("git")
        .args(["remote", "get-url", "origin"])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git not available: {}", e))?;

    if !remote_check.status.success() {
        return Err("No 'origin' remote configured".to_string());
    }

    // Detect default branch (main or master)
    let branch = detect_branch(&root)?;

    // git fetch origin (with timeout via env)
    let fetch = Command::new("git")
        .args(["fetch", "origin", &branch])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git fetch failed: {}", e))?;

    if !fetch.status.success() {
        let stderr = String::from_utf8_lossy(&fetch.stderr);
        return Err(format!("git fetch failed: {}", stderr.trim()));
    }

    // Compare local HEAD with origin/<branch>
    let local = Command::new("git")
        .args(["rev-parse", "HEAD"])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git rev-parse failed: {}", e))?;

    let remote_ref = format!("origin/{}", branch);
    let remote = Command::new("git")
        .args(["rev-parse", &remote_ref])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git rev-parse failed: {}", e))?;

    if !remote.status.success() {
        return Err(format!("Branch '{}' not found on origin", branch));
    }

    let local_sha = String::from_utf8_lossy(&local.stdout).trim().to_string();
    let remote_sha = String::from_utf8_lossy(&remote.stdout).trim().to_string();

    // Get the remote commit message for display
    let log = Command::new("git")
        .args(["log", &remote_ref, "-1", "--format=%s"])
        .current_dir(&root)
        .output()
        .ok();
    let commit_msg = log
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
        .unwrap_or_default();

    Ok(serde_json::json!({
        "has_update": local_sha != remote_sha,
        "local_sha": short_sha(&local_sha),
        "remote_sha": short_sha(&remote_sha),
        "commit_message": commit_msg,
    }))
}

#[tauri::command]
pub fn pull_git_updates() -> Result<serde_json::Value, String> {
    let root = repo_root();

    if !root.join(".git").exists() {
        return Err("Not a git repository".to_string());
    }

    let branch = detect_branch(&root)?;

    // Check for dirty working tree
    let status = Command::new("git")
        .args(["status", "--porcelain"])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git status failed: {}", e))?;

    let dirty_output = String::from_utf8_lossy(&status.stdout);
    if !dirty_output.trim().is_empty() {
        // Stash changes before pulling
        let stash = Command::new("git")
            .args(["stash", "push", "-m", "auto-stash before dev update pull"])
            .current_dir(&root)
            .output()
            .map_err(|e| format!("git stash failed: {}", e))?;

        if !stash.status.success() {
            return Err("Working tree has changes and auto-stash failed. Commit or stash manually.".to_string());
        }
    }

    let pull = Command::new("git")
        .args(["pull", "origin", &branch, "--ff-only"])
        .current_dir(&root)
        .output()
        .map_err(|e| format!("git pull failed: {}", e))?;

    let stdout = String::from_utf8_lossy(&pull.stdout).to_string();
    let stderr = String::from_utf8_lossy(&pull.stderr).to_string();

    // Pop stash if we stashed
    if !dirty_output.trim().is_empty() {
        let _ = Command::new("git")
            .args(["stash", "pop"])
            .current_dir(&root)
            .output();
    }

    if !pull.status.success() {
        if stderr.contains("Not possible to fast-forward") || stderr.contains("CONFLICT") {
            return Err("Cannot fast-forward — local commits diverge from remote. Pull manually.".to_string());
        }
        return Err(format!("git pull failed: {}", stderr.trim()));
    }

    Ok(serde_json::json!({
        "success": true,
        "output": stdout.trim(),
    }))
}

/// Detect whether the remote uses "main" or "master"
fn detect_branch(root: &PathBuf) -> Result<String, String> {
    // Try origin/main first
    let check_main = Command::new("git")
        .args(["rev-parse", "--verify", "origin/main"])
        .current_dir(root)
        .output();

    if let Ok(output) = check_main {
        if output.status.success() {
            return Ok("main".to_string());
        }
    }

    // Fall back to origin/master
    let check_master = Command::new("git")
        .args(["rev-parse", "--verify", "origin/master"])
        .current_dir(root)
        .output();

    if let Ok(output) = check_master {
        if output.status.success() {
            return Ok("master".to_string());
        }
    }

    Err("Could not find 'main' or 'master' branch on origin".to_string())
}
