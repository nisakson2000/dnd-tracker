/**
 * playerDamageTypeRankingGuide.js
 * Player Mode: Damage types ranked with resistance/immunity analysis
 * Pure JS — no React dependencies.
 */

export const DAMAGE_TYPE_RANKINGS = [
  { type: 'Force', resistedBy: 'Almost nothing', rating: 'S', note: 'Best type. Eldritch Blast, Magic Missile, Disintegrate. Never resisted.' },
  { type: 'Radiant', resistedBy: 'Very few', rating: 'S', note: 'Spirit Guardians, Smites. Extra effective vs undead.' },
  { type: 'Psychic', resistedBy: 'Few (constructs immune)', rating: 'A', note: 'Synaptic Static. Constructs immune — check first.' },
  { type: 'Thunder', resistedBy: 'Few', rating: 'A', note: 'Shatter, Thunderwave. Rarely resisted.' },
  { type: 'Necrotic', resistedBy: 'Many undead', rating: 'B', note: 'Bad in undead campaigns. Good vs living.' },
  { type: 'Lightning', resistedBy: 'Several', rating: 'B', note: 'Lightning Bolt. Moderate resistance rate.' },
  { type: 'Cold', resistedBy: 'Many', rating: 'B', note: 'Many cold creatures immune. Decent otherwise.' },
  { type: 'Acid', resistedBy: 'Several', rating: 'B', note: 'Oozes often immune. Moderate usage.' },
  { type: 'Fire', resistedBy: 'MANY', rating: 'C', note: 'Most resisted elemental type. Fireball is great but fire immunity is common.' },
  { type: 'Poison', resistedBy: 'VERY MANY', rating: 'D', note: 'Worst type. Undead, constructs, fiends all immune/resistant.' },
];

export const PHYSICAL_DAMAGE = {
  bludgeoning: { vulnerability: 'Skeletons', note: 'Physical. "Nonmagical" resistance bypassed by magic weapons.' },
  piercing: { vulnerability: 'None common', note: 'Physical. Same resistance rules as bludgeoning.' },
  slashing: { vulnerability: 'None common', note: 'Physical. Same resistance rules.' },
  magicWeapons: 'Magic weapons bypass "nonmagical B/P/S resistance." This is the most common resistance in the game.',
  silveredWeapons: 'Silvered weapons bypass lycanthrope immunity. 100gp to silver a weapon.',
};

export const DIVERSIFICATION_TIPS = [
  'Don\'t build all-fire. Take at least one non-fire option.',
  'Force damage is always safe. Prioritize it if available.',
  'Elemental Adept feat bypasses resistance for one element (best for fire).',
  'Radiant damage is ideal for undead-heavy campaigns.',
  'Poison damage spells are almost always a trap — avoid them.',
  'Check enemy type before committing big slots: Arcana check for knowledge.',
];

export function effectiveDamage(base, isResisted, isVulnerable, isImmune) {
  if (isImmune) return 0;
  if (isVulnerable) return base * 2;
  if (isResisted) return Math.floor(base / 2);
  return base;
}

export function bestAvailableType(resistances = [], immunities = []) {
  const priority = ['force', 'radiant', 'psychic', 'thunder', 'necrotic', 'lightning', 'cold', 'acid', 'fire'];
  return priority.find(t => !resistances.includes(t) && !immunities.includes(t)) || 'force';
}
