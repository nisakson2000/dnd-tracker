/**
 * playerEscapeArtist.js
 * Player Mode: Escaping restraints, prisons, and impossible situations
 * Pure JS — no React dependencies.
 */

export const ESCAPING_GRAPPLE = {
  action: 'Uses your action: Athletics or Acrobatics vs grappler\'s Athletics.',
  alternatives: [
    'Misty Step (BA teleport, breaks grapple)',
    'Thunder Step (teleport + damage)',
    'Shapechange to Tiny or Huge (breaks size requirement)',
    'Freedom of Movement (auto-escape grapples)',
    'Telekinesis (lift yourself)',
  ],
};

export const ESCAPING_RESTRAINTS = {
  manacles: 'AC 19, HP 15. Escape: DC 20 DEX (Acrobatics) or STR check. Or DC 15 Thieves\' tools.',
  rope: 'Escape: DC 15-20 DEX or STR. Can be cut (AC 11, HP 2).',
  chains: 'AC 19, HP 10. Escape: DC 20 STR or DC 15 Thieves\' tools.',
  magical: 'Dimensional Shackles: no teleportation. DC 30 STR to break. Dispel Magic may work.',
  web: 'STR DC 12 to break free. Vulnerable to fire (burns in 1 round).',
};

export const ESCAPE_SPELLS = [
  { spell: 'Misty Step (2nd)', effect: 'Teleport 30ft. Breaks grapple, restraints don\'t prevent it (V only).', rating: 'S' },
  { spell: 'Dimension Door (4th)', effect: 'Teleport 500ft + bring 1 ally. Through walls.', rating: 'S' },
  { spell: 'Freedom of Movement (4th)', effect: 'Can\'t be restrained or grappled. Normal movement in water/difficult terrain.', rating: 'S' },
  { spell: 'Gaseous Form (3rd)', effect: 'Become gas. Fit through any crack. Can\'t be restrained.', rating: 'A' },
  { spell: 'Knock (2nd)', effect: 'Opens any lock, bar, or restraint. Loud (300ft audible knock).', rating: 'A' },
  { spell: 'Passwall (5th)', effect: 'Create passage through wall. Walk out of prison.', rating: 'S' },
  { spell: 'Etherealness (7th)', effect: 'Become ethereal. Walk through walls.', rating: 'S' },
  { spell: 'Dispel Magic (3rd)', effect: 'Remove magical restraints, barriers, or locks.', rating: 'A' },
];

export const PRISON_ESCAPE_METHODS = [
  { method: 'Verbal-only spells', note: 'If hands are bound, cast spells with only verbal components. Misty Step, Command, Healing Word.' },
  { method: 'Thieves\' tools hidden', note: 'Hide lockpicks in boots, hair, or mouth. DC 15-20 to find in a search.' },
  { method: 'Wild Shape', note: 'Druid: turn into a spider or rat. Squeeze through bars. No components needed.' },
  { method: 'Familiar scouting', note: 'Wizard: dismiss familiar (action). Resummon on the other side of the door.' },
  { method: 'Arcane Trickster Mage Hand', note: 'Invisible Mage Hand. Pick locks from inside the cell.' },
  { method: 'Subtle Spell', note: 'Sorcerer: cast without components. Guards don\'t know you\'re casting.' },
  { method: 'Warforged/Construct', note: 'Don\'t need to eat, breathe, or sleep. Wait for opportunity.' },
];

export const CAPTURED_PROTOCOLS = [
  'Stay calm. Don\'t fight guards you can\'t beat.',
  'Hide a component pouch or focus if possible.',
  'Note guard schedules, patrol routes, and shift changes.',
  'Look for weaknesses: crumbling walls, rusty bars, inattentive guards.',
  'Charm Person or Friends on a guard (risky but effective).',
  'If the party is split: the free members plan a rescue.',
  'Always have a party contingency plan for capture scenarios.',
];

export function escapeCheckDC(restraintType) {
  const dcs = { rope: 17, manacles: 20, chains: 20, web: 12, magical: 30 };
  return dcs[restraintType] || 15;
}

export function canCastWhileBound(hasVerbalComponent, hasSomaticComponent, handsBound) {
  if (handsBound && hasSomaticComponent) return false;
  return true; // verbal-only spells can be cast while bound
}
