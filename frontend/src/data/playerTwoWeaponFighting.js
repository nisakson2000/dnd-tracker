/**
 * playerTwoWeaponFighting.js
 * Player Mode: Two-weapon fighting (dual wielding) rules and optimization
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  requirement: 'Both weapons must have the Light property (unless you have Dual Wielder feat).',
  offhandAttack: 'Bonus action: attack with the other weapon.',
  damage: 'Don\'t add ability modifier to off-hand damage (unless you have TWF fighting style).',
  drawing: 'Draw/stow one weapon per interaction. Need Dual Wielder feat for two draws.',
  note: 'Cannot use shield while dual wielding.',
};

export const TWF_PROGRESSION = [
  { tier: 'Base TWF', weapons: 'Two Light weapons', offhandDamage: 'Weapon die only', note: 'No ability mod on off-hand' },
  { tier: 'TWF Fighting Style', weapons: 'Two Light weapons', offhandDamage: 'Weapon die + ability mod', note: 'Fighting style adds ability mod' },
  { tier: 'Dual Wielder Feat', weapons: 'Any one-handed weapons', offhandDamage: 'Weapon die (+ mod with style)', note: '+1 AC, can use non-Light weapons, draw 2 at once' },
];

export const GOOD_TWF_WEAPONS = [
  { weapon: 'Shortsword + Shortsword', damage: '1d6 + 1d6', type: 'piercing', note: 'Best Light weapon damage die' },
  { weapon: 'Scimitar + Scimitar', damage: '1d6 + 1d6', type: 'slashing', note: 'Finesse + Light' },
  { weapon: 'Rapier + Rapier (Dual Wielder)', damage: '1d8 + 1d8', type: 'piercing', note: 'Requires Dual Wielder feat' },
  { weapon: 'Longsword + Longsword (Dual Wielder)', damage: '1d8 + 1d8', type: 'slashing', note: 'Requires Dual Wielder feat' },
  { weapon: 'Hand Crossbow + Hand Crossbow (Crossbow Expert)', damage: '1d6 + 1d6', type: 'piercing', note: 'Requires Crossbow Expert feat, ranged option' },
];

export const TWF_INTERACTIONS = [
  { feature: 'Sneak Attack', interaction: 'Can apply on off-hand if conditions met — gives second chance to land Sneak Attack.' },
  { feature: 'Hunter\'s Mark', interaction: 'Both attacks trigger +1d6. Great synergy.' },
  { feature: 'Hex', interaction: 'Both attacks trigger +1d6 necrotic. Great synergy.' },
  { feature: 'Rage', interaction: 'Both attacks get rage bonus damage.' },
  { feature: 'Extra Attack', interaction: 'Extra Attack is part of the Attack action. Off-hand is still bonus action (1 attack only).' },
  { feature: 'Flurry of Blows', interaction: 'Competes for bonus action. Can\'t do both in same turn.' },
];

export function calculateTWFDamage(mainDie, offDie, abilityMod, hasTWFStyle = false, hasHuntersMark = false) {
  const mainDmg = mainDie / 2 + 0.5 + abilityMod;
  const offDmg = offDie / 2 + 0.5 + (hasTWFStyle ? abilityMod : 0);
  const hm = hasHuntersMark ? 7 : 0; // 2 * 3.5
  return { mainHand: mainDmg, offHand: offDmg, total: mainDmg + offDmg + hm, perRound: `${mainDmg.toFixed(1)} + ${offDmg.toFixed(1)}${hm ? ` + ${hm} (Hunter's Mark)` : ''}` };
}
