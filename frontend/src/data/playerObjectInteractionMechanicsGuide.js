/**
 * playerObjectInteractionMechanicsGuide.js
 * Player Mode: Object interaction rules — free interactions, actions, and creative uses
 * Pure JS — no React dependencies.
 */

export const OBJECT_INTERACTION_RULES = {
  freeInteraction: 'ONE free object interaction per turn. Examples: draw/sheathe weapon, open door, pick up item.',
  actionRequired: 'Second interaction in same turn requires your Action (Use an Object).',
  thiefsTools: 'Thief Rogues can Use an Object as a Bonus Action (Fast Hands).',
  note: 'This is often overlooked but matters for weapon swapping, item use, and creative play.',
};

export const FREE_INTERACTIONS = [
  'Draw or sheathe ONE weapon',
  'Open or close a door',
  'Pick up a dropped item',
  'Hand an item to another character',
  'Withdraw an item from a belt pouch or pack',
  'Remove a ring',
  'Stuff an item into a belt pouch',
  'Pull a lever or flip a switch',
  'Turn a key in a lock',
  'Extinguish a small flame',
  'Drink a potion (DM variant — some rule this as an action)',
];

export const ACTION_REQUIRED_INTERACTIONS = [
  'Don or doff a shield (1 action)',
  'Don armor (1-10 minutes depending on type)',
  'Doff armor (1-5 minutes)',
  'Second object interaction in same turn',
  'Use an item that specifies "Use an Object" action',
  'Administer a potion to an unconscious ally',
  'Search through a container thoroughly',
  'Use a Healer\'s Kit',
  'Light a torch',
  'Apply poison to a weapon (1 action)',
];

export const WEAPON_SWAP_RULES = {
  draw: 'Drawing a weapon: free interaction.',
  sheathe: 'Sheathing a weapon: free interaction.',
  swap: 'Draw + sheathe = 2 interactions. One is free, second costs your action.',
  workaround: 'Drop weapon (free, no interaction needed) + draw new weapon (free interaction). Legal RAW.',
  dualWield: 'Drawing 2 weapons requires 2 interactions. Dual Wielder feat: draw/sheathe 2 at once.',
  note: 'Dropping is NOT an interaction. It\'s just... letting go. This is the RAW workaround.',
};

export const POTION_RULES_VARIANTS = [
  { variant: 'RAW (PHB)', rule: 'Drinking a potion = Use an Object action.', note: 'Standard rule. Uses your action.' },
  { variant: 'Common Houserule', rule: 'Drink a potion = Bonus Action. Feed to ally = Action.', note: 'Most popular houserule.' },
  { variant: 'BA self / Action ally', rule: 'Take average HP as BA, or roll as Action.', note: 'Choice between guaranteed and gamble.' },
];

export const CREATIVE_OBJECT_USES = [
  { item: 'Ball Bearings', use: 'Cover 10×10 area. DEX save or fall prone. 1gp.', rating: 'A' },
  { item: 'Caltrops', use: '5×5 area. 1 piercing + speed 0 for 10 min (DEX save). 1gp.', rating: 'A' },
  { item: 'Oil Flask', use: 'Throw + ignite. 5 fire damage/round for 2 rounds. 1sp.', rating: 'A' },
  { item: 'Holy Water', use: '2d6 radiant vs undead/fiend (ranged attack). 25gp.', rating: 'A' },
  { item: 'Acid Flask', use: '2d6 acid damage (ranged attack). 25gp.', rating: 'A' },
  { item: 'Alchemist\'s Fire', use: '1d4 fire/round until extinguished. 50gp.', rating: 'A' },
  { item: 'Rope (50ft)', use: 'Tie up enemies, climb, create trip lines. 1gp.', rating: 'A+' },
  { item: 'Mirror', use: 'Look around corners safely. 5gp.', rating: 'A' },
  { item: '10ft Pole', use: 'Test for traps, push things from distance. 5cp.', rating: 'A' },
];

export const OBJECT_INTERACTION_TIPS = [
  'ONE free interaction per turn. Plan your draws and item uses.',
  'Drop weapon (free) + draw new one (free interaction). Legal swap workaround.',
  'Dual Wielder feat: draw or sheathe 2 weapons at once. Solves TWF interaction tax.',
  'Thief Rogues: Use an Object as BA (Fast Hands). Use items without losing your action.',
  'Ball bearings and caltrops are 1gp encounter-changers. Always carry some.',
  'Ask your DM about potion rules. Most use BA to drink, Action to administer.',
  'Don/doff shield = 1 action each. Can\'t just freely swap in combat.',
  'A 10-foot pole can trigger pressure plates, reach switches, and test for mimics.',
];
