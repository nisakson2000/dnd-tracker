/**
 * playerRestRulesGuide.js
 * Player Mode: Short rest vs long rest — resource management
 * Pure JS — no React dependencies.
 */

export const REST_RULES = {
  shortRest: {
    duration: '1 hour minimum',
    healing: 'Spend Hit Dice to heal. Roll HD + CON mod per die spent.',
    recovery: 'Some class features recharge on short rest.',
    frequency: 'Can take multiple per day (recommended 2 between long rests).',
    note: 'Short rests are free. Always take them when possible. Hit Dice are a valuable healing resource.',
  },
  longRest: {
    duration: '8 hours (6 hours sleep + 2 hours light activity for most races).',
    healing: 'Regain all HP. Recover half your total Hit Dice (rounded down, minimum 1).',
    recovery: 'All class features, spell slots, and most resources recharge.',
    frequency: 'Once per 24 hours.',
    limit: 'Must have at least 1 HP to benefit.',
    note: 'Full reset. Plan your adventuring day around one long rest.',
  },
};

export const SHORT_REST_CLASSES = {
  srDependent: [
    { class: 'Fighter', reason: 'Action Surge, Second Wind, Superiority Dice, Indomitable — all short rest.' },
    { class: 'Warlock', reason: 'Pact Magic spell slots recharge on SR. Short rest = full Warlock reset.' },
    { class: 'Monk', reason: 'Ki points recharge on SR. Essential for Stunning Strike, Flurry.' },
    { class: 'Druid (Moon)', reason: 'Wild Shape uses recharge on SR. Two uses per SR.' },
  ],
  lrDependent: [
    { class: 'Wizard', reason: 'Spell slots recharge on LR. Arcane Recovery helps once per day.' },
    { class: 'Cleric', reason: 'Spell slots and Channel Divinity (1/SR) recharge on LR.' },
    { class: 'Sorcerer', reason: 'Spell slots and Sorcery Points recharge on LR.' },
    { class: 'Paladin', reason: 'Spell slots, Lay on Hands, Smite slots — all LR. Channel Divinity is 1/SR.' },
  ],
  balanced: [
    { class: 'Bard', reason: 'Bardic Inspiration recharges on SR (L5+). Spell slots on LR.' },
    { class: 'Ranger', reason: 'Spell slots on LR. Some features on SR.' },
    { class: 'Barbarian', reason: 'Rage uses are per LR. But Barbarians have low SR recovery too.' },
  ],
};

export const HIT_DICE_OPTIMIZATION = [
  { tip: 'Roll low HD first', detail: 'If multiclassed: spend d6 or d8 HD before d10 or d12. Save big dice for when you need them.' },
  { tip: 'Don\'t overheal', detail: 'Stop spending HD when you\'re at 70-80% HP. Save remaining HD for later short rests.' },
  { tip: 'Song of Rest (Bard)', detail: 'Bard in party: +1d6 to +1d12 free healing per short rest. Always rest with the Bard.' },
  { tip: 'Chef feat', detail: 'Chef feat: creatures regain +1d8 HP per short rest (treats). Party-wide bonus.' },
  { tip: 'Periapt of Wound Closure', detail: 'Double HP regained per HD spent during short rest. Incredible item.' },
];

export const ADVENTURING_DAY_BUDGET = {
  expectedEncounters: '6-8 medium/hard encounters per long rest.',
  shortRests: '2 short rests recommended (after encounters 2-3 and 5-6).',
  spellSlotBudget: 'Don\'t burn all high slots in encounter 1. Save at least 1-2 high slots for later.',
  note: 'Most tables run 2-4 encounters per day, not 6-8. This means LR-dependent classes are stronger in practice because they can nova every fight.',
};

export const REST_TACTICS = [
  { tactic: 'Push for short rests', detail: 'If party has Fighter/Warlock/Monk: push for 2 short rests per day. Their power doubles.', rating: 'S' },
  { tactic: 'Catnap spell', detail: 'L3 spell: 3 creatures get a short rest in 10 minutes instead of 1 hour.', rating: 'A' },
  { tactic: 'Tiny Hut for safe LR', detail: 'Wizard/Bard: ritual cast Tiny Hut. Invulnerable dome. Safe 8-hour rest.', rating: 'S' },
  { tactic: 'Warlock short rest abuse', detail: 'Warlock L5: two L3 slots every short rest. 3 short rests = 6 L3 slots per day. More than most full casters.', rating: 'S' },
];

export function hitDiceHealing(hitDieSize, conMod, numDice = 1) {
  const avg = numDice * ((hitDieSize / 2 + 0.5) + conMod);
  return { avg: Math.round(avg), dice: `${numDice}d${hitDieSize}+${conMod * numDice}` };
}
