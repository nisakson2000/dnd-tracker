/**
 * playerLevel5PowerSpike.js
 * Player Mode: The level 5 power spike — what changes and how to optimize
 * Pure JS — no React dependencies.
 */

export const LEVEL5_OVERVIEW = {
  why: 'Level 5 is the single biggest power spike in D&D 5e. Everything doubles.',
  changes: [
    'Martials: Extra Attack — damage literally doubles from 1 hit to 2.',
    'Casters: 3rd level spells — Fireball, Counterspell, Hypnotic Pattern, Spirit Guardians.',
    'Proficiency bonus: +2 → +3. Better attacks, saves, DCs across the board.',
    'Cantrips scale: Eldritch Blast 1d10 → 2d10. Fire Bolt 1d10 → 2d10.',
    'Monsters: CR 5+ enemies start appearing. More HP, more damage, more abilities.',
  ],
};

export const MARTIAL_AT_5 = [
  { class: 'Fighter', change: 'Extra Attack (2 attacks/action). With Action Surge: 4 attacks in one turn.', dprJump: '~100% increase' },
  { class: 'Barbarian', change: 'Extra Attack + Fast Movement (+10ft speed). Two Reckless attacks.', dprJump: '~100% increase' },
  { class: 'Paladin', change: 'Extra Attack + 2nd level slots (Smite for 3d8). Two chances to Smite per turn.', dprJump: '~120% increase' },
  { class: 'Ranger', change: 'Extra Attack + 2nd level spells (Pass Without Trace, Spike Growth).', dprJump: '~100% increase' },
  { class: 'Monk', change: 'Extra Attack + Stunning Strike. 3 attacks/turn (with Martial Arts BA).', dprJump: '~100% + stun utility' },
  { class: 'Rogue', change: 'No Extra Attack BUT Sneak Attack goes to 3d6 + Uncanny Dodge. Survivability spike.', dprJump: '~50% (SA dice)' },
];

export const CASTER_AT_5 = [
  { class: 'Wizard', spells: 'Fireball (8d6 AoE), Counterspell, Hypnotic Pattern, Haste, Fly, Lightning Bolt', impact: 'Game-defining AoE and control.' },
  { class: 'Cleric', spells: 'Spirit Guardians (3d8 AoE/turn), Revivify, Dispel Magic, Beacon of Hope', impact: 'Spirit Guardians = best sustained damage in the game for cleric.' },
  { class: 'Druid', spells: 'Conjure Animals (8 wolves), Call Lightning (3d10/turn), Plant Growth', impact: 'Conjure Animals is absurd at level 5.' },
  { class: 'Sorcerer', spells: 'Fireball, Counterspell, Haste (Twinned!), Fly', impact: 'Twinned Haste at level 5 = two party members Hasted.' },
  { class: 'Warlock', spells: '3rd level slots (Pact slots at max level), Counterspell (Hexblade), Hunger of Hadar', impact: 'EB scales to 2 beams. Invocation tax opens up.' },
  { class: 'Bard', spells: 'Hypnotic Pattern, Fear, Dispel Magic, Bestow Curse', impact: 'Best crowd control class. HP and bardic die jump.' },
];

export const LEVEL5_PRIORITIES = [
  'If you haven\'t maxed your primary stat, ASI at L4 is critical. +1 to hit/DC matters enormously.',
  'GWM/SS becomes viable at L5 — -5/+10 with Extra Attack. Miss one, hit one = still net positive.',
  'Casters: Fireball/Spirit Guardians solve encounters that used to take 5+ rounds in 1-2.',
  'Start fighting smarter, not harder. Level 5+ encounters include multi-attack enemies.',
  'Consider multiclassing AFTER level 5. Getting Extra Attack or 3rd level spells is the priority.',
];

export function dprComparison(weaponDamageAvg, mod, beforeLevel5) {
  if (beforeLevel5) return weaponDamageAvg + mod; // 1 attack
  return (weaponDamageAvg + mod) * 2; // 2 attacks
}

export function fireballAverage(targets) {
  return 28 * targets * 0.5; // 8d6 avg = 28, assume 50% save
}
