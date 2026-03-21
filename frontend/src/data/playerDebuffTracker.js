/**
 * playerDebuffTracker.js
 * Player Mode: Tracking and managing debuffs on enemies
 * Pure JS — no React dependencies.
 */

export const COMMON_DEBUFFS = [
  { debuff: 'Hex', source: 'Warlock spell (1st)', effect: '+1d6 necrotic per hit. Disadvantage on one ability check type.', duration: 'Concentration (1hr/8hr/24hr)', endCondition: 'Caster drops concentration or duration ends.' },
  { debuff: 'Hunter\'s Mark', source: 'Ranger spell (1st)', effect: '+1d6 per hit on marked target.', duration: 'Concentration (1hr)', endCondition: 'Caster drops concentration. Can move to new target when marked target drops.' },
  { debuff: 'Faerie Fire', source: 'Druid/Bard spell (1st)', effect: 'Outlined in light. Attacks have advantage. Can\'t benefit from invisibility.', duration: 'Concentration (1 min)', endCondition: 'DEX save at cast. No repeat saves.' },
  { debuff: 'Bane', source: 'Cleric/Bard spell (1st)', effect: '-1d4 from attack rolls and saving throws.', duration: 'Concentration (1 min)', endCondition: 'CHA save. No repeat saves after initial.' },
  { debuff: 'Slow', source: 'Sorcerer/Wizard spell (3rd)', effect: '-2 AC, -2 DEX saves, no reactions, only action OR bonus action, no multiattack.', duration: 'Concentration (1 min)', endCondition: 'WIS save at end of each turn to end effect.' },
  { debuff: 'Bestow Curse', source: 'Various (3rd)', effect: 'Varies: disadvantage on checks/saves, extra d8 necrotic, waste turns, or custom.', duration: 'Concentration (1 min) or permanent at 5th+', endCondition: 'At 5th level: no concentration, 8 hours. At 7th+: permanent until Dispel.' },
  { debuff: 'Blindness/Deafness', source: 'Various (2nd)', effect: 'Blinded OR Deafened. Blinded = disadvantage on attacks, advantage against them.', duration: '1 minute (no concentration!)', endCondition: 'CON save at end of each turn to end effect.' },
  { debuff: 'Hold Person', source: 'Various (2nd)', effect: 'Paralyzed. Can\'t move or act. Auto-crit from within 5ft. Auto-fail STR/DEX saves.', duration: 'Concentration (1 min)', endCondition: 'WIS save at end of each turn to end effect.' },
  { debuff: 'Entangle', source: 'Druid (1st)', effect: 'Restrained. Speed 0, disadvantage on attacks, advantage against them, disadvantage on DEX saves.', duration: 'Concentration (1 min)', endCondition: 'STR check as action to break free.' },
  { debuff: 'Vicious Mockery', source: 'Bard cantrip', effect: '1d4 psychic + disadvantage on next attack roll.', duration: 'Until end of their next turn', endCondition: 'After their next attack roll.' },
];

export const DEBUFF_TRACKING_TEMPLATE = {
  id: '',
  debuffName: '',
  target: '',
  caster: '',
  roundApplied: 0,
  duration: 0,
  requiresConcentration: false,
  saveType: '',
  saveDC: 0,
  effect: '',
  endCondition: '',
  active: true,
};

export const DEBUFF_STACKING = [
  'Different debuffs DO stack. Hex + Bane + Faerie Fire all apply simultaneously.',
  'Same spell doesn\'t stack from multiple casters. Two Hexes = only one applies.',
  'Disadvantage doesn\'t stack. Two sources of disadvantage = still just disadvantage.',
  'Advantage and disadvantage cancel each other, regardless of number of sources.',
  'Numerical penalties (like Bane\'s -1d4) stack with disadvantage.',
  'Conditions stack: Blinded + Restrained = both effects apply.',
];

export function createDebuff(name, target, caster, round, duration, concentration) {
  const info = COMMON_DEBUFFS.find(d =>
    d.debuff.toLowerCase().includes((name || '').toLowerCase())
  );
  return {
    ...DEBUFF_TRACKING_TEMPLATE,
    id: `debuff-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    debuffName: name,
    target,
    caster,
    roundApplied: round || 1,
    duration: duration || 10,
    requiresConcentration: concentration || false,
    effect: info ? info.effect : '',
    endCondition: info ? info.endCondition : '',
  };
}

export function isDebuffExpired(debuff, currentRound) {
  return currentRound > debuff.roundApplied + debuff.duration;
}

export function getActiveDebuffs(debuffs, currentRound) {
  return (debuffs || []).filter(d => d.active && !isDebuffExpired(d, currentRound));
}

export function getDebuffInfo(debuffName) {
  return COMMON_DEBUFFS.find(d =>
    d.debuff.toLowerCase().includes((debuffName || '').toLowerCase())
  ) || null;
}
