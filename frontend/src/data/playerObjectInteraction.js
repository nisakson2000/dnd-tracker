/**
 * playerObjectInteraction.js
 * Player Mode: Free object interaction rules and common examples
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// OBJECT INTERACTION RULES
// ---------------------------------------------------------------------------

export const OBJECT_INTERACTION_RULES = {
  freeInteraction: 'You can interact with one object for free during your turn (part of movement or action).',
  secondObject: 'Interacting with a second object requires your action.',
  note: 'The DM may allow more complex interactions without using your action.',
};

// ---------------------------------------------------------------------------
// COMMON FREE INTERACTIONS
// ---------------------------------------------------------------------------

export const FREE_INTERACTIONS = [
  'Draw or sheathe a sword',
  'Open or close a door',
  'Withdraw a potion from your backpack',
  'Pick up a dropped axe',
  'Take a bauble from a table',
  'Remove a ring from your finger',
  'Stuff some food into your mouth',
  'Plant a banner in the ground',
  'Fish a few coins from your belt pouch',
  'Drink all the ale in a flagon',
  'Throw a lever or flip a switch',
  'Pull a torch from a sconce',
  'Take a book from a shelf you can reach',
  'Extinguish a small flame',
  'Don a mask',
  'Pull the hood of your cloak up and over your head',
  'Put your ear to a door',
  'Kick a small stone',
  'Turn a key in a lock',
  'Tap the floor with a 10-foot pole',
  'Hand an item to another character',
];

// ---------------------------------------------------------------------------
// ACTIONS REQUIRED
// ---------------------------------------------------------------------------

export const ACTIONS_REQUIRED = [
  'Donning or doffing armor (varies by type)',
  'Donning a shield (1 action) or doffing (1 action)',
  'Drinking a potion (1 action)',
  'Searching a room or body (action or Investigation check)',
  'Using a second object in the same turn',
  'Administering a potion to someone else (action)',
  'Activating a magic item (action unless stated otherwise)',
];

// ---------------------------------------------------------------------------
// DON/DOFF TIMES
// ---------------------------------------------------------------------------

export const ARMOR_DON_DOFF = [
  { type: 'Light Armor', don: '1 minute', doff: '1 minute' },
  { type: 'Medium Armor', don: '5 minutes', doff: '1 minute' },
  { type: 'Heavy Armor', don: '10 minutes', doff: '5 minutes' },
  { type: 'Shield', don: '1 action', doff: '1 action' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check if an interaction is free or requires an action.
 */
export function isFreeInteraction(description) {
  const lc = description.toLowerCase();
  return FREE_INTERACTIONS.some(f => lc.includes(f.toLowerCase().slice(0, 15)));
}

/**
 * Get armor don/doff time.
 */
export function getArmorTime(armorType) {
  return ARMOR_DON_DOFF.find(a => a.type.toLowerCase() === armorType.toLowerCase()) || null;
}
