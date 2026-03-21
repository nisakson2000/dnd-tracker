/**
 * playerGenasiFourElementsGuide.js
 * Player Mode: Genasi (all four) — elemental-touched
 * Pure JS — no React dependencies.
 */

export const GENASI_BASICS = {
  race: 'Genasi',
  source: 'Elemental Evil Player\'s Companion / Mordenkainen Presents: Monsters of the Multiverse',
  subtypes: ['Air', 'Earth', 'Fire', 'Water'],
  asis: '+2 CON + subtype bonus (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Four elemental subtypes with unique spellcasting and resistances. Fire is strongest overall. Earth is tankiest. Air and Water are utility-focused.',
};

export const AIR_GENASI = {
  subtype: 'Air Genasi',
  asis: '+1 DEX (legacy)',
  traits: [
    { trait: 'Unending Breath', effect: 'Hold breath indefinitely.', note: 'Never suffocate. Underwater, gas, vacuum. Always useful.' },
    { trait: 'Mingle with the Wind', effect: 'Cast Levitate once per long rest (legacy) or Shocking Grasp cantrip + Feather Fall + Levitate (MotM).', note: 'Free Levitate = rise 20ft, avoid melee. MotM adds Feather Fall (save from falls) and Shocking Grasp.' },
  ],
  rating: 'B',
  bestClasses: ['Monk', 'Rogue', 'Ranger'],
  note: 'Utility-focused. Levitate is situationally powerful. Unending Breath is niche but free.',
};

export const EARTH_GENASI = {
  subtype: 'Earth Genasi',
  asis: '+1 STR (legacy)',
  traits: [
    { trait: 'Earth Walk', effect: 'Move across difficult terrain of earth/stone without extra movement.', note: 'Ignore rocky/earthy difficult terrain. Useful in caves, mountains, ruins.' },
    { trait: 'Merge with Stone', effect: 'Cast Pass without Trace once per long rest (legacy) or Blade Ward cantrip + Pass without Trace (MotM).', note: 'Free Pass without Trace = +10 Stealth for entire party. THE reason to play Earth Genasi.' },
  ],
  rating: 'A',
  bestClasses: ['Ranger', 'Rogue', 'Druid', 'Any'],
  note: 'Pass without Trace is one of the best L2 spells. Free casting = incredible value for any party.',
};

export const FIRE_GENASI = {
  subtype: 'Fire Genasi',
  asis: '+1 INT (legacy)',
  traits: [
    { trait: 'Fire Resistance', effect: 'Resistance to fire damage.', note: 'Fire is the most common damage type. Always useful. Great value.' },
    { trait: 'Reach to the Blaze', effect: 'Produce Flame cantrip + Burning Hands (L3) + Flame Blade (L5). Once each per LR (MotM). Legacy: Produce Flame + Burning Hands 1/LR.', note: 'Free offensive spells. Burning Hands for AoE. Produce Flame for light + ranged attack.' },
    { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard darkvision.' },
  ],
  rating: 'A+',
  bestClasses: ['Fighter', 'Barbarian', 'Any martial'],
  note: 'Best Genasi. Fire resistance is universally useful. Free offensive cantrip + spells. Darkvision. Complete package.',
};

export const WATER_GENASI = {
  subtype: 'Water Genasi',
  asis: '+1 WIS (legacy)',
  traits: [
    { trait: 'Acid Resistance', effect: 'Resistance to acid damage.', note: 'Acid is uncommon. Less value than fire resistance.' },
    { trait: 'Amphibious', effect: 'Breathe air and water.', note: 'Aquatic campaigns are amazing. Otherwise niche.' },
    { trait: 'Swim Speed', effect: '30ft swim speed.', note: 'Useful in aquatic environments. Standard swim speed.' },
    { trait: 'Call to the Wave', effect: 'Acid Splash cantrip + Create/Destroy Water (L3) + Water Walk (L5). Once each per LR (MotM). Legacy: Shape Water + Create/Destroy Water 1/LR.', note: 'Water Walk is great utility. Shape Water is fun.' },
  ],
  rating: 'B',
  bestClasses: ['Druid', 'Cleric', 'Ranger'],
  note: 'Aquatic specialist. Great in water campaigns, mediocre on land. WIS bonus for casters.',
};

export const GENASI_RANKING = [
  { subtype: 'Fire', rating: 'A+', reason: 'Fire resistance (most common element) + offensive spells + darkvision. Complete package.' },
  { subtype: 'Earth', rating: 'A', reason: 'Free Pass without Trace = +10 party Stealth. One of the best racial spells in the game.' },
  { subtype: 'Air', rating: 'B', reason: 'Levitate is good but situational. Unending Breath is niche. Feather Fall is nice.' },
  { subtype: 'Water', rating: 'B', reason: 'Aquatic only. Acid resistance is rare. Great in water campaigns, weak on land.' },
];

export function passWithoutTraceBonus(stealthMod) {
  return { normal: stealthMod, withPWT: stealthMod + 10, note: '+10 to entire party Stealth. Free from Earth Genasi.' };
}
