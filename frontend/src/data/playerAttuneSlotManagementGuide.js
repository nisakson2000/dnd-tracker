/**
 * playerAttuneSlotManagementGuide.js
 * Player Mode: Magic item attunement — rules, slot management, best picks
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  process: 'Short rest: spend the rest focusing on the item.',
  requirements: 'Some items require specific class, alignment, or other conditions.',
  ending: 'Remove item, die, another creature attunes, or voluntarily end during short rest.',
  note: '3 slots is the hard cap. Choose wisely.',
};

export const BEST_ATTUNEMENT_ITEMS = [
  { item: 'Staff of Power', rarity: 'Very Rare', why: '+2 AC, +2 saves, +2 spell attack. Multiple spells. Best staff.', rating: 'S+' },
  { item: 'Staff of the Magi', rarity: 'Legendary', why: 'Advantage on saves vs spells. Absorb spells. 50 charges.', rating: 'S+' },
  { item: 'Belt of Giant Strength', rarity: 'Varies', why: 'STR 21-29. Free STR without ASIs.', rating: 'S+' },
  { item: 'Cloak of Displacement', rarity: 'Rare', why: 'Disadvantage on ALL attacks against you until hit.', rating: 'S+' },
  { item: 'Winged Boots', rarity: 'Uncommon', why: 'Flight. 4 hours/day.', rating: 'S' },
  { item: 'Amulet of Health', rarity: 'Rare', why: 'CON set to 19. Dump CON safely.', rating: 'S' },
  { item: 'Robe of the Archmagi', rarity: 'Legendary', why: 'AC 15+DEX, +2 spell DC, advantage on saves vs magic.', rating: 'S+' },
  { item: 'Cloak of Protection', rarity: 'Uncommon', why: '+1 AC, +1 all saves.', rating: 'A+' },
  { item: 'Ring of Protection', rarity: 'Rare', why: '+1 AC, +1 all saves. Stacks with Cloak.', rating: 'A+' },
  { item: 'Rod of the Pact Keeper', rarity: 'Varies', why: '+X spell attack/DC. Recover 1 Warlock slot/LR.', rating: 'S (Warlock)' },
];

export const BEST_NO_ATTUNEMENT_ITEMS = [
  { item: 'Bag of Holding', rarity: 'Uncommon', why: '500 lbs storage. Every party needs one.' },
  { item: '+1 Shield', rarity: 'Uncommon', why: '+3 AC total. No attunement cost.' },
  { item: 'Broom of Flying', rarity: 'Uncommon', why: 'Fly 50ft. No attunement.' },
  { item: 'Immovable Rod', rarity: 'Uncommon', why: 'Fix in place. Button toggle. Creative uses.' },
  { item: 'Decanter of Endless Water', rarity: 'Uncommon', why: 'Unlimited water. Geyser mode for pushing.' },
  { item: 'Driftglobe', rarity: 'Uncommon', why: 'Light/Daylight. Counter magical darkness.' },
  { item: 'Rope of Climbing', rarity: 'Uncommon', why: 'Animate rope. 60ft. Climbs on command.' },
];

export const ATTUNEMENT_BY_ROLE = {
  martial: ['Belt of Giant Strength', '+X Weapon', 'Cloak of Displacement'],
  caster: ['Staff of Power/Magi', 'Robe of Archmagi', 'Amulet of Health'],
  healer: ['Staff of Healing', 'Amulet of Health', 'Cloak of Protection'],
  rogue: ['Cloak of Displacement', 'Winged Boots', '+X Weapon'],
};

export const ATTUNEMENT_TIPS = [
  'You only get 3 attunement slots. Choose your best 3 items.',
  'No-attunement items are free power. Bag of Holding, +1 Shield.',
  '+X weapons and armor are almost always worth a slot.',
  'Cloak of Displacement: disadvantage on ALL attacks against you.',
  'Belt of Giant Strength: STR 21+ without spending ASIs.',
  'Artificers get extra attunement slots (4 at L10, 5 at L14, 6 at L18).',
  'Swap attunement during short rests. Adapt to the situation.',
  'When offered a new item: is it better than your worst attuned item?',
  'Ring + Cloak of Protection stack: +2 AC, +2 all saves. Two slots.',
  'Staff of Power: best single item in the game. Attune it always.',
];
