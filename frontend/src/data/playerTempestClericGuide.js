/**
 * playerTempestClericGuide.js
 * Player Mode: Tempest Domain Cleric — thunder and lightning
 * Pure JS — no React dependencies.
 */

export const TEMPEST_BASICS = {
  class: 'Cleric (Tempest Domain)',
  source: 'Player\'s Handbook',
  theme: 'Storm god\'s champion. Heavy armor, martial weapons, lightning/thunder max damage.',
  note: 'The blaster Cleric. Destructive Wrath maximizes lightning/thunder damage. Heavy armor + martial weapons.',
};

export const TEMPEST_FEATURES = [
  { feature: 'Wrath of the Storm', level: 1, effect: 'Reaction when hit: attacker takes 2d8 lightning or thunder damage (DEX save half). WIS mod times/long rest.', note: 'Punish attackers. 2d8 damage every time you get hit. Great at low levels.' },
  { feature: 'Destructive Wrath', level: 2, effect: 'Channel Divinity: maximize lightning or thunder damage roll.', note: 'THE FEATURE. Max damage Shatter = 24. Max Call Lightning = 30. Guaranteed max AoE damage.' },
  { feature: 'Thunderbolt Strike', level: 6, effect: 'When you deal lightning damage to a Large or smaller creature, push them 10ft.', note: 'Lightning damage + knockback. Combo with Booming Blade or Call Lightning.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 thunder damage on weapon hit (2d8 at L14).', note: 'Thunder damage on melee. Combos with Thunderbolt Strike push.' },
  { feature: 'Stormborn', level: 17, effect: 'Fly speed = walking speed when outdoors or in large spaces, while not underground.', note: 'Free flight outdoors. No concentration.' },
];

export const TEMPEST_SPELLS = {
  domainSpells: [
    { level: 1, spells: 'Fog Cloud, Thunderwave', note: 'Thunderwave: 2d8, push 10ft. Maximize = 16 damage + push.' },
    { level: 2, spells: 'Gust of Wind, Shatter', note: 'Shatter: 3d8 thunder (24 maximized). Great against constructs.' },
    { level: 3, spells: 'Call Lightning, Sleet Storm', note: 'Call Lightning: 3d10 per turn for 10 min. Maximize first bolt = 30.' },
    { level: 4, spells: 'Control Water, Ice Storm', note: 'Ice Storm: bludgeoning + cold (NOT lightning/thunder, can\'t maximize).' },
    { level: 5, spells: 'Destructive Wave, Insect Plague', note: 'Destructive Wave: 5d6 thunder + 5d6 radiant. Maximize the thunder = 30 + 5d6.' },
  ],
};

export const DESTRUCTIVE_WRATH_COMBOS = [
  { combo: 'Max Shatter', level: 2, damage: '24 thunder (3d8 maximized)', note: 'Best early-game AoE. 10ft radius, CON save.', rating: 'A' },
  { combo: 'Max Call Lightning', level: 5, damage: '30 lightning per bolt (3d10 max), then 3d10 each turn', note: 'Maximize first bolt. Subsequent bolts still deal 3d10.', rating: 'S' },
  { combo: 'Max Thunderwave', level: 1, damage: '16 thunder + push 10ft', note: 'Early game combo. Push enemies off cliffs.', rating: 'B' },
  { combo: 'Max Destructive Wave', level: 9, damage: '30 thunder (5d6 max) + 5d6 radiant (avg 17.5)', note: '30ft radius. Only maximize thunder half. Still great.', rating: 'S' },
  { combo: 'Wrath of Storm + Destructive Wrath', level: 2, damage: '16 (2d8 maximized) reaction damage', note: 'Use CD to maximize your reaction Wrath. 16 guaranteed damage when hit.', rating: 'B' },
];

export const TEMPEST_MULTICLASS = {
  tempest2Sorcerer: {
    name: 'Tempest 2/Storm Sorcerer X (or any Sorcerer)',
    why: 'Sorcerer gets Lightning Bolt (8d6). Destructive Wrath maximizes = 48 lightning damage. Metamagic for Twinned/Quickened.',
    rating: 'S',
    note: 'The classic Tempest dip. 48 damage Lightning Bolt at Sorcerer 5/Cleric 2.',
  },
  tempest2Wizard: {
    name: 'Tempest 2/Wizard X',
    why: 'Wizard gets Lightning Bolt too. Plus more spell slots, ritual casting, Arcane Recovery.',
    rating: 'A',
  },
};

export function destructiveWrathDamage(diceCount, dieSize) {
  return diceCount * dieSize; // All dice maximized
}

export function wrathOfStormDamage(maximized = false) {
  return maximized ? 16 : 9; // 2d8 maximized vs average
}

export function callLightningMaxFirst(spellLevel) {
  const dice = spellLevel >= 3 ? spellLevel : 3;
  return dice * 10; // d10 maximized = 10 each
}
