/**
 * playerCombatShorthand.js
 * Player Mode: Quick reference shorthand for common combat calculations and rules
 * Pure JS — no React dependencies.
 */

export const ATTACK_ROLL_FORMULA = {
  melee: 'd20 + STR mod + proficiency (if proficient)',
  ranged: 'd20 + DEX mod + proficiency (if proficient)',
  finesse: 'd20 + STR or DEX mod (your choice) + proficiency',
  spell: 'd20 + spellcasting mod + proficiency',
  note: 'Roll ≥ target AC = hit. Natural 20 always hits. Natural 1 always misses.',
};

export const DAMAGE_FORMULA = {
  melee: 'Weapon die + STR mod',
  ranged: 'Weapon die + DEX mod',
  finesse: 'Weapon die + STR or DEX mod (whichever you used to attack)',
  spell: 'As listed in spell description',
  twoWeaponFighting: 'Weapon die only (no ability mod unless you have the Fighting Style)',
  criticalHit: 'Double ALL damage dice (not flat modifiers)',
};

export const COMMON_DCS = {
  veryEasy: { dc: 5, description: 'Almost anyone can do this' },
  easy: { dc: 10, description: 'A moderately skilled person can do this' },
  medium: { dc: 15, description: 'Requires training or talent' },
  hard: { dc: 20, description: 'Very difficult, requires expertise' },
  veryHard: { dc: 25, description: 'Exceptional — near the limit of possibility' },
  nearlyImpossible: { dc: 30, description: 'Legendary difficulty' },
};

export const QUICK_MATH = {
  advantage: '+5 average to d20 roll (9.75% more likely to hit)',
  disadvantage: '-5 average to d20 roll (9.75% less likely to hit)',
  halfCover: '+2 AC and DEX saves',
  threeQuarterCover: '+5 AC and DEX saves',
  prone: 'Melee advantage, ranged disadvantage against you',
  invisible: 'Advantage on attacks, disadvantage against you',
  dodge: 'All attacks against you have disadvantage',
  help: 'Give an ally advantage on their next check or attack',
};

export const SPEED_REFERENCE = {
  standard: '30ft (6 squares on a grid)',
  dash: 'Double your speed for the turn',
  difficultTerrain: 'Costs 2ft per 1ft of movement',
  standing: 'Costs half your speed (not half remaining movement)',
  climbing: 'Costs 2ft per 1ft (like difficult terrain)',
  swimming: 'Costs 2ft per 1ft (like difficult terrain)',
  crawling: 'Costs 2ft per 1ft',
  jumping: {
    long: 'STR score in feet (running) or half (standing)',
    high: '3 + STR mod feet (running) or half (standing)',
  },
};

export const DAMAGE_TYPES = [
  'Bludgeoning', 'Piercing', 'Slashing',
  'Acid', 'Cold', 'Fire', 'Lightning', 'Thunder',
  'Force', 'Necrotic', 'Poison', 'Psychic', 'Radiant',
];

export const REST_SHORTHAND = {
  shortRest: {
    duration: '1 hour',
    recover: 'Hit dice healing, Warlock slots, Fighter Action Surge, Monk ki, Channel Divinity, Bardic Inspiration (5+)',
    doesNot: 'Most spell slots, long rest features, exhaustion',
  },
  longRest: {
    duration: '8 hours',
    recover: 'All HP, half hit dice (min 1), all spell slots, all class features, 1 exhaustion level',
    restrictions: 'Once per 24 hours, 6 hours sleep minimum',
  },
};

export const CONCENTRATION_SHORTHAND = {
  maxSpells: 1,
  breakDC: 'DC 10 or half damage taken, whichever is higher',
  bonuses: ['War Caster: advantage on concentration saves', 'Resilient (CON): +proficiency to CON saves', 'CON +5: +5 to all saves'],
  whileConcentrating: 'Can still cast non-concentration spells, attack, move normally',
};

export const VISION_SHORTHAND = {
  brightLight: 'Normal vision. No penalties.',
  dimLight: 'Lightly obscured. Disadvantage on Perception (sight).',
  darkness: 'Heavily obscured. Effectively blind without darkvision or light.',
  darkvision: 'Darkness → dim light (still disadvantage on Perception). Dim → bright.',
  blindsight: 'Perfect awareness in range. Ignores all visual obstructions.',
  truesight: 'See in darkness, see invisible, see through illusions, see into Ethereal. 120ft usually.',
};

export function attackRoll(abilityMod, profBonus, otherBonuses) {
  return { bonus: abilityMod + profBonus + otherBonuses, formula: `d20 + ${abilityMod + profBonus + otherBonuses}` };
}

export function saveDC(abilityMod, profBonus) {
  return 8 + abilityMod + profBonus;
}

export function concentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function jumpDistance(strScore, running) {
  return { long: running ? strScore : Math.floor(strScore / 2), high: running ? 3 + Math.floor((strScore - 10) / 2) : Math.floor((3 + Math.floor((strScore - 10) / 2)) / 2) };
}
