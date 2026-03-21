/**
 * playerShieldAbsorbDecisionGuide.js
 * Player Mode: Shield vs Absorb Elements — when to use each reaction spell
 * Pure JS — no React dependencies.
 */

export const SHIELD_SPELL = {
  level: 1,
  casting: 'Reaction (when hit by attack or targeted by Magic Missile)',
  effect: '+5 AC until start of next turn',
  duration: '1 round',
  classes: ['Wizard', 'Sorcerer', 'Hexblade Warlock', 'Eldritch Knight', 'Artillerist Artificer'],
  rating: 'S+',
};

export const ABSORB_ELEMENTS = {
  level: 1,
  casting: 'Reaction (when you take acid, cold, fire, lightning, or thunder damage)',
  effect: 'Resistance to triggering damage until start of next turn. Next melee attack deals +1d6 of that type.',
  duration: '1 round',
  classes: ['Wizard', 'Sorcerer', 'Druid', 'Ranger', 'Artificer'],
  rating: 'S',
};

export const DECISION_MATRIX = [
  { situation: 'Melee attack hits you', use: 'Shield', reason: '+5 AC may cause miss. Also protects vs subsequent attacks this round.' },
  { situation: 'Ranged attack hits you', use: 'Shield', reason: 'Same logic. +5 AC for the round.' },
  { situation: 'Dragon breath weapon', use: 'Absorb Elements', reason: 'Elemental damage, not an attack roll. Shield doesn\'t help.' },
  { situation: 'Fireball / AoE spell', use: 'Absorb Elements', reason: 'DEX save damage. Shield only helps attack rolls.' },
  { situation: 'Magic Missile', use: 'Shield', reason: 'Shield specifically blocks ALL Magic Missile darts.' },
  { situation: 'Multi-attack enemy (3+ attacks)', use: 'Shield', reason: '+5 AC for ALL remaining attacks this round.' },
  { situation: 'Single big elemental hit', use: 'Absorb Elements', reason: 'Resistance halves damage. Better than +5 AC on one attack.' },
  { situation: 'Melee caster hit by fire', use: 'Absorb Elements', reason: 'Resistance + extra 1d6 fire on your next melee attack.' },
  { situation: 'Already high AC (25+)', use: 'Absorb Elements', reason: 'Shield to 30 AC may be overkill. Save slots.' },
  { situation: 'Low on spell slots', use: 'Neither (take the hit)', reason: 'Preserve slots for offensive spells. Unless it would drop you.' },
];

export const UPCAST_VALUE = {
  shield: 'No benefit from upcasting. Always use L1 slot.',
  absorbElements: '+1d6 per slot level on next melee hit. L2=2d6, L3=3d6, etc. Worth upcasting for melee builds.',
};

export const REACTION_PRIORITY = [
  { spell: 'Counterspell', priority: 'S+ (vs casters)', note: 'Negate enemy spell entirely. Highest priority vs casters.' },
  { spell: 'Shield', priority: 'S+', note: 'Best defensive reaction. +5 AC for the round.' },
  { spell: 'Absorb Elements', priority: 'S', note: 'Best vs elemental damage. Half damage.' },
  { spell: 'Silvery Barbs', priority: 'S', note: 'Force reroll on enemy hit/save. Give ally advantage.' },
  { spell: 'Hellish Rebuke', priority: 'B+', note: 'Damage on reaction. But doesn\'t prevent damage to you.' },
  { spell: 'Feather Fall', priority: 'S (falling)', note: 'Prevents fall damage. Situational but life-saving.' },
  { spell: 'Opportunity Attack', priority: 'A', note: 'Free melee attack. But can\'t also Shield that round.' },
];

export const SHIELD_ABSORB_TIPS = [
  'Shield: +5 AC lasts until your NEXT TURN. Protects vs ALL attacks that round.',
  'Absorb Elements: resistance to ONE instance of elemental damage.',
  'Shield blocks Magic Missile completely. RAW: all darts miss.',
  'Absorb Elements upcast: +1d6 per slot level. Great for melee gish.',
  'You get ONE reaction per round. Shield OR Absorb OR Counterspell — not all.',
  'Shield at L1 is always enough. Never upcast Shield.',
  'Dragon breath → Absorb Elements. Dragon claw → Shield.',
  'Hexblade: Shield + medium armor + shield = 25+ AC regularly.',
  'Bladesinger: Shield + Bladesong = 26+ AC. Near unhittable.',
  'At high levels: save reaction for Counterspell vs enemy casters.',
];
