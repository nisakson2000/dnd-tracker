/**
 * playerDungeonTrapSurvivalGuide.js
 * Player Mode: Finding, disarming, and surviving traps
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION = {
  passive: 'Passive Perception (10 + WIS mod + proficiency) detects obvious traps.',
  active: 'Investigation (INT) to study. Perception (WIS) to notice.',
  thieves: 'Thieves\' Tools proficiency to disarm mechanical traps.',
  dispel: 'Dispel Magic or Counterspell for magical traps.',
  note: 'Always state "I\'m checking for traps" in suspicious areas.',
};

export const COMMON_TRAP_TYPES = [
  { trap: 'Pit Trap', dc: '10-15', damage: '1d6 per 10ft. Spikes: +1d6.', disarm: 'Avoid or bridge.' },
  { trap: 'Poison Dart', dc: '15', damage: '1d4 + poison', disarm: 'Thieves\' Tools DC 15.' },
  { trap: 'Rolling Boulder', dc: '15-20', damage: '4d10+ bludgeoning', disarm: 'Block or dodge (DEX save).' },
  { trap: 'Arrow Trap', dc: '15', damage: '1d6-2d6 per arrow', disarm: 'Thieves\' Tools DC 15.' },
  { trap: 'Glyph of Warding', dc: '13+ (Investigation)', damage: '5d8 various', disarm: 'Dispel Magic.' },
  { trap: 'Collapsing Ceiling', dc: '15-20', damage: '4d10 bludgeoning', disarm: 'Support structure.' },
  { trap: 'Fire Trap', dc: '15', damage: '2d6-4d6 fire', disarm: 'Thieves\' Tools DC 15-20.' },
  { trap: 'Poison Gas', dc: '15', damage: 'CON save or poisoned + damage', disarm: 'Block vents.' },
  { trap: 'Curse Trap', dc: '15+ (Arcana)', damage: 'Various curses', disarm: 'Remove Curse.' },
];

export const TRAP_TOOLS = [
  { method: 'High Passive Perception', how: 'Observant feat: +5. Catches most traps automatically.' },
  { method: 'Thieves\' Tools', how: 'Rogue expertise: +10 or more at high levels.' },
  { method: 'Detect Magic (ritual)', how: 'Finds magical traps. No slot cost.' },
  { method: 'Familiar Scout', how: 'Send ahead to trigger traps. 10gp to replace.' },
  { method: '10-Foot Pole', how: '5 copper. Poke suspicious areas from distance.' },
  { method: 'Mage Hand cantrip', how: 'Open chests, pull levers from 30ft.' },
  { method: 'Dispel Magic', how: 'Remove magical traps. Auto-dispels L3 or lower.' },
  { method: 'Find Traps spell', how: 'L2. Reveals presence within 120ft (not exact location).' },
];

export const TRAP_TIPS = [
  'Always check for traps in dungeons. Say "I search the hallway."',
  'Passive Perception catches traps without actively looking.',
  'Investigation for magical traps. Perception for physical traps.',
  'Mage Hand: open chests and pull levers from 30ft. Zero risk.',
  '10-foot pole: 5 copper, priceless safety. Poke everything.',
  'Send the familiar ahead. 10gp to replace vs party damage.',
  'Detect Magic (ritual): finds magical traps for free.',
  'Thieves\' Tools: Rogue can reach +13 or higher.',
  'Glyph of Warding: Investigation, not Perception.',
  'Poison gas: hold breath. CON mod rounds of breath.',
];
