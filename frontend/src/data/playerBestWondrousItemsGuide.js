/**
 * playerBestWondrousItemsGuide.js
 * Player Mode: Best wondrous items by rarity — rings, cloaks, boots, etc.
 * Pure JS — no React dependencies.
 */

export const UNCOMMON_WONDROUS = [
  { item: 'Bag of Holding', effect: '500 lbs, 64 cubic feet storage. 15 lbs weight.', attune: false, rating: 'S', note: 'Every party needs one. Carry everything.' },
  { item: 'Winged Boots', effect: 'Flight. Walking speed. 4 hours/day.', attune: true, rating: 'S+', note: 'Flight without concentration. Game-changing.' },
  { item: 'Goggles of Night', effect: '60ft darkvision.', attune: false, rating: 'A', note: 'Give to non-darkvision party members.' },
  { item: 'Cloak of Protection', effect: '+1 AC, +1 all saves.', attune: true, rating: 'A+', note: 'Always useful. Simple and effective.' },
  { item: 'Boots of Elvenkind', effect: 'Advantage on Stealth (no sound).', attune: false, rating: 'A', note: 'Rogue dream item. No attunement.' },
  { item: 'Gauntlets of Ogre Power', effect: 'STR set to 19.', attune: true, rating: 'A+', note: 'Free 19 STR. Great for low-STR builds.' },
  { item: 'Broom of Flying', effect: 'Fly 50ft. Carry 200 lbs.', attune: false, rating: 'A+', note: 'No attunement flight. Slower than Winged Boots.' },
  { item: 'Pearl of Power', effect: 'Recover one L3 or lower slot per day.', attune: true, rating: 'A+', note: 'Extra slot per day. Very efficient.' },
  { item: 'Immovable Rod', effect: 'Fix in place. Button toggle. Holds 8,000 lbs.', attune: false, rating: 'A', note: 'Creative uses: doorstops, climbing aids, traps.' },
  { item: 'Stone of Good Luck (Luckstone)', effect: '+1 to ability checks and saving throws.', attune: true, rating: 'A+', note: '+1 to everything. Simple and universal.' },
];

export const RARE_WONDROUS = [
  { item: 'Amulet of Health', effect: 'CON set to 19.', attune: true, rating: 'S', note: 'Dump CON, gain HP and concentration saves.' },
  { item: 'Ring of Protection', effect: '+1 AC, +1 all saves.', attune: true, rating: 'A+', note: 'Stacks with Cloak of Protection.' },
  { item: 'Ring of Spell Storing', effect: 'Store up to 5 levels of spells. Anyone can cast them.', attune: true, rating: 'S', note: 'Pre-load Shield, Absorb Elements, or Haste.' },
  { item: 'Cloak of Displacement', effect: 'Disadvantage on attacks against you (resets when hit).', attune: true, rating: 'S+', note: 'Best defensive item at this rarity.' },
  { item: 'Periapt of Proof Against Poison', effect: 'Immune to poison damage and poisoned condition.', attune: false, rating: 'A', note: 'No attunement. Poison is common. Free immunity.' },
  { item: 'Cape of the Mountebank', effect: 'Dimension Door once/day.', attune: false, rating: 'A', note: 'Free 500ft teleport once/day. No attunement.' },
  { item: 'Helm of Teleportation', effect: 'Teleport spell 3/day.', attune: true, rating: 'S', note: 'Party teleportation 3 times per day. Amazing travel.' },
  { item: 'Necklace of Fireballs', effect: '3-7 Fireballs (8d6 fire each). One-time use beads.', attune: false, rating: 'A+', note: 'Multiple Fireballs. Anyone can throw them. Great AoE.' },
];

export const VERY_RARE_WONDROUS = [
  { item: 'Belt of Giant Strength', effect: 'STR set to 21-29.', attune: true, rating: 'S+', note: 'Hill (21), Stone (23), Frost (23), Fire (25), Cloud (27), Storm (29).' },
  { item: 'Cloak of Invisibility', effect: 'Invisible while wearing hood. 2 hours/day.', attune: true, rating: 'S', note: 'True invisibility. Doesn\'t break on attack.' },
  { item: 'Tome of Understanding', effect: 'WIS +2 (and max increases by 2).', attune: false, rating: 'S+', note: 'Permanent stat increase. +2 WIS above 20 cap.' },
  { item: 'Manual of Bodily Health', effect: 'CON +2 (and max increases by 2).', attune: false, rating: 'S+', note: 'Permanent +2 CON. More HP, better concentration.' },
  { item: 'Ioun Stone of Mastery', effect: '+1 proficiency bonus.', attune: true, rating: 'S+', note: '+1 to all proficient checks, attacks, saves, spell DC.' },
  { item: 'Rod of Absorption', effect: 'Absorb spells targeted at you. Convert to spell slots.', attune: true, rating: 'S', note: 'Absorb enemy spells and turn them into your own slots.' },
  { item: 'Staff of Power', effect: '+2 AC, +2 saves, +2 spell attack. 20 charges of spells.', attune: true, rating: 'S+', note: 'Best item in the game for casters.' },
];

export const WONDROUS_ITEM_TIPS = [
  'Bag of Holding: every party needs one. No attunement.',
  'Winged Boots: flight without concentration. Best uncommon item.',
  'Cloak of Displacement: disadvantage on ALL attacks against you.',
  'Ring of Spell Storing: pre-load Shield or Haste. Anyone casts.',
  'Amulet of Health: CON 19. Dump CON, max something else.',
  'Belt of Giant Strength: STR 21-29. Best martial item.',
  'Staff of Power: +2 AC, +2 saves, spells. Best caster item.',
  'Luckstone: +1 to all checks and saves. Simple and universal.',
  'No-attunement items are free power. Prioritize them.',
  'Tomes/Manuals: permanent +2 to stats. Best items in the game.',
];
