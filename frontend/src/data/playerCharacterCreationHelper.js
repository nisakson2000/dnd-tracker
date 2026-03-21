/**
 * playerCharacterCreationHelper.js
 * Player Mode: Quick character creation reference and best picks
 * Pure JS — no React dependencies.
 */

export const CHARACTER_CREATION_STEPS = [
  { step: 1, name: 'Choose a Race', detail: 'Pick based on flavor first, stats second. Tasha\'s allows any race to have any ASIs.', tips: ['Variant Human for a free feat at level 1', 'Half-Elf for +2 CHA and versatility', 'Custom Lineage for any build'] },
  { step: 2, name: 'Choose a Class', detail: 'This is your biggest mechanical choice. Pick what sounds FUN.', tips: ['Fighter if you\'re new (simple, effective)', 'Wizard for versatility', 'Paladin for CHA + melee + spells'] },
  { step: 3, name: 'Determine Ability Scores', detail: 'Standard Array [15,14,13,12,10,8] or Point Buy (27 points) or Roll (4d6 drop lowest).', tips: ['15 in your primary stat', '14 in CON (always)', 'Don\'t dump CON below 10'] },
  { step: 4, name: 'Choose a Background', detail: 'Gives 2 skill proficiencies + tool proficiencies + languages + feature.', tips: ['Any background can fit any class', 'Custom Background: pick any 2 skills', 'Background feature is for RP, not combat'] },
  { step: 5, name: 'Choose Equipment', detail: 'Starting equipment from class OR starting gold to buy your own.', tips: ['Take the starting equipment unless you know what you want', 'Make sure you have a focus/component pouch if caster', 'Shield users: make sure you have proficiency'] },
  { step: 6, name: 'Choose Spells (if applicable)', detail: 'Cantrips + 1st-level spells if you\'re a spellcaster at level 1.', tips: ['Always take one damage cantrip', 'Utility cantrips are great (Prestidigitation, Minor Illusion)', 'Healing Word if you\'re a healer — always'] },
  { step: 7, name: 'Fill in Details', detail: 'Name, appearance, personality, bonds, flaws, ideals.', tips: ['Give your character ONE clear motivation', 'A flaw makes roleplay more interesting', 'Connect to at least one other PC'] },
];

export const BEST_RACE_CLASS_COMBOS = [
  { race: 'Variant Human', class: 'Any', why: 'Free feat at level 1. GWM Fighter, War Caster Cleric, etc.' },
  { race: 'Half-Elf', class: 'Paladin/Bard/Warlock/Sorcerer', why: '+2 CHA, +1 to two others. Darkvision. Extra skills.' },
  { race: 'Mountain Dwarf', class: 'Wizard', why: 'Medium armor on a Wizard = excellent AC.' },
  { race: 'Wood Elf', class: 'Ranger/Monk/Rogue', why: '35ft speed, Mask of the Wild, +2 DEX.' },
  { race: 'Half-Orc', class: 'Barbarian/Fighter', why: 'Relentless Endurance, Savage Attacks, +2 STR.' },
  { race: 'Gnome (Forest/Rock)', class: 'Wizard/Artificer', why: 'Gnome Cunning (magic save advantage), +2 INT.' },
  { race: 'Tiefling', class: 'Warlock/Sorcerer', why: '+2 CHA, fire resistance, free spells.' },
  { race: 'Aarakocra', class: 'Monk/Ranger', why: '50ft flying speed at level 1. Incredibly strong.' },
];

export const COMMON_NEWBIE_MISTAKES = [
  { mistake: 'Dumping CON', fix: 'Never go below 12 CON. You need HP and concentration saves.' },
  { mistake: 'Choosing too many damage spells', fix: 'Mix utility, control, and damage. 1 damage spell is usually enough.' },
  { mistake: 'Not having a ranged option', fix: 'Melee characters should carry a bow or javelins for flying enemies.' },
  { mistake: 'Ignoring skills', fix: 'At least one face skill (Persuasion/Deception) and Perception.' },
  { mistake: 'Making an edgy loner character', fix: 'Give your character a reason to work with the party. Teams > lone wolves.' },
];

export function getStep(stepNumber) {
  return CHARACTER_CREATION_STEPS.find(s => s.step === stepNumber) || null;
}

export function getBestRaceForClass(className) {
  return BEST_RACE_CLASS_COMBOS.filter(c =>
    c.class.toLowerCase().includes((className || '').toLowerCase()) || c.class === 'Any'
  );
}
