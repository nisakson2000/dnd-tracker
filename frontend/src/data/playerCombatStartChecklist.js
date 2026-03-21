/**
 * playerCombatStartChecklist.js
 * Player Mode: What to do when combat starts
 * Pure JS — no React dependencies.
 */

export const COMBAT_START_CHECKLIST = [
  { step: 1, label: 'Roll Initiative', description: 'd20 + DEX modifier (+ any bonuses from feats/features).', priority: 'required' },
  { step: 2, label: 'Check for Surprise', description: 'Were you or enemies surprised? Surprised creatures skip their first turn.', priority: 'required' },
  { step: 3, label: 'Note Your Position', description: 'Where are you on the map? Who\'s near you? What\'s your terrain?', priority: 'high' },
  { step: 4, label: 'Pre-Combat Buffs', description: 'Any active buffs still running? Mage Armor, Aid, etc.', priority: 'high' },
  { step: 5, label: 'Identify Threats', description: 'How many enemies? What types? Any obvious casters or leaders?', priority: 'high' },
  { step: 6, label: 'Plan First Turn', description: 'What will you do? Rage? Concentration spell? Attack priority?', priority: 'medium' },
  { step: 7, label: 'Check Resources', description: 'How many spell slots, ki points, rages, etc. do you have?', priority: 'medium' },
  { step: 8, label: 'Communication', description: 'Quick coordination with party — who\'s tanking, who\'s controlling, target priority?', priority: 'low' },
];

export const FIRST_TURN_PRIORITIES = {
  tank: [
    'Move to protect squishier allies.',
    'Rage/Shield of Faith/other defensive buff.',
    'Attack the biggest threat or establish battlefield control.',
  ],
  dps: [
    'Apply Hunter\'s Mark/Hex if applicable.',
    'Focus fire the biggest threat.',
    'Use your strongest opening (Action Surge, Sneak Attack position).',
  ],
  caster: [
    'Cast your best concentration spell (Hypnotic Pattern, Web, etc.).',
    'Position safely behind frontline.',
    'If no good AOE/control, buff allies (Bless, Haste).',
  ],
  healer: [
    'DON\'T pre-heal — wait until someone needs it.',
    'Cast Spiritual Weapon (Cleric) — no concentration.',
    'Spirit Guardians if you\'re in a good position.',
    'Save Healing Word for emergencies (bonus action, 60ft range).',
  ],
};

export function getCombatStartChecklist() {
  return COMBAT_START_CHECKLIST;
}

export function getFirstTurnPriority(role) {
  return FIRST_TURN_PRIORITIES[(role || '').toLowerCase()] || FIRST_TURN_PRIORITIES.dps;
}
