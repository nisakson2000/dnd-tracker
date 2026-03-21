/**
 * playerTrapHandlingGuide.js
 * Player Mode: Finding and disabling traps — dungeon survival essential
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION_BASICS = {
  passivePerception: 'DM compares trap DC against passive Perception (10 + WIS mod + proficiency). Auto-detect if passive ≥ DC.',
  activeSearch: 'Investigation (INT) to find by logic. Perception (WIS) to notice physical signs.',
  magicTraps: 'Detect Magic reveals magical traps within 30ft.',
  disabling: 'Thieves\' Tools (DEX + proficiency) for mechanical. Dispel Magic for magical.',
};

export const TRAP_DETECTION_METHODS = [
  { method: 'High Passive Perception', rating: 'S+', note: 'Passive 20+ detects most traps without trying. Observant feat helps.' },
  { method: 'Active Investigation', rating: 'S', note: 'Search suspicious areas. INT check.' },
  { method: 'Detect Magic (ritual)', rating: 'A+', note: 'Reveals magic traps. Free. 30ft through walls.' },
  { method: 'Familiar scouting', rating: 'S', note: 'Send ahead. Triggers trap = familiar dies (10gp to resummon). You\'re safe.' },
  { method: 'Mage Hand', rating: 'A+', note: 'Open doors, pull levers, grab items from 30ft. Safe triggering.' },
  { method: '10-foot pole', rating: 'A', note: 'Classic. Poke the floor ahead.' },
  { method: 'Arcane Eye', rating: 'S', note: 'Scout rooms magically. See traps before entering.' },
  { method: 'Reliable Talent (Rogue 11)', rating: 'S+', note: 'Minimum 10+mods on Perception/Investigation. Near-guaranteed.' },
];

export const COMMON_TRAPS = [
  { trap: 'Pit Trap', dc: '10-15', damage: '1d6-4d10 falling', disable: 'DC 10-15 Thieves\' Tools.' },
  { trap: 'Poison Dart', dc: '12-18', damage: '1d4 + poison', disable: 'DC 15 Thieves\' Tools.' },
  { trap: 'Poison Gas', dc: '13-18', damage: 'CON save or poisoned + damage', disable: 'DC 15-20 block vents.' },
  { trap: 'Collapsing Ceiling', dc: '15-20', damage: '4d10 bludgeoning', disable: 'DC 15-20 shore supports.' },
  { trap: 'Fire Glyph', dc: '13-18', damage: '5d8 fire (DEX save)', disable: 'Dispel Magic or DC 15-20.' },
  { trap: 'Symbol', dc: '18+', damage: 'Varies (death, pain, insanity)', disable: 'Dispel Magic DC 18+.' },
];

export const TRAP_TIPS = [
  'Passive Perception 20+ is the best trap defense. Observant feat (+5).',
  'Always have Thieves\' Tools proficiency. Preferably expertise.',
  'Detect Magic ritual costs nothing. Cast regularly in dungeons.',
  'Send the familiar ahead. It\'s expendable.',
  'Mage Hand: open chests/doors/levers from 30ft. Free and safe.',
  'Find Traps is TERRIBLE. Only says traps exist, not where. Don\'t prepare it.',
  'Arcane Trickster Mage Hand can use Thieves\' Tools from 30ft range.',
  'Don\'t split the party in trapped dungeons.',
];
