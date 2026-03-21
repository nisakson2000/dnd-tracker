/**
 * playerGrappleBuildGuide.js
 * Player Mode: Grapple builds — rules, optimization, best classes
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Replaces one attack (not full Attack action). Athletics vs Athletics/Acrobatics.',
  effect: 'Grappled creature: speed becomes 0. You can drag them at half speed.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics.',
  size: 'Can only grapple creatures one size larger or smaller.',
  note: 'Grapple does NOT restrain. Add Shove Prone for the full combo.',
};

export const GRAPPLE_PRONE_COMBO = {
  step1: 'Attack action: first attack → Grapple (Athletics check).',
  step2: 'Second attack → Shove Prone (Athletics check).',
  result: 'Target is prone (advantage for melee, can\'t stand because speed = 0 from grapple).',
  why: 'Prone + Grappled = can\'t move, all melee has advantage, their attacks have disadvantage.',
  counter: 'Teleportation or Misty Step. Can\'t stand up while speed is 0.',
};

export const BEST_GRAPPLE_CLASSES = [
  { class: 'Barbarian', why: 'Advantage on STR checks while raging. Rage + Athletics expertise (feat).', rating: 'S+', note: 'Reckless Attack is for attacks, not grapple. Rage gives advantage on STR checks.' },
  { class: 'Rune Knight Fighter', why: 'Giant\'s Might: become Large (grapple Huge). +1d6 damage.', rating: 'S+', note: 'Large size = grapple Huge creatures. Best grapple subclass.' },
  { class: 'Bard', why: 'Expertise in Athletics. Jack of All Trades. Full caster.', rating: 'A+', note: 'Swords/Valor Bard with Expertise. Cast while grappling.' },
  { class: 'Rogue', why: 'Expertise in Athletics. Reliable Talent (min 10+mod).', rating: 'A+', note: 'Can\'t fail grapple at L10+. Reliable Talent Athletics.' },
  { class: 'Paladin', why: 'STR + heavy armor. Smite while grappling.', rating: 'A', note: 'Grapple → prone → smite with advantage. Devastating.' },
  { class: 'Monk (Astral Self)', why: 'WIS for grapple checks. 10ft reach arms.', rating: 'A', note: 'Astral Arms use WIS for Athletics. Unique.' },
];

export const GRAPPLE_FEATS = [
  { feat: 'Skill Expert', effect: 'Expertise in Athletics. +1 STR.', rating: 'S+', note: 'Core grapple feat. Doubles Athletics proficiency.' },
  { feat: 'Tavern Brawler', effect: 'BA grapple after unarmed strike. +1 STR. Improvised weapon proficiency.', rating: 'A+', note: 'Free BA grapple. More action economy.' },
  { feat: 'Grappler', effect: 'Advantage on attacks vs grappled. Pin (restrained both).', rating: 'C', note: 'TRAP FEAT. Prone already gives advantage. Pin restrains YOU too.' },
  { feat: 'Shield Master', effect: 'BA shove prone after Attack action. +shield to DEX saves.', rating: 'A+', note: 'Free BA shove. Grapple then BA prone in one turn.' },
  { feat: 'Crusher', effect: 'Push 5ft on bludgeoning hit. +1 STR/CON.', rating: 'A', note: 'Reposition grappled target. Push into hazards.' },
];

export const GRAPPLE_TACTICS = [
  { tactic: 'Grapple + Prone + Attack', method: 'Attack 1: Grapple. Attack 2: Shove Prone. Extra attacks: with advantage.', note: 'Core combo. All subsequent attacks have advantage.' },
  { tactic: 'Drag into Hazards', method: 'Grapple → drag into Spike Growth, Spirit Guardians, Cloud of Daggers.', note: 'Forced movement through damage zones. Devastating with caster ally.' },
  { tactic: 'Drag off Cliff', method: 'Grapple → drag to edge → shove off. They take fall damage.', note: 'Instant KO potential. Check local cliff availability.' },
  { tactic: 'Grapple the Caster', method: 'Grapple spellcaster. They can\'t maintain distance. Somatic components harder.', note: 'Casters hate being grappled. No escape without action/Misty Step.' },
  { tactic: 'Enlarge + Grapple', method: 'Enlarge to Large → grapple Huge creatures. Or grapple two Medium.', note: 'Rune Knight or Enlarge spell. Grapple bigger targets.' },
  { tactic: 'Shield Master Combo', method: 'Attack action (grapple) → BA Shield Master shove prone.', note: 'One turn: grapple + prone. Efficient.' },
];

export const GRAPPLE_BUILD_TIPS = [
  'Expertise in Athletics is MANDATORY. Skill Expert feat.',
  'Grapple + Prone: can\'t stand when speed = 0. Free advantage.',
  'Barbarian: advantage on STR checks while raging. Best grappler.',
  'Rune Knight: become Large. Grapple Huge creatures.',
  'Grappler feat is a TRAP. Don\'t take it. Prone is better.',
  'Drag enemies into Spike Growth: 2d4 per 5ft of forced movement.',
  'Shield Master: BA shove prone after Attack action.',
  'Tavern Brawler: BA grapple after unarmed strike. Action economy.',
  'STR > CON > DEX. Need Athletics + Constitution.',
  'You can grapple two creatures (one in each hand). No shield though.',
];
