/**
 * Mount & Mounted Combat System — D&D 5e
 *
 * Covers roadmap items 37, 453 (Mounted combat mechanics, Mount speed integration).
 * Complete mount reference with stats, mounted combat rules, and exotic mounts.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Common Mounts ──
export const MOUNTS = {
  // ── Common ──
  camel: { name: 'Camel', speed: 50, carryCapacity: 450, cost: '50 gp', size: 'Large', type: 'Beast', ac: 9, hp: 15, str: 16, dex: 8, con: 14, notes: 'Desert mount. Can go days without water.' },
  donkey: { name: 'Donkey/Mule', speed: 40, carryCapacity: 420, cost: '8 gp', size: 'Medium', type: 'Beast', ac: 10, hp: 11, str: 14, dex: 10, con: 13, notes: 'Sure-footed but stubborn. Can carry but not ride into combat.' },
  mule: { name: 'Mule', speed: 40, carryCapacity: 420, cost: '8 gp', size: 'Medium', type: 'Beast', ac: 10, hp: 11, str: 14, dex: 10, con: 13, notes: 'Beast of burden. Sure-footed on mountain paths.' },
  draftHorse: { name: 'Draft Horse', speed: 40, carryCapacity: 540, cost: '50 gp', size: 'Large', type: 'Beast', ac: 10, hp: 19, str: 18, dex: 10, con: 12, notes: 'Bred for pulling. Slower but stronger.' },
  elephant: { name: 'Elephant', speed: 40, carryCapacity: 1320, cost: '200 gp', size: 'Huge', type: 'Beast', ac: 12, hp: 76, str: 22, dex: 9, con: 17, notes: 'Siege mount. Can carry multiple riders or heavy cargo.' },
  mastiff: { name: 'Mastiff', speed: 40, carryCapacity: 195, cost: '25 gp', size: 'Medium', type: 'Beast', ac: 12, hp: 5, str: 13, dex: 14, con: 12, notes: 'War dog. Halflings and gnomes can ride them.' },
  pony: { name: 'Pony', speed: 40, carryCapacity: 225, cost: '30 gp', size: 'Medium', type: 'Beast', ac: 10, hp: 11, str: 15, dex: 10, con: 13, notes: 'Suitable for Small riders. Common in halfling communities.' },
  ridingHorse: { name: 'Riding Horse', speed: 60, carryCapacity: 480, cost: '75 gp', size: 'Large', type: 'Beast', ac: 10, hp: 13, str: 16, dex: 10, con: 12, notes: 'Standard riding mount. Not trained for combat.' },
  warhorse: { name: 'Warhorse', speed: 60, carryCapacity: 540, cost: '400 gp', size: 'Large', type: 'Beast', ac: 11, hp: 19, str: 18, dex: 12, con: 13, notes: 'Trained for combat. Won\'t flee from battle. Can attack.' },
  // ── Exotic ──
  giantEagle: { name: 'Giant Eagle', speed: 10, flySpeed: 80, carryCapacity: 480, cost: 'Rare', size: 'Large', type: 'Beast', ac: 13, hp: 26, str: 16, dex: 17, con: 13, notes: 'Intelligent — will only serve as mount if it chooses to. Speaks Giant Eagle and Common.' },
  griffon: { name: 'Griffon', speed: 30, flySpeed: 80, carryCapacity: 450, cost: 'Rare', size: 'Large', type: 'Monstrosity', ac: 12, hp: 59, str: 18, dex: 15, con: 16, notes: 'Must be raised from egg or magically bonded. Fiercely loyal once trained.' },
  hippogriff: { name: 'Hippogriff', speed: 40, flySpeed: 60, carryCapacity: 480, cost: 'Rare', size: 'Large', type: 'Monstrosity', notes: 'Easier to train than griffons. Requires respectful approach.' },
  pegasus: { name: 'Pegasus', speed: 60, flySpeed: 90, carryCapacity: 480, cost: 'Legendary', size: 'Large', type: 'Celestial', ac: 12, hp: 59, str: 18, dex: 15, con: 16, notes: 'Only serves riders of good alignment. Cannot be bought — must be befriended.' },
  nightmare: { name: 'Nightmare', speed: 60, flySpeed: 90, carryCapacity: 480, cost: 'Legendary', size: 'Large', type: 'Fiend', notes: 'Fiendish steed wreathed in flame. Serves evil riders. Can plane shift.' },
  wyvern: { name: 'Wyvern', speed: 20, flySpeed: 80, carryCapacity: 450, cost: 'Rare', size: 'Large', type: 'Dragon', ac: 13, hp: 110, str: 19, dex: 10, con: 16, notes: 'Dangerous flying mount. Venomous tail stinger. Difficult to tame.' },
  worg: { name: 'Worg', speed: 50, carryCapacity: 480, cost: 'Rare', size: 'Large', type: 'Monstrosity', notes: 'Evil wolf mount used by goblins and orcs. Intelligent and malicious.' },
  giantLizard: { name: 'Giant Lizard', speed: 30, climbSpeed: 30, carryCapacity: 480, cost: '100 gp', size: 'Large', type: 'Beast', notes: 'Underdark mount. Can climb walls. Used by drow and deep gnomes.' },
  giantSpider: { name: 'Giant Spider', speed: 30, climbSpeed: 30, carryCapacity: 480, cost: 'Rare', size: 'Large', type: 'Beast', notes: 'Drow war mount. Can climb and web. Terrifying to surface dwellers.' },
};

// ── Vehicles ──
export const VEHICLES = {
  // ── Land Vehicles ──
  cart: { name: 'Cart', cost: '15 gp', speed: 'Pulled by animal', carryCapacity: 490, type: 'Land', notes: 'Simple two-wheeled vehicle for hauling goods.' },
  carriage: { name: 'Carriage', cost: '100 gp', speed: 'Pulled by animal', carryCapacity: 600, type: 'Land', notes: 'Enclosed four-wheeled vehicle for passenger travel.' },
  chariot: { name: 'Chariot', cost: '250 gp', speed: 'Pulled by animal', carryCapacity: 490, type: 'Land', notes: 'Two-wheeled war vehicle. Requires trained warhorses.' },
  wagon: { name: 'Wagon', cost: '35 gp', speed: 'Pulled by animal', carryCapacity: 480, type: 'Land', notes: 'Four-wheeled open vehicle for heavy cargo transport.' },
  // ── Waterborne Vehicles ──
  rowboat: { name: 'Rowboat', cost: '50 gp', speed: '1.5 mph', carryCapacity: null, type: 'Water', notes: 'Small boat for calm waters. Seats 2-3 passengers.' },
  sailingShip: { name: 'Sailing Ship', cost: '10,000 gp', speed: '2 mph', carryCapacity: null, type: 'Water', notes: 'Large ocean-going vessel. Requires crew of 20-30.' },
  galley: { name: 'Galley', cost: '30,000 gp', speed: '4 mph', carryCapacity: null, type: 'Water', notes: 'Massive war vessel with oars and sails. Requires crew of 80.' },
  keelboat: { name: 'Keelboat', cost: '3,000 gp', speed: '1 mph', carryCapacity: null, type: 'Water', notes: 'River and coastal vessel. Requires crew of 3-4.' },
  longship: { name: 'Longship', cost: '10,000 gp', speed: '3 mph', carryCapacity: null, type: 'Water', notes: 'Viking-style vessel for raiding and exploration. Requires crew of 40.' },
  warship: { name: 'Warship', cost: '25,000 gp', speed: '2.5 mph', carryCapacity: null, type: 'Water', notes: 'Heavily armed naval vessel. Requires crew of 60.' },
};

// ── Mounted Combat Rules ──
export const MOUNTED_COMBAT_RULES = {
  mounting: {
    label: 'Mounting & Dismounting',
    rules: [
      'Mounting/dismounting costs half your movement speed',
      'Mount must be within 5 feet and willing',
      'Mount must be at least one size larger than rider',
      'If effect moves mount against its will: DC 10 DEX save or fall prone (dismounted)',
      'If knocked prone while mounted: DEX save to dismount gracefully, otherwise fall prone',
    ],
  },
  controlledMount: {
    label: 'Controlled Mount',
    rules: [
      'Mount acts on rider\'s initiative',
      'Mount can only Dash, Disengage, or Dodge',
      'Mount moves as rider directs',
      'Good for: trained warhorses, pack animals, most mundane mounts',
    ],
  },
  independentMount: {
    label: 'Independent Mount',
    rules: [
      'Mount has its own initiative and full range of actions',
      'Mount acts in its own interests — may flee, fight, or disobey',
      'Good for: intelligent mounts (griffons, pegasi, dragons), wild/untrained mounts',
      'Rider has no direct control over mount\'s actions',
    ],
  },
  cavalierAdvantages: {
    label: 'Benefits of Mounted Combat',
    rules: [
      'Use mount\'s speed instead of your own',
      'Lance: 1d12 damage, reach 10ft (disadvantage within 5ft)',
      'Charge: some DMs allow bonus damage after 10ft+ mounted movement',
      'Height advantage: melee attacks against unmounted foes may have advantage (DM discretion)',
    ],
  },
  mountedCombatFeat: {
    label: 'Mounted Combatant Feat',
    rules: [
      'Advantage on melee attacks against unmounted creatures smaller than your mount',
      'Force attacks targeting your mount to target you instead',
      'Mount takes no damage on successful DEX save (half on fail)',
    ],
  },
};

// ── Tack & Harness ──
export const RIDING_EQUIPMENT = [
  { name: 'Saddle, Riding', cost: '10 gp', weight: '25 lb', description: 'Standard riding saddle.' },
  { name: 'Saddle, Military', cost: '20 gp', weight: '30 lb', description: 'Gives advantage on checks to remain mounted.' },
  { name: 'Saddle, Pack', cost: '5 gp', weight: '15 lb', description: 'For beast of burden, not riding.' },
  { name: 'Saddle, Exotic', cost: '60 gp', weight: '40 lb', description: 'Required for flying and unusual mounts.' },
  { name: 'Bit and Bridle', cost: '2 gp', weight: '1 lb', description: 'Required to control a mount. -2 to handling without.' },
  { name: 'Saddlebags', cost: '4 gp', weight: '8 lb', description: 'Holds 30 lb across both sides.' },
  { name: 'Barding (Chain)', cost: '800 gp', weight: '55 lb', description: 'AC 16 for mount. Speed reduced by 10.' },
  { name: 'Barding (Plate)', cost: '6000 gp', weight: '130 lb', description: 'AC 18 for mount. Speed reduced by 10. STR 15 requirement.' },
  { name: 'Feed (per day)', cost: '5 cp', weight: '10 lb', description: 'Hay and oats for one mount per day.' },
  { name: 'Stabling (per day)', cost: '5 sp', weight: '—', description: 'Indoor shelter, feed, and grooming at a stable.' },
];

/**
 * Get mount info by key.
 */
