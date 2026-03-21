/**
 * playerPeaceClericGuide.js
 * Player Mode: Peace Cleric — the best 1-level dip and party buffer
 * Pure JS — no React dependencies.
 */

export const PEACE_CLERIC_BASICS = {
  class: 'Cleric (Peace Domain)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Unity and bonds between allies. Party synergy amplifier.',
  armorProf: 'Heavy armor.',
  note: 'Even a 1-level dip into Peace Cleric is considered one of the strongest multiclass options.',
};

export const PEACE_FEATURES = [
  { feature: 'Emboldening Bond', level: 1, effect: 'PB creatures. 10 minutes. When bonded creature makes attack/check/save, add 1d4. Bond distance: 30ft from each other.', note: 'This is permanent Bless that doesn\'t require concentration, doesn\'t cost a spell slot, and lasts 10 minutes.' },
  { feature: 'Channel Divinity: Balm of Peace', level: 2, effect: 'Move up to your speed without OAs. Heal 2d6+WIS to each creature you pass within 5ft.', note: 'Mobile mass heal. Move through the party healing everyone.' },
  { feature: 'Protective Bond', level: 6, effect: 'When a bonded creature takes damage, another bonded creature within 30ft can teleport to within 5ft and take the damage instead (resistance).', note: 'Teleport + damage sharing with resistance. Incredible defense.' },
  { feature: 'Potent Spellcasting', level: 8, effect: 'Add WIS to cantrip damage.', note: 'Standard Cleric damage boost.' },
  { feature: 'Expansive Bond', level: 17, effect: 'Bond range increases to 60ft. Protective Bond: teleporting creature gains resistance to ALL damage until start of next turn.', note: 'Full resistance + teleport on any damage trigger.' },
];

export const EMBOLDENING_BOND_POWER = {
  comparison: {
    bless: { effect: '+1d4 to attacks/saves', cost: '1st level slot', concentration: 'Yes', targets: 3, duration: '1 minute' },
    bond: { effect: '+1d4 to attacks/saves/checks', cost: 'Free (class feature)', concentration: 'No', targets: 'PB creatures', duration: '10 minutes' },
  },
  verdict: 'Emboldening Bond is Bless but: free, no concentration, longer duration, applies to checks too, and scales with PB.',
  withBless: 'Cast Bless too. Both stack. +2d4 to attacks and saves. Average +5 bonus.',
  math: 'At level 5 (PB 3): Bond 3 creatures + Bless 3 (same ones) = +2d4 = avg +5 to attacks/saves. For 1 spell slot.',
};

export const PEACE_CLERIC_DIP = {
  cost: '1 level',
  gains: [
    'Emboldening Bond: +1d4 to party attacks/checks/saves. No concentration. Free.',
    'Heavy armor proficiency.',
    'Bless spell (stack with Bond = +2d4).',
    'Guidance cantrip.',
    'Healing Word.',
  ],
  bestFor: 'Literally any class. The 1-level dip is always strong.',
  builds: [
    { base: 'Sorcerer X / Peace 1', benefit: 'Bond + Bless + Twinned Haste. Party-wide +1d4 and two Hasted allies.' },
    { base: 'Wizard X / Peace 1', benefit: 'Heavy armor + Bond + Bless. Tanky Wizard who buffs the party.' },
    { base: 'Bard X / Peace 1', benefit: 'Bardic Inspiration + Emboldening Bond + Bless. +1d4+1d6+1d4 on critical rolls.' },
    { base: 'Druid X / Peace 1', benefit: 'Heavy armor (metal restriction?) + Bond. Check with DM on metal.' },
  ],
};

export const PEACE_CLERIC_TACTICS = [
  { tactic: 'Bond + Bless turn 1', detail: 'Bond is pre-cast (10 min). Turn 1: Bless 3 allies. Now party has +2d4 to attacks/saves.', rating: 'S' },
  { tactic: 'Balm of Peace mass heal', detail: 'Move 30ft through party. Heal 2d6+5 to every ally you pass. Emergency AoE heal.', rating: 'A' },
  { tactic: 'Protective Bond + Paladin', detail: 'Paladin takes hit for squishy Wizard. Teleports there. Takes half damage. Paladin can handle it.', rating: 'A' },
  { tactic: 'Bond on Rogues/casters', detail: '+1d4 to save DCs effectively. Rogue gets +1d4 to Stealth checks. Casters get +1d4 to concentration saves.', rating: 'A' },
];

export function bondDamageIncrease(attacks, avgD4) {
  // +1d4 avg to hit ≈ +12.5% hit chance ≈ +12.5% DPR
  return attacks * avgD4 * 0.05 * 10; // rough DPR increase estimate
}

export function blessPlusBondAvg() {
  return 2.5 + 2.5; // avg d4 + avg d4 = +5
}
