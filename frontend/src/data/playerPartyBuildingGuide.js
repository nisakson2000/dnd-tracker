/**
 * playerPartyBuildingGuide.js
 * Player Mode: Building a balanced party — roles and coverage
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Tank', classes: ['Fighter', 'Barbarian', 'Paladin', 'Cleric'], minimum: 1, note: 'Without frontline, enemies reach casters.' },
  { role: 'Healer', classes: ['Cleric', 'Druid', 'Bard', 'Divine Soul Sorcerer'], minimum: 1, note: 'At minimum: Healing Word access.' },
  { role: 'Controller', classes: ['Wizard', 'Sorcerer', 'Druid', 'Bard'], minimum: 1, note: 'AoE control wins fights.' },
  { role: 'Face', classes: ['Bard', 'Sorcerer', 'Paladin', 'Warlock'], minimum: 1, note: 'High CHA for social pillar.' },
  { role: 'Utility/Scout', classes: ['Rogue', 'Ranger', 'Bard', 'Artificer'], minimum: 0, note: 'Thieves\' tools, stealth, perception.' },
];

export const ESSENTIAL_COVERAGE = {
  mustHave: [
    'Healing Word access',
    'High AC frontliner',
    'AoE damage or control',
    'Ranged damage (for flyers)',
    'Revivify by L5',
  ],
  niceToHave: [
    'Thieves\' tools',
    'Ritual casting (Detect Magic, Tiny Hut)',
    'Counterspell',
    'Dispel Magic',
  ],
};

export const PARTY_SIZE_BUILDS = {
  three: 'Paladin (tank/healer) + Bard (face/control) + Fighter/Rogue (damage)',
  four: 'Fighter + Cleric + Wizard + Rogue (classic) or Paladin + Twilight Cleric + Wizard + Bard (optimized)',
  five: 'Standard four + any class. Room for specialization.',
};

export const BEST_PARTY_COMBOS = [
  { combo: 'Twilight Cleric + anyone', why: 'Temp HP every round for all allies.', rating: 'S+' },
  { combo: 'Peace Cleric + anyone', why: '+1d4 attacks/saves for PB creatures.', rating: 'S+' },
  { combo: 'Paladin + party', why: 'Aura of Protection: +CHA to all saves 10ft.', rating: 'S' },
  { combo: 'Rogue + advantage provider', why: 'Guaranteed Sneak Attack every round.', rating: 'A+' },
];

export const PARTY_PITFALLS = [
  'All martials, no caster: can\'t handle flying/incorporeal enemies.',
  'All casters, no frontline: concentration gets broken constantly.',
  'No healer: one bad fight = TPK.',
  'No ranged damage: flying enemies are invincible.',
  'Duplicate concentration spells: coordinate spell lists.',
];
