/**
 * playerIdealPartyComp.js
 * Player Mode: Optimal party composition and role distribution
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Frontline/Tank', classes: ['Fighter', 'Barbarian', 'Paladin', 'Cleric (melee)'], priority: 'S' },
  { role: 'Healer/Support', classes: ['Cleric', 'Druid', 'Bard', 'Divine Soul Sorcerer'], priority: 'S' },
  { role: 'Damage Dealer', classes: ['Fighter', 'Rogue', 'Ranger', 'Warlock', 'Monk'], priority: 'A' },
  { role: 'Controller', classes: ['Wizard', 'Sorcerer', 'Druid', 'Bard'], priority: 'A' },
  { role: 'Utility/Scout', classes: ['Rogue', 'Ranger', 'Bard', 'Artificer'], priority: 'B' },
];

export const CLASSIC_COMPS = [
  { comp: 'Fighter, Cleric, Wizard, Rogue', name: 'Classic Four' },
  { comp: 'Paladin, Bard, Druid, Ranger', name: 'Nature & Grace' },
  { comp: 'Barbarian, Cleric, Sorcerer, Rogue', name: 'Burst Squad' },
  { comp: 'Paladin, Wizard, Fighter, Bard', name: 'Balanced' },
];

export const MISSING_ROLE_FIXES = {
  noHealer: ['Healing potions', 'Healer feat', 'Celestial Warlock', 'Short rest classes'],
  noTank: ['Summon creatures', 'Control spells', 'Best armor possible', 'Dodge action'],
  noUtility: ['Knock spell', 'Background skills', 'Ritual Caster feat'],
};

export function analyzeComp(classes) {
  const gaps = [];
  const tanks = ['Fighter', 'Barbarian', 'Paladin'];
  const healers = ['Cleric', 'Druid', 'Bard'];
  if (!classes.some(c => tanks.includes(c))) gaps.push('No tank');
  if (!classes.some(c => healers.includes(c))) gaps.push('No healer');
  return gaps;
}
