/**
 * playerDualWieldOptimization.js
 * Player Mode: Dual wielding rules, optimization, and when to dual wield vs other styles
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  basic: 'When you take the Attack action with a light melee weapon, you can use your bonus action to attack with a different light weapon in your other hand.',
  abilityMod: 'You don\'t add your ability modifier to the damage of the bonus action attack (unless you have the TWF fighting style).',
  lightWeapons: ['Dagger (1d4)', 'Handaxe (1d6)', 'Light Hammer (1d4)', 'Scimitar (1d6)', 'Shortsword (1d6)', 'Sickle (1d4)'],
  bestLightWeapons: 'Shortsword (1d6 piercing, finesse) or Scimitar (1d6 slashing).',
};

export const TWF_FIGHTING_STYLE = {
  name: 'Two-Weapon Fighting',
  effect: 'Add your ability modifier to the damage of the bonus action attack.',
  classes: ['Fighter', 'Ranger'],
  importance: 'Without this, you lose 3-5 damage per round. Critical for TWF builds.',
};

export const DUAL_WIELDER_FEAT = {
  name: 'Dual Wielder',
  benefits: ['+1 AC while wielding two melee weapons.', 'Dual wield non-light weapons (d8 instead of d6).', 'Draw or stow two weapons at once.'],
  rating: 'B',
};

export const TWF_VS_OTHER_STYLES = [
  { style: 'Two-Weapon Fighting', avgDPR: '1d6+MOD + 1d6+MOD', pros: 'Extra attack, more Sneak Attack chances, more damage riders', cons: 'Uses bonus action, lower per-hit, no shield' },
  { style: 'Great Weapon Master', avgDPR: '2d6+MOD+10', pros: 'Highest raw damage, BA on crit/kill', cons: '-5 to hit, no shield, two-handed' },
  { style: 'Sword and Board', avgDPR: '1d8+MOD', pros: '+2 AC, free bonus action', cons: 'Lowest damage' },
  { style: 'Polearm Master', avgDPR: '1d10+MOD + 1d4+MOD', pros: 'Reach, BA attack, OA on enter', cons: 'Uses BA, two-handed' },
];

export const TWF_CLASS_SYNERGY = [
  { class: 'Rogue', synergy: 'S', reason: 'Extra attack = extra Sneak Attack chance. Few BA conflicts. Best TWF class.' },
  { class: 'Ranger', synergy: 'A', reason: 'TWF style + Hunter\'s Mark on each hit.' },
  { class: 'Fighter', synergy: 'B', reason: 'TWF style available but GWM/PAM scale better with Extra Attack.' },
  { class: 'Paladin', synergy: 'A', reason: 'More attacks = more Smite chances.' },
  { class: 'Monk', synergy: 'F', reason: 'Martial Arts gives free BA unarmed. TWF is redundant.' },
];

export function twfDamage(mainDie, offDie, mod, hasTWFStyle, attacks) {
  const mainDmg = (mainDie / 2 + 0.5 + mod) * attacks;
  const offDmg = offDie / 2 + 0.5 + (hasTWFStyle ? mod : 0);
  return mainDmg + offDmg;
}

export function twfVsGreatsword(mod, gwmActive) {
  const twf = twfDamage(6, 6, mod, true, 1);
  const gs = 7 + mod + (gwmActive ? 10 : 0);
  return { twf, greatsword: gs, better: twf > gs ? 'TWF' : 'Greatsword' };
}
