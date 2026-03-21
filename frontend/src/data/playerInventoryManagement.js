/**
 * playerInventoryManagement.js
 * Player Mode: Inventory organization and carry capacity
 * Pure JS — no React dependencies.
 */

export const CARRY_CAPACITY = {
  normal: 'STR score × 15 pounds.',
  encumbered: 'STR score × 5 = speed reduced by 10ft. (Variant rule)',
  heavilyEncumbered: 'STR score × 10 = speed reduced by 20ft, disadvantage on STR/DEX/CON checks and saves. (Variant rule)',
  push: 'STR score × 30 = max you can push, drag, or lift.',
  tinyCreature: 'Half of normal capacity.',
  largeCreature: 'Double normal capacity.',
};

export const CONTAINER_CAPACITIES = [
  { container: 'Backpack', capacity: '30 lbs / 1 cubic foot', notes: 'Can strap bedroll, rope outside.' },
  { container: 'Barrel', capacity: '40 gallons / 4 cubic feet', notes: 'Bulky, usually on cart.' },
  { container: 'Basket', capacity: '40 lbs / 2 cubic feet', notes: 'Light but fragile.' },
  { container: 'Chest', capacity: '300 lbs / 12 cubic feet', notes: 'Lockable. Good for base camp.' },
  { container: 'Pouch', capacity: '6 lbs / 1/5 cubic foot', notes: 'Belt pouch for small items.' },
  { container: 'Sack', capacity: '30 lbs / 1 cubic foot', notes: 'Cheap storage option.' },
  { container: 'Bag of Holding', capacity: '500 lbs / 64 cubic feet (max)', notes: 'Always weighs 15 lbs. Do NOT put inside another extradimensional space.' },
  { container: 'Handy Haversack', capacity: '120 lbs total (two 20lb + one 80lb pocket)', notes: 'Action to retrieve exactly what you want.' },
  { container: 'Portable Hole', capacity: '6ft diameter, 10ft deep cylinder', notes: 'Unfolds into a hole. Putting inside Bag of Holding = Astral Plane portal.' },
];

export const INVENTORY_CATEGORIES = [
  { category: 'Weapons', icon: '⚔️', description: 'Melee and ranged weapons, ammunition.' },
  { category: 'Armor & Shields', icon: '🛡️', description: 'Worn protection.' },
  { category: 'Potions', icon: '🧪', description: 'Consumable healing, buffs, utility.' },
  { category: 'Scrolls', icon: '📜', description: 'One-use spell scrolls.' },
  { category: 'Magic Items', icon: '✨', description: 'Wondrous items, magic weapons/armor.' },
  { category: 'Adventuring Gear', icon: '🎒', description: 'Rope, torches, tools, rations, etc.' },
  { category: 'Treasure', icon: '💰', description: 'Gems, art objects, coins, trade goods.' },
  { category: 'Quest Items', icon: '🗝️', description: 'Key items for quests. Don\'t sell these.' },
];

export const COIN_WEIGHT = {
  rule: '50 coins weigh 1 pound.',
  tip: 'Convert copper and silver to gold to reduce weight. Banks or merchants will exchange.',
  gems: 'Gems are lighter than coins for the same value — use as portable wealth.',
};

export function calculateCarryCapacity(strScore, sizeModifier = 1) {
  return strScore * 15 * sizeModifier;
}

export function isEncumbered(strScore, currentWeight) {
  const capacity = strScore * 15;
  if (currentWeight > capacity) return 'over_capacity';
  if (currentWeight > strScore * 10) return 'heavily_encumbered';
  if (currentWeight > strScore * 5) return 'encumbered';
  return 'normal';
}

export function coinWeight(totalCoins) {
  return totalCoins / 50;
}
