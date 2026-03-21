/**
 * playerInspiredLeaderGuide.js
 * Player Mode: Inspiring Leader feat — party-wide temp HP
 * Pure JS — no React dependencies.
 */

export const INSPIRING_LEADER_BASICS = {
  feat: 'Inspiring Leader',
  source: 'Player\'s Handbook',
  prereq: 'CHA 13+',
  effect: 'After 10 minutes of speaking: up to 6 friendly creatures within 30ft gain temp HP = your level + CHA mod.',
  duration: 'Until temp HP depleted or long rest.',
  reuse: 'Can use after each short or long rest. Creatures can\'t benefit again until they finish a short/long rest.',
  note: 'One of the best support feats. Free temp HP for entire party. Scales with level. No spell slot cost.',
};

export const INSPIRING_LEADER_MATH = [
  { level: 1, chaMod: 3, perCreature: 4, totalParty6: 24 },
  { level: 4, chaMod: 4, perCreature: 8, totalParty6: 48 },
  { level: 5, chaMod: 5, perCreature: 10, totalParty6: 60 },
  { level: 8, chaMod: 5, perCreature: 13, totalParty6: 78 },
  { level: 10, chaMod: 5, perCreature: 15, totalParty6: 90 },
  { level: 15, chaMod: 5, perCreature: 20, totalParty6: 120 },
  { level: 20, chaMod: 5, perCreature: 25, totalParty6: 150 },
];

export const INSPIRING_LEADER_ANALYSIS = {
  perDay: 'Usable after each short rest. 3 uses/day (morning + 2 short rests) = up to 3 × 90 = 270 total party temp HP at L10.',
  vsAidSpell: 'Aid (L2) gives +5 HP max to 3 creatures = 15 HP. Inspiring Leader gives 15 temp HP to 6 creatures = 90 temp HP. IL wins.',
  vsHealing: 'Inspiring Leader prevents damage (temp HP buffer). Prevention > cure. No spell slot cost.',
  bestClasses: ['Paladin (CHA focus + party protector)', 'Bard (CHA focus + support role)', 'Sorcerer/Warlock (CHA focus)'],
  note: 'Any CHA 13+ character can take this. Even a Fighter with 14 CHA gets good value.',
};

export const INSPIRING_LEADER_TIPS = [
  { tip: 'Use after EVERY short rest', detail: 'Don\'t forget. After each short rest, give the speech. Free temp HP refill.' },
  { tip: 'Include familiars and companions', detail: 'Familiars, mounts, animal companions count as friendly creatures. Temp HP for the owl too.' },
  { tip: 'Stacks with nothing', detail: 'Temp HP doesn\'t stack. If party already has temp HP from another source, they choose the higher amount.' },
  { tip: 'Take at L4 on CHA classes', detail: 'Paladin, Bard, Sorcerer, Warlock: take at L4 if CHA is already 18+. Great feat for off-ASI levels.' },
];

export function inspiringLeaderTHP(level, chaMod) {
  return level + chaMod;
}

export function dailyPartyTHP(level, chaMod, partySize = 6, shortRestsPerDay = 2) {
  const perUse = (level + chaMod) * Math.min(partySize, 6);
  return perUse * (1 + shortRestsPerDay);
}
