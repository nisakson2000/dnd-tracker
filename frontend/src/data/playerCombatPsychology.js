/**
 * playerCombatPsychology.js
 * Player Mode: Combat psychology and player mindset optimization
 * Pure JS — no React dependencies.
 */

export const COMBAT_MINDSETS = [
  { mindset: 'Aggressor', description: 'Prioritize damage and eliminating threats quickly.', when: 'When you have the initiative advantage or action economy lead.', risk: 'Overextending. Taking unnecessary damage.' },
  { mindset: 'Defender', description: 'Focus on protecting allies and controlling space.', when: 'When enemies have superior numbers or firepower.', risk: 'Being too passive. Letting enemies dictate the fight.' },
  { mindset: 'Controller', description: 'Deny enemies options. Restrict movement and actions.', when: 'When you have control spells and enemies cluster.', risk: 'Wasting slots on saves that enemies pass easily.' },
  { mindset: 'Opportunist', description: 'Wait for openings. React to enemy mistakes.', when: 'When the situation is unclear. Let enemies overcommit.', risk: 'Analysis paralysis. Waiting too long to act.' },
  { mindset: 'Survivor', description: 'Minimize risk. Stay alive above all else.', when: 'When retreat is impossible and resources are low.', risk: 'Not contributing enough to actually win the fight.' },
];

export const DECISION_PARALYSIS_FIXES = [
  { problem: 'Too many options', fix: 'Ask yourself: "What is the ONE thing that would hurt the enemy most right now?" Do that.' },
  { problem: 'Fear of wasting resources', fix: 'An unused spell slot at the end of the day is a wasted spell slot. Use your abilities.' },
  { problem: 'Not sure what enemies are', fix: 'Attack first, figure out details later. Damage reveals resistances. Action reveals abilities.' },
  { problem: 'Don\'t know optimal play', fix: 'The "right" play is any play that moves the fight forward. Perfect is the enemy of good.' },
  { problem: 'Worried about making mistakes', fix: 'Everyone makes suboptimal plays. The game is forgiving. Your party will cover for you.' },
];

export const TILT_PREVENTION = [
  'Bad dice happen. A nat 1 doesn\'t mean you\'re cursed. Statistics will even out.',
  'If your turn went badly, focus on what you CAN do, not what you failed to do.',
  'Remember: the DM isn\'t your enemy. They want you to have fun too.',
  'If combat feels hopeless, communicate with the party. Solutions exist.',
  'Failure is part of the story. Some of the best D&D moments come from things going wrong.',
  'Take a deep breath between turns. You have time to think during others\' turns.',
  'Focus on what worked, not what didn\'t. "Nice Sneak Attack!" not "I can\'t believe I missed."',
];

export const PARTY_PSYCHOLOGY = [
  { tip: 'Celebrate allies\' successes', effect: 'Builds team morale. Makes everyone play better.' },
  { tip: 'Don\'t criticize others\' choices in the moment', effect: 'Debrief AFTER combat, not during. Combat criticism creates resentment.' },
  { tip: 'Offer suggestions, not orders', effect: '"Maybe try the caster?" is better than "You NEED to hit the caster."' },
  { tip: 'Let everyone have their moment', effect: 'Don\'t hog the spotlight. The Barbarian\'s crit moment matters as much as your Fireball.' },
  { tip: 'Accept that not every fight is winnable', effect: 'Retreating is a valid strategy. Live to fight another day.' },
];

export function getMindset(situation) {
  return COMBAT_MINDSETS.find(m =>
    m.mindset.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}

export function getRandomTiltFix() {
  return TILT_PREVENTION[Math.floor(Math.random() * TILT_PREVENTION.length)];
}
