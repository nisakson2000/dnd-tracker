/**
 * playerCombatPositioning.js
 * Player Mode: Positioning tips, flanking rules, and tactical advice
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// POSITIONING TIPS BY ROLE
// ---------------------------------------------------------------------------

export const POSITIONING_TIPS = {
  frontline: {
    role: 'Frontline (Fighter, Paladin, Barbarian)',
    color: '#ef4444',
    tips: [
      'Stay between enemies and your squishy allies.',
      'Use chokepoints to limit the number of enemies that can reach you.',
      'If you have Sentinel, position to protect the backline.',
      'Keep within 5ft of enemies to threaten opportunity attacks.',
      'Consider using Dodge action if heavily outnumbered.',
    ],
  },
  skirmisher: {
    role: 'Skirmisher (Rogue, Monk, Ranger)',
    color: '#fbbf24',
    tips: [
      'Stay mobile — attack and reposition each turn.',
      'Use Cunning Action to Disengage after melee attacks.',
      'Flank with frontline allies for Sneak Attack.',
      'Use cover between attacks for ranged rogues.',
      'Target isolated enemies rather than charging into groups.',
    ],
  },
  caster: {
    role: 'Caster (Wizard, Sorcerer, Warlock)',
    color: '#a78bfa',
    tips: [
      'Stay at maximum spell range — avoid melee.',
      'Use allies as shields between you and enemies.',
      'Position for AoE spells that avoid allies.',
      'Have an escape plan (Misty Step, Dimension Door).',
      'Stay near cover to duck behind after casting.',
    ],
  },
  support: {
    role: 'Support (Cleric, Bard, Druid)',
    color: '#4ade80',
    tips: [
      'Stay in healing range of frontline but out of melee.',
      'Healing Word has 60ft range — use it from safety.',
      'Position for Spirit Guardians to hit multiple enemies.',
      'Keep line of sight to all allies for buffs.',
      'Don\'t cluster with other casters (AoE vulnerability).',
    ],
  },
};

// ---------------------------------------------------------------------------
// FLANKING RULES (Optional Rule)
// ---------------------------------------------------------------------------

export const FLANKING_RULES = {
  enabled: false, // DM optional rule
  description: 'When two allies are on opposite sides of an enemy, they both get advantage on melee attacks against that creature.',
  requirements: [
    'Both flanking creatures must be able to see the target.',
    'Both must be within 5 feet of the target.',
    'Both must be on opposite sides (draw a line between their centers through the target).',
    'The target must be Medium or smaller (or the flankers must be Large enough).',
  ],
  benefit: 'Advantage on melee attack rolls against the flanked creature.',
};

// ---------------------------------------------------------------------------
// OPPORTUNITY ATTACK RULES
// ---------------------------------------------------------------------------

export const OPPORTUNITY_ATTACK_RULES = {
  trigger: 'When a hostile creature you can see moves out of your reach.',
  action: 'Use your reaction to make one melee attack against the creature.',
  avoid: [
    'Disengage action prevents OAs for the rest of the turn.',
    'Teleportation doesn\'t provoke OAs.',
    'Being moved involuntarily (pushed/pulled) doesn\'t provoke.',
    'Forced movement (grapple drag) doesn\'t provoke from the mover.',
  ],
  modifiers: [
    { feat: 'Sentinel', effect: 'On hit, target\'s speed becomes 0. Can OA even if they Disengage.' },
    { feat: 'Polearm Master', effect: 'OA when a creature enters your reach (not just leaves).' },
    { feat: 'War Caster', effect: 'Cast a spell instead of a melee attack for the OA.' },
  ],
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get positioning tips for a class.
 */
export function getPositioningTips(className) {
  const lc = (className || '').toLowerCase();
  if (lc.includes('fighter') || lc.includes('paladin') || lc.includes('barbarian')) return POSITIONING_TIPS.frontline;
  if (lc.includes('rogue') || lc.includes('monk') || lc.includes('ranger')) return POSITIONING_TIPS.skirmisher;
  if (lc.includes('wizard') || lc.includes('sorcerer') || lc.includes('warlock')) return POSITIONING_TIPS.caster;
  if (lc.includes('cleric') || lc.includes('bard') || lc.includes('druid')) return POSITIONING_TIPS.support;
  return POSITIONING_TIPS.frontline; // default
}
