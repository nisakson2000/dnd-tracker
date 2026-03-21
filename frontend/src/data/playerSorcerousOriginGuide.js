/**
 * playerSorcerousOriginGuide.js
 * Player Mode: All Sorcerer subclasses ranked
 * Pure JS — no React dependencies.
 */

export const SORCEROUS_ORIGINS_RANKED = [
  { origin: 'Clockwork Soul', rating: 'S+', role: 'Control', key: '10 free swappable spells. Cancel advantage/disadvantage. Ward allies.', note: 'Best Sorcerer. Fixes spells known.' },
  { origin: 'Aberrant Mind', rating: 'S+', role: 'Psychic', key: '10 free psionic spells. Cast with SP instead of slots. No components.', note: 'Tied best. Undetectable casting.' },
  { origin: 'Divine Soul', rating: 'S', role: 'Healer', key: 'Full Cleric spell list. +2d4 to failed rolls 1/SR.', note: 'Two spell lists. Ultimate versatility.' },
  { origin: 'Shadow', rating: 'A+', role: 'Stealth', key: 'Darkness (no concentration, 2 SP). See through it. Hound imposes save disadvantage.', note: 'Free advantage in darkness.' },
  { origin: 'Draconic', rating: 'A', role: 'Blaster', key: '13+DEX AC. +CHA elemental damage. Permanent flight L14.', note: 'Natural armor + flight.' },
  { origin: 'Storm', rating: 'A', role: 'Mobile', key: '10ft fly after casting. Lightning/thunder resist + AoE. Reaction push.', note: 'Mobile blaster.' },
  { origin: 'Wild Magic', rating: 'B+', role: 'Chaotic', key: 'Surge table. Tides of Chaos (advantage). Bend Luck (+/-1d4).', note: 'Fun but DM-dependent.' },
];

export const SORCEROUS_ORIGIN_TIPS = [
  'Clockwork/Aberrant: 10 free spells each. Must-pick origins.',
  'Divine Soul: Cleric + Sorcerer list. Twin Guiding Bolt. Quicken Healing Word.',
  'Shadow Darkness + Devil\'s Sight (Warlock dip): advantage on everything.',
  'Metamagic IS the class. Subtle + Twinned at L3. Quickened at L10.',
  'Sorcery Points: don\'t waste on slot conversion unless emergency.',
  'Subtle Counterspell: can\'t be countered. Best use of Subtle Spell.',
];
