/**
 * playerShortRestOptimizationGuide.js
 * Player Mode: Short rest optimization — maximizing the 1-hour break
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_BASICS = {
  duration: '1 hour of light activity (reading, eating, keeping watch, tending wounds).',
  hitDice: 'Spend Hit Dice to regain HP. Roll the die + CON mod per die spent.',
  frequency: 'RAW: no limit. Common practice: 2 per adventuring day (after encounter 2 and 4).',
  interruption: 'Interrupted by combat or other strenuous activity (1 hour of walking is fine).',
  note: 'Short rests are the most underused resource in D&D. Advocate for them. They\'re free HP and feature recovery.',
};

export const SHORT_REST_CLASS_RECOVERY = [
  { class: 'Fighter', recovers: ['Second Wind', 'Action Surge', 'Superiority Dice (Battlemaster)', 'Indomitable (L13+)'], importance: 'Critical', note: 'Fighters are DESIGNED around short rests. Without them, you\'re at half power.' },
  { class: 'Warlock', recovers: ['ALL spell slots', 'Hexblade\'s Curse', 'Hex Warrior'], importance: 'Critical', note: 'Warlocks recover ALL slots on short rest. Without SRs, Warlocks are the worst casters.' },
  { class: 'Monk', recovers: ['ALL Ki points'], importance: 'Critical', note: 'Ki fuels everything. Without short rests, Monks run dry by fight 2.' },
  { class: 'Bard', recovers: ['Bardic Inspiration (L5+, Font of Inspiration)'], importance: 'High', note: 'Font of Inspiration (L5): BI recovers on short rest. Before L5: long rest only.' },
  { class: 'Cleric', recovers: ['Channel Divinity'], importance: 'Medium', note: 'Channel Divinity is good but most Cleric power is in spell slots (long rest).' },
  { class: 'Druid', recovers: ['Wild Shape'], importance: 'Medium', note: 'Wild Shape uses recover on short rest. Moon Druids care a lot. Other Druids less so.' },
  { class: 'Wizard', recovers: ['Arcane Recovery (1/day, specifically after a short rest)'], importance: 'Medium', note: 'Arcane Recovery: once per day, recover slots totaling half your Wizard level (rounded up). Must be during a short rest.' },
  { class: 'Paladin', recovers: ['Channel Divinity'], importance: 'Low', note: 'Most Paladin power is in slots and auras. CD is nice but not critical.' },
  { class: 'Ranger', recovers: ['Nothing significant'], importance: 'Low', note: 'Rangers don\'t recover much on short rest. Still get Hit Dice healing.' },
  { class: 'Sorcerer', recovers: ['Nothing'], importance: 'Low', note: 'Sorcerers recover nothing on short rest. Long-rest class. Still benefits from Hit Dice.' },
];

export const HIT_DICE_OPTIMIZATION = [
  { tip: 'Spend Hit Dice efficiently', detail: 'Don\'t over-heal. If you have 30/50 HP and need 20 more, spend exactly enough dice to get there.', note: 'At L5 with d8 HD and +2 CON: average 6.5 per die. Need 20 HP ≈ 3 Hit Dice.' },
  { tip: 'Save some Hit Dice', detail: 'Don\'t spend all HD on the first short rest. Save 2-3 for a second short rest later in the day.', note: 'You have level number of HD. Spread them across 2 short rests.' },
  { tip: 'Durable feat', detail: 'Minimum HD roll = 2 × CON mod. With +3 CON: minimum 6 per d8 HD. Average goes from 6.5 to 7.0+.', note: 'Niche feat but great for tanks who short rest often.' },
  { tip: 'Periapt of Wound Closure', detail: 'Magic item: double HP regained from Hit Dice. d8+3 becomes 2×(d8+3). Average 6.5 → 13 per die.', note: 'Incredible item for short-rest-heavy campaigns.' },
  { tip: 'Chef feat', detail: 'After short rest: PB creatures regain extra 1d8 HP. Free bonus healing for the party.', note: 'PB creatures × 1d8 = significant party-wide healing boost.' },
  { tip: 'Song of Rest (Bard)', detail: 'Bard in party: everyone spending Hit Dice regains extra 1d6-1d12 HP (scales with Bard level).', note: 'Free extra healing for everyone. Bards are amazing short rest enhancers.' },
];

export const WHEN_TO_SHORT_REST = [
  { situation: 'After a hard fight', action: 'Short rest. Recover HP, features. Prepare for next encounter.', priority: 'Always' },
  { situation: 'Warlock/Fighter/Monk at 0 resources', action: 'Short rest immediately. These classes need it.', priority: 'High' },
  { situation: 'Multiple party members below half HP', action: 'Short rest. Hit Dice healing is free. Don\'t waste spell slots healing.', priority: 'High' },
  { situation: 'Time pressure', action: 'Consider skipping. But even 10 minutes for a "short breather" (house rule) can help.', priority: 'Situational' },
  { situation: 'Safe room in a dungeon', action: 'Short rest. Barricade the door. Use Tiny Hut or Rope Trick for safety.', priority: 'High' },
];

export function hitDiceHealing(dieSize, conMod, diceSpent) {
  const avgPerDie = (dieSize / 2 + 0.5) + conMod;
  return { avgPerDie, totalAvg: avgPerDie * diceSpent, note: `${diceSpent}d${dieSize}+${conMod * diceSpent} = avg ${(avgPerDie * diceSpent).toFixed(1)} HP` };
}

export function songOfRestBonus(bardLevel) {
  if (bardLevel >= 17) return 6.5; // 1d12
  if (bardLevel >= 13) return 5.5; // 1d10
  if (bardLevel >= 9) return 4.5;  // 1d8
  return 3.5; // 1d6
}
