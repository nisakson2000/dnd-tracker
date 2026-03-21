/**
 * playerSpellSwapGuide.js
 * Player Mode: When and how to swap spells on level-up
 * Pure JS — no React dependencies.
 */

export const SPELL_SWAP_RULES_BY_CLASS = [
  { class: 'Bard', swapType: 'Known', swapWhen: 'Level up only. Replace 1 known spell.', prepStyle: 'Always know all your spells.' },
  { class: 'Sorcerer', swapType: 'Known', swapWhen: 'Level up only. Replace 1 known spell.', prepStyle: 'Very limited spells known. Choose carefully!' },
  { class: 'Ranger', swapType: 'Known', swapWhen: 'Level up only. Replace 1 known spell.', prepStyle: 'Limited list. Each spell matters.' },
  { class: 'Warlock', swapType: 'Known', swapWhen: 'Level up only. Replace 1 known spell. Also replace 1 invocation.', prepStyle: 'Very few spells known. Maximum impact per spell.' },
  { class: 'Cleric', swapType: 'Prepared', swapWhen: 'After any long rest. Full list swap.', prepStyle: 'WIS mod + level prepared from full cleric list.' },
  { class: 'Druid', swapType: 'Prepared', swapWhen: 'After any long rest. Full list swap.', prepStyle: 'WIS mod + level prepared from full druid list.' },
  { class: 'Paladin', swapType: 'Prepared', swapWhen: 'After any long rest. Full list swap.', prepStyle: 'CHA mod + half paladin level.' },
  { class: 'Wizard', swapType: 'Prepared', swapWhen: 'After any long rest from spellbook.', prepStyle: 'INT mod + level. But must be IN your spellbook.' },
];

export const SPELLS_TO_DROP = [
  { spell: 'Burning Hands', dropWhen: 'Level 5 (Fireball replaces it completely)', replacement: 'Fireball' },
  { spell: 'Chromatic Orb', dropWhen: 'Level 5 (better single-target options)', replacement: 'Lightning Bolt or Fireball' },
  { spell: 'Charm Person', dropWhen: 'Level 5 (Hypnotic Pattern is much better)', replacement: 'Hypnotic Pattern or Suggestion' },
  { spell: 'Magic Missile', dropWhen: 'Never (always reliable damage)', replacement: 'Keep it!' },
  { spell: 'Sleep', dropWhen: 'Level 5 (HP thresholds become too low)', replacement: 'Hypnotic Pattern' },
  { spell: 'Tasha\'s Hideous Laughter', dropWhen: 'Level 5 (Hold Person is better)', replacement: 'Hold Person' },
  { spell: 'Fog Cloud', dropWhen: 'Level 3 (Darkness is better with Devil\'s Sight)', replacement: 'Darkness (Warlock)' },
  { spell: 'Witch Bolt', dropWhen: 'Immediately (it\'s a trap spell)', replacement: 'Literally anything else' },
  { spell: 'True Strike', dropWhen: 'Immediately (worst cantrip in the game)', replacement: 'Any attack cantrip' },
];

export const SPELLS_TO_NEVER_DROP = [
  { spell: 'Shield', reason: '+5 AC reaction. NEVER outgrown. Always useful.' },
  { spell: 'Misty Step', reason: 'Bonus action teleport. Escape, reposition, ignore terrain.' },
  { spell: 'Counterspell', reason: 'Only gets more important at higher levels.' },
  { spell: 'Healing Word', reason: 'Bonus action ranged pickup. Irreplaceable.' },
  { spell: 'Absorb Elements', reason: 'Halve elemental damage. Scales with encounters, not level.' },
];

export function shouldSwapSpell(spellName, characterLevel) {
  const dropInfo = SPELLS_TO_DROP.find(s => s.spell.toLowerCase() === (spellName || '').toLowerCase());
  const keepInfo = SPELLS_TO_NEVER_DROP.find(s => s.spell.toLowerCase() === (spellName || '').toLowerCase());
  if (keepInfo) return { swap: false, reason: keepInfo.reason };
  if (dropInfo) return { swap: true, replacement: dropInfo.replacement, dropWhen: dropInfo.dropWhen };
  return { swap: 'maybe', reason: 'Evaluate based on your campaign and party needs.' };
}
