/**
 * playerScrollUsage.js
 * Player Mode: Spell scroll rules, who can use them, and scroll strategies
 * Pure JS — no React dependencies.
 */

export const SCROLL_RULES = {
  whoCanUse: 'A spell scroll can be used by anyone whose class spell list contains the spell.',
  actionType: 'Using a scroll takes the same action as casting the spell.',
  concentration: 'If the spell requires concentration, the scroll user must concentrate.',
  consumed: 'The scroll is CONSUMED when used, regardless of success or failure.',
  highLevel: 'If the spell is higher level than you can normally cast, make an ability check (DC 10 + spell level). Fail = scroll is wasted.',
  copying: 'Wizards can copy scroll spells into their spellbook (Arcana check DC 10 + spell level, takes 2 hours + 50 gp per level).',
};

export const SCROLL_SPELL_SAVE_DC = [
  { spellLevel: 'Cantrip', saveDC: 13, attackBonus: '+5' },
  { spellLevel: '1st', saveDC: 13, attackBonus: '+5' },
  { spellLevel: '2nd', saveDC: 13, attackBonus: '+5' },
  { spellLevel: '3rd', saveDC: 15, attackBonus: '+7' },
  { spellLevel: '4th', saveDC: 15, attackBonus: '+7' },
  { spellLevel: '5th', saveDC: 17, attackBonus: '+9' },
  { spellLevel: '6th', saveDC: 17, attackBonus: '+9' },
  { spellLevel: '7th', saveDC: 18, attackBonus: '+10' },
  { spellLevel: '8th', saveDC: 18, attackBonus: '+10' },
  { spellLevel: '9th', saveDC: 19, attackBonus: '+11' },
];

export const SCROLL_STRATEGIES = [
  { strategy: 'Stockpile Revivify scrolls', detail: 'Even non-Clerics with Cleric spell list access can use these in emergencies.', priority: 'S' },
  { strategy: 'Emergency Counterspell', detail: 'A scroll of Counterspell on a non-Wizard is a lifesaver against caster bosses.', priority: 'S' },
  { strategy: 'Buff scrolls before combat', detail: 'Use scrolls of Mage Armor, Longstrider, or Aid before long rest to save slots.', priority: 'A' },
  { strategy: 'Wizard copies then uses', detail: 'Wizards should copy scroll spells to their spellbook BEFORE using the scroll.', priority: 'S' },
  { strategy: 'Situational utility scrolls', detail: 'Scrolls of Water Breathing, Tongues, Detect Magic — spells you don\'t prepare daily.', priority: 'A' },
  { strategy: 'Give scrolls to non-casters via Thief Rogue', detail: 'Thief Rogues at level 13 (Use Magic Device) can use scrolls of ANY class.', priority: 'A' },
  { strategy: 'High-level scroll as nuclear option', detail: 'A scroll of Meteor Swarm or Power Word Kill for the final boss.', priority: 'A' },
];

export const SCROLL_CRAFTING = {
  rules: 'Requires spell slot, time, and gold. Must know/have prepared the spell.',
  costs: [
    { level: 'Cantrip', time: '1 day', cost: '15 gp' },
    { level: '1st', time: '1 day', cost: '25 gp' },
    { level: '2nd', time: '3 days', cost: '250 gp' },
    { level: '3rd', time: '1 workweek', cost: '500 gp' },
    { level: '4th', time: '2 workweeks', cost: '2,500 gp' },
    { level: '5th', time: '4 workweeks', cost: '5,000 gp' },
    { level: '6th', time: '8 workweeks', cost: '15,000 gp' },
    { level: '7th', time: '16 workweeks', cost: '25,000 gp' },
    { level: '8th', time: '32 workweeks', cost: '50,000 gp' },
    { level: '9th', time: '48 workweeks', cost: '250,000 gp' },
  ],
  note: 'Crafting high-level scrolls is extremely expensive and time-consuming.',
};

export const WHO_CAN_USE_WHAT = {
  description: 'A character can use a scroll if the spell is on their class spell list.',
  examples: [
    { scroll: 'Fireball scroll', canUse: ['Wizard', 'Sorcerer'], cantUse: ['Cleric', 'Druid', 'Bard (unless Magical Secrets)'] },
    { scroll: 'Cure Wounds scroll', canUse: ['Cleric', 'Druid', 'Bard', 'Paladin', 'Ranger', 'Artificer'], cantUse: ['Wizard', 'Sorcerer', 'Warlock'] },
    { scroll: 'Counterspell scroll', canUse: ['Wizard', 'Sorcerer', 'Warlock'], cantUse: ['Cleric', 'Druid', 'Bard (unless Magical Secrets)'] },
    { scroll: 'Revivify scroll', canUse: ['Cleric', 'Paladin', 'Druid (Wildfire)', 'Artificer'], cantUse: ['Wizard', 'Sorcerer'] },
  ],
  thiefRogue: 'At level 13, Thief Rogues get Use Magic Device: they can use ANY scroll, regardless of class spell list.',
};

export function canUseScroll(className, spellName, spellClassList) {
  return spellClassList.includes(className);
}

export function scrollCheckDC(spellLevel, casterLevel, spellcastingMod) {
  // Check if you need to make an ability check
  const maxCastable = Math.ceil(casterLevel / 2); // Rough approximation
  if (spellLevel <= maxCastable) return { needsCheck: false };
  const dc = 10 + spellLevel;
  const bonus = spellcastingMod;
  return { needsCheck: true, dc, successChance: Math.min(95, Math.max(5, (21 - (dc - bonus)) * 5)) };
}

export function getScrollDC(spellLevel) {
  const entry = SCROLL_SPELL_SAVE_DC.find(s => s.spellLevel === spellLevel || s.spellLevel === `${spellLevel}${spellLevel === 1 ? 'st' : spellLevel === 2 ? 'nd' : spellLevel === 3 ? 'rd' : 'th'}`);
  return entry || { saveDC: 13, attackBonus: '+5' };
}