export function getMount(key) {
  return MOUNTS[key] || null;
}

/**
 * Get all mounts grouped by rarity.
 */
export function getAllMounts() {
  const common = [];
  const exotic = [];
  Object.entries(MOUNTS).forEach(([key, m]) => {
    const entry = { id: key, ...m };
    if (m.cost === 'Rare' || m.cost === 'Legendary') {
      exotic.push(entry);
    } else {
      common.push(entry);
    }
  });
  return { common, exotic };
}

/**
 * Get mounts suitable for a given rider size.
 */
export function getMountsForSize(riderSize) {
  const sizeOrder = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const riderIndex = sizeOrder.indexOf(riderSize);
  return Object.entries(MOUNTS)
    .filter(([, m]) => sizeOrder.indexOf(m.size) > riderIndex)
    .map(([key, m]) => ({ id: key, ...m }));
}

/**
 * Get flying mounts.
 */
export function getFlyingMounts() {
  return Object.entries(MOUNTS)
    .filter(([, m]) => m.flySpeed)
    .map(([key, m]) => ({ id: key, ...m }));
}

/**
 * Calculate daily cost for maintaining a mount.
 */
export function calculateMountDailyCost(mountKey, stabled = true) {
  const mount = MOUNTS[mountKey];
  if (!mount) return 0;
  const feed = 0.05; // 5 cp
  const stable = stabled ? 0.5 : 0; // 5 sp
  return feed + stable;
}

/**
 * Get mounted combat rules.
 */
export function getMountedCombatRules() {
  return MOUNTED_COMBAT_RULES;
}

/**
 * Get riding equipment.
 */
export function getRidingEquipment() {
  return RIDING_EQUIPMENT;
}

/**
 * Get all vehicles grouped by type.
 */
export function getAllVehicles() {
  const land = [];
  const water = [];
  Object.entries(VEHICLES).forEach(([key, v]) => {
    const entry = { id: key, ...v };
    if (v.type === 'Water') {
      water.push(entry);
    } else {
      land.push(entry);
    }
  });
  return { land, water };
}

/**
 * Get vehicle info by key.
 */
export function getVehicle(key) {
  return VEHICLES[key] || null;
}
