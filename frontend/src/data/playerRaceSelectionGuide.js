/**
 * playerRaceSelectionGuide.js
 * Player Mode: Race selection — best races by class and build
 * Pure JS — no React dependencies.
 */

export const RACE_TIER_LIST = [
  { race: 'Custom Lineage', rating: 'S+', asi: '+2 any (or feat)', features: 'Free feat at L1. Darkvision or skill.', bestFor: 'Any build that wants a feat at L1.', source: 'TCE' },
  { race: 'Variant Human', rating: 'S+', asi: '+1/+1 any', features: 'Free feat at L1. Extra skill.', bestFor: 'Any build. PAM/GWM/SS at L1.', source: 'PHB' },
  { race: 'Half-Elf', rating: 'S', asi: '+2 CHA, +1/+1 any', features: 'Darkvision, Fey Ancestry, 2 skills or weapon/tool/cantrip.', bestFor: 'CHA casters (Bard, Sorcerer, Warlock, Paladin).', source: 'PHB' },
  { race: 'Yuan-ti Pureblood', rating: 'S (pre-MotM)', asi: '+2 CHA, +1 INT', features: 'Magic Resistance (advantage on saves vs spells). Poison immunity.', bestFor: 'Any caster. Magic Resistance is broken.', source: 'VGM' },
  { race: 'Satyr', rating: 'S', asi: '+2 CHA, +1 DEX', features: 'Magic Resistance. Fey type (not humanoid).', bestFor: 'CHA builds. Magic Resistance + Fey type = immune to Hold Person.', source: 'MOT' },
  { race: 'Elf (High)', rating: 'A+', asi: '+2 DEX, +1 INT', features: 'Trance, Darkvision, Perception, free cantrip, Fey Ancestry.', bestFor: 'Wizard, Bladesinger, DEX builds.', source: 'PHB' },
  { race: 'Elf (Wood)', rating: 'A+', asi: '+2 DEX, +1 WIS', features: '35ft speed, Mask of the Wild, Trance, Darkvision.', bestFor: 'Ranger, Monk, Druid.', source: 'PHB' },
  { race: 'Dwarf (Mountain)', rating: 'A', asi: '+2 CON, +2 STR', features: 'Darkvision, Poison resistance, medium armor proficiency.', bestFor: 'Any melee. Wizard in medium armor (no multiclass needed).', source: 'PHB' },
  { race: 'Dwarf (Hill)', rating: 'A', asi: '+2 CON, +1 WIS', features: '+1 HP/level, Darkvision, Poison resistance.', bestFor: 'Cleric, tanks, anyone wanting more HP.', source: 'PHB' },
  { race: 'Tiefling', rating: 'A', asi: '+2 CHA, +1 INT', features: 'Darkvision, fire resistance, innate spellcasting (Hellish Rebuke, Darkness).', bestFor: 'CHA casters. Fire resistance is always useful.', source: 'PHB' },
  { race: 'Half-Orc', rating: 'A', asi: '+2 STR, +1 CON', features: 'Darkvision, Relentless Endurance (1 HP instead of 0), Savage Attacks (extra crit die).', bestFor: 'Barbarian, Fighter, Paladin. Greataxe crit builds.', source: 'PHB' },
  { race: 'Goblin', rating: 'A', asi: '+2 DEX, +1 CON', features: 'Fury of the Small (extra damage PB/LR), Nimble Escape (BA Disengage/Hide free).', bestFor: 'Rogue (free Cunning Action). Small but effective.', source: 'VGM' },
  { race: 'Gnome (Forest)', rating: 'A', asi: '+2 INT, +1 DEX', features: 'Minor Illusion free, Gnome Cunning (advantage INT/WIS/CHA saves vs magic).', bestFor: 'Wizard, Artificer. Gnome Cunning is budget Magic Resistance.', source: 'PHB' },
  { race: 'Aasimar', rating: 'A+', asi: '+2 CHA, +1 varies', features: 'Healing Hands, Radiant Soul/Consumption/Shroud (transformation at L3).', bestFor: 'Paladin, Cleric, CHA casters. Radiant Soul flight is great.', source: 'VGM' },
  { race: 'Dragonborn', rating: 'B+', asi: '+2 STR, +1 CHA', features: 'Breath Weapon (scales poorly), Damage Resistance.', bestFor: 'Paladin, Fighter. Gem Dragonborn (FTD) are much better.', source: 'PHB' },
  { race: 'Halfling (Stout)', rating: 'A', asi: '+2 DEX, +1 CON', features: 'Lucky (reroll 1s on d20), Brave (advantage vs frightened), Nimble.', bestFor: 'Rogue, Monk, any DEX build. Lucky is surprisingly powerful.', source: 'PHB' },
  { race: 'Human (Standard)', rating: 'B', asi: '+1 all', features: 'Extra skill and language.', bestFor: 'MAD builds (Monk, Paladin). Otherwise use Variant Human.', source: 'PHB' },
  { race: 'Harengon', rating: 'A', asi: '+2/+1 any (MotM)', features: 'PB to initiative. Rabbit Hop (BA jump PB×5 ft, PB/LR).', bestFor: 'Anyone wanting initiative bonus + free movement.', source: 'WBW' },
  { race: 'Owlin', rating: 'A', asi: '+2/+1 any', features: '30ft fly, Darkvision, Stealth proficiency.', bestFor: 'Flying race. Any build that benefits from permanent flight.', source: 'SAC' },
];

