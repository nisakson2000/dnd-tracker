/**
 * playerFireballVsOtherAoEGuide.js
 * Player Mode: AoE spell comparison — Fireball and alternatives
 * Pure JS — no React dependencies.
 */

export const AOE_SPELLS_RANKED = [
  { spell: 'Fireball', level: 3, damage: '8d6 fire (28 avg)', area: '20ft sphere', save: 'DEX', rating: 'S', note: 'Iconic. High damage for L3. Fire resistance is common though.' },
  { spell: 'Spirit Guardians', level: 3, damage: '3d8/round (13.5)', area: '15ft radius self', save: 'WIS', rating: 'S+', note: 'More total damage over combat. Cleric-only.' },
  { spell: 'Hypnotic Pattern', level: 3, damage: '0 (control)', area: '30ft cube', save: 'WIS', rating: 'S+', note: 'No damage but incapacitates. Better than damage in many fights.' },
  { spell: 'Lightning Bolt', level: 3, damage: '8d6 lightning (28)', area: '100ft line', save: 'DEX', rating: 'A+', note: 'Same damage as Fireball. Line vs sphere. Less resistance issues.' },
  { spell: 'Shatter', level: 2, damage: '3d8 thunder (13.5)', area: '10ft sphere', save: 'CON', rating: 'A', note: 'Lower level, lower damage. Good at L2-4.' },
  { spell: 'Cone of Cold', level: 5, damage: '8d8 cold (36)', area: '60ft cone', save: 'CON', rating: 'A+', note: 'Higher damage but L5 slot. Cone shape is harder to use.' },
  { spell: 'Synaptic Static', level: 5, damage: '8d6 psychic (28)', area: '20ft sphere', save: 'INT', rating: 'S', note: 'Fireball damage + debuff (-1d6 attacks/checks/concentration). Psychic = rarely resisted. INT save = weak save.' },
  { spell: 'Vitriolic Sphere', level: 4, damage: '10d4+5d4 (initial + acid)', area: '20ft sphere', save: 'DEX', rating: 'A', note: 'Acid damage. Bonus damage next turn.' },
  { spell: 'Ice Storm', level: 4, damage: '2d8+4d6 bludgeoning/cold (23)', area: '20ft cylinder', save: 'DEX', rating: 'B+', note: 'Creates difficult terrain. Less damage than expected for L4.' },
  { spell: 'Meteor Swarm', level: 9, damage: '40d6 fire/bludgeoning (140)', area: '4×40ft spheres', save: 'DEX', rating: 'S+', note: 'The ultimate AoE. 140 avg damage in massive area. Campaign-ender.' },
];

export const FIREBALL_OPTIMIZATION = [
  { tip: 'Careful Spell (Sorcerer)', detail: 'Choose CHA mod creatures to auto-succeed on save. Allies safe.', rating: 'S' },
  { tip: 'Evoker Sculpt Spells', detail: 'Choose level+1 creatures to auto-succeed AND take no damage. Best Fireball.', rating: 'S+' },
  { tip: 'Empowered Spell', detail: 'Reroll up to CHA mod damage dice. Better average damage.', rating: 'A' },
  { tip: 'Upcast to L4+', detail: '+1d6 per level above 3rd. L5 Fireball = 10d6 (35 avg).', rating: 'A' },
  { tip: 'Elemental Adept (Fire)', detail: 'Treat 1s as 2s on fire damage. Ignore fire resistance.', rating: 'B+' },
];

export const WHEN_NOT_TO_FIREBALL = [
  'Allies in the blast zone (unless Sculpt/Careful).',
  'Fire-resistant or immune enemies (very common at higher levels).',
  'Few enemies (1-2 targets = single-target spell is better).',
  'Indoors with flammable objects or important loot.',
  'When control (Hypnotic Pattern) would end the fight faster.',
  'When sustained damage (Spirit Guardians) would deal more over the fight.',
];

export const DAMAGE_TYPE_CONSIDERATIONS = {
  fire: { resistance: 'Very common (40+ monsters)', immunity: 'Common (devils, elementals)', note: 'Worst damage type by resistance count.' },
  cold: { resistance: 'Moderate', immunity: 'Some', note: 'Better than fire. Fewer resistances.' },
  lightning: { resistance: 'Moderate', immunity: 'Fewer than fire', note: 'Good alternative to fire.' },
  thunder: { resistance: 'Rare', immunity: 'Very rare', note: 'Excellent. Very few resistances.' },
  psychic: { resistance: 'Very rare', immunity: 'Constructs/some undead', note: 'Best non-force damage type.' },
  force: { resistance: 'Essentially none', immunity: 'Essentially none', note: 'Best damage type in the game. Almost never resisted.' },
  radiant: { resistance: 'Rare', immunity: 'None', note: 'Excellent. Bonus: kills some creatures that regenerate.' },
  necrotic: { resistance: 'Moderate (undead)', immunity: 'Some undead', note: 'Bad against undead. Good otherwise.' },
};
