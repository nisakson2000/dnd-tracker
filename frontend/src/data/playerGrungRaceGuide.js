/**
 * playerGrungRaceGuide.js
 * Player Mode: Grung — poisonous frog with unique mechanics
 * Pure JS — no React dependencies.
 */

export const GRUNG_BASICS = {
  race: 'Grung',
  source: 'One Grung Above (DMs Guild supplement)',
  size: 'Small',
  speed: '25 feet',
  climbSpeed: '25 feet',
  traits: [
    { name: 'Arboreal Alertness', desc: 'Proficiency in Perception.' },
    { name: 'Poisonous Skin', desc: 'Creatures that touch you or hit you with unarmed/natural attacks take 2d4 poison damage. Piercing/slashing melee weapons you wield deal +1d4 poison.' },
    { name: 'Standing Leap', desc: 'Long jump 25ft, high jump 15ft, with or without running start.' },
    { name: 'Water Dependency', desc: 'Must submerge in water for 1 hour per day or gain 1 level of exhaustion.' },
    { name: 'Poison Immunity', desc: 'Immune to poison damage and poisoned condition.' },
  ],
  asi: '+2 DEX / +1 CON (legacy)',
  note: 'Poisonous Skin is strong at low levels. Water Dependency is a real drawback. Not AL-legal. Check with DM.',
};

export const POISONOUS_SKIN_ANALYSIS = {
  damage: '2d4 (avg 5) poison to creatures that touch/grapple you.',
  weaponBonus: '+1d4 (avg 2.5) poison to melee piercing/slashing weapons.',
  scaling: 'Does NOT scale with level. Falls off at higher levels.',
  interactions: [
    'Grappled by enemy: they take 2d4 poison each turn they maintain the grapple.',
    'Swallowed by creature: they take 2d4 poison each turn you\'re inside.',
    'Melee weapon attacks: +1d4 poison per hit. Two attacks = +2d4 per round.',
    'Poison immunity: many monsters (undead, constructs, fiends) are immune to poison.',
  ],
  note: 'Strong at L1-4. Falls off at L5+ due to poison immunity being common and damage not scaling.',
};

export const WATER_DEPENDENCY = {
  requirement: 'Submerge in water for at least 1 hour per day.',
  failure: 'Gain 1 level of exhaustion at end of day without water submersion.',
  solutions: [
    'Create or Destroy Water spell: create 10 gallons. Enough to submerge in.',
    'Decanter of Endless Water: infinite water. Permanent solution.',
    'Rivers, lakes, rain: natural water sources.',
    'Waterskin + bathtub: creative but DM-dependent on "submerge" definition.',
  ],
  note: 'Significant drawback. In desert/underground campaigns, this can be crippling.',
};

export const GRUNG_CLASS_SYNERGY = [
  { class: 'Monk', rating: 'A', reason: 'DEX/CON stats. Unarmed strikes don\'t proc weapon poison but Poisonous Skin retaliates. Climb speed. Leap.' },
  { class: 'Rogue', rating: 'A', reason: 'DEX race. +1d4 poison on Sneak Attack weapon. Climb speed for positioning. Small for hiding.' },
  { class: 'Ranger', rating: 'B', reason: 'DEX/CON. Climb speed. Nature theme fits. Water Dependency manageable in wilderness.' },
  { class: 'Fighter', rating: 'B', reason: 'Multiple attacks = multiple +1d4 poison procs. But Small = no Heavy weapons.' },
  { class: 'Barbarian', rating: 'C', reason: 'Small = no Heavy weapons. Stats wrong (want STR). Poison skin is nice on a tank though.' },
];

export const GRUNG_COLOR_LORE = [
  { color: 'Green', role: 'Warriors and workers. Most common. Lowest caste.' },
  { color: 'Blue', role: 'Artisans and domestic tasks. Second lowest.' },
  { color: 'Purple', role: 'Supervisors and commanders.' },
  { color: 'Red', role: 'Scholars and magic users.' },
  { color: 'Orange', role: 'Elite warriors.' },
  { color: 'Gold', role: 'Leaders and rulers. Highest caste.' },
];
