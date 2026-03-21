/**
 * playerHadozeeGuide.js
 * Player Mode: Hadozee race guide — the gliding space monkeys
 * Pure JS — no React dependencies.
 */

export const HADOZEE_BASICS = {
  race: 'Hadozee',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Medium or Small (choose)',
  type: 'Humanoid',
  languages: ['Common', 'one of your choice'],
  theme: 'Simian humanoids with gliding membranes. Spelljammer crew. Agile climbers.',
};

export const HADOZEE_TRAITS = [
  { trait: 'Dexterous Feet', effect: 'Feet are as dexterous as hands. Can use feet to manipulate objects, open doors, wield items.', rating: 'B', note: 'Utility for item interaction. Can hold things with feet while hands are occupied.' },
  { trait: 'Glide', effect: 'When falling, glide horizontally 5ft for every 1ft descended. No fall damage if you glide.', rating: 'A', note: 'Negate fall damage entirely. Move horizontally while descending. Pseudo-flight from high points.' },
  { trait: 'Hadozee Dodge', effect: 'Reaction: reduce damage by 1d6 + PB. PB uses per long rest.', rating: 'A', note: 'Like a weaker Shield. Flat damage reduction. At L9: 1d6+4, 4 times/LR. Good survivability.' },
];

export const HADOZEE_BUILDS = [
  { build: 'Rogue', why: 'Hadozee Dodge stacks with Uncanny Dodge. Glide for positioning. Dexterous Feet for extra item use.', rating: 'A' },
  { build: 'Monk', why: 'Hadozee Dodge + Patient Defense. Glide for aerial movement. Feet dexterity fits thematically.', rating: 'A' },
  { build: 'Ranger', why: 'Glide for terrain traversal. Hadozee Dodge for survivability. Solid all-around martial race.', rating: 'A' },
  { build: 'Wizard/Sorcerer', why: 'Hadozee Dodge reduces damage = fewer concentration checks. Glide as escape option. Squishy caster protection.', rating: 'A' },
];

export function hadozeeDodgeReduction(proficiencyBonus) {
  return 3.5 + proficiencyBonus; // 1d6 avg + PB
}

export function hadozeeDodgeUses(proficiencyBonus) {
  return proficiencyBonus;
}

export function glideDistance(heightFallen) {
  return heightFallen * 5; // 5ft horizontal per 1ft descended
}
