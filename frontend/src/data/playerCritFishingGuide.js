/**
 * playerCritFishingGuide.js
 * Player Mode: Critical hit optimization — crit fishing, smiting, and maximizing crits
 * Pure JS — no React dependencies.
 */

export const CRIT_RULES = {
  natural20: 'Natural 20 = critical hit. Always hits.',
  doubleDice: 'Double ALL damage dice. Not modifiers.',
  smiteRule: 'Declare smite AFTER confirming crit.',
  natural1: 'Natural 1 = auto-miss.',
};

export const CRIT_PROBABILITY = {
  normal: '5% (1 in 20)',
  advantage: '9.75% (1 in 10)',
  elvenAccuracy: '14.3% (1 in 7)',
  hexCurse19: '10% normal, 19% advantage, 27% triple advantage',
  champion18: '15% normal, 27.75% advantage',
};

export const CRIT_EXPANDERS = [
  { source: 'Hexblade\'s Curse', effect: 'Crit on 19-20', rating: 'S+' },
  { source: 'Champion (L3)', effect: 'Crit on 19-20', rating: 'A+' },
  { source: 'Champion (L15)', effect: 'Crit on 18-20', rating: 'A+' },
  { source: 'Hold Person/Monster', effect: 'Auto-crit within 5ft (paralyzed)', rating: 'S+' },
  { source: 'Unconscious target', effect: 'Auto-crit within 5ft', rating: 'S+' },
  { source: 'Elven Accuracy', effect: 'Triple advantage = 14.3%', rating: 'S+' },
  { source: 'Reckless Attack', effect: 'Free advantage', rating: 'S' },
];

export const CRIT_MAXIMIZERS = [
  { source: 'Divine Smite', doubles: '2d8-5d8 → 4d8-10d8', rating: 'S+', note: 'Declare after crit. Never waste.' },
  { source: 'Sneak Attack', doubles: 'Up to 10d6 → 20d6', rating: 'S+', note: 'Massive dice pool doubled.' },
  { source: 'Eldritch Smite', doubles: 'Slot-based d8s + prone', rating: 'S+', note: 'Prone + doubled damage.' },
  { source: 'Brutal Critical', doubles: '+1-3 weapon dice', rating: 'A', note: 'Only weapon dice, not all.' },
  { source: 'Savage Attacks (Half-Orc)', doubles: '+1 weapon die', rating: 'A', note: 'Stacks with Brutal Critical.' },
];

export const CRIT_BUILDS = [
  { name: 'Hexblade + Elven Accuracy', method: '19-20 crit + triple advantage = 27% crit rate', rating: 'S+' },
  { name: 'Paladin Smite Crit', method: 'Hold Person → auto-crit → max smite', rating: 'S+' },
  { name: 'Assassin Rogue', method: 'Surprise = auto-crit. All SA dice doubled.', rating: 'A+' },
  { name: 'Champion + GWM', method: 'Expanded crit → BA attack on crit/kill', rating: 'A' },
];

export const CRIT_TIPS = [
  'Smite AFTER seeing the crit. Never pre-declare.',
  'Hold Person = auto-crit. Coordinate with party casters.',
  'Elven Accuracy + Hexblade Curse = 27% crit rate.',
  'Double ALL dice, not modifiers. Stack dice-based damage.',
  'Reckless Attack: free advantage for crit fishing.',
  'Half-Orc Barbarian: extra weapon dice on crits.',
  'GWM: bonus attack on crit. More crits = more attacks.',
  'Paladin L4 Smite crit = ~90 avg damage. One attack.',
  'Don\'t fish for crits at expense of consistent damage.',
  'Sleep + melee = auto-crit on unconscious targets.',
];
