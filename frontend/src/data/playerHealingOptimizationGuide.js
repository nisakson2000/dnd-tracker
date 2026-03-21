/**
 * playerHealingOptimizationGuide.js
 * Player Mode: Healing efficiency, triage, and yo-yo healing tactics
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  goldenRule: 'Don\'t heal damage — prevent it or get people up from 0 HP. In-combat healing rarely outpaces damage.',
  yoYoHealing: 'Let allies drop to 0 HP, then Healing Word them back up. They get a full turn. More efficient than topping off.',
  proactiveVsReactive: 'Proactive: Bless, Shield of Faith, temp HP. Reactive: Healing Word to revive. Proactive is almost always better.',
  note: 'The best healer is the one who kills enemies faster so they deal less total damage to the party.',
};

export const HEALING_SPELL_EFFICIENCY = [
  { spell: 'Healing Word', level: 1, action: 'Bonus action', range: '60ft', avgHealing: 6.5, note: 'THE best heal. Bonus action, 60ft range, gets allies up from 0. Amount healed is irrelevant — consciousness matters.', rating: 'S' },
  { spell: 'Cure Wounds', level: 1, action: 'Action', range: 'Touch', avgHealing: 9.5, note: 'More healing but costs your ACTION and requires TOUCH. Almost always worse than Healing Word.', rating: 'C' },
  { spell: 'Mass Healing Word', level: 3, action: 'Bonus action', range: '60ft', avgHealing: '6.5 × 6', note: 'Up to 6 creatures. Emergency mass revive. Uses L3 slot but gets entire party up.', rating: 'A' },
  { spell: 'Heal', level: 6, action: 'Action', range: '60ft', avgHealing: 70, note: '70 HP flat. Also cures blindness, deafness, disease. When you NEED big healing.', rating: 'A' },
  { spell: 'Goodberry', level: 1, action: 'Action', range: 'Touch', avgHealing: '1 × 10', note: '10 berries, 1 HP each. Best out-of-combat healing. Life Cleric: each berry heals 4 HP instead.', rating: 'A' },
  { spell: 'Prayer of Healing', level: 2, action: '10 minutes', range: '30ft', avgHealing: '9.5 × 6', note: '10-minute cast. Out of combat only. Heals 6 creatures. Short rest alternative.', rating: 'A' },
  { spell: 'Aura of Vitality', level: 3, action: 'Action (concentration)', range: 'Self (30ft)', avgHealing: '2d6/turn × 10', note: 'Bonus action 2d6 heal each turn for 1 minute. Total: ~70 HP distributed. Good out of combat.', rating: 'B' },
];

export const HEALING_OPTIMIZATION_TIPS = [
  { tip: 'Healing Word > Cure Wounds always', detail: 'Bonus action vs action. 60ft vs touch. You keep your action for attacking/cantrips. Always Healing Word.', priority: 1 },
  { tip: 'Only heal when someone is at 0 HP', detail: 'Don\'t waste slots topping off. HP that doesn\'t prevent unconsciousness is wasted. Let people take hits.', priority: 1 },
  { tip: 'Temp HP prevents better than healing cures', detail: 'Inspiring Leader, Twilight Sanctuary, Heroism, Armor of Agathys. Prevent damage before it happens.', priority: 2 },
  { tip: 'Life Cleric + Goodberry = broken', detail: 'Life Cleric Disciple of Life: +2+spell level to healing spells. Goodberry is L1 healing. Each berry heals 4 HP. 10 berries = 40 HP from L1 slot.', priority: 2 },
  { tip: 'Healer feat for non-casters', detail: 'Healer feat + Healer\'s Kit: 1d6+4+target level HP per creature per rest. No spell slots. Budget healer.', priority: 3 },
  { tip: 'Short rest HD are free healing', detail: 'Push for short rests. Each HD = d8+CON avg healing. A Barbarian can heal 50+ HP on a short rest at mid levels.', priority: 3 },
];

export const LIFE_CLERIC_HEALING = {
  discipleOfLife: 'L1: healing spells restore +2+spell level extra HP.',
  blessedHealer: 'L6: when you heal someone else, you heal 2+spell level HP.',
  supremeHealing: 'L17: max healing dice instead of rolling.',
  goodberryCombo: 'Each Goodberry heals 1+2+1(spell level) = 4 HP. 10 berries = 40 HP from a L1 slot.',
  healingWordL1: 'Healing Word: 1d4+WIS+3 = avg 8.5 HP (with +3 WIS). Very efficient.',
};

export const TWILIGHT_CLERIC_HEALING = {
  twilightSanctuary: 'Channel Divinity: 30ft sphere of dim light for 1 minute. Start of each creature\'s turn: gain 1d6+Cleric level temp HP.',
  atLevel5: '1d6+5 = avg 8.5 temp HP per ally per turn. 4 allies = 34 temp HP per round.',
  atLevel10: '1d6+10 = avg 13.5 per ally per turn. Nearly unkillable party.',
  note: 'Twilight Cleric Channel Divinity is widely considered the most overpowered healing feature in 5e.',
  rating: 'S+',
};

export function healingWordAvg(spellLevel, wisMod) {
  const dice = spellLevel; // 1d4 per level
  return dice * 2.5 + wisMod;
}

export function lifeClericBonus(spellLevel) {
  return 2 + spellLevel; // Disciple of Life
}

export function goodberryLifeCleric(spellLevel) {
  return 10 * (1 + 2 + spellLevel); // 10 berries × (1 base + 2 + spell level)
}

export function twilightSanctuaryTempHP(clericLevel) {
  return 3.5 + clericLevel; // 1d6 avg + cleric level
}
