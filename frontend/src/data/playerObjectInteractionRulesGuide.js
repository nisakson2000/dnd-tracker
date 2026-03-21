/**
 * playerObjectInteractionRulesGuide.js
 * Player Mode: Object interaction rules — free vs action economy
 * Pure JS — no React dependencies.
 */

export const OBJECT_INTERACTION_RULES = {
  freeInteraction: {
    rule: 'You get ONE free object interaction per turn.',
    examples: [
      'Draw or sheathe one weapon.',
      'Open or close a door.',
      'Pick up a dropped item.',
      'Hand an item to another creature.',
      'Pull a lever or flip a switch.',
      'Retrieve an item from your pack.',
      'Don or doff a shield (but see below).',
    ],
    note: 'Only ONE free interaction. Second interaction requires your action (Use an Object).',
  },
  actionRequired: {
    rule: 'A second object interaction in the same turn requires your action.',
    examples: [
      'Drawing a second weapon (unless Dual Wielder feat).',
      'Using a potion (drink or administer).',
      'Using caltrops, ball bearings, or other items.',
      'Applying poison to a weapon.',
      'Lighting a torch.',
    ],
    note: 'This is why drinking a potion costs your action — it\'s an object interaction beyond your free one.',
  },
};

export const COMMON_INTERACTIONS = [
  { interaction: 'Drawing a weapon', cost: 'Free (1st weapon)', note: 'Drawing a second weapon in same turn = action. Dual Wielder feat: draw two for free.' },
  { interaction: 'Dropping a weapon', cost: 'Free (no interaction needed)', note: 'Dropping is NOT the same as sheathing. You can drop a weapon for free, then draw another.' },
  { interaction: 'Drinking a potion (self)', cost: 'Action', note: 'RAW: action. Many DMs houserule potions as BA. Ask your DM.' },
  { interaction: 'Administering potion (to another)', cost: 'Action', note: 'Must be within 5ft. Target must be willing or incapacitated.' },
  { interaction: 'Picking up an item', cost: 'Free (if first interaction)', note: 'Can pick up a dropped weapon. Costs your free interaction.' },
  { interaction: 'Donning a shield', cost: 'Action', note: '1 action to put on. 1 action to take off. NOT a free interaction.' },
  { interaction: 'Donning/doffing armor', cost: 'Minutes', note: 'Heavy armor: 10 min to don, 5 min to doff. Medium: 5/1. Light: 1/1.' },
  { interaction: 'Opening a door', cost: 'Free', note: 'If locked: Thieves\' Tools check (action). If just closed: free interaction.' },
  { interaction: 'Using caltrops/ball bearings', cost: 'Action', note: 'Spread in a 5ft area. Caltrops: DEX save or take 1 damage + speed 0. Ball bearings: DEX save or fall prone.' },
];

export const POTION_RULES = {
  raw: 'Drinking a potion costs your action. Administering a potion to someone else also costs your action.',
  commonHouserule: 'BA to drink yourself, action to administer to someone else.',
  thiefRogue: 'Thief Rogue: Fast Hands lets you Use an Object as a BA. Potions as BA is RAW for Thieves.',
  note: 'Always ask your DM which rule they use. Potion as BA is very common and significantly changes combat.',
};

export const WEAPON_JUGGLING = {
  problem: 'Casters often need a free hand for somatic components but also want a weapon/shield.',
  solutions: [
    { method: 'Drop weapon (free), cast spell, pick up weapon (free interaction next turn)', cost: 'None (but weapon on ground for a round)', rating: 'A' },
    { method: 'War Caster feat', cost: 'Feat', rating: 'S', note: 'Perform somatic components with hands full of weapons/shield.' },
    { method: 'Ruby of the War Mage', cost: 'Common magic item', rating: 'A', note: 'Attune: weapon counts as spellcasting focus.' },
    { method: 'Component pouch', cost: 'Free (starting equipment)', rating: 'B', note: 'Need one free hand to access it.' },
  ],
};

export const SHIELD_TIMING = {
  don: '1 action to put on a shield.',
  doff: '1 action to remove a shield.',
  combat: 'Can\'t quickly swap between shield and two-handed weapon in one turn.',
  tip: 'If you need to switch from shield+weapon to two-handed: drop shield (free action, but DM may rule differently), or plan ahead.',
  note: 'RAW, donning/doffing a shield is an action, not a free interaction. This matters for combat flexibility.',
};
