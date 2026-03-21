/**
 * playerDeathSaveStrategyGuide.js
 * Player Mode: Death saves — rules, strategy, and optimization
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  trigger: 'When you start your turn at 0 HP, roll a death save.',
  success: 'DC 10. Roll 10+ = success. 3 successes = stable at 0 HP.',
  failure: 'Roll 9 or below = failure. 3 failures = dead.',
  nat20: 'Nat 20: regain 1 HP. You\'re conscious and can act.',
  nat1: 'Nat 1: counts as TWO failures.',
  damage: 'Taking damage at 0 HP = automatic failure. Crit = 2 failures.',
  reset: 'Regaining ANY HP resets death saves to 0/0.',
  note: 'Death saves persist until you stabilize, die, or regain HP.',
};

export const STABILIZATION_METHODS = [
  { method: 'Healing Word (BA, 60ft)', rating: 'S+', why: 'BA ranged. Any HP = conscious. Best pickup method.', class: 'Bard, Cleric, Druid' },
  { method: 'Goodberry (feed to downed ally)', rating: 'S', why: '1 HP from a berry. Anyone can feed it (uses their action).', class: 'Druid, Ranger' },
  { method: 'Lay on Hands (1 HP)', rating: 'S', why: 'Spend 1 HP from pool. Touch range. Paladin exclusive.', class: 'Paladin' },
  { method: 'Medicine check (DC 10)', rating: 'B', why: 'No magic needed. Action. Only stabilizes (doesn\'t wake them).', class: 'Anyone' },
  { method: 'Spare the Dying (cantrip)', rating: 'B+', why: 'Auto-stabilize. Action. Touch range. Grave Cleric: 30ft BA.', class: 'Cleric' },
  { method: 'Healer\'s Kit', rating: 'A', why: 'Auto-stabilize. No check needed. 10 uses. Carry one.', class: 'Anyone' },
  { method: 'Cure Wounds', rating: 'B', why: 'Action, touch. Healing Word is almost always better.', class: 'Many' },
  { method: 'Potion of Healing', rating: 'A', why: 'Action to administer. 2d4+2 HP. Anyone can do it.', class: 'Anyone' },
];

export const DEATH_SAVE_OPTIMIZATION = [
  { feature: 'Diamond Soul (Monk 14)', effect: 'Spend 1 ki to reroll failed save. Applies to death saves.', rating: 'S' },
  { feature: 'Boon of Fate / Lucky feat', effect: 'Reroll death saves. Add d10 or reroll d20.', rating: 'S' },
  { feature: 'Favored by the Gods (Divine Soul)', effect: 'Add 2d4 to failed save. Applies to death saves.', rating: 'A+' },
  { feature: 'Flash of Genius (Artificer)', effect: '+INT to ally\'s save as reaction. Applies to death saves.', rating: 'A+' },
  { feature: 'Aura of Protection (Paladin)', effect: '+CHA to all saves in 10ft. Applies to death saves.', rating: 'S+' },
  { feature: 'Bless', effect: '+1d4 to saves. Must be cast BEFORE going down. Concentration.', rating: 'A' },
  { feature: 'Death Ward', effect: 'Drop to 1 HP instead of 0. Prevents death saves entirely.', rating: 'S' },
  { feature: 'Relentless Endurance (Half-Orc)', effect: 'Once/LR: drop to 1 HP instead of 0.', rating: 'S' },
  { feature: 'Undying Sentinel (Paladin 15)', effect: 'If below half HP, drop to 1 HP instead of 0. Once/LR.', rating: 'A+' },
];

export const YO_YO_HEALING = {
  what: 'Repeatedly healing downed allies with small heals (Healing Word). They go down, get healed, act, go down again.',
  pros: ['They get their turn. Action economy preserved.', 'Only costs a BA and L1 slot.', 'Healing Word from 60ft range.'],
  cons: ['Some DMs add exhaustion for going to 0 HP (house rule).', 'Feels bad narratively.', 'Risky if enemies focus the downed ally.'],
  counterplay: [
    'Enemies can attack downed PCs (auto-crit in melee = 2 death failures).',
    'Area damage hits downed PCs for auto-failure.',
    'Some DMs give exhaustion on dropping to 0 HP.',
  ],
  tip: 'Yo-yo healing works RAW but some tables dislike it. Check with DM.',
};

export const DEATH_PREVENTION = [
  { method: 'Death Ward', detail: 'Pre-cast before combat. 8 hours. No concentration. First death = 1 HP.', rating: 'S' },
  { method: 'Relentless Endurance', detail: 'Half-Orc racial. Once/LR. Drop to 1 instead of 0.', rating: 'S' },
  { method: 'Zealot Barbarian L14', detail: 'Rage Beyond Death. Can\'t die while raging.', rating: 'S+' },
  { method: 'High HP + Healing', detail: 'Don\'t go to 0. Best prevention is staying alive.', rating: 'S' },
  { method: 'Absorb Elements + Shield', detail: 'Reduce incoming damage. Prevent going down in the first place.', rating: 'A+' },
  { method: 'Temp HP', detail: 'Temp HP takes damage first. Extra buffer before going down.', rating: 'A+' },
  { method: 'Counterspell', detail: 'Negate the spell that would down you.', rating: 'A+' },
];

export const DEATH_SAVE_TIPS = [
  'Healing Word: best way to pick up downed allies. BA, 60ft, cheap.',
  'Nat 20 on death save: regain 1 HP. You\'re back in the fight.',
  'Nat 1: TWO failures. Very dangerous. Lucky feat helps.',
  'Damage at 0 HP = auto failure. Melee crits = 2 failures. Protect downed allies.',
  'Paladin Aura of Protection: +CHA to death saves for nearby allies.',
  'Death Ward: pre-cast before dangerous fights. 8 hours, no concentration.',
  'Healer\'s Kit: 5gp, 10 uses, auto-stabilize. Every party should carry one.',
  'Goodberry: anyone can feed a berry to a downed ally. 1 HP = conscious.',
  'Don\'t waste actions on Cure Wounds when Healing Word works.',
  'Best death prevention: don\'t go to 0 HP. Use Shield, Absorb Elements.',
];
