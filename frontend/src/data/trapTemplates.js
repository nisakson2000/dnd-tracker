/**
 * Trap Templates — Pre-built traps with triggers, effects, saves, and disarm options.
 */

export const TRAPS = [
  {
    name: 'Pit Trap',
    cr: '0-1',
    trigger: 'Weight on pressure plate (20+ lbs)',
    effect: 'Target falls 10 feet into a pit. 1d6 bludgeoning damage.',
    save: 'DEX DC 12 to catch the edge',
    detection: 'Perception DC 12 (notice the discolored floor)',
    disarm: 'Thieves\' tools DC 10 (jam the mechanism) or wedge the plate',
    reset: 'Manual (must be re-set)',
    variant: 'Spiked pit: +1d6 piercing. Locking pit: lid closes after 1 round.',
  },
  {
    name: 'Poison Dart',
    cr: '1-2',
    trigger: 'Tripwire or pressure plate',
    effect: '1d4 piercing + 2d6 poison damage. +8 to hit.',
    save: 'CON DC 13 (half poison damage)',
    detection: 'Perception DC 14 (spot the tiny holes in the wall)',
    disarm: 'Thieves\' tools DC 13 (block the dart holes or cut the wire)',
    reset: 'Automatic (limited ammo: 4 darts)',
    variant: 'Sleep darts: no damage but CON DC 13 or fall unconscious 1 minute.',
  },
  {
    name: 'Glyph of Warding',
    cr: '3-5',
    trigger: 'Opening a door, reading a scroll, or entering an area',
    effect: '5d8 damage (type chosen by creator). 20-foot radius.',
    save: 'DEX DC 15 (half damage)',
    detection: 'Investigation DC 15 (spot the faint magical inscription)',
    disarm: 'Dispel Magic (DC 13) or Arcana DC 16 to carefully erase the glyph',
    reset: 'None (destroyed when triggered)',
    variant: 'Spell glyph: stores a spell instead (Hold Person, Fear, Stinking Cloud).',
  },
  {
    name: 'Collapsing Ceiling',
    cr: '2-4',
    trigger: 'Removing an item from a pedestal or pulling a lever',
    effect: '4d10 bludgeoning damage in a 10-foot area. Buried creatures are restrained.',
    save: 'DEX DC 14 (half damage, not buried)',
    detection: 'Perception DC 16 (notice cracks in the ceiling)',
    disarm: 'Not easily disarmable. Can be triggered safely from range.',
    reset: 'None (permanent)',
    variant: 'Partial collapse: some areas are safe zones (Investigation DC 13 to identify).',
  },
  {
    name: 'Swinging Blade',
    cr: '1-3',
    trigger: 'Pressure plate in corridor',
    effect: '2d10 slashing damage. +8 to hit against all in a 5-foot line.',
    save: 'DEX DC 13 to drop prone and avoid',
    detection: 'Perception DC 13 (slots in walls where blades emerge)',
    disarm: 'Thieves\' tools DC 14 (jam the mechanism) or STR DC 16 to bend the blade',
    reset: 'Automatic (mechanical)',
    variant: 'Poisoned blade: +2d6 poison on hit. Dual blades: two saves.',
  },
  {
    name: 'Flooding Room',
    cr: '3-5',
    trigger: 'Entering the room (door locks behind)',
    effect: 'Room floods in 4 rounds. After round 4, drowning rules apply.',
    save: 'STR DC 14 to force the door. Athletics DC 12 to swim.',
    detection: 'Perception DC 15 (water stains on walls, drain grates)',
    disarm: 'Find the hidden drain plug (Investigation DC 14) or break the water source',
    reset: 'Manual (drain and refill)',
    variant: 'Acid flooding: 2d6 acid damage per round while submerged.',
  },
  {
    name: 'Alarm Trap',
    cr: '0',
    trigger: 'Opening a door, chest, or crossing a threshold',
    effect: 'Loud alarm audible for 300 feet. Alerts guards/monsters.',
    save: 'None',
    detection: 'Perception DC 12 (thin wire) or Arcana DC 12 (magical alarm)',
    disarm: 'Thieves\' tools DC 10 (mechanical) or Dispel Magic (magical)',
    reset: 'Automatic',
    variant: 'Silent alarm: only alerts a specific creature telepathically.',
  },
  {
    name: 'Fire Trap',
    cr: '2-4',
    trigger: 'Opening a container or walking through a doorway',
    effect: '4d6 fire damage in a 10-foot radius. Flammable objects ignite.',
    save: 'DEX DC 14 (half damage)',
    detection: 'Investigation DC 14 (alchemical residue) or Arcana DC 13 (magical variant)',
    disarm: 'Thieves\' tools DC 14 (disconnect the ignition source)',
    reset: 'None (expended)',
    variant: 'Delayed fire: ignites after 1 round (escape window). Greek fire: sticks to targets, 1d6/round for 3 rounds.',
  },
  {
    name: 'Charm Trap',
    cr: '3-5',
    trigger: 'Reading an inscription or gazing at a painting',
    effect: 'WIS DC 15 or be charmed. Charmed creature guards the area for 1 hour.',
    save: 'WIS DC 15 to resist. Repeat save every 10 minutes.',
    detection: 'Arcana DC 15 (enchantment aura)',
    disarm: 'Remove Curse or Dispel Magic. Or avert eyes (disadvantage on Perception).',
    reset: 'Automatic',
    variant: 'Suggestion trap: compels specific action (leave, attack allies, confess).',
  },
  {
    name: 'Net Trap',
    cr: '0-1',
    trigger: 'Tripwire',
    effect: 'Target is restrained. STR DC 12 or slashing damage to the net (AC 10, 5 HP) to escape.',
    save: 'DEX DC 12 to avoid',
    detection: 'Perception DC 12',
    disarm: 'Cut the tripwire (Thieves\' tools DC 8)',
    reset: 'Manual',
    variant: 'Electrified net: 1d6 lightning damage per round while restrained.',
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateTrap(crRange = null) {
  if (crRange) {
    const filtered = TRAPS.filter(t => t.cr === crRange);
    return filtered.length > 0 ? pick(filtered) : pick(TRAPS);
  }
  return pick(TRAPS);
}

export function getTrapsByCR(crRange) {
  return TRAPS.filter(t => t.cr === crRange);
}

export function getAllTraps() {
  return [...TRAPS];
}
