/**
 * playerSpellSaveDcOptGuide.js
 * Player Mode: Spell Save DC optimization — maximize enemy failure rates
 * Pure JS — no React dependencies.
 */

export const SPELL_SAVE_DC_FORMULA = {
  formula: '8 + proficiency bonus + spellcasting ability modifier',
  example: 'Wizard L5: 8 + 3 (prof) + 4 (INT 18) = DC 15',
  max: 'DC 19 (8 + 6 + 5). With items: DC 20+ possible.',
  note: 'Higher DC = harder for enemies to resist your spells.',
};

export const DC_BY_LEVEL = [
  { level: '1-3', proficiency: '+2', maxStat: '16 (+3)', dc: '13', note: 'Point buy max. Decent but many saves will succeed.' },
  { level: '4', proficiency: '+2', maxStat: '18 (+4)', dc: '14', note: 'ASI bumps stat. Noticeable improvement.' },
  { level: '5-7', proficiency: '+3', maxStat: '18 (+4)', dc: '15', note: 'Prof bump. Sweet spot for save-or-suck spells.' },
  { level: '8', proficiency: '+3', maxStat: '20 (+5)', dc: '16', note: 'Max stat. Strong DC.' },
  { level: '9-12', proficiency: '+4', maxStat: '20 (+5)', dc: '17', note: 'Very hard for enemies. Most fail.' },
  { level: '13-16', proficiency: '+5', maxStat: '20 (+5)', dc: '18', note: 'Excellent. Only legendary creatures reliably save.' },
  { level: '17-20', proficiency: '+6', maxStat: '20 (+5)', dc: '19', note: 'Max RAW. Near-impossible for many monsters.' },
];

export const BOOST_DC_METHODS = [
  { method: 'Max Spellcasting Stat', boost: '+1 to +5 DC', how: 'ASI at L4, L8. Get to 20 ASAP.', priority: 'S+' },
  { method: 'Proficiency Bonus (level up)', boost: 'Auto +1 at L5, 9, 13, 17', how: 'Just level up. Automatic.', priority: 'S+' },
  { method: 'Robe of the Archmagi', boost: '+2 DC', how: 'Legendary item. Wizard, Sorcerer, Warlock.', priority: 'S (if available)' },
  { method: 'Ioun Stone of Mastery', boost: '+1 prof bonus = +1 DC', how: 'Legendary. Attunement. Increases prof bonus.', priority: 'A+' },
  { method: 'Rod of the Pact Keeper', boost: '+1/+2/+3 DC', how: 'Warlock only. Uncommon to Very Rare.', priority: 'S (Warlock)' },
  { method: 'Arcane Grimoire', boost: '+1/+2/+3 DC', how: 'Wizard only (Tasha\'s). Uncommon to Very Rare.', priority: 'S (Wizard)' },
  { method: 'Amulet of the Devout', boost: '+1/+2/+3 DC', how: 'Cleric/Paladin only (Tasha\'s).', priority: 'S (Cleric)' },
  { method: 'All-Purpose Tool', boost: '+1/+2/+3 DC', how: 'Artificer only (Tasha\'s).', priority: 'S (Artificer)' },
  { method: 'Moon Sickle', boost: '+1/+2/+3 DC', how: 'Druid/Ranger only (Tasha\'s).', priority: 'S (Druid)' },
  { method: 'Bloodwell Vial', boost: '+1/+2/+3 DC', how: 'Sorcerer only (Tasha\'s).', priority: 'S (Sorcerer)' },
];

export const TARGET_WEAK_SAVES = {
  concept: 'Target the save the enemy is weakest in.',
  commonWeakSaves: [
    { save: 'INT', weakMonsters: 'Beasts, undead, most martial creatures.', spells: 'Mind Sliver, Synaptic Static, Phantasmal Force.' },
    { save: 'CHA', weakMonsters: 'Beasts, constructs, many lower-CR.', spells: 'Banishment, Zone of Truth, Command (some).' },
    { save: 'DEX', weakMonsters: 'Large/huge creatures, heavy armor.', spells: 'Fireball, Web, Faerie Fire.' },
    { save: 'STR', weakMonsters: 'Casters, small creatures.', spells: 'Entangle, Earthen Grasp, Telekinesis.' },
    { save: 'WIS', weakMonsters: 'Many martial creatures (but varied).', spells: 'Hold Person, Hypnotic Pattern, Fear.' },
    { save: 'CON', weakMonsters: 'Few — most monsters have good CON.', spells: 'Blight, Warding Wind, Contagion.' },
  ],
  note: 'CON saves are the hardest to force failure. INT saves are easiest.',
};

export const DC_OPTIMIZATION_TIPS = [
  'Max your spellcasting stat FIRST. ASI at L4 and L8.',
  'Target INT saves. Most monsters dump Intelligence.',
  'CON is the strongest monster save. Avoid CON-save spells if possible.',
  'Class-specific focus items (Tasha\'s) boost DC. Ask your DM for one.',
  'Robe of the Archmagi: +2 DC. Legendary game-changer.',
  'Rod of the Pact Keeper: Warlock best item. DC boost + spell slot recovery.',
  'Mind Sliver: -1d4 to next save. Cast before ally\'s save-or-suck spell.',
  'Heightened Spell (Sorcerer): 3 SP for disadvantage on save. Nuclear option.',
  'No-save spells bypass DC entirely: Magic Missile, Wall of Force, Forcecage.',
  'DC 15+ is the sweet spot. Most enemies fail more than half the time.',
];
