/**
 * Language System — D&D 5e Languages & Translation
 *
 * Covers roadmap item 181 (Language tracker — which characters speak which languages).
 * Complete language reference with scripts, typical speakers, and translation rules.
 */

export const STANDARD_LANGUAGES = [
  { name: 'Common', script: 'Common', typicalSpeakers: 'Humans, halflings, most civilized races', description: 'The trade tongue spoken across most of the known world.' },
  { name: 'Dwarvish', script: 'Dwarvish', typicalSpeakers: 'Dwarves', description: 'A harsh, consonant-heavy language with rune-based writing. Often heard in mines and forges.' },
  { name: 'Elvish', script: 'Elvish', typicalSpeakers: 'Elves', description: 'A flowing, musical language. Its script is graceful and ornate.' },
  { name: 'Giant', script: 'Dwarvish', typicalSpeakers: 'Ogres, Giants', description: 'A booming, thunderous language that uses Dwarvish runes.' },
  { name: 'Gnomish', script: 'Dwarvish', typicalSpeakers: 'Gnomes', description: 'A rapid, technical language full of compound words and invented terminology.' },
  { name: 'Goblin', script: 'Dwarvish', typicalSpeakers: 'Goblinoids (Goblins, Hobgoblins, Bugbears)', description: 'A guttural, clipped language with many borrowed words.' },
  { name: 'Halfling', script: 'Common', typicalSpeakers: 'Halflings', description: 'A warm, homey language with many food-related idioms.' },
  { name: 'Orc', script: 'Dwarvish', typicalSpeakers: 'Orcs', description: 'A harsh, aggressive language with a limited but expressive vocabulary.' },
];

export const EXOTIC_LANGUAGES = [
  { name: 'Abyssal', script: 'Infernal', typicalSpeakers: 'Demons', description: 'The writhing, chaotic tongue of demons. Hearing it can cause unease.' },
  { name: 'Celestial', script: 'Celestial', typicalSpeakers: 'Celestials (Angels)', description: 'The language of the upper planes. Musical and radiant.' },
  { name: 'Deep Speech', script: 'None (telepathic)', typicalSpeakers: 'Aboleths, Mind Flayers, Beholders', description: 'The alien language of aberrations. Cannot truly be spoken — felt more than heard.' },
  { name: 'Draconic', script: 'Draconic', typicalSpeakers: 'Dragons, Dragonborn, Kobolds', description: 'An ancient, precise language. All magic has roots in Draconic.' },
  { name: 'Infernal', script: 'Infernal', typicalSpeakers: 'Devils', description: 'The rigid, contractual language of the Nine Hells. Every word has exact legal meaning.' },
  { name: 'Primordial', script: 'Dwarvish', typicalSpeakers: 'Elementals', description: 'The raw language of the elements. Includes dialects: Aquan, Auran, Ignan, Terran.' },
  { name: 'Sylvan', script: 'Elvish', typicalSpeakers: 'Fey creatures', description: 'The ancient tongue of the Feywild. Related to Elvish but wilder and more primal.' },
  { name: 'Undercommon', script: 'Elvish', typicalSpeakers: 'Underdark traders (Drow, Duergar, Deep Gnomes)', description: 'A trade language of the Underdark, blending Elvish, Dwarvish, and Drow sign language.' },
];

export const SECRET_LANGUAGES = [
  { name: 'Druidic', script: 'Druidic', typicalSpeakers: 'Druids only', description: 'The secret language of druid circles. Teaching it to non-druids is forbidden.' },
  { name: 'Thieves\' Cant', script: 'None (coded speech + signs)', typicalSpeakers: 'Rogues, criminals', description: 'A mix of jargon, code words, and hand signals. Hides messages in normal conversation.' },
];

