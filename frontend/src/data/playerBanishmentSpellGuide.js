/**
 * playerBanishmentSpellGuide.js
 * Player Mode: Banishment — remove threats from combat
 * Pure JS — no React dependencies.
 */

export const BANISHMENT_BASICS = {
  spell: 'Banishment',
  level: 4,
  school: 'Abjuration',
  castTime: '1 action',
  range: '60 feet',
  duration: '1 minute (concentration)',
  save: 'CHA save',
  classes: ['Wizard', 'Sorcerer', 'Cleric', 'Paladin', 'Warlock'],
  effects: [
    'Native to current plane: banished to demiplane for duration. Returns when spell ends.',
    'NOT native: banished to home plane. Permanent if held 1 minute.',
    'Incapacitated while banished.',
  ],
  note: 'CHA save = weakest save for most monsters. Permanently banishes extraplanar creatures.',
};

export const BANISHMENT_STRATEGY = {
  bestTargets: [
    'Fiends: permanent banishment to home plane if held 1 minute.',
    'Celestials/Elementals: same — sent home permanently.',
    'BBEG: remove for 1 minute. Fight minions first.',
    'Summoned creatures: sent home permanently.',
  ],
  poorTargets: [
    'Native creatures: only temporary removal.',
    'High CHA saves: Bards, Sorcerers, Paladins.',
    'Legendary Resistance: auto-succeed. Waste of L4 slot.',
  ],
};

export const BANISHMENT_TACTICS = [
  { tactic: 'Remove biggest threat', detail: 'Banish dragon/demon. Fight minions. Boss returns to full party.', rating: 'S' },
  { tactic: 'Permanent banishment', detail: 'Extraplanar + hold concentration 1 min = gone forever.', rating: 'S' },
  { tactic: 'Upcast multi-target', detail: 'L5: 2 targets. L6: 3. L7: 4.', rating: 'A' },
  { tactic: 'Twin Banishment (Sorcerer)', detail: '4 SP + L4 slot = 2 targets banished.', rating: 'S' },
];

export const CONCENTRATION_PROTECTION = [
  'War Caster: advantage on concentration saves.',
  'Resilient (CON): proficiency on CON saves.',
  'Stay far from enemies. Don\'t get hit.',
  'Ally Warding Bond: half damage = lower DC.',
];

export function banishmentTargets(slotLevel) {
  const targets = Math.max(1, slotLevel - 3);
  return { targets, note: `Banishment at slot ${slotLevel}: ${targets} target(s).` };
}
