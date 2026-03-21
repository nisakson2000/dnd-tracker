/**
 * Magic Zones & Planar Effects — D&D 5e
 *
 * Covers roadmap items 183, 457 (Ley lines / magic zones, Planar travel).
 * Wild magic, dead magic, enhanced magic areas, and plane-specific effects.
 */

const d = (n) => Math.floor(Math.random() * n) + 1;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Magic Zone Types ──
export const MAGIC_ZONES = {
  normal: {
    label: 'Normal Magic',
    description: 'Magic functions as expected.',
    effects: [],
    spellModifier: 0,
    color: '#6b7280',
  },
  wildMagic: {
    label: 'Wild Magic Zone',
    description: 'Magic is unpredictable. Every spell has a chance of triggering a wild magic surge.',
    effects: [
      'All spellcasters roll d20 after casting a spell of 1st level or higher',
      'On a 1, roll on the Wild Magic Surge table',
      'Sorcerers with Wild Magic origin: surge range increases to 1-3',
      'Cantrips may produce minor visual anomalies (cosmetic only)',
    ],
    spellModifier: 0,
    color: '#a855f7',
  },
  enhancedMagic: {
    label: 'Enhanced Magic Zone',
    description: 'Magical energy is amplified. Spells are more powerful.',
    effects: [
      'Spell save DCs increase by 2',
      'Spell attack rolls gain +2',
      'Healing spells heal an additional 1d4',
      'Spell durations are doubled (up to DM discretion)',
      'Detect Magic reveals the zone as a strong magical aura',
    ],
    spellModifier: 2,
    color: '#3b82f6',
  },
  deadMagic: {
    label: 'Dead Magic Zone',
    description: 'No magic functions. Spells fail, magic items become mundane, summoned creatures vanish.',
    effects: [
      'Spells cannot be cast',
      'Active spell effects are suppressed (resume when leaving)',
      'Magic items lose their properties temporarily',
      'Summoned/conjured creatures disappear (return when leaving if duration remains)',
      'Antimagic Field has no additional effect (already dead)',
    ],
    spellModifier: -999,
    color: '#1f2937',
  },
  leyLine: {
    label: 'Ley Line',
    description: 'A river of raw magical energy flowing through the earth. Powerful but dangerous.',
    effects: [
      'Spells cast while touching the ley line are empowered: +1 spell level effect',
      'Arcana DC 15 to tap safely; failure causes 2d6 force damage',
      'Ritual casting time halved',
      'Long rest on a ley line grants a free casting of one expended spell slot',
      'Creatures sensitive to magic can feel the ley line from 100 feet away',
    ],
    spellModifier: 1,
    color: '#eab308',
  },
  thinVeil: {
    label: 'Thin Veil',
    description: 'The boundary between planes is weak here. Glimpses of other realms bleed through.',
    effects: [
      'Summoning and conjuration spells have advantage on related checks',
      'Planar creatures may accidentally slip through',
      'Dreams are vivid and may contain visions of the nearby plane',
      'Divination spells gain extended range or clarity',
      'At midnight: DC 15 Perception to hear whispers from beyond',
    ],
    spellModifier: 0,
    color: '#06b6d4',
  },
  corruptedMagic: {
    label: 'Corrupted Magic Zone',
    description: 'Magic is tainted by necrotic or fiendish energy. Healing is weakened, damage is twisted.',
    effects: [
      'Healing spells heal for half (minimum 1)',
      'Necrotic damage deals an extra 1d4',
      'Undead gain +2 to attack and damage rolls',
      'Radiant damage is reduced by half',
      'Long rest in corrupted zone: DC 12 CON save or gain 1 exhaustion',
    ],
    spellModifier: 0,
    color: '#7c3aed',
  },
};

