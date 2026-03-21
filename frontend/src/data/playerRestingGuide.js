/**
 * playerRestingGuide.js
 * Player Mode: When and how to rest, rest variants, and safe resting
 * Pure JS — no React dependencies.
 */

export const REST_DECISION_GUIDE = [
  { condition: 'Party HP below 40%', recommendation: 'Short Rest if possible', reason: 'Hit dice can bring everyone to fighting shape.' },
  { condition: 'Warlock or Monk out of resources', recommendation: 'Short Rest (priority!)', reason: 'Their entire power budget recharges on short rests.' },
  { condition: 'All spell slots depleted', recommendation: 'Long Rest needed', reason: 'Casters without slots are cantrip-only. Significant power loss.' },
  { condition: 'Exhaustion levels', recommendation: 'Long Rest ASAP', reason: 'Only way to reduce exhaustion. 1 level per long rest.' },
  { condition: 'Time pressure / deadline', recommendation: 'Push forward', reason: 'Sometimes you can\'t rest. Manage resources carefully.' },
  { condition: 'Unknown territory ahead', recommendation: 'Rest if safe', reason: 'Better to face the unknown at full strength.' },
  { condition: 'Just cleared a major fight', recommendation: 'Short Rest minimum', reason: 'Recovery before the next encounter is almost always worth 1 hour.' },
  { condition: 'Between sessions', recommendation: 'Long Rest (narrative)', reason: 'Most DMs allow a long rest between sessions.' },
];

export const SAFE_REST_METHODS = [
  { method: 'Leomund\'s Tiny Hut (3rd, ritual)', safety: 'Excellent', detail: '10ft dome, impenetrable, opaque from outside. 8 hours. THE gold standard for safe rests.' },
  { method: 'Alarm (1st, ritual)', safety: 'Good', detail: 'Ward a 20ft area. Mental or audible alert when entered. Set at every entrance.' },
  { method: 'Guard Rotation', safety: 'Basic', detail: 'Party members take turns watching. 2-hour shifts. Everyone still gets 6 hours sleep.' },
  { method: 'Rope Trick (2nd)', safety: 'Great for short rest', detail: 'Extradimensional space for 1 hour. Perfect for short rests. Not long enough for long rest.' },
  { method: 'Magnificent Mansion (7th)', safety: 'Perfect', detail: '24 hours of safe rest in a pocket dimension. Servants, food, beds. Luxury.' },
  { method: 'Secure room + barricade', safety: 'Moderate', detail: 'Lock/bar doors, set traps. Better than nothing in a dungeon.' },
  { method: 'Animal companions on watch', safety: 'Decent', detail: 'Familiars, animal companions can watch and alert you.' },
];

export const REST_VARIANTS = {
  grittyRealism: {
    short: '8 hours (a full night)',
    long: '7 days (a full week)',
    effect: 'Dramatically reduces number of encounters per rest. More resource management.',
    note: 'Common in low-magic or survival campaigns.',
  },
  epicHeroism: {
    short: '5 minutes',
    long: '1 hour',
    effect: 'Essentially recover everything between encounters. Less resource management.',
    note: 'Good for action-movie style campaigns.',
  },
  standard: {
    short: '1 hour',
    long: '8 hours',
    effect: 'Default 5e rules. Balanced resource management.',
    note: 'What most tables use.',
  },
};

export function suggestRest(partyState) {
  const { hpPercent, spellSlotsRemaining, totalSlots, hasExhaustion, timeAvailable } = partyState || {};
  if (hasExhaustion) return { type: 'Long Rest', reason: 'Exhaustion can only be reduced by long rests.' };
  if (spellSlotsRemaining === 0 && totalSlots > 0) return { type: 'Long Rest', reason: 'No spell slots remaining.' };
  if (hpPercent < 40) return { type: 'Short Rest', reason: 'HP is dangerously low. Spend hit dice.' };
  if (timeAvailable === 'none') return { type: 'None', reason: 'No time to rest. Push forward carefully.' };
  return { type: 'Optional', reason: 'Party is in decent shape. Rest if convenient.' };
}
