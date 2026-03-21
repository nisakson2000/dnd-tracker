/**
 * playerCriticalHitMasteryGuide.js
 * Player Mode: Critical hits — maximizing crit damage and fishing for crits
 * Pure JS — no React dependencies.
 */

export const CRITICAL_HIT_RULES = {
  trigger: 'Natural 20 on attack roll.',
  effect: 'Double ALL damage dice. Modifiers NOT doubled.',
  example: '2d6+5 → 4d6+5 on crit. Only dice double.',
  doubledDice: ['Weapon dice', 'Sneak Attack', 'Divine Smite', 'Hex/Hunter\'s Mark', 'Savage Attacks'],
  notDoubled: ['Flat modifiers (STR/DEX/CHA)', 'GWM/SS +10', 'Agonizing Blast CHA'],
};

export const CRIT_FISHING_METHODS = [
  { method: 'Advantage', critChance: '9.75%', rating: 'S', note: 'Double crit chance.' },
  { method: 'Elven Accuracy + advantage', critChance: '14.3%', rating: 'S+', note: '3 dice. Nearly triple crit chance.' },
  { method: 'Champion (19-20)', critChance: '10%', rating: 'A+', note: '18-20 at L15 (15%).' },
  { method: 'Hexblade Curse (19-20)', critChance: '10%', rating: 'S', note: 'Expanded range on cursed target.' },
  { method: 'Hold Person (auto-crit)', critChance: '100% (5ft)', rating: 'S++', note: 'Paralyzed = auto-crit in melee.' },
];

export const BEST_CRIT_BUILDS = [
  { build: 'Paladin (Smite on Crit)', avgCrit: '60-80+', rating: 'S+', note: 'Save smite for crits. 4d8+ weapon doubled.' },
  { build: 'Rogue (Sneak Attack)', avgCrit: '40-70+', rating: 'S', note: 'SA dice all double. Assassin = auto-crit surprised.' },
  { build: 'Hexblade/Paladin', avgCrit: '80-100+', rating: 'S++', note: '19-20 crit + Smite + Hex. Ultimate nova.' },
  { build: 'Half-Orc Barbarian', avgCrit: 'varies', rating: 'A+', note: 'Savage Attacks + Brutal Critical = extra dice.' },
];

export const CRIT_TIPS = [
  'More dice = better crits. Smite, SA, Hex all double.',
  'Flat modifiers don\'t double. Only dice.',
  'Advantage doubles crit chance. Always seek it.',
  'Paladin: ALWAYS save a smite slot for crits.',
  'Hold Person/Monster: auto-crit within 5ft. Cast → Smite → win.',
  'Hexblade Curse + Elven Accuracy + advantage = ~27% crit chance.',
  'Half-Orc +1 die on crit stacks with Barbarian Brutal Critical.',
];
