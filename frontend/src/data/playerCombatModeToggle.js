/**
 * playerCombatModeToggle.js
 * Player Mode: Combat vs exploration mode differences and quick-switch reference
 * Pure JS — no React dependencies.
 */

export const MODE_DIFFERENCES = {
  combat: {
    name: 'Combat Mode',
    initiative: 'Rolled. Turn order matters.',
    actions: 'Action, Bonus Action, Reaction, Movement — structured.',
    time: 'Each round = 6 seconds in-game.',
    spells: 'Concentration matters. Slots consumed. Reactions available.',
    movement: 'Speed in feet. Difficult terrain costs double. OAs triggered.',
    tracking: ['HP', 'Spell slots', 'Ki/Rage/Channel Divinity', 'Conditions', 'Concentration', 'Death saves', 'Position'],
  },
  exploration: {
    name: 'Exploration Mode',
    initiative: 'None. Players act in whatever order.',
    actions: 'Free-form. "I search the room" without action economy.',
    time: 'Varies. Minutes, hours, or days pass freely.',
    spells: 'Duration-based. Rituals are free. Slots matter for adventuring day.',
    movement: 'Travel pace (fast/normal/slow). Miles per hour.',
    tracking: ['Rations/water', 'Travel pace', 'Encumbrance', 'Light sources', 'Random encounters', 'Navigation', 'Time of day'],
  },
  social: {
    name: 'Social Mode',
    initiative: 'None. Conversation-based.',
    actions: 'Persuasion, Deception, Intimidation, Insight checks.',
    time: 'Real-time conversation pace.',
    spells: 'Subtle spells (Suggestion, Charm Person) can be used covertly.',
    movement: 'Irrelevant unless positioning matters.',
    tracking: ['NPC attitudes', 'Information gathered', 'Promises made', 'Reputation effects'],
  },
};

export const COMBAT_ENTRY_CHECKLIST = [
  { item: 'Roll initiative', detail: 'd20 + DEX mod + any bonuses (Alert, Jack of All Trades, etc.)' },
  { item: 'Note your AC', detail: 'Base AC + shield + any active buffs (Mage Armor, Shield of Faith, etc.)' },
  { item: 'Check spell slots', detail: 'How many slots do you have left? Which spells are prepared?' },
  { item: 'Check class resources', detail: 'Ki, Rage uses, Channel Divinity, Sorcery Points, Action Surge, etc.' },
  { item: 'Check HP and temp HP', detail: 'Current HP. Any temp HP from buffs.' },
  { item: 'Note active effects', detail: 'Any ongoing buffs (Bless, Mage Armor), conditions, or concentration spells.' },
  { item: 'Check weapon/equipment', detail: 'What\'s in your hands? Is your weapon drawn? Shield equipped?' },
  { item: 'Assess the battlefield', detail: 'Cover? Terrain? Allies\' positions? Exit routes?' },
];

export const COMBAT_EXIT_CHECKLIST = [
  { item: 'End concentration spells?', detail: 'Drop concentration if no longer needed. Or maintain if duration remains.' },
  { item: 'Loot check', detail: 'Search bodies for items, gold, clues. Investigation check.' },
  { item: 'Heal up', detail: 'Healing Word/Cure Wounds on injured allies. Stabilize anyone at 0 HP.' },
  { item: 'Short rest decision', detail: 'Do we short rest? Recover hit dice, short rest features. Takes 1 hour.' },
  { item: 'Resource check', detail: 'How many spell slots, ki, etc. remain? Can we continue?' },
  { item: 'Recap the combat', detail: 'What went well? What went wrong? Any milestones earned?' },
  { item: 'Reset conditions', detail: 'Remove any remaining conditions. Reset death save counters.' },
  { item: 'Secure the area', detail: 'Is it safe to rest? Check for reinforcements. Post a watch.' },
];

export const QUICK_SWITCH_REFERENCE = {
  enterCombat: [
    'Draw weapons (free interaction)',
    'Roll initiative',
    'Activate Rage/similar (bonus action on turn 1)',
    'Cast buff spells (if you go first)',
  ],
  exitCombat: [
    'Sheathe weapons',
    'Assess injuries',
    'Decide: push on or rest?',
    'Resume exploration formation',
  ],
  combatToSocial: [
    'Can happen mid-combat (Diplomat milestone)',
    'Persuasion/Intimidation to parley',
    'DM may pause initiative for negotiation',
    'Be ready to resume if negotiation fails',
  ],
};

export function getChecklist(mode) {
  if (mode === 'enter') return COMBAT_ENTRY_CHECKLIST;
  if (mode === 'exit') return COMBAT_EXIT_CHECKLIST;
  return [];
}

export function getModeDifferences(mode) {
  return MODE_DIFFERENCES[mode] || MODE_DIFFERENCES.combat;
}
