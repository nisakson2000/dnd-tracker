/**
 * playerWeaponProperties.js
 * Player Mode: Weapon properties reference and combat modifiers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// WEAPON PROPERTIES
// ---------------------------------------------------------------------------

export const WEAPON_PROPERTIES = [
  { id: 'ammunition', name: 'Ammunition', description: 'Uses ammo. Draw ammo as part of attack. Need free hand to load. Recover half spent ammo after combat.' },
  { id: 'finesse', name: 'Finesse', description: 'Use STR or DEX for attack and damage rolls.' },
  { id: 'heavy', name: 'Heavy', description: 'Small/Tiny creatures have disadvantage on attack rolls.' },
  { id: 'light', name: 'Light', description: 'Can use for two-weapon fighting (bonus action off-hand attack).' },
  { id: 'loading', name: 'Loading', description: 'Can only fire once per action/bonus/reaction, regardless of number of attacks. Crossbow Expert feat removes this.' },
  { id: 'range', name: 'Range', description: 'Two numbers: normal/long. Beyond normal = disadvantage. Beyond long = can\'t attack.' },
  { id: 'reach', name: 'Reach', description: 'Adds 5 feet to reach (10ft total for Medium creatures).' },
  { id: 'special', name: 'Special', description: 'See weapon description for unique rules.' },
  { id: 'thrown', name: 'Thrown', description: 'Can throw for ranged attack using same ability modifier.' },
  { id: 'two_handed', name: 'Two-Handed', description: 'Requires both hands. Cannot use with a shield.' },
  { id: 'versatile', name: 'Versatile', description: 'Can use one or two hands. Two-handed uses the larger damage die.' },
];

// ---------------------------------------------------------------------------
// SIMPLE MELEE WEAPONS
// ---------------------------------------------------------------------------

export const SIMPLE_MELEE = [
  { name: 'Club', damage: '1d4', type: 'bludgeoning', properties: ['light'], weight: 2, cost: 0.1 },
  { name: 'Dagger', damage: '1d4', type: 'piercing', properties: ['finesse', 'light', 'thrown'], range: '20/60', weight: 1, cost: 2 },
  { name: 'Greatclub', damage: '1d8', type: 'bludgeoning', properties: ['two_handed'], weight: 10, cost: 0.2 },
  { name: 'Handaxe', damage: '1d6', type: 'slashing', properties: ['light', 'thrown'], range: '20/60', weight: 2, cost: 5 },
  { name: 'Javelin', damage: '1d6', type: 'piercing', properties: ['thrown'], range: '30/120', weight: 2, cost: 0.5 },
  { name: 'Light Hammer', damage: '1d4', type: 'bludgeoning', properties: ['light', 'thrown'], range: '20/60', weight: 2, cost: 2 },
  { name: 'Mace', damage: '1d6', type: 'bludgeoning', properties: [], weight: 4, cost: 5 },
  { name: 'Quarterstaff', damage: '1d6', type: 'bludgeoning', properties: ['versatile'], versatileDamage: '1d8', weight: 4, cost: 0.2 },
  { name: 'Sickle', damage: '1d4', type: 'slashing', properties: ['light'], weight: 2, cost: 1 },
  { name: 'Spear', damage: '1d6', type: 'piercing', properties: ['thrown', 'versatile'], versatileDamage: '1d8', range: '20/60', weight: 3, cost: 1 },
];

// ---------------------------------------------------------------------------
// MARTIAL MELEE WEAPONS
// ---------------------------------------------------------------------------

export const MARTIAL_MELEE = [
  { name: 'Battleaxe', damage: '1d8', type: 'slashing', properties: ['versatile'], versatileDamage: '1d10', weight: 4, cost: 10 },
  { name: 'Flail', damage: '1d8', type: 'bludgeoning', properties: [], weight: 2, cost: 10 },
  { name: 'Glaive', damage: '1d10', type: 'slashing', properties: ['heavy', 'reach', 'two_handed'], weight: 6, cost: 20 },
  { name: 'Greataxe', damage: '1d12', type: 'slashing', properties: ['heavy', 'two_handed'], weight: 7, cost: 30 },
  { name: 'Greatsword', damage: '2d6', type: 'slashing', properties: ['heavy', 'two_handed'], weight: 6, cost: 50 },
  { name: 'Halberd', damage: '1d10', type: 'slashing', properties: ['heavy', 'reach', 'two_handed'], weight: 6, cost: 20 },
  { name: 'Lance', damage: '1d12', type: 'piercing', properties: ['reach', 'special'], weight: 6, cost: 10, special: 'Disadvantage within 5ft. Requires two hands unless mounted.' },
  { name: 'Longsword', damage: '1d8', type: 'slashing', properties: ['versatile'], versatileDamage: '1d10', weight: 3, cost: 15 },
  { name: 'Maul', damage: '2d6', type: 'bludgeoning', properties: ['heavy', 'two_handed'], weight: 10, cost: 10 },
  { name: 'Morningstar', damage: '1d8', type: 'piercing', properties: [], weight: 4, cost: 15 },
  { name: 'Pike', damage: '1d10', type: 'piercing', properties: ['heavy', 'reach', 'two_handed'], weight: 18, cost: 5 },
  { name: 'Rapier', damage: '1d8', type: 'piercing', properties: ['finesse'], weight: 2, cost: 25 },
  { name: 'Scimitar', damage: '1d6', type: 'slashing', properties: ['finesse', 'light'], weight: 3, cost: 25 },
  { name: 'Shortsword', damage: '1d6', type: 'piercing', properties: ['finesse', 'light'], weight: 2, cost: 10 },
  { name: 'Trident', damage: '1d6', type: 'piercing', properties: ['thrown', 'versatile'], versatileDamage: '1d8', range: '20/60', weight: 4, cost: 5 },
  { name: 'War Pick', damage: '1d8', type: 'piercing', properties: [], weight: 2, cost: 5 },
  { name: 'Warhammer', damage: '1d8', type: 'bludgeoning', properties: ['versatile'], versatileDamage: '1d10', weight: 2, cost: 15 },
  { name: 'Whip', damage: '1d4', type: 'slashing', properties: ['finesse', 'reach'], weight: 3, cost: 2 },
];

// ---------------------------------------------------------------------------
// RANGED WEAPONS
// ---------------------------------------------------------------------------

export const RANGED_WEAPONS = [
  { name: 'Light Crossbow', damage: '1d8', type: 'piercing', properties: ['ammunition', 'loading', 'two_handed'], range: '80/320', weight: 5, cost: 25 },
  { name: 'Dart', damage: '1d4', type: 'piercing', properties: ['finesse', 'thrown'], range: '20/60', weight: 0.25, cost: 0.05 },
  { name: 'Shortbow', damage: '1d6', type: 'piercing', properties: ['ammunition', 'two_handed'], range: '80/320', weight: 2, cost: 25 },
  { name: 'Sling', damage: '1d4', type: 'bludgeoning', properties: ['ammunition'], range: '30/120', weight: 0, cost: 0.1 },
  { name: 'Hand Crossbow', damage: '1d6', type: 'piercing', properties: ['ammunition', 'light', 'loading'], range: '30/120', weight: 3, cost: 75 },
  { name: 'Heavy Crossbow', damage: '1d10', type: 'piercing', properties: ['ammunition', 'heavy', 'loading', 'two_handed'], range: '100/400', weight: 18, cost: 50 },
  { name: 'Longbow', damage: '1d8', type: 'piercing', properties: ['ammunition', 'heavy', 'two_handed'], range: '150/600', weight: 2, cost: 50 },
  { name: 'Blowgun', damage: '1', type: 'piercing', properties: ['ammunition', 'loading'], range: '25/100', weight: 1, cost: 10 },
  { name: 'Net', damage: '0', type: 'none', properties: ['special', 'thrown'], range: '5/15', weight: 3, cost: 1, special: 'Restrains Large or smaller creatures.' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get all weapons.
 */
export function getAllWeapons() {
  return [...SIMPLE_MELEE, ...MARTIAL_MELEE, ...RANGED_WEAPONS];
}

/**
 * Find a weapon by name.
 */
export function getWeapon(name) {
  return getAllWeapons().find(w => w.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

/**
 * Check if a weapon has a specific property.
 */
export function hasProperty(weapon, propertyId) {
  return weapon?.properties?.includes(propertyId) || false;
}

/**
 * Get finesse weapons.
 */
export function getFinesseWeapons() {
  return getAllWeapons().filter(w => w.properties.includes('finesse'));
}

/**
 * Get weapons with reach.
 */
export function getReachWeapons() {
  return getAllWeapons().filter(w => w.properties.includes('reach'));
}
