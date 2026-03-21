/**
 * playerWeaponChoiceGuide.js
 * Player Mode: Choosing the right weapon for your build, damage comparison, and weapon properties
 * Pure JS — no React dependencies.
 */

export const WEAPON_PROPERTIES = {
  Finesse: 'Use STR or DEX for attack and damage. Best for Rogues, DEX Fighters.',
  Heavy: 'Small creatures have disadvantage. Required for Great Weapon Master feat.',
  Light: 'Can two-weapon fight with another Light weapon. No feat needed.',
  Reach: '10ft melee range instead of 5ft. Synergizes with Sentinel, Polearm Master.',
  Thrown: 'Can throw for a ranged attack using STR. Range listed on weapon.',
  Versatile: 'Can use one-handed (lower die) or two-handed (higher die).',
  Loading: 'Only one attack per action regardless of Extra Attack. Crossbow Expert removes this.',
  Ammunition: 'Requires ammo. Recover half after combat.',
  Special: 'See weapon description for unique rules (Net, Lance).',
  TwoHanded: 'Requires two hands to attack. Can hold in one hand otherwise.',
};

export const MELEE_WEAPONS_RANKED = [
  { weapon: 'Greatsword/Maul', damage: '2d6', properties: 'Heavy, Two-Handed', avgDmg: 7, rating: 'S', note: 'Best two-handed damage. GWM compatible. Great Weapon Fighting rerolls.' },
  { weapon: 'Glaive/Halberd', damage: '1d10', properties: 'Heavy, Reach, Two-Handed', avgDmg: 5.5, rating: 'S', note: 'Reach + PAM + Sentinel = best melee combo in the game.' },
  { weapon: 'Rapier', damage: '1d8', properties: 'Finesse', avgDmg: 4.5, rating: 'S', note: 'Best one-handed finesse weapon. Use with a shield for AC 17+ with studded leather.' },
  { weapon: 'Longsword', damage: '1d8/1d10', properties: 'Versatile', avgDmg: '4.5/5.5', rating: 'A', note: 'Versatile. Good with or without shield. Dueling style adds +2.' },
  { weapon: 'Shortsword', damage: '1d6', properties: 'Finesse, Light', avgDmg: 3.5, rating: 'A', note: 'Best for TWF Rogues. Finesse + Light. Sneak Attack damage matters more than weapon die.' },
  { weapon: 'Quarterstaff', damage: '1d6/1d8', properties: 'Versatile', avgDmg: '3.5/4.5', rating: 'A', note: 'PAM compatible. Monks use it. Shillelagh makes it WIS-based.' },
  { weapon: 'Handaxe', damage: '1d6', properties: 'Light, Thrown', avgDmg: 3.5, rating: 'B', note: 'TWF + thrown option. Good for STR dual-wielders.' },
  { weapon: 'Whip', damage: '1d4', properties: 'Finesse, Reach', avgDmg: 2.5, rating: 'B', note: 'Only finesse reach weapon. Low damage but unique niche.' },
];

export const RANGED_WEAPONS_RANKED = [
  { weapon: 'Hand Crossbow', damage: '1d6', properties: 'Light, Loading', avgDmg: 3.5, rating: 'S', note: 'Crossbow Expert: bonus action attack. Best ranged DPR weapon with the feat.' },
  { weapon: 'Longbow', damage: '1d8', properties: 'Heavy, Two-Handed, Ammunition', avgDmg: 4.5, rating: 'S', note: '150/600 range. Best base ranged damage without feats. Sharpshooter adds +10.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', properties: 'Heavy, Loading, Two-Handed', avgDmg: 5.5, rating: 'A', note: 'Highest ranged die. Loading limits to 1 attack unless Crossbow Expert.' },
  { weapon: 'Light Crossbow', damage: '1d8', properties: 'Loading, Two-Handed', avgDmg: 4.5, rating: 'B', note: 'Same damage as Longbow but Loading. Good if you don\'t have martial proficiency.' },
  { weapon: 'Shortbow', damage: '1d6', properties: 'Two-Handed, Ammunition', avgDmg: 3.5, rating: 'B', note: '80/320 range. Simple weapon. Decent for low-level characters.' },
  { weapon: 'Dart', damage: '1d4', properties: 'Finesse, Thrown', avgDmg: 2.5, rating: 'C', note: 'Finesse thrown weapon. Works with Sneak Attack in a pinch.' },
  { weapon: 'Javelin', damage: '1d6', properties: 'Thrown', avgDmg: 3.5, rating: 'B', note: 'STR-based thrown. Good for STR characters who need a ranged option.' },
];

export const BUILD_RECOMMENDATIONS = {
  gwm: { weapons: ['Greatsword', 'Maul', 'Glaive', 'Halberd'], feat: 'Great Weapon Master', why: 'Heavy property required. -5/+10 with multiple attacks = huge DPR.' },
  pam: { weapons: ['Glaive', 'Halberd', 'Quarterstaff', 'Spear'], feat: 'Polearm Master', why: 'Bonus action 1d4 attack + OA when enemies enter reach.' },
  pamSentinel: { weapons: ['Glaive', 'Halberd'], feats: ['Polearm Master', 'Sentinel'], why: 'OA at 10ft when enemies approach. Hit = speed 0. They can\'t reach you.' },
  cbe: { weapons: ['Hand Crossbow'], feat: 'Crossbow Expert', why: 'Bonus action attack, no loading, no melee disadvantage. Best ranged DPR.' },
  ss: { weapons: ['Longbow', 'Hand Crossbow'], feat: 'Sharpshooter', why: '-5/+10 like GWM. Ignore cover. 600ft range with Longbow.' },
  duelingShield: { weapons: ['Rapier', 'Longsword'], style: 'Dueling', why: '+2 damage per hit + shield AC. Best defense/offense balance.' },
  twf: { weapons: ['Shortsword', 'Scimitar', 'Handaxe'], style: 'Two-Weapon Fighting', why: 'Extra attack. Add ability mod to off-hand damage with the style.' },
};

export function compareDamage(weapon1, weapon2, strMod, dexMod, hasGWM, hasSS) {
  const w1avg = weapon1.avgDmg + (weapon1.properties.includes('Finesse') ? Math.max(strMod, dexMod) : strMod);
  const w2avg = weapon2.avgDmg + (weapon2.properties.includes('Finesse') ? Math.max(strMod, dexMod) : strMod);
  return { weapon1: { name: weapon1.weapon, avgDamage: w1avg }, weapon2: { name: weapon2.weapon, avgDamage: w2avg } };
}

export function getWeaponsForBuild(buildType) {
  return BUILD_RECOMMENDATIONS[buildType] || null;
}
