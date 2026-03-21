/**
 * playerDivineSmiteMasteryGuide.js
 * Player Mode: Divine Smite — mechanics, math, optimization, and when to smite
 * Pure JS — no React dependencies.
 */

export const DIVINE_SMITE_RULES = {
  trigger: 'When you HIT with a melee weapon attack. Declare AFTER seeing the roll.',
  damage: '2d8 radiant (L1 slot). +1d8 per slot level above 1st. Max 5d8.',
  extraVsUndead: '+1d8 radiant vs undead and fiends. Always.',
  maxDice: '5d8 normally (4th+ slot). 6d8 vs undead/fiends.',
  critical: 'ALL smite dice doubled on crits. This is why Paladins live for crits.',
};

export const SMITE_DAMAGE_TABLE = [
  { slot: '1st', dice: '2d8', avg: 9, critAvg: 18, vsUndead: '3d8 (13.5)', vsUndeadCrit: '6d8 (27)' },
  { slot: '2nd', dice: '3d8', avg: 13.5, critAvg: 27, vsUndead: '4d8 (18)', vsUndeadCrit: '8d8 (36)' },
  { slot: '3rd', dice: '4d8', avg: 18, critAvg: 36, vsUndead: '5d8 (22.5)', vsUndeadCrit: '10d8 (45)' },
  { slot: '4th+', dice: '5d8', avg: 22.5, critAvg: 45, vsUndead: '6d8 (27)', vsUndeadCrit: '12d8 (54)' },
];

export const WHEN_TO_SMITE = [
  { situation: 'On a critical hit', priority: 'S+', reason: 'Double ALL dice. Always smite on crits. No exceptions.' },
  { situation: 'Against paralyzed/stunned targets (within 5ft = auto-crit)', priority: 'S+', reason: 'Hold Person + walk up + smite = guaranteed crit smite.' },
  { situation: 'To finish a dangerous enemy', priority: 'S', reason: 'Dead enemies deal 0 damage. End threats fast.' },
  { situation: 'Against undead/fiends', priority: 'S', reason: 'Extra 1d8 makes smiting more efficient vs these types.' },
  { situation: 'Boss near death', priority: 'A+', reason: 'Nova before it gets more legendary actions/lair actions.' },
];

export const WHEN_NOT_TO_SMITE = [
  'Against weak minions — sword damage is enough.',
  'Early in long adventuring days — budget slots across fights.',
  'When you need spell slots for Bless, heals, or utility.',
  'On every hit — you\'ll burn out fast. Save for crits and finishers.',
  'With 5th level slots — same 5d8 as 4th level. Use 5th for spells instead.',
];

export const SMITE_COMBOS = [
  { combo: 'Hold Person + Smite', effect: 'Auto-crit within 5ft. 4d8+ radiant from L1 slot.', rating: 'S+' },
  { combo: 'GWM + Smite on crit', effect: '-5/+10 + doubled smite dice. Massive burst.', rating: 'S' },
  { combo: 'Smite spell + Divine Smite', effect: 'Stack both on same hit. Wrathful Smite + Divine Smite = damage + frightened.', rating: 'S' },
  { combo: 'Sorcadin: Quickened Hold Person + Smite', effect: 'Cast Hold Person as BA, attack + crit-smite same turn.', rating: 'S+' },
  { combo: 'Elven Accuracy + Smite', effect: 'Triple advantage on attacks = more crits = more efficient smites.', rating: 'A+' },
];

export const SMITE_SPELLS_RANKED = [
  { spell: 'Wrathful Smite', level: 1, extra: '1d6 psychic', effect: 'Frightened (ACTION to end)', rating: 'S' },
  { spell: 'Banishing Smite', level: 5, extra: '5d10 force', effect: 'Banish if <50 HP', rating: 'S' },
  { spell: 'Thunderous Smite', level: 1, extra: '2d6 thunder', effect: 'Push 10ft + prone (STR save)', rating: 'A+' },
  { spell: 'Blinding Smite', level: 3, extra: '3d8 radiant', effect: 'Blinded (CON save/turn)', rating: 'A+' },
  { spell: 'Staggering Smite', level: 4, extra: '4d6 psychic', effect: 'Disadvantage + no reactions (WIS save)', rating: 'A' },
  { spell: 'Searing Smite', level: 1, extra: '1d6 fire/turn', effect: 'Ongoing fire damage (CON save)', rating: 'B+' },
  { spell: 'Branding Smite', level: 2, extra: '2d6 radiant', effect: 'Target glows (can\'t be invisible)', rating: 'B+' },
];
