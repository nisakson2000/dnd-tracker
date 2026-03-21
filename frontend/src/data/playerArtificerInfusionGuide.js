/**
 * playerArtificerInfusionGuide.js
 * Player Mode: Artificer infusion selection by level and build
 * Pure JS — no React dependencies.
 */

export const INFUSION_BASICS = {
  what: 'Artificer enhances items with magical properties. Like crafting magic items.',
  known: 'L2: 4 known. Scales to 12 at L18.',
  active: 'L2: 2 active. Scales to 6 at L18.',
  swap: 'Can replace one known infusion when you level up.',
  key: 'Infusions are your core feature. Choose wisely.',
};

export const MUST_HAVE_INFUSIONS = [
  { name: 'Enhanced Defense', level: 2, effect: '+1 AC (armor or shield). +2 at L10.', rating: 'S', note: 'Always active. Free +1/+2 AC for you or ally.' },
  { name: 'Enhanced Weapon', level: 2, effect: '+1 attack/damage. +2 at L10.', rating: 'S', note: 'Give your martial a +1/+2 weapon for free.' },
  { name: 'Homunculus Servant', level: 2, effect: 'Tiny construct. BA: Force Bolt (1d4+PB). Delivers touch spells.', rating: 'S', note: 'Extra BA attack. Scales with PB. Delivers Cure Wounds at range.' },
  { name: 'Replicate: Bag of Holding', level: 2, effect: 'Bag of Holding. 500 lbs, 64 cubic feet.', rating: 'S', note: 'Party storage. Every party needs one. Combo: put one inside another = Astral nuke.' },
  { name: 'Mind Sharpener', level: 2, effect: 'Reaction: auto-succeed concentration save. 4 charges/LR.', rating: 'S+', note: 'Never lose concentration. Best infusion for casters.' },
  { name: 'Replicate: Winged Boots', level: 6, effect: 'Flight. 4 hours/day. Recharges at dawn.', rating: 'S+', note: 'Flight without concentration. Game-changing.' },
];

export const SITUATIONAL_INFUSIONS = [
  { name: 'Returning Weapon', level: 2, effect: '+1 thrown weapon. Returns after throw. Draws free.', rating: 'A', note: 'Great for thrown weapon builds. Handaxe or javelin.' },
  { name: 'Repeating Shot', level: 2, effect: '+1 ranged weapon. Ignore loading. Creates ammo.', rating: 'A+', note: 'Crossbow Expert without the feat. Free +1.' },
  { name: 'Armor of Magical Strength', level: 2, effect: 'STR checks/saves use INT. 6 charges/LR.', rating: 'A', note: 'Dump STR safely. INT for athletics/grapple.' },
  { name: 'Spell-Refueling Ring', level: 6, effect: 'Recover one spell slot (L3 or lower). Once/day.', rating: 'A+', note: 'Extra spell slot per day. Always useful.' },
  { name: 'Radiant Weapon', level: 6, effect: '+1 weapon, glows, reaction: blind attacker (CON save). 4 charges.', rating: 'A+', note: 'Blinding is powerful. Great for martial allies.' },
  { name: 'Repulsion Shield', level: 6, effect: '+1 AC shield. Reaction: push attacker 15ft. 4 charges.', rating: 'A', note: 'Defensive + forced movement. Good tanking.' },
  { name: 'Helm of Awareness', level: 10, effect: 'Advantage on initiative. Can\'t be surprised.', rating: 'A+', note: 'Going first matters. Surprise immunity is huge.' },
  { name: 'Boots of the Winding Path', level: 6, effect: 'BA: teleport 15ft to space you were in last turn.', rating: 'B+', note: 'Niche repositioning. Battlesmith can use it.' },
];

export const INFUSIONS_BY_SUBCLASS = {
  alchemist: {
    priority: ['Homunculus Servant', 'Mind Sharpener', 'Enhanced Defense', 'Bag of Holding'],
    note: 'Homunculus delivers your potions. Mind Sharpener protects concentration.',
  },
  armorer: {
    priority: ['Enhanced Defense', 'Enhanced Weapon', 'Mind Sharpener', 'Repulsion Shield'],
    note: 'Stack AC. Enhanced Weapon works on armor attacks. Tank build.',
  },
  artillerist: {
    priority: ['Mind Sharpener', 'Enhanced Defense', 'Homunculus Servant', 'Spell-Refueling Ring'],
    note: 'Protect concentration on your cannon. Mind Sharpener is mandatory.',
  },
  battlesmith: {
    priority: ['Enhanced Weapon', 'Enhanced Defense', 'Radiant Weapon', 'Helm of Awareness'],
    note: 'Boost your weapon. Use INT for attacks. Steel Defender covers BA.',
  },
};

export const REPLICATE_MAGIC_ITEM_PICKS = [
  { item: 'Bag of Holding', level: 2, rating: 'S', why: 'Universal utility. Every party wants one.' },
  { item: 'Alchemy Jug', level: 2, rating: 'A', why: '2 gallons of mayo/day. Or acid, poison, etc. Creative uses.' },
  { item: 'Goggles of Night', level: 2, rating: 'A', why: '60ft darkvision. Give to non-darkvision races.' },
  { item: 'Winged Boots', level: 6, rating: 'S+', why: 'Flight. 4 hours/day. No concentration.' },
  { item: 'Cloak of Protection', level: 6, rating: 'A+', why: '+1 AC, +1 saves. Requires attunement.' },
  { item: 'Amulet of Health', level: 10, rating: 'A+', why: 'CON set to 19. Dump CON, gain HP.' },
  { item: 'Belt of Hill Giant Strength', level: 10, rating: 'A', why: 'STR set to 21. Grapple god.' },
  { item: 'Boots of Speed', level: 10, rating: 'A', why: 'BA: double speed for 10 minutes. Great mobility.' },
];

export const ARTIFICER_INFUSION_TIPS = [
  'Mind Sharpener: best infusion for any concentrating caster. Take it.',
  'Enhanced Defense + Enhanced Weapon: always relevant. Default picks.',
  'Bag of Holding: universal party item. Replicate it at L2.',
  'Winged Boots at L6: flight without concentration. Top pick.',
  'Homunculus Servant: BA attack + delivers touch spells at range.',
  'You can infuse items for allies. Spread the magic items around.',
  'Repeating Shot: Crossbow Expert without the feat tax.',
  'Infusions end when you die or make new ones. Plan accordingly.',
  'At L2 you only have 2 active. Be strategic.',
  'Swap one known infusion per level-up. Adapt to your campaign.',
];
