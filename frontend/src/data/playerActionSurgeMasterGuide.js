/**
 * playerActionSurgeMasterGuide.js
 * Player Mode: Action Surge — best uses for an extra action
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE_BASICS = {
  feature: 'Action Surge',
  class: 'Fighter',
  level: 2,
  uses: '1/SR (2/SR at L17)',
  effect: 'Take one additional action on your turn.',
  note: 'THE best 2-level dip. Entire extra action once per short rest.',
};

export const ACTION_SURGE_USES = [
  { use: 'Double attacks', detail: 'Attack + Attack (AS). L20 Fighter: 8 attacks.', rating: 'S' },
  { use: 'Two leveled spells', detail: 'Fireball (action) + Fireball (AS). BA rule only restricts BA.', rating: 'S+' },
  { use: 'Alpha strike', detail: 'Round 1: GWM × 8 attacks = boss deleted.', rating: 'S' },
  { use: 'Dash + Attack', detail: 'Close distance AND attack in one turn.', rating: 'A' },
  { use: 'Grapple + Shove + Attack', detail: 'Full lockdown combo in one turn.', rating: 'A+' },
];

export const ACTION_SURGE_MULTICLASS = [
  { class: 'Wizard', why: 'Two leveled spells per turn. Wall of Force + Sickening Radiance.', rating: 'S+' },
  { class: 'Sorcerer', why: 'Quickened + AS + regular = three spells in one turn.', rating: 'S' },
  { class: 'Paladin', why: 'More attacks = more smite crits.', rating: 'A+' },
];

export const GLOOM_STALKER_AS = {
  combo: 'Gloom Stalker 5 / Fighter 2',
  round1: '3 attacks (EA + DA) + 3 AS attacks + CBE BA = 7 attacks.',
  withSS: '7 × (1d6+15) = ~122 DPR round 1.',
  rating: 'S+',
};
