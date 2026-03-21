/**
 * playerSmitingOptGuide.js
 * Player Mode: Paladin Divine Smite — when to smite, slot efficiency, and crit fishing
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  trigger: 'On hit with melee weapon attack. Declare AFTER seeing the hit (not before).',
  damage: '2d8 radiant per spell slot level (1st = 2d8, 2nd = 3d8, etc.). Max 5d8.',
  bonus: '+1d8 vs undead or fiend (total max 6d8).',
  slots: 'Uses ANY spell slot (including multiclass slots).',
  crits: 'Smite dice are DOUBLED on critical hits.',
  note: 'You choose to smite AFTER the hit. Save your smites for crits.',
};

export const SMITE_DAMAGE_TABLE = [
  { slot: '1st', dice: '2d8', avg: 9, critAvg: 18, note: 'Most efficient. Best damage per slot level.' },
  { slot: '2nd', dice: '3d8', avg: 13.5, critAvg: 27, note: 'Good balance of damage and slot conservation.' },
  { slot: '3rd', dice: '4d8', avg: 18, critAvg: 36, note: 'Strong. Worth it on crits.' },
  { slot: '4th', dice: '5d8', avg: 22.5, critAvg: 45, note: 'Maximum smite damage. Save for big crits.' },
  { slot: '5th', dice: '5d8', avg: 22.5, critAvg: 45, note: 'Same as 4th. Don\'t waste 5th slots on smite.' },
  { slot: 'vs Undead/Fiend', dice: '+1d8', avg: '+4.5', critAvg: '+9', note: 'Extra die against undead/fiend targets.' },
];

export const SMITE_SPELLS_RANKED = [
  { spell: 'Wrathful Smite', level: 1, damage: '1d6 psychic', extra: 'Frightened (WIS save, uses ACTION to end)', rating: 'S', note: 'Best smite spell. Frightened is devastating. Action to end (not save at end of turn).' },
  { spell: 'Thunderous Smite', level: 1, damage: '2d6 thunder', extra: 'Push 10ft + prone (STR save)', rating: 'A+', note: 'Prone = advantage for allies. Push into hazards.' },
  { spell: 'Searing Smite', level: 1, damage: '1d6 fire', extra: '1d6 fire each round (CON save)', rating: 'A', note: 'DoT effect. Good sustained damage.' },
  { spell: 'Branding Smite', level: 2, damage: '2d6 radiant', extra: 'Target visible if invisible. Glows.', rating: 'B+', note: 'Niche. Good vs invisible enemies.' },
  { spell: 'Blinding Smite', level: 3, damage: '3d8 radiant', extra: 'Blinded (CON save each round)', rating: 'A+', note: 'Blinded is powerful. CON save is common though.' },
  { spell: 'Staggering Smite', level: 4, damage: '4d6 psychic', extra: 'Disadvantage on attacks/saves, no reactions (WIS save)', rating: 'A', note: 'Good debuff but 4th level slot is expensive.' },
  { spell: 'Banishing Smite', level: 5, damage: '5d10 force', extra: 'Banish if target drops below 50 HP', rating: 'S', note: 'Massive damage + potential banishment. Best high-level smite.' },
];

export const CRIT_FISHING_METHODS = [
  { method: 'Elven Accuracy (Half-Elf)', effect: 'Triple advantage = 14.3% crit rate.', rating: 'S+' },
  { method: 'Vow of Enmity (Vengeance)', effect: 'Advantage on all attacks vs 1 target.', rating: 'S+' },
  { method: 'Champion 3 dip', effect: 'Crit on 19-20. With Elven Accuracy + advantage: 27.1% crit rate.', rating: 'S' },
  { method: 'Hold Person/Monster', effect: 'Paralyzed = auto-crit within 5ft.', rating: 'S+' },
  { method: 'Darkness + Devil\'s Sight (Warlock dip)', effect: 'Advantage in darkness.', rating: 'A+' },
];

export const SMITE_TIPS = [
  'SAVE SMITES FOR CRITS. Doubled dice on crits is the whole point of being a Paladin.',
  'Divine Smite declared after the hit. You can see the natural 20 before choosing to smite.',
  'L1 slots are most efficient per slot level. Use them for non-crit smites.',
  'L4-5 slots: only smite on crits. 5d8 doubled = 10d8 = 45 avg damage.',
  'Wrathful Smite: best smite spell. Frightened requires ACTION (not save) to end.',
  'Smite works with multiclass spell slots. Sorcadin = tons of slots for smiting.',
  'Vs undead/fiend: +1d8. Extra reason to smite on crits against undead bosses.',
  'Don\'t burn all slots turn 1. Pace yourself. Save at least 1 slot for emergency Smite.',
  'Hold Person + Smite = auto-crit + doubled smite dice. Best nova combo.',
  'Banishing Smite (5th): 5d10 force + banish. Use on the BBEG.',
];
