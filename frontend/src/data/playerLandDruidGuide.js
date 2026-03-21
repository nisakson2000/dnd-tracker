/**
 * playerLandDruidGuide.js
 * Player Mode: Circle of the Land Druid — the spellcasting specialist
 * Pure JS — no React dependencies.
 */

export const LAND_BASICS = {
  class: 'Druid (Circle of the Land)',
  source: 'Player\'s Handbook',
  theme: 'Terrain-specialized caster. Extra spells from chosen land. Spell slot recovery.',
  note: 'The caster Druid. Natural Recovery is like Arcane Recovery. Circle spells expand your list significantly.',
};

export const LAND_FEATURES = [
  { feature: 'Bonus Cantrip', level: 2, effect: 'Learn one additional Druid cantrip.', note: 'Extra cantrip. More options at range.' },
  { feature: 'Natural Recovery', level: 2, effect: 'During short rest: recover spell slots totaling up to half your Druid level (rounded up). 1/long rest.', note: 'Like Arcane Recovery. Recover slots on short rest. Huge boost to daily spellcasting.' },
  { feature: 'Circle Spells', level: 3, effect: 'Gain extra prepared spells based on chosen land type. Always prepared, don\'t count against limit.', note: 'Free extra spells. Best lands have spells not normally on Druid list.' },
  { feature: 'Land\'s Stride', level: 6, effect: 'Move through nonmagical difficult terrain without extra movement. Advantage on saves vs plants that impede movement (Entangle, Spike Growth).', note: 'Ignore Spike Growth, Entangle, natural difficult terrain. Good for your own spells.' },
  { feature: 'Nature\'s Ward', level: 10, effect: 'Immune to poison, disease. Can\'t be charmed/frightened by elementals or fey.', note: 'Poison immunity + disease immunity. Solid defensive passives.' },
  { feature: 'Nature\'s Sanctuary', level: 14, effect: 'Beasts and plant creatures must WIS save to attack you. On fail: choose different target.', note: 'Niche. Only affects beasts and plants. Weak capstone.' },
];

export const CIRCLE_SPELL_RANKINGS = [
  { land: 'Arctic', rating: 'A', keySpells: 'Hold Person, Sleet Storm, Cone of Cold', note: 'Sleet Storm and Cone of Cold are excellent. Solid offensive list.' },
  { land: 'Coast', rating: 'B', keySpells: 'Mirror Image, Misty Step, Water Breathing', note: 'Mirror Image is great (no concentration). Misty Step for mobility.' },
  { land: 'Desert', rating: 'B', keySpells: 'Blur, Silence, Wall of Fire', note: 'Wall of Fire is excellent. Blur and Silence are situational.' },
  { land: 'Forest', rating: 'A', keySpells: 'Hold Person, Call Lightning, Freedom of Movement', note: 'Solid combat spells. Call Lightning is great sustained damage.' },
  { land: 'Grassland', rating: 'S', keySpells: 'Haste, Invisibility, Pass Without Trace, Dream', note: 'HASTE. Not on Druid list normally. Haste is game-changing. PWT is also here.' },
  { land: 'Mountain', rating: 'A', keySpells: 'Lightning Bolt, Spike Growth, Stoneskin', note: 'Lightning Bolt is not normally on Druid list. Good blasting.' },
  { land: 'Swamp', rating: 'B', keySpells: 'Darkness, Stinking Cloud, Insect Plague', note: 'Darkness and Stinking Cloud are decent. Less impressive overall.' },
  { land: 'Underdark', rating: 'S', keySpells: 'Web, Gaseous Form, Greater Invisibility, Cloudkill', note: 'WEB is incredible (Druid doesn\'t normally get it). Greater Invisibility at L7.' },
];

export const LAND_VS_WILDFIRE = {
  land: { pros: ['Natural Recovery (slot recovery)', 'Extra circle spells', 'Land\'s Stride (ignore difficult terrain)', 'More spellcasting focused'], cons: ['No companion', 'Weak capstone', 'Less combat utility'] },
  wildfire: { pros: ['Wildfire Spirit (companion)', 'Enhanced Bond (+1d8 to damage/healing)', 'Teleportation via spirit', 'Auto-revive at L14'], cons: ['No slot recovery', 'Fewer circle spells', 'Spirit can die'] },
  verdict: 'Land for pure spellcasting with slot recovery. Wildfire for companion + enhanced casting.',
};

export function naturalRecoverySlots(druidLevel) {
  return Math.ceil(druidLevel / 2); // Total slot levels recoverable
}

export function circlePreparedCount(druidLevel) {
  // Extra always-prepared spells from circle
  if (druidLevel >= 9) return 8; // 2 per level (3, 5, 7, 9)
  if (druidLevel >= 7) return 6;
  if (druidLevel >= 5) return 4;
  if (druidLevel >= 3) return 2;
  return 0;
}
