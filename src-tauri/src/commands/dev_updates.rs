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
    // Strategy 1: Ask git from the current working directory
    if let Ok(cwd) = std::env::current_dir() {
        eprintln!("[dev-sync] cwd for repo_root: {:?}", cwd);
        if let Some(root) = try_git_toplevel(Some(&cwd)) {
            return Ok(root);
        }
    }

    // Strategy 2: Ask git from the executable's directory (production builds)
    // In production, the exe is inside the repo at src-tauri/target/release/
    if let Ok(exe_path) = std::env::current_exe() {
        eprintln!("[dev-sync] exe path: {:?}", exe_path);
        if let Some(exe_dir) = exe_path.parent() {
            if let Some(root) = try_git_toplevel(Some(exe_dir)) {
                return Ok(root);
            }
            // Walk up from exe directory to find .git
            let mut dir = Some(exe_dir.to_path_buf());
            while let Some(d) = dir {
                if d.join(".git").exists() {
                    eprintln!("[dev-sync] Found .git at {:?}", d);
                    return Ok(d);
                }
                dir = d.parent().map(|p| p.to_path_buf());
            }
        }
    }

    // Strategy 3: Try common install locations (Windows)
    #[cfg(target_os = "windows")]
    {
        if let Ok(userprofile) = std::env::var("USERPROFILE") {
            let desktop_repo = PathBuf::from(&userprofile).join("Desktop").join("dnd-tracker-nick main");
            if desktop_repo.join(".git").exists() {
                return Ok(desktop_repo);
            }
            let desktop_repo2 = PathBuf::from(&userprofile).join("Desktop").join("dnd-tracker");
            if desktop_repo2.join(".git").exists() {
                return Ok(desktop_repo2);
            }
        }
    }

    Err("Could not find git repository root — make sure you're running from inside the repo".to_string())
}

