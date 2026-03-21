/**
 * playerSentinelFeatGuide.js
 * Player Mode: Sentinel feat — the melee controller
 * Pure JS — no React dependencies.
 */

export const SENTINEL_BASICS = {
  feat: 'Sentinel',
  source: 'Player\'s Handbook',
  benefit1: 'When you hit with an OA, target\'s speed becomes 0 for the rest of the turn.',
  benefit2: 'Creatures provoke OAs from you even if they Disengage.',
  benefit3: 'When a creature within 5ft attacks a target other than you: reaction to make a melee attack against it.',
  note: 'The ultimate melee control feat. Lock enemies in place. Punish them for attacking your allies. Disengage doesn\'t help them.',
};

export const SENTINEL_TACTICS = [
  { tactic: 'Lockdown enemies', detail: 'Hit with OA → speed = 0. They can\'t reach your backline. They\'re stuck next to you.', rating: 'S' },
  { tactic: 'Sentinel + PAM', detail: 'Enemy enters 10ft reach → PAM OA → Sentinel speed = 0. Enemy is stuck 10ft away. Can\'t close to melee.', rating: 'S' },
  { tactic: 'Protect allies', detail: 'Enemy attacks your Wizard → reaction attack against that enemy. Free attack for protecting allies.', rating: 'S' },
  { tactic: 'Anti-Disengage', detail: 'Rogues, Monks, and other Disengagers still provoke OAs from you. No one escapes a Sentinel.', rating: 'A' },
  { tactic: 'Sentinel + Tunnel Fighter (if allowed)', detail: 'UA Fighting Style: OA on any creature entering reach. Combined with Sentinel = speed 0 on all approaching enemies.', rating: 'Banned at most tables' },
];

export const SENTINEL_CLASS_PRIORITY = [
  { class: 'Fighter', priority: 'S', reason: 'PAM + Sentinel. Multiple OAs. Tank/control build.' },
  { class: 'Paladin', priority: 'S', reason: 'Protect allies (benefit 3) while smiting on OAs.' },
  { class: 'Barbarian', priority: 'A', reason: 'Tanky enough to stay in melee. Speed = 0 keeps enemies on the raging Barbarian.' },
  { class: 'Monk', priority: 'B', reason: 'Monks want to be mobile, not stationary. Conflicts with Monk playstyle.' },
  { class: 'Rogue', priority: 'B', reason: 'Extra reaction attack = extra Sneak Attack opportunity (different turn). Niche but functional.' },
];

export function sentinelValue(enemiesEngaged) {
  return { oaPerRound: Math.min(1, enemiesEngaged), allyProtectionAttacks: enemiesEngaged - 1, note: `With ${enemiesEngaged} enemies engaged: up to 1 OA + ${Math.max(0, enemiesEngaged - 1)} ally protection attacks` };
}
