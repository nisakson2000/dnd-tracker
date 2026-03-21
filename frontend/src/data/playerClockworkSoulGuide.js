/**
 * playerClockworkSoulGuide.js
 * Player Mode: Clockwork Soul Sorcerer — order and defense
 * Pure JS — no React dependencies.
 */

export const CLOCKWORK_BASICS = {
  class: 'Sorcerer (Clockwork Soul)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Mechanus-influenced sorcerer. Order, balance, and defense.',
  note: 'Tied with Aberrant Mind for best Sorcerer. Extra spells known + Armor of Agathys access + Bastion of Law is incredible.',
};

export const CLOCKWORK_FEATURES = [
  { feature: 'Clockwork Magic', level: 1, effect: 'Learn extra spells at each level (Alarm, Protection from Evil, etc.). Can swap each for abjuration/transmutation from Sorc/Warlock/Wizard list.', note: '10 extra spells known. Swap for Armor of Agathys, Counterspell, Wall of Force, etc.' },
  { feature: 'Restore Balance', level: 1, effect: 'Reaction: when a creature within 60ft rolls with advantage or disadvantage, cancel it (normal roll). PB times/long rest.', note: 'Cancel enemy advantage OR cancel ally disadvantage. No save. Just happens. PB times per day.' },
  { feature: 'Bastion of Law', level: 6, effect: 'Spend 1-5 sorcery points: create a ward on a creature. Ward has d8s = SP spent. When warded creature takes damage, reduce by rolling d8s from ward.', note: 'Spend 5 SP: ward with 5d8 (avg 22.5 damage absorbed). Like temporary HP but better — reduces each hit.' },
  { feature: 'Trance of Order', level: 14, effect: 'Bonus action for 1 minute: all attack rolls, ability checks, and saves treat rolls below 10 as 10. Once/LR or 7 SP.', note: 'MINIMUM ROLL OF 10. On attacks AND saves. You literally cannot roll below 10. Devastating reliability.' },
  { feature: 'Clockwork Cavalcade', level: 18, effect: 'Action: 30ft cube. Each creature you choose: restore up to 100 HP, repair magic items, end 6th level or lower spells. Once/LR or 7 SP.', note: 'Mass heal 100 HP + dispel all effects. Ultimate recovery tool.' },
];

export const CLOCKWORK_SPELL_SWAPS = [
  { original: 'Alarm (1st)', recommended: 'Armor of Agathys', reason: 'Temp HP + cold damage to melee attackers. Stacks with Bastion of Law.', rating: 'S' },
  { original: 'Aid (2nd)', recommended: 'Keep Aid or swap for Rope Trick', reason: 'Aid is great. But it\'s on your list already if you want it.', rating: 'A' },
  { original: 'Dispel Magic (3rd)', recommended: 'Counterspell or keep Dispel', reason: 'Counterspell is better than Dispel Magic in most situations.', rating: 'S' },
  { original: 'Freedom of Movement (4th)', recommended: 'Summon Construct or keep FoM', reason: 'Summon Construct is a solid summon. FoM is situationally amazing.', rating: 'A' },
  { original: 'Wall of Force (5th)', recommended: 'Keep Wall of Force', reason: 'NEVER swap this. Wall of Force is one of the best spells in the game. Auto-include.', rating: 'S' },
];

export const CLOCKWORK_TACTICS = [
  { tactic: 'Armor of Agathys + Bastion', detail: 'Cast Armor of Agathys (temp HP). Layer Bastion of Law on top. Bastion reduces incoming damage, preserving Agathys temp HP longer.', rating: 'S', note: 'Bastion absorbs damage before temp HP. Agathys deals cold damage when temp HP is hit. More temp HP = more retribution damage.' },
  { tactic: 'Restore Balance disruption', detail: 'Enemy has advantage from flanking/Pack Tactics? Cancel it. Ally has disadvantage from a condition? Cancel it.', rating: 'A', note: 'No save, no check. Just happens. Incredibly versatile disruption.' },
  { tactic: 'Trance of Order nova', detail: 'L14: minimum roll 10 on everything. Cantrips/attacks almost always hit. Saves almost always succeed.', rating: 'S' },
  { tactic: 'Wall of Force control', detail: 'Wall of Force: split the battlefield. Dome an enemy. Create a bridge. Unbreakable except by Disintegrate.', rating: 'S' },
  { tactic: 'Twin Bastion of Law', detail: 'Can\'t Twin Bastion (not a spell). But you can ward two party members at different times for full protection.', rating: 'A' },
];

export function bastionOfLawAbsorption(sorceryPointsSpent) {
  return sorceryPointsSpent * 4.5; // d8 avg per SP
}

export function armorOfAgathysTempHP(spellLevel) {
  return spellLevel * 5; // 5 per spell level
}

export function restoreBalanceUses(proficiencyBonus) {
  return proficiencyBonus;
}
