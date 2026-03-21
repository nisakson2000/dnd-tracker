/**
 * playerPartyBalanceGuide.js
 * Player Mode: Party composition — building a balanced team
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Frontliner', classes: ['Fighter', 'Barbarian', 'Paladin', 'Cleric'], note: 'Takes hits. Protects backline.' },
  { role: 'Striker', classes: ['Rogue', 'Ranger', 'Fighter', 'Monk'], note: 'Consistent high damage.' },
  { role: 'Controller', classes: ['Wizard', 'Druid', 'Bard', 'Sorcerer'], note: 'Web, Hypnotic Pattern, Wall spells.' },
  { role: 'Healer', classes: ['Cleric', 'Druid', 'Bard', 'Paladin'], note: 'Healing Word + Revivify access.' },
  { role: 'Utility', classes: ['Rogue', 'Bard', 'Ranger', 'Artificer'], note: 'Skills, tools, scouting.' },
];

export const MUST_HAVE = [
  { need: 'Healing Word', priority: 'Critical', note: 'Someone must pick up unconscious allies.' },
  { need: 'Revivify', priority: 'High', note: 'Need by L5. Death happens.' },
  { need: 'Frontline', priority: 'High', note: 'Someone engages enemies to protect casters.' },
  { need: 'Ranged damage', priority: 'High', note: 'Flying enemies require ranged options.' },
  { need: 'AoE damage', priority: 'Medium', note: 'Fireball for groups.' },
  { need: 'Thieves\' tools', priority: 'Medium', note: 'Locks and traps in dungeons.' },
];

export const PARTY_SYNERGIES = [
  { combo: 'Warlock + Druid', detail: 'Spike Growth + Repelling Blast push combo.', rating: 'S' },
  { combo: 'Paladin + Bard', detail: 'Aura + Bardic Inspiration = unbreakable saves.', rating: 'S' },
  { combo: 'Rogue + Faerie Fire source', detail: 'Advantage = guaranteed Sneak Attack.', rating: 'S' },
  { combo: 'Wizard + Fighter', detail: 'Control + destroy. Classic combo.', rating: 'A' },
  { combo: 'Cleric + Barbarian', detail: 'Spirit Guardians + unkillable frontliner.', rating: 'A' },
];

export const NO_HEALER_SOLUTIONS = [
  { solution: 'Healer feat', detail: '1d6+4+level HP. No spell slot.' },
  { solution: 'Healing potions', detail: '50gp each. Everyone carries 2-3.' },
  { solution: 'Short rests', detail: 'Hit Dice healing. Rest often.' },
  { solution: 'Magic Initiate', detail: 'Learn Healing Word on any class.' },
];

export function roleCoverage(partyClasses) {
  const healers = ['Cleric', 'Bard', 'Druid'];
  const frontliners = ['Fighter', 'Barbarian', 'Paladin'];
  return {
    healing: partyClasses.some(c => healers.includes(c)),
    frontline: partyClasses.some(c => frontliners.includes(c)),
  };
}
