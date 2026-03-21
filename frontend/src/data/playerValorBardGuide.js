/**
 * playerValorBardGuide.js
 * Player Mode: College of Valor Bard — the martial support bard
 * Pure JS — no React dependencies.
 */

export const VALOR_BASICS = {
  class: 'Bard (College of Valor)',
  source: 'Player\'s Handbook',
  theme: 'Battle bard. Medium armor, shields, martial weapons, and Combat Inspiration.',
  note: 'The support martial Bard. Combat Inspiration lets allies use Inspiration for AC or damage. Battle Magic at L14 gives spell + attack.',
};

export const VALOR_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 3, effect: 'Medium armor, shields, martial weapons.', note: 'Half-plate + shield = 19 AC Bard. Martial weapons for actual melee.' },
  { feature: 'Combat Inspiration', level: 3, effect: 'When ally uses your Inspiration die, they can add it to weapon damage roll OR AC as reaction (one attack).', note: 'Your Inspiration becomes offensive (damage) or defensive (AC) for allies. Flexible support.' },
  { feature: 'Extra Attack', level: 6, effect: 'Attack twice with the Attack action.', note: 'Two attacks per turn. Makes you a real martial threat.' },
  { feature: 'Battle Magic', level: 14, effect: 'When you cast a Bard spell as action, make one weapon attack as bonus action.', note: 'Cast a spell AND attack. Full spell + weapon hit. At L14 this is great action economy.' },
];

export const VALOR_TACTICS = [
  { tactic: 'Combat Inspiration for ally AC', detail: 'Ally about to get hit? Use Inspiration to add d8-d12 to their AC. Can turn a hit into a miss.', rating: 'A', note: 'Reaction-based. Ally chooses when to use. Great for protecting squishy members.' },
  { tactic: 'Combat Inspiration for damage', detail: 'Rogue ally: add Inspiration die to Sneak Attack hit for extra d8-d12 damage.', rating: 'A' },
  { tactic: 'Half-plate + Shield caster', detail: '19 AC Bard that casts full Bard spells. Tankier than most casters. Still has full spell list.', rating: 'A' },
  { tactic: 'Battle Magic combo', detail: 'L14: cast Hold Person (action) → bonus action weapon attack (auto-crit if target is paralyzed).', rating: 'S', note: 'Paralyze and crit in the same turn. If you Smite via multiclass — even better.' },
  { tactic: 'Magical Secrets martial', detail: 'L10 Magical Secrets: grab Find Greater Steed (Pegasus), Steel Wind Strike, Spirit Guardians.', rating: 'A' },
];

export const VALOR_VS_SWORDS = {
  valor: { pros: ['Shield proficiency', 'Combat Inspiration (ally support)', 'Battle Magic at L14'], cons: ['No Fighting Style', 'No Blade Flourishes', 'Inspiration for allies not self'] },
  swords: { pros: ['Fighting Style (Dueling/TWF)', 'Blade Flourishes (self-buff)', 'Master\'s Flourish at L14 (free)', '+10ft speed'], cons: ['Shield conflicts with TWF style', 'Inspiration for self not allies', 'Less supportive'] },
  verdict: 'Valor for team support. Swords for personal combat. Swords is generally preferred for damage.',
};

export function combatInspirationACBoost(inspirationDie) {
  const avg = { 6: 3.5, 8: 4.5, 10: 5.5, 12: 6.5 };
  return avg[inspirationDie] || 4.5;
}

export function battleMagicDPR(bardLevel, dexMod, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((bardLevel + 3) / 4));
  const attackBonus = dexMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  return hitChance * (4.5 + dexMod); // Rapier + DEX as bonus action
}
