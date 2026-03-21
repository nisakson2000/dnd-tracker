/**
 * playerBestL6SpellsByClassGuide.js
 * Player Mode: Best level 6 spells by class — high-tier magic
 * Pure JS — no React dependencies.
 */

export const BARD_L6 = [
  { spell: 'Mass Suggestion', rating: 'S+', why: '12 creatures. WIS save. No concentration. 24-hour duration.' },
  { spell: 'Otto\'s Irresistible Dance', rating: 'S', why: 'No save. Target dances (disadvantage, speed 0). WIS save to end each turn.' },
  { spell: 'Eyebite', rating: 'A+', why: 'Each turn: choose asleep, panicked, or sickened. 1 minute concentration.' },
  { spell: 'Heroes\' Feast', rating: 'S+ (via Magical Secrets)', why: 'Immune to poison/frightened. +2d10 max HP. Advantage on WIS saves. 24 hours.' },
];

export const CLERIC_L6 = [
  { spell: 'Heal', rating: 'S', why: '70 HP heal. Cures blindness, deafness, disease. Action. One creature.' },
  { spell: 'Heroes\' Feast', rating: 'S+', why: 'Party-wide immunity to poison/frightened. +2d10 max HP. WIS save advantage. 24 hours.' },
  { spell: 'Word of Recall', rating: 'A+', why: 'Instantly teleport to your sanctuary with 5 allies. Emergency escape.' },
  { spell: 'Harm', rating: 'A', why: '14d6 necrotic. CON save for half. Can\'t reduce below 1 HP.' },
  { spell: 'Planar Ally', rating: 'B+', why: 'Call a celestial/fiend/elemental for a task. DM chooses what appears. Costs gold.' },
];

export const DRUID_L6 = [
  { spell: 'Heroes\' Feast', rating: 'S+', why: 'Immunity to poison/frightened. Extra HP. WIS save advantage.' },
  { spell: 'Transport via Plants', rating: 'S', why: 'Teleport through plants. Unlimited creatures for 1 round. Best travel spell.' },
  { spell: 'Heal', rating: 'S', why: '70 HP instant heal + cure conditions. Emergency recovery.' },
  { spell: 'Wall of Thorns', rating: 'A', why: '7d8 piercing on entry + difficult terrain. Area denial.' },
  { spell: 'Sunbeam', rating: 'A', why: 'Action each turn: 6d8 radiant line + blind (CON save). Anti-undead.' },
];

export const SORCERER_L6 = [
  { spell: 'Mass Suggestion', rating: 'S+', why: '12 creatures. No concentration. 24 hours. Encounter-ending.' },
  { spell: 'Chain Lightning', rating: 'A+', why: '10d8 lightning to primary + 3 secondaries (DEX save for half).' },
  { spell: 'Scatter', rating: 'A', why: 'Teleport 5 creatures 120ft. Reposition allies or enemies.' },
  { spell: 'Mental Prison', rating: 'A+', why: '10d10 psychic + restrained illusion. INT save.' },
  { spell: 'Sunbeam', rating: 'A', why: '6d8 radiant line each turn. Blind on fail.' },
];

export const WIZARD_L6 = [
  { spell: 'Mass Suggestion', rating: 'S+', why: '12 creatures, no concentration, 24 hours. Best L6.' },
  { spell: 'Contingency', rating: 'S+', why: 'Set a trigger for a spell. Cast Shield automatically. Pre-loaded defense.' },
  { spell: 'Chain Lightning', rating: 'A+', why: '10d8 to primary + 3 others. Good multi-target damage.' },
  { spell: 'Globe of Invulnerability', rating: 'A+', why: 'All spells L5 or lower can\'t affect you inside. Concentration.' },
  { spell: 'Disintegrate', rating: 'A', why: '10d6+40 force. DEX save. If reduced to 0 HP: dust. No revivify.' },
  { spell: 'True Seeing', rating: 'A', why: 'Truesight 120ft. See through illusions, darkness, invisibility, Ethereal.' },
  { spell: 'Create Undead', rating: 'A (campaign)', why: '3 ghouls. Upgrade at higher levels. Undead army building.' },
  { spell: 'Mental Prison', rating: 'A+', why: '10d10 psychic. INT save. Restrained in illusory cage.' },
];

export const L6_SPELL_TIPS = [
  'Mass Suggestion: best L6 spell. 12 creatures, no concentration, 24 hours.',
  'Heroes\' Feast: cast before boss fights. Immune to frightened + extra HP.',
  'Contingency (Wizard): pre-load Shield or other defensive spells.',
  'Heal: 70 HP instant. Better than any lower-level heal.',
  'Chain Lightning: 10d8 to main target + 3 others. Great AoE.',
  'Transport via Plants (Druid): instant party teleportation. Best travel.',
  'Otto\'s Irresistible Dance (Bard): no save first round. Target dances.',
  'Mental Prison: 10d10 psychic + restrained. INT save.',
  'Globe of Invulnerability: immune to L5 or lower spells inside.',
  'L6 slots are rare. Save for Mass Suggestion or Heroes\' Feast.',
];
