/**
 * playerDeadlySpellsReference.js
 * Player Mode: The most dangerous enemy spells to watch for and how to counter them
 * Pure JS — no React dependencies.
 */

export const DEADLIEST_ENEMY_SPELLS = [
  {
    spell: 'Power Word Kill',
    level: 9,
    save: 'None',
    effect: 'If you have 100 HP or less, you die. No save. No resistance.',
    counter: 'Keep HP above 100. Counterspell. There is no other defense.',
    danger: 'S',
  },
  {
    spell: 'Meteor Swarm',
    level: 9,
    save: 'DEX',
    effect: '40d6 fire + bludgeoning in four 40ft radius spheres. Average 140 damage.',
    counter: 'Spread out. Absorb Elements. Fire resistance. Evasion.',
    danger: 'S',
  },
  {
    spell: 'Feeblemind',
    level: 8,
    save: 'INT',
    effect: 'INT and CHA become 1. Can\'t cast spells, use magic items, or understand language.',
    counter: 'High INT save. Counterspell. Only Greater Restoration or Heal can cure.',
    danger: 'S',
  },
  {
    spell: 'Dominate Monster',
    level: 8,
    save: 'WIS',
    effect: 'The DM controls your character. You attack your allies.',
    counter: 'High WIS save. Damage grants new save. Calm Emotions. Dispel Magic.',
    danger: 'S',
  },
  {
    spell: 'Forcecage',
    level: 7,
    save: 'None (CHA to teleport out)',
    effect: 'Trapped in a cage or solid box. Can\'t leave without teleportation + CHA save.',
    counter: 'Dispel Magic (if you can), Plane Shift, Misty Step (CHA save DC 17).',
    danger: 'S',
  },
  {
    spell: 'Prismatic Wall',
    level: 9,
    save: 'Multiple',
    effect: 'Seven layers, each with different damage and conditions. Must destroy in order.',
    counter: 'Dispel Magic on each layer (DC 19). Or just avoid it entirely.',
    danger: 'A',
  },
  {
    spell: 'Maze',
    level: 8,
    save: 'None (INT check to escape)',
    effect: 'Banished to an extradimensional maze. INT check DC 20 to escape.',
    counter: 'High INT. Minotaurs are immune (always know direction). Duration: concentration, 10 min.',
    danger: 'A',
  },
  {
    spell: 'Psychic Scream',
    level: 9,
    save: 'INT',
    effect: '14d6 psychic damage and stunned. INT save. Up to 10 creatures.',
    counter: 'High INT saves. Counter/Dispel. Creatures with INT 2 or lower are immune.',
    danger: 'S',
  },
  {
    spell: 'Disintegrate',
    level: 6,
    save: 'DEX',
    effect: '10d6+40 force damage. If reduced to 0 HP, you\'re disintegrated (nothing to Revivify).',
    counter: 'DEX save. Shield doesn\'t help (it\'s a save, not an attack). Counterspell.',
    danger: 'S',
  },
  {
    spell: 'Finger of Death',
    level: 7,
    save: 'CON',
    effect: '7d8+30 necrotic damage. If it kills you, you rise as a zombie under the caster\'s control.',
    counter: 'High CON save. Necrotic resistance. Don\'t die to it or you become an enemy zombie.',
    danger: 'A',
  },
  {
    spell: 'Hold Monster',
    level: 5,
    save: 'WIS',
    effect: 'Paralyzed. Auto-crit from melee. Auto-fail STR/DEX saves. Save at end of each turn.',
    counter: 'High WIS save. Freedom of Movement (immune to paralysis). Dispel Magic.',
    danger: 'S',
  },
  {
    spell: 'Hypnotic Pattern',
    level: 3,
    save: 'WIS',
    effect: 'Charmed + incapacitated. Can\'t act. Ends only when shaken awake or damaged.',
    counter: 'High WIS. Elf/Half-Elf advantage. Don\'t look (avert eyes). Counterspell.',
    danger: 'A',
  },
  {
    spell: 'Banishment',
    level: 4,
    save: 'CHA',
    effect: 'Banished to another plane for 1 minute. If non-native and concentration holds: permanent.',
    counter: 'High CHA save. Break caster\'s concentration. Counterspell.',
    danger: 'A',
  },
];

export const COUNTERSPELL_PRIORITY = {
  description: 'Which enemy spells to Counterspell, ranked by urgency.',
  alwaysCounter: ['Power Word Kill', 'Meteor Swarm', 'Disintegrate', 'Feeblemind', 'Dominate Monster', 'Forcecage'],
  usuallyCounter: ['Hold Monster', 'Banishment', 'Hypnotic Pattern', 'Finger of Death', 'Wall of Force'],
  sometimesCounter: ['Fireball', 'Lightning Bolt', 'Slow', 'Fear'],
  rarelyCounter: ['Cantrips', 'Low-level utility spells', 'Healing spells (unless critical moment)'],
};

export const IDENTIFYING_ENEMY_SPELLS = [
  'Watch for verbal and somatic components — they indicate spellcasting.',
  'Arcana check (DC 15 + spell level) to identify a spell as it\'s being cast.',
  'If you recognize the spell, you know its effects and can decide whether to Counterspell.',
  'Track which spells the enemy has used — they have limited slots too.',
  'If an enemy is concentrating, their concentration glow/aura may be visible.',
];

export function getSpellDanger(spellName) {
  return DEADLIEST_ENEMY_SPELLS.find(s => s.spell.toLowerCase() === (spellName || '').toLowerCase()) || null;
}

export function shouldCounterspell(spellName) {
  if (COUNTERSPELL_PRIORITY.alwaysCounter.includes(spellName)) return { counter: true, urgency: 'ALWAYS' };
  if (COUNTERSPELL_PRIORITY.usuallyCounter.includes(spellName)) return { counter: true, urgency: 'USUALLY' };
  if (COUNTERSPELL_PRIORITY.sometimesCounter.includes(spellName)) return { counter: false, urgency: 'SITUATIONAL' };
  return { counter: false, urgency: 'PROBABLY NOT' };
}
