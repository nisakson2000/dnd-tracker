/**
 * playerLanguages.js
 * Player Mode: Language reference and proficiency tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// STANDARD LANGUAGES
// ---------------------------------------------------------------------------

export const STANDARD_LANGUAGES = [
  { name: 'Common', script: 'Common', speakers: 'Humans, most races', typical: true },
  { name: 'Dwarvish', script: 'Dwarvish', speakers: 'Dwarves', typical: true },
  { name: 'Elvish', script: 'Elvish', speakers: 'Elves', typical: true },
  { name: 'Giant', script: 'Dwarvish', speakers: 'Ogres, Giants', typical: true },
  { name: 'Gnomish', script: 'Dwarvish', speakers: 'Gnomes', typical: true },
  { name: 'Goblin', script: 'Dwarvish', speakers: 'Goblinoids', typical: true },
  { name: 'Halfling', script: 'Common', speakers: 'Halflings', typical: true },
  { name: 'Orc', script: 'Dwarvish', speakers: 'Orcs', typical: true },
];

// ---------------------------------------------------------------------------
// EXOTIC LANGUAGES
// ---------------------------------------------------------------------------

export const EXOTIC_LANGUAGES = [
  { name: 'Abyssal', script: 'Infernal', speakers: 'Demons', typical: false },
  { name: 'Celestial', script: 'Celestial', speakers: 'Celestials', typical: false },
  { name: 'Draconic', script: 'Draconic', speakers: 'Dragons, Dragonborn', typical: false },
  { name: 'Deep Speech', script: 'None', speakers: 'Aberrations', typical: false },
  { name: 'Infernal', script: 'Infernal', speakers: 'Devils', typical: false },
  { name: 'Primordial', script: 'Dwarvish', speakers: 'Elementals', typical: false },
  { name: 'Sylvan', script: 'Elvish', speakers: 'Fey creatures', typical: false },
  { name: 'Undercommon', script: 'Elvish', speakers: 'Underdark traders', typical: false },
];

// ---------------------------------------------------------------------------
// ALL LANGUAGES
// ---------------------------------------------------------------------------

export const ALL_LANGUAGES = [...STANDARD_LANGUAGES, ...EXOTIC_LANGUAGES];

/**
 * Get language by name.
 */
export function getLanguage(name) {
  return ALL_LANGUAGES.find(l => l.name.toLowerCase() === (name || '').toLowerCase()) || null;
}
