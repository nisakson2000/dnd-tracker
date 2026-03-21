/**
 * playerBringingBackTheDeadGuide.js
 * Player Mode: Resurrection spells — options, costs, time limits, and planning
 * Pure JS — no React dependencies.
 */

export const RESURRECTION_SPELLS = [
  { spell: 'Revivify', level: 'L3', caster: 'Cleric, Paladin, Artificer, Wildfire Druid', time: '1 minute', cost: '300gp diamond (consumed)', hp: '1 HP', note: 'PRIMARY resurrection. Carry diamond ALWAYS.' },
  { spell: 'Raise Dead', level: 'L5', caster: 'Cleric, Bard, Paladin', time: '10 days', cost: '500gp diamond', hp: '1 HP, -4 penalty', note: 'Backup. 4-day recovery penalty.' },
  { spell: 'Reincarnate', level: 'L5', caster: 'Druid', time: '10 days', cost: '1,000gp oils', hp: 'Full', note: 'Random new race. Fun or frustrating.' },
  { spell: 'Resurrection', level: 'L7', caster: 'Cleric, Bard', time: '100 years', cost: '1,000gp diamond', hp: 'Full', note: 'Clean resurrection. No penalty.' },
  { spell: 'True Resurrection', level: 'L9', caster: 'Cleric, Druid', time: '200 years', cost: '25,000gp diamonds', hp: 'Full + new body', note: 'Works even if body destroyed.' },
  { spell: 'Wish', level: 'L9', caster: 'Sorcerer, Wizard', time: 'Any', cost: 'None (33% lose Wish)', hp: 'Varies', note: 'Duplicate Resurrection for free.' },
];

export const RESURRECTION_LIMITS = {
  willing: 'Soul must be willing to return.',
  soulTrapped: 'Trapped soul (Soul Cage) = resurrection fails.',
  undead: 'Destroy the undead form first.',
  disintegrated: 'Body destroyed: only True Resurrection or Wish.',
  missingParts: 'Revivify/Raise Dead need mostly intact body.',
};

export const RESURRECTION_PREP = [
  { prep: '300gp Diamond', priority: 'S+', why: 'Revivify component. Non-negotiable.' },
  { prep: '500gp Diamond', priority: 'A+', why: 'Raise Dead backup.' },
  { prep: 'Gentle Repose (L2 ritual)', priority: 'S', why: 'Pauses Revivify timer. No slot needed.' },
  { prep: 'Revivify Scroll', priority: 'S', why: 'Emergency if healer goes down.' },
  { prep: 'Death Ward (L4)', priority: 'A+', why: 'Prevent death. First drop to 0 = 1 HP instead.' },
  { prep: 'Clone (L8 Wizard)', priority: 'A', why: 'Auto-resurrect backup body.' },
];

export const GENTLE_REPOSE_TRICK = {
  what: 'Gentle Repose pauses the Revivify 1-minute timer.',
  how: 'Cast on dead body → timer pauses → walk to town → Revivify.',
  ritual: 'Ritual cast. No spell slot.',
  duration: '10 days. Recast to extend.',
};

export const RESURRECTION_TIPS = [
  'ALWAYS carry a 300gp diamond. Revivify saves lives.',
  'Gentle Repose: pauses Revivify timer. Ritual. No slot.',
  'Revivify: 1-minute window. Act FAST.',
  'Raise Dead: 10-day window. 4-day recovery penalty.',
  'Death Ward before boss fights. Prevent death entirely.',
  'Clone (Wizard L8): automatic resurrection safety net.',
  'Disintegrate destroys body. Only True Resurrection/Wish.',
  'Soul must be willing. Can\'t force resurrection.',
  'Buy Revivify scrolls as emergency backup.',
  'Gentle Repose + Revivify: walk dead ally to town for cheap rez.',
];
