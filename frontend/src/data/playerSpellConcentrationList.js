/**
 * playerSpellConcentrationList.js
 * Player Mode: Top concentration spells ranked by impact and class
 * Pure JS — no React dependencies.
 */

export const TOP_CONCENTRATION_SPELLS = [
  { spell: 'Bless', level: 1, classes: ['Cleric', 'Paladin'], effect: '+1d4 to attacks and saves for 3 creatures.', rating: 'S', note: 'Best low-level concentration. Scales with party size.' },
  { spell: 'Faerie Fire', level: 1, classes: ['Bard', 'Druid'], effect: 'Advantage on attacks against creatures in 20ft cube.', rating: 'S', note: 'Negates invisibility. Great for Rogues (auto Sneak Attack).' },
  { spell: 'Hunter\'s Mark', level: 1, classes: ['Ranger'], effect: '+1d6 damage per hit. Track the target.', rating: 'A', note: 'Core Ranger spell. Transfer to new target as bonus action.' },
  { spell: 'Hex', level: 1, classes: ['Warlock'], effect: '+1d6 necrotic per hit. Target has disadvantage on one ability\'s checks.', rating: 'A', note: 'Core Warlock spell. Hex WIS for easier control spells.' },
  { spell: 'Spirit Guardians', level: 3, classes: ['Cleric'], effect: '3d8 radiant/necrotic to enemies starting turn within 15ft.', rating: 'S', note: 'Best Cleric damage spell. Also halves enemy speed.' },
  { spell: 'Hypnotic Pattern', level: 3, classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], effect: 'Charmed + incapacitated in 30ft cube. WIS save.', rating: 'S', note: 'Can end entire encounters. Affected creatures don\'t save again unless damaged.' },
  { spell: 'Haste', level: 3, classes: ['Sorcerer', 'Wizard'], effect: 'Double speed, +2 AC, extra action.', rating: 'A', note: 'Incredible on martial characters. WARNING: losing concentration = target loses a turn.' },
  { spell: 'Web', level: 2, classes: ['Sorcerer', 'Wizard'], effect: 'Restrained in 20ft cube. DEX save.', rating: 'A', note: 'Excellent control. Flammable — Fire + Web = extra damage.' },
  { spell: 'Hold Person', level: 2, classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], effect: 'Paralyzed (auto-crit within 5ft). WIS save.', rating: 'A', note: 'Devastating if they fail. Only works on humanoids.' },
  { spell: 'Banishment', level: 4, classes: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'], effect: 'Remove creature from combat. CHA save.', rating: 'S', note: 'Permanently removes extraplanar creatures if held 1 minute.' },
  { spell: 'Wall of Force', level: 5, classes: ['Wizard'], effect: 'Impenetrable invisible wall. No save.', rating: 'S', note: 'Splits encounters. Only Disintegrate goes through it.' },
  { spell: 'Polymorph', level: 4, classes: ['Bard', 'Druid', 'Sorcerer', 'Wizard'], effect: 'Transform creature into beast.', rating: 'A', note: 'Turn ally into Giant Ape (157 HP). Or turn enemy into snail.' },
  { spell: 'Conjure Animals', level: 3, classes: ['Druid', 'Ranger'], effect: 'Summon beasts to fight.', rating: 'A', note: '8 × CR 1/4 beasts = massive damage/action economy.' },
  { spell: 'Pass without Trace', level: 2, classes: ['Druid', 'Ranger'], effect: '+10 to Stealth for entire party.', rating: 'S', note: 'Makes the whole party invisible-level stealthy.' },
];

export const CONCENTRATION_MANAGEMENT = [
  'Protect your concentration at all costs — losing it wastes the spell slot.',
  'War Caster feat: advantage on concentration saves.',
  'Resilient (CON): add proficiency to CON saves.',
  'War Caster + Resilient (CON) together = almost never fail concentration.',
  'Stay out of melee range to avoid concentration checks.',
  'If you take multiple hits, you make a separate save for each.',
  'DC = 10 or half damage taken, whichever is higher.',
  'You can only concentrate on ONE spell at a time.',
];

export function getTopSpellsForClass(className) {
  return TOP_CONCENTRATION_SPELLS.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getSpellsByRating(rating) {
  return TOP_CONCENTRATION_SPELLS.filter(s => s.rating === rating);
}
