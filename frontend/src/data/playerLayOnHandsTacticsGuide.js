/**
 * playerLayOnHandsTacticsGuide.js
 * Player Mode: Paladin Lay on Hands — optimization, allocation, and best practices
 * Pure JS — no React dependencies.
 */

export const LAY_ON_HANDS_RULES = {
  pool: 'Paladin level × 5 HP.',
  action: '1 Action. Touch range.',
  healing: 'Choose how many HP to restore from your pool.',
  disease: '5 HP from pool to cure one disease or neutralize one poison.',
  note: 'Most efficient healing in the game. You choose exact HP, no wasting.',
};

export const LOH_POOL_BY_LEVEL = [
  { level: 1, pool: 5 },
  { level: 2, pool: 10 },
  { level: 3, pool: 15 },
  { level: 4, pool: 20 },
  { level: 5, pool: 25 },
  { level: 6, pool: 30 },
  { level: 7, pool: 35 },
  { level: 8, pool: 40 },
  { level: 9, pool: 45 },
  { level: 10, pool: 50 },
  { level: 15, pool: 75 },
  { level: 20, pool: 100 },
];

export const LOH_OPTIMIZATION = [
  { tactic: '1 HP to revive downed allies', effect: 'Spend just 1 HP to bring an unconscious ally to 1 HP.', rating: 'S+', note: 'Most important use. Getting allies up costs only 1 HP from pool. Do this instead of big heals.' },
  { tactic: 'Save pool for emergencies', effect: 'Don\'t heal chip damage. Save for revives and critical moments.', rating: 'S', note: 'Full heals are wasteful. 1 HP revive is always better than topping off.' },
  { tactic: 'Cure disease/poison (5 HP)', effect: 'Remove disease or poison for 5 HP from pool.', rating: 'A+', note: 'Cheap disease/poison removal. Saves spell slots for Lesser/Greater Restoration.' },
  { tactic: 'Out-of-combat healing', effect: 'Use between fights to top off. Saves hit dice and spell slots.', rating: 'A', note: 'Good use of remaining pool after combat. Stretch short rest resources.' },
  { tactic: 'Self-heal in melee', effect: 'Touch range includes yourself. Heal while tanking.', rating: 'A', note: 'Costs your action though. Only if you can\'t attack effectively.' },
];

export const LOH_VS_HEALING_SPELLS = [
  { comparison: 'LoH vs Cure Wounds', verdict: 'LoH for 1 HP revives. Cure Wounds for bigger heals when pool is low.', note: 'LoH is more efficient for small heals. Cure Wounds is a spell slot though.' },
  { comparison: 'LoH vs Healing Word', verdict: 'Healing Word is BA + ranged. LoH is Action + touch. HW is more action-efficient.', note: 'If you have Healing Word (Blessed Warrior), use that for revives to keep attacking.' },
  { comparison: 'LoH vs Potion', verdict: 'LoH is free (from pool). Potions cost gold. LoH wins economically.', note: 'But potions don\'t cost your action in houserule games (BA to drink).' },
];

export const LOH_TIPS = [
  '1 HP revive is the #1 use. Getting an ally from 0 to 1 is the most impactful healing.',
  'Don\'t heal full. A character at 1 HP functions identically to one at full HP.',
  'Pool = Paladin level × 5. At L10, you have 50 HP to distribute.',
  'Cure disease/poison for just 5 HP. Cheaper than a spell slot.',
  'LoH costs your ACTION. In combat, often better to attack and let the Cleric heal.',
  'LoH is touch range. You need to be adjacent to the target.',
  'Between combats: use remaining pool to top off the party. Saves hit dice.',
  'Multiclass: pool only scales with Paladin levels, not total character level.',
  'At high levels (75-100 HP pool), you\'re a significant off-healer.',
  'LoH cannot bring back the dead. Only works on living creatures with 0+ HP.',
];
