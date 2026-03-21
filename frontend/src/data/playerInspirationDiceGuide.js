/**
 * playerInspirationDiceGuide.js
 * Player Mode: Bardic Inspiration usage, optimization, and subclass variations
 * Pure JS — no React dependencies.
 */

export const BARDIC_INSPIRATION_BASICS = {
  uses: 'CHA mod per long rest (short rest at Bard 5).',
  action: 'Bonus action. Ally within 60ft.',
  die: 'd6 (L1), d8 (L5), d10 (L10), d12 (L15).',
  usage: 'Add die to ONE attack, check, or save within 10 minutes.',
  timing: 'After rolling, before knowing result.',
};

export const WHEN_TO_INSPIRE = [
  { situation: 'Rogue Sneak Attack', priority: 'S', reason: 'Ensure hit → huge damage swing.' },
  { situation: 'Paladin Smite attack', priority: 'S', reason: 'Ensure hit → Smite activates.' },
  { situation: 'Critical save (Hold Person)', priority: 'S', reason: 'Fight-changing save bonus.' },
  { situation: 'Key grapple/shove', priority: 'A', reason: 'Combat-impacting check.' },
  { situation: 'Blanket pre-combat', priority: 'B', reason: 'Target picks when to use it.' },
];

export const SUBCLASS_VARIANTS = [
  { sub: 'Lore', feature: 'Cutting Words', effect: 'Reaction: subtract die from enemy roll.', rating: 'S' },
  { sub: 'Valor', feature: 'Combat Inspiration', effect: 'Add to damage OR AC.', rating: 'A' },
  { sub: 'Glamour', feature: 'Mantle of Inspiration', effect: 'CHA mod allies: temp HP + free move.', rating: 'S' },
  { sub: 'Eloquence', feature: 'Unsettling Words', effect: 'Subtract from target\'s next save.', rating: 'S' },
  { sub: 'Swords', feature: 'Blade Flourish', effect: 'Self-use for push/mobile/defense.', rating: 'A' },
  { sub: 'Whispers', feature: 'Psychic Blades', effect: 'Extra psychic damage (2d6+).', rating: 'B' },
  { sub: 'Creation', feature: 'Mote of Potential', effect: 'Bonus effect per use type.', rating: 'A' },
];

export const INSPIRATION_ECONOMY = [
  'Level 5+: recharges on short rest. Use every encounter.',
  'CHA 20 = 5 uses per rest. One per fight.',
  'Don\'t hoard — they expire in 10 minutes.',
  'Eloquence L5: minimum Inspiration roll = 10.',
];

export function inspirationDie(bardLevel) {
  if (bardLevel >= 15) return 12;
  if (bardLevel >= 10) return 10;
  if (bardLevel >= 5) return 8;
  return 6;
}

export function inspirationAvg(bardLevel) {
  return inspirationDie(bardLevel) / 2 + 0.5;
}
