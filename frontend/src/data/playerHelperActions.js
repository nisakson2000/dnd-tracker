/**
 * playerHelperActions.js
 * Player Mode: Help action, flanking, and team-based combat actions
 * Pure JS — no React dependencies.
 */

export const HELP_ACTION_RULES = {
  abilityCheck: {
    action: 'Action',
    effect: 'Choose a creature within 5ft. They gain advantage on their next ability check for the task you\'re helping with.',
    requirement: 'You must be proficient in the skill or be able to reasonably assist.',
  },
  attack: {
    action: 'Action',
    effect: 'Distract a creature within 5ft. Next attack roll by an ally against that creature has advantage (before start of your next turn).',
    requirement: 'You must be within 5ft of the target.',
  },
  note: 'Mastermind Rogue can Help as a bonus action at 30ft range.',
};

export const FLANKING_RULES = {
  optionalRule: true,
  requirement: 'You and an ally are on opposite sides of an enemy (draw a line between your centers through the enemy\'s space).',
  benefit: 'Both flanking creatures gain advantage on melee attack rolls against the flanked creature.',
  gridRule: 'On a grid: two allies on directly opposite sides or corners of the target.',
  important: [
    'Only works for melee attacks, not ranged.',
    'The ally must be able to act (not incapacitated).',
    'Flanking is an OPTIONAL rule (DMG p.251) — check with your DM.',
    'Can make advantage too easy to get — some DMs give +2 instead.',
  ],
};

export const TEAM_TACTICS = [
  { name: 'Spellcaster + Fighter Setup', description: 'Fighter grapples/shoves prone, caster gets advantage on spell attacks within 5ft.' },
  { name: 'Rogue + Anyone', description: 'Keep an ally within 5ft of the Rogue\'s target to enable Sneak Attack.' },
  { name: 'Help + Attack', description: 'One character uses Help action, another attacks with advantage.' },
  { name: 'Buff Stacking', description: 'Bless + Bardic Inspiration + Guidance = massive bonuses to rolls.' },
  { name: 'Control + Damage', description: 'One caster controls (Hold Person, Web) while others deal damage with advantage.' },
  { name: 'Healer Positioning', description: 'Healer stays behind frontline with Healing Word range (60ft) to all allies.' },
  { name: 'Ready Action Combo', description: 'Readied actions trigger simultaneously — coordinate burst damage or crowd control.' },
];

export function getHelpActionBenefit(isAttackHelp, hasMastermind) {
  if (isAttackHelp) {
    return { benefit: 'Advantage on next attack against target', range: hasMastermind ? 30 : 5, action: hasMastermind ? 'Bonus Action' : 'Action' };
  }
  return { benefit: 'Advantage on next ability check', range: 5, action: 'Action' };
}
