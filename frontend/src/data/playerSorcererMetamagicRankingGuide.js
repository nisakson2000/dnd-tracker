/**
 * playerSorcererMetamagicRankingGuide.js
 * Player Mode: Sorcerer Metamagic options ranked
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_OPTIONS = [
  {
    name: 'Quickened Spell',
    cost: '2 SP',
    effect: 'Change cast time from 1 action to 1 bonus action.',
    rating: 'S',
    reason: 'Cast a leveled spell as BA + cantrip as action. Or EB as BA + leveled spell as action. Flexibility king.',
    note: 'Remember BA spell rule: if you Quicken a leveled spell, your action is limited to cantrips.',
  },
  {
    name: 'Twinned Spell',
    cost: 'SP = spell level (1 min)',
    effect: 'Target a second creature with a single-target spell.',
    rating: 'S',
    reason: 'Twin Haste = two buffed allies. Twin Polymorph = two Giant Apes. Twin Disintegrate = two dead enemies.',
    note: 'Only works on spells that target exactly one creature and can\'t target a point in space. Check eligibility.',
  },
  {
    name: 'Subtle Spell',
    cost: '1 SP',
    effect: 'No verbal or somatic components. Can\'t be Counterspelled.',
    rating: 'S',
    reason: 'Counterspell-proof casting. Also: cast spells while gagged, bound, or in social situations without detection.',
    note: 'Cheapest Metamagic at 1 SP. Counters Counterspell wars. Social spell shenanigans.',
  },
  {
    name: 'Heightened Spell',
    cost: '3 SP',
    effect: 'One target has disadvantage on first save against the spell.',
    rating: 'A',
    reason: 'Expensive but devastating on save-or-suck spells. Heightened Banishment on BBEG = likely removal.',
    note: '3 SP is expensive. Save for critical moments. Best on single-target save-or-suck.',
  },
  {
    name: 'Empowered Spell',
    cost: '1 SP',
    effect: 'Reroll up to CHA mod damage dice (keep new rolls).',
    rating: 'B+',
    reason: 'Cheap damage boost. Best on multi-die spells (Fireball: reroll up to 5 of 8d6). Can combine with other Metamagic.',
    note: 'Only Metamagic that can stack with another Metamagic on the same spell.',
  },
  {
    name: 'Careful Spell',
    cost: '1 SP',
    effect: 'Chosen creatures (CHA mod) auto-succeed on save against your spell.',
    rating: 'B',
    reason: 'Protect allies from your AoE. Fireball without friendly fire. Sounds great but...',
    note: 'Auto-succeed on save = they still take half damage on spells like Fireball. Best on all-or-nothing spells (Hypnotic Pattern).',
  },
  {
    name: 'Extended Spell',
    cost: '1 SP',
    effect: 'Double spell duration (max 24 hours).',
    rating: 'C',
    reason: 'Most combats end before base duration expires. 2-hour Mage Armor is still 2 hours of one slot. Niche.',
    note: 'Best use: Extended Aid (16 hours) or Extended Death Ward. Very situational.',
  },
  {
    name: 'Distant Spell',
    cost: '1 SP',
    effect: 'Double range. Touch spells become 30ft range.',
    rating: 'C',
    reason: 'Rarely needed. Most spells have sufficient range. Touch → 30ft is nice but niche.',
    note: 'Best on touch spells you don\'t want to deliver in melee (Bestow Curse, Inflict Wounds).',
  },
  {
    name: 'Transmuted Spell',
    cost: '1 SP',
    effect: 'Change damage type to acid, cold, fire, lightning, poison, or thunder.',
    rating: 'C',
    reason: 'Bypass resistance/immunity. Fire→Cold Fireball against fire-immune creatures. Niche but useful.',
    note: 'Good for avoiding common resistances (fire is most resisted element).',
  },
  {
    name: 'Seeking Spell',
    cost: '2 SP',
    effect: 'Reroll a missed spell attack. Must use new roll.',
    rating: 'C',
    reason: 'Spell attacks are less common than save spells for Sorcerers. Expensive for a reroll.',
    note: 'Best on high-level single-target attack spells where missing wastes the slot.',
  },
];

export const METAMAGIC_PICKS_BY_LEVEL = {
  l3: { pick: 'Twinned + Subtle or Quickened', reason: 'Twinned is most impactful early. Subtle prevents Counterspell. Quickened for blasters.' },
  l10: { pick: 'Add Quickened or Heightened', reason: 'Third Metamagic pick. Complete your core toolkit.' },
  l17: { pick: 'Add whatever you\'re missing', reason: 'Fourth pick. Empowered is a good cheap addition.' },
};

export const TWIN_SPELL_TARGETS = [
  { spell: 'Haste', level: 3, cost: '3 SP', value: 'Two allies hasted. One of the best uses of Twinned Spell.' },
  { spell: 'Polymorph', level: 4, cost: '4 SP', value: 'Two Giant Apes. 314 HP of beast power.' },
  { spell: 'Greater Invisibility', level: 4, cost: '4 SP', value: 'Two invisible allies attacking with advantage.' },
  { spell: 'Banishment', level: 4, cost: '4 SP', value: 'Remove two enemies simultaneously.' },
  { spell: 'Disintegrate', level: 6, cost: '6 SP', value: 'Two targets take 10d6+40 force. If reduced to 0, dusted.' },
  { spell: 'Chromatic Orb', level: 1, cost: '1 SP', value: 'Two targets. Choose damage type per target. Cheap.' },
];

export function sorceryPointBudget(sorcererLevel) {
  const points = sorcererLevel;
  const fontSlots = sorcererLevel >= 2 ? Math.floor(sorcererLevel / 2) : 0;
  return { base: points, convertible: fontSlots, note: `${points} SP base. Can convert up to ${fontSlots} extra via Font of Magic.` };
}
