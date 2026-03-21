/**
 * playerRaceTraits.js
 * Player Mode: Racial trait reference for quick lookup
 * Pure JS — no React dependencies.
 */

export const RACIAL_TRAITS = {
  Human: {
    abilityIncrease: '+1 to all ability scores',
    speed: 30,
    languages: ['Common', 'One extra'],
    traits: ['Extra language'],
    darkvision: false,
  },
  'Variant Human': {
    abilityIncrease: '+1 to two ability scores',
    speed: 30,
    languages: ['Common', 'One extra'],
    traits: ['One feat', 'One skill proficiency'],
    darkvision: false,
  },
  'High Elf': {
    abilityIncrease: '+2 DEX, +1 INT',
    speed: 30,
    languages: ['Common', 'Elvish', 'One extra'],
    traits: ['Darkvision 60ft', 'Fey Ancestry (adv vs charm, immune to sleep)', 'Trance (4hr rest)', 'One wizard cantrip', 'Perception proficiency'],
    darkvision: 60,
  },
  'Wood Elf': {
    abilityIncrease: '+2 DEX, +1 WIS',
    speed: 35,
    languages: ['Common', 'Elvish'],
    traits: ['Darkvision 60ft', 'Fey Ancestry', 'Trance', 'Mask of the Wild (hide in light obscurement)', 'Perception proficiency'],
    darkvision: 60,
  },
  'Dark Elf (Drow)': {
    abilityIncrease: '+2 DEX, +1 CHA',
    speed: 30,
    languages: ['Common', 'Elvish'],
    traits: ['Superior Darkvision 120ft', 'Sunlight Sensitivity (DIS in direct sunlight)', 'Drow Magic (Dancing Lights, Faerie Fire, Darkness)', 'Fey Ancestry'],
    darkvision: 120,
  },
  'Hill Dwarf': {
    abilityIncrease: '+2 CON, +1 WIS',
    speed: 25,
    languages: ['Common', 'Dwarvish'],
    traits: ['Darkvision 60ft', 'Dwarven Resilience (adv vs poison, resistance to poison)', 'Stonecunning', 'Dwarven Toughness (+1 HP/level)', 'Speed not reduced by heavy armor'],
    darkvision: 60,
  },
  'Mountain Dwarf': {
    abilityIncrease: '+2 CON, +2 STR',
    speed: 25,
    languages: ['Common', 'Dwarvish'],
    traits: ['Darkvision 60ft', 'Dwarven Resilience', 'Stonecunning', 'Light & Medium armor proficiency', 'Speed not reduced by heavy armor'],
    darkvision: 60,
  },
  'Lightfoot Halfling': {
    abilityIncrease: '+2 DEX, +1 CHA',
    speed: 25,
    languages: ['Common', 'Halfling'],
    traits: ['Lucky (reroll nat 1s)', 'Brave (adv vs frightened)', 'Halfling Nimbleness (move through larger creatures)', 'Naturally Stealthy (hide behind Medium+ creatures)'],
    darkvision: false,
  },
  'Half-Elf': {
    abilityIncrease: '+2 CHA, +1 to two others',
    speed: 30,
    languages: ['Common', 'Elvish', 'One extra'],
    traits: ['Darkvision 60ft', 'Fey Ancestry', 'Two skill proficiencies'],
    darkvision: 60,
  },
  'Half-Orc': {
    abilityIncrease: '+2 STR, +1 CON',
    speed: 30,
    languages: ['Common', 'Orc'],
    traits: ['Darkvision 60ft', 'Relentless Endurance (drop to 1 HP instead of 0, 1/long rest)', 'Savage Attacks (extra crit die)', 'Intimidation proficiency'],
    darkvision: 60,
  },
  Tiefling: {
    abilityIncrease: '+2 CHA, +1 INT',
    speed: 30,
    languages: ['Common', 'Infernal'],
    traits: ['Darkvision 60ft', 'Hellish Resistance (fire resistance)', 'Infernal Legacy (Thaumaturgy, Hellish Rebuke at 3, Darkness at 5)'],
    darkvision: 60,
  },
  Dragonborn: {
    abilityIncrease: '+2 STR, +1 CHA',
    speed: 30,
    languages: ['Common', 'Draconic'],
    traits: ['Breath Weapon (damage type by ancestry)', 'Damage Resistance (matching ancestry)'],
    darkvision: false,
  },
};

/**
 * Get racial traits by race name.
 */
export function getRacialTraits(raceName) {
  if (!raceName) return null;
  const key = Object.keys(RACIAL_TRAITS).find(k => k.toLowerCase() === raceName.toLowerCase());
  return key ? { race: key, ...RACIAL_TRAITS[key] } : null;
}

/**
 * Check if race has darkvision.
 */
export function hasDarkvision(raceName) {
  const traits = getRacialTraits(raceName);
  return traits ? (traits.darkvision || false) : false;
}
