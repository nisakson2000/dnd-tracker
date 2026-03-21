/**
 * playerDragonSlaying.js
 * Player Mode: Dragon fight preparation, tactics, and survival guide
 * Pure JS — no React dependencies.
 */

export const DRAGON_OVERVIEW = {
  types: ['Black (acid)', 'Blue (lightning)', 'Green (poison)', 'Red (fire)', 'White (cold)', 'Brass (fire)', 'Bronze (lightning)', 'Copper (acid)', 'Gold (fire)', 'Silver (cold)'],
  ageCategories: ['Wyrmling (CR 2-4)', 'Young (CR 6-10)', 'Adult (CR 11-17)', 'Ancient (CR 20-24)'],
  universalTraits: ['Frightful Presence (Adult+)', 'Legendary Actions (3)', 'Legendary Resistance (3)', 'Breath Weapon (recharge 5-6)', 'Multiattack (Bite + 2 Claws)', 'Wing Attack (legendary, 2 cost)'],
};

export const BREATH_WEAPON_PREP = [
  { color: 'Red/Gold/Brass', element: 'Fire', resist: 'Fire Resistance (Absorb Elements, Resist Energy, Tiefling)', note: 'Most common. Always prep fire resistance.' },
  { color: 'Blue/Bronze', element: 'Lightning', resist: 'Lightning Resistance (Absorb Elements, Storm Sorcerer)', note: 'Line breath. Spread out laterally.' },
  { color: 'Black/Copper', element: 'Acid', resist: 'Acid Resistance (Absorb Elements, Yuan-Ti)', note: 'Less common resistance sources.' },
  { color: 'White/Silver', element: 'Cold', resist: 'Cold Resistance (Absorb Elements, Frost Dwarf)', note: 'Cone breath. Stay behind it.' },
  { color: 'Green', element: 'Poison', resist: 'Poison Resistance (Dwarf, Yuan-Ti, Protection from Poison)', note: 'Cone. Dwarves and Yuan-Ti have natural resistance.' },
];

export const DRAGON_FIGHT_TACTICS = [
  { tactic: 'Spread out', detail: 'Breath weapons are AoE. Spread at least 10ft apart. Wing Attack hits 10-15ft radius.', priority: 'S' },
  { tactic: 'Ground the dragon', detail: 'If it\'s flying, you can\'t melee it. Earthbind (2nd level, STR save) forces it down. Or Sentinel stops it from leaving.', priority: 'S' },
  { tactic: 'Burn Legendary Resistances', detail: 'Cast cheap save spells (Faerie Fire, Hold Monster). Drain 3 LRs. THEN cast Polymorph or Banishment.', priority: 'S' },
  { tactic: 'Elemental resistance for everyone', detail: 'Protection from Energy (3rd level, 1 target). Absorb Elements (reaction). Heroes\' Feast (WIS save advantage + immune to frightened).', priority: 'S' },
  { tactic: 'Target WIS saves', detail: 'Dragons have high STR, DEX, CON, and CHA saves. WIS is often their weakest save.', priority: 'A' },
  { tactic: 'Counterspell (Ancient only)', detail: 'Ancient dragons can cast spells. Save Counterspell for their most dangerous casts.', priority: 'A' },
  { tactic: 'Fight outside the lair', detail: 'Lair actions give dragons free environmental effects. Lure them out if possible.', priority: 'A' },
  { tactic: 'Ready actions', detail: 'Ranged characters: ready attacks for when dragon swoops. "I shoot when it comes within 60ft."', priority: 'B' },
];

export const DRAGON_WEAKNESSES = {
  saves: 'Most dragons have weaker WIS and INT saves than physical saves.',
  speed: 'On the ground, dragons are slower than in the air. Ground them.',
  action: 'Despite legendary actions, they still only get one reaction. Bait it out.',
  legendary: 'Only 3 LRs. A party of 4+ casters can burn them in 2 rounds.',
  lair: 'Without lair actions, dragons lose 1/4 of their combat power.',
};

export const ANTI_DRAGON_SPELLS = [
  { spell: 'Absorb Elements', level: 1, note: 'Reaction: halve breath weapon damage. Essential for everyone.' },
  { spell: 'Protection from Energy', level: 3, note: 'Resistance to chosen element for 1 hour. Concentration.' },
  { spell: 'Earthbind', level: 2, note: 'STR save or speed reduced to 0 (grounds flyers).' },
  { spell: 'Hold Monster', level: 5, note: 'Paralyzed. Auto-crit melee. Best after LRs are gone.' },
  { spell: 'Polymorph', level: 4, note: 'Turn dragon into a turtle. Save after LRs burned.' },
  { spell: 'Banishment', level: 4, note: 'CHA save. Remove from fight for 1 minute concentration.' },
  { spell: 'Heroes\' Feast', level: 6, note: 'Immune to frightened + WIS save advantage + poison immunity + temp HP.' },
  { spell: 'Haste', level: 3, note: 'Extra action for your best damage dealer. +2 AC helps survivability.' },
];

export function breathWeaponDamage(ageCategory) {
  const damages = { 'Wyrmling': '7d6-8d8', 'Young': '12d6-16d8', 'Adult': '18d6-22d8', 'Ancient': '22d6-26d8' };
  return damages[ageCategory] || 'Unknown';
}

export function dragonCR(ageCategory, isChromatic) {
  const crs = { 'Wyrmling': [2, 4], 'Young': [6, 10], 'Adult': [11, 17], 'Ancient': [20, 24] };
  const range = crs[ageCategory] || [0, 0];
  return `CR ${range[0]}-${range[1]}`;
}
