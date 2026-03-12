import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import toast from 'react-hot-toast';
import { isEnabled } from '../dev/featureFlags';

const GIT_POLL_INTERVAL = 15_000; // 15 seconds for git polling
const PEER_POLL_INTERVAL = 3_000; // 3 seconds for peer list refresh
const ROLLBACK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function useDevUpdateCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [peers, setPeers] = useState([]);
  const [diffPreview, setDiffPreview] = useState(null);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [canRollback, setCanRollback] = useState(false);
  const mountedRef = useRef(true);
  const hasNotifiedRef = useRef(false);
  const presenceStartedRef = useRef(false);
  const checkingRef = useRef(false); // prevent concurrent git checks

  // Check rollback eligibility on mount
  useEffect(() => {
    const pullTimestamp = localStorage.getItem('dev-last-pull-timestamp');
    if (pullTimestamp) {
      const elapsed = Date.now() - parseInt(pullTimestamp, 10);
      if (elapsed < ROLLBACK_WINDOW_MS) {
        setCanRollback(true);
        const remaining = ROLLBACK_WINDOW_MS - elapsed;
        const timer = setTimeout(() => {
          setCanRollback(false);
          localStorage.removeItem('dev-last-pull-timestamp');
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        localStorage.removeItem('dev-last-pull-timestamp');
      }
    }
  }, []);

  const fetchDiffPreview = useCallback(async () => {
    try {
      const preview = await invoke('dev_preview_incoming');
      if (mountedRef.current) {
        setDiffPreview(preview);
      }
      return preview;
    } catch {
      // ignore — preview is best-effort
      return null;
    }
  }, []);

  const fetchConflictInfo = useCallback(async () => {
    try {
      const info = await invoke('dev_check_conflicts');
      if (mountedRef.current) {
        setConflictInfo(info);
      }
    } catch {
      // ignore
    }
  }, []);

  const checkForUpdates = useCallback(async () => {
    // Skip if already checking (git lock)
    if (checkingRef.current) return;
    checkingRef.current = true;
    try {
      const result = await invoke('check_git_updates');
      if (!mountedRef.current) return;
      if (result.has_update) {
        setHasUpdate(true);
        setUpdateInfo(result);

        // Fetch diff preview and conflict info sequentially (both acquire git lock)
        await fetchDiffPreview();
        await fetchConflictInfo();

        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          toast(
            `New commit pushed: "${result.commit_message || result.remote_sha}"`,
            {
              icon: '\uD83D\uDD04',
              duration: 8000,
              style: {
                background: '#1a1520',
                color: '#fde68a',
                border: '1px solid rgba(201,168,76,0.4)',
              },
            }
          );
        }
      } else {
        setHasUpdate(false);
        setUpdateInfo(result); // keep info (local_ahead, has_local_changes) even when no update
        setDiffPreview(null);
        setConflictInfo(null);
        hasNotifiedRef.current = false;
      }
    } catch {
      // Silently fail — git might not be available or no remote
    } finally {
      checkingRef.current = false;
    }
  }, [fetchDiffPreview, fetchConflictInfo]);

  const pullUpdates = useCallback(async () => {
    setPulling(true);

    // Capture current diff preview before pulling (to check for .rs changes after)
    let previewBeforePull = diffPreview;
    if (!previewBeforePull) {
      try {
        previewBeforePull = await invoke('dev_preview_incoming');
      } catch {
        // ignore
      }
    }

    try {
      const result = await invoke('pull_git_updates');

      // Pull succeeded — record timestamp for rollback window
      localStorage.setItem('dev-last-pull-timestamp', String(Date.now()));

      // Clear the update banner
      setHasUpdate(false);
      setUpdateInfo(null);
      setDiffPreview(null);
      setConflictInfo(null);
      hasNotifiedRef.current = false;
      setPulling(false);

      // Broadcast to other devs that new code was pulled (they should check too)
      try {
        await invoke('broadcast_dev_update', { commitMessage: updateInfo?.commit_message || null });
      } catch { /* ignore if presence not running */ }

      // Build success message
      let message = 'Update pulled successfully!';
      if (result.stash_warning) {
        message += ` ${result.stash_warning}`;
      }

      // Check if Rust files changed — need tauri dev restart
      const hasRustChanges = previewBeforePull?.has_rust_changes || false;
      if (hasRustChanges) {
        message += ' Rust files changed \u2014 restart `tauri dev` needed.';
      }

      // Store result in localStorage so notification survives the reload
      localStorage.setItem('dev-update-result', JSON.stringify({
        success: true,
        message,
        hasRustChanges,
      }));

      if (hasRustChanges) {
        // Don't auto-reload if Rust files changed — user needs to restart tauri dev
        toast.success(message, {
          duration: 12000,
          style: {
            background: '#064e3b',
            color: '#a7f3d0',
            border: '1px solid rgba(52,211,153,0.4)',
            fontWeight: 600,
          },
        });
      } else {
        // HMR reload for frontend-only changes
        window.location.reload();
      }
    } catch (err) {
      // Pull failed — keep the banner showing so they can retry
      setPulling(false);
      toast.error(`Update failed: ${err}`, {
        duration: 8000,
        style: {
          background: '#450a0a',
          color: '#fca5a5',
          border: '1px solid rgba(239,68,68,0.4)',
          fontWeight: 600,
        },
      });
    }
  }, [updateInfo, diffPreview]);

  const rollbackUpdate = useCallback(async () => {
    try {
      await invoke('dev_rollback_update');
      localStorage.removeItem('dev-last-pull-timestamp');
      setCanRollback(false);
      localStorage.setItem('dev-update-result', JSON.stringify({
        success: true,
        message: 'Rollback successful! Reverted to previous commit.',
      }));
      window.location.reload();
    } catch (err) {
      toast.error(`Rollback failed: ${err}`, {
        duration: 8000,
        style: {
          background: '#450a0a',
          color: '#fca5a5',
          border: '1px solid rgba(239,68,68,0.4)',
          fontWeight: 600,
        },
      });
    }
  }, []);

  // Show post-reload notification if we just pulled an update
  useEffect(() => {
    const stored = localStorage.getItem('dev-update-result');
    if (stored) {
      localStorage.removeItem('dev-update-result');
      try {
        const result = JSON.parse(stored);
        if (result.success) {
          toast.success(result.message, {
            duration: result.hasRustChanges ? 12000 : 4000,
            style: {
              background: '#064e3b',
              color: '#a7f3d0',
              border: '1px solid rgba(52,211,153,0.4)',
              fontWeight: 600,
            },
          });
        } else {
          toast.error(result.message, {
            duration: 8000,
            style: {
              background: '#450a0a',
              color: '#fca5a5',
              border: '1px solid rgba(239,68,68,0.4)',
              fontWeight: 600,
            },
          });
        }
      } catch { /* ignore bad JSON */ }
    }
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    mountedRef.current = true;

    // Start the UDP presence beacon for LAN dev discovery
    const startPresence = async () => {
      if (presenceStartedRef.current) return;
      try {
        await invoke('start_dev_presence');
        presenceStartedRef.current = true;
      } catch (err) {
        console.warn('Dev presence failed to start:', err);
      }
    };
    startPresence();

    // Listen for Tauri event when another dev broadcasts an update_pushed
    // This triggers an IMMEDIATE git check instead of waiting for the 60s poll
    let unlistenUpdate = null;
    listen('dev-update-pushed', (event) => {
      if (!mountedRef.current) return;
      const { dev_name, commit_message } = event.payload;

      // If auto-pull is enabled, pull immediately without user interaction
      if (isEnabled('auto-pull')) {
        toast(
          `Auto-pulling update from ${dev_name || 'a dev'}: "${commit_message || 'new code'}"`,
          {
            icon: '\u2B07\uFE0F',
            duration: 3000,
            style: {
              background: '#1a1520',
              color: '#fde68a',
              border: '1px solid rgba(201,168,76,0.4)',
            },
          }
        );
        // Small delay to let the fetch happen first
        setTimeout(() => {
          checkForUpdates().then(() => {
            pullUpdates();
          });
        }, 1000);
        return;
      }

      toast(
        `${dev_name || 'A dev'} pushed: "${commit_message || 'new code'}"`,
        {
          icon: '\uD83D\uDCE1',
          duration: 5000,
          style: {
            background: '#1a1520',
            color: '#fde68a',
            border: '1px solid rgba(201,168,76,0.4)',
          },
        }
      );
      // Immediately check for updates instead of waiting for the poll
      checkForUpdates();
    }).then(fn => { unlistenUpdate = fn; });

    // Poll for peers
    let lastPeerCount = 0;
    const peerInterval = setInterval(async () => {
      if (!mountedRef.current) return;
      try {
        const peerList = await invoke('get_dev_peers');
        setPeers(peerList);

        // Notify when a new dev comes online
        if (peerList.length > lastPeerCount && lastPeerCount > 0) {
          const newest = peerList[peerList.length - 1];
          toast(`${newest?.name || 'A dev'} came online (v${newest?.version || '?'})`, {
            icon: '\uD83D\uDFE2',
            duration: 3000,
            style: { background: '#1a1520', color: '#a5f3fc', border: '1px solid rgba(34,211,238,0.3)' },
          });
        }
        lastPeerCount = peerList.length;
      } catch { /* ignore */ }
    }, PEER_POLL_INTERVAL);

    // Git update check on mount + interval
    checkForUpdates();
    const gitInterval = setInterval(checkForUpdates, GIT_POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(peerInterval);
      clearInterval(gitInterval);
      if (unlistenUpdate) unlistenUpdate();
    };
  }, [checkForUpdates, pullUpdates]);

  const setActiveSection = useCallback(async (section) => {
    try {
      await invoke('dev_set_active_section', { section: section || null });
    } catch { /* ignore */ }
  }, []);

  return {
    hasUpdate,
    updateInfo,
    pulling,
    pullUpdates,
    checkForUpdates,
    peers,
    diffPreview,
    conflictInfo,
    canRollback,
    rollbackUpdate,
    setActiveSection,
  };
}
