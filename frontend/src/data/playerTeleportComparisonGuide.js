/**
 * playerTeleportComparisonGuide.js
 * Player Mode: All teleportation options compared — spells, items, and features
 * Pure JS — no React dependencies.
 */

export const TELEPORT_SPELLS_RANKED = [
  { spell: 'Misty Step', level: 2, range: '30ft', action: 'BA', passengers: 0, risk: 'None', rating: 'S+', note: 'Best escape. BA, verbal only, 30ft. Always prepare.' },
  { spell: 'Thunder Step', level: 3, range: '90ft', action: 'Action', passengers: 1, risk: 'None', rating: 'A+', note: '90ft + 1 passenger + 3d10 AoE at departure.' },
  { spell: 'Dimension Door', level: 4, range: '500ft', action: 'Action', passengers: 1, risk: 'Minor (4d6 if occupied)', rating: 'S', note: 'No LOS needed. 500ft. Through walls.' },
  { spell: 'Far Step', level: 5, range: '60ft/turn', action: 'BA each turn', passengers: 0, risk: 'None', rating: 'A', note: 'Concentration. Repeat BA teleport for 1 min.' },
  { spell: 'Teleport', level: 7, range: 'Same plane', action: 'Action', passengers: 8, risk: 'Familiarity-based mishap', rating: 'S+', note: 'Long-distance travel. Carry associated object for safety.' },
  { spell: 'Transport via Plants', level: 6, range: 'Same plane (plant to plant)', action: 'Action', passengers: 'Unlimited', risk: 'None', rating: 'S', note: 'Druid only. Safe, no mishap. Needs a plant at each end.' },
  { spell: 'Word of Recall', level: 6, range: 'Designated sanctuary', action: 'Action', passengers: 5, risk: 'None', rating: 'A+', note: 'Cleric emergency evac to pre-set location.' },
  { spell: 'Plane Shift', level: 7, range: 'Other planes', action: 'Action', passengers: 8, risk: 'Random arrival point', rating: 'S', note: 'Planar travel or offensive banishment (CHA save).' },
  { spell: 'Gate', level: 9, range: 'Any plane (precise)', action: 'Action', passengers: 'Unlimited portal', risk: 'None', rating: 'S+', note: 'Perfect accuracy. Can summon named creatures.' },
  { spell: 'Arcane Gate', level: 6, range: '500ft between portals', action: 'Action', passengers: 'Unlimited', risk: 'None', rating: 'A', note: 'Tactical. Two portals within 500ft. 10 min concentration.' },
  { spell: 'Scatter', level: 6, range: '120ft', action: 'Action', passengers: 5, risk: 'None', rating: 'A', note: 'Reposition allies/force enemies (WIS save).' },
  { spell: 'Teleportation Circle', level: 5, range: 'Known circles', action: '1 minute', passengers: 'Unlimited', risk: 'None', rating: 'A+', note: '1 year daily casting = permanent circle.' },
];

export const TELEPORT_CLASS_FEATURES = [
  { feature: 'Shadow Step (Shadow Monk)', range: '60ft', cost: 'Free', requirement: 'Dim light/darkness at both ends', note: 'BA. Advantage on next attack. Unlimited use.' },
  { feature: 'Fey Step (Eladrin)', range: '30ft', cost: 'Free', requirement: '1/SR', note: 'BA Misty Step. Seasonal effects (charm, fear, etc.).' },
  { feature: 'Benign Transposition (Conjuration Wizard)', range: '30ft', cost: 'Free', requirement: '1/LR or when conjuration cast', note: 'Teleport self or swap with willing creature.' },
  { feature: 'Soulknife Psychic Teleportation (L9)', range: '10×psi die ft', cost: 'Free', requirement: 'Psi die', note: 'BA teleport. Costs psi die.' },
  { feature: 'Echo Knight (Fighter)', range: '15ft swap', cost: 'Free', requirement: 'Echo exists', note: 'Teleport to echo position. BA to resummon echo.' },
  { feature: 'Cape of the Mountebank', range: 'Dimension Door', cost: '1/day', requirement: 'Attunement', note: 'Free Dimension Door with smoke puff.' },
  { feature: 'Helm of Teleportation', range: 'Teleport', cost: '3 charges', requirement: 'Attunement', note: 'Cast Teleport. Incredible item.' },
];

export const TELEPORT_TIPS = [
  'Always carry an "associated object" from your home base. Teleport at 100% accuracy.',
  'Misty Step: verbal only. Cast while grappled, restrained, or bound (hands tied).',
  'Dimension Door: describe location blindly. "500ft north, 50ft up." No LOS needed.',
  'Thunder Step: deals damage where you LEFT. Position near enemies, then teleport to safety.',
  'Transport via Plants is underrated. Any plant to any plant on the same plane. No mishap.',
  'Plane Shift offensively: CHA save or banished. Works on any creature regardless of HP.',
  'Word of Recall: set your sanctuary at the safest location you know. Emergency button.',
  'Teleportation Circle: invest 1 year for permanent circle. Creates a teleportation network.',
];
