/**
 * playerNovaRoundPlanner.js
 * Player Mode: Planning and executing maximum damage rounds
 * Pure JS — no React dependencies.
 */

export const NOVA_ROUND_DEFINED = {
  definition: 'A "nova round" is when you dump all available resources into one devastating turn of maximum damage.',
  when: ['Boss fight (the big one)', 'Enemy is about to escape', 'Enemy is paralyzed/stunned (auto-crit window)', 'Party has established clear advantage and wants to end the fight'],
  rules: ['Don\'t nova on trash mobs — save it for bosses', 'Coordinate with the party for simultaneous nova', 'Make sure buffs are up before nova round (Haste, Bless, etc.)'],
};

export const CLASS_NOVA_DAMAGE = [
  {
    class: 'Paladin',
    level: 5,
    nova: '2 attacks + Divine Smite on both + Smite spell',
    damage: '2d8+8 (weapon) + 4d8 (smite×2) + 2d8 (smite spell) = 8d8+8 (avg 44)',
    maxDamage: '72',
    resources: '3 spell slots (1st-2nd level)',
    note: 'On a critical hit, ALL dice double. Crit smite = 8d8+8 weapon + 8d8 smite = insane.',
  },
  {
    class: 'Fighter (Battle Master)',
    level: 5,
    nova: 'Action Surge → 4 attacks + superiority dice',
    damage: '4d8+20 (longsword) + 4d8 (maneuvers) = 8d8+20 (avg 56)',
    maxDamage: '84',
    resources: 'Action Surge (1) + 4 superiority dice',
    note: 'With GWM: 4×(2d6+15) = 8d6+60 = avg 88. With Action Surge coming back on short rest.',
  },
  {
    class: 'Rogue (Assassin)',
    level: 5,
    nova: 'Surprise round: auto-crit Sneak Attack',
    damage: '2d6+5 (rapier crit) + 6d6 (sneak attack crit) = 8d6+5 (avg 33)',
    maxDamage: '53',
    resources: 'Requires surprise (setup)',
    note: 'Add Crossbow Expert or multiclass Fighter for Action Surge + second Sneak Attack.',
  },
  {
    class: 'Sorcerer',
    level: 5,
    nova: 'Quickened Fireball + Fire Bolt',
    damage: '8d6 (Fireball) + 2d10 (Fire Bolt) = 8d6+2d10 (avg 39 single target)',
    maxDamage: '68 (single)',
    resources: '3rd-level slot + 2 sorcery points',
    note: 'Fireball hits multiple targets. Against 4 enemies: avg 112 total damage.',
  },
  {
    class: 'Warlock (Hexblade)',
    level: 5,
    nova: 'Hex + 3 Eldritch Blast beams + Hexblade\'s Curse',
    damage: '3d10+15 (EB+CHA) + 3d6 (Hex) + 9 (Curse profit) = 3d10+3d6+24 (avg 45)',
    maxDamage: '72 per round sustained',
    resources: 'Hex (1 slot) + Curse (short rest)',
    note: 'This is SUSTAINED, not burst. Warlock novas are consistent every round.',
  },
  {
    class: 'Wizard (Evocation)',
    level: 9,
    nova: 'Empowered Evocation + highest damage spell',
    damage: 'Cone of Cold: 8d8+5 (avg 41 per target). Against 4 = 164 average.',
    maxDamage: '69 per target',
    resources: '5th-level slot',
    note: 'Sculpt Spells lets you exclude allies from AoE. Guilt-free Fireball.',
  },
];

export const PARTY_NOVA_COMBO = [
  { setup: 'Hold Person → Everyone nova on paralyzed target', effect: 'All melee attacks within 5ft are AUTO-CRITS. Devastating.', coordinator: 'Caster holds, everyone else attacks.' },
  { setup: 'Faerie Fire → Full party attacks with advantage', effect: 'Advantage on all attacks. Higher hit rate = more damage lands.', coordinator: 'Cast on enemies, then everyone focuses one target.' },
  { setup: 'Stunning Strike → Party focuses stunned target', effect: 'Stunned = incapacitated, auto-fail STR/DEX, advantage on attacks.', coordinator: 'Monk stuns, party nukes.' },
  { setup: 'Haste on Fighter → Action Surge with Haste', effect: '3 actions worth of attacks. 6-8 attacks at level 11.', coordinator: 'Caster Hastes Fighter, Fighter novas next turn.' },
  { setup: 'Bestow Curse + Hex + attacks', effect: 'Extra d6 + d8 necrotic per hit, stacking damage.', coordinator: 'Warlock applies both, then blasts.' },
];

export function calculateNovaDamage(attacks, damagePerHit, bonusDice, bonusDieSize, flatBonus) {
  const weaponDamage = attacks * damagePerHit;
  const bonusDamage = bonusDice * ((bonusDieSize + 1) / 2);
  return {
    average: Math.round(weaponDamage + bonusDamage + (flatBonus || 0)),
    max: (attacks * damagePerHit * 1.5) + (bonusDice * bonusDieSize) + (flatBonus || 0),
    attacks,
  };
}

export function getClassNova(className) {
  return CLASS_NOVA_DAMAGE.find(c =>
    c.class.toLowerCase().includes((className || '').toLowerCase())
  ) || null;
}
