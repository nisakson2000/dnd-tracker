/**
 * playerExpensiveMaterials.js
 * Player Mode: Expensive spell components and shopping priorities
 * Pure JS — no React dependencies.
 */

export const CONSUMED_COMPONENTS = [
  { spell: 'Revivify', level: 3, cost: '300 gp diamond', consumed: true },
  { spell: 'Raise Dead', level: 5, cost: '500 gp diamond', consumed: true },
  { spell: 'Resurrection', level: 7, cost: '1,000 gp diamond', consumed: true },
  { spell: 'True Resurrection', level: 9, cost: '25,000 gp diamond', consumed: true },
  { spell: 'Greater Restoration', level: 5, cost: '100 gp diamond dust', consumed: true },
  { spell: 'Heroes\' Feast', level: 6, cost: '1,000 gp bowl', consumed: true },
  { spell: 'Stoneskin', level: 4, cost: '100 gp diamond dust', consumed: true },
  { spell: 'Clone', level: 8, cost: '3,000 gp total', consumed: true },
  { spell: 'Simulacrum', level: 7, cost: '1,500 gp ruby dust', consumed: true },
  { spell: 'Find Familiar', level: 1, cost: '10 gp', consumed: true },
  { spell: 'Continual Flame', level: 2, cost: '50 gp ruby dust', consumed: true },
];

export const REUSABLE_COMPONENTS = [
  { spell: 'Chromatic Orb', cost: '50 gp diamond', note: 'Buy once, cast forever.' },
  { spell: 'Identify', cost: '100 gp pearl', note: 'One-time purchase.' },
  { spell: 'Plane Shift', cost: '250 gp tuning fork (per plane)', note: 'Collect for each destination.' },
  { spell: 'Forcecage', cost: '1,500 gp ruby dust', note: 'Not consumed.' },
];

export const SHOPPING_PRIORITY = [
  { item: '300 gp diamond', for: 'Revivify', when: 'ASAP' },
  { item: '100 gp pearl', for: 'Identify', when: 'Level 1-2' },
  { item: '100 gp diamond dust', for: 'Greater Restoration', when: 'Level 9+' },
  { item: '500 gp diamond', for: 'Raise Dead', when: 'Level 9+' },
  { item: '1,000 gp bowl', for: 'Heroes\' Feast', when: 'Level 11+' },
];

export function canAfford(gold, spell) {
  const costs = { 'Revivify': 300, 'Raise Dead': 500, 'Greater Restoration': 100, 'Heroes\' Feast': 1000, 'Clone': 3000 };
  return gold >= (costs[spell] || 0);
}
