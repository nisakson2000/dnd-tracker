/**
 * playerResistanceImmunityGuide.js
 * Player Mode: Damage resistance, vulnerability, and immunity
 * Pure JS — no React dependencies.
 */

export const RESISTANCE_RULES = {
  resistance: 'Take half damage from that type. Applied AFTER all modifiers and saves.',
  vulnerability: 'Take double damage from that type. Applied after all modifiers.',
  immunity: 'Take zero damage from that type.',
  order: 'Damage → modifiers → resistance/vulnerability → final damage.',
  stacking: 'Multiple sources of resistance to the same type DON\'T stack. Still half.',
  note: 'Resistance is incredibly powerful. Halving incoming damage effectively doubles your HP against that type.',
};

export const PLAYER_RESISTANCE_SOURCES = [
  { source: 'Barbarian Rage', resistance: 'Bludgeoning, Piercing, Slashing', duration: 'While raging', rating: 'S', note: 'Effectively doubles HP vs physical. Best defensive feature.' },
  { source: 'Bear Totem (Barbarian)', resistance: 'ALL damage except psychic', duration: 'While raging', rating: 'S+', note: 'Resist everything. Best tank in the game.' },
  { source: 'Absorb Elements (L1)', resistance: 'Triggering element (acid/cold/fire/lightning/thunder)', duration: '1 round', rating: 'S', note: 'Reaction. Halves the damage. Essential for casters.' },
  { source: 'Stoneskin (L4)', resistance: 'Nonmagical bludgeoning/piercing/slashing', duration: '1 hour (concentration)', rating: 'A', note: '100gp diamond consumed. Good but costly. Useless vs magic weapons.' },
  { source: 'Tiefling', resistance: 'Fire', duration: 'Always', rating: 'A', note: 'Racial resistance. Fire is the most common damage type.' },
  { source: 'Dragonborn (certain)', resistance: 'Varies by ancestry', duration: 'Always', rating: 'A', note: 'Matches breath weapon type.' },
  { source: 'Aasimar', resistance: 'Necrotic and radiant', duration: 'Always', rating: 'A+', note: 'Two resistances from race. Both useful.' },
  { source: 'Yuan-Ti', resistance: 'Magic damage', immunity: 'Poison', duration: 'Always', rating: 'S+', note: 'Advantage on saves vs magic. Poison immune.' },
  { source: 'Protection from Energy (L3)', resistance: 'One energy type chosen', duration: '1 hour (concentration)', rating: 'A', note: 'Choose acid/cold/fire/lightning/thunder. Good pre-buff.' },
  { source: 'Forge Cleric L6', resistance: 'Fire', duration: 'Always', rating: 'A', note: 'Fire resistance + heavy armor. Tanky.' },
  { source: 'Heroes\' Feast (L6)', resistance: 'None directly', immunity: 'Poison, frightened', duration: '24 hours', rating: 'S', note: 'Poison immune + frightened immune for a day.' },
];

export const DAMAGE_TYPE_FREQUENCY = [
  { type: 'Fire', frequency: 'Most common', note: 'Fireball, breath weapons, elementals. Most resisted AND most dealt.' },
  { type: 'Bludgeoning/Piercing/Slashing', frequency: 'Very common', note: 'Physical attacks. Most monster attacks.' },
  { type: 'Poison', frequency: 'Common', note: 'Many creatures deal poison. Also most commonly resisted/immune.' },
  { type: 'Necrotic', frequency: 'Moderate', note: 'Undead, dark magic. Some healing prevention.' },
  { type: 'Cold', frequency: 'Moderate', note: 'Fewer sources than fire. Less commonly resisted.' },
  { type: 'Lightning', frequency: 'Moderate', note: 'Dragons, storms, spells.' },
  { type: 'Thunder', frequency: 'Uncommon', note: 'Rarely resisted. Good damage type.' },
  { type: 'Psychic', frequency: 'Uncommon', note: 'Very rarely resisted. Best non-force type.' },
  { type: 'Radiant', frequency: 'Uncommon', note: 'Almost never resisted. Blocks some regeneration.' },
  { type: 'Force', frequency: 'Rare', note: 'Almost NOTHING resists force. Best damage type.' },
  { type: 'Acid', frequency: 'Uncommon', note: 'Few sources. Moderately resisted.' },
];

export const BYPASSING_RESISTANCE = [
  'Magic weapons bypass "nonmagical" resistance. Moon-Touched Sword at uncommon.',
  'Elemental Adept feat: ignore resistance to your chosen element.',
  'Choose damage types enemies DON\'T resist. Force, psychic, radiant > fire, poison.',
  'Some creatures resist "nonmagical" B/P/S. A +1 weapon solves this.',
  'Silvered weapons bypass some resistances (werewolves). 100gp to silver a weapon.',
];
