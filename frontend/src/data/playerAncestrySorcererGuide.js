/**
 * playerAncestrySorcererGuide.js
 * Player Mode: Draconic Bloodline Sorcerer optimization
 * Pure JS — no React dependencies.
 */

export const DRACONIC_BASICS = {
  class: 'Sorcerer (Draconic Bloodline)',
  theme: 'Dragon blood grants innate power. Elemental damage specialist.',
  note: 'Reliable and strong. Extra HP, natural AC, and eventually flight.',
};

export const DRACONIC_FEATURES = [
  { feature: 'Dragon Ancestor', level: 1, effect: 'Choose dragon type. Double proficiency on CHA checks with dragons of that type.', note: 'Flavor + mechanical. Choose element you want to specialize in.' },
  { feature: 'Draconic Resilience', level: 1, effect: '+1 HP per level. Unarmored AC = 13 + DEX.', note: 'Free Mage Armor (13 + DEX). Never need to cast it. +HP makes you tankier than other Sorcerers.' },
  { feature: 'Elemental Affinity', level: 6, effect: 'When you cast a spell that deals your ancestry damage type, add CHA to one damage roll. Spend 1 SP for resistance to that type for 1 hour.', note: '+5 damage to one roll of Fireball = 8d6+5. Resistance for 1 SP is great.' },
  { feature: 'Dragon Wings', level: 14, effect: 'Bonus action: manifest wings. Fly speed = walking speed. Last until dismissed.', note: 'Permanent flight. No concentration. No spell slot. Just fly forever.' },
  { feature: 'Draconic Presence', level: 18, effect: 'Spend 5 SP: 60ft aura, WIS save or charmed/frightened for 1 minute.', note: 'AoE fear/charm. Expensive (5 SP) but powerful.' },
];

export const ANCESTRY_CHOICES = [
  { dragon: 'Gold/Red (Fire)', element: 'Fire', note: 'Most spells deal fire damage (Fireball, Scorching Ray, Fire Bolt). Best damage options.', rating: 'S' },
  { dragon: 'White/Silver (Cold)', element: 'Cold', note: 'Good cold spells exist (Cone of Cold, Ice Storm). Less common but solid.', rating: 'A' },
  { dragon: 'Blue/Bronze (Lightning)', element: 'Lightning', note: 'Lightning Bolt, Witch Bolt, Storm Sphere. Good but fewer options than fire.', rating: 'A' },
  { dragon: 'Black/Copper (Acid)', element: 'Acid', note: 'Few acid damage spells. Vitriolic Sphere, Melf\'s Acid Arrow. Limited.', rating: 'B' },
  { dragon: 'Green (Poison)', element: 'Poison', note: 'Many monsters resist/immune to poison. Worst ancestry choice for damage.', rating: 'C' },
];

export const DRACONIC_TACTICS = [
  { tactic: 'Fireball + Elemental Affinity', detail: 'Fireball deals 8d6+5 (fire ancestry). With Empowered Spell, reroll low dice.', rating: 'S' },
  { tactic: 'Quickened Fire Bolt + Fireball', detail: 'Quicken Fire Bolt (bonus action) + Fireball (action). Both get +CHA if fire ancestry.', rating: 'A' },
  { tactic: 'Permanent flight (L14)', detail: 'No concentration flight. Fly above enemies. Rain spells down. Untouchable by melee.', rating: 'S' },
  { tactic: 'Elemental resistance', detail: 'Spend 1 SP for fire resistance for 1 hour before fighting fire-using enemies. Or in a burning building.', rating: 'A' },
  { tactic: 'Twinned Spell blasting', detail: 'Twin Firebolt: 2 targets each taking 2d10+5. 0 SP cost (Twin = spell level = 0 for cantrip).', rating: 'A' },
];

export const DRACONIC_VS_DIVINE_SOUL = {
  draconic: { pros: ['Free AC (no Mage Armor)', '+1 HP/level', '+CHA to elemental damage', 'Permanent flight at L14'], cons: ['Locked into one element', 'No extra spell list access'] },
  divineSoul: { pros: ['Access to entire Cleric spell list', 'Spirit Guardians + Spiritual Weapon', 'Twinned healing spells', 'Favored by the Gods (+2d4)'], cons: ['No AC boost', 'No HP boost', 'No free flight'] },
  verdict: 'Draconic for blasting. Divine Soul for versatility and support.',
};

export function draconicAC(dexMod) {
  return 13 + dexMod; // Free Mage Armor
}

export function elementalAffinityDamage(spellDamage, chaMod) {
  return spellDamage + chaMod;
}

export function draconicHP(sorcererLevel, conMod) {
  return (6 + conMod + 1) + (sorcererLevel - 1) * (4 + conMod + 1); // d6 avg + 1 per level
}
