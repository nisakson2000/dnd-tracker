/**
 * playerGenasiGuide.js
 * Player Mode: Genasi race guide — elemental-touched humanoids
 * Pure JS — no React dependencies.
 */

export const GENASI_BASICS = {
  race: 'Genasi (Air, Earth, Fire, Water)',
  source: 'Elemental Evil Player\'s Companion / MotM',
  size: 'Medium',
  speed: '30ft (35ft Earth)',
  theme: 'Elemental heritage. Each subrace has unique elemental abilities.',
  note: 'Four distinct subraces with different power levels. Fire and Earth are strongest. Water is niche. Air is flavorful.',
};

export const AIR_GENASI = {
  subrace: 'Air Genasi',
  asi: '+2 CON, +1 DEX (EEPC) or flexible (MotM)',
  traits: [
    { trait: 'Unending Breath', effect: 'Hold your breath indefinitely while not incapacitated.', note: 'Never suffocate. Underwater, in smoke, poisonous gas — you\'re fine.' },
    { trait: 'Mingle with the Wind', effect: 'Cast Levitate once per long rest (CON spellcasting).', note: 'Free Levitate. Fly 20ft up, float. Great escape.' },
    { trait: 'Lightning Resistance (MotM)', effect: 'Resistance to lightning damage.', note: 'MotM added this. Solid defensive trait.' },
  ],
  rating: 'B',
  bestClasses: ['Ranger', 'Monk', 'Rogue'],
};

export const EARTH_GENASI = {
  subrace: 'Earth Genasi',
  asi: '+2 CON, +1 STR (EEPC) or flexible (MotM)',
  traits: [
    { trait: 'Earth Walk', effect: 'Move across difficult terrain made of earth/stone without extra movement.', note: 'Ignore natural difficult terrain. Niche but free.' },
    { trait: 'Merge with Stone', effect: 'Cast Pass Without Trace once per long rest (MotM).', note: 'FREE PASS WITHOUT TRACE. +10 Stealth to party. Once per day. Incredible.' },
  ],
  rating: 'A',
  bestClasses: ['Rogue', 'Ranger', 'Any stealth party'],
};

export const FIRE_GENASI = {
  subrace: 'Fire Genasi',
  asi: '+2 CON, +1 INT (EEPC) or flexible (MotM)',
  traits: [
    { trait: 'Fire Resistance', effect: 'Resistance to fire damage.', note: 'Fire is the most common elemental damage type. Great defensive trait.' },
    { trait: 'Reach to the Blaze', effect: 'Produce Flame cantrip. Cast Burning Hands once per long rest.', note: 'Free cantrip + free spell.' },
    { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard but useful.' },
  ],
  rating: 'A',
  bestClasses: ['Fighter', 'Wizard', 'Artificer'],
};

export const WATER_GENASI = {
  subrace: 'Water Genasi',
  asi: '+2 CON, +1 WIS (EEPC) or flexible (MotM)',
  traits: [
    { trait: 'Acid Resistance', effect: 'Resistance to acid damage.', note: 'Acid is less common than fire but still useful.' },
    { trait: 'Amphibious', effect: 'Breathe air and water.', note: 'Never drown.' },
    { trait: 'Swim Speed', effect: '30ft swim speed.', note: 'Matches walking speed in water.' },
    { trait: 'Call to the Wave', effect: 'Shape Water cantrip. Cast Create/Destroy Water once per long rest.', note: 'Shape Water is creative.' },
  ],
  rating: 'B',
  bestClasses: ['Druid', 'Cleric', 'Ranger'],
};

export const GENASI_TIER_LIST = [
  { subrace: 'Earth (MotM)', rating: 'A', reason: 'Free Pass Without Trace.' },
  { subrace: 'Fire', rating: 'A', reason: 'Fire resistance + free spells.' },
  { subrace: 'Air (MotM)', rating: 'B', reason: 'Lightning resistance + Levitate.' },
  { subrace: 'Water', rating: 'B', reason: 'Aquatic niche.' },
];

export function passWithoutTraceFromEarth() {
  return 10;
}
