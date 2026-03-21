/**
 * playerTerrainTactics.js
 * Player Mode: Tactical terrain usage and environmental advantages
 * Pure JS — no React dependencies.
 */

export const TERRAIN_TYPES = [
  { terrain: 'Forest', advantages: ['Half cover behind trees (+2 AC)', 'Hide behind trunks (Stealth)', 'Difficult terrain for enemies'], spells: ['Entangle (vines + existing roots)', 'Spike Growth (hidden in undergrowth)', 'Pass Without Trace'], tips: 'Use trees as cover. Force enemies into narrow paths. Druids/Rangers excel here.' },
  { terrain: 'Cave/Dungeon', advantages: ['Natural chokepoints', 'Darkness for ambush', 'Ceiling for dropping things'], spells: ['Darkness (total darkness + Devil\'s Sight)', 'Web (wall to wall coverage)', 'Silence (echoes stop)'], tips: 'Control chokepoints with Sentinel/PAM. Use Darkness if you have Devil\'s Sight. Watch the ceiling.' },
  { terrain: 'Open Field', advantages: ['Clear lines of sight for ranged', 'Room to spread vs AoE', 'Space for mounts'], spells: ['Fireball (no obstacles)', 'Fog Cloud (create your own cover)', 'Wall of Force (no terrain needed)'], tips: 'Ranged dominates. Melee characters need Dash or mobility spells. Create your own cover.' },
  { terrain: 'Urban/Buildings', advantages: ['Lots of cover options', 'Doorways = chokepoints', 'Rooftops for high ground'], spells: ['Misty Step (through windows/walls)', 'Shatter (structural damage)', 'Dimension Door (through buildings)'], tips: 'Fight in doorways. Use buildings as cover. Rooftops give advantage (DM dependent).' },
  { terrain: 'Water/River', advantages: ['Difficult terrain for non-swimmers', 'Chokepoint at bridges/fords', 'Push enemies in (no swimming = drowning)'], spells: ['Control Water (create waves)', 'Water Walk (party walks on water)', 'Lightning (bonus damage in water - DM call)'], tips: 'Push enemies into deep water. Heavy armor = drowning risk. Destroy the bridge behind you.' },
  { terrain: 'Cliff/Ravine', advantages: ['Falling damage (1d6/10ft)', 'Natural barrier', 'High ground for ranged'], spells: ['Gust of Wind (push off edges)', 'Telekinesis (shove off cliff)', 'Levitate (negate falling)'], tips: 'Shove enemies off edges. Thunderwave near cliffs is devastating. Always note ledge positions.' },
  { terrain: 'Swamp/Bog', advantages: ['Difficult terrain everywhere', 'Concealment in fog/mist', 'Creatures may sink'], spells: ['Freedom of Movement (ignore difficult terrain)', 'Water Walk (walk on mud)', 'Fog Cloud (match environment)'], tips: 'Difficult terrain halves movement. If you can ignore it (Monk, Freedom of Movement), you dominate.' },
];

export const ENVIRONMENTAL_WEAPONS = [
  { weapon: 'Chandelier', damage: '3d6 bludgeoning (DM call)', action: 'Cut the rope as an attack. Falls on creatures below.', note: 'Classic. Always ask if there\'s a chandelier.' },
  { weapon: 'Collapsing Pillar', damage: '4d10 bludgeoning (DM call)', action: 'Destroy structural supports. May affect ceiling too.', note: 'Risk of collateral damage. Clear your allies first.' },
  { weapon: 'Oil + Fire', damage: '5 fire per round', action: 'Pour oil, then ignite. 5ft area burns for 2 rounds.', note: 'Cheap and effective area denial.' },
  { weapon: 'Barrels/Crates', damage: '1d6-2d6 bludgeoning', action: 'Push from high ground. Roll down stairs.', note: 'Improvised but fun. DM discretion on damage.' },
  { weapon: 'Lava/Acid Pool', damage: '10d10 fire / 10d6 acid', action: 'Push enemy in. Thunderwave, Repelling Blast, Shove.', note: 'Extremely dangerous. One push can end an encounter.' },
  { weapon: 'Flood Gate', damage: 'Varies (knockdown + sweep)', action: 'Open gates to release water. STR save or swept away.', note: 'Situational but dramatic. Look for water sources above.' },
];

export const TERRAIN_CREATION_SPELLS = [
  { spell: 'Spike Growth', level: 2, effect: 'Difficult terrain + 2d4 piercing per 5ft moved. 20ft radius.', tactic: 'Cast and push enemies through it. Repelling Blast + Spike Growth = massive damage.' },
  { spell: 'Wall of Fire', level: 4, effect: '5d8 fire for entering/ending turn. One-sided.', tactic: 'Place behind enemies. They take damage retreating or staying.' },
  { spell: 'Wall of Force', level: 5, effect: 'Indestructible barrier. Splits the battlefield.', tactic: 'Separate enemies. Fight half at a time. Dome to trap.' },
  { spell: 'Fog Cloud', level: 1, effect: 'Heavily obscured area. Blocks line of sight.', tactic: 'Block enemy ranged attacks. Escape through it. Block Counterspell.' },
  { spell: 'Plant Growth', level: 3, effect: '100ft radius = 4x movement cost. No save. No concentration!', tactic: 'Massive area denial. Enemies need 4ft of movement per 1ft traveled.' },
];

export function getTerrainTactics(terrainName) {
  return TERRAIN_TYPES.find(t =>
    t.terrain.toLowerCase().includes((terrainName || '').toLowerCase())
  ) || null;
}

export function getTerrainSpells(terrainName) {
  const terrain = getTerrainTactics(terrainName);
  return terrain ? terrain.spells : [];
}
