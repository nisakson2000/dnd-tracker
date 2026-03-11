import { useState, useEffect } from 'react';
import { APP_VERSION } from '../version';

const GITHUB_VERSION_URL =
  'https://raw.githubusercontent.com/nisakson2000/dnd-tracker/main/frontend/src/version.js';

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

export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const res = await fetch(GITHUB_VERSION_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const text = await res.text();
      const match = text.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
      if (match) {
        const remoteVer = match[1];
        setLatestVersion(remoteVer);
        const remote = parseVersion(remoteVer);
        const local = parseVersion(APP_VERSION);
        setUpdateAvailable(isNewer(remote, local));
      }
      setLastChecked(new Date());
    } catch {
      // Silently fail — no internet or repo unreachable
    } finally {
      setChecking(false);
    }
  };

  // Check on mount, then every 30 minutes
  useEffect(() => {
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { updateAvailable, latestVersion, checking, lastChecked, checkForUpdates, currentVersion: APP_VERSION };
}
