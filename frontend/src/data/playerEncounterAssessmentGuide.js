/**
 * playerEncounterAssessmentGuide.js
 * Player Mode: Assessing encounter difficulty — when to fight, flee, or negotiate
 * Pure JS — no React dependencies.
 */

export const DIFFICULTY_TIERS = [
  { tier: 'Easy', signs: ['Enemies are lower CR than party level.', 'Few enemies vs full party.', 'No legendary actions.', 'No spellcasters.'], advice: 'Conserve resources. Don\'t burn big spells.' },
  { tier: 'Medium', signs: ['Enemies match party level.', 'Equal numbers.', 'Some special abilities.', 'One or two dangerous enemies.'], advice: 'Normal tactics. Use core abilities freely.' },
  { tier: 'Hard', signs: ['Enemies outnumber party.', 'Higher CR than party level.', 'Multiple special abilities.', 'Environmental hazards.'], advice: 'Full resources. Coordinate focus fire. Use your best spells.' },
  { tier: 'Deadly', signs: ['Enemies greatly outnumber party.', 'Much higher CR.', 'Legendary actions + lair actions.', 'Multiple casters.'], advice: 'Nova round. All resources. Consider fleeing if going badly.' },
  { tier: 'Run', signs: ['DM describes overwhelming force.', 'Enemies don\'t attack immediately (showing off power).', 'You\'re vastly outmatched.', 'NPC allies warn you.'], advice: 'FLEE. Negotiate. Come back later. This fight is not meant to be won now.' },
];

export const WARNING_SIGNS = [
  { sign: 'DM asks "Are you sure?"', meaning: 'This is probably deadly. The DM is warning you.', action: 'Reconsider. Ask questions. Prepare.' },
  { sign: 'Multiple legendary actions', meaning: 'Boss monster. Designed for full party at full resources.', action: 'Nova round 1. Burn legendary resistances fast.' },
  { sign: 'Lair actions mentioned', meaning: 'You\'re in the boss\'s territory. Extra actions each round.', action: 'Lure the boss out if possible. Or prepare for extra hazards.' },
  { sign: 'Enemies have formation/tactics', meaning: 'Intelligent enemies. They have a plan.', action: 'Disrupt their formation. Control the battlefield.' },
  { sign: 'Environmental hazards', meaning: 'The terrain is dangerous too.', action: 'Use the terrain yourself. Control movement.' },
  { sign: 'Reinforcements arriving', meaning: 'Fight gets harder over time.', action: 'End it fast or retreat. Don\'t let them surround you.' },
  { sign: 'Party is already hurt/spent', meaning: 'You\'re fighting below full strength.', action: 'Short rest first. Or avoid the fight entirely.' },
];

export const FIGHT_OR_FLEE_CHECKLIST = [
  { question: 'Are we at full HP and resources?', flee: 'No — we\'re spent.', fight: 'Yes — we\'re fresh.' },
  { question: 'Do we outnumber them?', flee: 'We\'re outnumbered 2:1+.', fight: 'Even or we outnumber them.' },
  { question: 'Do we have an escape route?', flee: 'Yes — we can always come back.', fight: 'No — we\'re trapped. Must fight.' },
  { question: 'Is there a quest reason to fight?', flee: 'No — this is optional.', fight: 'Yes — we need to get past them.' },
  { question: 'Can we negotiate?', flee: 'Maybe — try talking first.', fight: 'No — they\'re hostile/mindless.' },
  { question: 'Do we know their abilities?', flee: 'No — unknown threats are dangerous.', fight: 'Yes — we can plan around them.' },
];

export const RESOURCE_ASSESSMENT = {
  full: { slots: '75-100%', hp: '75-100%', features: 'Most available', readiness: 'Can handle Hard encounters.' },
  moderate: { slots: '50-75%', hp: '50-75%', features: 'Some used', readiness: 'Can handle Medium. Avoid Hard.' },
  low: { slots: '25-50%', hp: '25-50%', features: 'Most used', readiness: 'Easy fights only. Short rest needed.' },
  critical: { slots: '<25%', hp: '<25%', features: 'Depleted', readiness: 'Avoid combat. Long rest required.' },
};

export const RETREAT_TACTICS = [
  { method: 'Dash Action', detail: 'Double movement. Everyone runs on the same turn.', note: 'Enemies get opportunity attacks. Accept it.' },
  { method: 'Fog Cloud / Darkness', detail: 'Block line of sight. Enemies can\'t target you.', note: 'Break line of sight then Dash next turn.' },
  { method: 'Hypnotic Pattern', detail: 'Incapacitate multiple enemies. Run while they\'re stunned.', note: 'Best retreat spell. Covers your escape.' },
  { method: 'Wall Spells', detail: 'Wall of Force/Fire between you and enemies.', note: 'Block pursuit entirely. Run the other way.' },
  { method: 'Teleportation', detail: 'Misty Step, Dimension Door, Teleport.', note: 'Most reliable escape. Use if available.' },
  { method: 'Caltrops / Ball Bearings', detail: 'Drop behind you. Slows pursuit.', note: 'Cheap and effective. Carry some.' },
  { method: 'Hold the Door', detail: 'One character blocks a chokepoint while others flee.', note: 'Paladin/Fighter with Shield + high AC.' },
];

export const ENCOUNTER_ASSESSMENT_TIPS = [
  '"Are you sure?" from the DM = this is probably deadly.',
  'Legendary actions = boss fight. Use everything you have.',
  'Check party resources before every fight. Are you ready?',
  'Running away is a valid tactic. Dead heroes save nobody.',
  'Outnumbered? Control spells first (Hypnotic Pattern).',
  'Unknown enemies = knowledge check. Learn before fighting.',
  'Environmental hazards are effectively extra enemies.',
  'If you can rest before the fight, always rest.',
  'Negotiate first when possible. Combat is the last resort.',
  'Retreat spells: Fog Cloud, Hypnotic Pattern, Wall of Force.',
];
