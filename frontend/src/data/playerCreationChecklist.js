/**
 * playerCreationChecklist.js
 * Player Mode: Complete character creation checklist — never forget a step
 * Pure JS — no React dependencies.
 */

export const CHARACTER_CREATION_STEPS = [
  { step: 1, name: 'Choose Race', details: 'Select race and subrace. Note racial traits, ASI, size, speed, languages, proficiencies.', common: 'Variant Human (feat), Half-Elf (CHA+skills), Custom Lineage (+2+feat).' },
  { step: 2, name: 'Choose Class', details: 'Select class and note hit die, proficiencies (saves, skills, armor, weapons), starting equipment.', common: 'Fighter (versatile), Wizard (power), Cleric (support), Rogue (skills).' },
  { step: 3, name: 'Determine Ability Scores', details: 'Point Buy (27 points), Standard Array (15/14/13/12/10/8), or roll (4d6 drop lowest).', tip: 'Always max your primary stat first. Odd scores benefit from half-feats.' },
  { step: 4, name: 'Apply Racial ASIs', details: 'Add racial bonuses to ability scores. Calculate modifiers: (score - 10) / 2, round down.', tip: 'Aim for even numbers. 15+1=16 is better than 15+2=17 (same modifier as 16).' },
  { step: 5, name: 'Choose Background', details: 'Select background for 2 skill proficiencies, tool/language proficiencies, equipment, and feature.', tip: 'Pick skills that don\'t overlap with class skills. Custom backgrounds are RAW-legal.' },
  { step: 6, name: 'Choose Skills', details: 'Select skill proficiencies from class list. Background gives 2 more. Some races give extras.', tip: 'Perception is the most-used skill. Take it if available.' },
  { step: 7, name: 'Note Class Features', details: 'Write down all level 1 class features. Spellcasting, Fighting Style, Rage, Sneak Attack, etc.', tip: 'Read each feature carefully. Many have limitations that are easy to miss.' },
  { step: 8, name: 'Choose Equipment', details: 'Take starting equipment OR starting gold to buy gear. Calculate AC from armor.', tip: 'Starting equipment is usually worth more than starting gold. Take the equipment.' },
  { step: 9, name: 'Choose Spells (if caster)', details: 'Select cantrips and prepared/known spells. Note spell save DC, spell attack bonus.', tip: 'Spell save DC = 8 + proficiency + casting mod. Spell attack = proficiency + casting mod.' },
  { step: 10, name: 'Calculate Combat Stats', details: 'HP (max hit die + CON), AC (armor + DEX + shield), Initiative (DEX mod), Speed, Passive Perception (10 + WIS + prof if proficient).', tip: 'Write these prominently on your sheet. You\'ll reference them constantly.' },
  { step: 11, name: 'Personality Traits', details: 'Choose/write 2 personality traits, 1 ideal, 1 bond, 1 flaw from background or custom.', tip: 'Flaws make characters interesting. DMs award inspiration for playing flaws.' },
  { step: 12, name: 'Backstory', details: 'Write 2-3 paragraphs about your character\'s history, motivation, and goals.', tip: 'Include a reason to adventure and a connection to at least one other party member.' },
];

export const COMMONLY_FORGOTTEN = [
  'Racial proficiencies (Elf: Perception, Dwarf: battleaxe/handaxe, etc.).',
  'Background tool proficiencies and languages.',
  'Starting equipment from BOTH class and background.',
  'Passive Perception (10 + WIS mod + proficiency if proficient).',
  'Speed modifications (Dwarf: 25ft not reduced by armor, Wood Elf: 35ft).',
  'Darkvision range (most common: 60ft, Drow/Deep Gnome: 120ft).',
  'Saving throw proficiencies (only 2, from your FIRST class).',
  'Spell components: do you need a component pouch or arcane focus?',
  'Class restrictions: Druids won\'t wear metal armor (flavor, not mechanical).',
  'Multiclass prerequisites: need 13 in key stats for both classes.',
];

export const FIRST_SESSION_PREP = [
  'Know your character\'s combat actions. What do you do on your turn?',
  'Know your spell effects (if caster). At least read your prepared spells.',
  'Have a dice rolling method ready (physical dice, app, or VTT).',
  'Know your AC, HP, attack bonuses, and spell save DC by heart.',
  'Have a 1-sentence character introduction ready.',
  'Ask the DM about house rules BEFORE session 1.',
];

export function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function passivePerception(wisMod, profBonus, isProficient, hasObservant) {
  return 10 + wisMod + (isProficient ? profBonus : 0) + (hasObservant ? 5 : 0);
}

export function startingHP(hitDie, conMod) {
  return hitDie + conMod;
}
