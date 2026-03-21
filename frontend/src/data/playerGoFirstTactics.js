/**
 * playerGoFirstTactics.js
 * Player Mode: First turn strategies and alpha strike optimization
 * Pure JS — no React dependencies.
 */

export const FIRST_TURN_BY_ROLE = {
  controlCaster: {
    priority: 'AoE crowd control before enemies act.',
    bestSpells: ['Hypnotic Pattern (30ft cube, incapacitate)', 'Web (20ft cube, restrain)', 'Sleep (5d8 HP, no save)', 'Fear (30ft cone, drop weapons + flee)'],
    flow: 'Win initiative → AoE control → party cleans up on their turns.',
  },
  blaster: {
    priority: 'Maximum AoE damage while enemies are clustered.',
    bestSpells: ['Fireball (20ft sphere, 8d6)', 'Shatter (10ft sphere, 3d8)', 'Lightning Bolt (100ft line, 8d6)'],
    flow: 'Win initiative → nuke the cluster → switch to single target.',
  },
  martial: {
    priority: 'Kill the biggest threat before it acts.',
    bestActions: ['Action Surge (Fighter: double attacks)', 'Dread Ambusher (Gloom Stalker: +1 attack +1d8)', 'Reckless Attack (Barbarian: advantage on all)'],
    flow: 'Win initiative → charge highest priority target → burst it down.',
  },
  support: {
    priority: 'Buff party before combat starts.',
    bestActions: ['Bless (3 targets, +1d4 attacks/saves)', 'Spirit Guardians (self AoE, pre-position)', 'Faerie Fire (advantage for party)', 'Haste (double an ally\'s output)'],
    flow: 'Win initiative → buff → party acts with buffs active.',
  },
};

export const SURPRISE_ROUND_RULES = {
  rules: [
    'Surprise is NOT a round. It\'s a condition on individual creatures.',
    'Surprised creatures can\'t take actions or reactions until after their first turn.',
    'Initiative is rolled normally. Surprise just means some creatures skip their first turn.',
    'After a surprised creature\'s first turn ends, they are no longer surprised (can use reactions).',
  ],
  setup: [
    'Stealth vs Passive Perception. Group Stealth check: half the party must succeed.',
    'Pass Without Trace (+10) makes group stealth nearly guaranteed.',
    'Alert feat: can\'t be surprised. But CAN still act on the surprise round.',
  ],
};

export const ALPHA_STRIKE_BUILDS = [
  { build: 'Gloom Stalker 5 / Assassin 3 / Fighter 2', attacks: 6, detail: 'Surprise → auto-crit. Action Surge. 6 crits. Dread Ambusher +1d8. Sneak Attack.', damage: '~120+ damage turn 1' },
  { build: 'Paladin 5 (any)', attacks: 2, detail: 'Extra Attack. Smite both hits. 2nd level slots = 3d8 per smite. +weapon damage.', damage: '~50-60 damage turn 1' },
  { build: 'Fighter 11 / War Wizard 2', attacks: 6, detail: 'Action Surge = 6 attacks. +INT initiative. Shield/Absorb Elements defense.', damage: '~70+ damage turn 1' },
  { build: 'Sorcerer (any) L5', attacks: 0, detail: 'Quickened Fireball + regular Fireball = 16d6 in one turn. 56 avg to AoE.', damage: '~56 per target' },
];

export function surpriseDamage(normalDPR, isSurprise, isAssassin) {
  if (!isSurprise) return normalDPR;
  if (isAssassin) return normalDPR * 2; // Auto-crit doubles dice
  return normalDPR; // Surprised enemies just don't act, your damage is normal
}

export function firstTurnBurstDPR(attacks, dmgPerHit, extraDice) {
  return attacks * dmgPerHit + (extraDice || 0) * 3.5;
}
