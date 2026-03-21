/**
 * playerCombatHealingStrategyGuide.js
 * Player Mode: When and how to heal in combat
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  goldenRule: 'Healing can\'t keep up with damage. Kill the enemy instead. Only heal to prevent death.',
  yoYoHealing: 'Ally at 0 → Healing Word → up → act → fall → repeat. Effective but controversial.',
  note: 'Offense > defense. Dead enemies deal 0 damage.',
};

export const HEALING_SPELL_RANKING = [
  { spell: 'Healing Word', level: 1, action: 'BA', range: '60ft', rating: 'S', note: 'THE combat heal. BA from range. Pick up downed allies.' },
  { spell: 'Heal', level: 6, action: 'Action', healing: '70 HP flat', rating: 'S', note: 'High-level. Flat 70. Removes conditions.' },
  { spell: 'Mass Healing Word', level: 3, action: 'BA', rating: 'A', note: 'Multi-pickup. Saves TPKs.' },
  { spell: 'Cure Wounds', level: 1, action: 'Action', rating: 'B', note: 'More healing but costs action. Use when BA is taken.' },
  { spell: 'Goodberry', level: 1, rating: 'A', note: 'Out-of-combat. Cast before rest with leftover slots.' },
  { spell: 'Aura of Vitality', level: 3, rating: 'A', note: 'BA 2d6 heal per turn for 10 rounds. Out-of-combat healer.' },
  { spell: 'Prayer of Healing', level: 2, rating: 'A', note: '10 min cast. Out-of-combat only. 6 targets.' },
];

export const HEALING_TACTICS = [
  { tactic: 'Healing Word on unconscious', detail: 'BA from 60ft. Ally acts on their turn. You keep your action.', rating: 'S' },
  { tactic: 'Pre-combat Aid', detail: 'Cast Aid before fight. +5 HP to 3 targets. 8 hours. No concentration.', rating: 'S' },
  { tactic: 'Don\'t heal at full HP', detail: 'Only heal to prevent KO. Topping off wastes resources.', rating: 'A' },
  { tactic: 'Spare the Dying (cantrip)', detail: 'Stabilize at 0 HP. No slot. Use when out of healing.', rating: 'B' },
];

export function healingWordAvg(wisdomMod, slotLevel = 1) {
  return slotLevel * 2.5 + wisdomMod;
}
