/**
 * playerMountedCombatRulesGuide.js
 * Player Mode: Mounted combat rules and optimization
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_BASICS = {
  mounting: 'Mount/dismount costs half your movement speed. Mount must be at least one size larger.',
  controlledMount: 'You control it. It acts on your initiative. Can only Dash, Disengage, or Dodge. No attacks.',
  independentMount: 'It acts on its own initiative. Can attack. But DM controls it.',
  note: 'Controlled mounts are more predictable. Independent mounts are more powerful but unpredictable.',
};

export const CONTROLLED_VS_INDEPENDENT = {
  controlled: {
    actions: 'Dash, Disengage, Dodge only. No attacks.',
    initiative: 'Acts on your turn.',
    bestFor: 'Reliable movement. Disengage for free.',
  },
  independent: {
    actions: 'Full actions including attacks.',
    initiative: 'Has its own initiative.',
    bestFor: 'Summon spells (Find Steed). Extra attacks.',
  },
};

export const MOUNTED_COMBATANT_FEAT = {
  benefits: [
    { benefit: 'Advantage on melee attacks vs unmounted creatures smaller than mount.', note: 'Most enemies are Medium. Your mount is Large. Free advantage.' },
    { benefit: 'Force attacks targeting mount to target you instead.', note: 'Protect your mount.' },
    { benefit: 'Mount: Evasion on DEX saves.', note: 'Fireball does 0 or half to mount.' },
  ],
};

export const MOUNT_OPTIONS = [
  { mount: 'Warhorse', cost: '400gp', speed: 60, hp: 19, note: 'Standard combat mount.' },
  { mount: 'Find Steed (L2)', cost: 'Spell slot', speed: 60, note: 'Magical mount. Shared buffs. Best option.' },
  { mount: 'Find Greater Steed (L4)', cost: 'Spell slot', speed: '60-90', note: 'Flying mount (Pegasus/Griffon). Incredible.' },
  { mount: 'Phantom Steed (L3 ritual)', cost: 'Free', speed: 100, note: '100ft speed! 1 hour. Ritual = free. Fragile (1 HP).' },
];

export const FIND_STEED_SHARED_SPELLS = [
  { spell: 'Haste', effect: 'Both get Haste. Mount: 120ft speed + Dash = 240ft.', rating: 'S' },
  { spell: 'Death Ward', effect: 'Both protected from death.', rating: 'A' },
  { spell: 'Shield of Faith', effect: 'Both +2 AC.', rating: 'A' },
];

export const MOUNTED_TACTICS = [
  { tactic: 'Lance + shield', detail: 'Lance: 1d12, reach, one-handed while mounted. +shield. Best mounted weapon.', rating: 'S' },
  { tactic: 'Controlled Disengage', detail: 'Mount Disengages. You attack. Ride away. Free hit-and-run.', rating: 'S' },
  { tactic: 'Mounted Combatant + GWM', detail: 'Advantage on attacks (feat) + GWM -5/+10. Free advantage offsets GWM penalty.', rating: 'S' },
  { tactic: 'Flying mount dominance', detail: 'Find Greater Steed: Pegasus 90ft fly. Fly + lance + advantage. Aerial melee.', rating: 'S' },
];

export function mountedSpeedWithDash(mountSpeed) {
  return { normal: mountSpeed, withDash: mountSpeed * 2 };
}
