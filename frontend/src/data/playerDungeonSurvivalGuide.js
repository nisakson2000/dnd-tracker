/**
 * playerDungeonSurvivalGuide.js
 * Player Mode: Dungeon crawling — preparation, exploration, and survival
 * Pure JS — no React dependencies.
 */

export const DUNGEON_PREP = [
  { item: 'Torches/Light source', priority: 'S (if no Darkvision)', note: 'Darkvision still gives Perception disadvantage in darkness. Light is better.' },
  { item: 'Healing Potions', priority: 'S+', note: 'Minimum 2-3 per party member. Emergency HP.' },
  { item: 'Rope (50ft silk)', priority: 'A+', note: 'Climbing, tying, securing. Silk rope is lighter.' },
  { item: 'Pitons (10)', priority: 'A', note: 'Create handholds. Secure rope. Wedge doors.' },
  { item: 'Crowbar', priority: 'A', note: 'Advantage on STR checks to pry things open.' },
  { item: 'Pole (10ft)', priority: 'A', note: 'Poke suspicious things from a distance. Trigger traps safely.' },
  { item: 'Ball bearings/Caltrops', priority: 'B+', note: 'Area denial. Slow pursuers. Detect invisible creatures (ball bearings).' },
  { item: 'Chalk', priority: 'B+', note: 'Mark explored paths. Leave messages. Cheap and effective.' },
  { item: 'Component pouch', priority: 'S (casters)', note: 'Spellcasting components. Don\'t forget your focus.' },
  { item: 'Thieves\' tools', priority: 'S (Rogue)', note: 'Open locks. Disarm traps. Essential for dungeon Rogues.' },
  { item: 'Bag of Holding', priority: 'A+', note: 'Carry loot, bodies (Revivify), or emergency supplies.' },
];

export const DUNGEON_EXPLORATION = {
  marchingOrder: {
    front: 'Tank/martial with high AC and HP. Takes the first hit.',
    middle: 'Casters, ranged attackers, lower HP characters.',
    rear: 'Someone with good Perception. Rogue or Ranger.',
    note: 'Ambushes from behind are common. Don\'t neglect rearguard.',
  },
  roomClearing: [
    'Listen at doors before opening (Perception check).',
    'Open doors from the side (avoid traps that trigger straight ahead).',
    'Send familiar/unseen servant first for dangerous rooms.',
    'Check for traps: Perception (spot) + Investigation (understand mechanism).',
    'Check ceilings and floors, not just walls. Many traps are above or below.',
  ],
  trapsAndHazards: [
    'Passive Perception detects traps if high enough (DM sets DC, usually 12-20).',
    'Thieves\' tools to disarm. Failed check may trigger the trap.',
    'Detect Magic ritual: many traps are magical (Glyph of Warding).',
    'Mage Hand: trigger traps from 30ft away. Free with Arcane Trickster.',
    'Dispel Magic: remove magical traps/wards.',
  ],
};

export const DUNGEON_RESOURCE_MANAGEMENT = [
  { resource: 'Spell Slots', tip: 'Budget 2-3 per encounter. Save big spells for boss/emergency. Ritual cast when possible.', priority: 'S+' },
  { resource: 'Hit Dice', tip: 'Spend on short rests. Recover half per long rest. Don\'t hoard them.', priority: 'A+' },
  { resource: 'Hit Points', tip: 'Healing potions for emergency. Hit Dice on SR. Save Healing Word for downed allies.', priority: 'S' },
  { resource: 'Consumables', tip: 'Use them. Unused potions/scrolls are wasted gold. Use before boss if relevant.', priority: 'A+' },
  { resource: 'Channel Divinity / Class Features', tip: 'SR-recovery features: use freely. LR features: budget across the day.', priority: 'A' },
  { resource: 'Torches/Light', tip: 'Track duration (1 hour per torch). Lanterns last 6 hours. Continual Flame = permanent.', priority: 'A (if needed)' },
];

export const DUNGEON_SPELLS = [
  { spell: 'Detect Magic (ritual)', priority: 'S+', note: 'Free trap detection. Use before every suspicious room.' },
  { spell: 'Find Familiar (ritual)', priority: 'S', note: 'Scout ahead. Share senses. Risk-free exploration.' },
  { spell: 'Alarm (ritual)', priority: 'A', note: 'Ward a room for resting. Alert on intrusion.' },
  { spell: 'Tiny Hut (ritual)', priority: 'S (for resting)', note: 'Safe long rest in the dungeon. Nothing gets in.' },
  { spell: 'Knock', priority: 'A', note: 'Open any lock. LOUD (300ft). Cast Silence first.' },
  { spell: 'Passwall', priority: 'A+', note: 'Create passage through wall. Bypass entire dungeon sections.' },
  { spell: 'Dimension Door', priority: 'S', note: 'Skip rooms. Escape traps. Go through walls. 500ft.' },
  { spell: 'Stone Shape', priority: 'A', note: 'Reshape dungeon walls. Create exits. Seal passages behind you.' },
  { spell: 'Darkvision (spell)', priority: 'A', note: 'Grant Darkvision to non-Darkvision races. 8 hours. Ritual cast if available.' },
];

export const DUNGEON_TIPS = [
  'Never split the party in a dungeon. Ambushes kill isolated PCs.',
  'Short rest after every 2-3 encounters if possible. HD recovery is free.',
  'Mark your path with chalk. Getting lost in a dungeon wastes resources.',
  'Listen at doors. Perception check can reveal what\'s on the other side.',
  'Send the familiar, not the Rogue. Familiars reform. Rogues don\'t.',
  'Bag of Holding: carry fallen allies to a safe spot for resurrection.',
  'Don\'t fight everything. Sometimes avoiding combat preserves resources for the boss.',
  'Identify magic items during short rests. Don\'t use unknown items blindly.',
];
