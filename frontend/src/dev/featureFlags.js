// Feature flags — dev-only toggles stored in localStorage
const STORAGE_KEY = 'dev-feature-flags';

const FLAG_DEFINITIONS = [
  { id: 'dev-tools-panel', label: 'Dev Tools Panel (Ctrl+Shift+D)', default: true },
  { id: 'ipc-logger', label: 'IPC Call Logger', default: true },
  { id: 'perf-overlay', label: 'Performance Overlay', default: false },
  { id: 'hot-reload-indicator', label: 'Hot Reload Indicator', default: true },
  { id: 'env-sync-check', label: 'Startup Environment Check', default: true },
  { id: 'test-char-button', label: 'Test Character Button on Dashboard', default: true },
];

function getFlags() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

export function isEnabled(flagId) {
  if (!import.meta.env.DEV) return false;
  const flags = getFlags();
  if (flagId in flags) return flags[flagId];
  const def = FLAG_DEFINITIONS.find(f => f.id === flagId);
  return def ? def.default : false;
}

export function setFlag(flagId, enabled) {
  const flags = getFlags();
  flags[flagId] = enabled;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
}

export function getAllFlags() {
  const flags = getFlags();
  return FLAG_DEFINITIONS.map(def => ({
    ...def,
    enabled: flagId => {
      if (def.id in flags) return flags[def.id];
      return def.default;
    },
    value: def.id in flags ? flags[def.id] : def.default,
  }));
}

export { FLAG_DEFINITIONS };
