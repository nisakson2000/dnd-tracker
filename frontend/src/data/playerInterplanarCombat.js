/**
 * playerInterplanarCombat.js
 * Player Mode: Fighting on other planes — Astral, Ethereal, Elemental Planes, and their unique rules
 * Pure JS — no React dependencies.
 */

export const ASTRAL_PLANE = {
  name: 'Astral Plane',
  traits: [
    'No gravity — you fly by thinking. Movement = INT score × 3 ft.',
    'No need for food, water, or air.',
    'No aging. You don\'t age while in the Astral Plane.',
    'Dead gods float here as massive stone husks.',
    'Psychic Wind: Random hazard. INT save or be blown off course.',
  ],
  combatChanges: [
    'Movement is based on INT, not STR/DEX speed.',
    'Ranged attacks work normally but there\'s no gravity to arc projectiles.',
    'Spells work normally with a few exceptions (no conjuration to Material Plane).',
    'Githyanki and astral dreadnoughts are common threats.',
  ],
  threats: ['Githyanki raiders', 'Astral Dreadnought (avoid at all costs)', 'Psychic Wind'],
};

export const ETHEREAL_PLANE = {
  name: 'Ethereal Plane',
  traits: [
    'Overlaps the Material Plane — you can see into both.',
    'You\'re ghostly and incorporeal. Pass through objects on the Material Plane.',
    'Creatures on the Material Plane can\'t see or interact with you (usually).',
    'Force effects (Wall of Force) extend into the Ethereal.',
  ],
  combatChanges: [
    'You can\'t affect creatures on the Material Plane and vice versa (usually).',
    'Force damage and effects can cross the boundary.',
    'See Invisibility and True Seeing can see into the Ethereal.',
    'Ghosts and Phase Spiders fight FROM the Ethereal — they can attack you but you can\'t hit back without Ethereal access.',
  ],
  threats: ['Ghosts (possess from Ethereal)', 'Phase Spiders', 'Night Hags (Etherealness at will)'],
  counters: [
    'Force damage works across planes (Magic Missile, Eldritch Blast)',
    'See Invisibility or True Seeing to spot ethereal creatures',
    'Banishment sends them back to their native plane',
    'Forbiddance prevents teleportation (including ethereal travel) in an area',
  ],
};

export const ELEMENTAL_PLANES = {
  fire: {
    name: 'Plane of Fire',
    environment: 'Everything is on fire. Literally. Ground is basalt and obsidian over magma.',
    hazards: ['Fire damage from environment (DM discretion)', 'Difficult to breathe (toxic fumes)', 'Efreet and fire elementals'],
    preparation: ['Fire resistance is MANDATORY', 'Absorb Elements prepared', 'Cold damage spells are effective', 'Protection from Energy: Fire'],
  },
  water: {
    name: 'Plane of Water',
    environment: 'Infinite ocean. No surface. Underwater in all directions.',
    hazards: ['Underwater combat rules apply', 'Drowning if you can\'t breathe water', 'Crushing pressure in deep areas'],
    preparation: ['Water Breathing spell', 'Freedom of Movement (full speed underwater)', 'Weapons that work underwater: piercing only without disadvantage', 'Lightning spells have extended range in water (DM ruling)'],
  },
  air: {
    name: 'Plane of Air',
    environment: 'Infinite sky. Floating earth motes. Constant wind.',
    hazards: ['No ground — falling forever if knocked off a platform', 'Hurricane-force winds', 'Air elementals and djinn'],
    preparation: ['Fly spell or Winged Boots', 'Feather Fall prepared', 'Lightning resistance may help', 'Ranged attacks affected by wind (DM ruling)'],
  },
  earth: {
    name: 'Plane of Earth',
    environment: 'Solid rock in all directions. Tunnels and caverns.',
    hazards: ['Cave-ins', 'No light', 'Xorn and earth elementals', 'Getting lost in infinite tunnels'],
    preparation: ['Darkvision', 'Passwall or Meld into Stone', 'Tremorsense items are invaluable', 'Thunder damage may cause collapses'],
  },
};

export const PLANAR_COMBAT_TIPS = [
  { tip: 'Know the plane\'s hazards before arriving', detail: 'Each plane has unique environmental effects. Prepare with appropriate spells and items.', priority: 'S' },
  { tip: 'Bring Plane Shift components', detail: 'You need a tuning fork attuned to your destination. Without it, you can\'t leave.', priority: 'S' },
  { tip: 'Force damage works everywhere', detail: 'Force damage bypasses most planar protections. Eldritch Blast and Magic Missile work on any plane.', priority: 'A' },
  { tip: 'Native creatures have advantages', detail: 'Creatures native to a plane are often immune to its hazards. Fire elementals don\'t take fire damage.', priority: 'A' },
  { tip: 'Banishment is more powerful on other planes', detail: 'If a creature is NOT native to the current plane, Banishment sends them home permanently (if maintained).', priority: 'S' },
  { tip: 'Forbiddance blocks planar travel', detail: '6th level Cleric ritual. Prevents teleportation and planar travel in the area. Great for defense.', priority: 'A' },
];

export function getPlanarPrep(plane) {
  if (plane === 'astral') return ['INT-based movement', 'Psychic defense', 'Avoid Astral Dreadnoughts'];
  if (plane === 'ethereal') return ['Force damage spells', 'See Invisibility', 'Forbiddance'];
  const elemental = ELEMENTAL_PLANES[plane];
  return elemental ? elemental.preparation : ['Plane Shift components', 'Protection from Energy'];
}

export function getPlanarThreats(plane) {
  if (plane === 'astral') return ASTRAL_PLANE.threats;
  if (plane === 'ethereal') return ETHEREAL_PLANE.threats;
  const elemental = ELEMENTAL_PLANES[plane];
  return elemental ? elemental.hazards : ['Unknown threats — proceed with caution'];
}
