/**
 * playerInspirationTracker.js
 * Player Mode: Inspiration tracking and roleplay encouragement
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// INSPIRATION RULES
// ---------------------------------------------------------------------------

export const INSPIRATION_RULES = {
  description: 'Awarded by the DM for great roleplaying, clever ideas, or staying true to your character.',
  usage: 'Spend inspiration to gain advantage on one attack roll, saving throw, or ability check.',
  limit: 'You either have inspiration or you don\'t — it doesn\'t stack.',
  giving: 'You can give your inspiration to another player character.',
};

// ---------------------------------------------------------------------------
// ROLEPLAY PROMPTS
// ---------------------------------------------------------------------------

export const ROLEPLAY_PROMPTS = [
  { category: 'personality', prompts: [
    'How does your character react to this situation based on their personality traits?',
    'What would your character say that reflects their background?',
    'How does your character\'s alignment influence their decision here?',
  ]},
  { category: 'bonds', prompts: [
    'Does this situation connect to any of your character\'s bonds?',
    'Is there someone your character is thinking about right now?',
    'How does your duty to your bond influence your choice?',
  ]},
  { category: 'flaws', prompts: [
    'Would your character\'s flaw make this situation more interesting?',
    'Is there a way your flaw could create a fun complication?',
    'What would your character do wrong in this moment?',
  ]},
  { category: 'ideals', prompts: [
    'What would your character\'s ideals compel them to do?',
    'How does your ideal create tension with the practical choice?',
    'Is there a way to champion your ideal in this scene?',
  ]},
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get a random roleplay prompt.
 */
export function getRandomPrompt(category = null) {
  let pool;
  if (category) {
    const cat = ROLEPLAY_PROMPTS.find(c => c.category === category);
    pool = cat ? cat.prompts : [];
  } else {
    pool = ROLEPLAY_PROMPTS.flatMap(c => c.prompts);
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get all prompt categories.
 */
export function getPromptCategories() {
  return ROLEPLAY_PROMPTS.map(c => c.category);
}
