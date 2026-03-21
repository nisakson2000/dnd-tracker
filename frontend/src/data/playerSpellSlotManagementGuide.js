/**
 * playerSpellSlotManagementGuide.js
 * Player Mode: Spell slot management across an adventuring day
 * Pure JS — no React dependencies.
 */

export const SLOT_MANAGEMENT_BASICS = {
  philosophy: 'Spell slots are your most precious resource. Managing them across multiple encounters is the core caster skill.',
  commonMistake: 'Blowing all your best slots in fight 1 and having nothing left for the boss at fight 6.',
  keyPrinciple: 'Match spell slot investment to encounter difficulty. Easy fights get cantrips. Hard fights get L3+ slots.',
};

export const SLOTS_PER_DAY = [
  { level: 1, slots: '2', topSlot: 'L1', note: 'Very limited. 2 slots total. Cantrips are your bread and butter.' },
  { level: 3, slots: '4/2', topSlot: 'L2', note: '6 total slots. Starting to have options but still tight.' },
  { level: 5, slots: '4/3/2', topSlot: 'L3', note: '9 total slots. This is where casters start feeling powerful. Fireball/Counterspell online.' },
  { level: 7, slots: '4/3/3/1', topSlot: 'L4', note: '11 total slots. L4 opens Polymorph, Banishment.' },
  { level: 9, slots: '4/3/3/3/1', topSlot: 'L5', note: '14 total slots. L5 opens Wall of Force, Animate Objects.' },
  { level: 11, slots: '4/3/3/3/2/1', topSlot: 'L6', note: '17 total slots. Comfortable. Globe of Invulnerability, Heal.' },
  { level: 13, slots: '4/3/3/3/2/1/1', topSlot: 'L7', note: '18 total slots. Forcecage, Simulacrum.' },
  { level: 15, slots: '4/3/3/3/2/1/1/1', topSlot: 'L8', note: '19 total. L8 and L9 are precious — save for critical moments.' },
  { level: 17, slots: '4/3/3/3/2/1/1/1/1', topSlot: 'L9', note: '20 total. Wish, True Polymorph, Meteor Swarm.' },
];

export const SLOT_BUDGET_GUIDELINES = [
  { encounterType: 'Easy/Trivial', budget: '0 slots (cantrips only)', note: 'Don\'t waste slots. Let martials handle it. Use cantrips and weapon attacks.' },
  { encounterType: 'Medium', budget: '1-2 low-level slots', note: 'Maybe one L1-2 spell (Web, Shield if needed). Mostly cantrips.' },
  { encounterType: 'Hard', budget: '2-4 slots including 1 mid-level', note: 'Use a L3 control spell (Hypnotic Pattern). A few L1 for Shield/healing. Worth the investment.' },
  { encounterType: 'Deadly/Boss', budget: 'Go all out', note: 'Use your best slots. This is what you saved for. Wall of Force, Banishment, Forcecage.' },
  { encounterType: 'Final encounter of day', budget: 'Everything remaining', note: 'Nothing to save for. Burn every slot. Tomorrow you get them all back.' },
];

export const SLOT_RECOVERY_OPTIONS = [
  { method: 'Long rest', recovers: 'ALL slots', class: 'All casters', note: 'Standard recovery. Plan your day around this.' },
  { method: 'Arcane Recovery (Wizard)', recovers: 'Slots totaling half Wizard level (rounded up)', class: 'Wizard', note: 'Once per day, during short rest. Free extra slots.' },
  { method: 'Font of Magic (Sorcerer)', recovers: 'Convert SP ↔ slots', class: 'Sorcerer', note: 'Create slots from SP. Expensive but flexible.' },
  { method: 'Warlock Pact Magic', recovers: 'ALL Pact slots on short rest', class: 'Warlock', note: 'Best slot economy. Short rest = full recovery.' },
  { method: 'Harness Divine Power (Cleric/Paladin)', recovers: '1 slot (level ≤ PB/2)', class: 'Cleric, Paladin', note: 'Channel Divinity to recover a slot. PB/LR uses.' },
  { method: 'Pearl of Power (magic item)', recovers: '1 L3 slot', class: 'Any', note: 'Requires attunement. Free L3 slot per day.' },
];

export const CONCENTRATION_SLOT_PRIORITY = [
  { principle: 'Concentration spells give the most value', detail: 'A L3 concentration spell lasts 10 rounds = 10 rounds of value from 1 slot. A L3 Fireball = 1 round of value.' },
  { principle: 'Cast concentration first', detail: 'Turn 1: cast your concentration spell (Hypnotic Pattern, Spirit Guardians, Haste). Then use cantrips/non-concentration.' },
  { principle: 'Protect concentration', detail: 'If you cast a L5 concentration spell, protect it with your life. War Caster, Constitution save proficiency, positioning.' },
  { principle: 'Don\'t stack concentration costs', detail: 'Losing concentration wastes the slot. Don\'t cast a concentration spell if you\'re in danger of losing it immediately.' },
];

export function slotsRemainingBudget(totalSlots, encountersRemaining, currentEncounterDifficulty) {
  const budgetPerEncounter = Math.floor(totalSlots / encountersRemaining);
  const difficultyMultiplier = currentEncounterDifficulty === 'deadly' ? 2 : currentEncounterDifficulty === 'hard' ? 1.5 : 1;
  return Math.min(totalSlots, Math.ceil(budgetPerEncounter * difficultyMultiplier));
}
