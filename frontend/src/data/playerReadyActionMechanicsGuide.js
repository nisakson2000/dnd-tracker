/**
 * playerReadyActionMechanicsGuide.js
 * Player Mode: Ready action — hold for perfect timing
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  cost: 'Your action this turn.',
  trigger: 'Specify a perceivable circumstance that triggers your reaction.',
  reaction: 'When trigger occurs, use your reaction for the readied action.',
  spellRules: 'Readied spells: cast on your turn (slot spent), hold concentration until trigger. Wasted if trigger never happens.',
  keyRules: [
    'Must specify trigger when you Ready.',
    'Uses your reaction when triggered.',
    'Can only Ready an action, not BA or movement.',
    'Readied spells require concentration until triggered.',
  ],
};

export const READY_ACTION_USES = [
  { use: 'Rogue SA on other turns', detail: 'Ready attack for enemy\'s turn = SA again (different turn).', rating: 'S' },
  { use: 'Wait for positioning', detail: '"I attack when the enemy rounds the corner."', rating: 'A' },
  { use: 'Counterspell timing', detail: 'Ready Counterspell for when enemy casts.', rating: 'A' },
  { use: 'Coordinate with party', detail: '"I attack when Fighter knocks them prone." Free advantage.', rating: 'A' },
  { use: 'Guard chokepoint', detail: '"I attack the first enemy through the door."', rating: 'B' },
];

export const READY_ACTION_DOWNSIDES = [
  'Uses reaction: no Shield, Counterspell, or OA.',
  'Lose Extra Attack: Ready gives ONE attack, not Attack action.',
  'Readied spells waste slots if trigger doesn\'t happen.',
  'Readied spells use concentration (drops existing concentration).',
  'No Delay action in 5e RAW. Ready is the replacement.',
];

export const CLEVER_TRIGGERS = [
  '"I attack when the enemy moves within reach."',
  '"I cast Healing Word when an ally drops to 0 HP."',
  '"I push the lever when my ally says now."',
  '"I attack when the Wall of Force drops."',
  '"I Dash toward the exit when the door opens."',
];
