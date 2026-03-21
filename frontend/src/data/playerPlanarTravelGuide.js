/**
 * playerPlanarTravelGuide.js
 * Player Mode: Planar travel — the planes, how to get there, and what to expect
 * Pure JS — no React dependencies.
 */

export const INNER_PLANES = [
  { plane: 'Material Plane', description: 'The "normal" world. Where most campaigns take place.', dangers: 'Standard.', access: 'You\'re already here.' },
  { plane: 'Feywild', description: 'Echo of Material Plane. Vibrant, emotional, time distortion. Home of fey.', dangers: 'Time warps (days = years). Fey bargains. Emotional manipulation. Getting lost.', access: 'Fey crossings, Plane Shift, natural portals at dawn/dusk.' },
  { plane: 'Shadowfell', description: 'Dark echo of Material Plane. Despair, undead, Domains of Dread (Ravenloft).', dangers: 'Despair (WIS saves or gain shadow madness). Undead everywhere. Domain Lords trap you.', access: 'Shadow crossings, Plane Shift, areas of deep shadow.' },
  { plane: 'Ethereal Plane', description: 'Overlaps Material. Ghostly, misty. Can see into Material but not interact.', dangers: 'Phase spiders, ghosts, getting lost in Deep Ethereal.', access: 'Etherealness, Blink, some creatures phase naturally.' },
];

export const OUTER_PLANES = [
  { plane: 'Mount Celestia', alignment: 'LG', description: 'Seven heavens. Angels, archons. Strict but good.', notable: 'Bahamut\'s palace on the 1st layer.' },
  { plane: 'Elysium', alignment: 'NG', description: 'Pure goodness. Rivers of joy. Dangerous because you never want to leave.', notable: 'WIS saves to leave or be trapped by bliss.' },
  { plane: 'Arborea', alignment: 'CG', description: 'Wild passion. Olympian realm. Eladrin, elven gods.', notable: 'Corellon Larethian\'s realm. Arvandor.' },
  { plane: 'Mechanus', alignment: 'LN', description: 'Giant clockwork gears. Absolute order. Modrons.', notable: 'Primus rules. Great Modron March.' },
  { plane: 'Limbo', alignment: 'CN', description: 'Pure chaos. Reality shifts constantly. Githzerai monasteries.', notable: 'INT check to stabilize matter around you.' },
  { plane: 'Nine Hells', alignment: 'LE', description: 'Nine layers. Devils, contracts, Asmodeus at the bottom.', notable: 'Each layer ruled by an Archdevil. Avernus is the battlefield.' },
  { plane: 'Abyss', alignment: 'CE', description: 'Infinite layers of chaos and evil. Demons. Demon Lords.', notable: '666+ layers. Each unique. Demogorgon, Orcus, etc.' },
  { plane: 'Hades', alignment: 'NE', description: 'Gray wastes. Despair and apathy. Yugoloths.', notable: 'Drains color, emotion, and memory over time.' },
  { plane: 'Astral Plane', alignment: 'N/A', description: 'Silver void connecting all planes. Timeless. Githyanki territory.', notable: 'No aging. No hunger. Move by thought. Color pools = portals.' },
];

export const PLANAR_TRAVEL_METHODS = [
  { method: 'Plane Shift', level: 7, reliability: 'S', note: 'Go to any plane. Requires tuning fork for target plane. Can banish enemies.' },
  { method: 'Gate', level: 9, reliability: 'S+', note: 'Open portal to exact location on another plane. Can summon specific creatures.' },
  { method: 'Etherealness', level: 7, reliability: 'A+', note: 'Enter Ethereal Plane. See into Material. Can\'t interact. Good for scouting.' },
  { method: 'Astral Projection', level: 9, reliability: 'A+', note: 'Project to Astral. Silver cord = lifeline. If cord is cut, you die.' },
  { method: 'Dream of the Blue Veil', level: 7, reliability: 'A', note: 'Travel between campaign settings (Forgotten Realms → Eberron).' },
  { method: 'Banishment', level: 4, reliability: 'A', note: 'Send extraplanar creature home. If native, send to demiplane for 1 min.' },
  { method: 'Natural Portals', level: 'N/A', reliability: 'Varies', note: 'Fey crossings, shadow crossings, planar rifts. DM-dependent.' },
  { method: 'Magic Items', level: 'N/A', reliability: 'Varies', note: 'Cubic Gate, Well of Many Worlds, Amulet of the Planes.' },
];

export const PLANAR_SURVIVAL_TIPS = [
  'Feywild: NEVER accept food, gifts, or make deals without careful wording. Fey exploit loopholes.',
  'Shadowfell: WIS saves against Despair. Bring morale buffs. Don\'t linger.',
  'Nine Hells: Devils offer contracts. READ EVERY WORD. They are literally lawyers.',
  'Abyss: Everything wants to kill you. No allies. Demons betray on principle.',
  'Astral Plane: No aging, no hunger. But Githyanki patrol and are hostile.',
  'Ethereal: Phase spiders hunt here. You can\'t interact with the Material (usually).',
  'Plane Shift requires a tuning fork attuned to the target plane. Expensive and rare.',
  'Banishment: if the target is native to the current plane, it only lasts 1 minute.',
  'Gate can summon a specific creature by name. Use wisely — they may be hostile.',
  'Many planes have environmental effects. Check with DM before going.',
];
