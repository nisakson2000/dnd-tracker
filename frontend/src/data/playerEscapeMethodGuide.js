/**
 * playerEscapeMethodGuide.js
 * Player Mode: Escape methods — getting out of danger when things go wrong
 * Pure JS — no React dependencies.
 */

export const ESCAPE_SPELLS = [
  { spell: 'Misty Step', level: 2, action: 'BA', range: '30ft teleport', rating: 'S+', note: 'Best escape spell. BA + teleport. No AoE. Through bars.' },
  { spell: 'Thunder Step', level: 3, action: 'Action', range: '90ft teleport + 3d10 AoE', rating: 'S', note: 'Farther + damages enemies left behind. Can take one ally.' },
  { spell: 'Dimension Door', level: 4, action: 'Action', range: '500ft teleport', rating: 'S+', note: '500ft. Bring one willing creature. Through walls.' },
  { spell: 'Scatter', level: 6, action: 'Action', range: '5 creatures teleport 120ft', rating: 'S', note: 'Relocate entire party. Unwilling: WIS save.' },
  { spell: 'Word of Recall', level: 6, action: 'Action', range: 'Teleport to sanctuary', rating: 'S+ (Cleric)', note: 'Teleport 5 allies to pre-set sanctuary. Ultimate escape.' },
  { spell: 'Teleport', level: 7, action: 'Action', range: 'Any distance', rating: 'S+', note: 'Go anywhere. Mishap risk for unfamiliar locations.' },
  { spell: 'Plane Shift', level: 7, action: 'Action', range: 'Another plane', rating: 'S+', note: 'Nuclear escape option. Different plane entirely.' },
];

export const ESCAPE_FEATURES = [
  { feature: 'Cunning Action (Rogue)', effect: 'BA Dash or Disengage.', rating: 'S+', note: 'Every turn. No cost.' },
  { feature: 'Step of the Wind (Monk)', effect: 'BA Dash or Disengage. 1 Ki.', rating: 'S', note: 'Double speed dash. + slow fall.' },
  { feature: 'Fey Step (Eladrin)', effect: 'BA 30ft teleport 1/SR.', rating: 'S', note: 'Racial Misty Step. Free.' },
  { feature: 'Nimble Escape (Goblin)', effect: 'BA Disengage or Hide.', rating: 'S', note: 'Racial Cunning Action.' },
  { feature: 'Rage Instinct (Barbarian)', effect: 'Halved damage. Hard to kill while running.', rating: 'A+', note: 'Tank damage while retreating.' },
  { feature: 'Wild Shape (Druid)', effect: 'Transform into bird/horse. Fly or run away.', rating: 'A+', note: 'Flying forms especially.' },
];

export const ESCAPE_ITEMS = [
  { item: 'Cape of the Mountebank', effect: 'Dimension Door 1/day.', rating: 'S', note: '500ft teleport. Rare item.' },
  { item: 'Helm of Teleportation', effect: 'Teleport 3/day.', rating: 'S+', note: 'Rare. Multiple daily escapes.' },
  { item: 'Ring of X-Ray Vision', effect: 'See through walls. Plan escape route.', rating: 'A', note: 'Find exits. Intelligence gathering.' },
  { item: 'Potion of Speed', effect: 'Haste for 1 minute.', rating: 'A+', note: 'Double speed. Extra Dash action.' },
  { item: 'Scroll of Teleport', effect: 'Emergency teleport. One use.', rating: 'S', note: 'Keep one in reserve always.' },
];

export const ESCAPE_TACTICS = [
  { tactic: 'Fog Cloud + Disengage', method: 'Drop Fog Cloud on yourself. Enemies can\'t see you to AoE. Disengage and run.', rating: 'S' },
  { tactic: 'Darkness + Devil\'s Sight', method: 'Cast Darkness. You see, they don\'t. Walk away.', rating: 'A+' },
  { tactic: 'Wall spell block', method: 'Wall of Force/Stone behind you as you retreat.', rating: 'S+' },
  { tactic: 'Polymorph escape', method: 'Polymorph into giant eagle (80ft fly). Carry an ally.', rating: 'S' },
  { tactic: 'Gaseous Form', method: 'Float through cracks. Can\'t be stopped by doors.', rating: 'A+' },
  { tactic: 'Feather Fall + jump off cliff', method: 'Jump off height. Feather Fall = safe landing. Enemies can\'t follow.', rating: 'A' },
];

export const ESCAPE_TIPS = [
  'Misty Step: best escape spell. BA + 30ft teleport. Always prepare.',
  'Dimension Door: 500ft + bring one ally. Through walls.',
  'Fog Cloud: blocks targeting. Buy time to run.',
  'Disengage: costs Action but prevents AoE. Worth it to survive.',
  'Cunning Action Dash: Rogue doubles movement as BA. Best runner.',
  'Polymorph into flying creature: fastest escape for entire party.',
  'Wall of Force behind you: nothing passes. Clean getaway.',
  'Keep a Scroll of Teleport in reserve. Emergency escape button.',
  'Gaseous Form: slow but unstoppable. Pass through any opening.',
  'Don\'t be afraid to retreat. Dead characters deal no damage.',
];
