/**
 * playerBanditEncounters.js
 * Player Mode: Handling bandit/humanoid enemy encounters
 * Pure JS — no React dependencies.
 */

export const HUMANOID_ENEMY_TYPES = [
  { type: 'Bandit', cr: '1/8', hp: 11, tactic: 'Numbers advantage. Surround and attack. Flee when losing.', counter: 'AoE spells. Intimidation. Kill the leader first.' },
  { type: 'Bandit Captain', cr: 2, hp: 65, tactic: 'Commands bandits. Multiattack. Parry (reaction +2 AC).', counter: 'Focus fire the captain. Bandits may flee or surrender when captain falls.' },
  { type: 'Thug', cr: '1/2', hp: 32, tactic: 'Pack Tactics (advantage when ally nearby). Brute force.', counter: 'Separate them. Without allies nearby, they lose Pack Tactics.' },
  { type: 'Cultist', cr: '1/8', hp: 9, tactic: 'Dark Devotion (advantage on saves vs charmed/frightened). Fanatical.', counter: 'Won\'t surrender easily. AoE. They\'re squishy.' },
  { type: 'Cult Fanatic', cr: 2, hp: 33, tactic: 'Spellcasting (Hold Person, Inflict Wounds). Commands cultists.', counter: 'Kill first (they cast debilitating spells). Counterspell Hold Person.' },
  { type: 'Assassin', cr: 8, hp: 78, tactic: 'Surprise = auto-crit + 7d6 poison. Poison weapons.', counter: 'Don\'t be surprised. High passive Perception. Poison resistance.' },
  { type: 'Mage', cr: 6, hp: 40, tactic: 'Fireball, Counterspell, Shield, Misty Step.', counter: 'Focus fire (40 HP is fragile). Counterspell their Counterspell.' },
  { type: 'Knight', cr: 3, hp: 52, tactic: 'Leadership (add d4 to ally attacks). High AC (18). Multiattack.', counter: 'Kill knight to stop Leadership aura. Saves-based attacks bypass AC.' },
  { type: 'Veteran', cr: 3, hp: 58, tactic: 'Multiattack (3 attacks). Solid fighter.', counter: 'Straightforward combat. Control spells work well.' },
];

export const HUMANOID_ADVANTAGES = [
  'Humanoids can surrender and be interrogated.',
  'Humanoids can be charmed and manipulated (Charm Person).',
  'Humanoids wear armor and use weapons — can be looted.',
  'Humanoids have social motivations — offer gold, threaten, negotiate.',
  'Humanoids can be detected with Detect Thoughts.',
  'Sleep spell is devastating against low-HP humanoids.',
];

export const HUMANOID_DISADVANTAGES = [
  'Humanoids in groups have good action economy.',
  'Humanoid leaders often have abilities that buff nearby allies.',
  'Enemy spellcasters are unpredictable and dangerous.',
  'Assassins can deal 40+ damage on surprise rounds.',
  'Humanoid enemies may have traps, ambushes, and tactical awareness.',
];

export const ANTI_HUMANOID_SPELLS = [
  { spell: 'Sleep (1st)', effect: 'Puts low-HP targets to sleep. No save.', best: 'Hordes of bandits/cultists.' },
  { spell: 'Charm Person (1st)', effect: 'Charmed = friendly. Advantage on CHA checks.', best: 'Social encounters. Take a prisoner.' },
  { spell: 'Hold Person (2nd)', effect: 'Paralyzed (humanoids only). Auto-crit from melee.', best: 'Boss humanoids. Devastating with Smite/SA.' },
  { spell: 'Hypnotic Pattern (3rd)', effect: 'Incapacitated. Ends fight for affected targets.', best: 'Large groups. 30ft cube.' },
  { spell: 'Fear (3rd)', effect: 'Frightened + must Dash away.', best: 'Scatter humanoid groups.' },
  { spell: 'Dominate Person (5th)', effect: 'Control a humanoid. WIS save.', best: 'Turn the enemy leader against their own forces.' },
];

export function sleepHP(slotLevel) {
  return (4 + slotLevel) * 4.5 + 5.5; // base 5d8, +2d8 per upcast
}

export function banditLootGP(cr) {
  const loot = { 0.125: '1d6', 0.5: '2d6', 1: '3d6', 2: '5d6', 3: '8d6' };
  return loot[cr] || '1d6';
}
