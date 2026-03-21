/**
 * playerSpellcastingInArmor.js
 * Player Mode: Which classes can cast in armor, penalties, and how to get armor proficiency
 * Pure JS — no React dependencies.
 */

export const ARMOR_CASTING_RULES = {
  core: 'If you wear armor you\'re NOT proficient with, you can\'t cast spells.',
  proficiency: 'Proficiency comes from your class, multiclass, or feats. Not from just wearing the armor.',
  shields: 'Same rule as armor. Must be proficient to cast while holding a shield.',
  somatic: 'Somatic components require a free hand. Sword + shield = no free hand (unless War Caster feat).',
  focus: 'If a spell has M components, you can use a focus in the same hand. S+M can be done with one hand holding a focus.',
};

export const CLASS_ARMOR_PROFICIENCY = {
  noArmor: {
    classes: ['Wizard', 'Sorcerer', 'Monk'],
    note: 'No armor proficiency by default. Must multiclass or feat for armor.',
    alternatives: ['Mage Armor (13 + DEX)', 'Unarmored Defense (Monk)', 'Draconic Resilience (13 + DEX)'],
  },
  lightArmor: {
    classes: ['Bard', 'Warlock', 'Rogue'],
    note: 'Light armor only. Studded leather (12 + DEX) is best.',
    bestArmor: 'Studded Leather: AC 12 + DEX mod. No stealth penalty.',
  },
  mediumArmor: {
    classes: ['Ranger', 'Druid', 'Artificer', 'Barbarian'],
    note: 'Medium armor. DEX mod capped at +2.',
    bestArmor: 'Half Plate: AC 15 + DEX (max 2) = 17. Breastplate: AC 16, no stealth disadvantage.',
    druidRestriction: 'Druids won\'t wear metal armor (flavor, not rules). Hide/wooden armor only RAW.',
  },
  heavyArmor: {
    classes: ['Fighter', 'Paladin', 'Cleric (some domains)'],
    note: 'Heavy armor. No DEX mod. STR requirement for some.',
    bestArmor: 'Plate: AC 18. Requires STR 15.',
    clericDomains: ['Life', 'War', 'Tempest', 'Forge', 'Nature', 'Order', 'Twilight'],
  },
};

export const GETTING_ARMOR_PROFICIENCY = [
  { method: 'Multiclass into Fighter (1 level)', gains: 'Heavy armor, shields, CON saves, Fighting Style', cost: '1 level, STR or DEX 13', rating: 'S' },
  { method: 'Multiclass into Cleric (1 level)', gains: 'Medium armor, shields (heavy with certain domains)', cost: '1 level, WIS 13', rating: 'A' },
  { method: 'Hexblade Warlock (1 level)', gains: 'Medium armor, shields, CHA weapon attacks', cost: '1 level, CHA 13', rating: 'S' },
  { method: 'Artificer (1 level)', gains: 'Medium armor, shields, CON saves', cost: '1 level, INT 13', rating: 'A' },
  { method: 'Moderately Armored feat', gains: 'Medium armor + shields', cost: 'ASI/feat slot, light armor proficiency required', rating: 'B' },
  { method: 'Heavily Armored feat', gains: 'Heavy armor', cost: 'ASI/feat slot, medium armor proficiency required', rating: 'B' },
  { method: 'Lightly Armored feat', gains: 'Light armor', cost: 'ASI/feat slot', rating: 'C (multiclass is better)' },
  { method: 'Mountain Dwarf race', gains: 'Light + medium armor', cost: 'Race choice', rating: 'A' },
];

export const HANDS_AND_CASTING = {
  problem: 'Sword in one hand + shield in other = no free hand for somatic components.',
  solutions: [
    { solution: 'War Caster feat', detail: 'Can perform somatic components while holding weapons/shield. Also advantage on concentration saves.', rating: 'S' },
    { solution: 'Drop weapon (free)', detail: 'Drop weapon → cast → pick up weapon (object interaction). Works RAW but clunky.', rating: 'B' },
    { solution: 'Ruby of the War Mage', detail: 'Common magic item. Turns your weapon into a spellcasting focus. Solves M+S one-handed.', rating: 'A' },
    { solution: 'Holy symbol on shield', detail: 'Clerics/Paladins: emblazon holy symbol on shield. Handles M component with shield hand.', rating: 'A' },
    { solution: 'Component pouch', detail: 'Free hand reaches into pouch for M component. Still need free hand for S-only spells.', rating: 'B' },
  ],
  note: 'In practice, most DMs don\'t track hand management strictly. But know the rules for strict tables.',
};

export const GISH_BUILDS = {
  description: 'Gish = melee character who also casts spells. Armor casting is essential.',
  builds: [
    { name: 'Eldritch Knight', armor: 'Heavy', casting: 'Wizard list (limited)', note: 'Shield + Absorb Elements + weapon attacks. Very tanky caster.' },
    { name: 'Hexblade Warlock', armor: 'Medium + shield', casting: 'Warlock list', note: 'CHA for everything. Hexblade\'s Curse + Eldritch Smite.' },
    { name: 'Bladesinger Wizard', armor: 'Light only', casting: 'Full Wizard list', note: 'Bladesong adds INT to AC. Very high AC despite light armor.' },
    { name: 'Valor/Swords Bard', armor: 'Medium + shield', casting: 'Full Bard list', note: 'Full caster with martial capabilities.' },
    { name: 'War Cleric', armor: 'Heavy + shield', casting: 'Full Cleric list', note: 'Spirit Guardians + heavy armor + bonus action attacks.' },
    { name: 'Paladin', armor: 'Heavy + shield', casting: 'Half caster', note: 'Smites don\'t use somatic components. Buff + hit.' },
  ],
};

export function canCastInArmor(className, armorType) {
  const proficiencies = {
    Wizard: [], Sorcerer: [], Monk: [],
    Bard: ['light'], Warlock: ['light'], Rogue: ['light'],
    Ranger: ['light', 'medium'], Druid: ['light', 'medium'], Artificer: ['light', 'medium'],
    Barbarian: ['light', 'medium'],
    Fighter: ['light', 'medium', 'heavy'], Paladin: ['light', 'medium', 'heavy'],
    Cleric: ['light', 'medium'], // Some get heavy
  };

  const profs = proficiencies[className] || [];
  return profs.includes(armorType);
}

export function bestArmorForClass(className, dexMod) {
  if (['Wizard', 'Sorcerer'].includes(className)) return { armor: 'Mage Armor', ac: 13 + dexMod };
  if (['Monk'].includes(className)) return { armor: 'None (Unarmored Defense)', ac: '10 + DEX + WIS' };
  if (dexMod >= 4) return { armor: 'Studded Leather', ac: 12 + dexMod };
  if (dexMod >= 2) return { armor: 'Half Plate', ac: 17 };
  return { armor: 'Plate', ac: 18 };
}
