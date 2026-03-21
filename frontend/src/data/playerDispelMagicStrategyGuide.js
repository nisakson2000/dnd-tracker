/**
 * playerDispelMagicStrategyGuide.js
 * Player Mode: Dispel Magic — rules, checks, boosters, and when to use
 * Pure JS — no React dependencies.
 */

export const DISPEL_RULES = {
  range: '120 feet',
  target: 'One creature, object, or magical effect.',
  autoSuccess: 'If Dispel slot level >= target spell level, auto-end. No check.',
  abilityCheck: 'If target is higher level: ability check using spellcasting mod. DC = 10 + spell level.',
  upcasting: 'Cast at L4 → auto-end L4 or lower. L5 → auto-end L5 or lower. Etc.',
  multipleEffects: 'Only dispels ONE spell per casting. Multiple buffs need multiple Dispels.',
};

export const DISPEL_CHECK_PROBABILITIES = [
  { spellLevel: 4, dc: 14, mod3: '50%', mod5: '60%', mod8: '75%' },
  { spellLevel: 5, dc: 15, mod3: '45%', mod5: '55%', mod8: '70%' },
  { spellLevel: 6, dc: 16, mod3: '40%', mod5: '50%', mod8: '65%' },
  { spellLevel: 7, dc: 17, mod3: '35%', mod5: '45%', mod8: '60%' },
  { spellLevel: 8, dc: 18, mod3: '30%', mod5: '40%', mod8: '55%' },
  { spellLevel: 9, dc: 19, mod3: '25%', mod5: '35%', mod8: '50%' },
];

export const DISPEL_CHECK_BOOSTERS = [
  { source: 'Abjuration Wizard (L10)', bonus: '+PB to check', rating: 'S' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half PB', rating: 'A+' },
  { source: 'Guidance (cast before)', bonus: '+1d4', rating: 'A' },
  { source: 'Flash of Genius (Artificer)', bonus: '+INT as reaction', rating: 'A+' },
  { source: 'Enhance Ability', bonus: 'Advantage (CHA casters)', rating: 'A' },
  { source: 'Upcast the spell', bonus: 'Auto-success at matching level', rating: 'S+' },
];

export const PRIORITY_DISPEL_TARGETS = [
  { target: 'Wall of Force / Forcecage', priority: 'S+', reason: 'These can trap your party with no other escape.' },
  { target: 'Haste (on enemy)', priority: 'S', reason: 'Dispelling Haste causes lethargy — target can\'t act for 1 round.' },
  { target: 'Greater Invisibility', priority: 'S', reason: 'Remove enemy advantage/your disadvantage.' },
  { target: 'Fly (enemy)', priority: 'A+', reason: 'They fall. Falling damage + prone.' },
  { target: 'Polymorph (on ally)', priority: 'A+', reason: 'If ally is polymorphed by enemy, Dispel frees them.' },
  { target: 'Magical darkness / Fog', priority: 'A', reason: 'Restore vision for your party.' },
  { target: 'Summoning spell', priority: 'A', reason: 'Dispel the spell, all summons vanish.' },
];

export const DISPEL_TIPS = [
  'Counterspell stops casting. Dispel Magic ends existing effects. Know which you need.',
  'Dispel only works on SPELLS. Innate abilities, magic items, and supernatural effects are immune.',
  'Always prepare Dispel Magic. It solves problems no other spell can.',
  'When in doubt, upcast to L5-6 for reliable auto-success on most effects.',
  'You can Dispel your own spells too — useful for ending concentration effects you no longer need.',
];
