/**
 * playerPartyBuffs.js
 * Player Mode: Party-wide buff spells and optimal buff stacking
 * Pure JS — no React dependencies.
 */

export const PARTY_BUFFS = [
  { spell: 'Bless', level: 1, concentration: true, targets: 3, duration: '1 minute', effect: '+1d4 to attacks and saves', rating: 'S', note: 'The best low-level buff. +1d4 averages +2.5 — applies to EVERY attack and save.' },
  { spell: 'Aid', level: 2, concentration: false, targets: 3, duration: '8 hours', effect: '+5 max HP (per spell level)', rating: 'A', note: 'No concentration! Lasts all day. Upcast for +5 more per level. Stack with Heroes\' Feast.' },
  { spell: 'Haste', level: 3, concentration: true, targets: 1, duration: '1 minute', effect: '+2 AC, double speed, extra action', rating: 'S', note: 'Incredible on martials. WARNING: losing concentration = target loses a full turn (lethargy).' },
  { spell: 'Heroes\' Feast', level: 6, concentration: false, targets: 13, duration: '24 hours', effect: 'Immune to poison/fear, +2d10 max HP, advantage on WIS saves', rating: 'S', note: '1000gp bowl consumed. The ultimate pre-fight buff. Cast the night before a boss fight.' },
  { spell: 'Holy Aura', level: 8, concentration: true, targets: '30ft radius', duration: '1 minute', effect: 'Advantage on saves, attacks against have disadvantage, fiend/undead auto-blinded on hit', rating: 'S', note: '8th level is steep but the effect is incredible for the whole party.' },
  { spell: 'Freedom of Movement', level: 4, concentration: false, targets: 1, duration: '1 hour', effect: 'Ignore difficult terrain, can\'t be restrained/paralyzed/grappled', rating: 'A', note: 'No concentration! Pre-cast on your tank before entering the boss room.' },
  { spell: 'Death Ward', level: 4, concentration: false, targets: 1, duration: '8 hours', effect: 'First time you drop to 0 HP, drop to 1 instead', rating: 'A', note: 'No concentration! 8-hour duration! Cast on your squishiest ally before adventuring.' },
  { spell: 'Beacon of Hope', level: 3, concentration: true, targets: '30ft', duration: '1 minute', effect: 'Advantage on WIS/death saves, max healing from heal spells', rating: 'B', note: 'Max healing is nice but competes with better concentration spells.' },
  { spell: 'Crusader\'s Mantle', level: 3, concentration: true, targets: '30ft', duration: '1 minute', effect: 'All allies deal +1d4 radiant per hit', rating: 'A', note: 'Better with multiple martial allies making many attacks. Stacks with everything.' },
  { spell: 'Pass Without Trace', level: 2, concentration: true, targets: 'Party', duration: '1 hour', effect: '+10 to Stealth checks', rating: 'S', note: 'Entire party gets +10 Stealth. Nearly guarantees surprise if all stealth.' },
];

export const BUFF_STACKING_RULES = [
  'Same spell doesn\'t stack with itself (two Bless = only one applies).',
  'DIFFERENT spells DO stack (Bless + Aid + Haste all apply simultaneously).',
  'You can only concentrate on ONE spell at a time.',
  'Non-concentration buffs are more valuable because they don\'t compete.',
  'Same-named magical effects don\'t stack (two Rings of Protection = only +1 total).',
  'Advantage doesn\'t stack. Two sources of advantage = still just advantage.',
  'Flat bonuses (like +1d4 from Bless) stack with advantage.',
];

export const OPTIMAL_BUFF_ORDER = [
  { order: 1, timing: 'Night before', spells: ['Heroes\' Feast (6th)', 'Death Ward (4th)', 'Aid (2nd)'], note: 'Cast before long rest if timing works. All last 8+ hours.' },
  { order: 2, timing: 'Morning', spells: ['Mage Armor (1st)', 'Gift of Alacrity (1st)', 'Longstrider (1st)'], note: 'Long-duration, no concentration. Cast and forget.' },
  { order: 3, timing: 'Pre-combat', spells: ['Pass Without Trace (for ambush)', 'Freedom of Movement (on tank)', 'Bless or Spirit Guardians'], note: 'Concentration spells. Choose ONE based on situation.' },
  { order: 4, timing: 'Round 1', spells: ['Haste (on best martial)', 'Faerie Fire (if enemies grouped)', 'Bless (if no other concentration)'], note: 'Concentration spell for combat. Protect it.' },
];

export function getBuffInfo(spellName) {
  return PARTY_BUFFS.find(b =>
    b.spell.toLowerCase().includes((spellName || '').toLowerCase())
  ) || null;
}

export function getNonConcentrationBuffs() {
  return PARTY_BUFFS.filter(b => !b.concentration);
}

export function getBuffsForLevel(maxLevel) {
  return PARTY_BUFFS.filter(b => b.level <= maxLevel);
}
