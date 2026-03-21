/**
 * playerActionTypeReference.js
 * Player Mode: Complete reference for all action types in combat
 * Pure JS — no React dependencies.
 */

export const ACTION_TYPES = [
  {
    type: 'Action',
    description: 'Your main thing each turn. One per turn unless granted extra (Action Surge, Haste).',
    options: [
      { name: 'Attack', detail: 'Make one melee or ranged attack. Extra Attack allows multiple attacks with one Attack action.' },
      { name: 'Cast a Spell', detail: 'Cast a spell with casting time of 1 action. If you cast a bonus action spell, can only cast cantrips with your action.' },
      { name: 'Dash', detail: 'Gain extra movement equal to your speed (after modifiers).' },
      { name: 'Disengage', detail: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.' },
      { name: 'Dodge', detail: 'Attacks against you have disadvantage. Advantage on DEX saves. Until start of next turn.' },
      { name: 'Help', detail: 'Give an ally advantage on their next ability check or attack roll against a target within 5ft of you.' },
      { name: 'Hide', detail: 'Make a Stealth check. Must have cover/concealment. Become unseen.' },
      { name: 'Ready', detail: 'Prepare an action to trigger later as a reaction. Specify trigger and response.' },
      { name: 'Search', detail: 'Make a Perception or Investigation check to find something.' },
      { name: 'Use an Object', detail: 'Interact with an object that requires your action (drinking potion, using magic item, etc.).' },
      { name: 'Grapple', detail: 'Replaces one attack. Athletics vs target\'s Athletics/Acrobatics. Target\'s speed = 0.' },
      { name: 'Shove', detail: 'Replaces one attack. Athletics vs target\'s Athletics/Acrobatics. Push 5ft or knock prone.' },
    ],
  },
  {
    type: 'Bonus Action',
    description: 'One per turn. Only if a feature/spell specifically says "bonus action." Not all characters have one.',
    commonSources: [
      { name: 'Two-Weapon Fighting', detail: 'Attack with off-hand weapon (light, no ability mod to damage unless negative).' },
      { name: 'Cunning Action (Rogue 2)', detail: 'Dash, Disengage, or Hide as bonus action.' },
      { name: 'Rage (Barbarian)', detail: 'Enter rage as a bonus action.' },
      { name: 'Spiritual Weapon', detail: 'Make a melee spell attack with the weapon (bonus action after casting).' },
      { name: 'Healing Word', detail: 'Heal a creature within 60ft. 1d4 + mod. THE bonus action heal.' },
      { name: 'Misty Step', detail: 'Teleport 30ft to unoccupied space you can see.' },
      { name: 'Hex/Hunter\'s Mark', detail: 'Cast or move the mark to a new target.' },
      { name: 'Shield Master', detail: 'Shove a creature with your shield after taking Attack action.' },
      { name: 'Step of the Wind (Monk)', detail: 'Dash or Disengage as bonus action (costs 1 ki).' },
      { name: 'Patient Defense (Monk)', detail: 'Dodge as bonus action (costs 1 ki).' },
    ],
    important: 'If you cast a spell as a bonus action, you can only cast a CANTRIP with your action (not another leveled spell).',
  },
  {
    type: 'Reaction',
    description: 'One per round (not per turn). Triggers on specific events. Refreshes at the start of your turn.',
    commonSources: [
      { name: 'Opportunity Attack', detail: 'When a hostile creature moves out of your reach. One melee attack.' },
      { name: 'Shield (spell)', detail: '+5 AC until start of your next turn. Trigger: you\'re hit by an attack or targeted by Magic Missile.' },
      { name: 'Counterspell', detail: 'Counter a spell being cast within 60ft. Auto-counter if spell level ≤ your slot level.' },
      { name: 'Absorb Elements', detail: 'Trigger: you take elemental damage. Gain resistance to that damage type. Next melee attack deals extra.' },
      { name: 'Hellish Rebuke', detail: 'Trigger: you take damage. Deal 2d10 fire to the attacker. DEX save for half.' },
      { name: 'Feather Fall', detail: 'Trigger: you or someone within 60ft falls. Up to 5 creatures fall slowly, no damage.' },
      { name: 'Uncanny Dodge (Rogue 5)', detail: 'Trigger: attacker you can see hits you. Halve the attack\'s damage.' },
    ],
    important: 'You only get ONE reaction per round. Shield OR Counterspell OR OA — choose wisely.',
  },
  {
    type: 'Movement',
    description: 'Not an action. You have movement equal to your speed. Can split it before/after/between actions.',
    rules: [
      'Can split movement: move 15ft, attack, move 15ft',
      'Difficult terrain costs 2x movement (2ft per 1ft)',
      'Standing from prone costs half your movement speed',
      'Climbing/swimming costs 2x movement (unless you have a climb/swim speed)',
      'Crawling while prone costs 2x movement',
      'Jumping: long jump = STR score in feet (running start), half without',
    ],
  },
  {
    type: 'Free Action',
    description: 'Things you can do without using action, bonus action, or movement.',
    examples: [
      'Speaking (brief phrases, not speeches)',
      'Dropping an item or weapon',
      'Dropping concentration on a spell',
      'One free object interaction per turn (draw weapon, open door, etc.)',
    ],
  },
];

export const ACTION_ECONOMY_TIPS = [
  'Use ALL your actions every turn: action + bonus action + reaction + movement + free interaction.',
  'An unused bonus action is wasted potential. Find class features or spells that use it.',
  'Your reaction is often your most impactful resource. Shield, Counterspell, and Uncanny Dodge can save lives.',
  'Movement is free damage avoidance. Reposition for cover, flanking, or AoE avoidance.',
  'Don\'t forget your free object interaction. Draw a weapon, open a door, pick up a dropped item.',
];

export function getActionType(actionName) {
  for (const type of ACTION_TYPES) {
    const found = (type.options || type.commonSources || []).find(a =>
      a.name.toLowerCase().includes((actionName || '').toLowerCase())
    );
    if (found) return { ...found, actionType: type.type };
  }
  return null;
}

export function getActionsForType(typeName) {
  const type = ACTION_TYPES.find(t => t.type.toLowerCase() === (typeName || '').toLowerCase());
  return type ? (type.options || type.commonSources || type.examples || []) : [];
}
