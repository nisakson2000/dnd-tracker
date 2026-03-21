/**
 * Rest Mechanics — Rules, class features, and variant resting systems for 5e.
 * Covers short rests, long rests, hit dice recovery, and optional rest variants.
 * Roadmap items 108–115.
 */

// ---------------------------------------------------------------------------
// 1. Short Rest Rules
// ---------------------------------------------------------------------------

export const SHORT_REST_RULES = {
  label: 'Short Rest',
  duration: '1 hour minimum',
  description: 'A period of downtime (at least 1 hour) during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds.',
  rules: [
    { title: 'Duration', description: 'A short rest is at least 1 hour long. Characters can sit, eat, drink, read, and tend to wounds.' },
    { title: 'Hit Dice Spending', description: 'A character can spend one or more hit dice at the end of a short rest. For each hit die spent, roll the die and add the character\'s Constitution modifier. The character regains that many hit points (minimum 0).' },
    { title: 'Feature Recharge', description: 'Certain class features recharge on a short rest, including Warlock spell slots, Channel Divinity, Bardic Inspiration (level 5+), Second Wind, Action Surge, Ki Points, Superiority Dice, Wild Shape, and Arcane Recovery (1/day).' },
    { title: 'Interruption', description: 'If a short rest is interrupted by combat, casting a spell, or at least 1 hour of strenuous activity (walking, fighting, etc.), the rest must be restarted from the beginning.' },
  ],
};

// ---------------------------------------------------------------------------
// 2. Long Rest Rules
// ---------------------------------------------------------------------------

export const LONG_REST_RULES = {
  label: 'Long Rest',
  duration: '8 hours minimum',
  description: 'An extended period of downtime (at least 8 hours) during which a character sleeps or performs light activity.',
  rules: [
    { title: 'Duration', description: '8 hours minimum. Must include at least 6 hours of sleep (elves: 4 hours trance + light activity). Up to 2 hours can be spent on light activity such as reading, talking, eating, or standing watch.' },
    { title: 'Regain All HP', description: 'At the end of a long rest, a character regains all lost hit points.' },
    { title: 'Regain Spell Slots', description: 'All expended spell slots are recovered (except Warlock Pact Magic, which recovers on a short rest).' },
    { title: 'Regain Hit Dice', description: 'The character regains spent hit dice equal to half their total number of hit dice (minimum of 1).' },
    { title: 'Exhaustion Recovery', description: 'If the character has at least 1 level of exhaustion and has had sufficient food and water, one level of exhaustion is removed.' },
    { title: 'Feature Recharge', description: 'All class features and abilities labelled "recharges on a long rest" are restored (e.g., Rage uses, Lay on Hands, Sorcery Points).' },
    { title: 'Requirement', description: 'A character must have at least 1 hit point at the start of the rest to gain its benefits.' },
    { title: 'Interruption', description: 'If interrupted by strenuous activity — at least 1 hour of walking, fighting, casting spells, or similar exertion — the rest must be restarted. Up to 1 hour of such activity is tolerated without losing the rest.' },
    { title: 'Frequency', description: 'A character can benefit from only one long rest in a 24-hour period.' },
  ],
};

// ---------------------------------------------------------------------------
// 3. Short Rest Features (by class)
// ---------------------------------------------------------------------------

