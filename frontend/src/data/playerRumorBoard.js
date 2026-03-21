/**
 * playerRumorBoard.js
 * Player Mode Improvements 187: Rumor board (rumors heard, unverified info)
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// RUMOR STATES
// ---------------------------------------------------------------------------

export const RUMOR_STATES = {
  unverified: { label: 'Unverified', color: '#94a3b8', icon: 'help-circle' },
  investigating: { label: 'Investigating', color: '#fbbf24', icon: 'search' },
  confirmed: { label: 'Confirmed', color: '#4ade80', icon: 'check-circle' },
  false_rumor: { label: 'False', color: '#ef4444', icon: 'x-circle' },
  partial: { label: 'Partially True', color: '#f97316', icon: 'alert-circle' },
};

// ---------------------------------------------------------------------------
// RUMOR TEMPLATE
// ---------------------------------------------------------------------------

export const RUMOR_TEMPLATE = {
  id: '',
  text: '',
  source: '',          // Who told you
  location: '',        // Where you heard it
  status: 'unverified',
  relatedQuest: null,
  relatedNpc: null,
  session: null,
  timestamp: null,
  notes: '',
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a new rumor entry.
 */
export function createRumor(text, source = '', location = '') {
  return {
    ...RUMOR_TEMPLATE,
    id: `rumor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    source,
    location,
    timestamp: Date.now(),
  };
}

/**
 * Get rumor state info.
 */
export function getRumorStateInfo(status) {
  return RUMOR_STATES[status] || RUMOR_STATES.unverified;
}

/**
 * Filter rumors by status.
 */
export function filterRumors(rumors, status) {
  if (!status || status === 'all') return rumors;
  return rumors.filter(r => r.status === status);
}

/**
 * Search rumors.
 */
export function searchRumors(rumors, query) {
  if (!query || !query.trim()) return rumors;
  const q = query.toLowerCase().trim();
  return rumors.filter(r =>
    (r.text || '').toLowerCase().includes(q) ||
    (r.source || '').toLowerCase().includes(q) ||
    (r.notes || '').toLowerCase().includes(q)
  );
}
