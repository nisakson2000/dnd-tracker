/**
 * playerHealingSpells.js
 * Player Mode: Healing spell quick reference and comparison
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// HEALING SPELLS
// ---------------------------------------------------------------------------

export const HEALING_SPELLS = [
  {
    name: 'Cure Wounds',
    level: 1,
    casting: 'Action',
    range: 'Touch',
    healing: '1d8 + spellcasting mod',
    upcast: '+1d8 per slot level above 1st',
    classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'],
    notes: 'Most efficient in-combat single target heal.',
  },
  {
    name: 'Healing Word',
    level: 1,
    casting: 'Bonus Action',
    range: '60 feet',
    healing: '1d4 + spellcasting mod',
    upcast: '+1d4 per slot level above 1st',
    classes: ['Bard', 'Cleric', 'Druid'],
    notes: 'Best emergency heal — bonus action, ranged. Get allies up from 0 HP.',
  },
  {
    name: 'Prayer of Healing',
    level: 2,
    casting: '10 minutes',
    range: '30 feet',
    healing: '2d8 + spellcasting mod (up to 6 creatures)',
    upcast: '+1d8 per slot level above 2nd',
    classes: ['Cleric'],
    notes: 'Out-of-combat group heal. NOT usable during combat.',
  },
  {
    name: 'Mass Healing Word',
    level: 3,
    casting: 'Bonus Action',
    range: '60 feet',
    healing: '1d4 + spellcasting mod (up to 6 creatures)',
    upcast: '+1d4 per slot level above 3rd',
    classes: ['Cleric'],
    notes: 'Emergency group heal. Gets multiple allies up.',
  },
  {
    name: 'Aura of Vitality',
    level: 3,
    casting: 'Action',
    range: 'Self (30ft radius)',
    healing: '2d6 per bonus action (up to 10 rounds)',
    upcast: null,
    classes: ['Paladin'],
    notes: 'Concentration, 1 minute. 20d6 total over duration.',
  },
  {
    name: 'Mass Cure Wounds',
    level: 5,
    casting: 'Action',
    range: '60 feet',
    healing: '3d8 + spellcasting mod (up to 6 creatures)',
    upcast: '+1d8 per slot level above 5th',
    classes: ['Bard', 'Cleric', 'Druid'],
    notes: 'Powerful group heal.',
  },
  {
    name: 'Heal',
    level: 6,
    casting: 'Action',
    range: '60 feet',
    healing: '70 HP flat',
    upcast: '+10 HP per slot level above 6th',
    classes: ['Cleric', 'Druid'],
    notes: 'Massive single-target heal. Also ends blindness, deafness, and diseases.',
  },
  {
    name: 'Goodberry',
    level: 1,
    casting: 'Action',
    range: 'Touch',
    healing: '1 HP per berry (10 berries)',
    upcast: null,
    classes: ['Druid', 'Ranger'],
    notes: 'Creates 10 berries that each heal 1 HP and provide a day of nourishment. Last 24 hours.',
  },
  {
    name: 'Life Transference',
    level: 3,
    casting: 'Action',
    range: '30 feet',
    healing: '2x necrotic damage you take (4d8 necrotic to self, target heals 8d8)',
    upcast: '+1d8 necrotic per slot level above 3rd',
    classes: ['Cleric', 'Wizard'],
    notes: 'Sacrifice your HP to heal others. Powerful but risky.',
  },
  {
    name: 'Revivify',
    level: 3,
    casting: 'Action',
    range: 'Touch',
    healing: '1 HP (bring back from death)',
    upcast: null,
    classes: ['Cleric', 'Paladin'],
    notes: 'Requires 300gp diamond. Target must have died within the last minute.',
    material: '300gp diamond (consumed)',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get healing spells available to a class.
 */
export function getHealingSpells(className) {
  return HEALING_SPELLS.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

/**
 * Get healing spells by level.
 */
export function getHealingSpellsByLevel(level) {
  return HEALING_SPELLS.filter(s => s.level === level);
}

/**
 * Get bonus action heals (for combat priority).
 */
export function getBonusActionHeals(className) {
  return getHealingSpells(className).filter(s => s.casting.toLowerCase().includes('bonus'));
}
