/**
 * playerTemporaryHP.js
 * Player Mode: Temporary HP rules and common sources
 * Pure JS — no React dependencies.
 */

export const TEMP_HP_RULES = {
  stacking: 'Temporary HP does NOT stack. If you gain temp HP while you have some, choose which to keep.',
  healing: 'Temp HP is NOT healing — it can be gained even at max HP.',
  damage: 'Temp HP is lost first before real HP.',
  duration: 'Lasts until depleted or after a long rest (unless otherwise specified).',
  deathSaves: 'Temp HP doesn\'t count toward your max HP. At 0 HP with temp HP = still making death saves.',
  noHealing: 'Temp HP cannot be restored by healing. Once lost, they\'re gone.',
};

export const TEMP_HP_SOURCES = [
  { source: 'Heroism (1st level)', amount: 'Spellcasting mod per turn', duration: 'Concentration, up to 1 minute', classes: ['Bard', 'Paladin'] },
  { source: 'False Life (1st level)', amount: '1d4+4 (+5 per slot above 1st)', duration: '1 hour', classes: ['Sorcerer', 'Wizard', 'Warlock'] },
  { source: 'Armor of Agathys (1st level)', amount: '5 per slot level', duration: '1 hour', classes: ['Warlock'], note: 'Also deals cold damage to melee attackers.' },
  { source: 'Aid (2nd level)', amount: '+5 max HP per slot level above 2nd', duration: '8 hours', classes: ['Cleric', 'Paladin'], note: 'Actually increases max HP, not temp HP.' },
  { source: 'Inspiring Leader (feat)', amount: 'Level + CHA mod', duration: 'Until depleted or long rest', classes: ['Any with feat'], note: 'After 10-minute speech, up to 6 creatures.' },
  { source: 'Dark One\'s Blessing (Warlock)', amount: 'CHA mod + warlock level', duration: 'Until depleted or long rest', classes: ['Warlock (Fiend)'], note: 'When you reduce a hostile creature to 0 HP.' },
  { source: 'Twilight Sanctuary (Cleric)', amount: '1d6 + cleric level', duration: 'End of each turn while in sanctuary', classes: ['Cleric (Twilight)'] },
  { source: 'Mantle of Inspiration (Bard)', amount: 'Bardic Inspiration die + CHA mod', duration: 'Until depleted', classes: ['Bard (Glamour)'] },
  { source: 'Abjuration Ward (Wizard)', amount: '2x wizard level + INT mod', duration: 'Until depleted or long rest', classes: ['Wizard (Abjuration)'], note: 'Absorbs damage, regained when casting abjuration spells.' },
];

export function applyTempHP(currentTempHP, newTempHP) {
  // Take the higher value — temp HP doesn't stack
  return Math.max(currentTempHP, newTempHP);
}

export function takeDamageWithTempHP(damage, currentHP, tempHP) {
  if (tempHP >= damage) {
    return { hp: currentHP, tempHP: tempHP - damage, damageToHP: 0 };
  }
  const overflow = damage - tempHP;
  return { hp: Math.max(0, currentHP - overflow), tempHP: 0, damageToHP: overflow };
}

export function getTempHPSources(className) {
  return TEMP_HP_SOURCES.filter(s =>
    s.classes.includes('Any with feat') ||
    s.classes.some(c => c.toLowerCase().includes((className || '').toLowerCase()))
  );
}
