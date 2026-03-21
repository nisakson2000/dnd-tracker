// ─────────────────────────────────────────────
//  actionEconomy.js — D&D 5e Action Economy
//  Roadmap items 381-388, 357, 35-36
// ─────────────────────────────────────────────

// ── 1. COMBAT ACTIONS (standard actions on your turn) ──

export const COMBAT_ACTIONS = [
  {
    name: 'Attack',
    cost: 'Action',
    description: 'Make one melee or ranged attack.',
    details:
      'You make one attack roll against a target within range. Characters with the Extra Attack feature can make additional attacks as part of this action.',
    replacesAttack: false,
  },
  {
    name: 'Cast a Spell',
    cost: 'Action',
    description: 'Cast a spell with a casting time of 1 action.',
    details:
      'You cast one spell from your spell list that has a casting time of 1 action. Follow all normal spellcasting rules including components and concentration.',
    replacesAttack: false,
  },
  {
    name: 'Dash',
    cost: 'Action',
    description: 'Double your movement for the turn.',
    details:
      'You gain extra movement equal to your speed (after applying modifiers) for the current turn. This stacks with any speed increases.',
    replacesAttack: false,
  },
  {
    name: 'Disengage',
    cost: 'Action',
    description: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.',
    details:
      'For the rest of your turn, your movement does not provoke opportunity attacks from any creature.',
    replacesAttack: false,
  },
  {
    name: 'Dodge',
    cost: 'Action',
    description: 'Attacks against you have disadvantage; you have advantage on DEX saves.',
    details:
      'Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated or if your speed drops to 0.',
    replacesAttack: false,
  },
  {
    name: 'Help',
    cost: 'Action',
    description: 'Give an ally advantage on their next ability check or attack roll.',
    details:
      'You assist an ally with a task, giving them advantage on their next ability check for that task. Alternatively, you can aid a friendly creature in attacking a target within 5 feet of you, giving your ally advantage on their next attack roll against that target.',
    replacesAttack: false,
  },
  {
    name: 'Hide',
    cost: 'Action',
    description: 'Make a Dexterity (Stealth) check to hide.',
    details:
      'You make a Dexterity (Stealth) check in an attempt to become hidden. You must have something to hide behind or be otherwise obscured. If you succeed, you gain the benefits of being an unseen attacker/target until you are discovered or stop hiding.',
    replacesAttack: false,
  },
  {
    name: 'Ready',
    cost: 'Action',
    description: 'Set a trigger and an action to take as a reaction when triggered.',
    details:
      'You specify a perceivable circumstance that will trigger your reaction, and the action you will take in response. When the trigger occurs, you can use your reaction to perform the readied action, or choose to ignore it. See Readied Action Rules for additional constraints on readied spells.',
    replacesAttack: false,
  },
  {
    name: 'Search',
    cost: 'Action',
    description: 'Make a Wisdom (Perception) or Intelligence (Investigation) check.',
    details:
      'You devote your attention to finding something. Depending on the nature of the search, the DM might have you make a Wisdom (Perception) check or an Intelligence (Investigation) check.',
    replacesAttack: false,
  },
  {
    name: 'Use an Object',
    cost: 'Action',
    description: 'Interact with a second object or use an object that requires an action.',
    details:
      'You interact with a second object on your turn (the first object interaction is free) or use an object whose use specifically requires an action, such as drinking a potion, using a healer\'s kit, or activating a magic item.',
    replacesAttack: false,
  },
  {
    name: 'Grapple',
    cost: 'Action',
    description: 'Contest Athletics vs. Athletics/Acrobatics to grab a creature.',
    details:
      'You use the Attack action to make a special melee attack: a grapple. You must have at least one free hand. The target must be no more than one size larger than you. You make a Strength (Athletics) check contested by the target\'s Strength (Athletics) or Dexterity (Acrobatics) check. On success, the target is grappled (speed becomes 0).',
    replacesAttack: true,
  },
  {
    name: 'Shove',
    cost: 'Action',
    description: 'Contest Athletics vs. Athletics/Acrobatics to push 5 ft or knock prone.',
    details:
      'You use the Attack action to make a special melee attack: a shove. The target must be no more than one size larger than you and within reach. You make a Strength (Athletics) check contested by the target\'s Strength (Athletics) or Dexterity (Acrobatics) check. On success, you either push the target 5 feet away or knock it prone.',
    replacesAttack: true,
  },
];

// ── 2. BONUS ACTIONS ──

