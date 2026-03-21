/**
 * playerDefensivePlaybook.js
 * Player Mode: Defensive strategies, damage mitigation, and survival tactics
 * Pure JS — no React dependencies.
 */

export const DEFENSIVE_LAYERS = [
  { layer: 'Avoidance', description: 'Don\'t get hit in the first place.', methods: ['High AC', 'Shield spell (+5 AC)', 'Blur (disadvantage on attacks)', 'Mirror Image (decoys)', 'Dodge action'], priority: 1 },
  { layer: 'Reduction', description: 'Take less damage when you do get hit.', methods: ['Barbarian Rage (resist physical)', 'Heavy Armor Master (-3 physical)', 'Absorb Elements (half elemental)', 'Uncanny Dodge (half one attack)'], priority: 2 },
  { layer: 'Recovery', description: 'Heal damage after taking it.', methods: ['Healing Word (bonus action)', 'Second Wind (Fighter)', 'Lay on Hands (Paladin)', 'Short rest Hit Dice'], priority: 3 },
  { layer: 'Prevention', description: 'Stop enemies from attacking at all.', methods: ['Stunning Strike', 'Hold Person/Monster', 'Hypnotic Pattern', 'Wall of Force', 'Banishment'], priority: 1 },
];

export const AC_STACKING = [
  { source: 'Base Armor', example: 'Plate: 18 AC', stacks: 'Base — choose one armor type' },
  { source: 'Shield', example: '+2 AC', stacks: 'Stacks with armor' },
  { source: 'Shield spell', example: '+5 AC (reaction)', stacks: 'Stacks with everything. Lasts until your next turn.' },
  { source: 'Shield of Faith', example: '+2 AC (concentration)', stacks: 'Stacks with all. Concentration.' },
  { source: 'Haste', example: '+2 AC (concentration)', stacks: 'Stacks with all. Lethargy on drop.' },
  { source: 'Cloak/Ring of Protection', example: '+1 AC each', stacks: 'Both stack. +1 to saves too.' },
  { source: 'Fighting Style: Defense', example: '+1 AC while wearing armor', stacks: 'Passive bonus. Always active.' },
  { source: 'Warforged racial', example: '+1 AC', stacks: 'Integrated protection. Always on.' },
];

export const MAX_AC_BUILDS = [
  { build: 'Plate + Shield + Defense', ac: 21, level: 1, cost: '1500+ gp', note: 'Achievable at level 1 with gold buy. Heavy armor proficiency required.' },
  { build: '+ Shield of Faith', ac: 23, level: 1, cost: 'Concentration', note: 'Cleric or Paladin. Concentration cost.' },
  { build: '+ Shield spell', ac: 26, level: 1, cost: 'Reaction + 1st slot', note: 'Eldritch Knight, Hexblade, or multiclass. Reaction-based.' },
  { build: '+ Cloak + Ring of Protection', ac: 28, level: 5, cost: '2 attunement slots', note: 'Needs magic items. Rare+.' },
  { build: '+ Haste', ac: 30, level: 5, cost: 'Ally concentration', note: 'Requires an ally casting Haste on you.' },
];

export const TANKING_STRATEGIES = [
  { strategy: 'Sentinel', description: 'Reduce enemy speed to 0 on OA hit. They can\'t move past you.', effectiveness: 'S' },
  { strategy: 'Compelled Duel', description: 'Enemy has disadvantage on attacks against anyone but you.', effectiveness: 'A' },
  { strategy: 'Ancestral Guardian', description: 'Barbarian subclass. Attacked enemies deal half damage to your allies.', effectiveness: 'S' },
  { strategy: 'Cavalier', description: 'Fighter subclass. Mark enemies. They have disadvantage attacking allies.', effectiveness: 'A' },
  { strategy: 'Dodge + Spirit Guardians', description: 'Attacks against you have disadvantage. Enemies in aura take damage.', effectiveness: 'S' },
  { strategy: 'Interception Fighting Style', description: 'Reduce damage to ally within 5ft by 1d10+proficiency.', effectiveness: 'A' },
  { strategy: 'Protection Fighting Style', description: 'Impose disadvantage on attack against adjacent ally. Uses reaction.', effectiveness: 'B' },
];

export const EMERGENCY_DEFENSE = [
  { situation: 'About to be hit by a huge attack', options: ['Shield spell (+5 AC)', 'Absorb Elements (if elemental)', 'Uncanny Dodge (half damage, Rogue)'] },
  { situation: 'Surrounded by enemies', options: ['Dodge action (all attacks have disadvantage)', 'Disengage + run', 'Misty Step (bonus action teleport)'] },
  { situation: 'Ally dropped to 0 HP', options: ['Healing Word (bonus action, 60ft)', 'Spare the Dying (cantrip, stabilize)', 'Healer\'s Kit (stabilize, no check)'] },
  { situation: 'Concentration under fire', options: ['Shield spell (reduce damage = lower CON DC)', 'Move behind cover', 'Ask ally to stand between you and enemies'] },
];

export function calculateEffectiveHP(hp, ac, resistances) {
  // Rough effective HP calculation based on AC
  const hitChance = Math.max(0.05, (21 - (ac - 7)) / 20); // assuming +7 attack bonus enemy
  const effectiveMultiplier = 1 / hitChance;
  const resistanceMultiplier = resistances ? 2 : 1;
  return Math.round(hp * effectiveMultiplier * resistanceMultiplier);
}

export function suggestDefense(currentAC, hasCaster, hasShield) {
  const suggestions = [];
  if (currentAC < 18 && !hasShield) suggestions.push('Equip a shield (+2 AC)');
  if (hasCaster) suggestions.push('Shield spell for emergencies (+5 AC reaction)');
  if (currentAC >= 20) suggestions.push('Your AC is excellent. Focus on saving throw protection.');
  return suggestions;
}
