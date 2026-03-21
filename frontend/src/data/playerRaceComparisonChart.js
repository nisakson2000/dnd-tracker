/**
 * playerRaceComparisonChart.js
 * Player Mode: Side-by-side race comparison for character creation decisions
 * Pure JS — no React dependencies.
 */

export const RACE_TIER_LIST = {
  S: [
    { race: 'Yuan-Ti Pureblood', why: 'Magic Resistance (advantage on ALL saves vs magic) + Poison Immunity.' },
    { race: 'Variant Human', why: 'Feat at level 1. Flexibility. Can start with PAM, GWM, SS, Lucky, or War Caster.' },
    { race: 'Custom Lineage', why: '+2 to one stat + feat at level 1. Best single-stat optimization.' },
    { race: 'Satyr', why: 'Magic Resistance (like Yuan-Ti) + Fey type (immune to Hold Person targeting humanoids).' },
    { race: 'Eladrin', why: 'Free Misty Step PB/day with seasonal bonus effects. CHA + DEX.' },
    { race: 'Shadar-kai', why: 'Teleport + resistance to ALL damage until next turn. PB/day.' },
  ],
  A: [
    { race: 'Half-Elf', why: '+2 CHA, +1/+1 flexible. Darkvision. Fey Ancestry. 2 skill proficiencies.' },
    { race: 'Mountain Dwarf', why: '+2 STR, +2 CON. Medium armor proficiency. Best raw martial stats.' },
    { race: 'Harengon', why: '+PB to initiative. Rabbit Hop (bonus action jump PB/day). Proficiency in Perception.' },
    { race: 'Halfling (Lightfoot)', why: 'Lucky (reroll 1s). Brave. Naturally Stealthy. Reliable dice.' },
    { race: 'Aasimar (Protector)', why: 'Fly speed 30ft at L3. Extra radiant damage = level. Healing Hands. Resistances.' },
    { race: 'Warforged', why: '+1 AC (stacks with armor). Poison resistance/advantage. Don\'t need to eat/sleep/breathe.' },
  ],
  B: [
    { race: 'High Elf', why: 'Free Wizard cantrip. DEX + INT. Good for EK, Bladesinger.' },
    { race: 'Wood Elf', why: '35ft speed. Mask of the Wild. DEX + WIS. Ranger/Monk/Druid.' },
    { race: 'Hill Dwarf', why: '+1 HP/level. WIS + CON. Tanky Cleric or Druid.' },
    { race: 'Tiefling (Zariel)', why: 'STR + CHA. Free Smite spells. Fire resistance. Paladin.' },
    { race: 'Bugbear', why: '+5ft reach on your turn. Surprise Attack 2d6. Stealth proficiency.' },
    { race: 'Goblin', why: 'Nimble Escape (free Cunning Action). Fury of the Small (level damage).' },
    { race: 'Dragonborn (Metallic/Fizban)', why: 'Bonus action breath PB/day. Incapacitate breath option.' },
    { race: 'Forest Gnome', why: 'Gnome Cunning (advantage on INT/WIS/CHA saves vs magic). Minor Illusion.' },
  ],
  C: [
    { race: 'Standard Human', why: '+1 to all stats. No other features. V. Human is almost always better.' },
    { race: 'Dragonborn (PHB)', why: 'Action breath weapon that scales poorly. Resistance is nice.' },
    { race: 'Aarakocra', why: '50ft fly speed at level 1. Some DMs ban it for being too strong early.' },
    { race: 'Kenku', why: 'Mimicry and stealth. Limited by RP restrictions. Good flavor, mediocre mechanics.' },
  ],
};

export const RACE_BY_CLASS = [
  { class: 'Fighter', best: 'V. Human (feat), Mountain Dwarf (+2/+2), Bugbear (reach), Half-Orc (Savage Attacks)' },
  { class: 'Wizard', best: 'V. Human (feat), High Elf (cantrip), Mountain Dwarf (armor), Gnome (Cunning)' },
  { class: 'Cleric', best: 'Hill Dwarf (WIS+CON+HP), V. Human (War Caster), Warforged (+1 AC)' },
  { class: 'Rogue', best: 'Lightfoot Halfling (Lucky+Stealthy), Bugbear (Surprise+reach), Goblin (Nimble Escape)' },
  { class: 'Paladin', best: 'Yuan-Ti (Magic Res+CHA), V. Human (feat), Zariel Tiefling (STR+CHA), Aasimar' },
  { class: 'Warlock', best: 'Yuan-Ti, V. Human, Half-Elf (+2 CHA), Tiefling (CHA+fire res)' },
  { class: 'Sorcerer', best: 'Yuan-Ti, V. Human, Half-Elf, Aasimar (Protector)' },
  { class: 'Barbarian', best: 'Half-Orc (Savage+Relentless), V. Human (GWM), Mountain Dwarf (+2/+2)' },
  { class: 'Monk', best: 'Wood Elf (35ft+WIS), Goblin (Nimble Escape), Harengon (+PB initiative)' },
  { class: 'Ranger', best: 'Wood Elf (speed+WIS), V. Human (SS/CBE), Shadar-kai (teleport)' },
  { class: 'Druid', best: 'Hill Dwarf (WIS+CON+HP), Wood Elf (WIS+speed), Firbolg (WIS+stealth)' },
  { class: 'Bard', best: 'Half-Elf (+2 CHA+skills), V. Human (feat), Satyr (Magic Resistance)' },
  { class: 'Artificer', best: 'Rock Gnome (INT+CON+Cunning), Warforged (+1 AC+INT), V. Human (feat)' },
];

export function raceRating(raceName) {
  for (const [tier, races] of Object.entries(RACE_TIER_LIST)) {
    if (races.some(r => r.race.toLowerCase() === raceName.toLowerCase())) return tier;
  }
  return 'Unranked';
}
