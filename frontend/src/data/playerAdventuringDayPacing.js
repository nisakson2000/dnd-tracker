/**
 * playerAdventuringDayPacing.js
 * Player Mode: Adventuring day structure and resource pacing
 * Pure JS — no React dependencies.
 */

export const ADVENTURING_DAY = {
  standard: {
    encounters: '6-8 medium/hard encounters',
    shortRests: '2 short rests (after encounters 2-3 and 5-6)',
    longRest: '1 long rest at the end of the day',
    xpBudget: {
      1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500,
      6: 4000, 7: 5000, 8: 6000, 9: 7500, 10: 9000,
      11: 10500, 12: 11500, 13: 13500, 14: 15000, 15: 18000,
      16: 20000, 17: 25000, 18: 27000, 19: 30000, 20: 40000,
    },
  },
  nova: {
    description: '1-2 hard/deadly encounters per long rest. Common in many campaigns.',
    problem: 'Casters dump all their slots in one fight. Martials can\'t keep up with nova casters.',
    effect: 'Short rest classes (Warlock, Monk, Fighter) are relatively weaker in nova days.',
  },
  gritty: {
    description: 'Gritty Realism variant. Short rest = 8 hours. Long rest = 7 days.',
    effect: 'Resources stretch over many sessions. Every spell slot matters. Martials shine.',
    note: 'Ask your DM if they use this variant. It changes EVERYTHING about resource management.',
  },
};

export const RESOURCE_PACING = [
  { phase: 'Early Day (encounters 1-2)', spellSlots: 'Use 1st-2nd level slots freely. Cantrips for trash.', abilities: 'Use freely — short rest coming.', hp: 'Acceptable to take moderate damage. Hit Dice recovery at short rest.' },
  { phase: 'Pre-Short Rest (encounter 3)', spellSlots: 'Dump remaining low slots. Short rest won\'t recover them anyway.', abilities: 'Use everything. Reset coming.', hp: 'Top off with remaining resources before resting.' },
  { phase: 'Short Rest', spellSlots: 'Warlock: full recovery. Wizard: Arcane Recovery. Others: nothing.', abilities: 'Fighter: Action Surge + Second Wind. Monk: all Ki. Bard 5+: Inspiration.', hp: 'Spend Hit Dice to heal. Half your total per long rest.' },
  { phase: 'Mid Day (encounters 4-5)', spellSlots: 'Mid-level slots for real threats. Save top slots for boss/emergency.', abilities: 'Use wisely — one more short rest available.', hp: 'Be more conservative. Second short rest is your last heal before long rest.' },
  { phase: 'Second Short Rest', spellSlots: 'Same as first. Warlock gets slots back again.', abilities: 'Full reset of short rest abilities.', hp: 'Remaining Hit Dice. May be running low.' },
  { phase: 'Late Day (encounters 6-8)', spellSlots: 'Save NOTHING. Use your best remaining slots. This is the home stretch.', abilities: 'Go all out. Long rest is coming.', hp: 'Accept risk. No more short rests.' },
  { phase: 'Boss Fight', spellSlots: 'EVERYTHING. Highest slots, best spells, no holding back.', abilities: 'Action Surge, Stunning Strike, Smite — use it all.', hp: 'Potions, Healing Word, any emergency resources.' },
];

export const PACING_TIPS = [
  'If you don\'t know how many encounters remain, save your top 2 spell slot levels.',
  'Warlocks should push for short rests — they benefit disproportionately.',
  'Cantrips are free. Use them for weak enemies. Save slots for real threats.',
  'Concentration spells are the most slot-efficient — one slot for many rounds.',
  'Communicate with the party about rest needs. Don\'t silently run out of resources.',
  'Ask the DM: "How much further?" to gauge remaining encounters.',
  'Before a long rest, spend remaining slots on Goodberry, Animate Dead, or other persistent effects.',
];

export function getXPBudget(level) {
  return ADVENTURING_DAY.standard.xpBudget[level] || 0;
}

export function getPacingAdvice(encounterNumber, totalExpected) {
  const ratio = encounterNumber / (totalExpected || 6);
  if (ratio <= 0.33) return RESOURCE_PACING.find(p => p.phase.includes('Early'));
  if (ratio <= 0.5) return RESOURCE_PACING.find(p => p.phase.includes('Pre-Short'));
  if (ratio <= 0.66) return RESOURCE_PACING.find(p => p.phase.includes('Mid'));
  if (ratio <= 0.85) return RESOURCE_PACING.find(p => p.phase.includes('Late'));
  return RESOURCE_PACING.find(p => p.phase.includes('Boss'));
}
