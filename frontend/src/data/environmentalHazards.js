/**
 * Environmental Hazards — Terrain dangers for combat encounters.
 * DMs can add these to encounters to create dynamic, dangerous environments.
 */

export const HAZARD_TYPES = {
  lava: {
    label: 'Lava / Magma',
    damage: '10d10 fire',
    save: null,
    description: 'Molten rock flows across the area. Any creature that enters the lava or starts its turn there takes 10d10 fire damage.',
    effect: 'Destroys non-magical equipment on contact.',
    terrain: ['mountain', 'underdark', 'dungeon'],
  },
  collapsing_floor: {
    label: 'Collapsing Floor',
    damage: '2d6 bludgeoning + fall',
    save: 'DEX DC 13',
    description: 'The floor is unstable. When weight is applied, sections collapse. DEX save or fall 10-30 feet.',
    effect: 'Creates difficult terrain. Fallen creatures are prone.',
    terrain: ['dungeon', 'ruins', 'cave'],
  },
  poison_gas: {
    label: 'Poison Gas Cloud',
    damage: '3d6 poison',
    save: 'CON DC 14',
    description: 'Toxic fumes fill the area. Creatures that start their turn in the gas must make a CON save or take poison damage and be poisoned until the start of their next turn.',
    effect: 'Heavily obscured. Holding breath delays the save for 1 round.',
    terrain: ['swamp', 'dungeon', 'underdark', 'cave'],
  },
  rising_water: {
    label: 'Rising Water',
    damage: 'Drowning rules',
    save: 'STR DC 12 (swim)',
    description: 'Water rises 1 foot per round. After 3 rounds, medium creatures must swim. After 6 rounds, the room is flooded.',
    effect: 'Difficult terrain when waist-deep. Ranged attacks at disadvantage underwater.',
    terrain: ['dungeon', 'cave', 'coastal', 'ship'],
  },
  fire_spread: {
    label: 'Spreading Fire',
    damage: '2d6 fire per round',
    save: 'DEX DC 12',
    description: 'Fire spreads 5 feet per round in a random direction. Creatures in the fire take 2d6 fire damage at the start of their turn.',
    effect: 'Creates smoke (lightly obscured). Consumes wooden structures.',
    terrain: ['forest', 'urban', 'tavern'],
  },
  quicksand: {
    label: 'Quicksand',
    damage: 'None (suffocation)',
    save: 'STR DC 12 to escape',
    description: 'A 10-foot area of quicksand. Creatures that enter sink 1d4 feet per round. At 5 feet deep, restrained. At full depth, suffocating.',
    effect: 'Struggling without help causes deeper sinking.',
    terrain: ['swamp', 'desert', 'coastal'],
  },
  ice_sheet: {
    label: 'Slippery Ice',
    damage: 'None (prone)',
    save: 'DEX DC 10',
    description: 'The ground is covered in ice. Moving more than half speed requires a DEX save or fall prone.',
    effect: 'Difficult terrain. Standing from prone costs extra movement.',
    terrain: ['mountain', 'road', 'dungeon'],
  },
  lightning_storm: {
    label: 'Lightning Strikes',
    damage: '4d10 lightning',
    save: 'DEX DC 15',
    description: 'Lightning strikes a random point each round. All creatures within 10 feet must make a DEX save.',
    effect: 'Metal armor gives disadvantage on the save.',
    terrain: ['mountain', 'coastal', 'desert', 'road'],
  },
  falling_rocks: {
    label: 'Falling Rocks / Stalactites',
    damage: '3d6 bludgeoning',
    save: 'DEX DC 13',
    description: 'Tremors dislodge rocks from above. At the start of each round, 1d4 creatures must make a DEX save.',
    effect: 'Creates rubble (difficult terrain) where rocks land.',
    terrain: ['cave', 'mountain', 'dungeon', 'underdark'],
  },
  web_field: {
    label: 'Giant Spider Webs',
    damage: 'None (restrained)',
    save: 'STR DC 12 to break free',
    description: 'Thick webs fill a 20-foot area. Entering costs 4x movement. Creatures that end their turn in webs are restrained.',
    effect: 'Flammable — fire destroys 5-foot sections per round but deals 2d4 fire to creatures in burning webs.',
    terrain: ['dungeon', 'forest', 'cave', 'underdark'],
  },
  wind_tunnel: {
    label: 'Gale-Force Wind',
    damage: 'None',
    save: 'STR DC 14',
    description: 'Powerful wind blows through the area. Small creatures are pushed 10 feet per round. Medium creatures at disadvantage on ranged attacks.',
    effect: 'Flying creatures must succeed on STR save or be pushed. Extinguishes open flames.',
    terrain: ['mountain', 'coastal', 'dungeon'],
  },
  arcane_field: {
    label: 'Wild Magic Zone',
    damage: 'Varies',
    save: 'None',
    description: 'Residual arcane energy distorts spellcasting. Any spell cast in the area triggers a Wild Magic Surge (roll d20; on 1, roll on Wild Magic table).',
    effect: 'Detect Magic shows overwhelming auras. Divination is unreliable.',
    terrain: ['dungeon', 'ruins', 'underdark'],
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getHazardsForTerrain(terrain) {
  return Object.entries(HAZARD_TYPES)
    .filter(([_, h]) => h.terrain.includes(terrain))
    .map(([key, h]) => ({ id: key, ...h }));
}

export function getRandomHazard(terrain = null) {
  const pool = terrain
    ? Object.entries(HAZARD_TYPES).filter(([_, h]) => h.terrain.includes(terrain))
    : Object.entries(HAZARD_TYPES);
  if (pool.length === 0) return null;
  const [key, hazard] = pick(pool);
  return { id: key, ...hazard };
}

export function getAllHazards() {
  return Object.entries(HAZARD_TYPES).map(([key, h]) => ({ id: key, ...h }));
}
