/**
 * playerCombatTactics.js
 * Player Mode: Combat tactics reference, positioning tips, and terrain rules
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// COMMON COMBAT ACTIONS QUICK REFERENCE
// ---------------------------------------------------------------------------

export const QUICK_ACTIONS = [
  { action: 'Attack', cost: 'Action', tip: 'Make weapon attacks (Extra Attack = multiple).' },
  { action: 'Cast a Spell', cost: 'Varies', tip: 'Check casting time. Bonus action spells limit other spells to cantrips.' },
  { action: 'Dash', cost: 'Action', tip: 'Double your movement. Rogues/Monks can do this as a bonus action.' },
  { action: 'Disengage', cost: 'Action', tip: 'No opportunity attacks this turn. Rogue: bonus action.' },
  { action: 'Dodge', cost: 'Action', tip: 'Attacks against you have disadvantage; ADV on DEX saves.' },
  { action: 'Help', cost: 'Action', tip: 'Give an ally advantage on their next check or attack against a target within 5ft.' },
  { action: 'Hide', cost: 'Action', tip: 'Stealth check. If hidden: advantage on next attack, unseen by enemies.' },
  { action: 'Ready', cost: 'Action', tip: 'Set a trigger and reaction. Readied spells use concentration.' },
  { action: 'Search', cost: 'Action', tip: 'Perception or Investigation check to find something.' },
  { action: 'Use an Object', cost: 'Action', tip: 'Interact with a second object (first is free). Includes complex item use.' },
];

// ---------------------------------------------------------------------------
// TERRAIN EFFECTS
// ---------------------------------------------------------------------------

export const TERRAIN_EFFECTS = [
  { terrain: 'Difficult Terrain', effect: 'Movement costs double (2ft per 1ft moved).', examples: ['Rubble', 'Dense forest', 'Steep stairs', 'Snow', 'Shallow water'] },
  { terrain: 'Lightly Obscured', effect: 'Disadvantage on Perception checks that rely on sight.', examples: ['Dim light', 'Patchy fog', 'Moderate foliage'] },
  { terrain: 'Heavily Obscured', effect: 'Effectively blinded in that area.', examples: ['Darkness', 'Dense fog', 'Thick foliage'] },
  { terrain: 'High Ground', effect: 'Optional: +1 to ranged attack rolls (variant rule).', examples: ['Balcony', 'Hilltop', 'Raised platform'] },
  { terrain: 'Water (Shallow)', effect: 'Difficult terrain. Fires can be doused.', examples: ['Streams', 'Puddles', 'Flooded areas'] },
  { terrain: 'Water (Deep)', effect: 'Swimming rules apply. Disadvantage on most attacks.', examples: ['Rivers', 'Lakes', 'Ocean'] },
  { terrain: 'Narrow Space', effect: 'May require squeezing (disadvantage on attacks, DEX saves).', examples: ['Tunnels', 'Crevices', 'Tight corridors'] },
];

// ---------------------------------------------------------------------------
// OPPORTUNITY ATTACK RULES
// ---------------------------------------------------------------------------

export const OPPORTUNITY_ATTACK_RULES = {
  trigger: 'When a hostile creature that you can see moves out of your reach.',
  cost: 'Uses your reaction.',
  rules: [
    'One melee attack only (not Extra Attack).',
    'You can avoid provoking by using the Disengage action.',
    'Teleportation, being shoved, or being knocked back does NOT provoke.',
    'Sentinel feat: on hit, target\'s speed becomes 0.',
    'War Caster feat: cast a spell instead of making a melee attack.',
    'Polearm Master feat: triggers when a creature ENTERS your reach.',
  ],
};

// ---------------------------------------------------------------------------
// FLANKING (OPTIONAL RULE)
// ---------------------------------------------------------------------------

export const FLANKING_RULES = {
  description: 'When two allies are on opposite sides of an enemy, they have advantage on melee attacks against it.',
  requirement: 'Requires a grid/map. Allies must be on opposite sides of the creature.',
  note: 'This is an optional rule (DMG p.251). Check with your DM.',
};

// ---------------------------------------------------------------------------
// POSITIONING TIPS
// ---------------------------------------------------------------------------

export const POSITIONING_TIPS = [
  { role: 'Melee', tips: ['Stay adjacent to priority targets.', 'Use cover when available.', 'Block chokepoints to protect ranged allies.', 'Flank with another melee ally for advantage (if using optional rule).'] },
  { role: 'Ranged', tips: ['Stay at maximum effective range.', 'Use half or three-quarters cover.', 'Avoid being within 5ft of enemies (disadvantage on ranged attacks).', 'Position for clear line of sight to priority targets.'] },
  { role: 'Caster', tips: ['Stay behind frontliners.', 'Consider spell ranges and AoE placement.', 'Avoid clustering with allies (enemy AoE).', 'Keep concentration spells in mind — stay safe.'] },
  { role: 'Support', tips: ['Stay within healing range of frontliners.', 'Position for Healing Word (60ft range, bonus action).', 'Keep escape routes open.', 'Use Help action when out of spell slots.'] },
];
