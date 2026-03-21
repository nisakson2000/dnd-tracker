/**
 * playerConcentrationSaveGuide.js
 * Player Mode: Protecting concentration — methods, math, and priorities
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  save: 'CON save. DC = 10 or half damage taken (higher).',
  oneSpell: 'Only ONE concentration spell at a time.',
  breaks: ['Taking damage', 'Incapacitated/killed', 'Starting new concentration spell'],
};

export const CONCENTRATION_BOOSTERS = [
  { method: 'War Caster', effect: 'Advantage on saves.', rating: 'S+ (before L9)' },
  { method: 'Resilient (CON)', effect: '+PB to CON saves.', rating: 'S+ (after L9)' },
  { method: 'Mind Sharpener', effect: 'Auto-succeed 4/LR.', rating: 'S+ (Artificer infusion)' },
  { method: 'Bladesong', effect: '+INT to saves.', rating: 'S+ (Bladesinger)' },
  { method: 'Aura of Protection', effect: '+CHA to all saves in 10ft.', rating: 'S+ (Paladin)' },
  { method: 'Eldritch Mind', effect: 'Advantage (Warlock invocation).', rating: 'S' },
  { method: 'High CON (14-16+)', effect: '+2 to +3 to all CON saves.', rating: 'A+' },
];

export const CRITICAL_CONCENTRATION_SPELLS = [
  { spell: 'Haste', risk: 'Target loses their NEXT TURN if broken. Devastating.', priority: 'S+' },
  { spell: 'Spirit Guardians', risk: 'Damage aura gone. Major DPR loss.', priority: 'S+' },
  { spell: 'Wall of Force', risk: 'Wall drops. Trapped enemies freed.', priority: 'S+' },
  { spell: 'Polymorph', risk: 'Target reverts to original form.', priority: 'S' },
  { spell: 'Banishment', risk: 'Banished creatures return.', priority: 'S' },
  { spell: 'Conjure Animals', risk: 'All summons disappear.', priority: 'S' },
];

export const CONCENTRATION_TIPS = [
  'War Caster before L9, Resilient (CON) after L9.',
  'Mind Sharpener: 4 auto-passes. Best infusion for casters.',
  'Haste: losing concentration = ally loses a turn. Protect it.',
  'Stay out of damage range. Can\'t fail saves you don\'t need to make.',
  'Don\'t dump CON. Every point matters.',
  'Only one concentration spell at a time.',
  'Shield + high AC: avoid damage = protect concentration.',
];
