/**
 * playerDungeonCrawlTips.js
 * Player Mode: Dungeon crawling procedure and survival tips
 * Pure JS — no React dependencies.
 */

export const DUNGEON_PROCEDURE = [
  { step: 1, action: 'Establish Marching Order', detail: 'Who\'s in front? Who checks for traps? Who guards the rear?' },
  { step: 2, action: 'Light Sources', detail: 'Who has darkvision? Do you need torches/Light cantrip? Remember: darkvision doesn\'t give full vision in darkness.' },
  { step: 3, action: 'Check Doors Before Opening', detail: 'Perception to listen, Investigation to check for traps, Thieves\' Tools to pick locks.' },
  { step: 4, action: 'Map as You Go', detail: 'Someone should track which rooms you\'ve cleared and exits you haven\'t explored.' },
  { step: 5, action: 'Check for Traps Regularly', detail: 'Investigation or Perception (passive or active). 10-foot pole is your friend.' },
  { step: 6, action: 'Mark Cleared Rooms', detail: 'Chalk mark or similar. Don\'t re-enter cleared rooms without reason.' },
  { step: 7, action: 'Resource Checks', detail: 'Periodically check: spell slots, HP, consumables, torch duration.' },
  { step: 8, action: 'Retreat Plan', detail: 'Always know how to get back to the exit. Don\'t get surrounded.' },
];

export const DUNGEON_HAZARDS = [
  { hazard: 'Trapped Doors/Chests', detect: 'DC 12-20 Investigation', disarm: 'DC 12-20 Thieves\' Tools', tip: 'Mage Hand can open from 30ft away.' },
  { hazard: 'Pit Traps', detect: 'DC 15 passive Perception', disarm: 'Avoid or bridge', tip: 'Rope + pitons to cross. Or just jump (long jump = STR score in feet).' },
  { hazard: 'Collapsing Tunnels', detect: 'DC 10 Nature/Investigation', disarm: 'Shore up supports', tip: 'Move quickly through unstable areas. Don\'t fight here.' },
  { hazard: 'Poison Gas', detect: 'DC 15 Perception (smell)', disarm: 'Ventilation, Gust of Wind', tip: 'Hold breath: CON score ÷ 2 rounds. Then start suffocating.' },
  { hazard: 'Flooded Rooms', detect: 'Obvious', disarm: 'Drain or swim', tip: 'Water Breathing, swim speed, or improvised flotation.' },
  { hazard: 'Mimics', detect: 'DC 15+ Investigation', disarm: 'Don\'t touch suspicious objects', tip: 'Poke chests with a 10-foot pole before opening.' },
  { hazard: 'Green Slime', detect: 'DC 10 Perception', disarm: 'Fire, cold, or Sunlight', tip: 'Drops from ceilings. 1d10 acid per turn. Eats armor/flesh.' },
  { hazard: 'Yellow Mold', detect: 'DC 15 Nature', disarm: 'Fire or Sunlight', tip: 'Disturbing it releases spores: DC 15 CON or 2d10 poison + poisoned.' },
];

export const DUNGEON_SUPPLIES = [
  { item: 'Rope (50ft)', reason: 'Climbing, descending, tying things. Essential.' },
  { item: '10-foot Pole', reason: 'Trap detection, poking things from a distance.' },
  { item: 'Pitons & Hammer', reason: 'Climbing assists, securing rope, marking walls.' },
  { item: 'Chalk', reason: 'Mark cleared rooms, write notes on walls, draw trails.' },
  { item: 'Crowbar', reason: 'Open stuck doors/chests. Advantage on STR checks.' },
  { item: 'Ball Bearings', reason: 'Spread on floor: DEX save or fall prone. 10ft area.' },
  { item: 'Caltrops', reason: 'Spread on floor: 1 piercing + speed reduced to 0. 5ft area.' },
  { item: 'Healing Potions', reason: 'Emergency healing without spell slots.' },
  { item: 'Antitoxin', reason: 'Advantage vs poison for 1 hour. 50gp.' },
  { item: 'Torches/Lantern', reason: 'Even with darkvision, bright light reveals more.' },
];

export const TEN_FOOT_POLE_USES = [
  'Poke suspicious floor tiles from a distance.',
  'Prod chests before opening (Mimic check).',
  'Trigger pressure plates without stepping on them.',
  'Test depth of water/mud/pits.',
  'Push objects from 10 feet away.',
  'Prop open doors that might close.',
];

export function getDungeonChecklist() {
  return DUNGEON_PROCEDURE;
}

export function getHazardInfo(hazard) {
  return DUNGEON_HAZARDS.find(h => h.hazard.toLowerCase().includes((hazard || '').toLowerCase())) || null;
}
