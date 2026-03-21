/**
 * playerLevelUp.js
 * Player Mode: Level-up checklist and progression reference
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// LEVEL-UP CHECKLIST
// ---------------------------------------------------------------------------

export const LEVEL_UP_CHECKLIST = [
  { id: 'hp', label: 'Increase Max HP', description: 'Roll hit die (or take average) + CON modifier. Add to max HP.', always: true },
  { id: 'proficiency', label: 'Check Proficiency Bonus', description: 'Proficiency bonus increases at levels 5, 9, 13, and 17.', levels: [5, 9, 13, 17] },
  { id: 'asi', label: 'Ability Score Improvement / Feat', description: 'Increase an ability score by 2 (or two by 1), or take a feat.', levels: [4, 8, 12, 16, 19] },
  { id: 'class_features', label: 'New Class Features', description: 'Check your class table for new features at this level.', always: true },
  { id: 'subclass', label: 'Choose Subclass', description: 'Some classes choose a subclass at level 2 or 3.', levels: [1, 2, 3] },
  { id: 'cantrips', label: 'New Cantrips', description: 'Some classes gain additional cantrips at certain levels.', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'] },
  { id: 'spells_known', label: 'New Spells Known/Prepared', description: 'Learn or prepare additional spells.', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'] },
  { id: 'spell_slots', label: 'New Spell Slots', description: 'Gain new or higher-level spell slots.', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'] },
  { id: 'extra_attack', label: 'Extra Attack', description: 'Gained at level 5 for martial classes.', levels: [5] },
  { id: 'hit_die', label: 'Gain 1 Hit Die', description: 'Add one hit die to your total pool.', always: true },
  { id: 'update_attacks', label: 'Update Attack Bonuses', description: 'If proficiency bonus changed, update attack rolls and spell save DC.', levels: [5, 9, 13, 17] },
  { id: 'update_saves', label: 'Update Save DCs', description: 'If proficiency bonus or ability score changed, update save DCs.', levels: [4, 5, 8, 9, 12, 13, 16, 17, 19] },
];

/**
 * Get applicable level-up tasks for a specific level and class.
 */
export function getLevelUpTasks(level, className) {
  return LEVEL_UP_CHECKLIST.filter(task => {
    if (task.always) return true;
    if (task.levels && task.levels.includes(level)) return true;
    if (task.classes && task.classes.some(c => (className || '').toLowerCase().includes(c.toLowerCase()))) {
      // Class-specific but always relevant when class matches
      return true;
    }
    return false;
  });
}

// ---------------------------------------------------------------------------
// HIT DIE AVERAGES
// ---------------------------------------------------------------------------

export const HIT_DIE_AVERAGES = {
  d6: 4,
  d8: 5,
  d10: 6,
  d12: 7,
};

// ---------------------------------------------------------------------------
// MILESTONE LEVELS (notable progression points)
// ---------------------------------------------------------------------------

export const MILESTONE_LEVELS = [
  { level: 2, note: 'Most classes gain subclass choice or key feature.' },
  { level: 3, note: 'Subclass choice for remaining classes. Many defining features.' },
  { level: 4, note: 'First ASI/Feat. Significant power increase.' },
  { level: 5, note: 'Extra Attack, 3rd-level spells. Major power spike.' },
  { level: 6, note: 'Subclass feature upgrade.' },
  { level: 7, note: 'Class features continue to improve.' },
  { level: 8, note: 'Second ASI/Feat.' },
  { level: 9, note: 'Proficiency bonus to +4. 5th-level spells for full casters.' },
  { level: 11, note: '6th-level spells. Fighter gets 3 attacks.' },
  { level: 13, note: 'Proficiency bonus to +5. 7th-level spells.' },
  { level: 17, note: 'Proficiency bonus to +6. 9th-level spells. Capstone features.' },
  { level: 20, note: 'Max level. Epic boons, capstone features.' },
];
