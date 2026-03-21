/**
 * playerMulticlassDipGuide.js
 * Player Mode: Best 1-3 level multiclass dips for each class
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_REQUIREMENTS = {
  description: 'You need a 13 in the ability score(s) for BOTH your current class AND the class you\'re dipping into.',
  requirements: {
    Barbarian: 'STR 13',
    Bard: 'CHA 13',
    Cleric: 'WIS 13',
    Druid: 'WIS 13',
    Fighter: 'STR 13 or DEX 13',
    Monk: 'DEX 13 and WIS 13',
    Paladin: 'STR 13 and CHA 13',
    Ranger: 'DEX 13 and WIS 13',
    Rogue: 'DEX 13',
    Sorcerer: 'CHA 13',
    Warlock: 'CHA 13',
    Wizard: 'INT 13',
  },
};

export const BEST_DIPS = [
  {
    dip: 'Fighter 1',
    gains: ['CON save proficiency', 'Heavy armor + shields', 'Fighting style', 'Second Wind'],
    bestFor: ['Wizard', 'Sorcerer', 'Cleric', 'Warlock'],
    why: 'CON save proficiency for concentration. Heavy armor for AC. Fighting style for damage.',
    rating: 'S',
  },
  {
    dip: 'Fighter 2',
    gains: ['Everything from 1 + Action Surge'],
    bestFor: ['Wizard', 'Sorcerer', 'Any full caster'],
    why: 'Action Surge = two leveled spells in one turn. Two Fireballs. Two Counterspells. Insane.',
    rating: 'S',
  },
  {
    dip: 'Hexblade Warlock 1',
    gains: ['CHA for weapon attacks', 'Shield + medium armor', 'Hexblade\'s Curse', 'Hex spell'],
    bestFor: ['Paladin', 'Bard (Swords/Valor)', 'Sorcerer'],
    why: 'CHA for everything. Paladin gets CHA attacks + CHA aura + CHA spells. Single-stat wonder.',
    rating: 'S',
  },
  {
    dip: 'Warlock 2',
    gains: ['Hexblade 1 + 2 invocations (Agonizing Blast, Devil\'s Sight, etc.)'],
    bestFor: ['Sorcerer (Sorlock)', 'Bard', 'Paladin'],
    why: 'Agonizing Blast makes Eldritch Blast the best cantrip. Short rest spell slots.',
    rating: 'S',
  },
  {
    dip: 'Cleric 1 (Life/Forge/Twilight)',
    gains: ['Heavy armor', 'Shield', 'Healing spells', 'Subclass features at 1'],
    bestFor: ['Wizard', 'Druid', 'Ranger'],
    why: 'Heavy armor + shield + subclass feature at level 1. Life Cleric + Goodberry = 40 HP from 1st level slot.',
    rating: 'A',
  },
  {
    dip: 'Rogue 1',
    gains: ['Sneak Attack (1d6)', 'Expertise (2 skills)', 'Thieves\' tools'],
    bestFor: ['Ranger', 'Fighter (DEX)', 'Monk'],
    why: 'Expertise is incredible for grappling (Athletics expertise) or social skills.',
    rating: 'A',
  },
  {
    dip: 'Rogue 2',
    gains: ['Rogue 1 + Cunning Action'],
    bestFor: ['Ranger', 'Fighter (DEX)', 'Monk'],
    why: 'Bonus action Dash/Disengage/Hide. Amazing mobility.',
    rating: 'A',
  },
  {
    dip: 'Paladin 2',
    gains: ['Divine Smite', 'Fighting style', 'Spellcasting', 'Lay on Hands'],
    bestFor: ['Warlock', 'Sorcerer', 'Bard'],
    why: 'Divine Smite with Warlock/Sorcerer spell slots. Crit smites are devastating.',
    rating: 'A',
  },
  {
    dip: 'Barbarian 1',
    gains: ['Rage', 'Unarmored Defense', 'CON save proficiency (if first class)'],
    bestFor: ['Fighter', 'Rogue (melee)'],
    why: 'Rage gives resistance to physical damage AND bonus damage. Incredible survivability.',
    rating: 'A',
  },
  {
    dip: 'Artificer 1',
    gains: ['CON save proficiency', 'Medium armor + shields', 'Magical Tinkering', 'Cure Wounds'],
    bestFor: ['Wizard'],
    why: 'Similar to Fighter dip but with INT casting. Better for Wizards thematically.',
    rating: 'B',
  },
];

export const FAMOUS_MULTICLASS_BUILDS = [
  { name: 'Sorlock', split: 'Sorcerer X / Warlock 2-3', concept: 'Eldritch Blast + Agonizing Blast + Quickened Spell. Short rest Warlock slots convert to sorcery points.', rating: 'S' },
  { name: 'Sorcadin', split: 'Paladin 6 / Sorcerer X', concept: 'Paladin Aura + Sorcerer spell slots for Smite. Twinned/Quickened Smite spells.', rating: 'S' },
  { name: 'Padlock', split: 'Paladin X / Hexblade 1-2', concept: 'CHA for weapon attacks + aura + smites. Single-stat SAD build.', rating: 'S' },
  { name: 'Coffeelock', split: 'Warlock 2+ / Sorcerer X', concept: 'Convert Warlock short rest slots into sorcery points. Theoretically infinite spell slots.', rating: 'A (controversial)' },
  { name: 'Hexbard', split: 'Bard (Swords/Valor) X / Hexblade 1', concept: 'CHA weapon attacks + full Bard casting. Excellent at everything.', rating: 'A' },
  { name: 'Gloom Stalker/Assassin', split: 'Ranger 3 / Rogue 3+', concept: 'First turn: auto-crit surprised targets + extra attack + extra damage. Nova king.', rating: 'A' },
];

export const DIP_TIMING = {
  when: [
    { timing: 'Level 1 (if first class)', benefit: 'Get the dip class\'s save proficiencies and armor. Strong start.', risk: 'Delay your main class features.' },
    { timing: 'After level 5', benefit: 'You have Extra Attack/3rd level spells. Safe to dip.', risk: 'Delay level 6-8 features (sometimes important).' },
    { timing: 'After level 6 (Paladin)', benefit: 'Aura of Protection is too good to delay past 6.', risk: 'None — best dip timing for Paladin multiclasses.' },
    { timing: 'After level 8+', benefit: 'You have your core features. Dip for utilities.', risk: 'May delay capstone features (often weak anyway).' },
  ],
  avoid: 'Don\'t dip before level 5 unless the dip gives something critical (like Fighter 1 for CON saves on a Wizard).',
};

export function canMulticlass(currentClass, dipClass, abilityScores) {
  const reqs = {
    Barbarian: { STR: 13 }, Bard: { CHA: 13 }, Cleric: { WIS: 13 }, Druid: { WIS: 13 },
    Fighter: { STR: 13 }, Monk: { DEX: 13, WIS: 13 }, Paladin: { STR: 13, CHA: 13 },
    Ranger: { DEX: 13, WIS: 13 }, Rogue: { DEX: 13 }, Sorcerer: { CHA: 13 },
    Warlock: { CHA: 13 }, Wizard: { INT: 13 },
  };

  const currentReqs = reqs[currentClass] || {};
  const dipReqs = reqs[dipClass] || {};
  const allReqs = { ...currentReqs, ...dipReqs };

  for (const [stat, min] of Object.entries(allReqs)) {
    if ((abilityScores[stat] || 10) < min) return { canDip: false, reason: `${stat} must be at least ${min}. Currently ${abilityScores[stat] || 10}.` };
  }
  return { canDip: true, reason: 'Meets all multiclass requirements.' };
}

export function getBestDips(className) {
  return BEST_DIPS.filter(d => d.bestFor.includes(className));
}
