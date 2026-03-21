/**
 * playerDungeonSurvival.js
 * Player Mode: Dungeon crawl survival — light, traps, navigation, and resource management
 * Pure JS — no React dependencies.
 */

export const DUNGEON_ESSENTIALS = [
  { item: 'Light source', detail: 'Torch (20ft bright + 20ft dim, 1 hour), Lantern (30ft + 30ft, 6 hours), Light cantrip (60 minutes).', priority: 'S' },
  { item: 'Rope (50ft)', detail: 'Climbing, binding prisoners, improvised bridges, lowering into pits. 1 gp.', priority: 'S' },
  { item: '10-foot pole', detail: 'Prod suspicious areas from a distance. Check for traps, hidden pits, illusory walls.', priority: 'A' },
  { item: 'Pitons', detail: 'Hammer into walls for climbing anchors. 5 cp each.', priority: 'B' },
  { item: 'Chalk', detail: 'Mark explored corridors. Leave messages. 1 cp.', priority: 'A' },
  { item: 'Thieves\' tools', detail: 'Required for disarming traps and picking locks. Need proficiency.', priority: 'S' },
  { item: 'Crowbar', detail: 'Advantage on STR checks to pry things open. 2 gp.', priority: 'B' },
  { item: 'Healer\'s kit', detail: '10 uses. Stabilize without Medicine check. 5 gp.', priority: 'A' },
  { item: 'Ball bearings/Caltrops', detail: 'Block corridors behind you. Slow pursuers. 1 gp each.', priority: 'B' },
  { item: 'Rations (per day)', detail: '5 sp per day. Don\'t forget food and water on multi-day dungeons.', priority: 'A' },
];

export const DUNGEON_CRAWL_PROCEDURE = [
  { phase: 'Marching Order', detail: 'Decide who walks in front (trap-finder), middle (casters), and rear (rearguard). Stick to it.' },
  { phase: 'Light Management', detail: 'Who carries the torch? Darkvision users: remember dim light = disadvantage on Perception.' },
  { phase: 'Checking for Traps', detail: 'Lead character: Investigation/Perception. Check every door, corridor, and suspicious area.' },
  { phase: 'Mapping', detail: 'Someone should draw a map. Or use chalk to mark walls. Getting lost in a dungeon is dangerous.' },
  { phase: 'Door Protocol', detail: 'Listen before opening (Perception). Check for traps (Investigation). Then open carefully.' },
  { phase: 'Rest Decisions', detail: 'When to short rest? Secure room, barricade doors, set Alarm spell.' },
  { phase: 'Resource Tracking', detail: 'Track torches, spell slots, HP, and consumables. You don\'t know when you\'ll get out.' },
];

export const TRAP_HANDLING = {
  detection: {
    passive: 'Passive Perception notices obvious traps. DM compares trap DC to your passive.',
    active: 'Investigation check to actively search. Higher DC than passive detection.',
    magic: 'Detect Magic reveals magical traps. Find Traps (2nd level) pings trap presence (but not location).',
  },
  disarming: {
    thieves: 'Thieves\' tools + proficiency. Dexterity check vs trap DC.',
    magical: 'Dispel Magic on magical traps. Or trigger from a distance.',
    creative: 'Pour water on pressure plates. Wedge mechanisms. Block with Mage Hand.',
  },
  triggerSafely: [
    'Use Mage Hand to trigger from 30ft away.',
    'Throw rocks at pressure plates.',
    'Send the familiar (it can be re-summoned for 10 gp).',
    'Cast a cantrip at a suspicious area from max range.',
    'Toss a ball bearing or coin to trigger tripwires.',
  ],
};

export const LIGHT_RULES = {
  brightLight: 'Normal vision. All abilities work normally.',
  dimLight: 'Lightly obscured. Disadvantage on Wisdom (Perception) checks that rely on sight.',
  darkness: 'Heavily obscured. Effectively blinded without darkvision or a light source.',
  lightSources: [
    { source: 'Torch', bright: '20ft', dim: '20ft', duration: '1 hour', note: 'Free hand occupied.' },
    { source: 'Lantern (hooded)', bright: '30ft', dim: '30ft', duration: '6 hours', note: 'Can be shuttered to hide light.' },
    { source: 'Light cantrip', bright: '20ft', dim: '20ft', duration: '1 hour', note: 'No hand needed. Cast on any object.' },
    { source: 'Dancing Lights', bright: '10ft each', dim: '10ft each', duration: '1 minute (concentration)', note: '4 floating lights. Flexible but concentration.' },
    { source: 'Continual Flame', bright: '20ft', dim: '20ft', duration: 'Permanent', note: '50 gp. Cast once, lasts forever. Best value.' },
    { source: 'Daylight', bright: '60ft', dim: '60ft', duration: '1 hour', note: '3rd level. NOT actual sunlight (doesn\'t harm vampires).' },
  ],
};

export const SECRET_DOORS = {
  detection: 'Investigation check. DC usually 15-20. Elves: advantage on Perception to detect (Keen Senses).',
  hints: [
    'Odd drafts or temperature changes',
    'Walls that don\'t match the surrounding architecture',
    'Dust patterns (undisturbed dust = nobody walks there; no dust = frequent traffic)',
    'Sconces, statues, or decorations that look interactive',
    'Asymmetric rooms (one wall shorter than expected = hidden space)',
  ],
  spells: ['Detect Magic (if enchanted)', 'Find Traps (pings trap presence)', 'See Invisibility (some doors are invisible)', 'Passwall (skip the door entirely)'],
};

export function lightCoverage(sources) {
  return sources.reduce((total, s) => total + s.bright + s.dim, 0);
}

export function trapDetectionDC(trapTier) {
  const dcs = { simple: 10, moderate: 15, complex: 20, deadly: 25 };
  return dcs[trapTier] || 15;
}
