/**
 * Cover, Terrain & Positioning — Reference data for cover, difficult terrain,
 * flanking, opportunity attacks, and movement types.
 * Covers roadmap items 32–34.
 */

// ---------------------------------------------------------------------------
// 1. Cover Types
// ---------------------------------------------------------------------------

export const COVER_TYPES = {
  half: {
    label: 'Half Cover',
    acBonus: 2,
    dexSaveBonus: 2,
    description: '+2 AC, +2 DEX saving throws. At least half the target is blocked by an obstacle.',
    examples: ['Low wall', 'Furniture', 'Another creature', 'Thick tree trunk (narrow side)'],
  },
  threeQuarters: {
    label: 'Three-Quarters Cover',
    acBonus: 5,
    dexSaveBonus: 5,
    description: '+5 AC, +5 DEX saving throws. About three-quarters of the target is blocked.',
    examples: ['Arrow slit', 'Thick tree trunk', 'Portcullis', 'Overturned cart'],
  },
  total: {
    label: 'Total Cover',
    acBonus: null,
    dexSaveBonus: null,
    description: 'Cannot be targeted directly by an attack or spell. Completely concealed by an obstacle.',
    examples: ['Solid wall', 'Pillar completely blocking line of sight', 'Closed door'],
  },
};

// ---------------------------------------------------------------------------
// 2. Difficult Terrain
// ---------------------------------------------------------------------------

export const DIFFICULT_TERRAIN = {
  label: 'Difficult Terrain',
  definition: 'Every foot of movement in difficult terrain costs 2 feet of speed.',
  dashInteraction: 'The Dash action grants extra movement, but difficult terrain still costs double.',
  types: [
    { name: 'Rubble', description: 'Broken stone, debris, or collapsed structures.' },
    { name: 'Ice', description: 'Frozen surfaces that are slippery and treacherous.' },
    { name: 'Shallow Water', description: 'Water up to knee depth that impedes movement.' },
    { name: 'Dense Undergrowth', description: 'Thick bushes, vines, and tangled plant life.' },
    { name: 'Steep Stairs', description: 'Narrow or steep staircases that slow movement.' },
    { name: 'Mud', description: 'Soft, sucking ground that grabs at feet.' },
    { name: 'Webs', description: 'Spider webs or magical webs that entangle creatures.' },
    { name: 'Heavy Snow', description: 'Deep snow drifts that impede walking.' },
    { name: 'Furniture / Clutter', description: 'Overturned tables, scattered objects, tight spaces.' },
  ],
  exceptions: [
    { name: "Land's Stride", description: 'Ranger / Druid feature (level 6+). Non-magical difficult terrain costs no extra movement.' },
    { name: 'Freedom of Movement', description: '4th-level abjuration spell. Target is unaffected by difficult terrain and cannot be paralyzed or restrained.' },
    { name: 'Boots of Striding and Springing', description: 'Magic item. Walking speed becomes 30 ft (minimum) and difficult terrain costs no extra movement.' },
  ],
};

// ---------------------------------------------------------------------------
// 3. Flanking Rules (Optional Rule, DMG p.251)
// ---------------------------------------------------------------------------

export const FLANKING_RULES = {
  label: 'Flanking (Optional Rule)',
  isOptional: true,
  requirement: 'Two allies must be on exactly opposite sides of an enemy to gain flanking.',
  benefit: 'Each flanking ally has advantage on melee attack rolls against that enemy.',
  rules: [
    { title: 'Melee Only', description: 'Flanking advantage applies only to melee attack rolls, not ranged attacks.' },
    { title: 'Grid Positioning', description: 'On a grid, two creatures flank when they are on exactly opposite sides or corners of the target. Draw an imaginary line between the centers of the flankers — it must pass through opposite sides or corners of the target\'s space.' },
    { title: 'Conscious Allies', description: 'A flanking ally must be able to see the enemy and not be incapacitated.' },
    { title: 'Melee Reach', description: 'Both flankers must be within melee reach of the enemy (typically 5 ft, or 10 ft with reach weapons).' },
  ],
};

// ---------------------------------------------------------------------------
// 4. Opportunity Attack Rules
// ---------------------------------------------------------------------------

