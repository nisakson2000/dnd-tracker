/**
 * playerMagicItemPriority.js
 * Player Mode: Magic item priority by class, slot efficiency, and attunement management
 * Pure JS — no React dependencies.
 */

export const UNIVERSAL_PRIORITIES = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', attunement: true, effect: '+1 AC and saves', priority: 1, reason: 'Best value per attunement slot. AC and ALL saves.' },
  { item: 'Amulet of Health', rarity: 'Rare', attunement: true, effect: 'CON becomes 19', priority: 2, reason: 'Fixes CON for any class. Massive HP boost + concentration saves.' },
  { item: 'Winged Boots', rarity: 'Uncommon', attunement: true, effect: 'Fly speed = walk speed', priority: 2, reason: 'Flight is the most impactful mobility in the game.' },
  { item: 'Ring of Protection', rarity: 'Rare', attunement: true, effect: '+1 AC and saves', priority: 3, reason: 'Stacks with Cloak of Protection. +2 AC and saves total.' },
  { item: 'Bag of Holding', rarity: 'Uncommon', attunement: false, effect: '500 lb extradimensional storage', priority: 1, reason: 'No attunement. Solves encumbrance for entire party.' },
  { item: 'Headband of Intellect', rarity: 'Uncommon', attunement: true, effect: 'INT becomes 19', priority: 3, reason: 'Great for Fighter wanting INT saves or non-INT caster.' },
  { item: 'Periapt of Wound Closure', rarity: 'Uncommon', attunement: true, effect: 'Stabilize at 0 HP. Double HP from hit dice.', priority: 3, reason: 'Safety net + efficient short rests.' },
];

export const CLASS_PRIORITIES = [
  { class: 'Fighter', items: ['+1/+2/+3 Weapon', 'Belt of Giant Strength', 'Cloak of Displacement', 'Gauntlets of Ogre Power', 'Adamantine Armor'], reason: 'Fighters attack the most. Weapon upgrades have highest ROI.' },
  { class: 'Paladin', items: ['+1/+2 Weapon', 'Holy Avenger', 'Amulet of Health (CON for concentration)', 'Belt of Giant Strength', 'Ring of Spell Storing'], reason: 'Smites benefit from hitting. Holy Avenger is the endgame.' },
  { class: 'Barbarian', items: ['Belt of Giant Strength', '+1/+2 Weapon', 'Cloak of Protection', 'Boots of Speed', 'Periapt of Wound Closure'], reason: 'STR is everything. Belt of Giant Strength + Rage = monster.' },
  { class: 'Rogue', items: ['Cloak of Displacement', 'Winged Boots', '+1/+2 Weapon', 'Bracers of Archery', 'Cloak of Elvenkind'], reason: 'Survival + consistent Sneak Attack. Displacement = rarely hit.' },
  { class: 'Wizard', items: ['Robe of the Archmagi', 'Amulet of Health', 'Cloak of Protection', 'Staff of Power', 'Winged Boots'], reason: 'Save DC + AC + survivability. Wizards are fragile.' },
  { class: 'Cleric', items: ['Amulet of Health', '+1/+2 Shield', 'Staff of Healing', 'Ring of Spell Storing', 'Periapt of Wound Closure'], reason: 'CON for concentration (Spirit Guardians). Shield AC. Healing backup.' },
  { class: 'Warlock', items: ['Rod of the Pact Keeper', 'Cloak of Displacement', 'Amulet of Health', 'Winged Boots', 'Ring of Spell Storing'], reason: 'Rod of Pact Keeper: +1 spell DC and attack, PLUS regain one slot per day.' },
  { class: 'Sorcerer', items: ['Bloodwell Vial', 'Amulet of Health', 'Cloak of Protection', 'Winged Boots', 'Ring of Spell Storing'], reason: 'Bloodwell Vial: +1 spell DC + recover sorcery points. Core item.' },
];

export const ATTUNEMENT_MANAGEMENT = {
  max: '3 items (4 for Artificer 14+)',
  strategy: [
    'Prioritize items that give BOTH offense and defense (+1 weapon + cloak)',
    'Non-attunement items (Bag of Holding, +1 ammo, potions) don\'t count',
    'If you reach 3 attunement, evaluate: which item gives least value? Replace it.',
    'Some items are situational. Swap attunement before specific encounters (fire resist ring before dragon).',
  ],
  swapping: 'Attuning to a new item takes a short rest. Can drop an attunement item to make room.',
  note: 'Artificer is the best class for magic item usage: 4 attunement slots and can infuse items for the party.',
};

export const ITEM_SLOT_EFFICIENCY = [
  { slot: 'Weapon', impact: 'High', reason: 'Used every round. +1 to hit and damage on every attack adds up fast.' },
  { slot: 'Armor/Shield', impact: 'High', reason: 'AC is always relevant. +1 AC reduces damage taken across entire combat.' },
  { slot: 'Cloak', impact: 'Medium-High', reason: 'Cloak of Protection (+1 AC/saves) or Displacement (disadvantage on attacks).' },
  { slot: 'Ring', impact: 'Medium', reason: 'Ring of Protection, Ring of Spell Storing. Versatile slot.' },
  { slot: 'Boots', impact: 'Medium', reason: 'Winged Boots (flight), Boots of Speed (double speed). Mobility items.' },
  { slot: 'Amulet/Necklace', impact: 'Medium', reason: 'Amulet of Health (CON 19), Periapt of Wound Closure. Survivability.' },
  { slot: 'Belt', impact: 'Variable', reason: 'Belt of Giant Strength is S-tier for martials. Otherwise niche.' },
];

export function getClassPriorities(className) {
  const classPrio = CLASS_PRIORITIES.find(c => c.class === className);
  return classPrio ? classPrio.items : UNIVERSAL_PRIORITIES.map(u => u.item);
}

export function shouldAttune(currentAttunements, newItem, weakestCurrent) {
  if (currentAttunements < 3) return { attune: true, reason: 'You have free attunement slots.' };
  return { attune: true, reason: `Replace ${weakestCurrent} if ${newItem} provides more value.` };
}
