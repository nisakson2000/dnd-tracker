/**
 * playerDeathSaveTacticsGuide.js
 * Player Mode: Death saving throws — rules, tactics, and how to save allies
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  trigger: 'Start of each turn when at 0 HP and not stabilized.',
  success: 'DC 10. Roll 10+ = success.',
  stabilize: '3 successes = stabilized (unconscious but not dying).',
  death: '3 failures = dead.',
  nat20: 'Natural 20: regain 1 HP. You\'re conscious and can act.',
  nat1: 'Natural 1: counts as TWO failures.',
  damage: 'Taking damage while at 0 HP = 1 automatic failure. Critical hit = 2 failures.',
  massiveDamage: 'If remaining damage after dropping to 0 equals or exceeds your max HP, instant death.',
  reset: 'Successes and failures reset when you regain any HP.',
};

export const SAVING_DOWNED_ALLIES = [
  { method: 'Healing Word', rating: 'S+', why: 'Bonus action, 60ft range. Best yo-yo heal. Any amount of HP gets them up.', level: 1 },
  { method: 'Spare the Dying (cantrip)', rating: 'A', why: 'Stabilize at touch range. Free, no slot. Doesn\'t restore HP.', level: 0 },
  { method: 'Medicine check (DC 10)', rating: 'B', why: 'Stabilize without magic. Action + adjacent. Unreliable without proficiency.', level: 0 },
  { method: 'Healer\'s Kit', rating: 'A', why: 'Auto-stabilize. No check needed. 10 uses per kit. 5 gp.', level: 0 },
  { method: 'Lay on Hands (1 HP)', rating: 'S', why: 'Touch. Just spend 1 point. Ally is conscious.', level: 0 },
  { method: 'Goodberry', rating: 'A+', why: 'Feed one berry to downed ally. 1 HP = conscious.', level: 1 },
  { method: 'Healing Potion', rating: 'A', why: 'Anyone can administer. Action to use. 2d4+2 HP.', level: 0 },
];

export const YOYO_HEALING = {
  concept: 'Let allies drop to 0, then Healing Word for 1 HP to bring them back.',
  why: 'More action-efficient than keeping everyone topped off.',
  risk: 'Enemy multiattack can kill before your turn. Death saves accumulate.',
  mitigation: 'Use when enemy can\'t reach downed ally. Position matters.',
  controversy: 'Some DMs houserule against this. Discuss at Session 0.',
};

export const DEATH_SAVE_TACTICS = [
  'Healing Word at range: best way to save downed allies.',
  'Only 1 HP needed to get up. Don\'t waste big heals on downed allies.',
  'Healer\'s Kit: auto-stabilize, no check, 10 uses, cheap.',
  'Kill the attacker before they hit the downed ally.',
  'Drag downed ally behind cover (use half your movement).',
  'Nat 20 on death save: you\'re up with 1 HP. Can act that turn.',
  'Nat 1: counts as 2 failures. Pray.',
  'Damage at 0 HP = auto-failure. Crits = 2 failures.',
  'Stabilized ≠ conscious. Still at 0 HP. Wakes up in 1d4 hours.',
  'Massive damage: if overkill >= max HP, instant death. Rare but real.',
];

export const PREVENT_GOING_DOWN = [
  { method: 'Temp HP', why: 'Buffer before real HP loss. Inspiring Leader, Heroism, Twilight Sanctuary.' },
  { method: 'Shield spell', why: '+5 AC. Dodge the hit entirely.' },
  { method: 'Absorb Elements', why: 'Halve elemental damage. Survive the Fireball.' },
  { method: 'Cutting Words (Bard)', why: 'Reduce enemy attack roll. Miss instead of hit.' },
  { method: 'Half-Orc Relentless', why: 'Drop to 1 HP instead of 0. Once per long rest.' },
  { method: 'Death Ward', why: 'First time you drop to 0, go to 1 instead. 8-hour duration.' },
  { method: 'Interception style', why: 'Reduce damage to adjacent ally by 1d10+prof.' },
];

export const DEATH_SAVE_TIPS = [
  'Healing Word: best spell for saving downed allies. Always prepare.',
  '1 HP is all you need. Lay on Hands 1 point, Goodberry, etc.',
  'Healer\'s Kit: 5 gp, 10 uses, auto-stabilize. Every party needs one.',
  'Don\'t announce death save results to enemies (metagaming).',
  'Spare the Dying: free but touch range only.',
  'Death Ward: cast before fights. Prevents first drop to 0.',
  'Zealot Barbarian: can\'t die while raging. Keep raging.',
  'Half-Orc: Relentless Endurance = free once-per-day insurance.',
  'Crits on downed allies = 2 death save failures.',
  'Stabilized allies wake in 1d4 hours unless healed.',
];
