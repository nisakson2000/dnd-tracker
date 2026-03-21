/**
 * playerActionEconomyMasterGuide.js
 * Player Mode: Action economy — the most important concept in 5e combat
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  perTurn: {
    action: '1 action (Attack, Cast Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object).',
    bonusAction: '1 bonus action (only if a feature/spell specifically grants one).',
    reaction: '1 reaction (opportunity attack, Shield, Counterspell). Resets at start of your turn.',
    movement: 'Full movement speed. Can split before/after actions.',
    freeInteraction: 'One free object interaction (draw weapon, open door, drop item).',
  },
  note: 'Action economy is THE most important concept in 5e. More actions = more power.',
};

export const ACTION_ECONOMY_BOOSTERS = [
  { source: 'Action Surge', type: 'Extra action', cost: '1/SR', note: 'Best action economy feature. Two full actions in one turn.' },
  { source: 'Haste', type: 'Limited extra action', cost: 'Concentration', note: 'Extra action (1 attack, Dash, etc.) + speed + AC.' },
  { source: 'PAM/CBE BA attack', type: 'BA attack', cost: 'Feat', note: 'Extra attack per turn. Major DPR increase.' },
  { source: 'Spiritual Weapon', type: 'BA attack', cost: 'L2 slot', note: 'BA attack every turn for 10 rounds. No concentration.' },
  { source: 'Quicken Spell', type: 'BA spellcast', cost: '2 SP', note: 'Cast spell as BA + cantrip as action.' },
  { source: 'Sentinel/War Caster OA', type: 'Reaction attack/spell', cost: 'Feat', note: 'Extra attack/spell on other turns.' },
];

export const ACTION_ECONOMY_TRAPS = [
  { trap: 'True Strike', why: 'Costs action for advantage on 1 attack next turn. Just attack twice instead.' },
  { trap: 'Healing in combat', why: 'Healing rarely outpaces damage. Kill enemies instead. Only heal to pick up unconscious allies.' },
  { trap: 'Two leveled spells', why: 'BA spell (Healing Word) = action must be cantrip. Can\'t cast two leveled spells in one turn.' },
  { trap: 'Unused bonus action', why: 'Empty BA = wasted potential. Take feats that use BA if your class doesn\'t.' },
];

export const ACTION_ECONOMY_RULES = [
  { rule: 'More attacks = more power', detail: 'Each attack triggers on-hit effects (Sneak Attack, Smite, Hex, GWM).' },
  { rule: 'Concentration spells multiply actions', detail: 'Spirit Guardians: 1 action → 50 rounds of damage. Best efficiency in the game.' },
  { rule: 'Kill > Control > Heal', detail: 'Dead enemies deal 0 damage. Controlled enemies deal less. Healed allies still get hit.' },
  { rule: 'Reactions are free damage', detail: 'OA/Sentinel/War Caster = damage on other turns at no cost to yours.' },
];

export function actionsPerTurn(hasExtraAttack, hasPAM, hasActionSurge, hasHaste) {
  let attacks = hasExtraAttack ? 2 : 1;
  if (hasPAM) attacks += 1;
  if (hasActionSurge) attacks += (hasExtraAttack ? 2 : 1);
  if (hasHaste) attacks += 1;
  return { totalAttacks: attacks };
}
