/**
 * playerInfusionRankingGuide.js
 * Player Mode: Artificer infusions ranked — best magic items you can make
 * Pure JS — no React dependencies.
 */

export const INFUSION_OVERVIEW = {
  class: 'Artificer',
  feature: 'Infuse Item',
  known: '4 at L2, up to 12 at L18',
  active: '2 at L2, up to 6 at L18',
  note: 'Create magic items from mundane objects. The best Artificer feature.',
};

export const INFUSIONS_RANKED = [
  { infusion: 'Enhanced Arcane Focus', level: 2, effect: '+1 spell attack (+2 at L10). Ignore half cover.', rating: 'S', note: '+1/+2 to spell attacks. Ignoring cover is huge.' },
  { infusion: 'Enhanced Defense', level: 2, effect: '+1 AC to armor/shield (+2 at L10).', rating: 'S', note: 'Free +1/+2 AC. Best defensive infusion.' },
  { infusion: 'Enhanced Weapon', level: 2, effect: '+1 to attack and damage (+2 at L10).', rating: 'S', note: 'Free magic weapon. Essential for martials.' },
  { infusion: 'Homunculus Servant', level: 2, effect: 'Tiny construct: fly 30ft, delivers touch spells, uses your BA to attack.', rating: 'S', note: 'Familiar-like construct. BA force damage. Scales with PB.' },
  { infusion: 'Replicate: Bag of Holding', level: 2, effect: 'Free Bag of Holding.', rating: 'A+', note: 'Solves inventory forever. Free at L2.' },
  { infusion: 'Replicate: Alchemy Jug', level: 2, effect: 'Produces 2 gallons mayonnaise, 1 gallon acid, etc. daily.', rating: 'A', note: 'Infinite acid (2d6 damage), poison, oil, etc.' },
  { infusion: 'Replicate: Winged Boots', level: 10, effect: 'Free flight item.', rating: 'S', note: 'Flight at L10. No concentration. 4 hours/day.' },
  { infusion: 'Replicate: Cloak of Protection', level: 2, effect: '+1 AC and saves.', rating: 'S', note: 'Best uncommon item, free from infusion.' },
  { infusion: 'Repulsion Shield', level: 6, effect: '+1 shield. Reaction: push attacker 15ft (uses/PB per LR).', rating: 'A+', note: 'Free +1 shield + push reaction. Great tank tool.' },
  { infusion: 'Spell-Storing Item', level: 11, effect: 'Store a L1-2 Artificer spell. Anyone can use it. 2×INT mod charges.', rating: 'S+', note: 'Store Aid, Cure Wounds, Web. 10 charges at INT 20. INSANE value.' },
  { infusion: 'Boots of the Winding Path', level: 6, effect: 'BA: teleport 15ft to a space you occupied in the last round.', rating: 'A', note: 'Free disengage. Positioning tool.' },
  { infusion: 'Mind Sharpener', level: 2, effect: '4 charges: auto-succeed concentration save.', rating: 'A+', note: 'Never lose concentration. 4 free saves per day.' },
  { infusion: 'Radiant Weapon', level: 6, effect: '+1 weapon, blinds on hit (CON save), 4 charges.', rating: 'A', note: 'Blind is devastating. 4 uses per day.' },
  { infusion: 'Helm of Awareness', level: 10, effect: 'Advantage on initiative. Can\'t be surprised.', rating: 'A+', note: 'Free Alert feat effect.' },
];

export const INFUSION_STRATEGY = [
  'Always have Enhanced Defense active on your tank\'s armor.',
  'Enhanced Weapon for any martial without a magic weapon.',
  'Homunculus Servant for BA damage every turn.',
  'Spell-Storing Item at L11 is game-changing. 10 free Aid casts per day.',
  'Give Cloak of Protection to whoever has the worst saves.',
  'Replicate items you\'d otherwise need to buy: saves thousands of gold.',
  'Swap infusions on long rest. Adapt to upcoming challenges.',
];

export const SPELL_STORING_ITEM_BEST = [
  { spell: 'Aid', why: '+5 max HP to 3 creatures, 10 times per day. 50 HP for the party per charge.', rating: 'S+' },
  { spell: 'Cure Wounds', why: '10 free heals per day. Give to the Fighter or familiar.', rating: 'A+' },
  { spell: 'Web', why: '10 free Webs per day. Area control without slots.', rating: 'A+' },
  { spell: 'Faerie Fire', why: '10 free advantage sources.', rating: 'A' },
  { spell: 'Absorb Elements', why: 'Give to an ally. They get free elemental resistance reactions.', rating: 'A' },
];
