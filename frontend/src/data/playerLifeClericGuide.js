/**
 * playerLifeClericGuide.js
 * Player Mode: Life Cleric healing optimization
 * Pure JS — no React dependencies.
 */

export const LIFE_CLERIC_BASICS = {
  class: 'Cleric (Life Domain)',
  armorProf: 'Heavy armor',
  theme: 'Ultimate healer. Every healing spell is supercharged.',
  keyFeature: 'Disciple of Life: healing spells restore extra 2 + spell level HP.',
};

export const LIFE_FEATURES = [
  { feature: 'Disciple of Life', level: 1, effect: 'Healing spells heal extra 2 + spell level HP.', note: 'Cure Wounds 1st: 1d8+WIS+3. Heal Word: 1d4+WIS+3. Stacks with EVERYTHING.' },
  { feature: 'Channel Divinity: Preserve Life', level: 2, effect: 'Restore 5× Cleric level HP split among creatures within 30ft.', note: 'L5: 25 HP split. L10: 50 HP split. Can\'t raise above half max HP.' },
  { feature: 'Blessed Healer', level: 6, effect: 'When you heal another, heal yourself 2 + spell level HP.', note: 'Free self-healing every time you heal someone else.' },
  { feature: 'Divine Strike', level: 8, effect: 'Weapon attacks deal +1d8 radiant (2d8 at 14).', note: 'Melee Cleric damage. Spirit Guardians + melee + Divine Strike.' },
  { feature: 'Supreme Healing', level: 17, effect: 'Healing spells use max values instead of rolling.', note: 'Cure Wounds 1st: 8+WIS+3 guaranteed. Heal: 70 HP guaranteed.' },
];

export const HEALING_COMBOS = [
  { combo: 'Life Cleric 1 / Druid X (Goodberry)', detail: 'Each Goodberry heals 1+3 (Disciple of Life) = 4 HP. 10 berries = 40 HP from a 1st level slot.', rating: 'S', note: 'Best healing efficiency in the game. Controversial — some DMs ban.' },
  { combo: 'Life Cleric + Aura of Vitality', detail: '2d6+WIS+5 per round for 10 rounds as bonus action. 100+ total healing.', rating: 'S' },
  { combo: 'Life Cleric + Healing Spirit', detail: 'Each pass heals 1d6+5. Multiple creatures per round. Massive AoE healing.', rating: 'A' },
  { combo: 'Life Cleric + Prayer of Healing', detail: '2d8+WIS+4 to 6 creatures. 10 minute cast. Perfect after combat.', rating: 'A' },
  { combo: 'Preserve Life emergency', detail: 'No spell slot. 5×level HP split among nearby allies. Mass emergency heal.', rating: 'A' },
];

export const HEALING_PHILOSOPHY = [
  'Don\'t heal during combat unless someone is DOWN. Damage prevention > healing.',
  'Healing Word > Cure Wounds in combat. Bonus action + range > bigger heal.',
  'Healing after combat: Prayer of Healing (10 min), short rest + Hit Dice, Goodberries.',
  'Spirit Guardians deals more "healing" than actual heals by preventing damage.',
  'Aid increases MAX HP. Cast at highest level before long rest (lasts 8 hours).',
  'Life Cleric\'s real power: heavy armor + shield + Spirit Guardians + healing when needed.',
];

export function discipleOfLife(spellLevel) {
  return 2 + spellLevel;
}

export function cureWoundsLife(spellLevel, wisMod, supremeHealing) {
  const diceCount = spellLevel;
  const diceAvg = supremeHealing ? 8 : 4.5;
  return diceCount * diceAvg + wisMod + discipleOfLife(spellLevel);
}

export function goodberryLife(berryCount) {
  return berryCount * 4; // 1 base + 3 Disciple of Life each
}
