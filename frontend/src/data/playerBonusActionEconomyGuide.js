/**
 * playerBonusActionEconomyGuide.js
 * Player Mode: Bonus action conflicts and optimization per class
 * Pure JS — no React dependencies.
 */

export const BONUS_ACTION_CONFLICTS = {
  concept: 'Many features compete for your bonus action. Understanding conflicts helps you plan your turns efficiently.',
  rule: 'Only ONE bonus action per turn, regardless of how many bonus action features you have.',
  common_conflicts: [
    { class: 'Monk', conflict: 'Martial Arts unarmed strike vs Flurry of Blows vs Step of the Wind vs Patient Defense', resolution: 'Flurry for damage. Step of Wind for Dash/Disengage. Patient Defense for tanking. Martial Arts if ki is low.' },
    { class: 'Rogue', conflict: 'Cunning Action (Dash/Disengage/Hide) vs Offhand attack vs Steady Aim', resolution: 'Hide for advantage → SA. Disengage for safety. Offhand if you missed with main hand. Steady Aim if not moving.' },
    { class: 'Cleric', conflict: 'Spiritual Weapon attack vs Healing Word vs Spirit Guardians (first turn)', resolution: 'Spirit Guardians as ACTION turn 1. Spiritual Weapon turn 2. After that, SW bonus action attack every turn.' },
    { class: 'Barbarian', conflict: 'Rage (turn 1) vs nothing (after rage is up)', resolution: 'Rage turn 1. After that, Barbarians often lack bonus actions. Consider PAM or TWF.' },
    { class: 'Paladin', conflict: 'Smite spells (bonus action to activate) vs Misty Step vs Shield of Faith', resolution: 'Concentration buffs turn 1. Smite spells on key hits. Misty Step for repositioning.' },
    { class: 'Ranger', conflict: 'Hunter\'s Mark vs TWF offhand vs Misty Step vs Nature\'s Veil', resolution: 'Hunter\'s Mark turn 1 or when target dies. TWF after HM is running. Nature\'s Veil when needed.' },
    { class: 'Warlock', conflict: 'Hex vs Hexblade\'s Curse vs Misty Step', resolution: 'Hexblade\'s Curse on boss. Hex on regular enemies. Misty Step for emergencies.' },
  ],
};

export const TURN_PLANNING_TEMPLATE = {
  turn1: {
    action: 'Cast concentration spell (Spirit Guardians, Bless, Conjure Animals)',
    bonusAction: 'Healing Word if needed, or Spiritual Weapon, or Rage, or Hex',
    reaction: 'Shield/Counterspell/Opportunity Attack if triggered',
    movement: 'Position optimally for concentration spell or melee range',
  },
  turnN: {
    action: 'Attack/Cantrip/Dodge',
    bonusAction: 'Spiritual Weapon attack/Offhand attack/Cunning Action',
    reaction: 'Shield/Counterspell/Sentinel',
    movement: 'Maintain position or pursue targets',
  },
};

export const CLASSES_WITH_NO_BONUS_ACTION = {
  issue: 'Some classes/builds lack reliable bonus action uses. This wastes a third of your action economy.',
  solutions: [
    { method: 'Two-Weapon Fighting', cost: 'Dual light weapons', note: 'Extra attack. Anyone can do this. Uses bonus action every turn.' },
    { method: 'Polearm Master feat', cost: 'Feat', note: 'Bonus action 1d4 attack + reaction on approach. Best martial feat.' },
    { method: 'Shield Master feat', cost: 'Feat', note: 'Bonus action shove. Knock prone for advantage on remaining attacks.' },
    { method: 'Crossbow Expert feat', cost: 'Feat', note: 'Bonus action hand crossbow attack. Best ranged bonus action.' },
    { method: 'Telekinetic feat', cost: 'Half-feat', note: 'Bonus action 5ft shove. No resource cost. Every turn. Works for casters.' },
    { method: 'Spiritual Weapon spell', cost: 'L2 spell slot', note: 'Best caster bonus action. 1d8+mod force damage. No concentration.' },
    { method: 'Misty Step spell', cost: 'L2 spell slot', note: 'Not every turn, but excellent emergency repositioning.' },
  ],
};

export function turnEfficiency(usedAction, usedBonusAction, usedReaction, usedMovement) {
  let efficiency = 0;
  if (usedAction) efficiency += 40;
  if (usedBonusAction) efficiency += 30;
  if (usedReaction) efficiency += 20;
  if (usedMovement) efficiency += 10;
  return efficiency; // out of 100
}
