/**
 * playerStatPriorityByClassGuide.js
 * Player Mode: Ability score priority by class — what to max first
 * Pure JS — no React dependencies.
 */

export const ASI_RULES = {
  when: 'L4, L8, L12, L16, L19. Fighter: also L6, L14.',
  choice: '+2 to one (max 20) OR +1 to two OR take a feat.',
  halfFeat: '+1 stat + feat effect. Best at odd scores.',
};

export const PRIORITY_BY_CLASS = [
  { class: 'Barbarian', order: 'STR > CON > DEX', dump: 'INT' },
  { class: 'Bard', order: 'CHA > DEX > CON', dump: 'STR' },
  { class: 'Cleric', order: 'WIS > CON > STR/DEX', dump: 'INT' },
  { class: 'Druid', order: 'WIS > CON > DEX', dump: 'STR' },
  { class: 'Fighter', order: 'STR/DEX > CON > WIS', dump: 'INT (unless EK)' },
  { class: 'Monk', order: 'DEX > WIS > CON', dump: 'STR' },
  { class: 'Paladin', order: 'STR ≈ CHA > CON', dump: 'INT' },
  { class: 'Ranger', order: 'DEX > WIS > CON', dump: 'INT' },
  { class: 'Rogue', order: 'DEX > CON/CHA > WIS', dump: 'STR' },
  { class: 'Sorcerer', order: 'CHA > CON > DEX', dump: 'STR' },
  { class: 'Warlock', order: 'CHA > CON > DEX', dump: 'STR' },
  { class: 'Wizard', order: 'INT > CON > DEX', dump: 'STR' },
  { class: 'Artificer', order: 'INT > CON > DEX', dump: 'STR' },
];

export const STAT_TIPS = [
  'Max primary stat to 20 FIRST. +1 hit/DC > most feats.',
  'Half-feats at odd scores: Fey Touched, Resilient, Skill Expert.',
  'Don\'t dump WIS below 10. WIS saves are deadly.',
  'CON 14+ for everyone. HP + concentration.',
  'GWM/SS can beat +2 ASI for martial builds.',
  'Fighter: 7 ASIs. More feat flexibility.',
  'Hexblade: CHA for everything. Best SAD class.',
  'Monk: DEX + WIS + CON all matter. Tight.',
  'Paladin: STR and CHA both critical. MAD.',
  'Wizard: INT is everything.',
];
