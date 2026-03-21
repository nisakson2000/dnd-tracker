/**
 * playerHealingOptimization.js
 * Player Mode: Healing spell efficiency, when to heal, and healing math
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  core: 'In 5e, healing during combat is generally LESS efficient than killing enemies. Dead enemies deal 0 damage.',
  exceptions: [
    'Heal someone at 0 HP — getting them back up is always worth it.',
    'Healing Word is efficient because it\'s a bonus action (you still attack with your action).',
    'Life Cleric + Goodberry = 40 HP of healing from a 1st level slot (out of combat).',
    'Heal (6th level) restores 70 HP in one action. This is actual in-combat healing.',
  ],
  yoyoHealing: 'The "yo-yo" strategy: let allies drop to 0, then Healing Word them back. Controversial but mathematically optimal in 5e.',
};

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, healing: '1d4 + mod', action: 'Bonus action', range: '60ft', rating: 'S', why: 'Bonus action, ranged, picks up 0 HP allies. Best healing spell in the game.' },
  { spell: 'Heal', level: 6, healing: '70 HP', action: 'Action', range: '60ft', rating: 'S', why: '70 HP flat. Also cures blindness, deafness, disease. Actual in-combat healing.' },
  { spell: 'Goodberry', level: 1, healing: '10 × 1 HP', action: 'Action', range: 'Touch', rating: 'A', why: '10 berries, 1 HP each. Life Cleric makes each berry heal 4 HP. Out-of-combat king.' },
  { spell: 'Cure Wounds', level: 1, healing: '1d8 + mod', action: 'Action', range: 'Touch', rating: 'B', why: 'Uses your action AND requires touch. Healing Word is better in almost all cases.' },
  { spell: 'Mass Healing Word', level: 3, healing: '1d4 + mod × 6', action: 'Bonus action', range: '60ft', rating: 'A', why: 'Healing Word but hits 6 creatures. Great when multiple allies are down.' },
  { spell: 'Mass Cure Wounds', level: 5, healing: '3d8 + mod × 6', action: 'Action', range: '60ft', rating: 'B', why: 'Big AoE heal but uses your action and a 5th level slot.' },
  { spell: 'Prayer of Healing', level: 2, healing: '2d8 + mod × 6', action: '10 min', range: '30ft', rating: 'A', why: 'Out of combat only. Heals entire party. Efficient for downtime healing.' },
  { spell: 'Aura of Vitality', level: 3, healing: '20d6 total', action: 'Bonus action/turn', range: '30ft aura', rating: 'A', why: '2d6 healing per bonus action for 1 minute. 70 average total. Great post-combat.' },
  { spell: 'Regenerate', level: 7, healing: '4d8+15 + 1 HP/round', action: 'Action', range: 'Touch', rating: 'A', why: 'Regrows limbs. 1 HP per round for 1 hour = 600 HP total over duration.' },
  { spell: 'Power Word Heal', level: 9, healing: 'Full HP', action: 'Action', range: 'Touch', rating: 'S', why: 'Fully heals any creature. Also cures charmed, frightened, paralyzed, stunned.' },
];

export const HEALING_EFFICIENCY = {
  description: 'HP healed per spell slot level — lower is more efficient',
  comparison: [
    { spell: 'Goodberry', slotLevel: 1, avgHealing: 10, hpPerSlot: 10, note: 'Life Cleric: 40 HP per slot. Best efficiency.' },
    { spell: 'Healing Word', slotLevel: 1, avgHealing: 6.5, hpPerSlot: 6.5, note: 'But it\'s a bonus action — action economy matters more.' },
    { spell: 'Cure Wounds', slotLevel: 1, avgHealing: 8.5, hpPerSlot: 8.5, note: 'Slightly more HP but costs your action.' },
    { spell: 'Heal', slotLevel: 6, avgHealing: 70, hpPerSlot: 11.7, note: 'Best efficiency for high-level healing.' },
    { spell: 'Aura of Vitality', slotLevel: 3, avgHealing: 70, hpPerSlot: 23.3, note: 'Over 10 rounds. Amazing out-of-combat.' },
  ],
};

export const WHEN_TO_HEAL = [
  { situation: 'Ally at 0 HP', action: 'HEAL NOW', detail: 'Healing Word (bonus action) to pick them up. Even 1 HP = they can act.', priority: 'S' },
  { situation: 'Ally below 25% HP', action: 'Consider healing', detail: 'If they\'re about to take another hit, healing prevents a down. If not, attack instead.', priority: 'A' },
  { situation: 'Ally at 50% HP', action: 'Usually don\'t heal', detail: 'They can survive another hit. Kill enemies to reduce incoming damage.', priority: 'C' },
  { situation: 'Multiple allies injured', action: 'Mass Healing Word or AoE heal', detail: 'If 3+ allies are hurt, AoE healing is efficient.', priority: 'A' },
  { situation: 'Out of combat', action: 'Prayer of Healing or short rest', detail: 'Save combat spell slots. Use hit dice and out-of-combat healing.', priority: 'A' },
  { situation: 'Boss fight', action: 'Heal reactively', detail: 'Heal only at 0 HP. Focus on killing the boss. Dead boss = 0 future damage.', priority: 'S' },
];

export const LIFE_CLERIC_COMBOS = [
  { combo: 'Life Cleric + Goodberry', detail: 'Disciple of Life adds 2 + spell level to healing. Each berry heals 4 HP. 10 berries = 40 HP from 1st level slot.' },
  { combo: 'Life Cleric + Healing Word', detail: 'Healing Word heals 1d4 + WIS + 3 (Disciple of Life). Average ~9 HP as a bonus action.' },
  { combo: 'Life Cleric + Aura of Vitality', detail: 'Each 2d6 tick gets +5 from Disciple of Life. 12 HP average per tick. 120 HP total.' },
  { combo: 'Life Cleric + Spirit Guardians', detail: 'Not healing, but Spirit Guardians is the best Cleric concentration spell. Deal damage AND heal when needed.' },
];

export function healingPerSlot(spellLevel, healingDice, dieSize, modifier) {
  const avgDie = (dieSize + 1) / 2;
  return Math.floor(healingDice * avgDie + modifier);
}

export function shouldHealOrAttack(allyHPPercent, expectedDamageToAlly, expectedDamageToEnemy, enemyHP) {
  if (allyHPPercent <= 0) return { action: 'heal', reason: 'Ally is at 0 HP. Pick them up.' };
  if (expectedDamageToEnemy >= enemyHP) return { action: 'attack', reason: 'You can kill the enemy this turn. Dead enemies deal 0 damage.' };
  if (allyHPPercent < 0.15 && expectedDamageToAlly > 0) return { action: 'heal', reason: 'Ally is critically low and will likely go down.' };
  return { action: 'attack', reason: 'Killing enemies prevents more damage than healing restores.' };
}

export function goodberryHealing(isLifeCleric, spellLevel) {
  const perBerry = isLifeCleric ? 1 + 2 + spellLevel : 1;
  return { perBerry, total: perBerry * 10 };
}
