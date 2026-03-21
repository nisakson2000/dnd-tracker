/**
 * playerRaceOptimizer.js
 * Player Mode: Race selection optimization and racial feature analysis
 * Pure JS — no React dependencies.
 */

export const RACE_RANKINGS = [
  { race: 'Variant Human', stats: '+1/+1 (choice)', keyFeature: 'Free feat at level 1', rating: 'S', bestFor: ['Any class that wants a feat early', 'GWM Fighter', 'Sharpshooter Ranger'], note: 'A free feat is incredibly powerful. The most mechanically optimal race for most builds.' },
  { race: 'Custom Lineage', stats: '+2 (choice)', keyFeature: 'Free feat + darkvision or skill', rating: 'S', bestFor: ['Same as V.Human but with darkvision option', 'SAD classes that want max primary stat'], note: 'Tasha\'s alternative to V.Human. +2 instead of +1/+1 but one fewer ASI.' },
  { race: 'Half-Elf', stats: '+2 CHA, +1/+1 (choice)', keyFeature: '2 skills, darkvision, Fey Ancestry', rating: 'S', bestFor: ['Bard', 'Sorcerer', 'Warlock', 'Paladin'], note: 'Best CHA-based race. 2 free skills, charm resistance, flexible ASIs.' },
  { race: 'Mountain Dwarf', stats: '+2 STR, +2 CON', keyFeature: 'Medium armor + weapon proficiencies', rating: 'A', bestFor: ['Wizard (free medium armor!)', 'Cleric', 'Fighter'], note: 'Only race with two +2s (pre-Tasha\'s). Armor on a Wizard is incredible.' },
  { race: 'Wood Elf', stats: '+2 DEX, +1 WIS', keyFeature: '35ft speed, Mask of the Wild', rating: 'A', bestFor: ['Ranger', 'Monk', 'Druid', 'Rogue'], note: 'Extra 5ft speed adds up. Hide in natural phenomena is niche but fun.' },
  { race: 'Yuan-Ti Pureblood', stats: '+2 CHA, +1 INT', keyFeature: 'Magic Resistance (advantage on saves vs spells)', rating: 'S', bestFor: ['Any class — magic resistance is broken', 'Paladin (aura stacking)'], note: 'Advantage on ALL magical saves. Widely considered overpowered.' },
  { race: 'Goblin', stats: '+2 DEX, +1 CON', keyFeature: 'Fury of the Small, Nimble Escape', rating: 'A', bestFor: ['Rogue (free Cunning Action at level 1)', 'Ranger', 'Artificer'], note: 'Bonus action Disengage/Hide for free. Great for hit-and-run.' },
  { race: 'Aarakocra', stats: '+2 DEX, +1 WIS', keyFeature: '50ft flying speed', rating: 'S (if flying allowed)', bestFor: ['Monk', 'Ranger', 'Any ranged class'], note: 'Flying at level 1 is game-breaking. Many DMs restrict it.' },
  { race: 'Tiefling', stats: '+2 CHA, +1 INT', keyFeature: 'Fire resistance, free spells', rating: 'B', bestFor: ['Warlock (flavor)', 'Sorcerer', 'Paladin'], note: 'Fire resistance is common but useful. Free spells are nice. Not optimal but flavorful.' },
  { race: 'Dragonborn', stats: '+2 STR, +1 CHA', keyFeature: 'Breath Weapon, resistance', rating: 'B', bestFor: ['Paladin', 'Fighter'], note: 'Breath weapon scales poorly. Gem Dragonborn (Fizban\'s) are much better.' },
];

export const TASHAS_CUSTOM_RULES = {
  rule: 'Tasha\'s Custom Origin: Move racial ASIs to any stats of your choice.',
  effect: 'Any race can be optimal for any class. +2 goes to your primary stat.',
  note: 'Not all tables use this rule. Ask at session zero.',
  impact: 'Makes race choice about features, not stats. Races with powerful features (V.Human feat, Half-Elf skills, Yuan-Ti magic resistance) become even more dominant.',
};

export const RACE_BY_CLASS = {
  Barbarian: ['Variant Human (GWM)', 'Half-Orc (Relentless)', 'Goliath (Stone\'s Endurance)'],
  Fighter: ['Variant Human (feat)', 'Custom Lineage (feat)', 'Half-Orc (crit bonus)'],
  Wizard: ['Mountain Dwarf (armor)', 'High Elf (cantrip)', 'Gnome (INT + advantage vs magic)'],
  Cleric: ['Hill Dwarf (+1 HP/level)', 'Variant Human (War Caster)', 'Wood Elf (WIS + speed)'],
  Rogue: ['Goblin (free Cunning Action)', 'Variant Human (feat)', 'Half-Elf (skills + CHA)'],
  Ranger: ['Wood Elf (DEX + WIS + speed)', 'Custom Lineage', 'Goblin'],
  Paladin: ['Half-Elf (CHA + flexible)', 'Variant Human (PAM/Sentinel)', 'Dragonborn (flavor)'],
  Bard: ['Half-Elf (CHA + skills)', 'Variant Human (feat)', 'Tiefling (CHA + spells)'],
  Warlock: ['Half-Elf (CHA)', 'Variant Human', 'Tiefling (flavor)'],
  Sorcerer: ['Half-Elf (CHA)', 'Yuan-Ti (magic resistance)', 'Custom Lineage'],
  Druid: ['Wood Elf (WIS + speed)', 'Firbolg (WIS + flavor)', 'Variant Human'],
  Monk: ['Wood Elf (DEX + WIS + speed)', 'Aarakocra (flying)', 'Goblin (Nimble Escape)'],
};

export function getBestRaces(className) {
  return RACE_BY_CLASS[className] || [];
}

export function getRaceInfo(raceName) {
  return RACE_RANKINGS.find(r =>
    r.race.toLowerCase().includes((raceName || '').toLowerCase())
  ) || null;
}

export function getTopRaces() {
  return RACE_RANKINGS.filter(r => r.rating === 'S');
}