export const SHORT_REST_FEATURES = [
  {
    className: 'Fighter',
    features: [
      { name: 'Second Wind', description: 'Regain 1d10 + fighter level hit points as a bonus action. Recharges on a short or long rest.' },
      { name: 'Action Surge', description: 'Take one additional action on your turn. Recharges on a short or long rest.' },
      { name: 'Superiority Dice', description: 'All expended superiority dice (Battle Master) are regained on a short or long rest.' },
    ],
  },
  {
    className: 'Warlock',
    features: [
      { name: 'Pact Magic Slots', description: 'All expended Pact Magic spell slots are regained on a short or long rest.' },
    ],
  },
  {
    className: 'Monk',
    features: [
      { name: 'Ki Points', description: 'All expended ki points are regained on a short or long rest.' },
    ],
  },
  {
    className: 'Bard',
    features: [
      { name: 'Bardic Inspiration (Level 5+)', description: 'At 5th level, Bardic Inspiration uses recharge on a short or long rest instead of only on a long rest.' },
    ],
  },
  {
    className: 'Cleric',
    features: [
      { name: 'Channel Divinity', description: 'Expended uses of Channel Divinity are regained on a short or long rest.' },
    ],
  },
  {
    className: 'Druid',
    features: [
      { name: 'Wild Shape', description: 'Expended uses of Wild Shape are regained on a short or long rest.' },
    ],
  },
  {
    className: 'Wizard',
    features: [
      { name: 'Arcane Recovery', description: 'Once per day, during a short rest, recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up). No slot can be 6th level or higher.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. Long Rest Features (by class / source)
// ---------------------------------------------------------------------------

export const LONG_REST_FEATURES = [
  {
    className: 'All Casters (except Warlock)',
    features: [
      { name: 'Spell Slots', description: 'All expended spell slots are regained at the end of a long rest.' },
    ],
  },
  {
    className: 'Barbarian',
    features: [
      { name: 'Rage Uses', description: 'All expended uses of Rage are regained at the end of a long rest.' },
    ],
  },
  {
    className: 'Paladin',
    features: [
      { name: 'Lay on Hands Pool', description: 'The healing pool resets to paladin level × 5 hit points at the end of a long rest.' },
    ],
  },
  {
    className: 'Sorcerer',
    features: [
      { name: 'Sorcery Points', description: 'All expended sorcery points are regained at the end of a long rest.' },
    ],
  },
  {
    className: 'Monsters / Legendary Creatures',
    features: [
      { name: 'Legendary Resistances', description: 'A creature\'s expended legendary resistances are regained at the end of a long rest (typically 3/day).' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 5. Rest Variants
// ---------------------------------------------------------------------------

export const REST_VARIANTS = {
  standard: {
    label: 'Standard (Default)',
    shortRest: '1 hour',
    longRest: '8 hours',
    description: 'The default resting rules as described in the Player\'s Handbook.',
  },
  grittyRealism: {
    label: 'Gritty Realism',
    shortRest: '8 hours',
    longRest: '7 days',
    description: 'A variant from the DMG that makes resting much harder. Short rests take 8 hours (like a normal long rest), and long rests take a full 7 days of downtime. Best for low-magic, survival-heavy campaigns.',
  },
  epicHeroism: {
    label: 'Epic Heroism',
    shortRest: '5 minutes',
    longRest: '1 hour',
    description: 'A variant from the DMG that makes resting very easy. Short rests are just 5 minutes, and long rests take only 1 hour. Best for fast-paced, high-action sessions with many encounters per day.',
  },
};

// ---------------------------------------------------------------------------
// 6. Helper Functions
// ---------------------------------------------------------------------------

/**
 * Given an array of class feature objects (with className), return an array
 * of short-rest benefits that apply to those classes.
 * @param {Array<{ className: string }>} classFeatures — e.g. [{ className: 'Fighter' }, { className: 'Wizard' }]
 * @returns {Array} Matching entries from SHORT_REST_FEATURES
 */
export function getShortRestBenefits(classFeatures = []) {
  const classNames = classFeatures.map((cf) => cf.className?.toLowerCase());
  return SHORT_REST_FEATURES.filter((entry) =>
    classNames.includes(entry.className.toLowerCase()),
  );
}

/**
 * Given an array of class feature objects (with className), return an array
 * of long-rest benefits that apply to those classes.
 * @param {Array<{ className: string }>} classFeatures — e.g. [{ className: 'Barbarian' }]
 * @returns {Array} Matching entries from LONG_REST_FEATURES
 */
export function getLongRestBenefits(classFeatures = []) {
  const classNames = classFeatures.map((cf) => cf.className?.toLowerCase());
  return LONG_REST_FEATURES.filter((entry) =>
    classNames.includes(entry.className.toLowerCase()),
  );
}

/**
 * Calculate how many hit dice a character recovers on a long rest.
 * Per RAW: regain spent hit dice equal to half total (minimum 1).
 * @param {number} totalHitDice — total hit dice the character has
 * @param {number} currentHitDice — how many hit dice the character currently has available
 * @returns {{ recovered: number, newCurrent: number }} recovered count and new current total
 */
export function calculateHitDiceRecovery(totalHitDice, currentHitDice) {
  const spent = totalHitDice - currentHitDice;
  if (spent <= 0) {
    return { recovered: 0, newCurrent: totalHitDice };
  }
  const maxRecovery = Math.max(1, Math.floor(totalHitDice / 2));
  const recovered = Math.min(maxRecovery, spent);
  return { recovered, newCurrent: currentHitDice + recovered };
}
