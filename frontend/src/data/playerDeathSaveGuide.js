/**
 * playerDeathSaveGuide.js
 * Player Mode: Death saving throws rules, tips, and optimization
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_BASICS = {
  trigger: 'When you drop to 0 HP and aren\'t killed outright.',
  roll: 'Start of your turn: roll d20. 10+ = success. 9- = failure. Natural 20 = regain 1 HP + conscious. Natural 1 = 2 failures.',
  threeSuccesses: 'Stabilize (unconscious, no more death saves, still at 0 HP).',
  threeFailures: 'You die.',
  damageAt0: 'Taking damage while at 0 HP = 1 automatic death save failure. Critical hit = 2 failures.',
  massiveDamage: 'If remaining damage after hitting 0 HP ≥ your max HP, you die instantly (no death saves).',
  stabilized: 'After 1d4 hours, stabilized character regains 1 HP and wakes up.',
};

export const DEATH_SAVE_MATH = {
  chanceToStabilize: '59.5% chance to stabilize from 0/0 (no successes or failures)',
  chancePerRound: '55% chance of success on each roll (10-20 succeed, 1-9 fail)',
  naturalTwenty: '5% chance to pop back up with 1 HP',
  naturalOne: '5% chance of double failure',
  expectedRounds: 'On average, death saves resolve in ~3.5 rounds',
  note: 'In practice, allies should heal you BEFORE you need 3 successes. Even 1 HP from Healing Word works.',
};

export const DEATH_SAVE_TACTICS = [
  { tactic: 'Healing Word over everything', detail: 'Healing Word: bonus action, 60ft range, brings ally from 0 to conscious. Amount healed doesn\'t matter — consciousness matters.', rating: 'S' },
  { tactic: 'Stabilize with Spare the Dying', detail: 'Cantrip: auto-stabilize a creature at 0 HP. Touch range. Free — no slots.', rating: 'A' },
  { tactic: 'Healer\'s Kit', detail: 'No check required. Stabilize creature at 0 HP. 10 uses, 5gp. Every party should have one.', rating: 'A' },
  { tactic: 'Don\'t attack the downed player', detail: 'RAW: intelligent enemies may attack downed PCs to ensure death. Remind your DM of "fun first."', rating: 'N/A', note: 'Metagaming, but important to discuss as a group.' },
  { tactic: 'Diamond Soul (Monk L14)', detail: 'Proficiency in ALL saving throws. Death saves are saves. Monks add proficiency to death saves.', rating: 'S' },
  { tactic: 'Lucky feat', detail: 'Spend luck point to reroll a death save. Can turn a failure into success.', rating: 'S' },
  { tactic: 'Halfling Luck', detail: 'Halflings reroll natural 1s. A natural 1 on a death save (2 failures) becomes a reroll. Life-saving.', rating: 'S' },
  { tactic: 'Bless', detail: 'If Bless is active when you go down, you add 1d4 to death saves. +1d4 avg = 2.5 = 67.5% success rate.', rating: 'A' },
];

export const REVIVE_SPELLS = [
  { spell: 'Healing Word', level: 1, range: '60ft', timing: 'Bonus action', cost: 'None', note: 'Not a revive — but gets you up from 0 HP. Best emergency heal.' },
  { spell: 'Spare the Dying', level: 0, range: 'Touch', timing: 'Action', cost: 'None', note: 'Cantrip. Stabilize only — doesn\'t wake them up.' },
  { spell: 'Revivify', level: 3, range: 'Touch', timing: 'Action', cost: '300gp diamond', limit: 'Within 1 minute of death', note: 'Standard resurrection. Must be within 1 minute. 300gp component consumed.' },
  { spell: 'Raise Dead', level: 5, range: 'Touch', timing: '1 hour', cost: '500gp diamond', limit: 'Within 10 days', note: '10-day window. Target has -4 to d20 rolls (reduces by 1 per long rest). Can\'t restore missing body parts.' },
  { spell: 'Reincarnate', level: 5, range: 'Touch', timing: '1 hour', cost: '1000gp oils/unguents', limit: 'Within 10 days', note: 'New random race. Soul willing. 10-day window. Body can be incomplete.' },
  { spell: 'Resurrection', level: 7, range: 'Touch', timing: '1 hour', cost: '1000gp diamond', limit: 'Within 100 years', note: '100-year window. Restores body parts. Cures non-magical diseases.' },
  { spell: 'True Resurrection', level: 9, range: 'Touch', timing: '1 hour', cost: '25000gp diamond', limit: 'Within 200 years', note: 'Full restoration. New body if needed. Even works if body is destroyed.' },
  { spell: 'Wish', level: 9, range: 'N/A', timing: 'Action', cost: 'None', limit: 'None', note: 'Can duplicate any L8 or lower spell (Resurrection). Or anything DM allows.' },
];

export const ZEALOT_BARBARIAN_DEATH = {
  feature: 'Rage Beyond Death (L14)',
  effect: 'While raging: dropping to 0 HP doesn\'t knock you unconscious. You still make death saves. You die only if rage ends with 0 HP and 3 failures.',
  tactic: 'Keep raging at 0 HP. Attack normally. Must attack or take damage each turn to maintain rage. If healed above 0 before rage ends: you live.',
  resurrection: 'Zealot feature: Warrior of the Gods — spells that restore you to life require NO material components. Free revives.',
  note: 'Zealot Barbarians are the hardest class to permanently kill. Rage prevents death. Resurrection is free.',
};

export function deathSaveSuccessChance(bonusToSave = 0) {
  // DC 10 on d20, so need 10+ = 55% base
  return Math.min(0.95, Math.max(0.05, (11 + bonusToSave) / 20));
}

export function chanceToStabilize(bonusToSave = 0) {
  // Simplified: probability of getting 3 successes before 3 failures
  const p = deathSaveSuccessChance(bonusToSave);
  // This is a negative binomial distribution calculation
  // Simplified approximation
  return p * p * p + 3 * p * p * p * (1 - p) + 6 * p * p * p * (1 - p) * (1 - p);
}

export function massiveDamageThreshold(maxHP) {
  return maxHP; // damage remaining after hitting 0 must equal max HP
}
