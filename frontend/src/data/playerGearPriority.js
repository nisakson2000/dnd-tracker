/**
 * playerGearPriority.js
 * Player Mode: Magic item priority by class and role
 * Pure JS — no React dependencies.
 */

export const UNIVERSAL_ITEMS = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', effect: '+1 AC and saves.', rating: 'S' },
  { item: 'Winged Boots', rarity: 'Uncommon', effect: 'Fly speed = walk speed. 4 hrs/day.', rating: 'S' },
  { item: 'Bag of Holding', rarity: 'Uncommon', effect: '500 lbs, no attunement.', rating: 'A' },
  { item: 'Luckstone', rarity: 'Uncommon', effect: '+1 checks and saves.', rating: 'A' },
];

export const MARTIAL_ITEMS = [
  { item: '+1/+2/+3 Weapon', rarity: 'U/R/VR', effect: '+1/2/3 attack and damage.', rating: 'S' },
  { item: 'Belt of Giant Strength', rarity: 'Varies', effect: 'STR 21-29.', rating: 'S' },
  { item: 'Flame Tongue', rarity: 'Rare', effect: '+2d6 fire per hit.', rating: 'S' },
  { item: 'Adamantine Armor', rarity: 'Uncommon', effect: 'Crits → normal hits.', rating: 'A' },
  { item: 'Sentinel Shield', rarity: 'Uncommon', effect: 'Adv initiative + Perception.', rating: 'A' },
];

export const CASTER_ITEMS = [
  { item: 'Wand of the War Mage', rarity: 'U/R/VR', effect: '+1/2/3 spell attacks. Ignore half cover.', rating: 'S' },
  { item: 'Amulet of the Devout', rarity: 'U/R/VR', effect: '+1/2/3 spell DC/attack. Extra CD.', rating: 'S' },
  { item: 'Pearl of Power', rarity: 'Uncommon', effect: 'Recover 1 slot (≤3rd)/day.', rating: 'A' },
  { item: 'Staff of Power', rarity: 'Very Rare', effect: '+2 AC/saves/spell attacks + spells.', rating: 'S' },
  { item: 'Rod of Pact Keeper', rarity: 'U/R/VR', effect: '+1/2/3 DC + recover 1 Warlock slot.', rating: 'S' },
];

export const ATTUNEMENT = {
  slots: 3,
  priority: ['1. Weapon/focus (+X)', '2. Defense (Cloak/Ring)', '3. Utility (Boots/Belt/Rod)'],
};

export function totalAC(base, shieldBonus, magicBonus, protectionBonus) {
  return base + shieldBonus + magicBonus + protectionBonus;
}
