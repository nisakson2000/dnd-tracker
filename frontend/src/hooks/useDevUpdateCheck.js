import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 60_000; // 60 seconds

export function useDevUpdateCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const mountedRef = useRef(true);
  const hasNotifiedRef = useRef(false);

  const checkForUpdates = useCallback(async () => {
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
        setUpdateInfo(null);
        hasNotifiedRef.current = false;
      }
    } catch {
      // Silently fail — git might not be available or no remote
    }
  }, []);

  const pullUpdates = useCallback(async () => {
    setPulling(true);
    try {
      await invoke('pull_git_updates');
      toast.success('Update pulled! Reloading...', { duration: 2000 });
      // Give toast time to show, then reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error(`Pull failed: ${err}`, { duration: 5000 });
      setPulling(false);
    }
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    mountedRef.current = true;
    // Check immediately on mount
    checkForUpdates();
    // Poll every 60s
    const interval = setInterval(checkForUpdates, POLL_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [checkForUpdates]);

  return { hasUpdate, updateInfo, pulling, pullUpdates, checkForUpdates };
}
