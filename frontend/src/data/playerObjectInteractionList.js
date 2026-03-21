/**
 * playerObjectInteractionList.js
 * Player Mode: Free object interactions and item interactions in combat
 * Pure JS — no React dependencies.
 */

export const FREE_OBJECT_INTERACTIONS = [
  'Draw or sheathe ONE weapon',
  'Open or close a door',
  'Withdraw a potion from your backpack',
  'Pick up a dropped weapon',
  'Hand an item to another character',
  'Remove a ring',
  'Stuff some food in your mouth',
  'Pull a lever or flip a switch',
  'Turn a key in a lock',
  'Drop an item (truly free — doesn\'t even use your interaction)',
  'Retrieve an item from a belt pouch',
  'Take an item from a table',
  'Extinguish a small flame',
  'Don a mask',
  'Pull the hood of your cloak up or down',
];

export const COSTS_AN_ACTION = [
  'Don or doff a shield (1 action)',
  'Don armor (1-10 minutes depending on type)',
  'Doff armor (1-5 minutes)',
  'Use a second object interaction (beyond your free one)',
  'Search a body for hidden items',
  'Drink a potion',
  'Feed a potion to an unconscious ally',
  'Use most magic items (check item description)',
  'Administer first aid (Medicine check)',
];

export const CLEVER_INTERACTIONS = [
  { action: 'Draw + attack + free-drop + draw again', detail: 'Draw weapon (free) → attack → drop weapon (free) → draw new weapon (free on NEXT turn). Useful for TWF without Dual Wielder.' },
  { action: 'Pick up enemy\'s weapon', detail: 'Disarm an enemy, then use your free interaction to pick up their weapon. Now they\'re unarmed.' },
  { action: 'Close a door mid-combat', detail: 'Free interaction: close the door behind you to block line of sight for enemy casters.' },
  { action: 'Kick over a brazier', detail: 'Free interaction: knock over a fire source to create difficult terrain or set something ablaze.' },
  { action: 'Pull a lever/rope mid-fight', detail: 'Many dungeons have environmental levers. Use your free interaction to change the battlefield.' },
  { action: 'Sheathe weapon + cast spell', detail: 'Sheathe your weapon (free) to free a hand for somatic components.' },
];

export const DUAL_WIELDER_INTERACTIONS = {
  problem: 'Drawing TWO weapons requires TWO object interactions. You only get ONE free.',
  solutions: [
    'Dual Wielder feat: draw or stow two weapons at once.',
    'Start combat with weapons already drawn.',
    'Draw one on turn 1, second on turn 2.',
    'Drop one weapon (free) instead of sheathing (free interaction saved).',
  ],
};

export function isFreeInteraction(action) {
  return FREE_OBJECT_INTERACTIONS.some(f => f.toLowerCase().includes((action || '').toLowerCase()));
}

export function costsAction(action) {
  return COSTS_AN_ACTION.some(a => a.toLowerCase().includes((action || '').toLowerCase()));
}