export const BONUS_ACTIONS = [
  {
    name: 'Off-hand Attack',
    source: 'Two-Weapon Fighting',
    className: null,
    description:
      'When you take the Attack action with a light melee weapon, you can use a bonus action to attack with a different light melee weapon in your other hand. You don\'t add your ability modifier to the damage of the bonus attack unless it is negative.',
  },
  {
    name: 'Cunning Action',
    source: 'Rogue class feature',
    className: 'Rogue',
    description:
      'You can take a bonus action on each of your turns to Dash, Disengage, or Hide.',
  },
  {
    name: 'Bonus Action Spells',
    source: 'Various spells',
    className: null,
    description:
      'Certain spells have a casting time of 1 bonus action, such as Healing Word, Misty Step, Spiritual Weapon, Hex, Hunter\'s Mark, and Shield of Faith.',
    note:
      'If you cast a spell as a bonus action, you cannot cast another spell during the same turn except for a cantrip with a casting time of 1 action.',
  },
  {
    name: 'Rage',
    source: 'Barbarian class feature',
    className: 'Barbarian',
    description:
      'You can enter a rage as a bonus action. While raging, you gain advantages on Strength checks and saves, bonus melee damage, and resistance to bludgeoning, piercing, and slashing damage.',
  },
  {
    name: 'Second Wind',
    source: 'Fighter class feature',
    className: 'Fighter',
    description:
      'You can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
  },
  {
    name: 'Flurry of Blows',
    source: 'Monk class feature',
    className: 'Monk',
    description:
      'Immediately after you take the Attack action, you can spend 1 ki point to make two unarmed strikes as a bonus action.',
  },
  {
    name: 'Patient Defense',
    source: 'Monk class feature',
    className: 'Monk',
    description:
      'You can spend 1 ki point to take the Dodge action as a bonus action on your turn.',
  },
  {
    name: 'Step of the Wind',
    source: 'Monk class feature',
    className: 'Monk',
    description:
      'You can spend 1 ki point to take the Disengage or Dash action as a bonus action, and your jump distance is doubled for the turn.',
  },
  {
    name: 'Metamagic: Quickened Spell',
    source: 'Sorcerer class feature',
    className: 'Sorcerer',
    description:
      'You can spend 2 sorcery points to change a spell\'s casting time from 1 action to 1 bonus action for that casting.',
  },
  {
    name: 'Shield Master Shove',
    source: 'Shield Master feat',
    className: null,
    description:
      'If you take the Attack action on your turn, you can use a bonus action to shove a creature within 5 feet of you with your shield.',
  },
];

export const BONUS_ACTION_SPELL_RULE =
  'If you cast a spell as a bonus action, the only other spell you can cast during the same turn is a cantrip with a casting time of 1 action.';

// ── 3. REACTIONS ──

export const REACTIONS = [
  {
    name: 'Opportunity Attack',
    source: 'Combat Rules',
    className: null,
    trigger: 'An enemy you can see leaves your reach without taking the Disengage action.',
    description:
      'You make one melee attack against the provoking creature. The attack occurs right before the creature leaves your reach.',
  },
  {
    name: 'Counterspell',
    source: 'Spell (3rd level)',
    className: null,
    trigger: 'You see a creature within 60 feet casting a spell.',
    description:
      'You attempt to interrupt a creature in the process of casting a spell. If the spell is 3rd level or lower, it automatically fails. For higher-level spells, make an ability check (DC 10 + spell level).',
  },
  {
    name: 'Shield',
    source: 'Spell (1st level)',
    className: null,
    trigger: 'You are hit by an attack or targeted by magic missile.',
    description:
      'An invisible barrier of magical force grants you +5 to AC (including against the triggering attack) until the start of your next turn.',
  },
  {
    name: 'Absorb Elements',
    source: 'Spell (1st level)',
    className: null,
    trigger: 'You take acid, cold, fire, lightning, or thunder damage.',
    description:
      'You gain resistance to the triggering damage type until the start of your next turn. The first melee attack you make on your next turn deals an extra 1d6 of the triggering type.',
  },
  {
    name: 'Hellish Rebuke',
    source: 'Spell (1st level)',
    className: 'Warlock',
    trigger: 'You are damaged by a creature within 60 feet that you can see.',
    description:
      'The creature that damaged you is momentarily surrounded by hellish flames. It must make a Dexterity saving throw, taking 2d10 fire damage on a failed save or half as much on a success.',
  },
  {
    name: 'Uncanny Dodge',
    source: 'Rogue class feature',
    className: 'Rogue',
    trigger: 'An attacker you can see hits you with an attack.',
    description:
      'You halve the attack\'s damage against you. You must be able to see the attacker.',
  },
  {
    name: 'Cutting Words',
    source: 'Bard (College of Lore) class feature',
    className: 'Bard',
    trigger: 'A creature you can see within 60 feet makes an attack roll, ability check, or damage roll.',
    description:
      'You expend one use of Bardic Inspiration and subtract the number rolled on the Bardic Inspiration die from the creature\'s roll.',
  },
  {
    name: 'Sentinel',
    source: 'Sentinel feat',
    className: null,
    trigger: 'A creature within your reach attacks a target other than you, or a creature leaves your reach.',
    description:
      'When a creature within your reach attacks a target other than you, you can make a melee weapon attack against it. When you hit a creature with an opportunity attack, its speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks even if they take the Disengage action.',
  },
];

