import { useState, useEffect, useRef, useCallback } from 'react';
import { APP_VERSION, DM_MODE_VERSION } from '../version';

// Same neutral manifest URL as UpdateScreen — no repo name exposed
const VERSION_MANIFEST_URL =
  'https://raw.githubusercontent.com/nisakson2000/dnd-tracker/main/version.json';

const DISMISSED_KEY = 'codex_dismissed_update_version';
const DISMISSED_DM_KEY = 'codex_dismissed_dm_update_version';

function parseVersion(str) {
  const m = str.match(/V?(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function isNewer(remote, local) {
  if (!remote || !local) return false;
  if (remote.major !== local.major) return remote.major > local.major;
  if (remote.minor !== local.minor) return remote.minor > local.minor;
  return remote.patch > local.patch;
}

// checkResult: null | 'up_to_date' | 'update_available' | 'offline'
export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dmUpdateAvailable, setDmUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);
  const [latestDmVersion, setLatestDmVersion] = useState(null);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const mountedRef = useRef(true);

  const checkForUpdates = useCallback(async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const controller = new AbortController();
      const timeoutId = AbortSignal.timeout
        ? null
        : setTimeout(() => controller.abort(), 5000);
      const signal = AbortSignal.timeout ? AbortSignal.timeout(5000) : controller.signal;
      const res = await fetch(VERSION_MANIFEST_URL, {
        cache: 'no-store',
        signal,
      });
      if (timeoutId) clearTimeout(timeoutId);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();

      if (!mountedRef.current) return;

      // App version check
      const remoteVer = data.version || null;
      let hasAppUpdate = false;
      if (remoteVer) {
        setLatestVersion(remoteVer);
        const remote = parseVersion(remoteVer);
        const local = parseVersion(APP_VERSION);
        hasAppUpdate = isNewer(remote, local);
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        const isDismissed = dismissed === remoteVer;
        setUpdateAvailable(hasAppUpdate && !isDismissed);
      }

      // DM version check (independent)
      const remoteDmVer = data.dm_version || null;
      let hasDmUpdate = false;
      if (remoteDmVer) {
        setLatestDmVersion(remoteDmVer);
        const remoteDm = parseVersion(remoteDmVer);
        const localDm = parseVersion(DM_MODE_VERSION);
        hasDmUpdate = isNewer(remoteDm, localDm);
        const dismissedDm = localStorage.getItem(DISMISSED_DM_KEY);
        const isDmDismissed = dismissedDm === remoteDmVer;
        setDmUpdateAvailable(hasDmUpdate && !isDmDismissed);
      }

      const anyUpdate = (hasAppUpdate && localStorage.getItem(DISMISSED_KEY) !== remoteVer)
        || (hasDmUpdate && localStorage.getItem(DISMISSED_DM_KEY) !== remoteDmVer);
      setCheckResult(anyUpdate ? 'update_available' : 'up_to_date');

      if (mountedRef.current) setLastChecked(new Date());
    } catch {
      if (mountedRef.current) setCheckResult('offline');
    } finally {
      if (mountedRef.current) setChecking(false);
    }
  }, []);

  // Dismiss update — persists so the prompt won't loop after install or dismiss
  const dismissUpdate = useCallback((version) => {
    const ver = version || latestVersion;
    if (ver) {
      localStorage.setItem(DISMISSED_KEY, ver);
    }
    setUpdateAvailable(false);
    // Only mark up_to_date if DM update is also not available
    if (!dmUpdateAvailable) {
      setCheckResult('up_to_date');
    }
  }, [latestVersion, dmUpdateAvailable]);

  const dismissDmUpdate = useCallback((version) => {
    const ver = version || latestDmVersion;
    if (ver) {
      localStorage.setItem(DISMISSED_DM_KEY, ver);
    }
    setDmUpdateAvailable(false);
    if (!updateAvailable) {
      setCheckResult('up_to_date');
    }
  }, [latestDmVersion, updateAvailable]);

  // Check once on mount — no auto-polling (user triggers manually or from Updates page)
  useEffect(() => {
    mountedRef.current = true;
    checkForUpdates();
    return () => { mountedRef.current = false; };
  }, [checkForUpdates]);

  return {
    updateAvailable, dmUpdateAvailable,
    latestVersion, latestDmVersion,
    checking, lastChecked,
    checkResult, checkForUpdates,
    dismissUpdate, dismissDmUpdate,
    currentVersion: APP_VERSION,
    currentDmVersion: DM_MODE_VERSION,
  };
}
