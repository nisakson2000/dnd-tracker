/**
 * playerWallSpellControlGuide.js
 * Player Mode: Wall spells — battlefield control, separation, and combo tactics
 * Pure JS — no React dependencies.
 */

export const WALL_RANKINGS = [
  { spell: 'Wall of Force (L5)', rating: 'S+', duration: '10 min (conc)', note: 'Indestructible. No save. Dome or panels. Nothing passes.' },
  { spell: 'Forcecage (L7)', rating: 'S+', duration: '1 hour (NO conc)', note: 'No save to trap. CHA to teleport out. No concentration.' },
  { spell: 'Wall of Fire (L4)', rating: 'S', duration: '1 min (conc)', damage: '5d8 fire (one side)', note: 'Damage wall. Position hot side toward enemies.' },
  { spell: 'Wall of Stone (L5)', rating: 'A+', duration: '10 min → permanent', note: 'Becomes PERMANENT if maintained. Build structures.' },
  { spell: 'Wall of Ice (L6)', rating: 'A+', duration: '10 min (conc)', damage: '10d6 cold on creation', note: 'Damage on creation + barrier. Panels have 30 HP.' },
  { spell: 'Blade Barrier (L6)', rating: 'A', duration: '10 min (conc)', damage: '6d10 slashing', note: 'Massive damage to pass through. Cleric spell.' },
  { spell: 'Wind Wall (L3)', rating: 'A', duration: '1 min (conc)', note: 'Blocks projectiles, gases, fog. Arrow shield.' },
  { spell: 'Wall of Thorns (L6)', rating: 'A', duration: '10 min (conc)', damage: '7d8 piercing', note: '5ft thick. Heavy damage to pass.' },
  { spell: 'Wall of Sand (L3)', rating: 'B+', duration: '10 min (conc)', note: 'Blocks line of sight. Difficult terrain.' },
  { spell: 'Wall of Water (L3)', rating: 'B', duration: '10 min (conc)', note: 'Disadvantage on ranged through. Halves fire.' },
];

export const WALL_TACTICS = [
  { tactic: 'Dome Trap', how: 'Wall of Force dome over enemies. Handle adds while boss is stuck.' },
  { tactic: 'Split Battlefield', how: 'Wall between enemy groups. Fight half at a time.' },
  { tactic: 'Fire Funnel', how: 'Wall of Fire across corridor. 5d8 to pass through.' },
  { tactic: 'Block Retreat', how: 'Wall behind fleeing enemies. Cut off escape.' },
  { tactic: 'Spike Growth + Wall', how: 'Funnel enemies through damaging terrain.' },
  { tactic: 'Permanent Fort', how: 'Wall of Stone maintained 10 min = permanent structure.' },
  { tactic: 'Boss Isolation', how: 'Wall between boss and minions. Fight adds first.' },
];

export const WALL_TIPS = [
  'Wall of Force: indestructible. No save. Best wall spell.',
  'Forcecage: no concentration. 1 hour. Best containment.',
  'Wall of Fire: 5d8 on one side. Face damage toward enemies.',
  'Wall of Stone: becomes PERMANENT after 10 minutes.',
  'Split the battlefield. Fight half the enemies at a time.',
  'Wind Wall blocks arrows. Great vs ranged enemies.',
  'Walls are selective by placement. Careful positioning.',
  'Combine walls with area damage (Spike Growth, Spirit Guardians).',
  'Wall of Force dome: isolate boss, handle adds.',
  'Dome trap the boss. 4v1 > 4v6. Action economy wins.',
];
