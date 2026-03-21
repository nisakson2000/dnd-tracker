/**
 * playerLevelUpChecklist.js
 * Player Mode: Level up checklist and what changes at each level
 * Pure JS — no React dependencies.
 */

export const LEVEL_UP_CHECKLIST = [
  { step: 1, label: 'Increase Hit Points', description: 'Roll hit die (or take average) + CON modifier.', always: true },
  { step: 2, label: 'Check Proficiency Bonus', description: 'Increases at levels 5, 9, 13, 17.', always: true },
  { step: 3, label: 'New Class Features', description: 'Check your class table for new features at this level.', always: true },
  { step: 4, label: 'Ability Score Improvement / Feat', description: 'Available at levels 4, 8, 12, 16, 19 (most classes).', always: false },
  { step: 5, label: 'New Spell Slots', description: 'Check if you gain new spell slots at this level.', always: false },
  { step: 6, label: 'New Spells Known/Prepared', description: 'Learn new spells or increase number of prepared spells.', always: false },
  { step: 7, label: 'Subclass Features', description: 'Check if your subclass gains new features at this level.', always: false },
  { step: 8, label: 'Update Character Sheet', description: 'Update HP, proficiency bonus, spell slots, new features, etc.', always: true },
];

export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  fighter: [4, 6, 8, 12, 14, 16, 19],
  rogue: [4, 8, 10, 12, 16, 19],
};

export const MILESTONE_LEVELS = [
  { level: 1, milestone: 'Starting level. All base class features.' },
  { level: 2, milestone: 'Most classes gain key features (Action Surge, Ki, Wild Shape, etc.).' },
  { level: 3, milestone: 'Subclass selection! Major power spike.' },
  { level: 4, milestone: 'First ASI/Feat. Cantrip scaling (some classes).' },
  { level: 5, milestone: 'Extra Attack (martial classes). 3rd level spells. Major power spike!' },
  { level: 7, milestone: 'Subclass features. Many key defensive abilities.' },
  { level: 9, milestone: 'Proficiency bonus +4. 5th level spells. Another power spike.' },
  { level: 11, milestone: '3rd attack (Fighter). 6th level spells. Magical secrets (Bard).' },
  { level: 13, milestone: '7th level spells. Proficiency bonus +5.' },
  { level: 17, milestone: '9th level spells (Wish!). Proficiency bonus +6. Capstone approach.' },
  { level: 20, milestone: 'Capstone feature. Maximum power.' },
];

export function getASILevels(className) {
  const lc = (className || '').toLowerCase();
  return ASI_LEVELS[lc] || ASI_LEVELS.default;
}

export function isASILevel(className, level) {
  return getASILevels(className).includes(level);
}

export function getNextMilestone(currentLevel) {
  return MILESTONE_LEVELS.find(m => m.level > currentLevel) || null;
}

export function getLevelUpChecklist(className, newLevel) {
  const checklist = LEVEL_UP_CHECKLIST.map(item => ({
    ...item,
    applicable: item.always ||
      (item.step === 4 && isASILevel(className, newLevel)) ||
      (item.step === 5 || item.step === 6) ||
      (item.step === 7),
  }));
  return checklist.filter(item => item.applicable);
}