// ── Wild Magic Surge Table (d100) ──
export const WILD_MAGIC_SURGES = [
  { roll: '01-02', effect: 'Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.' },
  { roll: '03-04', effect: 'For the next minute, you can see any invisible creature if you have line of sight to it.' },
  { roll: '05-06', effect: 'A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.' },
  { roll: '07-08', effect: 'You cast fireball as a 3rd-level spell centered on yourself.' },
  { roll: '09-10', effect: 'You cast magic missile as a 5th-level spell.' },
  { roll: '11-12', effect: 'Roll a d10. Your height changes by a number of inches equal to the roll. If odd, you shrink. If even, you grow.' },
  { roll: '13-14', effect: 'You cast confusion centered on yourself.' },
  { roll: '15-16', effect: 'For the next minute, you regain 5 hit points at the start of each of your turns.' },
  { roll: '17-18', effect: 'You grow a long beard made of feathers that remains until you sneeze.' },
  { roll: '19-20', effect: 'You cast grease centered on yourself.' },
  { roll: '21-22', effect: 'Creatures have disadvantage on saving throws against the next spell you cast in the next minute.' },
  { roll: '23-24', effect: 'Your skin turns a vibrant shade of blue. Remove curse ends it.' },
  { roll: '25-26', effect: 'An eye appears on your forehead for the next minute. During that time, you have advantage on Perception checks that rely on sight.' },
  { roll: '27-28', effect: 'For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.' },
  { roll: '29-30', effect: 'You teleport up to 60 feet to an unoccupied space of your choice that you can see.' },
  { roll: '31-32', effect: 'You are transported to the Astral Plane until the end of your next turn, then return.' },
  { roll: '33-34', effect: 'Maximize the damage of the next damaging spell you cast within the next minute.' },
  { roll: '35-36', effect: 'Roll a d10. Your age changes by a number of years equal to the roll. If odd, younger. If even, older.' },
  { roll: '37-38', effect: '1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet and are frightened of you. They vanish after 1 minute.' },
  { roll: '39-40', effect: 'You regain 2d10 hit points.' },
  { roll: '41-42', effect: 'You turn into a potted plant until the start of your next turn. You are incapacitated and have vulnerability to all damage. If you drop to 0 HP, the pot breaks and you return to normal.' },
  { roll: '43-44', effect: 'For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.' },
  { roll: '45-46', effect: 'You cast levitate on yourself.' },
  { roll: '47-48', effect: 'A unicorn controlled by the DM appears within 5 feet and disappears after 1 minute.' },
  { roll: '49-50', effect: 'You can\'t speak for the next minute. Whenever you try, pink bubbles float out of your mouth.' },
];

