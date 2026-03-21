/**
 * playerSpellSlotTracker.js
 * Player Mode: Spell slot tracking, Warlock pact slots, and slot recovery
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SPELL SLOTS BY CLASS LEVEL (FULL CASTERS)
// ---------------------------------------------------------------------------

export const FULL_CASTER_SLOTS = [
  { level: 1,  slots: [2,0,0,0,0,0,0,0,0] },
  { level: 2,  slots: [3,0,0,0,0,0,0,0,0] },
  { level: 3,  slots: [4,2,0,0,0,0,0,0,0] },
  { level: 4,  slots: [4,3,0,0,0,0,0,0,0] },
  { level: 5,  slots: [4,3,2,0,0,0,0,0,0] },
  { level: 6,  slots: [4,3,3,0,0,0,0,0,0] },
  { level: 7,  slots: [4,3,3,1,0,0,0,0,0] },
  { level: 8,  slots: [4,3,3,2,0,0,0,0,0] },
  { level: 9,  slots: [4,3,3,3,1,0,0,0,0] },
  { level: 10, slots: [4,3,3,3,2,0,0,0,0] },
  { level: 11, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 12, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 13, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 14, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 15, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 16, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 17, slots: [4,3,3,3,2,1,1,1,1] },
  { level: 18, slots: [4,3,3,3,3,1,1,1,1] },
  { level: 19, slots: [4,3,3,3,3,2,1,1,1] },
  { level: 20, slots: [4,3,3,3,3,2,2,1,1] },
];

// ---------------------------------------------------------------------------
// WARLOCK PACT MAGIC
// ---------------------------------------------------------------------------

export const WARLOCK_PACT_SLOTS = [
  { level: 1, slots: 1, slotLevel: 1 },
  { level: 2, slots: 2, slotLevel: 1 },
  { level: 3, slots: 2, slotLevel: 2 },
  { level: 4, slots: 2, slotLevel: 2 },
  { level: 5, slots: 2, slotLevel: 3 },
  { level: 6, slots: 2, slotLevel: 3 },
  { level: 7, slots: 2, slotLevel: 4 },
  { level: 8, slots: 2, slotLevel: 4 },
  { level: 9, slots: 2, slotLevel: 5 },
  { level: 10, slots: 2, slotLevel: 5 },
  { level: 11, slots: 3, slotLevel: 5 },
  { level: 12, slots: 3, slotLevel: 5 },
  { level: 13, slots: 3, slotLevel: 5 },
  { level: 14, slots: 3, slotLevel: 5 },
  { level: 15, slots: 3, slotLevel: 5 },
  { level: 16, slots: 3, slotLevel: 5 },
  { level: 17, slots: 4, slotLevel: 5 },
  { level: 18, slots: 4, slotLevel: 5 },
  { level: 19, slots: 4, slotLevel: 5 },
  { level: 20, slots: 4, slotLevel: 5 },
];

// ---------------------------------------------------------------------------
// SLOT TRACKER TEMPLATE
// ---------------------------------------------------------------------------

export const SLOT_TRACKER_TEMPLATE = {
  maxSlots: [0,0,0,0,0,0,0,0,0],
  usedSlots: [0,0,0,0,0,0,0,0,0],
  pactSlots: { max: 0, used: 0, level: 0 },
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

export function getSpellSlots(classLevel, isWarlock = false) {
  if (isWarlock) {
    const pact = WARLOCK_PACT_SLOTS.find(w => w.level === classLevel);
    return pact || WARLOCK_PACT_SLOTS[0];
  }
  const entry = FULL_CASTER_SLOTS.find(e => e.level === classLevel);
  return entry ? entry.slots : [0,0,0,0,0,0,0,0,0];
}

export function useSlot(tracker, spellLevel) {
  const idx = spellLevel - 1;
  if (idx < 0 || idx >= 9) return tracker;
  if (tracker.usedSlots[idx] >= tracker.maxSlots[idx]) return tracker;
  const newUsed = [...tracker.usedSlots];
  newUsed[idx]++;
  return { ...tracker, usedSlots: newUsed };
}

export function recoverSlot(tracker, spellLevel) {
  const idx = spellLevel - 1;
  if (idx < 0 || idx >= 9) return tracker;
  if (tracker.usedSlots[idx] <= 0) return tracker;
  const newUsed = [...tracker.usedSlots];
  newUsed[idx]--;
  return { ...tracker, usedSlots: newUsed };
}

export function resetAllSlots(tracker) {
  return { ...tracker, usedSlots: [0,0,0,0,0,0,0,0,0], pactSlots: { ...tracker.pactSlots, used: 0 } };
}

export function getRemainingSlots(tracker, spellLevel) {
  const idx = spellLevel - 1;
  if (idx < 0 || idx >= 9) return 0;
  return Math.max(0, tracker.maxSlots[idx] - tracker.usedSlots[idx]);
}

export function getSlotColor(remaining, max) {
  if (max === 0) return '#4b5563';
  const ratio = remaining / max;
  if (ratio > 0.5) return '#22c55e';
  if (ratio > 0) return '#eab308';
  return '#ef4444';
}
