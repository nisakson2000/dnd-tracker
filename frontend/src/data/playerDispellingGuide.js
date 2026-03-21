/**
 * playerDispellingGuide.js
 * Player Mode: Dispel Magic, Remove Curse, and countering enemy magic
 * Pure JS — no React dependencies.
 */

export const DISPEL_MAGIC_RULES = {
  level: 3,
  range: '120ft',
  target: 'One creature, object, or magical effect',
  effect: 'Automatically ends spells of 3rd level or lower on the target.',
  higherLevel: 'For spells 4th level or higher, make an ability check (spellcasting ability + proficiency if Abjurer). DC = 10 + spell level.',
  upcast: 'Cast at higher level to automatically dispel spells of that level or lower.',
  note: 'Dispel Magic works on SPELLS only. Not magical abilities, not magic items (usually).',
};

export const DISPEL_TARGETS = {
  highPriority: [
    { spell: 'Wall of Force', level: 5, why: 'Impenetrable wall with no saves. Only Dispel Magic or Disintegrate removes it.' },
    { spell: 'Forcecage', level: 7, why: 'Nearly inescapable. Dispel Magic is one of the only counters.' },
    { spell: 'Banishment', level: 4, why: 'Remove an ally from combat. Dispel returns them.' },
    { spell: 'Hold Person/Monster', level: '2/5', why: 'Paralyzed = auto-crit + can\'t act. Free them immediately.' },
    { spell: 'Hypnotic Pattern', level: 3, why: 'Incapacitated + charmed. Dispel on the pattern removes it for everyone.' },
    { spell: 'Dominate Person/Monster', level: '5/8', why: 'Enemy controls your ally. Dispel to free them.' },
  ],
  lowPriority: [
    { spell: 'Bless', level: 1, why: '+1d4 is nice but not fight-changing. Usually not worth a 3rd level slot.' },
    { spell: 'Shield of Faith', level: 1, why: '+2 AC. Minor impact. Only dispel if you have nothing better.' },
    { spell: 'Mage Armor', level: 1, why: 'Reducing AC by 3 is okay but not urgent.' },
  ],
};

export const REMOVE_CURSE = {
  level: 3,
  effect: 'Ends all curses affecting one creature or object.',
  doesNotEnd: ['Hags\' curse (often requires specific conditions)', 'Some high-level curses', 'Lycanthropy (debated — ask DM)'],
  commonUses: [
    'Remove attunement to a cursed magic item',
    'End Bestow Curse effects',
    'Free someone from Hex (debated)',
    'Remove curse-based conditions',
  ],
  note: 'Keep this prepared if exploring hag lairs, cursed dungeons, or undead-heavy areas.',
};

export const COUNTERSPELL_VS_DISPEL = {
  counterspell: {
    timing: 'REACTION — when a spell is being cast',
    target: 'The spell being cast (before it takes effect)',
    range: '60ft from the caster',
    bestFor: 'Preventing devastating spells before they happen',
  },
  dispelMagic: {
    timing: 'ACTION — on your turn',
    target: 'An existing spell effect on a creature/object',
    range: '120ft',
    bestFor: 'Removing ongoing spell effects already in play',
  },
  summary: 'Counterspell prevents. Dispel Magic removes. You need both.',
};

export const ANTI_MAGIC_TOOLKIT = [
  { tool: 'Counterspell', level: 3, use: 'Prevent enemy spells', note: 'Reaction. Auto-counter 3rd level or lower. Check for higher.' },
  { tool: 'Dispel Magic', level: 3, use: 'Remove ongoing spells', note: 'Action. Auto-dispel 3rd level or lower.' },
  { tool: 'Remove Curse', level: 3, use: 'End curses', note: 'Action. Touch range. Ends all curses on target.' },
  { tool: 'Silence', level: 2, use: 'Prevent verbal spells in area', note: 'Most spells require verbal components. Silence = no spells.' },
  { tool: 'Antimagic Field', level: 8, use: 'Suppress ALL magic in 10ft sphere', note: 'Nuclear option. Suppresses everything — including your own.' },
  { tool: 'Globe of Invulnerability', level: 6, use: 'Block spells 5th level or lower', note: 'No spells can enter the globe. Great against groups of casters.' },
  { tool: 'Subtle Spell (Sorcerer)', level: 'Metamagic', use: 'Cast without being countered', note: 'No verbal/somatic = can\'t be Counterspelled. Clutch.' },
];

export const DISPEL_CHECK_MATH = {
  description: 'For spells above your Dispel Magic level: ability check DC = 10 + spell level',
  chances: [
    { spellLevel: 4, dc: 14, modPlus5: '60%', modPlus7: '70%', modPlus9: '80%' },
    { spellLevel: 5, dc: 15, modPlus5: '55%', modPlus7: '65%', modPlus9: '75%' },
    { spellLevel: 6, dc: 16, modPlus5: '50%', modPlus7: '60%', modPlus9: '70%' },
    { spellLevel: 7, dc: 17, modPlus5: '45%', modPlus7: '55%', modPlus9: '65%' },
    { spellLevel: 8, dc: 18, modPlus5: '40%', modPlus7: '50%', modPlus9: '60%' },
    { spellLevel: 9, dc: 19, modPlus5: '35%', modPlus7: '45%', modPlus9: '55%' },
  ],
  boosters: [
    'Abjuration Wizard: Add proficiency bonus to the check.',
    'Jack of All Trades (Bard): Add half proficiency.',
    'Enhance Ability (Fox\'s Cunning for INT): Advantage on the check.',
    'Bardic Inspiration: Add to the check.',
    'Upcast Dispel Magic: Auto-succeed up to the slot level used.',
  ],
};

export function dispelCheckDC(spellLevel) {
  return 10 + spellLevel;
}

export function dispelSuccessChance(spellcastingMod, spellLevel, profBonus, isAbjurer) {
  const dc = 10 + spellLevel;
  let bonus = spellcastingMod;
  if (isAbjurer) bonus += profBonus;
  const needed = dc - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function shouldDispelOrUpcast(targetSpellLevel, highestSlotAvailable) {
  if (targetSpellLevel <= 3) return { action: 'Cast at 3rd level', reason: 'Auto-success at base level.' };
  if (highestSlotAvailable >= targetSpellLevel) return { action: `Upcast to level ${targetSpellLevel}`, reason: 'Auto-success with higher slot.' };
  return { action: 'Cast at 3rd and make the check', reason: `DC ${10 + targetSpellLevel}. Save your higher slots if you can make the check.` };
}
