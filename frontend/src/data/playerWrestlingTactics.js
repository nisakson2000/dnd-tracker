/**
 * playerWrestlingTactics.js
 * Player Mode: Grappling rules, builds, and wrestling tactics
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Uses one attack (part of Attack action). Not a full action — you can grapple + attack.',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (their choice).',
  requirements: 'You need a free hand. Target must be no more than one size larger than you.',
  effect: 'Target\'s speed becomes 0. No other effects (they can still attack, cast spells, etc).',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics.',
  movement: 'You can drag the grappled creature. Your speed is halved while dragging.',
  endConditions: ['You let go (free)', 'Target escapes (their action)', 'You\'re incapacitated', 'Target is moved out of reach by force'],
};

export const SHOVE_RULES = {
  action: 'Uses one attack (part of Attack action). Athletics vs Athletics or Acrobatics.',
  options: ['Knock prone (target falls prone)', 'Push 5ft away (push in any direction)'],
  combo: 'Grapple + Shove Prone = target is prone with speed 0. They can\'t stand up. All melee attacks have advantage.',
  note: 'The grapple-and-shove combo is one of the strongest martial tactics in the game.',
};

export const GRAPPLE_BUILDS = [
  {
    build: 'Barbarian Grappler',
    why: 'Rage gives advantage on Athletics. Highest STR class. Danger Sense helps survive.',
    feats: ['Skill Expert (Athletics expertise)', 'Tavern Brawler (bonus action grapple)'],
    tactic: 'Rage → grapple with advantage → shove prone → attack with advantage every round.',
    rating: 'S',
  },
  {
    build: 'Rune Knight Fighter',
    why: 'Giant\'s Might = Large size (grapple Huge creatures). Extra d6 damage. Great STR.',
    feats: ['Skill Expert (Athletics expertise)', 'Tavern Brawler'],
    tactic: 'Giant\'s Might → grapple large/huge enemies → shove prone → Action Surge for extra attacks.',
    rating: 'S',
  },
  {
    build: 'Bard Grappler (Lore/Swords)',
    why: 'Expertise in Athletics. Jack of All Trades. Cutting Words to reduce escape attempts.',
    feats: ['Skill Expert not needed (already have expertise)', 'Tavern Brawler'],
    tactic: 'Expertise Athletics → grapple → Cutting Words their escape roll → hold them for allies.',
    rating: 'A',
  },
  {
    build: 'Rogue Grappler',
    why: 'Expertise in Athletics. Sneak Attack while target is prone (advantage = SA).',
    feats: ['Tavern Brawler (bonus action grapple after unarmed strike)'],
    tactic: 'Expertise Athletics → grapple → shove prone → Sneak Attack with advantage.',
    rating: 'A',
  },
];

export const GRAPPLE_COMBOS = [
  { combo: 'Grapple + Shove Prone', effect: 'Speed 0 + prone = can\'t stand up. Permanent advantage for melee allies.', difficulty: 'Easy' },
  { combo: 'Grapple + Drag to Hazard', effect: 'Drag into Spike Growth (2d4/5ft), Spirit Guardians, Moonbeam, etc.', difficulty: 'Medium' },
  { combo: 'Grapple + Drag off Cliff', effect: 'Drag to ledge, shove off. Both fall but you Feather Fall.', difficulty: 'Situational' },
  { combo: 'Grapple + Wall of Fire', effect: 'Drag through Wall of Fire repeatedly. 5d8 each pass.', difficulty: 'Medium' },
];

export const GRAPPLE_COUNTERS = [
  'Misty Step or teleportation ends grapple (moves out of reach).',
  'Freedom of Movement: automatically escapes grapples.',
  'Thunderwave: pushes you away, ending grapple.',
  'Shapechange to Tiny or Huge: breaks size requirement.',
  'Creatures immune to grapple: oozes, incorporeal undead, formless creatures.',
];

export function grappleCheck(athleticsMod, hasAdvantage) {
  const base = 10.5 + athleticsMod;
  return hasAdvantage ? base + 3.325 : base;
}

export function canGrappleBySize(yourSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  return sizes.indexOf(targetSize) - sizes.indexOf(yourSize) <= 1;
}
