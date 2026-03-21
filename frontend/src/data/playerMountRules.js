/**
 * playerMountRules.js
 * Player Mode: Mounted combat rules, mount stats, and tracking
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// MOUNTED COMBAT RULES
// ---------------------------------------------------------------------------

export const MOUNTED_COMBAT_RULES = {
  mounting: {
    action: 'Half your movement speed to mount or dismount.',
    requirement: 'Mount must be at least one size larger than you.',
    note: 'If forced movement dismounts you, DC 10 DEX save or fall prone.',
  },
  controlledMount: {
    initiative: 'Mount acts on your initiative.',
    actions: 'Can only Dash, Disengage, or Dodge.',
    movement: 'Mount moves as you direct.',
    note: 'Most common option for trained mounts.',
  },
  independentMount: {
    initiative: 'Mount has its own initiative and acts independently.',
    actions: 'Can take any action.',
    movement: 'Mount moves on its own turn.',
    note: 'Intelligent mounts (e.g., pegasus, dragon) often act independently.',
  },
  mountedCombat: [
    'If mount is forced to move, rider can make DC 10 DEX save to stay mounted.',
    'If mount is knocked prone, rider can use reaction to dismount and land on feet.',
    'Otherwise, rider is dismounted and falls prone within 5ft.',
    'If rider is knocked prone while mounted, same DEX save applies.',
  ],
};

// ---------------------------------------------------------------------------
// MOUNT FEAT
// ---------------------------------------------------------------------------

export const MOUNTED_COMBATANT_FEAT = {
  name: 'Mounted Combatant',
  benefits: [
    'Advantage on melee attacks against unmounted creatures smaller than your mount.',
    'Force attacks targeting mount to target you instead.',
    'Mount takes no damage on successful DEX saves (Evasion for mount).',
  ],
};

// ---------------------------------------------------------------------------
// COMMON MOUNTS
// ---------------------------------------------------------------------------

export const COMMON_MOUNTS = [
  { name: 'Riding Horse', cost: 75, speed: 60, hp: 13, ac: 10, str: 16, size: 'Large', capacity: 480 },
  { name: 'Warhorse', cost: 400, speed: 60, hp: 19, ac: 11, str: 18, size: 'Large', capacity: 540, special: 'Trampling Charge' },
  { name: 'Pony', cost: 30, speed: 40, hp: 11, ac: 10, str: 15, size: 'Medium', capacity: 225 },
  { name: 'Mastiff', cost: 25, speed: 40, hp: 5, ac: 12, str: 13, size: 'Medium', capacity: 195, special: 'Keen senses' },
  { name: 'Camel', cost: 50, speed: 50, hp: 15, ac: 9, str: 16, size: 'Large', capacity: 480 },
  { name: 'Elephant', cost: 200, speed: 40, hp: 76, ac: 12, str: 22, size: 'Huge', capacity: 1320, special: 'Trampling Charge' },
  { name: 'Draft Horse', cost: 50, speed: 40, hp: 19, ac: 10, str: 18, size: 'Large', capacity: 540 },
  { name: 'Mule', cost: 8, speed: 40, hp: 11, ac: 10, str: 14, size: 'Medium', capacity: 420, special: 'Beast of Burden, Sure-Footed' },
];

// ---------------------------------------------------------------------------
// EXOTIC MOUNTS
// ---------------------------------------------------------------------------

export const EXOTIC_MOUNTS = [
  { name: 'Griffon', speed: 80, fly: 80, hp: 59, ac: 12, size: 'Large', notes: 'Requires training (DM discretion)' },
  { name: 'Pegasus', speed: 60, fly: 90, hp: 59, ac: 12, size: 'Large', notes: 'Celestial, intelligent, independent mount' },
  { name: 'Hippogriff', speed: 40, fly: 60, hp: 19, ac: 11, size: 'Large', notes: 'Can be trained if raised from young' },
  { name: 'Giant Eagle', speed: 10, fly: 80, hp: 26, ac: 13, size: 'Large', notes: 'Intelligent, may serve willingly' },
  { name: 'Giant Owl', speed: 5, fly: 60, hp: 19, ac: 12, size: 'Large', notes: 'Intelligent, speaks Elvish/Sylvan' },
  { name: 'Wyvern', speed: 20, fly: 80, hp: 110, ac: 13, size: 'Large', notes: 'Dangerous, hard to control' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check if a creature can serve as a mount.
 */
export function canMount(riderSize, mountSize) {
  const sizeOrder = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const riderIdx = sizeOrder.indexOf(riderSize || 'Medium');
  const mountIdx = sizeOrder.indexOf(mountSize || 'Large');
  return mountIdx > riderIdx;
}

/**
 * Get mounting/dismounting movement cost.
 */
export function getMountingCost(riderSpeed) {
  return Math.floor(riderSpeed / 2);
}

/**
 * Check if mount can carry the rider + equipment.
 */
export function canCarry(mount, totalWeight) {
  return totalWeight <= (mount.capacity || mount.str * 15);
}
