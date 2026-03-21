/**
 * playerLongRestOptimization.js
 * Player Mode: Maximizing value from long rests
 * Pure JS — no React dependencies.
 */

export const LONG_REST_RECOVERY = {
  hp: 'Recover ALL lost hit points.',
  hitDice: 'Recover HALF your total hit dice (minimum 1). NOT all of them.',
  spellSlots: 'Recover ALL spent spell slots.',
  classFeatures: 'Most class features reset. Check your class for specifics.',
  duration: '8 hours. At least 6 sleeping, up to 2 light activity.',
  frequency: 'Only ONE long rest per 24 hours.',
  interruption: 'If interrupted by 1+ hour of strenuous activity (combat, walking, casting), restart the rest.',
};

export const PRE_LONG_REST_CHECKLIST = [
  { action: 'Cast remaining Goodberry spells', reason: 'Berries last 24 hours. 10 HP per 1st-level slot. Carry them into tomorrow.', class: 'Druid, Ranger' },
  { action: 'Convert spell slots to Sorcery Points', reason: 'Sorcery Points persist through long rest. Unused spell slots are wasted.', class: 'Sorcerer' },
  { action: 'Cast Alarm as ritual', reason: 'Free. 8-hour duration. Alerts you if anything enters the camp.', class: 'Wizard, Ranger, Artificer' },
  { action: 'Cast Tiny Hut as ritual', reason: 'Impenetrable dome. 8-hour duration. Perfect safe camp.', class: 'Wizard, Bard' },
  { action: 'Recast Animate Dead', reason: 'Maintain control of undead. They become hostile after 24 hours without recasting.', class: 'Wizard, Cleric' },
  { action: 'Identify magic items', reason: 'Identify as ritual during rest. Learn all magic item properties for free.', class: 'Wizard, Bard, Artificer' },
  { action: 'Cast Mending on damaged items', reason: 'Free cantrip. Repair clothes, armor straps, broken tools.', class: 'Any with Mending' },
  { action: 'Cast Continual Flame', reason: 'Permanent light source. If you have 50gp ruby dust, cast before resting.', class: 'Cleric, Wizard, Artificer' },
  { action: 'Review spells to prepare', reason: 'Prepared casters change spells after long rest. Plan for tomorrow.', class: 'Cleric, Druid, Wizard, Paladin' },
  { action: 'Short rest BEFORE long rest if needed', reason: 'Spend remaining hit dice on a short rest, then long rest recovers half hit dice.', class: 'All' },
];

export const MORNING_ROUTINE = [
  { action: 'Prepare spells', priority: 1, time: 'During rest (1 min/spell level)', class: 'Wizard, Cleric, Druid, Paladin' },
  { action: 'Cast Heroes\' Feast', priority: 1, time: '10 minutes (1 hour to eat)', class: 'Cleric 11+', note: '1000gp bowl consumed. +2d10 max HP, immune to poison and fear, advantage WIS saves. 24 hours.' },
  { action: 'Cast Aid', priority: 2, time: '1 action', class: 'Cleric, Paladin, Artificer', note: '+5 max HP per creature (3 targets). Lasts 8 hours. Upcast for more.' },
  { action: 'Cast Mage Armor', priority: 2, time: '1 action', class: 'Wizard, Sorcerer', note: '8 hours. 13+DEX AC. Cast before leaving camp.' },
  { action: 'Cast Gift of Alacrity', priority: 2, time: '1 action', class: 'Chronurgy Wizard', note: '+1d8 initiative for 8 hours. No concentration.' },
  { action: 'Cast Death Ward', priority: 2, time: '1 action', class: 'Cleric, Paladin', note: 'First time you drop to 0 HP, drop to 1 instead. 8 hours.' },
  { action: 'Distribute Goodberries', priority: 3, time: 'None', class: 'Druid, Ranger', note: 'Give everyone 2-3 berries for emergency 1HP revival.' },
];

export const HIT_DICE_STRATEGY = [
  'Long rest recovers HALF your total hit dice (rounded down, minimum 1).',
  'A level 8 character has 8 hit dice. Long rest recovers 4.',
  'If you enter a long rest with 0 hit dice, you recover 4 (half of 8).',
  'If you enter with 6 hit dice, you recover 2 (to cap at 8).',
  'STRATEGY: Take a short rest BEFORE long rest. Spend remaining hit dice to heal.',
  'Then long rest recovers half your total — maximizing hit dice cycling.',
  'Don\'t hoard hit dice. They\'re meant to be spent.',
];

export function calculateHitDiceRecovery(totalHitDice, currentHitDice) {
  const recovery = Math.max(1, Math.floor(totalHitDice / 2));
  const actual = Math.min(recovery, totalHitDice - currentHitDice);
  return {
    recovered: actual,
    newTotal: currentHitDice + actual,
    maxPossible: totalHitDice,
  };
}

export function getPreRestActions(classNames) {
  return PRE_LONG_REST_CHECKLIST.filter(item =>
    (classNames || []).some(c => item.class.toLowerCase().includes(c.toLowerCase())) ||
    item.class === 'All'
  );
}
