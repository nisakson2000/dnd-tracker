/**
 * playerCombatReactions.js
 * Player Mode: Reaction options reference — when and how to use them
 * Pure JS — no React dependencies.
 */

export const REACTION_OPTIONS = [
  { name: 'Opportunity Attack', trigger: 'Enemy leaves your reach', classes: ['Everyone'], detail: 'One melee weapon attack. Uses reaction for the round.', tip: 'Don\'t waste on a fleeing minion if a bigger threat is coming.' },
  { name: 'Shield (Spell)', trigger: 'You are hit by an attack or targeted by Magic Missile', classes: ['Wizard', 'Sorcerer', 'Hexblade'], detail: '+5 AC until start of your next turn. 1st-level slot.', tip: 'The best defensive reaction in the game. Always have it prepared.' },
  { name: 'Absorb Elements', trigger: 'You take acid, cold, fire, lightning, or thunder damage', classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'], detail: 'Resistance to that damage type until your next turn. +1d6 on next melee attack.', tip: 'Essential for dragon breath weapons and AoE spells.' },
  { name: 'Counterspell', trigger: 'Enemy within 60ft casts a spell', classes: ['Sorcerer', 'Warlock', 'Wizard'], detail: 'Negate the spell. Auto-success if same level. Otherwise, ability check.', tip: 'Save for high-impact enemy spells. Don\'t waste on cantrips.' },
  { name: 'Silvery Barbs', trigger: 'Creature you can see within 60ft succeeds on an attack/check/save', classes: ['Bard', 'Sorcerer', 'Wizard'], detail: 'Force reroll. Give advantage to an ally on next attack/check/save.', tip: 'Arguably the most powerful 1st-level spell. Use on important saves.' },
  { name: 'Hellish Rebuke', trigger: 'You take damage from a creature', classes: ['Warlock', 'Tiefling'], detail: '2d10 fire damage (DEX save for half).', tip: 'Good for melee Warlocks or when you can\'t Shield.' },
  { name: 'Uncanny Dodge', trigger: 'Attacker you can see hits you', classes: ['Rogue (5th+)'], detail: 'Halve the damage from that attack.', tip: 'Use on the biggest hit. Can\'t use if you already used Shield/Barbs.' },
  { name: 'Sentinel Attack', trigger: 'Enemy attacks an ally within 5ft of you', classes: ['Sentinel feat'], detail: 'Melee attack. If hit, target\'s speed = 0.', tip: 'Incredible for protecting squishies. Locks enemies in place.' },
  { name: 'Cutting Words', trigger: 'Creature makes attack/check/damage within 60ft', classes: ['Lore Bard'], detail: 'Subtract Bardic Inspiration die from the roll.', tip: 'Can turn hits into misses or make enemies fail saves.' },
  { name: 'Deflect Missiles', trigger: 'You are hit by a ranged weapon attack', classes: ['Monk (3rd+)'], detail: 'Reduce damage by 1d10 + DEX + Monk level. If reduced to 0, catch and throw back.', tip: 'Free to use. Can completely negate ranged attacks at higher levels.' },
  { name: 'Feather Fall', trigger: 'You or ally within 60ft falls', classes: ['Bard', 'Sorcerer', 'Wizard'], detail: 'Slow fall to 60ft/round. No damage on landing. Up to 5 creatures.', tip: 'Always have this prepared if you\'re exploring heights or flying.' },
];

export const REACTION_ECONOMY_TIPS = [
  'You only get ONE reaction per round. Choose wisely.',
  'Your reaction refreshes at the START of your next turn.',
  'If you used Shield this round, you can\'t also Counterspell.',
  'Plan your reaction at the START of each round, not when triggered.',
  'Opportunity Attacks vs Shield/Absorb Elements: defensive usually wins.',
  'If you have Sentinel, your OA is more valuable than most reactions.',
  'Counterspell vs Shield: depends on what\'s more threatening — the spell or the attack.',
];

export function getReactionOptions(className, level) {
  return REACTION_OPTIONS.filter(r =>
    r.classes.some(c => c.toLowerCase().includes((className || '').toLowerCase()) || c === 'Everyone')
  );
}

export function suggestReaction(className, incomingType) {
  if (incomingType === 'spell') return 'Counterspell';
  if (incomingType === 'attack') return 'Shield or Uncanny Dodge';
  if (incomingType === 'elemental') return 'Absorb Elements';
  if (incomingType === 'falling') return 'Feather Fall';
  return 'Opportunity Attack';
}
