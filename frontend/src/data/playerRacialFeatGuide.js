/**
 * playerRacialFeatGuide.js
 * Player Mode: Racial feats from Xanathar's Guide — ranked and optimized
 * Pure JS — no React dependencies.
 */

export const RACIAL_FEATS_RANKED = [
  { feat: 'Elven Accuracy', race: 'Elf / Half-Elf', effect: '+1 DEX/INT/WIS/CHA. Reroll one die when attacking with advantage (triple advantage).', rating: 'S+', note: 'Best racial feat. 14.3% crit chance with advantage. Crit-fishing builds.' },
  { feat: 'Fey Teleportation', race: 'High Elf', effect: '+1 INT/CHA. Learn Misty Step (1/SR). Learn Sylvan.', rating: 'A+', note: 'Free Misty Step 1/SR. Incredible mobility on a non-caster.' },
  { feat: 'Squat Nimbleness', race: 'Dwarf / Small races', effect: '+1 STR/DEX. +5 speed. Proficiency/expertise in Athletics or Acrobatics. Advantage vs grapple escapes.', rating: 'A+', note: 'Speed boost for slow races. Expertise in Athletics for grapplers.' },
  { feat: 'Orcish Fury', race: 'Half-Orc', effect: '+1 STR/CON. 1/SR extra weapon die on hit. Reaction attack when Relentless Endurance triggers.', rating: 'A+', note: 'Extra damage + reaction attack when you drop to 1 HP. Great for martial builds.' },
  { feat: 'Dragon Fear', race: 'Dragonborn', effect: '+1 STR/CON/CHA. Replace breath weapon with frightened (WIS save) in 30ft.', rating: 'A', note: 'AoE frighten. Better than most breath weapons. Pairs with Conquest Paladin.' },
  { feat: 'Dragon Hide', race: 'Dragonborn', effect: '+1 STR/CON/CHA. AC 13+DEX unarmored. Retractable claws (1d4+STR).', rating: 'B+', note: 'Natural armor. Good for Monks or unarmored builds.' },
  { feat: 'Dwarven Fortitude', race: 'Dwarf', effect: '+1 CON. Spend Hit Die when taking Dodge action.', rating: 'A', note: 'Heal while Dodging. Great for Champion Fighter + Dodge builds.' },
  { feat: 'Flames of Phlegethos', race: 'Tiefling', effect: '+1 INT/CHA. Reroll 1s on fire damage. Fire shield (1d4 to attackers).', rating: 'A', note: 'Fire damage optimization. Best for fire-focused casters.' },
  { feat: 'Infernal Constitution', race: 'Tiefling', effect: '+1 CON. Resistance to cold and poison. Advantage on poison saves.', rating: 'A', note: 'Triple resistance (fire from race + cold + poison). Very tanky Tiefling.' },
  { feat: 'Wood Elf Magic', race: 'Wood Elf', effect: 'Learn 1 druid cantrip + Longstrider 1/LR + Pass without Trace 1/LR.', rating: 'S', note: 'Free Pass without Trace is incredible. +10 Stealth for party.' },
  { feat: 'Drow High Magic', race: 'Drow', effect: 'Detect Magic at will. Levitate + Dispel Magic 1/LR each.', rating: 'A+', note: 'At-will Detect Magic. Free Dispel Magic. Solid utility.' },
  { feat: 'Prodigy', race: 'Human / Half-Elf / Half-Orc', effect: '1 skill proficiency + 1 tool proficiency + 1 language + 1 Expertise.', rating: 'A+', note: 'Expertise in any skill. Athletics expertise for grapplers. Stealth expertise for rogues.' },
  { feat: 'Second Chance', race: 'Halfling', effect: '+1 DEX/CON/CHA. Force reroll on attack that hits you (1/combat).', rating: 'A', note: 'Essentially Lucky for defense. Once per combat dodge.' },
  { feat: 'Bountiful Luck', race: 'Halfling', effect: 'Ally within 30ft rerolls nat 1. Uses your reaction.', rating: 'A', note: 'Share Lucky with allies. Great support feat.' },
  { feat: 'Fade Away', race: 'Gnome', effect: '+1 DEX/INT. When damaged, go invisible (reaction, 1/SR).', rating: 'A', note: 'Emergency invisibility. Great for squishy gnome casters.' },
  { feat: 'Revenant Blade', race: 'Elf', effect: '+1 DEX/STR. Double-bladed scimitar becomes finesse + 2d4 + BA 1d4.', rating: 'A', note: 'Makes double-bladed scimitar viable. Two-weapon fighting without the downsides.' },
];

export const BEST_RACIAL_FEAT_BY_BUILD = [
  { build: 'Crit Fisher (Hexblade/Paladin)', feat: 'Elven Accuracy', why: 'Triple advantage = 14.3% crit rate. Smite every crit.' },
  { build: 'Grappler', feat: 'Prodigy (Athletics Expertise)', why: 'Expertise doubles proficiency. Nearly unbeatable grapple checks.' },
  { build: 'Stealth Party', feat: 'Wood Elf Magic', why: 'Free Pass without Trace = +10 Stealth for entire party.' },
  { build: 'Conquest Paladin', feat: 'Dragon Fear', why: 'AoE frighten in 30ft. Pairs with Aura of Conquest (speed 0 while frightened).' },
  { build: 'Fire Sorcerer/Wizard', feat: 'Flames of Phlegethos', why: 'Reroll 1s on Fireball. Fire shield punishes melee attackers.' },
  { build: 'Tanky Tiefling', feat: 'Infernal Constitution', why: 'Resistance to fire + cold + poison. Three damage resistances.' },
  { build: 'Half-Orc Barbarian', feat: 'Orcish Fury', why: 'Extra weapon die + reaction attack at 1 HP. Perfect for reckless attackers.' },
];

export const RACIAL_FEAT_TIPS = [
  'Elven Accuracy is the best racial feat in the game. Half-Elf + Hexblade = crit machine.',
  'Wood Elf Magic: free Pass without Trace is party-wide stealth domination.',
  'Prodigy: expertise in any skill. Athletics for grapplers, Perception for scouts.',
  'Dragon Fear + Conquest Paladin: frightened enemies can\'t move (Aura of Conquest). Soft lock.',
  'Racial feats compete with general feats. Only take if they\'re better than GWM/PAM/etc.',
  'Elven Accuracy only works with DEX/INT/WIS/CHA attacks. Not STR. Hexblade uses CHA.',
  'Infernal Constitution: three resistances from one feat + race. Incredibly efficient.',
];
