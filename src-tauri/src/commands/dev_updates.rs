use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tokio::process::Command;

static GIT_LOCK: AtomicBool = AtomicBool::new(false);
const GIT_TIMEOUT: Duration = Duration::from_secs(30);

/// Simple guard: sets the lock on creation, clears on drop
struct GitLockGuard;

impl GitLockGuard {
    fn acquire() -> Result<Self, String> {
        if GIT_LOCK.compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst).is_err() {
            return Err("Another git operation is already running".to_string());
        }
        Ok(GitLockGuard)
    }
}

impl Drop for GitLockGuard {
    fn drop(&mut self) {
        GIT_LOCK.store(false, Ordering::SeqCst);
    }
}

/// Dynamically find the repo root by asking git, falling back to the binary's
/// location. Never uses CARGO_MANIFEST_DIR (compile-time path that breaks on
/// other machines).
fn repo_root() -> Result<PathBuf, String> {
    // Ask git itself where the repo root is — works regardless of where the
    // binary is located, as long as the working directory is inside the repo.
    let output = std::process::Command::new("git")
        .args(["rev-parse", "--show-toplevel"])
        .output();

    if let Ok(output) = output {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return Ok(PathBuf::from(path));
            }
        }
    }

    // Fallback: use the current exe's directory and walk up to find .git
    if let Ok(exe_path) = std::env::current_exe() {
        let mut dir = exe_path.parent().map(|p| p.to_path_buf());
        while let Some(d) = dir {
            if d.join(".git").exists() {
                return Ok(d);
            }
            dir = d.parent().map(|p| p.to_path_buf());
        }
    }

    Err("Could not find git repository root".to_string())
}

fn short_sha(sha: &str) -> &str {
    sha.get(..7).unwrap_or(sha)
}

