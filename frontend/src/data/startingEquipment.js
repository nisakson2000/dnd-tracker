// D&D 5e PHB Starting Equipment by Class
// Each class has optional choice groups and fixed items that are always included

export const STARTING_EQUIPMENT = {
  Barbarian: {
    choices: [
      { label: 'Primary Weapon', options: [['Greataxe'], ['Any Martial Melee Weapon']] },
      { label: 'Secondary Weapon', options: [['Two Handaxes'], ['Any Simple Weapon']] },
    ],
    fixed: ['Explorer\'s Pack', 'Javelin (4)'],
  },

  Bard: {
    choices: [
      { label: 'Weapon', options: [['Rapier'], ['Longsword'], ['Any Simple Weapon']] },
      { label: 'Pack', options: [['Diplomat\'s Pack'], ['Entertainer\'s Pack']] },
      { label: 'Instrument', options: [['Lute'], ['Any Musical Instrument']] },
    ],
    fixed: ['Leather Armor', 'Dagger'],
  },

  Cleric: {
    choices: [
      { label: 'Weapon', options: [['Mace'], ['Warhammer (if proficient)']] },
      { label: 'Armor', options: [['Scale Mail'], ['Leather Armor'], ['Chain Mail (if proficient)']] },
      { label: 'Ranged', options: [['Light Crossbow', 'Bolts (20)'], ['Any Simple Weapon']] },
      { label: 'Pack', options: [['Priest\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Shield', 'Holy Symbol'],
  },

  Druid: {
    choices: [
      { label: 'Shield/Weapon', options: [['Wooden Shield'], ['Any Simple Weapon']] },
      { label: 'Melee', options: [['Scimitar'], ['Any Simple Melee Weapon']] },
    ],
    fixed: ['Leather Armor', 'Explorer\'s Pack', 'Druidic Focus'],
  },

  Fighter: {
    choices: [
      { label: 'Armor', options: [['Chain Mail'], ['Leather Armor', 'Longbow', 'Arrows (20)']] },
      { label: 'Weapons', options: [['Martial Weapon', 'Shield'], ['Two Martial Weapons']] },
      { label: 'Ranged', options: [['Light Crossbow', 'Bolts (20)'], ['Two Handaxes']] },
      { label: 'Pack', options: [['Dungeoneer\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: [],
  },

  Monk: {
    choices: [
      { label: 'Weapon', options: [['Shortsword'], ['Any Simple Weapon']] },
      { label: 'Pack', options: [['Dungeoneer\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Dart (10)'],
  },

  Paladin: {
    choices: [
      { label: 'Weapons', options: [['Martial Weapon', 'Shield'], ['Two Martial Weapons']] },
      { label: 'Melee', options: [['Five Javelins'], ['Any Simple Melee Weapon']] },
      { label: 'Pack', options: [['Priest\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Chain Mail', 'Holy Symbol'],
  },

  Ranger: {
    choices: [
      { label: 'Armor', options: [['Scale Mail'], ['Leather Armor']] },
      { label: 'Weapons', options: [['Two Shortswords'], ['Two Simple Melee Weapons']] },
      { label: 'Pack', options: [['Dungeoneer\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Longbow', 'Quiver', 'Arrows (20)'],
  },

  Rogue: {
    choices: [
      { label: 'Weapon', options: [['Rapier'], ['Shortsword']] },
      { label: 'Ranged', options: [['Shortbow', 'Quiver', 'Arrows (20)'], ['Shortsword']] },
      { label: 'Pack', options: [['Burglar\'s Pack'], ['Dungeoneer\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Leather Armor', 'Dagger (2)', 'Thieves\' Tools'],
  },

  Sorcerer: {
    choices: [
      { label: 'Weapon', options: [['Light Crossbow', 'Bolts (20)'], ['Any Simple Weapon']] },
      { label: 'Focus', options: [['Component Pouch'], ['Arcane Focus']] },
      { label: 'Pack', options: [['Dungeoneer\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Two Daggers'],
  },

  Warlock: {
    choices: [
      { label: 'Weapon', options: [['Light Crossbow', 'Bolts (20)'], ['Any Simple Weapon']] },
      { label: 'Focus', options: [['Component Pouch'], ['Arcane Focus']] },
      { label: 'Pack', options: [['Scholar\'s Pack'], ['Dungeoneer\'s Pack']] },
    ],
    fixed: ['Leather Armor', 'Any Simple Weapon', 'Two Daggers'],
  },

  Wizard: {
    choices: [
      { label: 'Weapon', options: [['Quarterstaff'], ['Dagger']] },
      { label: 'Focus', options: [['Component Pouch'], ['Arcane Focus']] },
      { label: 'Pack', options: [['Scholar\'s Pack'], ['Explorer\'s Pack']] },
    ],
    fixed: ['Spellbook'],
  },
};
