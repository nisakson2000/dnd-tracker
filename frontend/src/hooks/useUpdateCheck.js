import { useState, useEffect, useRef, useCallback } from 'react';
import { APP_VERSION } from '../version';

const VERSION_MANIFEST_URL =
  'https://raw.githubusercontent.com/nisakson2000/dnd-tracker/main/version.json';

const DISMISSED_KEY = 'codex_dismissed_update_version';

/** Strip leading V/v and normalize to bare "x.y.z" */
function normalizeVersion(str) {
  return (str || '').replace(/^[Vv]/, '').trim();
}

function parseVersion(str) {
  const m = normalizeVersion(str).match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function isNewer(remote, local) {
  if (!remote || !local) return false;
  if (remote.major !== local.major) return remote.major > local.major;
  if (remote.minor !== local.minor) return remote.minor > local.minor;
  return remote.patch > local.patch;
}

/** Build the GitHub release page URL from a bare version string */
function releaseUrl(version) {
  return `https://github.com/nisakson2000/dnd-tracker/releases/tag/v${normalizeVersion(version)}`;
}

// checkResult: null | 'up_to_date' | 'update_available' | 'offline'
export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);
  const [latestNotes, setLatestNotes] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const mountedRef = useRef(true);

  const checkForUpdates = useCallback(async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      // Cache-bust to defeat GitHub CDN caching (~5 min TTL)
      const url = `${VERSION_MANIFEST_URL}?_=${Date.now()}`;
      const res = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout?.(8000),
      });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();

      if (!mountedRef.current) return;

      const remoteVer = normalizeVersion(data.version);
      let hasAppUpdate = false;
      if (remoteVer) {
        setLatestVersion(remoteVer);
        setLatestNotes(data.notes || '');
        // Build download URL dynamically — no need to hardcode in version.json
        setDownloadUrl(data.download || releaseUrl(remoteVer));

        const remote = parseVersion(remoteVer);
        const local = parseVersion(APP_VERSION);
        hasAppUpdate = isNewer(remote, local);
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        const isDismissed = dismissed === remoteVer;
        setUpdateAvailable(hasAppUpdate && !isDismissed);
      }

      setCheckResult(hasAppUpdate && localStorage.getItem(DISMISSED_KEY) !== remoteVer
        ? 'update_available' : 'up_to_date');

      if (mountedRef.current) setLastChecked(new Date());
    } catch {
      if (mountedRef.current) setCheckResult('offline');
    } finally {
      if (mountedRef.current) setChecking(false);
    }
  }, []);

  // Dismiss update — persists so the prompt won't loop after install or dismiss
  const dismissUpdate = useCallback((version) => {
    const ver = version ? normalizeVersion(version) : latestVersion;
    if (ver) {
      localStorage.setItem(DISMISSED_KEY, ver);
    }
    setUpdateAvailable(false);
    setCheckResult('up_to_date');
  }, [latestVersion]);

  // Check once on mount
  useEffect(() => {
    mountedRef.current = true;
    checkForUpdates();
    return () => { mountedRef.current = false; };
  }, [checkForUpdates]);

  return {
    updateAvailable,
    latestVersion,
    latestNotes,
    downloadUrl,
    checking, lastChecked,
    checkResult, checkForUpdates,
    dismissUpdate,
    currentVersion: APP_VERSION,
  };
}
