/**
 * playerDefensivePlayGuide.js
 * Player Mode: Defensive play — AC, saves, HP, and damage avoidance
 * Pure JS — no React dependencies.
 */

export const AC_CALCULATION_METHODS = [
  { method: 'Light Armor (Leather)', formula: '11 + DEX', maxAC: '16 (DEX 20)', bestFor: 'Rogues, Rangers, high-DEX builds' },
  { method: 'Light Armor (Studded Leather)', formula: '12 + DEX', maxAC: '17 (DEX 20)', bestFor: 'Best light armor. Rogues, Rangers.' },
  { method: 'Medium Armor (Half Plate)', formula: '15 + DEX (max 2)', maxAC: '17', bestFor: 'Clerics, Rangers, medium armor users.' },
  { method: 'Medium Armor Master feat', formula: '15 + DEX (max 3)', maxAC: '18', bestFor: 'Niche. +1 AC over normal half plate.' },
  { method: 'Heavy Armor (Plate)', formula: '18', maxAC: '18', bestFor: 'Fighters, Paladins. STR 15 or speed penalty.' },
  { method: 'Shield', formula: '+2 AC', maxAC: 'Stacks', bestFor: 'Any armor user. +2 is massive.' },
  { method: 'Unarmored Defense (Barbarian)', formula: '10 + DEX + CON', maxAC: '20 (both 20)', bestFor: 'Rare to exceed medium armor. Thematic.' },
  { method: 'Unarmored Defense (Monk)', formula: '10 + DEX + WIS', maxAC: '20 (both 20)', bestFor: 'Hard to max. Bracers of Defense help.' },
  { method: 'Natural Armor (Tortle)', formula: '17', maxAC: '17 (+2 shield)', bestFor: 'Any class. No DEX needed.' },
  { method: 'Mage Armor', formula: '13 + DEX', maxAC: '18 (DEX 20)', bestFor: 'Wizards, Sorcerers. Better than light armor.' },
];

export const AC_BOOSTING_FEATURES = [
  { source: 'Shield (spell)', bonus: '+5 (reaction)', duration: '1 round', rating: 'S+', note: 'Best defensive spell. +5 AC for the round.' },
  { source: 'Shield of Faith', bonus: '+2 (concentration)', duration: '10 min', rating: 'A', note: 'Concentration makes it compete with Bless.' },
  { source: 'Haste', bonus: '+2 AC + extra action', duration: 'Concentration', rating: 'S+', note: '+2 AC is just the start.' },
  { source: 'Cloak of Protection', bonus: '+1 AC + saves', duration: 'Permanent', rating: 'A+', note: 'Uncommon item. +1 to everything.' },
  { source: 'Ring of Protection', bonus: '+1 AC + saves', duration: 'Permanent', rating: 'A+', note: 'Stacks with Cloak.' },
  { source: 'Defense Fighting Style', bonus: '+1 AC', duration: 'Permanent', rating: 'A', note: 'While wearing armor. Free.' },
  { source: 'Bracers of Defense', bonus: '+2 AC', duration: 'Permanent', rating: 'S (unarmored)', note: 'No armor + no shield. Monks and casters.' },
  { source: '+1/+2/+3 armor', bonus: '+1 to +3', duration: 'Permanent', rating: 'S', note: 'Magic armor. Stacks with everything.' },
];

export const DAMAGE_AVOIDANCE_METHODS = [
  { method: 'High AC', description: 'Attacks miss you.', rating: 'S', note: 'Best vs many weak attacks.' },
  { method: 'Damage Resistance', description: 'Take half damage from a type.', rating: 'S', note: 'Barbarian Rage, Absorb Elements, racial resistance.' },
  { method: 'Evasion (Rogue/Monk)', description: 'DEX save success = 0 damage (half on fail).', rating: 'S+', note: 'Best vs Fireball, Dragon breath, traps.' },
  { method: 'Uncanny Dodge (Rogue)', description: 'Halve one attack\'s damage (reaction).', rating: 'S', note: 'Halve any attack you see. Once per round.' },
  { method: 'Mirror Image', description: '3 duplicates absorb attacks.', rating: 'S', note: 'No concentration! 3 free missed attacks.' },
  { method: 'Dodge Action', description: 'Disadvantage on all attacks against you.', rating: 'A+', note: 'When you can\'t do anything useful, Dodge.' },
  { method: 'Blur', description: 'Disadvantage on attacks against you.', rating: 'A', note: 'Concentration. Worse than Mirror Image usually.' },
  { method: 'Absorb Elements', description: 'Halve elemental damage (reaction). L1.', rating: 'S', note: 'Half damage from dragon breath for a L1 slot.' },
  { method: 'Heavy Armor Master', description: '-3 from nonmagical BPS.', rating: 'A (early)', note: 'Great at L1-4. Falls off at high levels.' },
  { method: 'Temp HP', description: 'Buffer before real HP.', rating: 'A+', note: 'Inspiring Leader, Twilight Cleric, Armor of Agathys.' },
];

export const MAX_AC_BUILDS = [
  { build: 'Plate + Shield + Defense', ac: 21, class: 'Fighter/Paladin', note: 'Baseline tank AC.' },
  { build: '+ Shield spell', ac: 26, class: 'Eldritch Knight / Hexblade Paladin', note: '26 AC for 1 round.' },
  { build: '+ Shield of Faith', ac: 23, class: 'Paladin/Cleric', note: 'Concentration but +2 always on.' },
  { build: '+ Haste', ac: 23, class: 'Any with Haste', note: '+2 AC + extra action.' },
  { build: '+ Magic armor/shield', ac: '23-27', class: 'Any', note: '+1/+2/+3 stacks with everything.' },
  { build: 'Warforged Plate + Shield', ac: 22, class: 'Warforged Fighter/Paladin', note: '+1 racial bonus stacks.' },
  { build: 'Bladesinger Wizard', ac: '22+ (INT+DEX)', class: 'Wizard', note: '13+DEX+INT during Bladesong. + Shield = 27+.' },
];

export const DEFENSIVE_PLAY_TIPS = [
  'AC is most important at low levels. At high levels, saves matter more.',
  'Shield spell: +5 AC for 1 round. Best L1 slot expenditure.',
  'Mirror Image: 3 free misses. No concentration. Incredible.',
  'Absorb Elements: halve elemental damage for a L1 slot. Always prepare.',
  'Position behind cover. +2 or +5 AC from terrain is free.',
  'Dodge action: when you can\'t do anything useful, Dodge is always good.',
  'Temp HP from Inspiring Leader or Twilight Cleric stacks over time.',
  'Evasion (Rogue/Monk): DEX saves become nearly free. Incredible feature.',
  'Heavy Armor Master: great at L1-6, falls off after. Take early or skip.',
  'The best defense is offense: dead enemies can\'t attack you.',
];