// ── Planes of Existence ──
export const PLANES = {
  materialPlane: {
    label: 'Material Plane',
    description: 'The prime world where most adventures take place.',
    effects: [],
    magicType: 'normal',
  },
  feywild: {
    label: 'Feywild',
    description: 'An echo of the Material Plane, vibrant and magical. Time moves differently.',
    effects: [
      'Enchantment spells have advantage on saves to resist',
      'Time distortion: 1 day here may be 1 minute or 1 year on Material Plane (DM\'s choice)',
      'Memory can become hazy — WIS save DC 15 or forget mundane details',
      'Natural beauty — Advantage on Performance and Persuasion checks',
      'Emotions are heightened — Disadvantage on saves vs Frightened and Charmed',
    ],
    magicType: 'enhancedMagic',
    inhabitants: ['Fey', 'Eladrin', 'Pixies', 'Satyrs', 'Hags', 'Archfey'],
  },
  shadowfell: {
    label: 'Shadowfell',
    description: 'A dark mirror of the Material Plane. Color is muted, despair lingers.',
    effects: [
      'Necrotic damage deals an extra die',
      'Radiant damage reduced by one die',
      'Long rest: DC 10 WIS save or gain level of despair (similar to exhaustion)',
      'Darkvision range doubled',
      'Healing spells heal for minimum values',
    ],
    magicType: 'corruptedMagic',
    inhabitants: ['Undead', 'Shadar-kai', 'Shadow Dragons', 'The Raven Queen'],
  },
  etherealPlane: {
    label: 'Ethereal Plane',
    description: 'An overlapping plane of mist and ghostly shapes. The border between worlds.',
    effects: [
      'Can see into Material Plane (60 ft, greyed out)',
      'Movement in any direction including up/down',
      'Can\'t affect or be affected by Material Plane creatures (normally)',
      'Force effects and some spells can reach across',
      'Gravity is subjective — move by willpower',
    ],
    magicType: 'normal',
    inhabitants: ['Ghosts', 'Phase Spiders', 'Night Hags', 'Ethereal Filchers'],
  },
  astralPlane: {
    label: 'Astral Plane',
    description: 'The plane of thought and dream. Silvery void connecting all planes.',
    effects: [
      'No aging — creatures don\'t age while here',
      'No need for food, water, or air',
      'Movement by thought: INT score × 3 ft flying speed',
      'Dead gods float here as massive corpses',
      'Psychic damage deals extra die',
    ],
    magicType: 'enhancedMagic',
    inhabitants: ['Githyanki', 'Astral Dreadnought', 'Angels (traveling)', 'Mind Flayers'],
  },
  elemental: {
    label: 'Elemental Planes',
    description: 'Four planes of pure elemental energy — fire, water, earth, air.',
    subtypes: {
      fire: { effects: ['Fire immunity required or 5d10 fire damage/round', 'Water evaporates instantly', 'Metal objects become searing hot'], inhabitants: ['Fire Elementals', 'Efreeti', 'Salamanders', 'Azers'] },
      water: { effects: ['Entirely underwater', 'Swim speed or drowning rules apply', 'Cold near ice borders'], inhabitants: ['Water Elementals', 'Marids', 'Merfolk', 'Sahuagin'] },
      earth: { effects: ['Crushing pressure in solid areas', 'Tunnels and caverns', 'Tremorsense useful'], inhabitants: ['Earth Elementals', 'Dao', 'Xorn', 'Galeb Duhr'] },
      air: { effects: ['Endless sky — falling forever without ground', 'Flying required or fall', 'Powerful winds'], inhabitants: ['Air Elementals', 'Djinni', 'Aarakocra', 'Cloud Giants'] },
    },
    magicType: 'enhancedMagic',
  },
  lowerPlanes: {
    label: 'Lower Planes (Hells & Abyss)',
    description: 'Realms of evil — the Nine Hells (lawful evil) and the Abyss (chaotic evil).',
    effects: [
      'Non-evil creatures: Disadvantage on death saves',
      'Fiends regenerate 10 HP per round on their home plane',
      'Corruption: Long rest requires DC 15 WIS save or alignment shifts slightly toward evil',
      'Portals to Material Plane are heavily guarded or hidden',
    ],
    magicType: 'corruptedMagic',
    inhabitants: ['Devils', 'Demons', 'Yugoloths', 'Damned souls'],
  },
  upperPlanes: {
    label: 'Upper Planes (Celestia & Elysium)',
    description: 'Realms of good — Mount Celestia (lawful good), Elysium (neutral good), Arborea (chaotic good).',
    effects: [
      'Non-good creatures: Disadvantage on attack rolls and ability checks',
      'Healing spells heal maximum values',
      'Radiant damage deals extra die',
      'Sense of peace: Advantage on saves vs Frightened',
    ],
    magicType: 'enhancedMagic',
    inhabitants: ['Angels', 'Archons', 'Celestials', 'Blessed souls'],
  },
};

/**
 * Get magic zone info.
 */
export function getMagicZone(type) {
  return MAGIC_ZONES[type] || MAGIC_ZONES.normal;
}

/**
 * Get all magic zone types for UI.
 */
export function getMagicZoneTypes() {
  return Object.entries(MAGIC_ZONES).map(([key, z]) => ({
    id: key,
    label: z.label,
    description: z.description,
    color: z.color,
  }));
}

/**
 * Roll a wild magic surge.
 */
export function rollWildMagicSurge() {
  const roll = d(50); // We have 25 entries, each covers 2 numbers
  const index = Math.min(Math.floor((roll - 1) / 2), WILD_MAGIC_SURGES.length - 1);
  return { roll: roll * 2 - 1, ...WILD_MAGIC_SURGES[index] };
}

/**
 * Get plane info.
 */
export function getPlane(key) {
  return PLANES[key] || null;
}

/**
 * Get all planes for UI.
 */
export function getAllPlanes() {
  return Object.entries(PLANES).map(([key, p]) => ({
    id: key,
    label: p.label,
    description: p.description,
  }));
}

/**
 * Check if a spell should be modified by the current magic zone.
 */
export function getSpellModifier(zoneType) {
  const zone = MAGIC_ZONES[zoneType];
  if (!zone) return 0;
  return zone.spellModifier;
}
