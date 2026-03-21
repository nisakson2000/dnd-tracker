/**
 * playerTrapSurvival.js
 * Player Mode: Detecting, disarming, and surviving traps
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION = {
  passive: 'Passive Perception (10 + WIS mod + proficiency if proficient). Detects traps automatically if high enough.',
  active: 'Investigation check (INT) to search for traps. Usually requires stating "I search for traps."',
  dcRanges: [
    { dc: '10-12', difficulty: 'Easy', examples: 'Obvious pressure plate, tripwire at shin height' },
    { dc: '13-15', difficulty: 'Moderate', examples: 'Concealed pit, hidden arrow slit, trapped chest' },
    { dc: '16-18', difficulty: 'Hard', examples: 'Magical trap rune, well-hidden spike trap, illusory floor' },
    { dc: '19-22', difficulty: 'Very Hard', examples: 'Arcane ward, seamless pit cover, magical alarm' },
    { dc: '23+', difficulty: 'Nearly Impossible', examples: 'Ancient dwarven craft, deity-level ward, Glyph of Warding' },
  ],
  note: 'Perception SPOTS the trap. Investigation FIGURES OUT how it works. Thieves\' Tools DISARM it.',
};

export const TRAP_DISARMING = {
  check: 'Thieves\' Tools check (DEX + proficiency)',
  failing: 'Failing by 5+ usually triggers the trap. Failing by less = you know you can\'t disarm it.',
  alternatives: [
    'Trigger it from a distance (throw a rock, Mage Hand)',
    'Bypass it entirely (Fly, Misty Step, Dimension Door)',
    'Destroy the mechanism (fire, force, etc.)',
    'Dispel Magic on magical traps',
    'Find Another Route around the trapped area',
  ],
  magicTraps: 'Magical traps can be detected with Detect Magic and disarmed with Dispel Magic (or sometimes thieves\' tools).',
};

export const COMMON_TRAPS = [
  { trap: 'Pit Trap', detection: 'DC 10-15 Perception', damage: '1d6 per 10ft (+ spikes: +1d6 piercing)', disarm: 'N/A (avoid it)', save: 'DEX DC 10-15 to grab edge' },
  { trap: 'Poison Dart', detection: 'DC 15 Perception', damage: '1d4 piercing + 2d6 poison (CON save)', disarm: 'DC 15 Thieves\' Tools', save: 'CON DC 12-15 for half poison' },
  { trap: 'Swinging Blade', detection: 'DC 15 Perception', damage: '4d10 slashing', disarm: 'DC 15 Thieves\' Tools', save: 'DEX DC 15 for half' },
  { trap: 'Glyph of Warding', detection: 'DC 15+ Investigation (close inspection)', damage: '5d8 elemental', disarm: 'Dispel Magic DC 13+', save: 'DEX DC 13+ for half' },
  { trap: 'Collapsing Ceiling', detection: 'DC 15 Perception', damage: '4d10 bludgeoning', disarm: 'DC 20 Thieves\' Tools or avoid', save: 'DEX DC 15 for half' },
  { trap: 'Poison Gas', detection: 'DC 13 Perception', damage: '1d10 poison/round', disarm: 'Plug holes or leave area', save: 'CON DC 13/round' },
  { trap: 'Symbol', detection: 'DC 15+ Arcana/Investigation', damage: 'Varies (death, stun, fear, etc.)', disarm: 'Dispel Magic DC 15+', save: 'Various (WIS, CON, CHA)' },
  { trap: 'Sphere of Annihilation', detection: 'DC 20 Arcana', damage: 'Instant death (4d10 force if partial)', disarm: 'Talisman of the Sphere or Dispel Magic DC 18', save: 'None' },
];

export const TRAP_PREVENTION = [
  { method: 'Always search', detail: '10-foot pole, cautious movement, stating "I check for traps" at doorways and chests.', who: 'Rogue or highest Perception' },
  { method: 'Detect Magic ritual', detail: 'Reveals magical traps, glyphs, and wards. Cast constantly in dungeons.', who: 'Any ritual caster' },
  { method: 'Find Traps spell', detail: '2nd level Cleric. Reveals presence and general nature of traps within 120ft.', who: 'Cleric', note: 'Doesn\'t pinpoint exact location. Just "there\'s a trap nearby."' },
  { method: 'Mage Hand', detail: 'Open suspicious chests, pull levers, and trigger traps from 30ft away.', who: 'Wizard/Sorcerer/Warlock/Arcane Trickster' },
  { method: 'Familiar', detail: 'Send familiar ahead to trigger pressure plates. If familiar dies, resummon it.', who: 'Wizard' },
  { method: 'Passive Perception 20+', detail: 'Observant feat + WIS 20 + Perception proficiency = 25 passive. Spots almost everything.', who: 'Anyone with Observant' },
  { method: 'Evasion', detail: 'Rogue 7 / Monk 7. DEX save traps deal no damage on success, half on fail.', who: 'Rogue/Monk' },
];

export const DUNGEON_CRAWL_PROTOCOL = [
  'Scout leads. 60ft ahead. Stealth + Perception.',
  'Check EVERY door before opening. Listen, search, then open.',
  'Check EVERY chest before opening. Investigate, then Mage Hand if suspicious.',
  'Walk in the center of hallways. Avoid walls (arrow slits) and edges (pit traps).',
  'Have Detect Magic running constantly (ritual cast = free).',
  'The Rogue goes first. That\'s their job. Let them do it.',
  'If something looks too easy, it\'s a trap. Always.',
];

export function detectChance(perceptionBonus, trapDC) {
  const needed = trapDC - perceptionBonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function passiveDetects(passivePerception, trapDC) {
  return passivePerception >= trapDC;
}

export function disarmChance(thievesToolsBonus, trapDC) {
  const needed = trapDC - thievesToolsBonus;
  const chance = Math.min(95, Math.max(5, (21 - needed) * 5));
  const triggerChance = Math.max(0, (needed + 4) * 5); // Fail by 5+ triggers
  return { successChance: chance, triggerOnFailChance: Math.min(100, triggerChance) };
}
