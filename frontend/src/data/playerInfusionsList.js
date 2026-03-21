/**
 * playerInfusionsList.js
 * Player Mode: Artificer infusions reference
 * Pure JS — no React dependencies.
 */

export const INFUSION_SLOTS = [
  { level: 2, known: 4, active: 2 },
  { level: 6, known: 6, active: 3 },
  { level: 10, known: 8, active: 4 },
  { level: 14, known: 10, active: 5 },
  { level: 18, known: 12, active: 6 },
];

export const INFUSIONS = [
  { name: 'Enhanced Arcane Focus', level: 2, item: 'Rod/staff/wand', effect: '+1 to spell attack rolls, ignore half cover. +2 at 10th level.', category: 'combat' },
  { name: 'Enhanced Defense', level: 2, item: 'Armor or shield', effect: '+1 AC. +2 at 10th level.', category: 'defense' },
  { name: 'Enhanced Weapon', level: 2, item: 'Simple or martial weapon', effect: '+1 to attack and damage. +2 at 10th level.', category: 'combat' },
  { name: 'Homunculus Servant', level: 2, item: 'Gem/crystal (100+ gp)', effect: 'Create a tiny construct companion. Uses your bonus action for Force Strike (1d4 + PB).', category: 'companion' },
  { name: 'Repeating Shot', level: 2, item: 'Simple/martial ranged weapon (ammunition)', effect: '+1 to attack/damage, ignores loading, creates own ammo.', category: 'combat' },
  { name: 'Returning Weapon', level: 2, item: 'Simple/martial thrown weapon', effect: '+1 to attack/damage, returns to hand after thrown.', category: 'combat' },
  { name: 'Armor of Magical Strength', level: 2, item: 'Armor', effect: '6 charges. Use INT for STR checks/saves, or spend charge to avoid being knocked prone.', category: 'defense' },
  { name: 'Mind Sharpener', level: 2, item: 'Armor or robes', effect: '4 charges. When you fail a concentration save, spend a charge to succeed instead.', category: 'utility' },
  { name: 'Spell-Refueling Ring', level: 6, item: 'Ring', effect: 'Once per day, recover one spell slot (max 3rd level).', category: 'utility' },
  { name: 'Helm of Awareness', level: 10, item: 'Helmet', effect: 'Advantage on initiative, can\'t be surprised while conscious.', category: 'combat' },
  { name: 'Boots of the Winding Path', level: 6, item: 'Boots', effect: 'Bonus action: teleport 15 feet to a space you occupied in the last round.', category: 'mobility' },
  { name: 'Radiant Weapon', level: 6, item: 'Simple/martial weapon', effect: '+1 to attack/damage, 4 charges to blind on hit (Con save).', category: 'combat' },
  { name: 'Resistant Armor', level: 6, item: 'Armor', effect: 'Resistance to one damage type (choose when infusing).', category: 'defense' },
  { name: 'Repulsion Shield', level: 6, item: 'Shield', effect: '+1 AC, 4 charges. Reaction: push attacker 15 feet on hit.', category: 'defense' },
  { name: 'Cloak of Many Fashions', level: 2, item: 'Cloak', effect: 'Bonus action to change appearance of cloak. Social/RP utility.', category: 'utility' },
  { name: 'Winged Boots', level: 10, item: 'Boots', effect: 'Flying speed equal to walking speed for up to 4 hours.', category: 'mobility' },
  { name: 'Amulet of Health', level: 10, item: 'Amulet', effect: 'Set Constitution score to 19.', category: 'defense' },
  { name: 'Belt of Hill Giant Strength', level: 10, item: 'Belt', effect: 'Set Strength score to 21.', category: 'combat' },
  { name: 'Boots of Speed', level: 10, item: 'Boots', effect: 'Bonus action to double speed for 10 minutes.', category: 'mobility' },
  { name: 'Ring of Free Action', level: 10, item: 'Ring', effect: 'Difficult terrain doesn\'t cost extra. Can\'t be paralyzed or restrained by magic.', category: 'defense' },
];

export const SUBCLASS_INFUSIONS = {
  alchemist: 'Focus on Enhanced Arcane Focus + utility infusions. Homunculus Servant is great for bonus action healing.',
  armorer: 'Enhanced Defense is core. Guardian model benefits from Repulsion Shield. Infiltrator likes Enhanced Weapon.',
  artillerist: 'Enhanced Arcane Focus is essential. Mind Sharpener protects concentration on summons.',
  battleSmith: 'Enhanced Weapon or Repeating Shot for your Steel Defender build. Returning Weapon for thrown builds.',
};

export function getInfusionSlots(level) {
  for (let i = INFUSION_SLOTS.length - 1; i >= 0; i--) {
    if (level >= INFUSION_SLOTS[i].level) return INFUSION_SLOTS[i];
  }
  return INFUSION_SLOTS[0];
}

export function getInfusionsByCategory(category) {
  return INFUSIONS.filter(i => i.category === category);
}

export function getAvailableInfusions(artificerLevel) {
  return INFUSIONS.filter(i => artificerLevel >= i.level);
}