export const TASHA_RULES = {
  note: 'Tasha\'s Cauldron of Everything allows moving racial ASIs to any stat.',
  rule: 'With DM permission, replace your racial ASIs with +2/+1 to any two different stats.',
  impact: 'This makes racial features more important than ASIs for race selection.',
  tip: 'If using Tasha\'s rules, pick races for their features (Magic Resistance, flight, etc.) not their stats.',
};

export const RACE_BY_CLASS = [
  { class: 'Barbarian', bestRaces: 'Half-Orc (crit die + Relentless), Custom Lineage (GWM at L1), Goliath (Stone\'s Endurance)' },
  { class: 'Bard', bestRaces: 'Half-Elf (+2 CHA, skills), Custom Lineage (feat), Satyr (Magic Resistance)' },
  { class: 'Cleric', bestRaces: 'Hill Dwarf (+HP, +WIS), Custom Lineage, Wood Elf (WIS + speed)' },
  { class: 'Druid', bestRaces: 'Wood Elf (WIS + speed + Mask), Firbolg (WIS + thematic), Custom Lineage' },
  { class: 'Fighter', bestRaces: 'Custom Lineage (feat at L1), V. Human, Half-Orc (STR build), High Elf (Bladesinger MC)' },
  { class: 'Monk', bestRaces: 'Wood Elf (DEX + WIS + speed), Custom Lineage, Goblin (free Disengage)' },
  { class: 'Paladin', bestRaces: 'Half-Elf (CHA + flexible), Custom Lineage, Aasimar (CHA + thematic)' },
  { class: 'Ranger', bestRaces: 'Wood Elf (DEX + WIS), Custom Lineage, Harengon (initiative)' },
  { class: 'Rogue', bestRaces: 'Custom Lineage, Goblin (Nimble Escape), Halfling (Lucky + small)' },
  { class: 'Sorcerer', bestRaces: 'Half-Elf (CHA), Custom Lineage, Satyr (Magic Resistance)' },
  { class: 'Warlock', bestRaces: 'Half-Elf (CHA), Custom Lineage, Tiefling (CHA + fire resistance)' },
  { class: 'Wizard', bestRaces: 'High Elf (INT + cantrip), Gnome (Gnome Cunning), Custom Lineage' },
  { class: 'Artificer', bestRaces: 'Gnome (INT + Cunning), Custom Lineage, High Elf (INT + cantrip)' },
];
