/**
 * playerCharacterBackup.js
 * Player Mode: Character backup templates and export helpers
 * Pure JS — no React dependencies.
 */

export const CHARACTER_SNAPSHOT_TEMPLATE = {
  basics: {
    name: '',
    class: '',
    level: 1,
    race: '',
    background: '',
    alignment: '',
    experiencePoints: 0,
  },
  stats: {
    hp: { current: 0, max: 0, temp: 0 },
    ac: 10,
    initiative: 0,
    speed: 30,
    proficiencyBonus: 2,
    hitDice: { total: 1, remaining: 1, dieType: 'd8' },
  },
  abilityScores: {
    STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10,
  },
  resources: {
    spellSlots: {},
    classResources: [],
    items: [],
    gold: 0,
  },
  deathSaves: { successes: 0, failures: 0 },
  conditions: [],
  notes: '',
  timestamp: null,
};

export const BACKUP_TRIGGERS = [
  'Before a long rest (snapshot end-of-day state)',
  'Before entering a dangerous dungeon',
  'After leveling up (save the fresh state)',
  'Before a boss fight',
  'At the end of each session',
];

export const SESSION_STATE_FIELDS = [
  { field: 'Current HP', category: 'combat', important: true },
  { field: 'Spell Slots Used', category: 'resources', important: true },
  { field: 'Hit Dice Remaining', category: 'resources', important: true },
  { field: 'Class Resources (Ki, Rage, etc.)', category: 'resources', important: true },
  { field: 'Concentration Spell Active', category: 'combat', important: true },
  { field: 'Conditions/Effects', category: 'combat', important: true },
  { field: 'Temporary HP', category: 'combat', important: false },
  { field: 'Ammunition Count', category: 'resources', important: false },
  { field: 'Gold/Treasure', category: 'inventory', important: false },
  { field: 'Consumables Used', category: 'inventory', important: false },
  { field: 'Quest Progress', category: 'story', important: false },
  { field: 'NPC Relationship Changes', category: 'story', important: false },
];

export function createSnapshot(characterData) {
  return {
    ...CHARACTER_SNAPSHOT_TEMPLATE,
    ...characterData,
    timestamp: new Date().toISOString(),
  };
}

export function compareSnapshots(before, after) {
  const changes = [];
  if (before.stats?.hp?.current !== after.stats?.hp?.current) {
    changes.push({ field: 'HP', before: before.stats?.hp?.current, after: after.stats?.hp?.current });
  }
  if (before.stats?.ac !== after.stats?.ac) {
    changes.push({ field: 'AC', before: before.stats?.ac, after: after.stats?.ac });
  }
  if (before.resources?.gold !== after.resources?.gold) {
    changes.push({ field: 'Gold', before: before.resources?.gold, after: after.resources?.gold });
  }
  return changes;
}
