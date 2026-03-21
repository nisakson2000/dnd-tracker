/**
 * playerSmartHealingGuide.js
 * Player Mode: Healing spell optimization — when, what, and how to heal efficiently
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  core: 'Reactive healing beats proactive healing. Heal when someone goes DOWN.',
  why: 'Damage outpaces healing at every level. Prevention > healing.',
  note: 'Best "healing" is killing the enemy faster so they deal less damage.',
};

export const HEALING_SPELL_RANKINGS = [
  { spell: 'Healing Word (L1)', rating: 'S+', action: 'Bonus action', range: '60ft', healing: '1d4 + WIS', note: 'Best healing spell. Bonus action 60ft pickup.' },
  { spell: 'Mass Healing Word (L3)', rating: 'S', action: 'Bonus action', range: '60ft', healing: '1d4+WIS (6 targets)', note: 'Multiple downed allies. Rare but game-saving.' },
  { spell: 'Goodberry (L1)', rating: 'S (Life Cleric)', action: 'Action', healing: '1HP each (10 berries)', note: 'Life Cleric dip: 4HP each = 40HP from L1 slot.' },
  { spell: 'Aura of Vitality (L3)', rating: 'A+', action: 'Action', healing: '2d6/bonus action, 10 rounds', note: '70 avg HP over 1 minute. Best sustained.' },
  { spell: 'Cure Wounds (L1)', rating: 'B', action: 'Action', range: 'Touch', healing: '1d8 + WIS', note: 'Costs action + touch. Almost always worse than Healing Word.' },
  { spell: 'Prayer of Healing (L2)', rating: 'A (out of combat)', action: '10 min', healing: '2d8+WIS (6 targets)', note: 'Party heal after combat. Not for in-combat.' },
  { spell: 'Heal (L6)', rating: 'S', action: 'Action', range: '60ft', healing: '70 HP flat', note: 'Best single target heal. Cures conditions too.' },
  { spell: 'Mass Heal (L9)', rating: 'S+', action: 'Action', healing: '700 HP pool', note: 'Campaign-ending heal.' },
];

export const HEALING_ITEMS = [
  { item: 'Potion of Healing', healing: '2d4+2 (avg 7)', cost: '50 gp', note: 'Anyone can use. Stock 2-3.' },
  { item: 'Potion of Greater Healing', healing: '4d4+4 (avg 14)', cost: '100-250 gp', note: 'Better at higher levels.' },
  { item: 'Healer\'s Kit', healing: 'Stabilize (no check)', cost: '5 gp (10 uses)', note: 'Essential. No Medicine check needed.' },
  { item: 'Healer feat + Kit', healing: '1d6+4+HD per creature per rest', cost: '5 gp', note: 'Free healing without magic.' },
];

export const YO_YO_HEALING = {
  what: 'Let ally drop to 0. Healing Word picks them up.',
  why: 'Bonus action, they act on their turn. Efficient.',
  risk: 'Multiple drops = more death saves. 3 failures = death.',
  note: 'Efficient but risky. DM may target downed PCs.',
};

export const HEALING_TIPS = [
  'Healing Word > Cure Wounds. Always. Bonus action + 60ft.',
  'Don\'t heal proactively. Kill the enemy faster instead.',
  'Heal when someone hits 0 HP. Healing Word picks them up.',
  'Potions: anyone can use. Stock 2-3 per person.',
  'Healer\'s Kit: stabilize without Medicine check. 5gp for 10 uses.',
  'Aura of Vitality: 70 avg HP over 1 minute. Best sustained.',
  'Heal (L6): 70 HP flat. Best single-target.',
  'Goodberry + Life Cleric: 40 HP from L1 slot. Broken.',
  'Prayer of Healing: out-of-combat party heal.',
  'Prevention > healing. High AC, control spells, kill fast.',
];
