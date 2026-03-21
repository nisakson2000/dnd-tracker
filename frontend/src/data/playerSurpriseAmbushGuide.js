/**
 * playerSurpriseAmbushGuide.js
 * Player Mode: Surprise and ambush tactics for players
 * Pure JS — no React dependencies.
 */

export const SURPRISE_MECHANICS = {
  determination: 'Stealth checks vs enemy passive Perception. Per-creature, not per-side.',
  effect: 'Surprised: no actions or reactions on first turn.',
  ending: 'Ends at END of surprised creature\'s first turn.',
  notARound: 'No "surprise round" — normal initiative. Surprised creatures just can\'t act.',
};

export const AMBUSH_SETUP = [
  { method: 'Pass Without Trace', rating: 'S+', note: '+10 party Stealth. Even heavy armor sneaks.' },
  { method: 'Gloom Stalker + darkness', rating: 'S+', note: 'Invisible to Darkvision. Undetectable.' },
  { method: 'Invisibility (mass)', rating: 'S', note: 'Everyone invisible. Attack from concealment.' },
  { method: 'Terrain setup', rating: 'A+', note: 'Chokepoints, high ground, pre-placed AoE.' },
  { method: 'Social deception', rating: 'A+', note: 'Appear friendly, then strike. DM-dependent.' },
];

export const FIRST_ROUND_PRIORITIES = [
  'Assassin: auto-crit surprised + advantage = massive nova (S+)',
  'Gloom Stalker: Dread Ambusher extra attack + 1d8 (S)',
  'AoE control: Hypnotic Pattern / Web on grouped enemies (S)',
  'Focus fire: eliminate biggest threat before they act (S)',
  'Buff party: Bless/Haste during free round (A+)',
];

export const ANTI_SURPRISE = [
  'Alert feat: can\'t be surprised, +5 initiative.',
  'Alarm spell (ritual): ward rest areas.',
  'High passive Perception: Observant (+5), Sentinel Shield (adv).',
  'Familiar on watch: owl with Darkvision 120ft.',
  'Perimeter checks: investigate surroundings before resting.',
];
