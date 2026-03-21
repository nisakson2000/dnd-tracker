/**
 * playerDeathSaveTactics.js
 * Player Mode: Death saving throws, unconscious tactics, and staying alive
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  trigger: 'Start your turn at 0 HP while not stabilized.',
  roll: 'Flat d20. No modifiers (usually). DC 10.',
  success: '10+ = success. Three successes = stabilized (not conscious).',
  failure: '9 or below = failure. Three failures = dead.',
  nat20: 'Regain 1 HP. You\'re conscious and can act immediately.',
  nat1: 'Counts as TWO failures.',
  damage: 'Taking damage at 0 HP = automatic failure. Crit (melee within 5ft) = TWO failures.',
  healing: 'ANY healing (even 1 HP) brings you back to consciousness immediately.',
};

export const DEATH_SAVE_MATH = {
  survivalOneRound: '55% to succeed each roll (10+ on d20).',
  surviveThreeRounds: '~59.5% chance to stabilize before dying (without help).',
  nat20Chance: '5% per roll to pop back up at 1 HP.',
  nat1Risk: '5% per roll for double failure.',
  withBless: '+1d4 average = ~67% success per roll.',
  withPaladinAura: '+CHA mod (up to +5). At +5, succeed on 5+ = 80% per roll.',
};

export const SAVING_DOWNED_ALLIES = [
  { method: 'Healing Word (bonus action, 60ft range)', priority: 'S', reason: 'THE best unconscious-rescue spell. Bonus action + 60ft range = no excuse not to.' },
  { method: 'Spare the Dying (cantrip)', priority: 'A', reason: 'Stabilizes immediately. Action + touch range. Free but costs your action and position.' },
  { method: 'Healer\'s Kit (10 uses)', priority: 'A', reason: 'Stabilize without a check. 5 gp. No class/spell requirement. Everyone should carry one.' },
  { method: 'Medicine check (DC 10)', priority: 'C', reason: 'Free but unreliable unless proficient. Can fail and waste your action.' },
  { method: 'Lay on Hands (1 HP)', priority: 'S', reason: 'Touch, but you choose the amount. 1 HP = conscious. Save the rest.' },
  { method: 'Goodberry', priority: 'A', reason: 'Force-feed a berry to an unconscious ally. 1 HP. Uses their "swallow" but works RAW at most tables.' },
  { method: 'Potion of Healing (force-feed)', priority: 'B', reason: 'Action to administer. Works but uses your action and a potion.' },
];

export const PREVENTING_DEATH = [
  { method: 'Don\'t go down in the first place', detail: 'Shield, Absorb Elements, Cutting Words, positioning. Prevention > cure.', rating: 'S' },
  { method: 'Death Ward (4th level)', detail: 'When you drop to 0 HP, you drop to 1 instead. 8 hours, no concentration.', rating: 'S' },
  { method: 'Relentless Endurance (Half-Orc)', detail: 'Drop to 1 HP instead of 0, once per long rest. Built-in death prevention.', rating: 'S' },
  { method: 'Half-Orc Barbarian combo', detail: 'Relentless Endurance + Rage (resistance to damage) + d12 hit dice = nearly unkillable.', rating: 'S' },
  { method: 'Zealot Barbarian', detail: 'Rage Beyond Death: can\'t die while raging. Only die when rage ends at 0 HP.', rating: 'S' },
  { method: 'Long Death Monk', detail: 'Touch of the Long Death: spend ki to avoid dropping to 0 HP.', rating: 'A' },
];

export const UNCONSCIOUS_DANGERS = [
  'Melee attacks within 5ft are auto-crits on unconscious targets (2 death save failures).',
  'Any damage = automatic death save failure. AoE damage will hit you.',
  'Enemies with Multiattack can hit you multiple times = multiple failures = instant death.',
  'Intelligent enemies may attack downed PCs to finish them. Communicate with DM about this.',
  'If you stabilize at 0 HP, you\'re still unconscious for 1d4 hours. You\'re out of the fight.',
];

export const YO_YO_HEALING = {
  description: 'Repeatedly healing allies from 0 HP to 1 HP with Healing Word.',
  tactic: 'Let ally drop to 0, bonus action Healing Word for 1 HP, they act normally, repeat.',
  pros: ['Extremely slot-efficient', 'Ally gets their full turn', 'Only costs a bonus action'],
  cons: ['Ally takes damage from enemies on their way down', 'DM may target downed PCs', 'Feels cheesy at some tables'],
  note: 'The strongest healing strategy in 5e. Healing to PREVENT going down is usually less efficient than this.',
};

export function deathSaveChance(bonuses) {
  const needed = Math.max(1, 10 - bonuses);
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function survivalProbability(saveBonus) {
  const p = deathSaveChance(saveBonus) / 100;
  const q = 1 - p;
  // Simplified: probability of getting 3 successes before 3 failures
  return Math.round((p * p * p + 3 * p * p * p * q + 6 * p * p * p * q * q) * 100);
}
