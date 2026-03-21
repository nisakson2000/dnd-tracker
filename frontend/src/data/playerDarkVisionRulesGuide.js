/**
 * playerDarkVisionRulesGuide.js
 * Player Mode: Darkvision rules — what it actually does and common misconceptions
 * Pure JS — no React dependencies.
 */

export const DARKVISION_RULES = {
  range: 'Typically 60ft (120ft for Drow, Deep Gnome, etc.).',
  darkness: 'Darkness → treated as DIM LIGHT within range.',
  dimLight: 'Dim light → treated as BRIGHT LIGHT within range.',
  key: 'Darkvision does NOT let you see in darkness as if it were bright. It\'s dim light.',
  perception: 'Dim light = DISADVANTAGE on Perception checks relying on sight.',
  color: 'Darkvision sees in shades of gray. No color.',
};

export const DARKVISION_MISCONCEPTIONS = [
  { myth: 'Darkvision = perfect sight in darkness', reality: 'Darkness → dim light. Still disadvantage on Perception.' },
  { myth: 'No need for torches', reality: 'Dim light Perception penalty matters. Torches still useful.' },
  { myth: 'Darkvision sees color', reality: 'Only shades of gray in darkness.' },
  { myth: 'Darkvision has unlimited range', reality: '60ft typical. Beyond that = normal darkness.' },
  { myth: 'Magical darkness = normal darkness', reality: 'Darkvision can\'t see through magical darkness (Darkness spell).' },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Varies', effect: 'See in bright light. Dim light = disadvantage Perception.', note: 'Default for most creatures without Darkvision.' },
  { type: 'Darkvision (60ft)', range: '60ft', effect: 'Dark → dim. Dim → bright. Grayscale.', note: 'Most common. Elves, Dwarves, Half-Orcs, etc.' },
  { type: 'Superior Darkvision (120ft)', range: '120ft', effect: 'Same as 60ft but double range.', note: 'Drow, Deep Gnome, Duergar.' },
  { type: 'Blindsight', range: '10-30ft usually', effect: 'Perceive surroundings without sight. Immune to blind.', note: 'Bats, echolocation. Not affected by darkness or invisibility.' },
  { type: 'Tremorsense', range: '30-60ft', effect: 'Detect vibrations through ground.', note: 'Can\'t detect flying creatures. Requires contact with same surface.' },
  { type: 'Truesight', range: '120ft', effect: 'See through magical darkness, invisibility, illusions, shapechangers, into Ethereal.', note: 'Best vision type. Extremely rare. True Seeing spell.' },
  { type: 'Devil\'s Sight', range: '120ft', effect: 'See in magical AND nonmagical darkness.', note: 'Warlock invocation. Only vision that beats Darkness spell.' },
];

export const LIGHT_LEVEL_EFFECTS = [
  { level: 'Bright Light', perception: 'Normal', stealth: 'Normal', note: 'Default. Daylight, torches in 20ft.' },
  { level: 'Dim Light', perception: 'Disadvantage (sight-based)', stealth: 'Lightly obscured (can Hide)', note: 'Shadows, twilight, Darkvision in darkness.' },
  { level: 'Darkness', perception: 'Effectively blind', stealth: 'Heavily obscured (can\'t be seen)', note: 'Night, unlit dungeons. Blind without Darkvision.' },
];

export const DARKNESS_SPELL_TACTICS = [
  { tactic: 'Darkness + Devil\'s Sight', effect: 'You see, enemies don\'t. Advantage attacks, disadvantage vs you.', rating: 'S+', note: 'Warlock combo. Also blinds allies without Devil\'s Sight.' },
  { tactic: 'Shadow of Moil', effect: 'Heavily obscured. Damage to attackers. Doesn\'t blind allies.', rating: 'S+ (better than Darkness)', note: 'L4 Warlock. Shadow of Moil > Darkness in most cases.' },
  { tactic: 'Darkness on enemy caster', effect: 'They can\'t target spells (most need to see target).', rating: 'A+', note: 'Anti-caster tactic. They have to move out.' },
];

export const DARKVISION_TIPS = [
  'Darkvision ≠ perfect night vision. Darkness becomes dim light.',
  'Dim light = disadvantage on Perception. You still miss things.',
  'Torches are still useful. Bright light > dim light for checks.',
  'Devil\'s Sight: ONLY vision that sees through Darkness spell.',
  'Blindsight: beats invisibility + darkness. Very powerful.',
  'Truesight: best vision. Sees everything. True Seeing spell grants it.',
  'Races without Darkvision: Human, Halfling, Dragonborn. Give them light.',
  'Magical darkness blocks ALL Darkvision. Only Devil\'s Sight works.',
  'Shadow of Moil > Darkness for Warlocks. Doesn\'t blind allies.',
  'Alert feat: can\'t be surprised. Helps in dark environments.',
];
