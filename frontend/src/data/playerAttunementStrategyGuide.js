/**
 * playerAttunementStrategyGuide.js
 * Player Mode: Magic item attunement slot optimization
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  slots: 3,
  process: 'Short rest focusing on the item (1 hour).',
  endAttunement: 'Short rest, item more than 100ft away for 24 hours, death, or another creature attunes.',
  limit: 'Only 3 attuned items at once. Choose wisely.',
  artificer_exception: 'Artificer: 4 slots at L10, 5 at L14, 6 at L18.',
  note: 'Attunement slots are the bottleneck for magic item power. Every slot matters.',
};

export const ATTUNEMENT_PRIORITIES_BY_CLASS = {
  fighter: {
    top: ['+1/+2/+3 Weapon', 'Belt of Giant Strength', 'Cloak of Displacement'],
    note: 'Weapon first. Belt for STR builds. Cloak for AC-focused builds.',
  },
  wizard: {
    top: ['Staff of Power', 'Robe of the Archmagi', 'Amulet of Health'],
    note: 'Staff of Power is the best Wizard item. Robe for AC + save DC. Amulet for HP.',
  },
  cleric: {
    top: ['Amulet of Health', 'Staff of Healing', 'Cloak of Protection'],
    note: 'Durability items. Frontline Cleric needs HP and saves.',
  },
  rogue: {
    top: ['+1/+2/+3 Weapon', 'Cloak of Displacement', 'Boots of Elvenkind/Speed'],
    note: 'Weapon for Sneak Attack. Cloak for survivability. Boots for mobility/stealth.',
  },
  paladin: {
    top: ['Holy Avenger', 'Belt of Giant Strength', 'Amulet of Health'],
    note: 'Holy Avenger is the best Paladin item. +2d10 radiant + aura of advantage on saves.',
  },
};

export const TOP_ATTUNEMENT_ITEMS = [
  { item: 'Staff of Power', rarity: 'Very Rare', classes: ['Wizard', 'Sorcerer', 'Warlock'], benefit: '+2 attack/save DC, +2 AC, extra spell slots, multiple spells.', note: 'Best caster item. +2 everything + free spells. One item does everything.' },
  { item: 'Robe of the Archmagi', rarity: 'Legendary', classes: ['Wizard', 'Sorcerer', 'Warlock'], benefit: 'AC 15 + DEX (no armor), +2 save DC, advantage on saves vs spells.', note: 'AC + save DC + magic resistance. Insane defensive + offensive item.' },
  { item: 'Holy Avenger', rarity: 'Legendary', classes: ['Paladin'], benefit: '+3 weapon, +2d10 radiant vs fiends/undead, aura of spell save advantage.', note: 'Best melee item for Paladins. +3 weapon + aura of spell resistance for the party.' },
  { item: 'Belt of Giant Strength', rarity: 'Varies', classes: ['Any martial'], benefit: 'Set STR to 21-29.', note: 'Dump STR in character creation. Belt sets it to 21+. Frees ASIs for feats.' },
  { item: 'Cloak of Displacement', rarity: 'Rare', classes: ['Any'], benefit: 'Attacks against you have disadvantage until you take damage.', note: 'Disadvantage on first hit each turn. Resets when you\'re not hit. Incredible defense.' },
  { item: 'Amulet of Health', rarity: 'Rare', classes: ['Any'], benefit: 'CON = 19.', note: 'CON 19 = +4 mod. Retroactive HP boost. Massive for low-CON characters.' },
  { item: 'Ring of Protection', rarity: 'Rare', classes: ['Any'], benefit: '+1 AC and saving throws.', note: '+1 to everything. Simple but universally good. Stacks with Cloak of Protection.' },
  { item: 'Winged Boots', rarity: 'Uncommon', classes: ['Any'], benefit: 'Fly speed = walking speed for 4 hours/day.', note: 'Flight. Changes everything. Requires attunement but flight is worth a slot.' },
];

export const NO_ATTUNEMENT_BEST_ITEMS = [
  { item: 'Cloak of the Manta Ray', benefit: '60ft swim + water breathing', note: 'Aquatic without attunement. Great situational item.' },
  { item: 'Bag of Holding', benefit: '500lb extradimensional storage', note: 'No attunement. Essential utility.' },
  { item: 'Boots of Elvenkind', benefit: 'Advantage on Stealth (no sound)', note: 'Stealth without attunement. Keep a slot free.' },
  { item: 'Goggles of Night', benefit: 'Darkvision 60ft', note: 'For races without darkvision. No attunement.' },
  { item: 'Immovable Rod', benefit: 'Fix rod in place. Holds 8,000 lbs.', note: 'Creative tool. No attunement. Infinite uses.' },
  { item: 'Decanter of Endless Water', benefit: 'Infinite water (geyser mode: 30 gallon/round)', note: 'Utility and combat (geyser can push).' },
];

export const ATTUNEMENT_TACTICS = [
  { tactic: 'Save slots for scaling items', detail: '+1 weapon doesn\'t need attunement. +2/+3 weapons may. Save attunement for items with powerful effects.', rating: 'S' },
  { tactic: 'Swap by short rest', detail: 'If you know what\'s coming: swap attunement during short rest. Water dungeon? Attune aquatic item.', rating: 'A' },
  { tactic: 'Stack Ring + Cloak of Protection', detail: '+1 AC and +1 saves from each = +2 AC, +2 saves. Uses 2 attunement slots. Worth it for saves.', rating: 'A' },
  { tactic: 'Artificer exception', detail: 'Artificer at L14: 5 attunement slots. Infusions don\'t all require attunement. Most magic items per character.', rating: 'S' },
];

export function effectiveHPFromAmuletOfHealth(currentCON, characterLevel) {
  const currentMod = Math.floor((currentCON - 10) / 2);
  const newMod = 4;
  const hpGain = (newMod - currentMod) * characterLevel;
  return { hpGain, newCON: 19, note: `+${hpGain} HP retroactively from CON ${currentCON} → 19` };
}
