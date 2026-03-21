/**
 * playerSpellScrollCraftGuide.js
 * Player Mode: Spell scrolls — crafting, using, rules, and costs
 * Pure JS — no React dependencies.
 */

export const SPELL_SCROLL_RULES = {
  using: 'If the spell is on your class list, you can cast it from the scroll. No components needed.',
  higherLevel: 'If the spell is higher than you can normally cast: ability check DC 10 + spell level. Fail = scroll wasted.',
  consumable: 'The scroll is consumed when used. One-time use.',
  saveDC: 'Scroll uses a fixed save DC and attack bonus (see table).',
  note: 'Anyone can try to use a scroll, but only if the spell is on their class list.',
};

export const SCROLL_STATS = [
  { level: 'Cantrip', saveDC: 13, attackBonus: 5, cost: '15 gp', craftTime: '1 day' },
  { level: '1st', saveDC: 13, attackBonus: 5, cost: '25 gp', craftTime: '1 day' },
  { level: '2nd', saveDC: 13, attackBonus: 5, cost: '250 gp', craftTime: '3 days' },
  { level: '3rd', saveDC: 15, attackBonus: 7, cost: '500 gp', craftTime: '1 workweek' },
  { level: '4th', saveDC: 15, attackBonus: 7, cost: '2,500 gp', craftTime: '2 workweeks' },
  { level: '5th', saveDC: 17, attackBonus: 9, cost: '5,000 gp', craftTime: '4 workweeks' },
  { level: '6th', saveDC: 17, attackBonus: 9, cost: '15,000 gp', craftTime: '8 workweeks' },
  { level: '7th', saveDC: 18, attackBonus: 10, cost: '25,000 gp', craftTime: '16 workweeks' },
  { level: '8th', saveDC: 18, attackBonus: 10, cost: '50,000 gp', craftTime: '32 workweeks' },
  { level: '9th', saveDC: 19, attackBonus: 11, cost: '250,000 gp', craftTime: '48 workweeks' },
];

export const BEST_SCROLLS_TO_BUY = [
  { scroll: 'Revivify', level: 3, cost: '~500 gp', why: 'Emergency resurrection. Carry one at all times.', rating: 'S+' },
  { scroll: 'Greater Restoration', level: 5, cost: '~5,000 gp', why: 'Remove exhaustion, petrification, curses.', rating: 'S' },
  { scroll: 'Counterspell', level: 3, cost: '~500 gp', why: 'Emergency spell negation. Give to non-casters on class list.', rating: 'S' },
  { scroll: 'Shield', level: 1, cost: '~25 gp', why: 'Pre-load for emergency AC boost. Cheap.', rating: 'A+' },
  { scroll: 'Dispel Magic', level: 3, cost: '~500 gp', why: 'Remove magical effects. Always useful.', rating: 'A+' },
  { scroll: 'Remove Curse', level: 3, cost: '~500 gp', why: 'Break curses. Carry just in case.', rating: 'A' },
  { scroll: 'Teleport', level: 7, cost: '~25,000 gp', why: 'Emergency extraction for the whole party.', rating: 'S' },
  { scroll: 'Raise Dead', level: 5, cost: '~5,000 gp', why: 'Backup resurrection if Revivify window passes.', rating: 'A+' },
];

export const WIZARD_SCROLL_COPYING = {
  rule: 'Wizard can copy a spell scroll into their spellbook.',
  cost: '50 gp + 2 hours per spell level.',
  check: 'Arcana check DC 10 + spell level. Fail = scroll destroyed.',
  tip: 'ALWAYS copy spells into your book. Scrolls are one-time; book is permanent.',
  savings: 'Copying from scroll is same cost as from another spellbook.',
};

export const SCROLL_CRAFTING_RULES = {
  requirements: [
    'Must know the spell (prepared or known).',
    'Must have the spell slot available (consumed in crafting).',
    'Must spend time and gold (see table).',
    'Proficiency in Arcana recommended.',
  ],
  xanathars: 'Xanathar\'s rules: cost and time per level. Needs materials.',
  artificer: 'Artificers can craft scrolls at reduced cost with infusions.',
  downtime: 'Best done during downtime between adventures.',
};

export const SCROLL_TIPS = [
  'Revivify scroll: always carry one. Emergency resurrection for 500gp.',
  'Wizards: copy scrolls into your spellbook. Permanent > one-time.',
  'Shield scroll: 25gp for +5 AC reaction. Cheapest protection.',
  'Higher-level scroll: DC 10 + spell level to use. Can fail.',
  'Scrolls don\'t need components. Free Revivify (no diamond).',
  'Buy Counterspell scrolls for party members with it on their list.',
  'Crafting scrolls: best during downtime. Expensive at high levels.',
  'Scroll save DC is fixed (13-19). May be lower than your normal DC.',
  'Give scrolls to allies who have the spell on their class list.',
  'L1 scrolls (25gp): cheap enough to stock up. Shield, Absorb Elements.',
];
