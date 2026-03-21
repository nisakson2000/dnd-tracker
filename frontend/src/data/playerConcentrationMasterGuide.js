/**
 * playerConcentrationMasterGuide.js
 * Player Mode: Protecting concentration — keep your best spells active
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  basic: 'One concentration spell at a time. Casting another ends the first.',
  saveTrigger: 'Take damage → CON save. DC = 10 or half damage taken, whichever is HIGHER.',
  failure: 'Fail the save = spell ends immediately.',
  otherEnds: ['Casting another concentration spell', 'Being incapacitated or killed', 'Voluntary end (no action)'],
};

export const CONCENTRATION_PROTECTION = [
  { method: 'War Caster', detail: 'Advantage on CON saves. DC 10: 55% → 80%.', rating: 'S' },
  { method: 'Resilient (CON)', detail: 'CON save proficiency. Scales with PB. Better at high levels.', rating: 'S' },
  { method: 'CON save proficiency (class)', detail: 'Sorcerer, Fighter, Artificer start with it.', rating: 'S' },
  { method: 'High CON', detail: '14 minimum, 16+ preferred.', rating: 'A' },
  { method: 'Dodge action', detail: 'Attacks have disadvantage → fewer saves needed.', rating: 'A+' },
  { method: 'Shield spell', detail: 'Prevent hits entirely = no concentration save.', rating: 'A+' },
  { method: 'Bladesong (Wizard)', detail: 'Add INT mod to concentration saves.', rating: 'S' },
  { method: 'Stay at range', detail: 'No damage = no saves.', rating: 'A+' },
];

export const WAR_CASTER_VS_RESILIENT = {
  warCaster: { bestAt: 'Levels 1-10', pros: ['Advantage on saves', 'Somatic with full hands', 'OA spells'] },
  resilient: { bestAt: 'Levels 11-20', pros: ['+1 CON', 'Scales with PB', 'ALL CON saves not just concentration'] },
  both: 'Taking both = nearly unbreakable concentration.',
};

export const CONCENTRATION_SAVE_MATH = [
  { dc: 10, base55: '55%', withProf: '70-90%', withAdvantage: '80%', withBoth: '91-99%' },
  { dc: 15, base55: '30%', withProf: '50-70%', withAdvantage: '51%', withBoth: '75-91%' },
  { dc: 20, base55: '10%', withProf: '30-50%', withAdvantage: '19%', withBoth: '51-75%' },
];

export const BEST_CONCENTRATION_SPELLS = [
  { spell: 'Spirit Guardians', protectPriority: 'S', note: 'Losing = massive DPR loss.' },
  { spell: 'Haste', protectPriority: 'S+', note: 'Dropping = ally loses NEXT turn. Worst to lose.' },
  { spell: 'Hypnotic Pattern', protectPriority: 'S', note: 'Losing = all enemies wake.' },
  { spell: 'Wall of Force', protectPriority: 'S', note: 'Losing = enemies rejoin fight.' },
  { spell: 'Polymorph', protectPriority: 'A+', note: 'Losing = ally suddenly low HP.' },
  { spell: 'Bless', protectPriority: 'A', note: 'Important but not devastating to lose.' },
];

export const CONCENTRATION_TIPS = [
  'Cast concentration spells BEFORE entering melee.',
  'If maintaining Haste: DO NOT take risks. Haste dropping is catastrophic.',
  'Dodge protects concentration better than attacking in many cases.',
  'Multiple small hits are worse than one big hit (each hit = separate save).',
  'If you lose concentration early, re-evaluate your spell choice for next fight.',
];
