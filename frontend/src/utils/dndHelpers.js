/**
 * Shared D&D utility functions.
 * Consolidates commonly duplicated helpers across the codebase.
 */

/** Calculate ability score modifier: (score - 10) / 2, rounded down. */
export function calcMod(score) {
  const s = typeof score === 'number' && !isNaN(score) ? score : 10;
  return Math.floor((s - 10) / 2);
}

/** Format a numeric modifier with a leading sign: +2, -1, +0, etc. */
export function modStr(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Calculate proficiency bonus from character level (5e rules). */
export function calcProfBonus(level) {
  const lvl = parseInt(level) || 1;
  if (lvl >= 17) return 6;
  if (lvl >= 13) return 5;
  if (lvl >= 9) return 4;
  if (lvl >= 5) return 3;
  return 2;
}

/** Pick a random element from an array. */
export function pick(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random integer between min and max (inclusive). */
export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 5e skill-to-ability mapping (Title Case keys, full ability names). */
export const SKILL_ABILITY_MAP = {
  Athletics: 'Strength',
  Acrobatics: 'Dexterity',
  'Sleight of Hand': 'Dexterity',
  Stealth: 'Dexterity',
  Arcana: 'Intelligence',
  History: 'Intelligence',
  Investigation: 'Intelligence',
  Nature: 'Intelligence',
  Religion: 'Intelligence',
  'Animal Handling': 'Wisdom',
  Insight: 'Wisdom',
  Medicine: 'Wisdom',
  Perception: 'Wisdom',
  Survival: 'Wisdom',
  Deception: 'Charisma',
  Intimidation: 'Charisma',
  Performance: 'Charisma',
  Persuasion: 'Charisma',
};

/** Standard 6 abilities (abbreviated). */
export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

/** Full ability names. */
export const ABILITY_NAMES = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

/** Abbreviation-to-full mapping. */
export const ABILITY_ABBR_MAP = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };

/** Calculate saving throw bonus. */
export function calcSaveBonus(abilityScore, proficient, profBonus, itemBonus = 0) {
  return calcMod(abilityScore + itemBonus) + (proficient ? profBonus : 0);
}

/** Calculate skill bonus (handles proficiency + expertise). */
export function calcSkillBonus(abilityScore, proficient, expertise, profBonus, itemBonus = 0) {
  return calcMod(abilityScore + itemBonus) + (expertise ? profBonus * 2 : proficient ? profBonus : 0);
}

/** Calculate passive score (10 + skill bonus). */
export function calcPassiveScore(abilityScore, proficient, expertise, profBonus, itemBonus = 0) {
  return 10 + calcSkillBonus(abilityScore, proficient, expertise, profBonus, itemBonus);
}

/** Calculate spell save DC: 8 + proficiency + ability mod. */
export function calcSpellDC(abilityScore, profBonus) {
  return 8 + profBonus + calcMod(abilityScore);
}

/** Calculate spell attack bonus: proficiency + ability mod. */
export function calcSpellAttack(abilityScore, profBonus) {
  return profBonus + calcMod(abilityScore);
}

/** Calculate weapon attack bonus: ability mod + proficiency + magic bonus. */
export function calcAttackBonus(abilityMod, profBonus, magicBonus = 0) {
  return abilityMod + profBonus + magicBonus;
}

/** Calculate HP gain on level up (average hit die + CON mod, minimum 1). */
export function calcLevelUpHp(hitDie, conMod) {
  const avg = Math.floor(hitDie / 2) + 1;
  return Math.max(1, avg + conMod);
}

/** Calculate total auto HP for a class/level/CON mod (max at 1st, avg after). */
export function calcAutoHP(hitDie, level, conMod) {
  if (!hitDie || level < 1) return null;
  const hpAtOne = hitDie + conMod;
  const hpAfterOne = (level - 1) * calcLevelUpHp(hitDie, conMod);
  return Math.max(1, hpAtOne + hpAfterOne);
}

/** Hit dice regained on long rest: half your total, minimum 1. */
export function calcHitDiceRegained(totalHitDice) {
  return Math.max(1, Math.floor(totalHitDice / 2));
}

/** 5e weapon data table — name, damage, type, properties. */
export const WEAPONS = {
  // Simple melee
  Club:         { damage: '1d4',  type: 'bludgeoning', ability: 'STR', properties: ['light'] },
  Dagger:       { damage: '1d4',  type: 'piercing',    ability: 'STR', properties: ['finesse', 'light', 'thrown'] },
  Greatclub:    { damage: '1d8',  type: 'bludgeoning', ability: 'STR', properties: ['two-handed'] },
  Handaxe:      { damage: '1d6',  type: 'slashing',    ability: 'STR', properties: ['light', 'thrown'] },
  Javelin:      { damage: '1d6',  type: 'piercing',    ability: 'STR', properties: ['thrown'] },
  'Light Hammer': { damage: '1d4', type: 'bludgeoning', ability: 'STR', properties: ['light', 'thrown'] },
  Mace:         { damage: '1d6',  type: 'bludgeoning', ability: 'STR', properties: [] },
  Quarterstaff: { damage: '1d6',  type: 'bludgeoning', ability: 'STR', properties: ['versatile'] },
  Sickle:       { damage: '1d4',  type: 'slashing',    ability: 'STR', properties: ['light'] },
  Spear:        { damage: '1d6',  type: 'piercing',    ability: 'STR', properties: ['thrown', 'versatile'] },
  // Simple ranged
  'Light Crossbow': { damage: '1d8', type: 'piercing', ability: 'DEX', properties: ['ammunition', 'loading', 'two-handed'] },
  Dart:         { damage: '1d4',  type: 'piercing',    ability: 'DEX', properties: ['finesse', 'thrown'] },
  Shortbow:     { damage: '1d6',  type: 'piercing',    ability: 'DEX', properties: ['ammunition', 'two-handed'] },
  Sling:        { damage: '1d4',  type: 'bludgeoning', ability: 'DEX', properties: ['ammunition'] },
  // Martial melee
  Battleaxe:    { damage: '1d8',  type: 'slashing',    ability: 'STR', properties: ['versatile'] },
  Flail:        { damage: '1d8',  type: 'bludgeoning', ability: 'STR', properties: [] },
  Glaive:       { damage: '1d10', type: 'slashing',    ability: 'STR', properties: ['heavy', 'reach', 'two-handed'] },
  Greataxe:     { damage: '1d12', type: 'slashing',    ability: 'STR', properties: ['heavy', 'two-handed'] },
  Greatsword:   { damage: '2d6',  type: 'slashing',    ability: 'STR', properties: ['heavy', 'two-handed'] },
  Halberd:      { damage: '1d10', type: 'slashing',    ability: 'STR', properties: ['heavy', 'reach', 'two-handed'] },
  Lance:        { damage: '1d12', type: 'piercing',    ability: 'STR', properties: ['reach', 'special'] },
  Longsword:    { damage: '1d8',  type: 'slashing',    ability: 'STR', properties: ['versatile'] },
  Maul:         { damage: '2d6',  type: 'bludgeoning', ability: 'STR', properties: ['heavy', 'two-handed'] },
  Morningstar:  { damage: '1d8',  type: 'piercing',    ability: 'STR', properties: [] },
  Pike:         { damage: '1d10', type: 'piercing',    ability: 'STR', properties: ['heavy', 'reach', 'two-handed'] },
  Rapier:       { damage: '1d8',  type: 'piercing',    ability: 'STR', properties: ['finesse'] },
  Scimitar:     { damage: '1d6',  type: 'slashing',    ability: 'STR', properties: ['finesse', 'light'] },
  Shortsword:   { damage: '1d6',  type: 'piercing',    ability: 'STR', properties: ['finesse', 'light'] },
  Trident:      { damage: '1d6',  type: 'piercing',    ability: 'STR', properties: ['thrown', 'versatile'] },
  'War Pick':   { damage: '1d8',  type: 'piercing',    ability: 'STR', properties: [] },
  Warhammer:    { damage: '1d8',  type: 'bludgeoning', ability: 'STR', properties: ['versatile'] },
  Whip:         { damage: '1d4',  type: 'slashing',    ability: 'STR', properties: ['finesse', 'reach'] },
  // Martial ranged
  Blowgun:      { damage: '1',    type: 'piercing',    ability: 'DEX', properties: ['ammunition', 'loading'] },
  'Hand Crossbow': { damage: '1d6', type: 'piercing',  ability: 'DEX', properties: ['ammunition', 'light', 'loading'] },
  'Heavy Crossbow': { damage: '1d10', type: 'piercing', ability: 'DEX', properties: ['ammunition', 'heavy', 'loading', 'two-handed'] },
  Longbow:      { damage: '1d8',  type: 'piercing',    ability: 'DEX', properties: ['ammunition', 'heavy', 'two-handed'] },
  Net:          { damage: '0',    type: 'none',        ability: 'DEX', properties: ['special', 'thrown'] },
};

/** Check if a weapon is finesse (uses higher of STR/DEX). */
export function isFinesse(weaponName) {
  const w = WEAPONS[weaponName];
  return w ? w.properties.includes('finesse') : false;
}

/** Get the best ability for a weapon attack (handles finesse). */
export function getWeaponAbility(weaponName, strScore, dexScore) {
  const w = WEAPONS[weaponName];
  if (!w) return 'STR';
  if (w.properties.includes('finesse')) {
    return calcMod(dexScore) >= calcMod(strScore) ? 'DEX' : 'STR';
  }
  return w.ability;
}

/** Auto-generate attack bonus string for a weapon. */
export function autoAttackBonus(weaponName, abilityScores, profBonus, magicBonus = 0) {
  const strScore = abilityScores.STR || 10;
  const dexScore = abilityScores.DEX || 10;
  const ability = getWeaponAbility(weaponName, strScore, dexScore);
  const abilityMod = calcMod(ability === 'DEX' ? dexScore : strScore);
  return calcAttackBonus(abilityMod, profBonus, magicBonus);
}

/** Auto-generate damage string for a weapon (e.g., "1d8+3"). */
export function autoDamageString(weaponName, abilityScores, magicBonus = 0) {
  const w = WEAPONS[weaponName];
  if (!w) return null;
  const strScore = abilityScores.STR || 10;
  const dexScore = abilityScores.DEX || 10;
  const ability = getWeaponAbility(weaponName, strScore, dexScore);
  const abilityMod = calcMod(ability === 'DEX' ? dexScore : strScore);
  const totalMod = abilityMod + magicBonus;
  if (totalMod === 0) return w.damage;
  return `${w.damage}${totalMod >= 0 ? '+' : ''}${totalMod}`;
}

/** Get spell slots for a caster type at a given level. Returns [{slot_level, max_slots}]. */
export function getSpellSlotsForClass(casterType, level) {
  // Import-free: use the hardcoded slot tables
  if (!casterType || level < 1) return [];
  const lvl = Math.min(20, Math.max(1, level));

  if (casterType === 'pact') {
    const pact = PACT_MAGIC_TABLE[lvl - 1];
    if (!pact || pact.slots === 0) return [];
    return [{ slot_level: pact.slotLevel, max_slots: pact.slots }];
  }

  const table = casterType === 'full' ? FULL_CASTER_SLOTS
    : casterType === 'half' ? HALF_CASTER_SLOTS
    : casterType === 'third' ? THIRD_CASTER_SLOTS
    : null;

  if (!table) return [];
  const row = table[lvl - 1];
  return row
    .map((slots, i) => ({ slot_level: i + 1, max_slots: slots }))
    .filter(s => s.max_slots > 0);
}

// Inline spell slot tables (mirrors rules5e.js but avoids circular imports)
const FULL_CASTER_SLOTS = [
  [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1],
];
const HALF_CASTER_SLOTS = [
  [0,0,0,0,0],[2,0,0,0,0],[3,0,0,0,0],[3,0,0,0,0],[4,2,0,0,0],
  [4,2,0,0,0],[4,3,0,0,0],[4,3,0,0,0],[4,3,2,0,0],[4,3,2,0,0],
  [4,3,3,0,0],[4,3,3,0,0],[4,3,3,1,0],[4,3,3,1,0],[4,3,3,2,0],
  [4,3,3,2,0],[4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2],
];
const THIRD_CASTER_SLOTS = [
  [0,0,0,0],[0,0,0,0],[2,0,0,0],[3,0,0,0],[3,0,0,0],
  [3,0,0,0],[4,2,0,0],[4,2,0,0],[4,2,0,0],[4,3,0,0],
  [4,3,0,0],[4,3,0,0],[4,3,2,0],[4,3,2,0],[4,3,2,0],
  [4,3,3,0],[4,3,3,0],[4,3,3,0],[4,3,3,1],[4,3,3,1],
];
const PACT_MAGIC_TABLE = [
  {slots:1,slotLevel:1},{slots:2,slotLevel:1},{slots:2,slotLevel:2},{slots:2,slotLevel:2},
  {slots:2,slotLevel:3},{slots:2,slotLevel:3},{slots:2,slotLevel:4},{slots:2,slotLevel:4},
  {slots:2,slotLevel:5},{slots:2,slotLevel:5},{slots:3,slotLevel:5},{slots:3,slotLevel:5},
  {slots:3,slotLevel:5},{slots:3,slotLevel:5},{slots:3,slotLevel:5},{slots:3,slotLevel:5},
  {slots:4,slotLevel:5},{slots:4,slotLevel:5},{slots:4,slotLevel:5},{slots:4,slotLevel:5},
];

/** Armor AC calculation table. */
export const ARMOR_TABLE = {
  'Padded Armor':    { base: 11, type: 'light' },
  'Leather Armor':   { base: 11, type: 'light' },
  'Studded Leather': { base: 12, type: 'light' },
  'Hide Armor':      { base: 12, type: 'medium', maxDex: 2 },
  'Chain Shirt':     { base: 13, type: 'medium', maxDex: 2 },
  'Scale Mail':      { base: 14, type: 'medium', maxDex: 2 },
  'Breastplate':     { base: 14, type: 'medium', maxDex: 2 },
  'Half Plate':      { base: 15, type: 'medium', maxDex: 2 },
  'Ring Mail':       { base: 14, type: 'heavy' },
  'Chain Mail':      { base: 16, type: 'heavy' },
  'Splint Armor':    { base: 17, type: 'heavy' },
  'Plate Armor':     { base: 18, type: 'heavy' },
};

/** Calculate AC from armor + DEX mod + shield + magic bonuses. */
export function calcAC(armorName, dexScore, hasShield = false, magicArmorBonus = 0, magicShieldBonus = 0) {
  const dexMod = calcMod(dexScore);
  const armor = ARMOR_TABLE[armorName];
  let ac;
  if (!armor) {
    // No armor: 10 + DEX
    ac = 10 + dexMod;
  } else if (armor.type === 'light') {
    ac = armor.base + dexMod;
  } else if (armor.type === 'medium') {
    ac = armor.base + Math.min(dexMod, armor.maxDex || 2);
  } else {
    // Heavy: no DEX
    ac = armor.base;
  }
  ac += magicArmorBonus;
  if (hasShield) ac += 2 + magicShieldBonus;
  return ac;
}
