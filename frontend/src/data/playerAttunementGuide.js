/**
 * playerAttunementGuide.js
 * Player Mode: Magic item attunement rules and management
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  maxSlots: 3,
  process: 'Spend a short rest focusing on the item (can also be during a short rest you\'re already taking).',
  ending: 'Attunement ends if: you attune to a 4th item (choose one to lose), the item is more than 100ft away for 24 hours, you die, or another creature attunes to it.',
  identify: 'Identify spell or a short rest spent examining the item reveals whether it requires attunement.',
  classRestriction: 'Some items require attunement by a specific class, alignment, or creature type.',
  note: 'Artificers can attune to more items at higher levels (4 at 10th, 5 at 14th, 6 at 18th).',
};

export const ATTUNEMENT_PRIORITY = [
  { priority: 'High', examples: ['+1/+2/+3 weapons/armor', 'Cloak of Protection', 'Ring of Protection', 'Amulet of Health', 'Staff of the Magi'], reason: 'Core combat effectiveness. Always worth a slot.' },
  { priority: 'Medium', examples: ['Boots of Speed', 'Bracers of Defense', 'Headband of Intellect', 'Gauntlets of Ogre Power'], reason: 'Strong utility but may be swapped for situational items.' },
  { priority: 'Low', examples: ['Helm of Comprehending Languages', 'Ring of Water Walking', 'Cloak of Many Fashions'], reason: 'Niche utility. Attune only when the situation calls for it.' },
  { priority: 'Avoid', examples: ['Cursed items', 'Items with major drawbacks', 'Items that don\'t match your build'], reason: 'Not worth occupying one of your 3 precious slots.' },
];

export const COMMON_ATTUNEMENT_ITEMS = [
  { item: 'Cloak of Protection', effect: '+1 AC, +1 all saves', slot: 'Cloak', tier: 'Uncommon' },
  { item: 'Ring of Protection', effect: '+1 AC, +1 all saves', slot: 'Ring', tier: 'Rare' },
  { item: 'Amulet of Health', effect: 'CON score becomes 19', slot: 'Neck', tier: 'Rare' },
  { item: 'Gauntlets of Ogre Power', effect: 'STR score becomes 19', slot: 'Hands', tier: 'Uncommon' },
  { item: 'Headband of Intellect', effect: 'INT score becomes 19', slot: 'Head', tier: 'Uncommon' },
  { item: 'Belt of Giant Strength', effect: 'STR becomes 21-29 depending on type', slot: 'Belt', tier: 'Varies' },
  { item: 'Bracers of Defense', effect: '+2 AC (no armor or shield)', slot: 'Arms', tier: 'Rare' },
  { item: 'Boots of Speed', effect: 'Bonus action: double speed for 10 min', slot: 'Feet', tier: 'Rare' },
  { item: 'Winged Boots', effect: 'Fly speed = walk speed, 4 hours', slot: 'Feet', tier: 'Uncommon' },
  { item: 'Cloak of Displacement', effect: 'Attacks have disadvantage against you until hit', slot: 'Cloak', tier: 'Rare' },
];

export const ARTIFICER_ATTUNEMENT = [
  { level: 1, maxAttunement: 3 },
  { level: 10, maxAttunement: 4, feature: 'Magic Item Adept' },
  { level: 14, maxAttunement: 5, feature: 'Magic Item Savant' },
  { level: 18, maxAttunement: 6, feature: 'Soul of Artifice' },
];

export function getMaxAttunement(isArtificer, level) {
  if (!isArtificer) return 3;
  for (let i = ARTIFICER_ATTUNEMENT.length - 1; i >= 0; i--) {
    if (level >= ARTIFICER_ATTUNEMENT[i].level) return ARTIFICER_ATTUNEMENT[i].maxAttunement;
  }
  return 3;
}

export function canAttune(currentAttuned, maxSlots) {
  return currentAttuned < maxSlots;
}
