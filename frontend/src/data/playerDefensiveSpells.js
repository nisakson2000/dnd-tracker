/**
 * playerDefensiveSpells.js
 * Player Mode: Best defensive spells ranked by impact
 * Pure JS — no React dependencies.
 */

export const DEFENSIVE_SPELLS_RANKED = [
  { spell: 'Shield', level: 1, action: 'Reaction', duration: 'Until start of next turn', effect: '+5 AC. Blocks Magic Missile.', rating: 'S', classes: ['Wizard', 'Sorcerer'] },
  { spell: 'Absorb Elements', level: 1, action: 'Reaction', duration: 'Until start of next turn', effect: 'Halve elemental damage. Next melee attack +1d6 of that type.', rating: 'S', classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'] },
  { spell: 'Counterspell', level: 3, action: 'Reaction', duration: 'Instant', effect: 'Negate a spell being cast. Auto if slot ≥ spell level.', rating: 'S', classes: ['Sorcerer', 'Warlock', 'Wizard'] },
  { spell: 'Misty Step', level: 2, action: 'Bonus Action', duration: 'Instant', effect: 'Teleport 30ft. Escape grapple, melee, danger.', rating: 'S', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'] },
  { spell: 'Death Ward', level: 4, action: 'Action', duration: '8 hours', effect: 'First time you drop to 0 HP, go to 1 HP instead. No concentration.', rating: 'A', classes: ['Cleric', 'Paladin'] },
  { spell: 'Mirror Image', level: 2, action: 'Action', duration: '1 minute', effect: '3 duplicates. Attacks might hit duplicates instead. No concentration.', rating: 'A', classes: ['Sorcerer', 'Warlock', 'Wizard'] },
  { spell: 'Blink', level: 3, action: 'Action', duration: '1 minute', effect: '50% chance to vanish to Ethereal Plane at end of turn. Untargetable.', rating: 'A', classes: ['Sorcerer', 'Wizard'] },
  { spell: 'Sanctuary', level: 1, action: 'Bonus Action', duration: '1 minute', effect: 'Enemies must WIS save to target the warded creature. No concentration.', rating: 'A', classes: ['Cleric'] },
  { spell: 'Warding Bond', level: 2, action: 'Action', duration: '1 hour', effect: 'Target gets +1 AC and saves. You take half their damage. Concentration.', rating: 'B', classes: ['Cleric'] },
  { spell: 'Armor of Agathys', level: 1, action: 'Action', duration: '1 hour', effect: '5 temp HP per slot level. Attackers take cold damage equal to temp HP. No concentration.', rating: 'A', classes: ['Warlock'] },
  { spell: 'Fire Shield', level: 4, action: 'Action', duration: '10 minutes', effect: 'Resistance to fire or cold. Melee attackers take 2d8 damage. No concentration.', rating: 'A', classes: ['Wizard'] },
  { spell: 'Globe of Invulnerability', level: 6, action: 'Action', duration: '1 minute', effect: 'Spells of 5th level or lower can\'t enter the sphere. Concentration.', rating: 'S', classes: ['Sorcerer', 'Wizard'] },
];

export function getDefensiveSpellsForClass(className) {
  return DEFENSIVE_SPELLS_RANKED.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getReactionSpells() {
  return DEFENSIVE_SPELLS_RANKED.filter(s => s.action === 'Reaction');
}

export function getNoConcentrationDefenses() {
  return DEFENSIVE_SPELLS_RANKED.filter(s => !s.duration.includes('Concentration'));
}
