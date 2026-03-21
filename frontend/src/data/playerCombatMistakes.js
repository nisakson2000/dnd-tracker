/**
 * playerCombatMistakes.js
 * Player Mode: Common combat mistakes and how to avoid them
 * Pure JS — no React dependencies.
 */

export const COMMON_MISTAKES = [
  {
    mistake: 'Forgetting to add proficiency bonus',
    fix: 'Proficiency applies to: attack rolls with proficient weapons, proficient saves, proficient skill checks, spell attack rolls.',
    severity: 'high',
  },
  {
    mistake: 'Adding modifier to off-hand damage',
    fix: 'Don\'t add ability modifier to off-hand attack damage unless you have the Two-Weapon Fighting style.',
    severity: 'medium',
  },
  {
    mistake: 'Casting bonus action spell + leveled action spell',
    fix: 'If you cast a spell as a bonus action, you can ONLY cast a cantrip with your action (not another leveled spell).',
    severity: 'high',
  },
  {
    mistake: 'Stacking advantage/disadvantage',
    fix: 'Multiple sources of advantage don\'t stack. If you have any advantage AND any disadvantage, they cancel — roll normally.',
    severity: 'medium',
  },
  {
    mistake: 'Moving after opportunity attack',
    fix: 'If you want to move away without provoking, use the Disengage action first.',
    severity: 'medium',
  },
  {
    mistake: 'Concentration on two spells',
    fix: 'You can only concentrate on ONE spell at a time. Casting a new concentration spell ends the previous one.',
    severity: 'high',
  },
  {
    mistake: 'Forgetting concentration saves',
    fix: 'When you take damage while concentrating, make a CON save (DC = 10 or half damage, whichever is higher).',
    severity: 'high',
  },
  {
    mistake: 'Using bonus action as action',
    fix: 'Bonus actions are separate from actions. You can\'t use a bonus action in place of an action or vice versa.',
    severity: 'medium',
  },
  {
    mistake: 'Doubling modifiers on crit',
    fix: 'On a critical hit, double the DAMAGE DICE only. Modifiers (STR/DEX, magic bonus) are NOT doubled.',
    severity: 'medium',
  },
  {
    mistake: 'Temp HP stacking',
    fix: 'Temporary HP doesn\'t stack. If you gain temp HP while you have some, choose which to keep (usually the higher).',
    severity: 'low',
  },
  {
    mistake: 'Forgetting reaction refresh',
    fix: 'Your reaction refreshes at the START of your turn, not the end. You get one per round.',
    severity: 'medium',
  },
  {
    mistake: 'Healing during death saves',
    fix: 'ANY amount of healing on a creature at 0 HP brings them back to consciousness with that many HP.',
    severity: 'high',
  },
];

export function getMistakesBySeverity(severity) {
  return COMMON_MISTAKES.filter(m => m.severity === severity);
}

export function searchMistakes(query) {
  const lc = query.toLowerCase();
  return COMMON_MISTAKES.filter(m =>
    m.mistake.toLowerCase().includes(lc) || m.fix.toLowerCase().includes(lc)
  );
}
