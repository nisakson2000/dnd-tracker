/**
 * playerScrollScribingGuide.js
 * Player Mode: Spell scroll scribing — costs, rules, and optimization
 * Pure JS — no React dependencies.
 */

export const SCROLL_SCRIBING_RULES = {
  requirement: 'Must have the spell prepared (or on your spell list for some DMs).',
  proficiency: 'Arcana proficiency required.',
  consumed: 'The spell slot is NOT consumed — but scribing takes time and gold.',
  note: 'Scrolls let you cast spells without using slots. Stockpile during downtime.',
};

export const SCROLL_COSTS = [
  { level: 'Cantrip', cost: '15 gp', time: '1 day', saveDC: 13, attackBonus: 5 },
  { level: '1st', cost: '25 gp', time: '1 day', saveDC: 13, attackBonus: 5 },
  { level: '2nd', cost: '250 gp', time: '3 days', saveDC: 13, attackBonus: 5 },
  { level: '3rd', cost: '500 gp', time: '1 workweek', saveDC: 15, attackBonus: 7 },
  { level: '4th', cost: '2,500 gp', time: '2 workweeks', saveDC: 15, attackBonus: 7 },
  { level: '5th', cost: '5,000 gp', time: '4 workweeks', saveDC: 17, attackBonus: 9 },
  { level: '6th', cost: '15,000 gp', time: '8 workweeks', saveDC: 17, attackBonus: 9 },
  { level: '7th', cost: '25,000 gp', time: '16 workweeks', saveDC: 18, attackBonus: 10 },
  { level: '8th', cost: '50,000 gp', time: '32 workweeks', saveDC: 18, attackBonus: 10 },
  { level: '9th', cost: '250,000 gp', time: '48 workweeks', saveDC: 19, attackBonus: 11 },
];

export const BEST_SCROLLS_TO_SCRIBE = [
  { spell: 'Revivify (L3)', priority: 'S+', reason: 'Emergency resurrection. Always have one. 500 gp scroll + 300 gp diamond.' },
  { spell: 'Counterspell (L3)', priority: 'S', reason: 'Extra counterspell when you\'ve used your slots. Critical in caster fights.' },
  { spell: 'Fireball (L3)', priority: 'A+', reason: 'Reliable AoE damage. Extra Fireball never hurts.' },
  { spell: 'Dispel Magic (L3)', priority: 'A+', reason: 'Utility you always want available. Remove effects without slot cost.' },
  { spell: 'Shield (L1)', priority: 'S', reason: 'Extra emergency AC boost. 25 gp for +5 AC is incredible value.' },
  { spell: 'Healing Word (L1)', priority: 'A+', reason: 'Extra emergency healing. Anyone with the spell on their list can use it.' },
  { spell: 'Find Familiar (L1)', priority: 'A', reason: 'Ritual castable anyway, but scroll lets non-ritual casters use it.' },
  { spell: 'Greater Restoration (L5)', priority: 'S', reason: 'Removes nasty conditions. Expensive to scribe but worth having.' },
  { spell: 'Teleportation Circle (L5)', priority: 'A', reason: 'Emergency escape or travel. Expensive but potentially campaign-saving.' },
];

export const SCROLL_USAGE_RULES = {
  canUse: 'If the spell is on your class\'s spell list, you can use the scroll normally.',
  higherLevel: 'If the scroll is higher level than you can cast, make an Arcana check (DC 10 + spell level). Fail = scroll destroyed.',
  notOnList: 'RAW: can\'t use scrolls for spells not on your class list. Some DMs allow Arcana checks.',
  concentration: 'Scrolls that require concentration still require your concentration.',
  castingTime: 'Same casting time as the spell. Can\'t use a scroll of a 1-minute spell as an action.',
};

export const SCROLL_TIPS = [
  'Wizard: copy scrolls into your spellbook (cost: 2 hours + 50 gp per spell level). Huge for expanding spells known.',
  'Scribe emergency scrolls during downtime: Revivify, Counterspell, Shield.',
  'Low-level scrolls (L1-2) are cheap. Stockpile Shield, Healing Word, Absorb Elements.',
  'Artificer Spell-Storing Item (L11): 2× INT mod uses of a L1-2 spell. Better than scrolls for spammable spells.',
  'Non-casters can attempt to use scrolls with DM permission (Thief Rogue L13: Use Magic Device).',
  'Scroll of Protection (different from spell scrolls): consumable, provides circle of protection vs creature type.',
];
