/**
 * playerTeleportationSpellGuide.js
 * Player Mode: All teleportation options — spells, items, and class features
 * Pure JS — no React dependencies.
 */

export const TELEPORTATION_SPELLS = [
  { spell: 'Misty Step', level: 2, range: '30ft', action: 'BA', concentration: false, rating: 'S+', note: 'Best escape spell. BA teleport 30ft to visible location. No OAs.' },
  { spell: 'Thunder Step', level: 3, range: '90ft', action: 'Action', concentration: false, rating: 'A+', note: '90ft teleport + 3d10 AoE at origin. Can bring 1 ally.' },
  { spell: 'Dimension Door', level: 4, range: '500ft', action: 'Action', concentration: false, rating: 'S', note: '500ft! Don\'t need to see target. Can bring 1 ally. Through walls.' },
  { spell: 'Far Step', level: 5, range: '60ft/turn', action: 'BA each turn', concentration: true, rating: 'A+', note: '60ft teleport as BA every turn for 1 minute. Concentration.' },
  { spell: 'Teleport', level: 7, range: 'Same plane', action: 'Action', concentration: false, rating: 'S+', note: 'Long-range teleport. Accuracy depends on familiarity. Mishap risk.' },
  { spell: 'Teleportation Circle', level: 5, range: '10ft circle', action: '1 minute', concentration: false, rating: 'A+', note: 'Travel to known permanent circles. 1 year daily casting creates permanent circle.' },
  { spell: 'Plane Shift', level: 7, range: 'Other planes', action: 'Action', concentration: false, rating: 'S', note: 'Travel between planes. Requires tuning fork. Can banish enemies.' },
  { spell: 'Word of Recall', level: 6, range: 'Prepared sanctuary', action: 'Action', concentration: false, rating: 'A+', note: 'Cleric-only. Instant return to prepared sanctuary with 5 allies.' },
  { spell: 'Transport via Plants', level: 6, range: 'Between trees', action: 'Action', concentration: false, rating: 'A+', note: 'Teleport between plants. Druid-only. Incredible range.' },
  { spell: 'Scatter', level: 6, range: '30ft (120ft targets)', action: 'Action', concentration: false, rating: 'A', note: 'Teleport up to 5 creatures to new positions. CHA save to resist.' },
  { spell: 'Gate', level: 9, range: 'Any plane', action: 'Action', concentration: true, rating: 'S+', note: 'Open portal to exact location. Can summon specific creatures by name.' },
  { spell: 'Arcane Gate', level: 6, range: '500ft', action: 'Action', concentration: true, rating: 'A', note: 'Portal pair within 500ft. 10 min. Concentration.' },
];

export const TELEPORTATION_CLASS_FEATURES = [
  { feature: 'Fey Step (Eladrin)', range: '30ft', uses: 'PB/LR (or 1/SR pre-Tasha\'s)', note: 'Free Misty Step. Season-dependent bonus effect.' },
  { feature: 'Shadow Step (Shadow Monk)', range: '60ft', uses: 'At will (dim light/darkness)', note: 'Free teleport in shadows. Advantage on next attack.' },
  { feature: 'Benign Transposition (Conjuration Wizard)', range: '30ft', uses: '1/LR or on conjuration cast', note: 'Swap with willing ally or empty space.' },
  { feature: 'Echo Knight Teleport', range: '15ft to echo', uses: 'At will', note: 'Swap with echo. Free positioning.' },
  { feature: 'Misty Escape (Archfey Warlock)', range: '60ft', uses: '1/SR', note: 'Invisible + 60ft teleport when damaged.' },
  { feature: 'Cape of the Mountebank', range: 'Dimension Door', uses: '1/day', note: 'Magic item. Free Dimension Door.' },
  { feature: 'Helm of Teleportation', range: 'Teleport spell', uses: '3/day', note: 'Rare item. 3 free Teleport spells per day.' },
];

export const TELEPORTATION_TIPS = [
  'Misty Step: best teleport. BA, 30ft, no concentration. Always prepare it.',
  'Dimension Door: 500ft through walls. Best escape spell. Can bring 1 ally.',
  'Teleport: accuracy varies. "Very Familiar" = safe. Unknown = mishap risk.',
  'Shadow Step (Shadow Monk): FREE teleport in shadows. At will. Infinite.',
  'Thunder Step: teleport + 3d10 AoE at your starting location. Cool exit.',
  'Teleportation Circle: create permanent circles with 365 days of casting.',
  'Plane Shift: offensive use = banish creature to another plane (CHA save).',
  'Eladrin Fey Step: free PB/LR Misty Step. Best teleportation race.',
  'Echo Knight: effectively teleport to echo position at will.',
  'Don\'t teleport into solid objects. Dimension Door fails safely (4d6 damage).',
];
