/**
 * playerSessionPrep.js
 * Player Mode: Pre-session preparation checklist
 * Pure JS — no React dependencies.
 */

export const SESSION_PREP_CHECKLIST = [
  { step: 1, label: 'Review Last Session', description: 'What happened? Where did we leave off? Any cliffhangers?', category: 'story' },
  { step: 2, label: 'Check Character Sheet', description: 'HP, spell slots, resources all correct? Any level-up to apply?', category: 'mechanics' },
  { step: 3, label: 'Review Inventory', description: 'What items do you have? Any consumables to use? Attunement slots?', category: 'mechanics' },
  { step: 4, label: 'Spell Preparation', description: 'If you prepare spells, choose your list for the day. Consider what you might face.', category: 'mechanics' },
  { step: 5, label: 'Review Active Quests', description: 'What are your current objectives? Any deadlines?', category: 'story' },
  { step: 6, label: 'NPC Notes', description: 'Who have you met? Any promises or deals made?', category: 'story' },
  { step: 7, label: 'Character Goals', description: 'What does your character want? Any personal quests?', category: 'roleplay' },
  { step: 8, label: 'Party Coordination', description: 'Any strategies to discuss? Marching order? Watch schedule?', category: 'tactics' },
  { step: 9, label: 'Rules Review', description: 'Any new abilities from leveling up? Review how they work.', category: 'mechanics' },
  { step: 10, label: 'Snacks & Setup', description: 'Dice, pencils, character sheet, snacks, drinks ready!', category: 'logistics' },
];

export const SPELL_PREP_TIPS = [
  'Always prepare at least one healing spell (Healing Word preferred for action economy).',
  'Have a concentration spell ready for combat (Bless, Spirit Guardians, etc.).',
  'Prepare utility spells for exploration (Detect Magic, Pass without Trace).',
  'Consider what you might face — undead? Flying enemies? Social encounters?',
  'Keep at least one "emergency" spell prepared (Revivify, Counterspell).',
  'Don\'t prepare all damage — versatility wins in D&D.',
];

export function getChecklistByCategory(category) {
  return SESSION_PREP_CHECKLIST.filter(item => item.category === category);
}

export function getFullChecklist() {
  return SESSION_PREP_CHECKLIST;
}
