/**
 * playerCelestialWarlockGuide.js
 * Player Mode: Celestial Warlock — the divine healer warlock
 * Pure JS — no React dependencies.
 */

export const CELESTIAL_BASICS = {
  class: 'Warlock (The Celestial)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Warlock with a celestial patron. Healing Light, fire/radiant damage, and resurrection.',
  note: 'Only Warlock with healing. Healing Light is a flexible, bonus action heal pool. Sacred Flame + Eldritch Blast coverage.',
};

export const CELESTIAL_FEATURES = [
  { feature: 'Bonus Cantrips', level: 1, effect: 'Learn Light and Sacred Flame.', note: 'Sacred Flame: radiant damage cantrip. Targets DEX save. Good against low-DEX enemies.' },
  { feature: 'Healing Light', level: 1, effect: 'Pool of d6s = 1 + Warlock level. Bonus action: heal a creature within 60ft. Spend 1 to CHA mod d6s at once. Recharges on long rest.', note: 'Flexible healing pool. Spend 1d6 for a small top-off or 5d6 for a big heal. Bonus action. 60ft range.' },
  { feature: 'Radiant Soul', level: 6, effect: 'Resistance to radiant damage. When you deal fire or radiant damage with a spell: add CHA mod to one damage roll.', note: '+CHA to fire/radiant spell damage. EB doesn\'t qualify (force), but Fire Bolt, Scorching Ray, Sacred Flame do.' },
  { feature: 'Celestial Resilience', level: 10, effect: 'You and up to 5 chosen creatures gain temp HP when finishing a short or long rest: Warlock level + CHA mod (you), half that (allies).', note: 'Party-wide temp HP on every rest. At L10 with 20 CHA: 15 for you, 7 for allies. Free every rest.' },
  { feature: 'Searing Vengeance', level: 14, effect: 'When you would make a death save, instead spring back to half HP. Each creature within 30ft: blinded + 2d8+CHA radiant damage. Once/long rest.', note: 'Die → full revival to half HP + AoE blind + damage. One of the best survival features in the game.' },
];

export const CELESTIAL_TACTICS = [
  { tactic: 'EB + Healing Light', detail: 'Action: Eldritch Blast (force damage). Bonus action: Healing Light (heal an ally). Damage AND healing every turn.', rating: 'S' },
  { tactic: 'Healing Light efficiency', detail: 'Use small heals (1-2d6) to pick up downed allies. Save big heals (4-5d6) for emergencies.', rating: 'A', note: 'At L10: pool of 11d6 = ~38.5 total healing. Spread across combat.' },
  { tactic: 'Radiant Soul + Fire spells', detail: 'Fire Bolt (2d10+CHA), Wall of Fire (5d8+CHA per turn), Flame Strike. Good fire damage.', rating: 'A' },
  { tactic: 'Celestial Resilience party buff', detail: 'L10: every short rest, party gets temp HP. Free. Stacks with other temp HP sources (first applied wins).', rating: 'A' },
  { tactic: 'Searing Vengeance insurance', detail: 'L14: if you die, you come back with AoE blind + damage. Plan to die? Stand in the middle of enemies.', rating: 'S' },
];

export const CELESTIAL_VS_HEXBLADE = {
  celestial: { pros: ['Healing Light (only Warlock healer)', 'Radiant/fire damage boost', 'Party temp HP on rest', 'Auto-revive at L14'], cons: ['No CHA to weapons', 'No medium armor/shields', 'Less damage than Hexblade'] },
  hexblade: { pros: ['CHA to weapon attacks', 'Medium armor + shields', 'Hexblade\'s Curse (crit on 19)', 'Best multiclass dip'], cons: ['No healing', 'No temp HP party buff', 'No radiant damage boost'] },
  verdict: 'Celestial for support/healer Warlock. Hexblade for damage/melee.',
};

export function healingLightPool(warlockLevel) {
  return 1 + warlockLevel; // d6s in pool
}

export function healingLightMaxPerUse(chaMod) {
  return Math.max(1, chaMod); // Max d6s per use
}

export function celestialResilienceTempHP(warlockLevel, chaMod, isSelf = true) {
  if (isSelf) return warlockLevel + chaMod;
  return Math.floor((warlockLevel + chaMod) / 2);
}
