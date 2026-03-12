import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import toast from 'react-hot-toast';

const GIT_POLL_INTERVAL = 60_000; // 60 seconds for git polling
const PEER_POLL_INTERVAL = 3_000; // 3 seconds for peer list refresh

export function useDevUpdateCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [peers, setPeers] = useState([]);
  const mountedRef = useRef(true);
  const hasNotifiedRef = useRef(false);
  const presenceStartedRef = useRef(false);
  const checkingRef = useRef(false); // prevent concurrent git checks

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
        hasNotifiedRef.current = false;
      }
    } catch {
      // Silently fail — git might not be available or no remote
    } finally {
      checkingRef.current = false;
    }
  }, []);

  const pullUpdates = useCallback(async () => {
    setPulling(true);
    try {
      const result = await invoke('pull_git_updates');

      // Pull succeeded — clear the update banner
      setHasUpdate(false);
      setUpdateInfo(null);
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

      // Store result in localStorage so notification survives the reload
      localStorage.setItem('dev-update-result', JSON.stringify({ success: true, message }));
      window.location.reload();
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
  }, [updateInfo]);

  // Show post-reload notification if we just pulled an update
  useEffect(() => {
    const stored = localStorage.getItem('dev-update-result');
    if (stored) {
      localStorage.removeItem('dev-update-result');
      try {
        const result = JSON.parse(stored);
        if (result.success) {
          toast.success(result.message, {
            duration: 4000,
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
  }, [checkForUpdates]);

  return { hasUpdate, updateInfo, pulling, pullUpdates, checkForUpdates, peers };
}
