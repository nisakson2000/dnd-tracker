/**
 * playerGrappleProneComboGuide.js
 * Player Mode: Grapple + Shove Prone — the ultimate martial lockdown combo
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_SHOVE_COMBO = {
  step1: 'Replace first attack with Grapple (Athletics vs Athletics/Acrobatics).',
  step2: 'Replace second attack with Shove Prone.',
  result: 'Target: GRAPPLED (speed 0) + PRONE (can\'t stand). Melee = advantage.',
  requires: 'Extra Attack (L5+). Free hand for grapple.',
};

export const GRAPPLE_RULES = {
  check: 'Your Athletics vs their Athletics/Acrobatics.',
  effect: 'Speed = 0. Drag at half speed.',
  escape: 'Action: Athletics/Acrobatics vs your Athletics.',
  size: 'Target no more than one size larger.',
};

export const BEST_GRAPPLERS = [
  { class: 'Rune Knight Fighter', rating: 'S+', note: 'Become Large. Grapple Huge creatures.' },
  { class: 'Barbarian (any)', rating: 'S+', note: 'Rage = advantage Athletics.' },
  { class: 'Lore/Swords Bard', rating: 'A+', note: 'Expertise Athletics + Cutting Words.' },
  { class: 'Unarmed Fighter', rating: 'A+', note: '+1d4 free damage while grappling.' },
];

export const GRAPPLE_ENHANCERS = [
  { source: 'Expertise Athletics', effect: 'Double PB.', rating: 'S+' },
  { source: 'Rage', effect: 'Advantage STR checks.', rating: 'S+' },
  { source: 'Enlarge', effect: 'Become Large. Advantage STR.', rating: 'S' },
  { source: 'Tavern Brawler', effect: 'Grapple as BA after hitting.', rating: 'A+' },
  { source: 'Skill Expert', effect: 'Expertise for any class.', rating: 'S' },
];

export const GRAPPLE_TIPS = [
  'Grapple + Prone: can\'t stand (speed 0). Melee advantage.',
  'Requires Extra Attack to do both in one turn.',
  'Expertise Athletics: most important for grapplers.',
  'Rage: advantage on grapple checks.',
  'Drag into hazards: Spike Growth, fire, cliffs.',
  'Need one free hand. Drop weapon if needed.',
  'Tavern Brawler: grapple as BA. Frees attacks.',
  'Enlarge: grapple Huge creatures.',
];
