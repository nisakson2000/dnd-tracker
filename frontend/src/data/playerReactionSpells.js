/**
 * playerReactionSpells.js
 * Player Mode: Reaction spells and abilities reference
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// REACTION SPELLS
// ---------------------------------------------------------------------------

export const REACTION_SPELLS = [
  {
    name: 'Shield',
    level: 1,
    trigger: 'You are hit by an attack or targeted by Magic Missile.',
    effect: '+5 AC until start of your next turn (including vs triggering attack).',
    classes: ['Wizard', 'Sorcerer'],
    priority: 'high',
  },
  {
    name: 'Absorb Elements',
    level: 1,
    trigger: 'You take acid, cold, fire, lightning, or thunder damage.',
    effect: 'Resistance to triggering damage type until start of next turn. Next melee attack deals +1d6 of that type.',
    classes: ['Druid', 'Ranger', 'Sorcerer', 'Wizard'],
    priority: 'high',
  },
  {
    name: 'Counterspell',
    level: 3,
    trigger: 'A creature within 60ft casts a spell.',
    effect: 'Spell of 3rd level or lower fails automatically. Higher: ability check DC 10 + spell level.',
    classes: ['Sorcerer', 'Warlock', 'Wizard'],
    priority: 'high',
  },
  {
    name: 'Hellish Rebuke',
    level: 1,
    trigger: 'You are damaged by a creature within 60ft.',
    effect: '2d10 fire damage (DEX save for half).',
    classes: ['Warlock'],
    priority: 'medium',
  },
  {
    name: 'Feather Fall',
    level: 1,
    trigger: 'You or a creature within 60ft falls.',
    effect: 'Up to 5 creatures fall at 60ft/round, take no falling damage.',
    classes: ['Bard', 'Sorcerer', 'Wizard'],
    priority: 'situational',
  },
  {
    name: 'Silvery Barbs',
    level: 1,
    trigger: 'A creature within 60ft succeeds on an attack, ability check, or saving throw.',
    effect: 'Force reroll, must use lower result. You or an ally gains advantage on next attack/check/save.',
    classes: ['Bard', 'Sorcerer', 'Wizard'],
    priority: 'high',
  },
  {
    name: 'Dispel Magic (Reaction variant)',
    level: 3,
    trigger: 'Varies by DM (some allow reaction)',
    effect: 'End one spell of 3rd level or lower. Higher: ability check.',
    classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'],
    priority: 'situational',
  },
];

// ---------------------------------------------------------------------------
// REACTION ABILITIES (NON-SPELL)
// ---------------------------------------------------------------------------

export const REACTION_ABILITIES = [
  { name: 'Opportunity Attack', source: 'All melee', trigger: 'Hostile creature leaves your reach.', effect: 'One melee attack.' },
  { name: 'Uncanny Dodge', source: 'Rogue 5', trigger: 'Attacker you can see hits you.', effect: 'Half the attack\'s damage.' },
  { name: 'Deflect Missiles', source: 'Monk 3', trigger: 'Hit by a ranged weapon attack.', effect: 'Reduce damage by 1d10 + DEX + monk level. If reduced to 0, can catch and throw back.' },
  { name: 'Parry', source: 'Battle Master', trigger: 'Hit by a melee attack.', effect: 'Reduce damage by superiority die + DEX mod.' },
  { name: 'Riposte', source: 'Battle Master', trigger: 'A creature misses you with a melee attack.', effect: 'Make a melee attack + superiority die damage.' },
  { name: 'Sentinel Attack', source: 'Sentinel feat', trigger: 'A creature attacks an ally within 5ft.', effect: 'Make a melee attack against the attacker.' },
  { name: 'Protection', source: 'Fighting Style', trigger: 'An ally within 5ft is attacked.', effect: 'Impose disadvantage on the attack roll (requires shield).' },
  { name: 'Interception', source: 'Fighting Style', trigger: 'An ally within 5ft is hit.', effect: 'Reduce damage by 1d10 + proficiency bonus.' },
  { name: 'Warding Flare', source: 'Light Domain Cleric 1', trigger: 'Creature within 30ft attacks you or an ally.', effect: 'Impose disadvantage on the attack roll.' },
  { name: 'Cutting Words', source: 'Bard (Lore) 3', trigger: 'Creature makes attack roll, ability check, or damage roll.', effect: 'Subtract Bardic Inspiration die from the roll.' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get reaction spells for a class.
 */
export function getReactionSpells(className) {
  return REACTION_SPELLS.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

/**
 * Get high-priority reaction options.
 */
export function getHighPriorityReactions(className) {
  return REACTION_SPELLS.filter(s =>
    s.priority === 'high' && s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

/**
 * Get all reaction options for a character.
 */
export function getAllReactionOptions(className, classFeatures = []) {
  const spells = getReactionSpells(className);
  const abilities = REACTION_ABILITIES.filter(a =>
    classFeatures.some(f => f.toLowerCase().includes(a.name.toLowerCase().split(' ')[0]))
    || a.source === 'All melee'
  );
  return { spells, abilities };
}
