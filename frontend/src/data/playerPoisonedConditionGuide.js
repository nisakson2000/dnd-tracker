/**
 * playerPoisonedConditionGuide.js
 * Player Mode: Poisoned condition — effects, sources, and cures
 * Pure JS — no React dependencies.
 */

export const POISONED_CONDITION = {
  effect: 'Disadvantage on attack rolls and ability checks.',
  note: 'Does NOT affect saving throws. Only attacks and checks. Still very debilitating for martials.',
  removal: ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP)', 'Paladin\'s Cleansing Touch', 'Monk Purity of Body (L10, immune)'],
};

export const COMMON_POISON_SOURCES = [
  { source: 'Giant Spiders', save: 'CON', damage: '2d8 poison + poisoned condition', note: 'Early level threat. CON save or poisoned.' },
  { source: 'Poisoned weapons (NPCs)', save: 'CON', damage: 'Varies', note: 'Assassins and drow frequently use poison.' },
  { source: 'Green Dragon breath', save: 'CON', damage: 'Large poison damage', note: 'Massive damage. Poisoned on failed save.' },
  { source: 'Cloudkill spell', save: 'CON', damage: '5d8 poison per round', note: 'AoE poison cloud. CON save each turn.' },
  { source: 'Food/drink poisoning', save: 'CON', damage: 'Varies', note: 'DM trap. Always have someone with Purify Food and Drink.' },
];

export const POISON_PREVENTION = [
  { method: 'Dwarf racial', effect: 'Advantage on saves vs poison. Resistance to poison damage.', rating: 'S' },
  { method: 'Monk Purity of Body (L10)', effect: 'Immune to poison damage and poisoned condition.', rating: 'S' },
  { method: 'Protection from Poison (L2)', effect: 'Advantage on saves vs poison. Resistance. Neutralize one poison.', rating: 'A' },
  { method: 'Heroes\' Feast (L6)', effect: 'Immune to poison for 24 hours (among other benefits).', rating: 'S' },
  { method: 'Periapt of Proof Against Poison', effect: 'Immune to poison. Requires attunement.', rating: 'A' },
];

export function poisonSaveChance(conSaveMod, dc) {
  return Math.min(0.95, Math.max(0.05, (conSaveMod + 20 - dc) / 20));
}
