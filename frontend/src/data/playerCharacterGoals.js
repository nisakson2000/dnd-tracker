/**
 * playerCharacterGoals.js
 * Player Mode: Personal character goals, bonds, flaws, and ideals tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// PERSONALITY TRAITS
// ---------------------------------------------------------------------------

export const PERSONALITY_CATEGORIES = [
  { id: 'bonds', label: 'Bonds', color: '#4ade80', description: 'Connections to people, places, or events that drive your character.' },
  { id: 'ideals', label: 'Ideals', color: '#60a5fa', description: 'The principles that guide your character\'s decisions.' },
  { id: 'flaws', label: 'Flaws', color: '#ef4444', description: 'Weaknesses or vices that can be exploited or cause problems.' },
  { id: 'traits', label: 'Traits', color: '#fbbf24', description: 'Distinguishing characteristics that define how your character acts.' },
];

// ---------------------------------------------------------------------------
// GOAL TRACKING
// ---------------------------------------------------------------------------

export const GOAL_STATUS = {
  active: { label: 'Active', color: '#4ade80', description: 'Currently pursuing this goal' },
  progressing: { label: 'In Progress', color: '#60a5fa', description: 'Making progress toward this goal' },
  stalled: { label: 'Stalled', color: '#fbbf24', description: 'Goal is blocked or on hold' },
  completed: { label: 'Completed', color: '#a855f7', description: 'Goal achieved!' },
  abandoned: { label: 'Abandoned', color: '#6b7280', description: 'No longer pursuing this goal' },
  failed: { label: 'Failed', color: '#ef4444', description: 'Goal is no longer achievable' },
};

export const GOAL_TEMPLATE = {
  id: '',
  title: '',
  description: '',
  status: 'active',
  category: 'personal',  // 'personal', 'party', 'quest', 'backstory'
  priority: 'normal',     // 'low', 'normal', 'high', 'urgent'
  relatedNpcs: [],
  relatedLocations: [],
  milestones: [],         // { text, completed }
  createdAt: null,
  completedAt: null,
};

// ---------------------------------------------------------------------------
// ALIGNMENT REFERENCE
// ---------------------------------------------------------------------------

export const ALIGNMENTS = [
  { id: 'LG', name: 'Lawful Good', short: 'LG', description: 'Acts with honor and compassion within a code of conduct.' },
  { id: 'NG', name: 'Neutral Good', short: 'NG', description: 'Does the best they can to help others.' },
  { id: 'CG', name: 'Chaotic Good', short: 'CG', description: 'Acts according to their conscience with little regard for rules.' },
  { id: 'LN', name: 'Lawful Neutral', short: 'LN', description: 'Acts in accordance with law, tradition, or personal codes.' },
  { id: 'TN', name: 'True Neutral', short: 'TN', description: 'Doesn\'t feel strongly toward any alignment. Acts naturally.' },
  { id: 'CN', name: 'Chaotic Neutral', short: 'CN', description: 'Follows their whims. Individual freedom above all.' },
  { id: 'LE', name: 'Lawful Evil', short: 'LE', description: 'Systematically takes what they want within a code of conduct.' },
  { id: 'NE', name: 'Neutral Evil', short: 'NE', description: 'Does whatever they can get away with.' },
  { id: 'CE', name: 'Chaotic Evil', short: 'CE', description: 'Acts with violence and arbitrary cruelty.' },
];

// ---------------------------------------------------------------------------
// INSPIRATION RULES
// ---------------------------------------------------------------------------

export const INSPIRATION_RULES = {
  description: 'The DM can grant inspiration for roleplaying your character\'s traits, ideals, bonds, or flaws.',
  rules: [
    'You either have inspiration or you don\'t — it doesn\'t stack.',
    'When you have inspiration, you can spend it to gain advantage on one attack roll, saving throw, or ability check.',
    'You can give your inspiration to another player character.',
  ],
};

/**
 * Create a new character goal.
 */
export function createGoal(title, description, category = 'personal') {
  return {
    ...GOAL_TEMPLATE,
    id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    description,
    category,
    createdAt: new Date().toISOString(),
  };
}
