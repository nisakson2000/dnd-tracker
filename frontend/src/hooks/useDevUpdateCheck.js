import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import toast from 'react-hot-toast';
const GIT_POLL_INTERVAL = 5_000; // 5 seconds for git polling
const PEER_POLL_INTERVAL = 3_000; // 3 seconds for peer list refresh
const ROLLBACK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const AUTO_PULL_DELAY = 2_000; // 2s delay before auto-pulling (let fetch settle)

export function useDevUpdateCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [peers, setPeers] = useState([]);
  const [diffPreview, setDiffPreview] = useState(null);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [canRollback, setCanRollback] = useState(false);
  const mountedRef = useRef(true);
  const presenceStartedRef = useRef(false);
  const checkingRef = useRef(false); // prevent concurrent git checks
  const autoPullingRef = useRef(false); // prevent concurrent auto-pulls
  const pullUpdatesRef = useRef(null); // stable ref to latest pullUpdates

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

  const checkForUpdates = useCallback(async () => {
    // Skip if already checking (git lock) or already auto-pulling
    if (checkingRef.current || autoPullingRef.current) return;
    checkingRef.current = true;
    try {
      const result = await invoke('check_git_updates');
      if (!mountedRef.current) return;
      if (result.has_update) {
        setHasUpdate(true);
        setUpdateInfo(result);

        // Show toast and auto-pull
        toast(
          `Auto-pulling update: "${result.commit_message || result.remote_sha}"`,
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

        // Auto-pull after a short delay
        if (!autoPullingRef.current) {
          autoPullingRef.current = true;
          setTimeout(() => {
            pullUpdatesRef.current();
          }, AUTO_PULL_DELAY);
        }
      } else {
        setHasUpdate(false);
        setUpdateInfo(result);
        setDiffPreview(null);
        setConflictInfo(null);
      }
    } catch (err) {
      console.warn('[dev-sync] git check failed:', err);
    } finally {
      checkingRef.current = false;
    }
  }, []);

  const pullUpdates = useCallback(async () => {
    setPulling(true);

    try {
      const result = await invoke('pull_git_updates');

      // Pull succeeded — record timestamp for rollback window
      localStorage.setItem('dev-last-pull-timestamp', String(Date.now()));

      // Build success message
      let message = 'Update pulled successfully!';
      if (result.stash_warning) {
        message += ` ${result.stash_warning}`;
      }

      // Store result in localStorage so notification survives the reload
      localStorage.setItem('dev-update-result', JSON.stringify({
        success: true,
        message,
      }));

      // Always reload — tauri dev auto-recompiles Rust changes
      window.location.reload();
    } catch (err) {
      setPulling(false);
      autoPullingRef.current = false;
      toast.error(`Auto-pull failed: ${err}`, {
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

  // Keep ref in sync so setTimeout callback always uses latest pullUpdates
  pullUpdatesRef.current = pullUpdates;

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
    // Triggers an immediate git check + auto-pull
    let unlistenUpdate = null;
    listen('dev-update-pushed', (event) => {
      if (!mountedRef.current) return;
      const { dev_name, commit_message } = event.payload;

      toast(
        `${dev_name || 'A dev'} pushed: "${commit_message || 'new code'}" — auto-pulling...`,
        {
          icon: '\uD83D\uDCE1',
          duration: 3000,
          style: {
            background: '#1a1520',
            color: '#fde68a',
            border: '1px solid rgba(201,168,76,0.4)',
          },
        }
      );
      // Immediately check — auto-pull happens inside checkForUpdates
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
  }, [checkForUpdates]);

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