export const OPPORTUNITY_ATTACK_RULES = {
  label: 'Opportunity Attacks',
  trigger: 'When a hostile creature you can see moves out of your melee reach without taking the Disengage action.',
  rules: [
    { title: 'Uses Reaction', description: 'Making an opportunity attack consumes your reaction for the round.' },
    { title: 'One Reaction per Round', description: 'You only get one reaction per round. If you spend it on an opportunity attack, you cannot use it again until the start of your next turn.' },
    { title: 'Single Melee Attack', description: 'An opportunity attack is a single melee attack, not a full Attack action.' },
    { title: 'Disengage Action', description: 'A creature that takes the Disengage action does not provoke opportunity attacks for the rest of its turn.' },
    { title: 'Teleportation', description: 'Teleporting out of reach does not provoke opportunity attacks because the creature is not using its movement.' },
    { title: 'Forced Movement', description: 'Being pushed, pulled, or otherwise moved against your will (shove, Thunderwave, etc.) does not provoke opportunity attacks.' },
    { title: 'Flyby Trait', description: 'Creatures with the Flyby trait do not provoke opportunity attacks when flying out of reach.' },
    { title: 'Sentinel Feat', description: 'Hitting a creature with an opportunity attack reduces its speed to 0 for the rest of the turn. Also allows OA against creatures that Disengage, and a reaction attack when an adjacent creature attacks someone else.' },
    { title: 'Reach Weapons', description: 'With a reach weapon (10 ft), opportunity attacks trigger when enemies leave that extended reach.' },
  ],
};

// ---------------------------------------------------------------------------
// 5. Movement Types
// ---------------------------------------------------------------------------

export const MOVEMENT_TYPES = {
  walk: {
    label: 'Walk',
    defaultSpeed: 30,
    costMultiplier: 1,
    description: 'Standard ground movement. Most races have a base walking speed of 25–35 ft.',
  },
  climb: {
    label: 'Climb',
    defaultSpeed: null,
    costMultiplier: 2,
    description: 'Costs 2 feet of movement per foot climbed, unless the creature has a climb speed (then 1:1).',
  },
  swim: {
    label: 'Swim',
    defaultSpeed: null,
    costMultiplier: 2,
    description: 'Costs 2 feet of movement per foot swum, unless the creature has a swim speed (then 1:1).',
  },
  crawl: {
    label: 'Crawl',
    defaultSpeed: null,
    costMultiplier: 2,
    description: 'Moving while prone costs 2 feet of movement per foot. Standing up from prone costs half your speed.',
  },
  fly: {
    label: 'Fly',
    defaultSpeed: null,
    costMultiplier: 1,
    description: 'Fly speed allows aerial movement at 1:1 cost. Falling occurs if speed drops to 0 or creature is incapacitated (unless it can hover).',
  },
  burrow: {
    label: 'Burrow',
    defaultSpeed: null,
    costMultiplier: 1,
    description: 'Burrow speed allows digging through earth, sand, or similar material. Cannot burrow through solid rock unless stated.',
  },
  jump: {
    label: 'Jump',
    rules: [
      { title: 'Long Jump (Running)', description: 'Cover a distance equal to your STR score in feet with a 10 ft running start.' },
      { title: 'Long Jump (Standing)', description: 'Without a running start, you can jump half your STR score in feet.' },
      { title: 'High Jump (Running)', description: 'Leap 3 + STR modifier feet into the air with a 10 ft running start.' },
      { title: 'High Jump (Standing)', description: 'Without a running start, you can jump half that height (round down).' },
      { title: 'Jump Distance = Movement', description: 'Every foot of a jump costs a foot of movement. You cannot jump farther than your remaining speed allows.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns the AC and DEX save bonuses for a given cover type.
 * @param {'half'|'threeQuarters'|'total'} type
 * @returns {{ acBonus: number|null, dexSaveBonus: number|null, label: string } | null}
 */
export function getCoverBonus(type) {
  const cover = COVER_TYPES[type];
  if (!cover) return null;
  return {
    acBonus: cover.acBonus,
    dexSaveBonus: cover.dexSaveBonus,
    label: cover.label,
  };
}

/**
 * Returns the list of difficult terrain types.
 * @returns {Array<{ name: string, description: string }>}
 */
export function getDifficultTerrainTypes() {
  return DIFFICULT_TERRAIN.types;
}

/**
 * Returns the movement cost multiplier for a given terrain/movement combination.
 * Difficult terrain doubles the cost; certain movement types (climb, swim, crawl)
 * already have a 2x multiplier that stacks.
 * @param {'normal'|'difficult'} terrainType
 * @param {'walk'|'climb'|'swim'|'crawl'|'fly'|'burrow'} movementType
 * @returns {number} Total cost multiplier (feet of speed per foot of movement)
 */
export function getMovementCost(terrainType, movementType) {
  const movement = MOVEMENT_TYPES[movementType];
  if (!movement || !movement.costMultiplier) return 1;
  const baseCost = movement.costMultiplier;
  const terrainMultiplier = terrainType === 'difficult' ? 2 : 1;
  return baseCost * terrainMultiplier;
}
