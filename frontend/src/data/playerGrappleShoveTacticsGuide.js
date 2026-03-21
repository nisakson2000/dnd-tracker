/**
 * playerGrappleShoveTacticsGuide.js
 * Player Mode: Grappling and shoving — rules, builds, and tactics
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Replaces ONE attack (not full Attack action). Can grapple + attack with Extra Attack.',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (their choice).',
  effect: 'Target\'s speed becomes 0. They can\'t move. You can drag them at half speed.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics.',
  sizeLimit: 'Can only grapple creatures up to ONE size larger than you.',
  freeHand: 'Requires one free hand.',
};

export const SHOVE_RULES = {
  action: 'Replaces ONE attack. Your Athletics vs target\'s Athletics or Acrobatics.',
  options: ['Knock prone (advantage for melee, disadvantage for ranged)', 'Push 5 feet (into hazards, off ledges)'],
  sizeLimit: 'Up to one size larger.',
};

export const GRAPPLE_SHOVE_COMBO = {
  step1: 'Attack 1: Grapple (Athletics check). Target\'s speed = 0.',
  step2: 'Attack 2: Shove prone (Athletics check). Target falls prone.',
  result: 'Target is prone + grappled. Can\'t stand up. All melee attacks have advantage.',
  rating: 'S+',
};

export const GRAPPLING_BUILDS = [
  { build: 'Rune Knight Grappler', class: 'Fighter', key: 'Giant\'s Might: become Large. Fire Rune: restrain.', rating: 'S+' },
  { build: 'Barbarian Grappler', class: 'Barbarian', key: 'Rage: advantage on STR checks (grapple). Reckless for attacks.', rating: 'S+' },
  { build: 'Astral Self Monk', class: 'Monk', key: 'Use WIS for grapple with Astral Arms.', rating: 'A+' },
  { build: 'Bard Grappler', class: 'Bard', key: 'Expertise in Athletics. Enhance Ability.', rating: 'A' },
];

export const GRAPPLE_ENHANCERS = [
  { enhancer: 'Expertise (Athletics)', effect: 'Double proficiency on grapple.', rating: 'S+' },
  { enhancer: 'Rage', effect: 'Advantage on STR checks.', rating: 'S+' },
  { enhancer: 'Enlarge', effect: 'Advantage on STR + grapple one size larger.', rating: 'S' },
  { enhancer: 'Tavern Brawler', effect: 'BA grapple after unarmed hit.', rating: 'A+' },
  { enhancer: 'Skill Expert', effect: 'Expertise in Athletics. Half-feat.', rating: 'S+' },
];

export const GRAPPLING_TIPS = [
  'Grapple replaces ONE attack. Grapple + attack with Extra Attack.',
  'Grapple → Shove prone = locked down. Can\'t stand up. All melee has advantage.',
  'Expertise in Athletics is mandatory for grapplers.',
  'Rage + Athletics expertise = nearly unbeatable grapple checks.',
  'Drag enemies into Spike Growth, Wall of Fire, off cliffs.',
  'Need a FREE HAND. Shield + weapon works. TWF doesn\'t.',
  'Tavern Brawler: unarmed hit → BA grapple. Fast setup.',
  'Enlarge lets you grapple Huge creatures (Rune Knight too).',
];
