/**
 * playerHeldActionTriggerGuide.js
 * Player Mode: Ready action rules, optimization, and creative uses
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  what: 'Use your action to prepare a response to a specific trigger.',
  trigger: 'State a perceivable trigger: "When the door opens" or "When an enemy comes around the corner."',
  reaction: 'When trigger occurs, use your REACTION to take the readied action.',
  spells: 'Readied spells require concentration until triggered. Slot used even if never triggered.',
  movement: 'You can ready movement (up to your speed) as your reaction.',
  lostAction: 'If trigger never happens, you lose your action.',
  note: 'Ready uses your reaction. Can\'t also use Shield or Counterspell that round.',
};

export const BEST_READY_USES = [
  { use: 'Ambush Through Door', trigger: 'When the door opens.', why: 'Attack first enemy through before their turn.' },
  { use: 'Target From Cover', trigger: 'When enemy comes out of cover.', why: 'Hit them the instant they\'re exposed.' },
  { use: 'Combo With Ally', trigger: 'When ally shoves enemy prone.', why: 'Attack with advantage on prone target.' },
  { use: 'Emergency Heal', trigger: 'When ally drops to 0 HP.', why: 'Immediately pick up downed ally.' },
  { use: 'Hold Person Follow-up', trigger: 'When ally casts Hold Person.', why: 'Attack paralyzed target = auto-crit within 5ft.' },
  { use: 'Escape Setup', trigger: 'When the cage door opens.', why: 'Ready movement for immediate escape.' },
];

export const READY_SPELL_RULES = {
  casting: 'Cast on your turn. Held via concentration until trigger.',
  concentration: 'Drops your current concentration spell.',
  slotUsed: 'Slot used when you cast (your turn), not when triggered.',
  lostIfNotUsed: 'Trigger doesn\'t happen = slot wasted.',
  cantrips: 'Cantrips can be readied without losing resources.',
  note: 'Readying spells is expensive. Only when payoff justifies it.',
};

export const READY_VS_ALTERNATIVES = [
  { alternative: 'Dodge', when: 'No productive target and need to survive.', note: 'Dodge usually better than uncertain Ready.' },
  { alternative: 'Dash', when: 'Need to close distance for next turn.', note: 'Get into position rather than waiting.' },
  { alternative: 'Help', when: 'Ally needs advantage on next attack.', note: 'Help guarantees value. Ready might not trigger.' },
  { alternative: 'Attack Now', when: 'Valid target available.', note: 'Certain attack now > possible attack later.' },
];

export const READY_ACTION_TIPS = [
  'Ready uses your reaction. Can\'t also Shield or Counterspell.',
  'Readied spells drop your current concentration.',
  'Spell slot used on your turn, not when trigger occurs.',
  'Only ready when trigger is very likely to happen.',
  'Ready cantrips: no slot cost if trigger fails.',
  'Ready attack for prone combo: ally shoves, you crit fish.',
  'Ready movement: useful for fleeing or chases.',
  'If you have a target now, attack now. Don\'t gamble.',
  'Dodge is usually better than Ready if just waiting.',
  'Coordinate triggers with allies for devastating combos.',
];