// ── 4. FREE ACTIONS ──

export const FREE_ACTIONS = [
  {
    name: 'Interact with One Object',
    description:
      'You can interact with one object for free during your turn, such as drawing or sheathing a weapon, opening a door, picking up a dropped item, or handing an item to another character.',
  },
  {
    name: 'Drop an Item',
    description:
      'You can drop an item you are holding at any time during your turn without using any part of your action.',
  },
  {
    name: 'Drop Concentration',
    description:
      'You can end concentration on a spell at any time, no action required.',
  },
  {
    name: 'Communicate',
    description:
      'You can communicate however you are able through brief utterances and gestures, such as shouting a warning or a battle cry. This is not limited to your turn.',
  },
  {
    name: 'Release a Grapple',
    description:
      'You can release a creature you have grappled at any time, no action required.',
  },
];

// ── 5. READIED ACTION RULES ──

export const READIED_ACTION_RULES = {
  summary: 'You use your Action on your turn to Ready, then spend your Reaction when the trigger occurs.',
  rules: [
    {
      rule: 'Uses your Action',
      description: 'Readying an action consumes your action for the turn.',
    },
    {
      rule: 'Specify a trigger',
      description:
        'You must describe a perceivable circumstance that will trigger your readied response (e.g., "If the goblin steps through the doorway...").',
    },
    {
      rule: 'Uses your Reaction',
      description:
        'When the trigger occurs, you can use your reaction to perform the readied action immediately after the trigger finishes, or choose to ignore it.',
    },
    {
      rule: 'Wasted if not triggered',
      description:
        'If the trigger never occurs before the start of your next turn, the readied action is wasted. You do not get the action back.',
    },
    {
      rule: 'Readied spells require concentration',
      description:
        'If you ready a spell, you must concentrate on it until the trigger occurs. If your concentration is broken, the spell is lost.',
    },
    {
      rule: 'Readied spells consume the spell slot',
      description:
        'A readied spell uses its spell slot at the time of casting (when you Ready), not when the trigger occurs. The slot is consumed even if the spell is never released.',
    },
  ],
};

// ── 6. HELPER FUNCTIONS ──

/**
 * Look up a single combat action by name (case-insensitive).
 * @param {string} name — action name, e.g. "Dodge" or "grapple"
 * @returns {object|undefined}
 */
export function getCombatAction(name) {
  const lower = name.toLowerCase();
  return COMBAT_ACTIONS.find((a) => a.name.toLowerCase() === lower);
}

/**
 * Return bonus actions available to a given class (plus universal ones).
 * Pass null/undefined to get only universal bonus actions.
 * @param {string|null} className — e.g. "Rogue", "Monk"
 * @returns {object[]}
 */
export function getBonusActions(className) {
  if (!className) {
    return BONUS_ACTIONS.filter((b) => b.className === null);
  }
  const lower = className.toLowerCase();
  return BONUS_ACTIONS.filter(
    (b) => b.className === null || b.className.toLowerCase() === lower
  );
}

/**
 * Return reactions available to a given class (plus universal/spell ones).
 * Pass null/undefined to get only universal reactions.
 * @param {string|null} className — e.g. "Rogue", "Bard"
 * @returns {object[]}
 */
export function getReactions(className) {
  if (!className) {
    return REACTIONS.filter((r) => r.className === null);
  }
  const lower = className.toLowerCase();
  return REACTIONS.filter(
    (r) => r.className === null || r.className.toLowerCase() === lower
  );
}

/**
 * Return the readied action rules object.
 * @returns {object}
 */
export function getReadiedActionRules() {
  return READIED_ACTION_RULES;
}
