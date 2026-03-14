import toast from 'react-hot-toast';

const recentMessages = new Map(); // message -> timestamp
const DEDUP_WINDOW = 3000; // 3 seconds

function isDuplicate(message) {
  const now = Date.now();
  // Clean old entries
  for (const [msg, ts] of recentMessages) {
    if (now - ts > DEDUP_WINDOW) recentMessages.delete(msg);
  }
  if (recentMessages.has(message)) return true;
  recentMessages.set(message, now);
  return false;
}

let lastErrorId = null;

const toastManager = {
  success(message, opts = {}) {
    if (isDuplicate(message)) return;
    toast.success(message, opts);
  },
  error(message, opts = {}) {
    if (isDuplicate(message)) return;
    // Dismiss previous error to prevent stacking
    if (lastErrorId) toast.dismiss(lastErrorId);
    lastErrorId = toast.error(message, opts);
  },
  info(message, opts = {}) {
    if (isDuplicate(message)) return;
    toast(message, opts);
  },
};

export default toastManager;
