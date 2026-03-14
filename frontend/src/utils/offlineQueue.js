// Offline action queue - stores pending actions in localStorage when disconnected
const QUEUE_KEY = 'codex-offline-queue';

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch { return []; }
}

export function enqueue(action) {
  // action = { type: 'event'|'targeted_event', event: string, data: object, targets?: string[], timestamp: Date.now() }
  const queue = getQueue();
  queue.push({ ...action, timestamp: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function dequeue() {
  const queue = getQueue();
  const action = queue.shift();
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return action;
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function getQueueLength() {
  return getQueue().length;
}

// Replay all queued actions through the provided send function
export async function replayQueue(sendFn) {
  const queue = getQueue();
  if (queue.length === 0) return 0;

  let replayed = 0;
  for (const action of queue) {
    try {
      await sendFn(action);
      replayed++;
    } catch (e) {
      console.warn('Failed to replay queued action:', e);
    }
  }
  clearQueue();
  return replayed;
}
