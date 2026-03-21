/**
 * playerBestRacialFeatsGuide.js
 * Player Mode: Best racial features and feats by race
 * Pure JS — no React dependencies.
 */

export const BEST_RACIAL_FEATURES = [
  { race: 'Half-Elf', features: ['+2 CHA, +1/+1 any. Darkvision. Fey Ancestry (adv vs charm). 2 extra skill proficiencies.'], rating: 'S+', bestFor: 'Any CHA class. Most versatile race.' },
  { race: 'Variant Human', features: ['Free feat at L1. +1/+1 any. Extra skill.'], rating: 'S+', bestFor: 'Any class. Free feat is incredibly strong.' },
  { race: 'Custom Lineage', features: ['+2 any. Feat at L1. Darkvision OR skill.'], rating: 'S+', bestFor: 'Optimizers. Best of V.Human + flexibility.' },
  { race: 'Yuan-Ti Pureblood', features: ['Magic Resistance (adv on saves vs spells). Poison immunity.'], rating: 'S+', bestFor: 'Casters who face casters. Incredible defensive feature.' },
  { race: 'Satyr', features: ['Magic Resistance. Fey type (immune to Hold Person). +1 CHA, +2 DEX.'], rating: 'S+', bestFor: 'Not a humanoid = immune to many spells.' },
  { race: 'Half-Orc', features: ['Relentless Endurance: drop to 1 HP instead of 0. Savage Attacks: extra crit die.'], rating: 'A+', bestFor: 'Barbarian, Fighter. Crit builds.' },
  { race: 'Dwarf (Mountain)', features: ['+2 CON, +2 STR. Medium armor proficiency. Poison resistance.'], rating: 'A+', bestFor: 'Cleric, Paladin. Tank builds.' },
  { race: 'Elf (High)', features: ['Darkvision. Perception proficiency. Free cantrip. Trance (4hr rest).'], rating: 'A+', bestFor: 'Wizard, Rogue. Booming Blade cantrip.' },
  { race: 'Gnome (Forest)', features: ['Minor Illusion. Darkvision. Gnome Cunning (adv on INT/WIS/CHA saves vs magic).'], rating: 'A+', bestFor: 'Any class. Gnome Cunning is amazing.' },
  { race: 'Tiefling', features: ['Darkvision. Fire resistance. Free spells (Hellish Rebuke, Darkness).'], rating: 'A', bestFor: 'Warlock, Sorcerer. Fire resistance is great.' },
  { race: 'Dragonborn', features: ['Breath weapon (scales poorly). Damage resistance.'], rating: 'B+ (PHB)', bestFor: 'Paladin. Flavor. Fizban\'s improves them.' },
  { race: 'Aarakocra', features: ['50ft fly speed from L1. Talons (1d6 unarmed).'], rating: 'S (if flight allowed)', bestFor: 'Ranged builds. Flight = untouchable.' },
  { race: 'Goblin', features: ['BA Disengage/Hide. Fury of the Small: extra damage.'], rating: 'A', bestFor: 'Rogue. Free Cunning Action features.' },
  { race: 'Bugbear', features: ['Surprise Attack: +2d6 on first hit. Long-limbed: +5ft reach.'], rating: 'A+', bestFor: 'Rogue (stacks with Sneak Attack), Fighter, Ranger.' },
];

export const RACIAL_FEATS = [
  { feat: 'Elven Accuracy', race: 'Elf/Half-Elf', effect: '+1 DEX/INT/WIS/CHA. Triple advantage (reroll one die with advantage).', rating: 'S+', note: 'Turns advantage into near-guaranteed hits. Rogue + Steady Aim.' },
  { feat: 'Fey Teleportation', race: 'High Elf', effect: '+1 INT/CHA. Learn Misty Step (1/SR).', rating: 'A', note: 'Free Misty Step without a spell slot.' },
  { feat: 'Orcish Fury', race: 'Half-Orc', effect: '+1 STR/CON. Extra damage die once/SR. Reaction attack on Relentless.', rating: 'A', note: 'Extra crit die + reaction attack. Good for Barbarian.' },
  { feat: 'Dragon Fear', race: 'Dragonborn', effect: '+1 CHA. Replace breath with fear aura (WIS save). 30ft radius.', rating: 'A', note: 'AoE frighten. Better than breath weapon at higher levels.' },
  { feat: 'Squat Nimbleness', race: 'Dwarf/Small', effect: '+1 STR/DEX. +5ft speed. Acrobatics/Athletics proficiency. Advantage vs grapple.', rating: 'B+', note: 'Fixes slow Dwarf speed.' },
  { feat: 'Infernal Constitution', race: 'Tiefling', effect: '+1 CON. Resistance to cold and poison damage.', rating: 'A', note: 'Three resistances total (fire + cold + poison). Very durable.' },
  { feat: 'Second Chance', race: 'Halfling', effect: '+1 DEX/CON/CHA. Force reroll on hit against you (1/combat).', rating: 'A', note: 'Shield-lite. Works on any attack.' },
  { feat: 'Bountiful Luck', race: 'Halfling', effect: 'Use reaction to let ally within 30ft reroll nat 1.', rating: 'A', note: 'Lucky extended to allies. Great support.' },
  { feat: 'Prodigy', race: 'Half-Elf/Half-Orc/Human', effect: 'Extra skill, tool, language, and one Expertise.', rating: 'A', note: 'Expertise on any skill for non-Rogues/Bards.' },
  { feat: 'Drow High Magic', race: 'Drow', effect: 'Detect Magic at will. Levitate and Dispel Magic 1/LR each.', rating: 'A', note: 'Free at-will Detect Magic + utility spells.' },
];

export const RACE_SELECTION_TIPS = [
  'V.Human / Custom Lineage: free feat at L1. Best for optimization.',
  'Half-Elf: most versatile. +2 CHA, +1/+1, skills, darkvision.',
  'Elven Accuracy: triple advantage. Best with Rogue Steady Aim.',
  'Yuan-Ti / Satyr: Magic Resistance. Advantage on saves vs spells.',
  'Flight races (Aarakocra): check with DM. Some tables ban L1 flight.',
  'Bugbear: +2d6 surprise + 5ft reach. Amazing for Rogue.',
  'Gnome Cunning: advantage on INT/WIS/CHA saves vs magic. Incredible.',
  'Half-Orc: Relentless Endurance is life insurance. Great for Barbarian.',
  'Tasha\'s custom origin: any race, any stat bonuses. Play what you want.',
  'Choose race for features first, flavor second. Or vice versa — your call.',
];
