/**
 * playerDamageTypeResistanceGuide.js
 * Player Mode: All damage types — resistances, immunities, and what to use
 * Pure JS — no React dependencies.
 */

export const DAMAGE_TYPES = [
  { type: 'Force', resistance: 'Near Zero', immunity: 'Helmed Horror only', rating: 'S+', note: 'Best type. Nothing resists. Eldritch Blast, Magic Missile.' },
  { type: 'Radiant', resistance: 'Very Low', immunity: 'Very few', rating: 'S', note: 'Excellent. Spirit Guardians, Divine Smite, Guiding Bolt.' },
  { type: 'Psychic', resistance: 'Low', immunity: 'Constructs, some undead', rating: 'A+', note: 'Good but constructs immune. Synaptic Static, Mind Sliver.' },
  { type: 'Thunder', resistance: 'Low', immunity: 'Few', rating: 'A+', note: 'Rarely resisted. Thunderwave, Shatter.' },
  { type: 'Necrotic', resistance: 'Moderate', immunity: 'Many undead', rating: 'B+', note: 'Bad against undead. Inflict Wounds, Blight.' },
  { type: 'Lightning', resistance: 'Moderate', immunity: 'Some constructs', rating: 'B+', note: 'Moderate resistance. Lightning Bolt, Call Lightning.' },
  { type: 'Cold', resistance: 'Moderate-High', immunity: 'Several', rating: 'B', note: 'Commonly resisted. Cone of Cold, Ray of Frost.' },
  { type: 'Acid', resistance: 'Low-Moderate', immunity: 'Some oozes', rating: 'B+', note: 'Less resisted than fire. Fewer spell options.' },
  { type: 'Fire', resistance: 'Very High', immunity: 'Many', rating: 'B', note: 'Most resisted elemental type. Fireball still good for AoE.' },
  { type: 'Poison', resistance: 'Extremely High', immunity: 'Extremely High', rating: 'D', note: 'WORST type. Half the MM resists/immune. Avoid.' },
  { type: 'BPS (magical)', resistance: 'Very Low', immunity: 'Very few', rating: 'A', note: 'Magic weapons bypass most BPS resistance.' },
  { type: 'BPS (nonmagical)', resistance: 'Moderate', immunity: 'Some', rating: 'B', note: 'Get magic weapons ASAP to bypass this.' },
];

export const DAMAGE_RESISTANCE_TIPS = [
  'Force damage is king. Nothing resists it practically.',
  'Radiant is second best. Anti-undead and rarely resisted.',
  'Fire is the most resisted elemental type. Don\'t rely exclusively.',
  'Poison is nearly useless against ~50% of monsters.',
  'Absorb Elements covers acid, cold, fire, lightning, thunder.',
  'Magic weapons bypass "resistance to nonmagical BPS."',
  'Elemental Adept: ignore resistance + treat 1s as 2s. Only for single-type builds.',
  'Chromatic Orb lets you choose type. Pick based on enemy.',
  'Vulnerabilities are rare: skeletons (bludgeoning), treants (fire).',
];
