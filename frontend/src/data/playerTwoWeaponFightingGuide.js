/**
 * playerTwoWeaponFightingGuide.js
 * Player Mode: Two-weapon fighting (dual wielding) mechanics and optimization
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  baseRule: 'When you Attack with a light melee weapon, you can use bonus action to attack with a different light weapon in your other hand.',
  noDamageMod: 'You DON\'T add your ability modifier to the offhand damage (unless you have Two-Weapon Fighting style).',
  lightWeapons: ['Dagger', 'Handaxe', 'Light Hammer', 'Scimitar', 'Shortsword', 'Sickle', 'Club'],
  dualWielderFeat: 'Dual Wielder feat: can use non-light one-handed weapons (longsword, battleaxe, war pick). +1 AC. Draw two weapons at once.',
  note: 'TWF gives a bonus action attack but competes with other bonus actions (Cunning Action, Rage, spellcasting).',
};

export const TWF_FIGHTING_STYLE = {
  name: 'Two-Weapon Fighting',
  class: 'Fighter, Ranger',
  effect: 'Add ability modifier to offhand damage.',
  impact: 'Without style: 1d6 offhand. With style: 1d6+5 offhand (at +5 STR/DEX). Big difference.',
  note: 'Essential for TWF builds. Without it, the bonus action attack is anemic.',
};

export const TWF_VS_OTHER_STYLES = [
  { style: 'Two-Weapon Fighting', avgDPRAtL5: 'Main: 2 × (d6+5) + Offhand: (d6+5) = 3 × 8.5 = 25.5 (before hit chance)', note: '3 attacks at L5. No feat needed. But uses bonus action every turn.' },
  { style: 'Great Weapon Fighting (GWM)', avgDPRAtL5: '2 × (2d6+5+10) = 2 × 22 = 44 at -5 (before hit chance)', note: 'Higher ceiling but misses more. With advantage, GWM is far superior.' },
  { style: 'Dueling + Shield', avgDPRAtL5: '2 × (d8+5+2) = 2 × 11.5 = 23 with +2 AC', note: 'Less damage than TWF but +2 AC from shield. Tank option.' },
  { style: 'Polearm Master', avgDPRAtL5: '2 × (d10+5) + 1 × (d4+5) = 17.5 + 7.5 = 25 + reach', note: 'Similar damage to TWF but with 10ft reach and reaction attacks on approach.' },
];

export const TWF_BEST_CLASSES = [
  { class: 'Rogue', why: 'Offhand is a second chance to land Sneak Attack if main hand misses. Doesn\'t need Fighting Style.', rating: 'A', note: 'SA only applies once per turn. Offhand is insurance, not extra SA.' },
  { class: 'Ranger', why: 'TWF Fighting Style. Hunter\'s Mark adds 1d6 to EACH hit (3 hits = 3d6 extra). Synergizes well.', rating: 'A' },
  { class: 'Fighter', why: 'TWF Style + lots of features. But competes with GWM/PAM which are better.', rating: 'B' },
  { class: 'Barbarian', why: 'Rage damage applies to offhand too. But uses bonus action that could be Rage/Reckless setup.', rating: 'B' },
];

export const TWF_OPTIMIZATION = [
  { tip: 'Dual Wielder feat', detail: 'Use longswords (1d8) instead of shortswords (1d6). +1 damage per attack. +1 AC. Draw both weapons.', rating: 'A' },
  { tip: 'Hunter\'s Mark stacking', detail: 'Ranger: HM adds 1d6 to each hit. 3 attacks = 3d6 extra (10.5 avg). Best TWF synergy.', rating: 'S' },
  { tip: 'Nick property (2024 rules)', detail: '2024 PHB: Nick weapon property allows offhand attack without using bonus action. Game-changer for TWF.', rating: 'S (2024 only)' },
  { tip: 'Rogue SA insurance', detail: 'Miss with main hand? Bonus action offhand. Still have chance to land Sneak Attack.', rating: 'A' },
  { tip: 'Flame Tongue dual wield', detail: '2d6 extra fire per hit. 3 hits = 6d6 extra fire (21 avg). If you get 2 Flame Tongues, devastating.', rating: 'S (magic item dependent)' },
];

export function twfDPR(mainDie, offDie, abilityMod, profBonus, targetAC, hasStyle = false, bonusDamagePerHit = 0) {
  const attackBonus = abilityMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const mainAvg = (mainDie / 2 + 0.5) + abilityMod + bonusDamagePerHit;
  const offAvg = (offDie / 2 + 0.5) + (hasStyle ? abilityMod : 0) + bonusDamagePerHit;
  return hitChance * (mainAvg * 2 + offAvg); // 2 main hand attacks at L5 + 1 offhand
}
