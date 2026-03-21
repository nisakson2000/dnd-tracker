/**
 * playerArtificerSpecialistGuide.js
 * Player Mode: All Artificer subclasses compared — roles, features, and optimization
 * Pure JS — no React dependencies.
 */

export const ARTIFICER_SPECIALISTS_RANKED = [
  { subclass: 'Armorer', rating: 'S', role: 'Tank/Infiltrator', key: 'Guardian: force aggro. Infiltrator: stealth+range. Extra infusion slots L9.', note: 'Most versatile.' },
  { subclass: 'Battle Smith', rating: 'S', role: 'Damage/Pet', key: 'INT for attacks (SAD). Steel Defender. Arcane Jolt +2d6 L9.', note: 'Best damage.' },
  { subclass: 'Artillerist', rating: 'A+', role: 'Support/Damage', key: 'Eldritch Cannon (Protector: 1d8+INT temp HP BA). +1d8 spell damage L5.', note: 'Best support cannon.' },
  { subclass: 'Alchemist', rating: 'B+', role: 'Healer', key: 'Random elixir. +INT healing/damage L5.', note: 'Random elixirs hurt consistency.' },
];

export const ARTIFICER_SPECIALIST_TIPS = [
  'Flash of Genius (L7): +INT to any save/check as reaction. Best support feature in 5e.',
  'Spell-Storing Item (L11): store a spell. Anyone in party can use it. Incredible.',
  'Infusions are for the PARTY. Think team-first.',
  'Battle Smith: INT for attacks. Single ability dependency. Very efficient.',
  'Armorer Guardian: Thunder Gauntlets = enemies MUST attack you or have disadvantage.',
  'Artillerist Protector: 1d8+5 temp HP every round to your party. Better than most healing.',
  'Artificers attune extra items: 4 at L10, 5 at L14, 6 at L18.',
  'Tool Expertise at L6: double proficiency with ALL tools you\'re proficient with.',
];
