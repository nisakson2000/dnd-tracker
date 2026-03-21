/**
 * playerTeleportAndMovementGuide.js
 * Player Mode: Teleportation spells — combat movement, travel, escape
 * Pure JS — no React dependencies.
 */

export const COMBAT_TELEPORTS = [
  { spell: 'Misty Step (L2)', range: '30ft', action: 'Bonus action', note: 'Best combat teleport. Escape grapple, reposition, cross gaps.' },
  { spell: 'Thunder Step (L3)', range: '90ft', action: 'Action', note: '3d10 thunder near start. Bring 1 ally.' },
  { spell: 'Far Step (L5)', range: '60ft/turn', action: 'Bonus action each turn', note: '60ft teleport every turn. Concentration 1 min.' },
  { spell: 'Dimension Door (L4)', range: '500ft', action: 'Action', note: 'Through walls. Bring 1 creature.' },
  { spell: 'Steel Wind Strike (L5)', range: '30ft', action: 'Action', note: '5 targets, 6d10 each. Teleport to one.' },
  { spell: 'Scatter (L6)', range: '120ft', action: 'Action', note: 'Teleport 5 creatures. Unwilling: CHA save.' },
];

export const TRAVEL_TELEPORTS = [
  { spell: 'Teleportation Circle (L5)', range: 'Known sigils', time: '1 minute', note: 'Permanent circles in cities. Must know sigil.' },
  { spell: 'Teleport (L7)', range: 'Same plane', time: 'Action', note: 'Party-wide. Accuracy varies by familiarity.' },
  { spell: 'Plane Shift (L7)', range: 'Other planes', time: 'Action', note: 'Interplanar. Or banish unwilling (CHA save).' },
  { spell: 'Transport via Plants (L6)', range: 'Between trees', time: 'Action', note: 'Druid. Same plane, any tree.' },
  { spell: 'Word of Recall (L6)', range: 'Sanctuary', time: 'Action', note: 'Cleric escape to designated safe place.' },
  { spell: 'Gate (L9)', range: 'Other planes (precise)', time: 'Action', note: 'Portal. Summon specific creature.' },
];

export const TELEPORT_ACCURACY = [
  { familiarity: 'Permanent Circle', onTarget: '100%' },
  { familiarity: 'Associated Object', onTarget: '100%' },
  { familiarity: 'Very Familiar', onTarget: '95%' },
  { familiarity: 'Seen Casually', onTarget: '78%' },
  { familiarity: 'Viewed Once', onTarget: '54%' },
  { familiarity: 'Description Only', onTarget: '24%' },
];

export const TELEPORT_TACTICS = [
  { tactic: 'Misty Step Escape', how: 'Grappled/surrounded? Bonus action out. No AoO.' },
  { tactic: 'Thunder Step Rescue', how: 'Grab downed ally. Teleport + damage enemies behind.' },
  { tactic: 'Dimension Door Over Walls', how: '500ft through barriers. Describe destination.' },
  { tactic: 'Far Step Kiting', how: 'Bonus action 60ft/turn. Uncatchable.' },
  { tactic: 'Plane Shift Banish', how: 'CHA save or permanently sent to another plane.' },
];

export const TELEPORT_TIPS = [
  'Misty Step: best combat teleport. Bonus action. Escape anything.',
  'Thunder Step: rescue ally + deal damage + reposition.',
  'Dimension Door: 500ft. Through walls. Bring one ally.',
  'Teleportation doesn\'t provoke opportunity attacks.',
  'Teleport accuracy depends on familiarity. Get sigil sequences.',
  'Plane Shift offensively: CHA save or permanent banishment.',
  'Far Step: 60ft bonus action teleport every turn. Amazing.',
  'Word of Recall: Cleric panic button to sanctuary.',
  'Transport via Plants: Druid long-range teleport.',
  'Always collect Teleportation Circle sigils when visiting cities.',
];
