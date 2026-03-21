/**
 * playerSlotBudgetingGuide.js
 * Player Mode: Spell slot budgeting — when to spend and when to conserve
 * Pure JS — no React dependencies.
 */

export const SLOT_BUDGET_RULES = {
  adventuringDay: 'Expect 6-8 encounters with 2 short rests per long rest.',
  reality: 'Most tables run 2-4 encounters. Adjust accordingly.',
  principle: 'Don\'t blow all slots on fight 1. Budget across the day.',
  shortRest: 'Warlock slots recover on short rest. Use aggressively.',
};

export const SLOT_PRIORITY = [
  { priority: 'S+', use: 'Save-or-suck vs bosses', examples: 'Hold Person, Banishment, Wall of Force' },
  { priority: 'S', use: 'Concentration buffs', examples: 'Bless, Spirit Guardians, Haste' },
  { priority: 'A+', use: 'Emergency survival', examples: 'Shield, Counterspell, Healing Word' },
  { priority: 'A', use: 'AoE vs groups', examples: 'Fireball, Shatter, Spirit Guardians' },
  { priority: 'B+', use: 'Single-target damage', examples: 'Guiding Bolt, Chromatic Orb' },
  { priority: 'B', use: 'Utility', examples: 'Detect Magic, Identify' },
];

export const CANTRIP_VS_SLOT = {
  rule: 'If a cantrip handles it, don\'t spend a slot.',
  examples: [
    'Firebolt vs weak enemies instead of Fireball.',
    'Light instead of Daylight (usually).',
    'Message instead of Sending (if in range).',
    'Minor Illusion for distractions.',
  ],
};

export const SLOT_RECOVERY = [
  { method: 'Long Rest', who: 'All casters', amount: 'All slots.' },
  { method: 'Short Rest', who: 'Warlock', amount: 'All Pact Magic slots.' },
  { method: 'Arcane Recovery', who: 'Wizard', amount: 'Half level (round up) of slots. 1/day.' },
  { method: 'Natural Recovery', who: 'Land Druid', amount: 'Half level of slots. 1/day.' },
  { method: 'Sorcery Points', who: 'Sorcerer', amount: 'Convert SP to slots (BA).' },
  { method: 'Harness Divine Power', who: 'Cleric/Paladin', amount: '1 slot up to half prof level.' },
  { method: 'Pearl of Power', who: 'Any', amount: '1 slot L3 or lower. 1/day.' },
];

export const SLOT_TIPS = [
  'Budget across the day. Don\'t nova fight 1.',
  'Concentration spells: best value per slot.',
  'Cantrips scale. Use for trash mobs.',
  'Keep 1 slot for Shield/Counterspell reactions.',
  'Warlocks: use aggressively. Short rest recovery.',
  'Arcane Recovery: free slots after first fight.',
  'Ritual cast when time allows. No slot cost.',
  'Upcast only when impact is significant.',
  'Healing Word to revive > Cure Wounds to top off.',
  'End of day: burn remaining on Goodberry, Mage Armor.',
];
