/**
 * playerPlanarTravel.js
 * Player Mode: Planes of existence and planar travel reference
 * Pure JS — no React dependencies.
 */

export const PLANES = [
  { name: 'Material Plane', type: 'Prime', description: 'The "normal" world where most campaigns take place.', hazards: 'None inherent.' },
  { name: 'Feywild', type: 'Echo', description: 'Vibrant, magical echo of the Material Plane. Time moves differently.', hazards: 'Time distortion (hours = days, or vice versa). Fey bargains. Memory alteration.' },
  { name: 'Shadowfell', type: 'Echo', description: 'Dark, dreary echo of the Material Plane. Despair and undeath.', hazards: 'Despair (WIS saves or gain exhaustion). Shadow creatures. Negative energy.' },
  { name: 'Ethereal Plane', type: 'Transitive', description: 'Misty, overlapping plane. Ghosts and phase creatures exist here.', hazards: 'Ether cyclones (random teleportation). Can see into Material but can\'t interact.' },
  { name: 'Astral Plane', type: 'Transitive', description: 'Silver void connecting all planes. Thought-based movement.', hazards: 'Psychic Wind (INT save or stunned + teleported). Githyanki patrols. Color pools to other planes.' },
  { name: 'Elemental Plane of Fire', type: 'Inner', description: 'Infinite burning landscape. Everything is on fire.', hazards: 'Fire damage each round (10d10). Need fire immunity or protection.' },
  { name: 'Elemental Plane of Water', type: 'Inner', description: 'Infinite ocean. No surface, no bottom.', hazards: 'Drowning. Extreme pressure. Water Breathing required.' },
  { name: 'Elemental Plane of Air', type: 'Inner', description: 'Endless sky. Floating earth motes.', hazards: 'Falling forever. High winds. Need fly speed or feather fall.' },
  { name: 'Elemental Plane of Earth', type: 'Inner', description: 'Solid rock in all directions. Some caverns and tunnels.', hazards: 'Crushing. Suffocation. Need Earth Glide or Passwall.' },
  { name: 'Mount Celestia', type: 'Outer', description: 'Seven heavens. Lawful Good. Angels and archons.', hazards: 'Compulsion toward good behavior. Evil creatures uncomfortable.' },
  { name: 'The Nine Hells', type: 'Outer', description: 'Nine layers of tyranny. Lawful Evil. Devils and infernal contracts.', hazards: 'Soul contracts. Extreme environments per layer. Devil politics.' },
  { name: 'The Abyss', type: 'Outer', description: 'Infinite layers of chaos and evil. Demons and madness.', hazards: 'Madness. Corruption. Demon lords. Each layer has unique hazards.' },
];

export const PLANAR_TRAVEL_SPELLS = [
  { spell: 'Plane Shift (7th)', description: 'Transport up to 8 creatures to another plane. Requires a tuning fork attuned to the destination.' },
  { spell: 'Gate (9th)', description: 'Open a portal to a specific plane and location. Can also summon a specific creature.' },
  { spell: 'Etherealness (7th)', description: 'Enter the Ethereal Plane. Can see into the Material Plane (60ft).' },
  { spell: 'Astral Projection (9th)', description: 'Project your astral body into the Astral Plane. Silver cord connects to your body.' },
  { spell: 'Banishment (4th)', description: 'Send a creature to its home plane (if extraplanar) or a demiplane (if native). CHA save.' },
  { spell: 'Demiplane (8th)', description: 'Create a 30ft cube demiplane or open a door to a previously created one.' },
  { spell: 'Dream of the Blue Veil', description: 'Travel between campaign settings (Eberron, Forgotten Realms, etc.).' },
];

export function getPlaneInfo(name) {
  return PLANES.find(p => p.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getPlanesByType(type) {
  return PLANES.filter(p => p.type.toLowerCase() === (type || '').toLowerCase());
}