/// Run a git command with a timeout. Returns (stdout, stderr, success).
async fn run_git(root: &PathBuf, args: &[&str]) -> Result<(String, String, bool), String> {
    let child = Command::new("git")
        .args(args)
        .current_dir(root)
        .output();

    let output: std::process::Output = tokio::time::timeout(GIT_TIMEOUT, child)
        .await
        .map_err(|_| format!("git {} timed out after {}s", args.first().unwrap_or(&""), GIT_TIMEOUT.as_secs()))?
        .map_err(|e| format!("git {} failed to run: {}", args.first().unwrap_or(&""), e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    Ok((stdout, stderr, output.status.success()))
}

#[tauri::command]
pub async fn check_git_updates() -> Result<serde_json::Value, String> {
    let _lock = GitLockGuard::acquire()?;
    let root = repo_root()?;

    // Check that origin remote exists
    let (_, _, ok) = run_git(&root, &["remote", "get-url", "origin"]).await?;
    if !ok {
        return Err("No 'origin' remote configured".to_string());
    }

    // Detect default branch (main or master)
    let branch = detect_branch(&root).await?;

    // git fetch origin
    let (_, stderr, ok) = run_git(&root, &["fetch", "origin", &branch]).await?;
    if !ok {
        return Err(format!("git fetch failed: {}", stderr));
    }

    // Compare local HEAD with origin/<branch>
    let (local_sha, _, _) = run_git(&root, &["rev-parse", "HEAD"]).await?;
    let remote_ref = format!("origin/{}", branch);
    let (remote_sha, _, ok) = run_git(&root, &["rev-parse", &remote_ref]).await?;
    if !ok {
        return Err(format!("Branch '{}' not found on origin", branch));
    }

    // Check if remote is actually ahead of local (not the other way around)
    let (_, _, local_is_ahead_or_equal) = run_git(
        &root,
        &["merge-base", "--is-ancestor", &remote_sha, &local_sha],
    ).await.unwrap_or_default();

    // Only report an update if remote has commits we don't have
    let has_update = local_sha != remote_sha && !local_is_ahead_or_equal;

    // Check if we have local unpushed commits
    let (_, _, _local_is_behind_or_equal) = run_git(
        &root,
        &["merge-base", "--is-ancestor", &local_sha, &remote_sha],
    ).await.unwrap_or_default();
    let local_ahead = local_sha != remote_sha && local_is_ahead_or_equal;

    // Check for dirty working tree (warn user before they try to pull)
    let (status_out, _, _) = run_git(&root, &["status", "--porcelain"]).await.unwrap_or_default();
    let has_local_changes = !status_out.is_empty();

    // Get the remote commit message for display
    let (commit_msg, _, _) = run_git(&root, &["log", &remote_ref, "-1", "--format=%s"]).await.unwrap_or_default();

    Ok(serde_json::json!({
        "has_update": has_update,
        "local_sha": short_sha(&local_sha),
        "remote_sha": short_sha(&remote_sha),
        "commit_message": commit_msg,
        "local_ahead": local_ahead,
        "has_local_changes": has_local_changes,
    }))
}

#[tauri::command]
pub async fn pull_git_updates() -> Result<serde_json::Value, String> {
    let _lock = GitLockGuard::acquire()?;
    let root = repo_root()?;

    let branch = detect_branch(&root).await?;

    // Check for dirty working tree
    let (status_out, _, _) = run_git(&root, &["status", "--porcelain"]).await?;
    let was_dirty = !status_out.is_empty();

    if was_dirty {
        // Stash changes before pulling
        let (_, stderr, ok) = run_git(
            &root,
            &["stash", "push", "-m", "auto-stash before dev update pull"],
        ).await?;

        if !ok {
            return Err(format!(
                "You have uncommitted changes and auto-stash failed: {}. Commit or stash manually.",
                stderr
            ));
        }
    }

    // Try fast-forward first (cleanest)
    let (stdout, stderr, pull_ok) = run_git(
        &root,
        &["pull", "origin", &branch, "--ff-only"],
    ).await?;

    // If ff-only failed because local has diverged, try rebase to put local
    // commits on top of remote (common when two devs both commit locally)
    let (stdout, stderr, pull_ok) = if !pull_ok
        && (stderr.contains("Not possible to fast-forward") || stderr.contains("fatal"))
    {
        let (s, e, ok) = run_git(
            &root,
            &["pull", "origin", &branch, "--rebase"],
        ).await?;

        // If rebase also fails with conflicts, abort to restore clean state
        if !ok && (e.contains("CONFLICT") || e.contains("could not apply")) {
            let _ = run_git(&root, &["rebase", "--abort"]).await;
        }

        (s, e, ok)
    } else {
        (stdout, stderr, pull_ok)
    };

    // Pop stash BEFORE checking pull result — we always want changes restored
    let mut stash_warning = String::new();
    if was_dirty {
        let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
            .unwrap_or_else(|e| (String::new(), e, false));

        if !stash_ok {
            stash_warning = format!(
                " Warning: your stashed changes had conflicts. Run 'git stash pop' manually to recover them. ({})",
                stash_stderr
            );
        }
    }

    if !pull_ok {
        return Err(format!("git pull failed: {}{}", stderr, stash_warning));
    }

    Ok(serde_json::json!({
        "success": true,
        "output": stdout,
        "stash_warning": if stash_warning.is_empty() { None } else { Some(stash_warning) },
    }))
}

#[tauri::command]
pub async fn dev_preview_incoming() -> Result<serde_json::Value, String> {
    // No lock needed — this is a read-only diff against already-fetched refs.
    // check_git_updates() already fetched; avoid redundant fetch + lock contention.
    let root = repo_root()?;
    let branch = detect_branch(&root).await?;

    let remote_ref = format!("HEAD...origin/{}", branch);
    let (diff_stat, _, _) = run_git(&root, &["diff", "--stat", &remote_ref]).await?;
    let (diff_names, _, _) = run_git(&root, &["diff", "--name-only", &remote_ref]).await?;

    let changed_files: Vec<String> = diff_names
        .lines()
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    let has_rust_changes = changed_files.iter().any(|f| f.ends_with(".rs"));

    Ok(serde_json::json!({
        "diff_stat": diff_stat,
        "changed_files": changed_files,
        "file_count": changed_files.len(),
        "has_rust_changes": has_rust_changes,
    }))
}

#[tauri::command]
pub async fn dev_rollback_update() -> Result<serde_json::Value, String> {
    let _lock = GitLockGuard::acquire()?;
    let root = repo_root()?;

    let (stdout, stderr, ok) = run_git(&root, &["reset", "--hard", "HEAD~1"]).await?;
    if !ok {
        return Err(format!("git reset failed: {}", stderr));
    }

    Ok(serde_json::json!({
        "success": true,
        "output": stdout,
    }))
}

#[tauri::command]
pub async fn dev_check_build_health() -> Result<serde_json::Value, String> {
    let root = repo_root()?;
    let src_tauri = root.join("src-tauri");

    let child = Command::new("cargo")
        .arg("check")
        .current_dir(&src_tauri)
        .output();

    let output = tokio::time::timeout(Duration::from_secs(120), child)
        .await
        .map_err(|_| "cargo check timed out after 120s".to_string())?
        .map_err(|e| format!("cargo check failed to run: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    Ok(serde_json::json!({
        "success": output.status.success(),
        "stdout": stdout,
        "stderr": stderr,
    }))
}

#[tauri::command]
pub async fn dev_check_conflicts() -> Result<serde_json::Value, String> {
    // No lock needed — read-only diff comparison against already-fetched refs.
    let root = repo_root()?;
    let branch = detect_branch(&root).await?;

    // Local uncommitted changes
    let (local_changes, _, _) = run_git(&root, &["diff", "--name-only"]).await?;
    // Also include staged changes
    let (staged_changes, _, _) = run_git(&root, &["diff", "--name-only", "--cached"]).await?;

    let local_files: std::collections::HashSet<String> = local_changes
        .lines()
        .chain(staged_changes.lines())
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    // Incoming changes from remote
    let remote_ref = format!("HEAD...origin/{}", branch);
    let (incoming_changes, _, _) = run_git(&root, &["diff", "--name-only", &remote_ref]).await?;

    let incoming_files: std::collections::HashSet<String> = incoming_changes
        .lines()
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    // Intersect
    let conflicts: Vec<String> = local_files
        .intersection(&incoming_files)
        .cloned()
        .collect();

    Ok(serde_json::json!({
        "conflict_files": conflicts,
        "conflict_count": conflicts.len(),
        "local_changed_count": local_files.len(),
        "incoming_changed_count": incoming_files.len(),
    }))
}

/// Detect whether the remote uses "main" or "master"
async fn detect_branch(root: &PathBuf) -> Result<String, String> {
    let (_, _, ok) = run_git(root, &["rev-parse", "--verify", "origin/main"]).await
        .unwrap_or_default();
    if ok {
        return Ok("main".to_string());
    }

    let (_, _, ok) = run_git(root, &["rev-parse", "--verify", "origin/master"]).await
        .unwrap_or_default();
    if ok {
        return Ok("master".to_string());
    }

    Err("Could not find 'main' or 'master' branch on origin".to_string())
}
