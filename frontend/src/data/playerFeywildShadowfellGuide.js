/**
 * playerFeywildShadowfellGuide.js
 * Player Mode: Feywild and Shadowfell — dangers, rules, and survival
 * Pure JS — no React dependencies.
 */

export const FEYWILD = {
  description: 'Echo of the Material Plane but vivid, wild, and beautiful. Time flows differently.',
  dangers: [
    { danger: 'Time Warp', effect: 'Time passes differently. Minutes in Feywild = years in Material (or vice versa).', note: 'DM rolls on time warp table. Can lose decades.' },
    { danger: 'Memory Loss', effect: 'Extended stay can cause memories to fade.', note: 'Fey courts may steal memories as payment.' },
    { danger: 'Fey Bargains', effect: 'Fey deals are binding and literal. Careful with wording.', note: 'Never say "thank you" (implies debt) or give your true name.' },
    { danger: 'Emotional Extremes', effect: 'Joy, sorrow, anger amplified. May affect behavior.', note: 'Some regions force WIS saves vs enchantment effects.' },
  ],
  creatures: ['Archfey', 'Eladrin', 'Pixies', 'Satyrs', 'Hags (some)', 'Displacer Beasts'],
  entry: ['Fey crossings (natural)', 'Plane Shift', 'Gate', 'Some Archfey powers'],
};

export const SHADOWFELL = {
  description: 'Dark echo of the Material Plane. Despair, cold, and decay. Home of the Raven Queen.',
  dangers: [
    { danger: 'Shadowfell Despair', effect: 'After each LR in Shadowfell: DC 10 WIS save or gain Shadowfell Despair.', note: 'Apathy, Dread, or Madness. -1d4 to checks and saves.' },
    { danger: 'Undead Prevalence', effect: 'Undead are everywhere. Negative energy empowers them.', note: 'Shadows can drain STR. 0 STR = death + new Shadow.' },
    { danger: 'No Light', effect: 'Light sources dimmed. Darkvision reduced in some areas.', note: 'Some regions suppress light magic.' },
    { danger: 'Domains of Dread', effect: 'Trapped in a Domain of Dread (Ravenloft). Can\'t leave easily.', note: 'Dark Lords control escape. Curse of Strahd is a Domain of Dread.' },
  ],
  creatures: ['Undead', 'Shadows', 'Shadow Dragons', 'Sorrowsworn', 'Shadar-kai', 'The Raven Queen'],
  entry: ['Shadow crossings', 'Plane Shift', 'Gate', 'Vistani mists (Ravenloft)'],
};

export const PLANAR_SURVIVAL = {
  feywild: [
    'Never give your true name to Fey.',
    'Don\'t eat Fey food (may bind you to the plane).',
    'Fey bargains are literal. Read the fine print.',
    'Iron is anathema to many Fey. Carry iron weapons.',
    'Don\'t say "thank you" — it implies you owe a debt.',
    'Time warp: spend minimal time. Enter/exit quickly.',
  ],
  shadowfell: [
    'Prepare Protection from Evil and Good.',
    'Bring radiant damage sources. Undead are common.',
    'WIS saves against Despair every long rest.',
    'Shadows drain STR. 0 STR = instant death.',
    'Light sources may be suppressed. Have backup.',
    'Domains of Dread: can\'t Plane Shift out easily.',
  ],
};

export const FEYWILD_SHADOWFELL_TIPS = [
  'Feywild: time warp can lose YEARS. Be quick.',
  'Never give Fey your true name or say "thank you."',
  'Iron weapons: many Fey are vulnerable.',
  'Don\'t eat Fey food. It can bind you to the plane.',
  'Shadowfell: DC 10 WIS save every LR or gain Despair.',
  'Shadows drain STR. At 0 STR = instant death + new Shadow.',
  'Bring radiant damage for Shadowfell undead.',
  'Domains of Dread: Plane Shift may not work to escape.',
  'Protection from Evil and Good: essential for both planes.',
  'Plane Shift: 7th level. Best way to enter/exit planes.',
];