export const PRIMORDIAL_DIALECTS = [
  { name: 'Aquan', element: 'Water', description: 'Flowing, bubbly sounds. Spoken by water elementals and sea creatures.' },
  { name: 'Auran', element: 'Air', description: 'Breathy, whistling tones. Spoken by air elementals and cloud creatures.' },
  { name: 'Ignan', element: 'Fire', description: 'Crackling, popping sounds. Spoken by fire elementals and salamanders.' },
  { name: 'Terran', element: 'Earth', description: 'Rumbling, grinding sounds. Spoken by earth elementals and stone creatures.' },
];

// ── Scripts ──
export const SCRIPTS = {
  Common: { description: 'Simple alphabetic script used across human kingdoms.', complexity: 'Simple' },
  Dwarvish: { description: 'Angular runes carved into stone. Also used by Giant, Gnomish, Goblin, Orc.', complexity: 'Moderate' },
  Elvish: { description: 'Flowing, cursive script of great beauty. Also used by Sylvan, Undercommon.', complexity: 'Complex' },
  Draconic: { description: 'Ancient ideographic script. Each symbol represents a concept.', complexity: 'Complex' },
  Infernal: { description: 'Precise, angular script with contractual notation. Also used by Abyssal.', complexity: 'Complex' },
  Celestial: { description: 'Luminous script that seems to glow faintly on consecrated surfaces.', complexity: 'Complex' },
  Druidic: { description: 'Natural symbols — marks on trees, stone arrangements, leaf patterns.', complexity: 'Secret' },
};

// ── Race Default Languages ──
export const RACE_LANGUAGES = {
  Human: ['Common', '+1 of choice'],
  Elf: ['Common', 'Elvish'],
  'High Elf': ['Common', 'Elvish', '+1 of choice'],
  Dwarf: ['Common', 'Dwarvish'],
  Halfling: ['Common', 'Halfling'],
  Gnome: ['Common', 'Gnomish'],
  'Half-Elf': ['Common', 'Elvish', '+1 of choice'],
  'Half-Orc': ['Common', 'Orc'],
  Tiefling: ['Common', 'Infernal'],
  Dragonborn: ['Common', 'Draconic'],
};

// ── Translation Rules ──
export const TRANSLATION_RULES = {
  comprehendLanguages: {
    spell: 'Comprehend Languages',
    level: '1st (ritual)',
    duration: '1 hour',
    effect: 'Understand any spoken or written language. Cannot speak or write it.',
  },
  tongues: {
    spell: 'Tongues',
    level: '3rd',
    duration: '1 hour',
    effect: 'Target can understand and speak any language.',
  },
  telepathy: {
    ability: 'Telepathy',
    effect: 'Communicate mentally — bypasses language entirely if images/emotions used.',
  },
  linguist: {
    feat: 'Linguist',
    effect: 'Learn 3 additional languages. Can create written ciphers (INT check to decode).',
  },
};

/**
 * Get all languages grouped by category.
 */
export function getAllLanguages() {
  return {
    standard: STANDARD_LANGUAGES,
    exotic: EXOTIC_LANGUAGES,
    secret: SECRET_LANGUAGES,
    primordialDialects: PRIMORDIAL_DIALECTS,
  };
}

/**
 * Get languages for a specific race.
 */
export function getRaceLanguages(race) {
  return RACE_LANGUAGES[race] || ['Common'];
}

/**
 * Get info about a specific language.
 */
export function getLanguage(name) {
  const all = [...STANDARD_LANGUAGES, ...EXOTIC_LANGUAGES, ...SECRET_LANGUAGES, ...PRIMORDIAL_DIALECTS];
  return all.find(l => l.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Get script info.
 */
export function getScript(name) {
  return SCRIPTS[name] || null;
}

/**
 * Check if two creatures can communicate (based on shared languages).
 */
export function canCommunicate(languages1, languages2) {
  const shared = languages1.filter(l => languages2.includes(l));
  return { canCommunicate: shared.length > 0, sharedLanguages: shared };
}
