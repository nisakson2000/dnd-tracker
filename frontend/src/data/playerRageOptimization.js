/**
 * playerRageOptimization.js
 * Player Mode: Barbarian Rage mechanics, optimization, and subclass rage features
 * Pure JS — no React dependencies.
 */

export const RAGE_BASICS = {
  activation: 'Bonus action. Must not be wearing heavy armor.',
  duration: '1 minute (10 rounds). Ends early if you don\'t attack or take damage each turn.',
  uses: '2 (L1), 3 (L3), 4 (L6), 5 (L12), 6 (L17), Unlimited (L20).',
  recovery: 'All rages recover on long rest.',
};

export const RAGE_BENEFITS = [
  { benefit: 'Damage bonus', detail: '+2 (L1), +3 (L9), +4 (L16). Added to melee weapon attacks using STR.', note: 'Applies to EVERY hit. With Extra Attack = +4 to +8 per round.' },
  { benefit: 'Resistance', detail: 'Resistance to bludgeoning, piercing, and slashing damage.', note: 'Effectively doubles your HP against physical damage. THE reason to rage.' },
  { benefit: 'Advantage on STR checks/saves', detail: 'Advantage on all Strength checks and saving throws.', note: 'Automatic advantage on grapple (Athletics) and shove attempts.' },
];

export const RAGE_LIMITATIONS = [
  'Can\'t cast or concentrate on spells while raging.',
  'Must attack or take damage each turn to maintain rage.',
  'Only works with melee attacks using STR (not DEX, not ranged).',
  'Heavy armor prevents rage entirely.',
  'No benefit to spell-based abilities.',
];

export const MAINTAINING_RAGE = [
  { method: 'Attack every turn', detail: 'Make at least one attack roll per turn. Even if you miss, rage continues.', priority: 'S' },
  { method: 'Take damage', detail: 'If you can\'t reach an enemy to attack, getting hit also maintains rage.', priority: 'A' },
  { method: 'Reckless Attack', detail: 'Advantage on your attacks (but attacks against you also have advantage). More hits = more rage damage.', priority: 'S' },
  { method: 'Throw a handaxe', detail: 'If you can\'t reach melee, throw a handaxe. It\'s an attack roll (maintains rage) but no rage damage bonus (ranged).', priority: 'B' },
];

export const RECKLESS_ATTACK = {
  effect: 'First attack of your turn: choose advantage on all STR melee attacks this turn. All attacks against you have advantage until your next turn.',
  math: 'Advantage ≈ +5 to hit. With GWM (-5/+10), advantage offsets the penalty perfectly.',
  when: ['Always with Great Weapon Master (the math demands it)', 'When you need to hit and can survive being hit', 'When enemies are already attacking you anyway'],
  whenNot: ['When you\'re nearly dead and can\'t afford to be hit', 'When multiple high-damage enemies are targeting you'],
  rating: 'S (usually always use it)',
};

export const SUBCLASS_RAGE_FEATURES = [
  { subclass: 'Berserker', feature: 'Frenzy', effect: 'Bonus action melee attack each turn while raging.', cost: 'Exhaustion after rage ends.', rating: 'B', note: 'Exhaustion is brutal. Excellent damage but harsh penalty.' },
  { subclass: 'Totem (Bear)', feature: 'Bear Totem', effect: 'Resistance to ALL damage except psychic while raging.', cost: 'None.', rating: 'S', note: 'Resistance to everything. You\'re effectively twice as tanky.' },
  { subclass: 'Totem (Wolf)', feature: 'Wolf Totem', effect: 'Allies have advantage on melee attacks against enemies within 5ft of you.', cost: 'None.', rating: 'A', note: 'Free advantage for your melee allies. Pack tactics for the party.' },
  { subclass: 'Totem (Eagle)', feature: 'Eagle Totem', effect: 'Dash as bonus action while raging. Enemies have disadvantage on OAs against you.', cost: 'None.', rating: 'B', note: 'Mobile but less impactful than Bear or Wolf.' },
  { subclass: 'Zealot', feature: 'Divine Fury', effect: 'First hit each turn deals extra 1d6+half barb level radiant/necrotic.', cost: 'None.', rating: 'S', note: 'Free damage on every turn. Plus free resurrection (Warrior of the Gods).' },
  { subclass: 'Ancestral Guardian', feature: 'Ancestral Protectors', effect: 'First enemy you hit has disadvantage attacking anyone but you + half damage to others.', cost: 'None.', rating: 'S', note: 'Best tank subclass. Forces enemies to attack you or suffer.' },
  { subclass: 'Storm Herald', feature: 'Storm Aura', effect: 'Desert: 2 fire/turn. Sea: lightning bolt (DEX save). Tundra: temp HP.', cost: 'BA to activate.', rating: 'B', note: 'Modest effects. Tundra temp HP is the best option.' },
  { subclass: 'Wild Magic', feature: 'Wild Surge', effect: 'Roll d8 for random effect when entering rage.', cost: 'None.', rating: 'A', note: 'Some effects are very strong. Always fun, sometimes powerful.' },
];

export function rageDamageBonus(barbLevel) {
  if (barbLevel >= 16) return 4;
  if (barbLevel >= 9) return 3;
  return 2;
}

export function effectiveHP(hp, hasRage, resistAll) {
  if (!hasRage) return hp;
  return resistAll ? hp * 2 : Math.floor(hp * 1.7); // ~70% of damage is physical
}

export function ragesPerDay(barbLevel) {
  if (barbLevel >= 20) return Infinity;
  if (barbLevel >= 17) return 6;
  if (barbLevel >= 12) return 5;
  if (barbLevel >= 6) return 4;
  if (barbLevel >= 3) return 3;
  return 2;
}
