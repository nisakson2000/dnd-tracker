// IPC interception layer — wraps invoke() to log all calls with timing
const MAX_LOG_ENTRIES = 500;

export const ipcLog = [];
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => fn(ipcLog));
}

let originalInvoke = null;

export function installIpcInterceptor() {
  // Dynamically import and monkey-patch
  import('@tauri-apps/api/core').then(mod => {
    originalInvoke = mod.invoke;
  });
}

export async function devInvoke(command, args) {
  const entry = {
    id: Date.now() + Math.random(),
    command,
    args: args ? { ...args } : {},
    startTime: performance.now(),
    endTime: null,
    duration: null,
    response: null,
    error: null,
    status: 'pending',
  };

  if (ipcLog.length >= MAX_LOG_ENTRIES) ipcLog.shift();
  ipcLog.push(entry);
  notify();

  const { invoke } = await import('@tauri-apps/api/core');
  try {
    const result = await invoke(command, args);
    entry.endTime = performance.now();
    entry.duration = entry.endTime - entry.startTime;
    entry.response = result;
    entry.status = 'success';
    notify();
    return result;
  } catch (err) {
    entry.endTime = performance.now();
    entry.duration = entry.endTime - entry.startTime;
    entry.error = String(err);
    entry.status = 'error';
    notify();
    throw err;
  }
}

// Get recent entries
export function getIpcLog() {
  return ipcLog;
}

// Get stats
export function getIpcStats() {
  const recent = ipcLog.filter(e => e.status !== 'pending');
  if (recent.length === 0) return { avg: 0, p95: 0, max: 0, total: 0 };

  const durations = recent.map(e => e.duration).sort((a, b) => a - b);
  return {
    avg: durations.reduce((a, b) => a + b, 0) / durations.length,
    p95: durations[Math.floor(durations.length * 0.95)] || 0,
    max: durations[durations.length - 1] || 0,
    total: recent.length,
  };
}
