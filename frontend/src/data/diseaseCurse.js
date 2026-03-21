/**
 * Disease & Curse System — Tracking progression, symptoms, and cures.
 */

export const DISEASES = [
  {
    name: 'Cackle Fever',
    type: 'disease',
    transmission: 'Contact with infected creature or contaminated air',
    incubation: '1d4 hours',
    symptoms: 'Uncontrollable laughing fits. Disadvantage on Wisdom saves and ability checks.',
    progression: [
      { stage: 1, effect: 'Occasional giggles. -1 to Wisdom checks.', duration: '1d4 days' },
      { stage: 2, effect: 'Frequent laughing fits. Disadvantage on Wisdom saves.', duration: '1d6 days' },
      { stage: 3, effect: 'Constant laughter. Incapacitated during fits (1d10 minutes per hour).', duration: 'Until cured' },
    ],
    save: 'CON DC 13 at each long rest to recover',
    cure: 'Lesser Restoration, or 3 successful saves',
    severity: 'moderate',
  },
  {
    name: 'Sewer Plague',
    type: 'disease',
    transmission: 'Contact with filth or contaminated water',
    incubation: '1d4 days',
    symptoms: 'Fatigue, cramps, oozing wounds. Exhaustion that won\'t go away.',
    progression: [
      { stage: 1, effect: 'Half benefit from healing. Exhaustion level 1.', duration: '1d4 days' },
      { stage: 2, effect: 'No benefit from long rests for HP. Exhaustion level 2.', duration: '1d6 days' },
      { stage: 3, effect: 'Maximum HP reduced by 1d8 per day. Exhaustion level 3.', duration: 'Until cured' },
    ],
    save: 'CON DC 11 at each long rest',
    cure: 'Lesser Restoration, or 3 successful saves',
    severity: 'moderate',
  },
  {
    name: 'Sight Rot',
    type: 'disease',
    transmission: 'Drinking contaminated water',
    incubation: '1 day',
    symptoms: 'Painful inflammation of the eyes. Gradually going blind.',
    progression: [
      { stage: 1, effect: '-1 to Perception. Vision slightly blurry.', duration: '1d4 days' },
      { stage: 2, effect: 'Disadvantage on Perception and ranged attacks.', duration: '1d6 days' },
      { stage: 3, effect: 'Blinded. Permanent if not cured within 3 days.', duration: 'Until cured' },
    ],
    save: 'CON DC 15 at each long rest',
    cure: 'Lesser Restoration within 3 days of blindness. Rare eyebright flower poultice.',
    severity: 'severe',
  },
  {
    name: 'Filth Fever',
    type: 'disease',
    transmission: 'Bite from a Giant Rat or contact with filth',
    incubation: '1d4 days',
    symptoms: 'Fever, sweating, disorientation.',
    progression: [
      { stage: 1, effect: 'Disadvantage on Strength checks and saves.', duration: '1d4 days' },
      { stage: 2, effect: 'Disadvantage on Strength and Constitution checks and saves.', duration: '1d6 days' },
      { stage: 3, effect: 'Above plus exhaustion level 1 that can\'t be removed.', duration: 'Until cured' },
    ],
    save: 'CON DC 11 at each long rest',
    cure: 'Lesser Restoration, or 3 successful saves',
    severity: 'minor',
  },
  {
    name: 'Mind Fire',
    type: 'disease',
    transmission: 'Psychic attack or exposure to aberrant energies',
    incubation: '1d6 hours',
    symptoms: 'Headaches, confusion, hallucinations.',
    progression: [
      { stage: 1, effect: 'Occasional hallucinations. Disadvantage on Intelligence checks.', duration: '1d4 days' },
      { stage: 2, effect: 'Intelligence and Wisdom scores reduced by 2. Constant minor hallucinations.', duration: '1d6 days' },
      { stage: 3, effect: 'Intelligence reduced to 1. Cannot cast spells. Severe hallucinations.', duration: 'Until cured' },
    ],
    save: 'INT DC 12 at each long rest',
    cure: 'Greater Restoration or Mind Blank',
    severity: 'severe',
  },
];

export const CURSES = [
  {
    name: 'Curse of Weakness',
    effect: 'Strength score reduced to 8. Cannot be raised by any means while cursed.',
    trigger: 'Activated when the cursed item is attuned or a curse is cast.',
    removal: 'Remove Curse spell, or completing a quest for the curse\'s creator.',
    mechanical: { ability: 'strength', setTo: 8 },
    severity: 'moderate',
  },
  {
    name: 'Curse of Unluck',
    effect: 'Once per day, the DM can force the cursed creature to reroll a successful save or attack and take the lower result.',
    trigger: 'Breaking a mirror, defiling a shrine, or angering a hag.',
    removal: 'Remove Curse, or performing a specific act of atonement.',
    mechanical: { type: 'reroll', frequency: '1/day' },
    severity: 'moderate',
  },
  {
    name: 'Lycanthropy Curse',
    effect: 'On full moon nights, the creature transforms into a beast form. No control over actions in beast form until they embrace or cure the curse.',
    trigger: 'Bitten by a lycanthrope and failing a CON DC 12 save.',
    removal: 'Remove Curse before the first full moon. After first transformation: only Greater Restoration or Wish.',
    mechanical: { type: 'transformation', trigger: 'full_moon' },
    severity: 'severe',
  },
  {
    name: 'Death Curse',
    effect: 'Maximum HP reduced by 1 per day. Cannot be raised from the dead while cursed.',
    trigger: 'Powerful necromantic artifact or dying god\'s last act.',
    removal: 'Destroying the source of the curse.',
    mechanical: { type: 'hp_drain', amount: 1, frequency: 'daily' },
    severity: 'critical',
  },
  {
    name: 'Curse of Truthfulness',
    effect: 'The cursed creature cannot tell a lie. Any attempt to deceive causes 1d6 psychic damage.',
    trigger: 'Breaking a sacred oath or lying to a fey lord.',
    removal: 'Remove Curse, or telling a truth that costs you dearly.',
    mechanical: { type: 'behavioral', restriction: 'cannot_lie' },
    severity: 'minor',
  },
  {
    name: 'Mummy Rot',
    effect: 'Cannot regain HP. Maximum HP decreases by 10 every 24 hours. If max HP reaches 0, the creature turns to dust.',
    trigger: 'Mummy\'s touch attack.',
    removal: 'Remove Curse followed by any healing spell.',
    mechanical: { type: 'hp_drain', amount: 10, frequency: 'daily', healingBlocked: true },
    severity: 'critical',
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getDisease(name) {
  return DISEASES.find(d => d.name === name) || null;
}

export function getCurse(name) {
  return CURSES.find(c => c.name === name) || null;
}

export function generateRandomDisease() {
  return pick(DISEASES);
}

export function generateRandomCurse() {
  return pick(CURSES);
}

export function getDiseasesBySeverity(severity) {
  return DISEASES.filter(d => d.severity === severity);
}
