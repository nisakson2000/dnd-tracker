/**
 * playerAvoidMistakesGuide.js
 * Player Mode: Common player mistakes and how to avoid them
 * Pure JS — no React dependencies.
 */

export const COMBAT_MISTAKES = [
  { mistake: 'Healing mid-combat instead of killing', fix: 'Only heal at 0 HP (Healing Word). Kill enemies = prevent damage.' },
  { mistake: 'Spreading damage across enemies', fix: 'Focus fire. Kill one target, then the next.' },
  { mistake: 'Unused bonus action', fix: 'Spiritual Weapon, Misty Step, Cunning Action, class features.' },
  { mistake: 'Unused reaction', fix: 'Shield, Counterspell, OA, Absorb Elements.' },
  { mistake: 'Saving best abilities for later', fix: 'Use them now. Short/long rest recovers features.' },
  { mistake: 'Attacking nearest instead of highest priority', fix: 'Kill healers and casters first. Control tanks.' },
  { mistake: 'Clustering together', fix: 'Spread out 15ft+. Avoid AoE (Fireball).' },
  { mistake: 'Not using cover', fix: 'Half cover (+2 AC) is free. Use it.' },
  { mistake: 'Forgetting concentration limits', fix: 'Only ONE concentration spell at a time.' },
];

export const BUILD_MISTAKES = [
  { mistake: 'Spreading stats evenly', fix: 'Max primary stat. Dump stats are fine.' },
  { mistake: 'Feats before maxing primary stat', fix: 'Primary to 20 first (usually by L8).' },
  { mistake: 'Multiclassing before L5', fix: 'Get Extra Attack / L3 spells first.' },
  { mistake: 'Ignoring CON', fix: 'CON 14+ for everyone. HP and concentration.' },
  { mistake: 'Picking trap spells', fix: 'Witch Bolt, True Strike = traps. Check tier lists.' },
  { mistake: 'Not reading class features', fix: 'Read features L1-5 before Session 1.' },
  { mistake: 'Dumping WIS on martial', fix: 'WIS saves are devastating. 12+ minimum.' },
];

export const SOCIAL_MISTAKES = [
  { mistake: 'Fighting everything', fix: 'Negotiate first. Combat costs resources.' },
  { mistake: 'Not asking DM questions', fix: 'Ask about environment. Knowledge checks are free.' },
  { mistake: 'Main character syndrome', fix: 'Share the spotlight.' },
  { mistake: 'Not taking notes', fix: 'Write NPC names, locations, plot hooks.' },
  { mistake: 'Arguing rules during combat', fix: 'Accept ruling. Discuss after session.' },
];

export const RESOURCE_MISTAKES = [
  { mistake: 'Not taking short rests', fix: 'Free healing + feature recovery.' },
  { mistake: 'High slots on trash fights', fix: 'Cantrips for easy fights. Save big slots.' },
  { mistake: 'No basic supplies', fix: 'Rope, Healer\'s Kit, rations, torches.' },
];

export const AVOID_MISTAKES_TIPS = [
  'Kill enemies to prevent damage. Dead = best healing.',
  'Focus fire: whole party on one target.',
  'Max primary stat first. +1 = 5% more success.',
  'Don\'t multiclass before L5.',
  'Use BA and reaction every round.',
  'Healing Word > Cure Wounds. Always.',
  'Negotiate before fighting.',
  'Take notes. You will forget.',
  'Read your class features.',
  'Short rests are free. Push for them.',
];
