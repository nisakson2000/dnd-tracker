/**
 * playerReactionManagement.js
 * Player Mode: Managing your one reaction per round — what to save it for and when to use it
 * Pure JS — no React dependencies.
 */

export const REACTION_BASICS = {
  limit: 'ONE reaction per round. Resets at the start of YOUR turn.',
  trigger: 'Reactions have specific triggers. You can only use them when the trigger occurs.',
  timing: 'You choose whether to react AFTER the trigger but BEFORE the result is resolved (usually).',
  note: 'If you use your reaction for an Opportunity Attack, you can\'t Shield. Plan ahead.',
};

export const COMMON_REACTIONS = [
  { reaction: 'Opportunity Attack', trigger: 'Hostile creature leaves your reach', class: 'All', detail: 'Single melee attack. Sentinel stops their movement. War Caster lets you cast a spell instead.' },
  { reaction: 'Shield', trigger: 'You are hit by an attack or targeted by Magic Missile', class: 'Wizard/Sorcerer', detail: '+5 AC until your next turn. Decide AFTER learning you\'re hit. Incredible defensive value.' },
  { reaction: 'Absorb Elements', trigger: 'You take acid, cold, fire, lightning, or thunder damage', class: 'Various casters', detail: 'Resistance to triggering damage + 1d6 extra on next melee attack. Best for melee casters.' },
  { reaction: 'Counterspell', trigger: 'A creature within 60ft casts a spell', class: 'Wizard/Sorcerer/Warlock', detail: 'Auto-counter spells of 3rd level or lower. Higher = ability check (DC 10 + spell level).' },
  { reaction: 'Hellish Rebuke', trigger: 'You are damaged by a creature', class: 'Warlock/Tiefling', detail: '2d10 fire damage (DEX save for half). Scales with slot level. Good early, falls off later.' },
  { reaction: 'Cutting Words', trigger: 'A creature makes an attack/check/damage roll', class: 'Lore Bard', detail: 'Subtract Bardic Inspiration die from the roll. Can turn hits into misses or fails into passes.' },
  { reaction: 'Uncanny Dodge', trigger: 'An attacker you can see hits you', class: 'Rogue', detail: 'Halve the attack\'s damage. No save, no roll — just half. Extremely efficient.' },
  { reaction: 'Deflect Missiles', trigger: 'You are hit by a ranged weapon attack', class: 'Monk', detail: 'Reduce damage by 1d10 + DEX + level. If reduced to 0, catch and throw back (1 ki).' },
  { reaction: 'Sentinel (feat)', trigger: 'Creature attacks an ally within 5ft (or leaves reach)', class: 'Any (feat)', detail: 'OA that reduces speed to 0. Also OA when creature attacks someone else within reach.' },
  { reaction: 'War Caster (feat)', trigger: 'Creature provokes an OA', class: 'Any caster (feat)', detail: 'Cast a spell instead of melee attack as OA. Hold Person, Booming Blade, etc.' },
  { reaction: 'Silvery Barbs', trigger: 'A creature succeeds on an attack/check/save', class: 'Various casters', detail: 'Force reroll, take lower. Grant advantage to an ally. Extremely powerful 1st-level spell.' },
];

export const REACTION_PRIORITY = {
  description: 'When multiple triggers happen in one round, prioritize by impact:',
  tiers: [
    { tier: 'S', reactions: ['Counterspell (vs. devastating spells)', 'Shield (vs. attacks that would drop you)'], reason: 'Preventing catastrophic damage or enemy spells is highest priority.' },
    { tier: 'A', reactions: ['Absorb Elements (vs. big elemental damage)', 'Uncanny Dodge (vs. big hits)', 'Silvery Barbs (vs. key saves)'], reason: 'Major damage reduction or forcing key rerolls.' },
    { tier: 'B', reactions: ['Opportunity Attack (vs. fleeing enemies)', 'Cutting Words (vs. important rolls)', 'Sentinel OA (to lock down enemies)'], reason: 'Tactical advantage but not life-or-death.' },
    { tier: 'C', reactions: ['Hellish Rebuke', 'Deflect Missiles (low damage)', 'OA on unimportant targets'], reason: 'Nice to have but not worth saving your reaction for.' },
  ],
};

export const REACTION_CONFLICTS = [
  { conflict: 'Shield vs Counterspell', resolution: 'If the enemy is casting a devastating spell, Counterspell. If it\'s a regular attack, Shield. Can\'t do both in one round.' },
  { conflict: 'OA vs Shield', resolution: 'Almost always Shield. The +5 AC protects you for the entire round. One OA is rarely worth more.' },
  { conflict: 'Absorb Elements vs Shield', resolution: 'Shield if multiple attacks incoming. Absorb Elements if one big elemental hit (dragon breath, Fireball).' },
  { conflict: 'Counterspell vs Absorb Elements', resolution: 'Counterspell prevents ALL damage. Absorb Elements only halves. Counterspell is usually better if you can succeed.' },
  { conflict: 'Uncanny Dodge vs OA', resolution: 'Uncanny Dodge unless the OA would kill or the fleeing enemy is the biggest threat.' },
];

export const SAVING_YOUR_REACTION = [
  'If you have Shield prepared, consider NOT taking Opportunity Attacks unless the OA is high-value.',
  'Counterspell users should hold their reaction against known casters until late in the round.',
  'Sentinel users may want to save reaction for protecting allies rather than taking OAs on fleeing enemies.',
  'If you have Absorb Elements and the enemy has elemental attacks, save your reaction for defense.',
  'In low-threat rounds, use your reaction freely. In high-threat rounds, save it for defense.',
];

export function shouldUseReaction(reaction, context) {
  const priorities = {
    Shield: context.hpPercent < 0.3 ? 'S' : 'A',
    Counterspell: context.enemySpellLevel >= 5 ? 'S' : context.enemySpellLevel >= 3 ? 'A' : 'B',
    'Absorb Elements': context.incomingDamage > 20 ? 'A' : 'B',
    'Uncanny Dodge': context.incomingDamage > 15 ? 'A' : 'B',
    'Opportunity Attack': context.targetIsKey ? 'A' : 'C',
  };
  return priorities[reaction] || 'B';
}

export function getReactionsForClass(className) {
  const classReactions = {
    Wizard: ['Shield', 'Absorb Elements', 'Counterspell', 'Silvery Barbs', 'Opportunity Attack'],
    Sorcerer: ['Shield', 'Absorb Elements', 'Counterspell', 'Silvery Barbs', 'Opportunity Attack'],
    Warlock: ['Counterspell', 'Hellish Rebuke', 'Opportunity Attack'],
    Rogue: ['Uncanny Dodge', 'Opportunity Attack'],
    Monk: ['Deflect Missiles', 'Opportunity Attack'],
    Fighter: ['Opportunity Attack', 'Riposte (Battle Master)'],
    Paladin: ['Opportunity Attack'],
    Ranger: ['Absorb Elements', 'Opportunity Attack'],
    Bard: ['Cutting Words (Lore)', 'Silvery Barbs', 'Counterspell (Magical Secrets)', 'Opportunity Attack'],
    Cleric: ['Opportunity Attack', 'Warding Flare (Light)'],
    Barbarian: ['Opportunity Attack'],
    Druid: ['Absorb Elements', 'Opportunity Attack'],
  };
  return classReactions[className] || ['Opportunity Attack'];
}
