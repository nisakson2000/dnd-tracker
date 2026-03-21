/**
 * playerMulticlassRules.js
 * Player Mode: Multiclass prerequisites, spell slot calculation, proficiency rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// MULTICLASS PREREQUISITES
// ---------------------------------------------------------------------------

export const MULTICLASS_PREREQUISITES = [
  { className: 'Barbarian', requirement: 'STR 13' },
  { className: 'Bard', requirement: 'CHA 13' },
  { className: 'Cleric', requirement: 'WIS 13' },
  { className: 'Druid', requirement: 'WIS 13' },
  { className: 'Fighter', requirement: 'STR 13 or DEX 13' },
  { className: 'Monk', requirement: 'DEX 13 and WIS 13' },
  { className: 'Paladin', requirement: 'STR 13 and CHA 13' },
  { className: 'Ranger', requirement: 'DEX 13 and WIS 13' },
  { className: 'Rogue', requirement: 'DEX 13' },
  { className: 'Sorcerer', requirement: 'CHA 13' },
  { className: 'Warlock', requirement: 'CHA 13' },
  { className: 'Wizard', requirement: 'INT 13' },
];

// ---------------------------------------------------------------------------
// MULTICLASS PROFICIENCIES GAINED
// ---------------------------------------------------------------------------

export const MULTICLASS_PROFICIENCIES = [
  { className: 'Barbarian', proficiencies: 'Shields, simple weapons, martial weapons' },
  { className: 'Bard', proficiencies: 'Light armor, one skill, one musical instrument' },
  { className: 'Cleric', proficiencies: 'Light armor, medium armor, shields' },
  { className: 'Druid', proficiencies: 'Light armor, medium armor, shields (no metal)' },
  { className: 'Fighter', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { className: 'Monk', proficiencies: 'Simple weapons, shortswords' },
  { className: 'Paladin', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons' },
  { className: 'Ranger', proficiencies: 'Light armor, medium armor, shields, simple weapons, martial weapons, one skill' },
  { className: 'Rogue', proficiencies: 'Light armor, one skill, thieves\' tools' },
  { className: 'Sorcerer', proficiencies: 'None' },
  { className: 'Warlock', proficiencies: 'Light armor, simple weapons' },
  { className: 'Wizard', proficiencies: 'None' },
];

// ---------------------------------------------------------------------------
// SPELL SLOT CALCULATION
// ---------------------------------------------------------------------------

export const FULL_CASTERS = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'];
export const HALF_CASTERS = ['Paladin', 'Ranger'];
export const THIRD_CASTERS = ['Eldritch Knight', 'Arcane Trickster'];

export const MULTICLASS_SPELL_SLOTS = [
  // level: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
  { level: 1,  slots: [2,0,0,0,0,0,0,0,0] },
  { level: 2,  slots: [3,0,0,0,0,0,0,0,0] },
  { level: 3,  slots: [4,2,0,0,0,0,0,0,0] },
  { level: 4,  slots: [4,3,0,0,0,0,0,0,0] },
  { level: 5,  slots: [4,3,2,0,0,0,0,0,0] },
  { level: 6,  slots: [4,3,3,0,0,0,0,0,0] },
  { level: 7,  slots: [4,3,3,1,0,0,0,0,0] },
  { level: 8,  slots: [4,3,3,2,0,0,0,0,0] },
  { level: 9,  slots: [4,3,3,3,1,0,0,0,0] },
  { level: 10, slots: [4,3,3,3,2,0,0,0,0] },
  { level: 11, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 12, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 13, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 14, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 15, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 16, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 17, slots: [4,3,3,3,2,1,1,1,1] },
  { level: 18, slots: [4,3,3,3,3,1,1,1,1] },
  { level: 19, slots: [4,3,3,3,3,2,1,1,1] },
  { level: 20, slots: [4,3,3,3,3,2,2,1,1] },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculate multiclass spellcaster level.
 */
export function getMulticlassSpellcasterLevel(classes) {
  let level = 0;
  for (const cls of classes) {
    const name = cls.className || cls.name || '';
    const lc = name.toLowerCase();
    if (FULL_CASTERS.some(c => lc.includes(c.toLowerCase()))) {
      level += cls.level;
    } else if (HALF_CASTERS.some(c => lc.includes(c.toLowerCase()))) {
      level += Math.floor(cls.level / 2);
    } else if (THIRD_CASTERS.some(c => lc.includes(c.toLowerCase()))) {
      level += Math.floor(cls.level / 3);
    }
  }
  return level;
}

/**
 * Get multiclass spell slots for a given combined caster level.
 */
export function getMulticlassSpellSlots(casterLevel) {
  const entry = MULTICLASS_SPELL_SLOTS.find(e => e.level === casterLevel);
  return entry ? entry.slots : [0,0,0,0,0,0,0,0,0];
}

/**
 * Check if ability scores meet multiclass prerequisites.
 */
export function meetsPrerequisite(className, abilityScores) {
  const prereq = MULTICLASS_PREREQUISITES.find(
    p => p.className.toLowerCase() === className.toLowerCase()
  );
  if (!prereq) return false;
  // Simple check for common patterns
  const req = prereq.requirement;
  if (req.includes(' and ')) {
    return req.split(' and ').every(part => checkSingleReq(part.trim(), abilityScores));
  }
  if (req.includes(' or ')) {
    return req.split(' or ').some(part => checkSingleReq(part.trim(), abilityScores));
  }
  return checkSingleReq(req, abilityScores);
}

function checkSingleReq(reqStr, scores) {
  const match = reqStr.match(/^(STR|DEX|CON|INT|WIS|CHA)\s+(\d+)$/);
  if (!match) return false;
  const ability = match[1].toLowerCase();
  const needed = parseInt(match[2]);
  const abilityMap = { str: 'strength', dex: 'dexterity', con: 'constitution', int: 'intelligence', wis: 'wisdom', cha: 'charisma' };
  const score = scores[ability] || scores[abilityMap[ability]] || 0;
  return score >= needed;
}
