/**
 * playerBestFifthLevelSpellsGuide.js
 * Player Mode: Best L5 spells — game-changing power
 * Pure JS — no React dependencies.
 */

export const BEST_L5_SPELLS = [
  { spell: 'Wall of Force', classes: ['Wizard'], rating: 'S+', note: 'INVINCIBLE wall. No save. Can\'t be dispelled by Dispel Magic. 10 minutes.' },
  { spell: 'Animate Objects', classes: ['Bard', 'Sorcerer', 'Wizard', 'Artificer'], rating: 'S', note: '10 tiny objects: +8 attack, 1d4+4 each. 10 attacks/round. Insane DPR.' },
  { spell: 'Synaptic Static', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', note: '8d6 psychic (INT save, weak save!) + -1d4 debuff. Best L5 damage spell.' },
  { spell: 'Steel Wind Strike', classes: ['Ranger', 'Wizard'], rating: 'A+', note: 'Melee spell attack on 5 targets. 6d10 force each. Teleport after.' },
  { spell: 'Greater Restoration', classes: ['Bard', 'Cleric', 'Druid', 'Artificer'], rating: 'A+', note: 'Removes charm, petrify, curse, ability reduction, max HP reduction, exhaustion.' },
  { spell: 'Raise Dead', classes: ['Bard', 'Cleric', 'Paladin'], rating: 'A', note: 'Resurrect dead ≤10 days. 500gp diamond. -4 penalty for 4 LRs.' },
  { spell: 'Holy Weapon', classes: ['Cleric', 'Paladin'], rating: 'A+', note: '+2d8 radiant per hit for 1 hour. Concentration. Martial buff.' },
  { spell: 'Teleportation Circle', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'A', note: 'Teleport party to known circle. Long-range travel.' },
  { spell: 'Destructive Wave', classes: ['Paladin'], rating: 'A+', note: '5d6 thunder + 5d6 radiant. 30ft AoE. CON save. Choose who it hits.' },
  { spell: 'Cone of Cold', classes: ['Sorcerer', 'Wizard'], rating: 'A', note: '8d8 cold. 60ft cone. Bigger area than Fireball but cone shaped.' },
  { spell: 'Conjure Elemental', classes: ['Druid', 'Wizard'], rating: 'A', note: 'Summon powerful elemental. Risk: goes hostile if concentration breaks.' },
  { spell: 'Dawn', classes: ['Cleric', 'Wizard'], rating: 'A', note: '4d10 radiant in 30ft cylinder. Moves each turn. Anti-undead.' },
  { spell: 'Bigby\'s Hand', classes: ['Sorcerer', 'Wizard', 'Artificer'], rating: 'A', note: 'Versatile force hand. Grapple, shove, punch, block.' },
];

export const L5_CLASS_PRIORITIES = {
  wizard: 'Wall of Force > Animate Objects > Synaptic Static > Steel Wind Strike.',
  cleric: 'Greater Restoration > Holy Weapon > Dawn.',
  druid: 'Greater Restoration > Conjure Elemental > Mass Cure Wounds.',
  sorcerer: 'Synaptic Static > Animate Objects > Wall of Force (via Clockwork).',
  bard: 'Synaptic Static > Animate Objects > Greater Restoration.',
  warlock: 'Synaptic Static > Hold Monster.',
  paladin: 'Destructive Wave > Holy Weapon > Raise Dead.',
  ranger: 'Steel Wind Strike > Greater Restoration.',
};

export const L5_TIPS = [
  'Wall of Force is arguably the strongest non-L9 spell in the game.',
  'Animate Objects: 10 tiny objects = best sustained DPR in the game.',
  'Synaptic Static: Fireball damage + debuff + targets the weakest save (INT).',
  'Greater Restoration fixes almost anything. Always have it prepared.',
  'Steel Wind Strike: force damage, hits 5 targets, teleport = best Ranger spell.',
  'Wall of Force + Sickening Radiance = "microwave" = guaranteed kill.',
];
