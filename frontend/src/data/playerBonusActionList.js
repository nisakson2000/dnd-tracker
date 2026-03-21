/**
 * playerBonusActionList.js
 * Player Mode: Common bonus actions by class and feature
 * Pure JS — no React dependencies.
 */

export const COMMON_BONUS_ACTIONS = [
  // Universal
  { name: 'Off-Hand Attack', source: 'Two-Weapon Fighting', classes: ['Any'], description: 'Attack with off-hand weapon (Light property required).' },

  // Barbarian
  { name: 'Rage', source: 'Rage', classes: ['Barbarian'], description: 'Enter rage. Bonus damage, resistance, advantage on STR.' },

  // Bard
  { name: 'Bardic Inspiration', source: 'Bardic Inspiration', classes: ['Bard'], description: 'Grant inspiration die to ally within 60ft.' },

  // Cleric
  { name: 'Spiritual Weapon Attack', source: 'Spiritual Weapon (2nd)', classes: ['Cleric'], description: 'Move and attack with spiritual weapon.' },

  // Druid
  { name: 'Wild Shape', source: 'Wild Shape', classes: ['Druid'], description: 'Transform into a beast form.' },

  // Fighter
  { name: 'Second Wind', source: 'Second Wind', classes: ['Fighter'], description: 'Heal 1d10 + fighter level.' },

  // Monk
  { name: 'Flurry of Blows', source: 'Ki (1 point)', classes: ['Monk'], description: 'Two unarmed strikes after Attack action.' },
  { name: 'Patient Defense', source: 'Ki (1 point)', classes: ['Monk'], description: 'Take the Dodge action.' },
  { name: 'Step of the Wind', source: 'Ki (1 point)', classes: ['Monk'], description: 'Disengage or Dash, jump distance doubled.' },
  { name: 'Martial Arts Attack', source: 'Martial Arts', classes: ['Monk'], description: 'One unarmed strike after Attack action (free, no ki cost).' },

  // Paladin
  { name: 'Divine Smite (declaration)', source: 'Divine Smite', classes: ['Paladin'], description: 'Declared on hit, not a separate bonus action. Noted here for tracking.' },

  // Ranger
  { name: 'Hunter\'s Mark (cast)', source: 'Hunter\'s Mark (1st)', classes: ['Ranger'], description: 'Mark a target for +1d6 on weapon hits.' },
  { name: 'Hunter\'s Mark (move)', source: 'Hunter\'s Mark', classes: ['Ranger'], description: 'Move mark to new target when current target drops to 0.' },

  // Rogue
  { name: 'Cunning Action: Dash', source: 'Cunning Action', classes: ['Rogue'], description: 'Take the Dash action.' },
  { name: 'Cunning Action: Disengage', source: 'Cunning Action', classes: ['Rogue'], description: 'Take the Disengage action.' },
  { name: 'Cunning Action: Hide', source: 'Cunning Action', classes: ['Rogue'], description: 'Take the Hide action (Stealth check).' },

  // Sorcerer
  { name: 'Quickened Spell', source: 'Metamagic (2 SP)', classes: ['Sorcerer'], description: 'Cast a spell that normally takes 1 action.' },

  // Warlock
  { name: 'Hex (cast)', source: 'Hex (1st)', classes: ['Warlock'], description: 'Curse target for +1d6 necrotic on hits.' },
  { name: 'Hex (move)', source: 'Hex', classes: ['Warlock'], description: 'Move curse to new target when current target drops to 0.' },

  // Spells (various classes)
  { name: 'Healing Word', source: 'Healing Word (1st)', classes: ['Bard', 'Cleric', 'Druid'], description: 'Heal 1d4+mod at 60ft range.' },
  { name: 'Mass Healing Word', source: 'Mass Healing Word (3rd)', classes: ['Cleric'], description: 'Heal up to 6 creatures for 1d4+mod each.' },
  { name: 'Misty Step', source: 'Misty Step (2nd)', classes: ['Sorcerer', 'Warlock', 'Wizard'], description: 'Teleport up to 30ft.' },

  // Feats
  { name: 'Shield Master Shove', source: 'Shield Master feat', classes: ['Any'], description: 'Shove with shield after Attack action.' },
  { name: 'Polearm Master Butt', source: 'Polearm Master feat', classes: ['Any'], description: '1d4 bludgeoning attack with weapon butt end.' },
  { name: 'GWM Bonus Attack', source: 'Great Weapon Master feat', classes: ['Any'], description: 'Melee attack after crit or reducing creature to 0.' },
  { name: 'Crossbow Expert Bonus', source: 'Crossbow Expert feat', classes: ['Any'], description: 'Hand crossbow attack after one-handed weapon attack.' },
];

export function getBonusActionsForClass(className) {
  return COMMON_BONUS_ACTIONS.filter(ba =>
    ba.classes.includes('Any') || ba.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getBonusActionByName(name) {
  return COMMON_BONUS_ACTIONS.find(ba => ba.name.toLowerCase() === (name || '').toLowerCase()) || null;
}
