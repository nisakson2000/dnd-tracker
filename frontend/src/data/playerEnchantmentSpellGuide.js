/**
 * playerEnchantmentSpellGuide.js
 * Player Mode: Enchantment spells — charm, compulsion, and mind control
 * Pure JS — no React dependencies.
 */

export const ENCHANTMENT_SPELLS_RANKED = [
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S+', note: 'Incapacitate all in 30ft cube. WIS save. No repeat saves — only ends on damage/shaking.' },
  { spell: 'Hold Person', level: 2, rating: 'S', note: 'Paralyze humanoid (WIS save each turn). Auto-crit within 5ft. Upcast for multiple targets.' },
  { spell: 'Hold Monster', level: 5, rating: 'S', note: 'Hold Person but works on ANY creature. Same auto-crit. WIS save each turn.' },
  { spell: 'Command', level: 1, rating: 'A+', note: 'One word: Grovel (prone+end turn), Flee, Drop (weapon), Halt. No save for single target... wait, WIS save. Upcast for multiple.' },
  { spell: 'Suggestion', level: 2, rating: 'S', note: '"Reasonable" course of action for 8 hours. Incredibly versatile. DM adjudicates "reasonable."' },
  { spell: 'Bless', level: 1, rating: 'S', note: '+1d4 to attacks and saves for 3 creatures. Best L1 concentration spell. Always valuable.' },
  { spell: 'Bane', level: 1, rating: 'A+', note: '-1d4 from attacks and saves for 3 creatures. CHA save. Inverse Bless.' },
  { spell: 'Tasha\'s Hideous Laughter', level: 1, rating: 'A+', note: 'Incapacitated + prone. WIS save. Repeat save on damage. Great L1 control.' },
  { spell: 'Charm Person', level: 1, rating: 'B+', note: 'Charmed for 1 hour. Advantage on social checks. Target knows they were charmed after.' },
  { spell: 'Heroism', level: 1, rating: 'A', note: 'Temp HP = CHA mod each turn + immune to frightened. Good pre-fight buff.' },
  { spell: 'Crown of Madness', level: 2, rating: 'C', note: 'Terrible. Must use your action each turn. Target can act normally if no allies adjacent.' },
  { spell: 'Calm Emotions', level: 2, rating: 'B+', note: 'Suppress charm/frighten or make hostile creatures indifferent. Niche but powerful when needed.' },
  { spell: 'Zone of Truth', level: 2, rating: 'A', note: 'Creatures can\'t lie (CHA save). They CAN choose not to speak.' },
  { spell: 'Compulsion', level: 4, rating: 'B', note: 'Move targets in a direction. Concentration + WIS save each turn. Weak for L4.' },
  { spell: 'Dominate Person', level: 5, rating: 'A+', note: 'Full control over humanoid. WIS save. Repeat save on damage. Concentration.' },
  { spell: 'Dominate Monster', level: 8, rating: 'S', note: 'Dominate ANY creature for 1 hour. WIS save. The ultimate control spell.' },
  { spell: 'Mass Suggestion', level: 6, rating: 'S+', note: 'Suggestion on 12 creatures. NO concentration. 24-hour duration. Insane value.' },
  { spell: 'Modify Memory', level: 5, rating: 'A+', note: 'Rewrite 10 minutes of memory. Perfect crime spell. WIS save.' },
  { spell: 'Power Word Stun', level: 8, rating: 'A', note: 'If target has 150 HP or fewer, auto-stun. NO save. CON save each turn to end.' },
  { spell: 'Feeblemind', level: 8, rating: 'S', note: 'INT save or 1 INT and 1 CHA. Can\'t cast spells. INT save each 30 days to recover.' },
  { spell: 'Geas', level: 5, rating: 'B+', note: '30-day command. 5d10 psychic for disobedience (max 1/day). WIS save.' },
];

export const ENCHANTMENT_TIPS = [
  'Hypnotic Pattern > Fireball in most situations. Incapacitated enemies can be picked off one by one.',
  'Hold Person on crits: melee attacks within 5ft auto-crit paralyzed targets. Coordinate with Paladin smites.',
  'Suggestion is as strong as your creativity (and DM\'s interpretation of "reasonable").',
  'Many enchantment spells ONLY work on humanoids. Check the spell description before targeting a dragon.',
  'Charmed condition: can\'t attack the charmer. Advantage on social checks. Target knows after the spell ends.',
  'Subtle Spell + enchantment = cast without anyone knowing. Subtle Suggestion in negotiations is devastating.',
  'Mass Suggestion at L6 with NO concentration is one of the best spells in the game.',
  'Bless should be your first concentration spell in most combats. +1d4 to attacks AND saves is always good.',
];

export const CHARM_IMMUNITY = {
  note: 'Many creatures are immune to the Charmed condition. Know before you cast.',
  immuneCreatures: [
    'Undead (most)',
    'Constructs (all)',
    'Elves (advantage, not immunity, on saves vs charm)',
    'Berserker Barbarians (while raging, immune to frightened + charmed)',
    'Devotion Paladins (Aura of Devotion: allies within 10ft immune to charm)',
    'Some fiends and fey',
  ],
  workarounds: [
    'Check creature type before casting enchantment',
    'Hold Person/Monster technically causes Paralyzed, not Charmed',
    'Hypnotic Pattern causes Incapacitated + Charmed, so charm-immune creatures are still affected by incapacitation',
    'Wait — Hypnotic Pattern: "charmed creature is incapacitated." If immune to charm, WHOLE EFFECT fails.',
  ],
};