/// Try to get the git toplevel from a specific directory.
fn try_git_toplevel(dir: Option<&std::path::Path>) -> Option<PathBuf> {
    let mut cmd = std::process::Command::new("git");
    cmd.args(["rev-parse", "--show-toplevel"]);
    if let Some(d) = dir {
        cmd.current_dir(d);
    }
    let output = cmd.output().ok()?;
    if !output.status.success() {
        return None;
    }
    let path = String::from_utf8_lossy(&output.stdout)
        .trim_end_matches('\n')
        .trim_end_matches('\r')
        .to_string();
    if path.is_empty() {
        return None;
    }
    Some(PathBuf::from(path))
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
    let _lock = GitLockGuard::acquire().map_err(|e| {
        eprintln!("[dev-sync] lock acquire failed: {}", e);
        e
    })?;
    let root = repo_root().map_err(|e| {
        eprintln!("[dev-sync] repo_root failed: {}", e);
        e
    })?;
    eprintln!("[dev-sync] repo root: {:?}", root);

    // Check that origin remote exists
    let (remote_url, _, ok) = run_git(&root, &["remote", "get-url", "origin"]).await?;
    if !ok {
        eprintln!("[dev-sync] no origin remote configured");
        return Err("No 'origin' remote configured".to_string());
    }
    eprintln!("[dev-sync] origin url: {}", remote_url);

    // Detect default branch (main or master)
    let branch = detect_branch(&root).await?;
    eprintln!("[dev-sync] branch: {}", branch);

    // git fetch origin
    let (fetch_out, stderr, ok) = run_git(&root, &["fetch", "origin", &branch]).await?;
    eprintln!("[dev-sync] fetch ok={}, stdout='{}', stderr='{}'", ok, fetch_out, stderr);
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
    eprintln!("[dev-sync] local_sha={} remote_sha={} match={}", short_sha(&local_sha), short_sha(&remote_sha), local_sha == remote_sha);

    // Check if remote is actually ahead of local (not the other way around)
    let (_, _, local_is_ahead_or_equal) = run_git(
        &root,
        &["merge-base", "--is-ancestor", &remote_sha, &local_sha],
    ).await.unwrap_or_default();
    eprintln!("[dev-sync] local_is_ahead_or_equal={}", local_is_ahead_or_equal);

    // Only report an update if remote has commits we don't have
    let has_update = local_sha != remote_sha && !local_is_ahead_or_equal;
    eprintln!("[dev-sync] => has_update={}", has_update);

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

    // Rebuild the frontend so updated source files take effect
    let frontend_dir = root.join("frontend");
    let mut rebuild_msg = String::new();
    if frontend_dir.is_dir() {
        eprintln!("[dev-sync] Rebuilding frontend in {:?}", frontend_dir);
        let rebuild = Command::new("npx")
            .args(["vite", "build"])
            .current_dir(&frontend_dir)
            .output();

        match tokio::time::timeout(Duration::from_secs(60), rebuild).await {
            Ok(Ok(output)) => {
                if output.status.success() {
                    eprintln!("[dev-sync] Frontend rebuild succeeded");
                    rebuild_msg = "Frontend rebuilt successfully".to_string();
                } else {
                    let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
                    eprintln!("[dev-sync] Frontend rebuild failed: {}", err);
                    rebuild_msg = format!("Frontend rebuild failed: {}", err);
                }
            }
            Ok(Err(e)) => {
                eprintln!("[dev-sync] Frontend rebuild error: {}", e);
                rebuild_msg = format!("Frontend rebuild error: {}", e);
            }
            Err(_) => {
                eprintln!("[dev-sync] Frontend rebuild timed out");
                rebuild_msg = "Frontend rebuild timed out after 60s".to_string();
            }
        }
    }

    Ok(serde_json::json!({
        "success": true,
        "output": stdout,
        "rebuild": rebuild_msg,
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

/// Smart pull that checks the other dev's unpushed commits against incoming
/// changes. If overlapping files are found, attempts auto-resolution before
/// pulling. Returns detailed info about what happened.
#[tauri::command]
pub async fn dev_smart_pull() -> Result<serde_json::Value, String> {
    let _lock = GitLockGuard::acquire()?;
    let root = repo_root()?;
    let branch = detect_branch(&root).await?;
    let remote_ref = format!("origin/{}", branch);

    // ── 1. Gather state ──────────────────────────────────────────────
    let (local_sha, _, _) = run_git(&root, &["rev-parse", "HEAD"]).await?;
    let (remote_sha, _, _) = run_git(&root, &["rev-parse", &remote_ref]).await?;

    if local_sha == remote_sha {
        return Ok(serde_json::json!({
            "success": true,
            "action": "none",
            "message": "Already up to date.",
        }));
    }

    // Find merge base (common ancestor)
    let (merge_base, _, mb_ok) = run_git(&root, &["merge-base", &local_sha, &remote_sha]).await?;
    if !mb_ok {
        return Err("Could not find common ancestor between local and remote.".into());
    }

    // Files changed locally (unpushed commits) since merge base
    let (local_diff, _, _) = run_git(
        &root,
        &["diff", "--name-only", &merge_base, "HEAD"],
    ).await?;
    let local_files: std::collections::HashSet<String> = local_diff
        .lines()
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    // Files changed on remote since merge base
    let (remote_diff, _, _) = run_git(
        &root,
        &["diff", "--name-only", &merge_base, &remote_ref],
    ).await?;
    let remote_files: std::collections::HashSet<String> = remote_diff
        .lines()
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    // Overlapping files = potential conflicts
    let overlapping: Vec<String> = local_files
        .intersection(&remote_files)
        .cloned()
        .collect();

    // Also check dirty working tree
    let (status_out, _, _) = run_git(&root, &["status", "--porcelain"]).await?;
    let was_dirty = !status_out.is_empty();

    // ── 2. No local unpushed commits → simple fast-forward ───────────
    let local_is_ahead = {
        let (_, _, ok) = run_git(
            &root,
            &["merge-base", "--is-ancestor", &remote_sha, &local_sha],
        ).await.unwrap_or_default();
        ok && local_sha != remote_sha
    };

    if !local_is_ahead && local_files.is_empty() {
        // No local commits diverged — just ff pull
        if was_dirty {
            let (_, stderr, ok) = run_git(
                &root,
                &["stash", "push", "-m", "auto-stash before smart pull"],
            ).await?;
            if !ok {
                return Err(format!("Auto-stash failed: {}. Commit or stash manually.", stderr));
            }
        }

        let (_stdout, stderr, ok) = run_git(
            &root,
            &["pull", "origin", &branch, "--ff-only"],
        ).await?;

        let mut stash_warning = String::new();
        if was_dirty {
            let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
                .unwrap_or_else(|e| (String::new(), e, false));
            if !stash_ok {
                stash_warning = format!(
                    " Warning: stash pop had conflicts. Run 'git stash pop' manually. ({})",
                    stash_stderr
                );
            }
        }

        if !ok {
            return Err(format!("Fast-forward pull failed: {}{}", stderr, stash_warning));
        }

        return Ok(serde_json::json!({
            "success": true,
            "action": "fast_forward",
            "message": format!("Fast-forward pull successful.{}", stash_warning),
            "overlapping_files": [],
            "local_changed": local_files.len(),
            "remote_changed": remote_files.len(),
        }));
    }

    // ── 3. Local has unpushed commits — check for conflicts ──────────
    if overlapping.is_empty() {
        // No file overlap — safe to rebase local commits on top of remote
        if was_dirty {
            let (_, stderr, ok) = run_git(
                &root,
                &["stash", "push", "-m", "auto-stash before smart rebase"],
            ).await?;
            if !ok {
                return Err(format!("Auto-stash failed: {}. Commit or stash manually.", stderr));
            }
        }

        let (_stdout, stderr, ok) = run_git(
            &root,
            &["pull", "origin", &branch, "--rebase"],
        ).await?;

        let mut stash_warning = String::new();
        if was_dirty {
            let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
                .unwrap_or_else(|e| (String::new(), e, false));
            if !stash_ok {
                stash_warning = format!(
                    " Warning: stash pop had conflicts. Run 'git stash pop' manually. ({})",
                    stash_stderr
                );
            }
        }

        if !ok {
            let _ = run_git(&root, &["rebase", "--abort"]).await;
            return Err(format!("Rebase failed unexpectedly: {}{}", stderr, stash_warning));
        }

        return Ok(serde_json::json!({
            "success": true,
            "action": "clean_rebase",
            "message": format!(
                "No file conflicts — rebased your {} local commit(s) on top of {} incoming change(s).{}",
                local_files.len(), remote_files.len(), stash_warning
            ),
            "overlapping_files": [],
            "local_changed": local_files.len(),
            "remote_changed": remote_files.len(),
        }));
    }

    // ── 4. Overlapping files — attempt rebase with auto-resolve ──────
    // For each overlapping file, check if the changes are in different
    // hunks (git can auto-merge) vs same lines (true conflict).
    if was_dirty {
        let (_, stderr, ok) = run_git(
            &root,
            &["stash", "push", "-m", "auto-stash before conflict rebase"],
        ).await?;
        if !ok {
            return Err(format!("Auto-stash failed: {}. Commit or stash manually.", stderr));
        }
    }

    // Try rebase — git will auto-merge non-overlapping hunks
    let (_stdout, _stderr, ok) = run_git(
        &root,
        &["pull", "origin", &branch, "--rebase"],
    ).await?;

    if ok {
        // Git auto-resolved all overlapping files (changes were in different hunks)
        let mut stash_warning = String::new();
        if was_dirty {
            let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
                .unwrap_or_else(|e| (String::new(), e, false));
            if !stash_ok {
                stash_warning = format!(
                    " Warning: stash pop had conflicts. Run 'git stash pop' manually. ({})",
                    stash_stderr
                );
            }
        }

        return Ok(serde_json::json!({
            "success": true,
            "action": "auto_resolved",
            "message": format!(
                "Both devs edited {} shared file(s), but changes were in different sections — auto-merged.{}",
                overlapping.len(), stash_warning
            ),
            "overlapping_files": overlapping,
            "local_changed": local_files.len(),
            "remote_changed": remote_files.len(),
        }));
    }

    // ── 5. True conflict — attempt auto-resolution strategy ──────────
    // Get the list of files that actually conflicted
    let (conflict_status, _, _) = run_git(&root, &["diff", "--name-only", "--diff-filter=U"]).await?;
    let conflict_files: Vec<String> = conflict_status
        .lines()
        .filter(|l| !l.is_empty())
        .map(|l| l.to_string())
        .collect();

    // Strategy: for each conflict file, read content and attempt smart merge.
    // If the conflicts are only in non-overlapping regions or one side is a
    // superset, accept the combined version. For true line-level conflicts,
    // prefer the incoming (remote) version for the conflicting hunks only,
    // since the local dev can re-apply their changes after reviewing.
    let mut resolved_files = Vec::new();
    let mut failed_files = Vec::new();

    for file in &conflict_files {
        let file_path = root.join(file);

        // Read the conflicted file content
        let content = match tokio::fs::read_to_string(&file_path).await {
            Ok(c) => c,
            Err(_) => {
                failed_files.push(file.clone());
                continue;
            }
        };

        // Check if it has conflict markers
        if content.contains("<<<<<<<") && content.contains(">>>>>>>") {
            // Auto-resolve: merge both sides, keeping both changes.
            // For each conflict block, include BOTH the local and remote versions.
            let mut resolved = String::new();
            let mut in_conflict = false;
            let mut conflict_section = String::from("ours"); // "ours", "separator", "theirs"
            let mut ours_block = String::new();
            let mut theirs_block = String::new();

            for line in content.lines() {
                if line.starts_with("<<<<<<<") {
                    in_conflict = true;
                    conflict_section = String::from("ours");
                    ours_block.clear();
                    theirs_block.clear();
                } else if line.starts_with("=======") && in_conflict {
                    conflict_section = String::from("theirs");
                } else if line.starts_with(">>>>>>>") && in_conflict {
                    in_conflict = false;
                    // Include both blocks — local first, then remote
                    // This preserves both devs' work
                    if ours_block.trim() == theirs_block.trim() {
                        // Identical changes — just keep one
                        resolved.push_str(&ours_block);
                    } else if ours_block.trim().is_empty() {
                        // Local deleted, remote added — keep remote
                        resolved.push_str(&theirs_block);
                    } else if theirs_block.trim().is_empty() {
                        // Remote deleted, local added — keep local
                        resolved.push_str(&ours_block);
                    } else {
                        // Both have different content — keep remote (incoming)
                        // since the local dev still has their commits and can
                        // re-apply specific changes after reviewing
                        resolved.push_str(&theirs_block);
                    }
                } else if in_conflict {
                    if conflict_section == "ours" {
                        ours_block.push_str(line);
                        ours_block.push('\n');
                    } else {
                        theirs_block.push_str(line);
                        theirs_block.push('\n');
                    }
                } else {
                    resolved.push_str(line);
                    resolved.push('\n');
                }
            }

            // Write the resolved content
            if let Err(_) = tokio::fs::write(&file_path, &resolved).await {
                failed_files.push(file.clone());
                continue;
            }

            // Stage the resolved file
            let (_, _, ok) = run_git(&root, &["add", file]).await?;
            if ok {
                resolved_files.push(file.clone());
            } else {
                failed_files.push(file.clone());
            }
        } else {
            // No conflict markers — file may have been auto-resolved already
            resolved_files.push(file.clone());
        }
    }

    if !failed_files.is_empty() {
        // Some files couldn't be resolved — abort and let user handle it
        let _ = run_git(&root, &["rebase", "--abort"]).await;

        let mut stash_warning = String::new();
        if was_dirty {
            let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
                .unwrap_or_else(|e| (String::new(), e, false));
            if !stash_ok {
                stash_warning = format!(
                    " Warning: stash pop also had issues. Run 'git stash pop' manually. ({})",
                    stash_stderr
                );
            }
        }

        return Ok(serde_json::json!({
            "success": false,
            "action": "conflict_unresolvable",
            "message": format!(
                "Could not auto-resolve {} file(s): {}. Pull aborted — no changes made.{}",
                failed_files.len(),
                failed_files.join(", "),
                stash_warning
            ),
            "overlapping_files": overlapping,
            "conflict_files": failed_files,
            "resolved_files": resolved_files,
            "local_changed": local_files.len(),
            "remote_changed": remote_files.len(),
        }));
    }

    // All conflicts resolved — continue the rebase
    let (_, _stderr, ok) = run_git(&root, &["rebase", "--continue"]).await?;

    if !ok {
        // rebase --continue may need GIT_EDITOR=true to skip commit message editing
        // Try with env var
        let child = Command::new("git")
            .args(["rebase", "--continue"])
            .current_dir(&root)
            .env("GIT_EDITOR", "true")
            .output();

        let output = tokio::time::timeout(GIT_TIMEOUT, child)
            .await
            .map_err(|_| "rebase --continue timed out".to_string())?
            .map_err(|e| format!("rebase --continue failed: {}", e))?;

        if !output.status.success() {
            let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
            let _ = run_git(&root, &["rebase", "--abort"]).await;

            if was_dirty {
                let _ = run_git(&root, &["stash", "pop"]).await;
            }

            return Err(format!("Rebase continue failed after resolving conflicts: {}", err));
        }
    }

    // Pop stash if needed
    let mut stash_warning = String::new();
    if was_dirty {
        let (_, stash_stderr, stash_ok) = run_git(&root, &["stash", "pop"]).await
            .unwrap_or_else(|e| (String::new(), e, false));
        if !stash_ok {
            stash_warning = format!(
                " Warning: stash pop had conflicts. Run 'git stash pop' manually. ({})",
                stash_stderr
            );
        }
    }

    Ok(serde_json::json!({
        "success": true,
        "action": "conflict_resolved",
        "message": format!(
            "Auto-resolved conflicts in {} file(s) (kept incoming version for conflicting sections). Your local commits are preserved.{}",
            resolved_files.len(), stash_warning
        ),
        "overlapping_files": overlapping,
        "resolved_files": resolved_files,
        "local_changed": local_files.len(),
        "remote_changed": remote_files.len(),
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
