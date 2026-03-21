/**
 * playerSpellScrollRules.js
 * Player Mode: Spell scroll creation, usage, and costs
 * Pure JS — no React dependencies.
 */

export const SPELL_SCROLL_TABLE = [
  { level: 0, saveDC: 13, attackBonus: 5, cost: '15 gp', craftTime: '1 day', rarity: 'Common' },
  { level: 1, saveDC: 13, attackBonus: 5, cost: '25 gp', craftTime: '1 day', rarity: 'Common' },
  { level: 2, saveDC: 13, attackBonus: 5, cost: '250 gp', craftTime: '3 days', rarity: 'Uncommon' },
  { level: 3, saveDC: 15, attackBonus: 7, cost: '500 gp', craftTime: '1 workweek', rarity: 'Uncommon' },
  { level: 4, saveDC: 15, attackBonus: 7, cost: '2,500 gp', craftTime: '2 workweeks', rarity: 'Rare' },
  { level: 5, saveDC: 17, attackBonus: 9, cost: '5,000 gp', craftTime: '4 workweeks', rarity: 'Rare' },
  { level: 6, saveDC: 17, attackBonus: 9, cost: '15,000 gp', craftTime: '8 workweeks', rarity: 'Very Rare' },
  { level: 7, saveDC: 18, attackBonus: 10, cost: '25,000 gp', craftTime: '16 workweeks', rarity: 'Very Rare' },
  { level: 8, saveDC: 18, attackBonus: 10, cost: '50,000 gp', craftTime: '32 workweeks', rarity: 'Very Rare' },
  { level: 9, saveDC: 19, attackBonus: 11, cost: '250,000 gp', craftTime: '48 workweeks', rarity: 'Legendary' },
];

export const SCROLL_USAGE_RULES = {
  canUse: 'If the spell is on your class\'s spell list, you can read the scroll and cast the spell without components.',
  higherLevel: 'If the spell is higher level than you can normally cast, make an Arcana check (DC 10 + spell level). On failure, the scroll is destroyed.',
  consumed: 'The scroll is consumed when the spell is cast (or on a failed check).',
  concentration: 'If the scroll spell requires concentration, you must concentrate as normal.',
  castingTime: 'The casting time is the same as the spell\'s normal casting time.',
  saveDC: 'The scroll\'s save DC and attack bonus are fixed (see table), not based on your stats.',
};

export const SCROLL_CRAFTING_RULES = {
  requirement: 'Must have the spell prepared (or known) and proficiency in Arcana.',
  cost: 'See table — includes exotic inks and parchment.',
  time: 'See table — represents workweeks of downtime.',
  interruption: 'Crafting can be done in chunks if you have other activities.',
  tool: 'Calligrapher\'s supplies or similar writing tools.',
};

export const SCROLL_TIPS = [
  'Wizards can copy spell scrolls into their spellbook (2 hours + 50gp per spell level).',
  'Scrolls let you cast without using a spell slot — great for saving resources.',
  'Keep scrolls of situational spells you don\'t normally prepare (Remove Curse, Water Breathing).',
  'A Thief Rogue (13th level) can use spell scrolls with Use Magic Device.',
  'Artificers can use any spell scroll thanks to their broad spell list.',
];

export function getScrollInfo(spellLevel) {
  return SPELL_SCROLL_TABLE.find(s => s.level === spellLevel) || null;
}

export function canCastFromScroll(spellLevel, maxSpellLevel) {
  if (spellLevel <= maxSpellLevel) return { canCast: true, checkRequired: false };
  return { canCast: true, checkRequired: true, dc: 10 + spellLevel };
}
