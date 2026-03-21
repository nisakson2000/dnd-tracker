/**
 * playerLevelUpNotifications.js
 * Player Mode: Level-up reminders and things to check
 * Pure JS — no React dependencies.
 */

export const LEVEL_UP_CHECKLIST = [
  { id: 'hp', task: 'Increase HP', detail: 'Roll hit die (or take average) + CON mod. Add to max HP.', applies: 'All' },
  { id: 'proficiency', task: 'Check proficiency bonus', detail: 'Increases at levels 5, 9, 13, 17. Updates attacks, saves, skills, spell DC.', applies: 'All', levels: [5, 9, 13, 17] },
  { id: 'features', task: 'Read new class features', detail: 'Check your class table for features gained at this level.', applies: 'All' },
  { id: 'subclass', task: 'Choose subclass', detail: 'Most classes choose at 3rd level. Cleric/Sorcerer/Warlock at 1st.', applies: 'Varies', levels: [1, 2, 3] },
  { id: 'asi', task: 'ASI or Feat', detail: '+2 to one ability score or +1 to two, OR take a feat.', applies: 'ASI levels' },
  { id: 'spells_known', task: 'Learn new spells', detail: 'Known casters: add new spells. Can also swap one spell.', applies: 'Bard, Sorcerer, Ranger, Warlock' },
  { id: 'spells_prep', task: 'Update prepared spells', detail: 'Prepared casters: recalculate prepared count (level + mod).', applies: 'Cleric, Druid, Paladin, Wizard' },
  { id: 'spell_slots', task: 'Update spell slots', detail: 'Check the class table for new slot levels or additional slots.', applies: 'All casters' },
  { id: 'cantrips', task: 'New cantrips?', detail: 'Some levels grant additional cantrips. Check your class table.', applies: 'Casters' },
  { id: 'attacks', task: 'Extra Attack?', detail: 'Gained at level 5 for Fighter, Paladin, Ranger, Barbarian, Monk.', applies: 'Martial', levels: [5] },
  { id: 'sneak_attack', task: 'Sneak Attack increase', detail: 'Increases every odd level (1, 3, 5, 7...).', applies: 'Rogue' },
  { id: 'update_sheet', task: 'Update character sheet', detail: 'Record all changes. Update attack bonuses, save DC, HP.', applies: 'All' },
];

export const POWER_SPIKE_NOTIFICATIONS = {
  3: { message: 'Subclass unlocked! You now have your archetype features.', icon: '🌟' },
  4: { message: 'First ASI/Feat! Boost your primary stat or take a powerful feat.', icon: '⬆️' },
  5: { message: 'MAJOR POWER SPIKE! Extra Attack for martials, 3rd-level spells for casters (Fireball!).', icon: '🔥' },
  9: { message: 'Proficiency bonus increases to +4. 5th-level spells for full casters.', icon: '💪' },
  11: { message: 'Tier 3 begins. Fighter gets 3 attacks. Casters get 6th-level spells.', icon: '⚡' },
  13: { message: 'Proficiency +5. 7th-level spells (Forcecage, Plane Shift).', icon: '🌀' },
  17: { message: 'Tier 4! Proficiency +6. 9th-level spells (Wish, True Polymorph).', icon: '👑' },
  20: { message: 'CAPSTONE! Maximum power. Read your level 20 feature carefully.', icon: '🏆' },
};

export function getLevelUpChecklist(className, newLevel) {
  return LEVEL_UP_CHECKLIST.filter(item => {
    if (item.applies === 'All') return true;
    if (item.levels && !item.levels.includes(newLevel)) return false;
    if (item.applies === 'Rogue' && className !== 'Rogue') return false;
    if (item.applies === 'Martial' && !['Fighter', 'Paladin', 'Ranger', 'Barbarian', 'Monk'].includes(className)) return false;
    return true;
  });
}

export function getPowerSpikeNotification(level) {
  return POWER_SPIKE_NOTIFICATIONS[level] || null;
}

export function isASILevel(className, level) {
  const asiLevels = className === 'Fighter' ? [4, 6, 8, 12, 14, 16, 19] :
    className === 'Rogue' ? [4, 8, 10, 12, 16, 19] : [4, 8, 12, 16, 19];
  return asiLevels.includes(level);
}
