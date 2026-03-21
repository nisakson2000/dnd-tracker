/**
 * playerAbilityComparison.js
 * Player Mode: Side-by-side ability comparisons for decision making
 * Pure JS — no React dependencies.
 */

export const ABILITY_SCORE_USES = {
  STR: {
    score: 'Strength',
    attacks: 'Melee weapon attacks (most), thrown weapons',
    saves: 'Resisting being pushed, grappled, or physically restrained',
    checks: 'Athletics (climbing, swimming, jumping, grappling, shoving)',
    classes: ['Barbarian', 'Fighter', 'Paladin'],
    dump: 'Safe to dump for DEX-based characters, casters, and ranged builds',
    hidden: 'Determines carry capacity (STR × 15 lbs) and long jump distance',
  },
  DEX: {
    score: 'Dexterity',
    attacks: 'Ranged weapons, finesse melee weapons',
    saves: 'Fireball, Lightning Bolt, traps, AoE damage (THE damage save)',
    checks: 'Acrobatics, Sleight of Hand, Stealth, Initiative',
    classes: ['Rogue', 'Ranger', 'Monk', 'Fighter (ranged)'],
    dump: 'Dangerous to dump — affects AC, initiative, and the most common save',
    hidden: 'Affects AC for all armor types (except heavy armor caps it)',
  },
  CON: {
    score: 'Constitution',
    attacks: 'None directly',
    saves: 'Concentration checks, poison, exhaustion, death saves aren\'t CON but HP matters',
    checks: 'Rarely used for checks. Endurance situations.',
    classes: ['Everyone — CON is universally important'],
    dump: 'NEVER dump CON. Low CON = low HP = dead character.',
    hidden: 'Determines HP per level. Retroactive if boosted later.',
  },
  INT: {
    score: 'Intelligence',
    attacks: 'Wizard spell attacks',
    saves: 'Mind Flayer Mind Blast, some illusions, Feeblemind',
    checks: 'Arcana, History, Investigation, Nature, Religion',
    classes: ['Wizard', 'Artificer', 'Eldritch Knight', 'Arcane Trickster'],
    dump: 'Safe for most non-INT classes. But INT saves can be devastating when they matter.',
    hidden: 'Determines Wizard spell preparation count and Investigation checks for finding secrets',
  },
  WIS: {
    score: 'Wisdom',
    attacks: 'Cleric/Druid/Ranger spell attacks',
    saves: 'Charm, Fear, Hold Person, Dominate — the most dangerous save type',
    checks: 'Perception, Insight, Survival, Medicine, Animal Handling',
    classes: ['Cleric', 'Druid', 'Ranger', 'Monk'],
    dump: 'Dangerous to dump — WIS saves prevent mind control. Low WIS = party liability.',
    hidden: 'Passive Perception determines if you notice traps and ambushes without trying',
  },
  CHA: {
    score: 'Charisma',
    attacks: 'Warlock/Sorcerer/Bard/Paladin spell attacks',
    saves: 'Banishment (the big one), Zone of Truth, Planar Binding',
    checks: 'Deception, Intimidation, Performance, Persuasion',
    classes: ['Bard', 'Sorcerer', 'Warlock', 'Paladin'],
    dump: 'Safest dump stat for non-CHA classes. But Banishment exists.',
    hidden: 'Paladin\'s Aura of Protection adds CHA mod to ALL saves for nearby allies',
  },
};

export const STAT_PRIORITY_BY_CLASS = {
  Barbarian: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
  Fighter: ['STR/DEX', 'CON', 'WIS', 'CHA', 'INT'],
  Paladin: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
  Ranger: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
  Rogue: ['DEX', 'CON', 'WIS/CHA', 'INT', 'STR'],
  Monk: ['DEX', 'WIS', 'CON', 'STR', 'CHA', 'INT'],
  Wizard: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
  Sorcerer: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
  Warlock: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
  Cleric: ['WIS', 'CON', 'STR', 'DEX', 'CHA', 'INT'],
  Druid: ['WIS', 'CON', 'DEX', 'INT', 'STR', 'CHA'],
  Bard: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
  Artificer: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
};

export function getAbilityInfo(ability) {
  return ABILITY_SCORE_USES[ability.toUpperCase()] || null;
}

export function getStatPriority(className) {
  return STAT_PRIORITY_BY_CLASS[className] || [];
}

export function compareAbilities(ability1, ability2) {
  const a1 = ABILITY_SCORE_USES[ability1.toUpperCase()];
  const a2 = ABILITY_SCORE_USES[ability2.toUpperCase()];
  if (!a1 || !a2) return null;
  return { [ability1]: a1, [ability2]: a2 };
}
