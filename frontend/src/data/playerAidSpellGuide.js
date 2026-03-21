/**
 * playerAidSpellGuide.js
 * Player Mode: Aid — permanent max HP boost
 * Pure JS — no React dependencies.
 */

export const AID_BASICS = {
  spell: 'Aid',
  level: 2,
  school: 'Abjuration',
  castTime: '1 action',
  range: '30 feet',
  duration: '8 hours',
  targets: 'Up to 3 creatures',
  classes: ['Cleric', 'Paladin', 'Artificer', 'Ranger'],
  effect: 'Each target\'s max HP AND current HP increase by 5. Lasts 8 hours. No concentration.',
  note: 'Not temp HP — actual max HP increase. Stacks with temp HP. No concentration. Incredible value.',
};

export const AID_SCALING = [
  { slot: 2, hpBoost: 5, total3Targets: 15, note: 'L2 slot: +5 HP to 3 allies. 15 total HP for the party.' },
  { slot: 3, hpBoost: 10, total3Targets: 30, note: 'L3: +10 HP each. Significant buffer.' },
  { slot: 4, hpBoost: 15, total3Targets: 45, note: 'L4: +15 HP each. Tank-level boost.' },
  { slot: 5, hpBoost: 20, total3Targets: 60, note: 'L5: +20 HP each. Massive survivability.' },
  { slot: 6, hpBoost: 25, total3Targets: 75, note: 'L6+: continues scaling. Worth upcasting.' },
  { slot: 9, hpBoost: 40, total3Targets: 120, note: 'L9: +40 HP each. 120 HP for the party.' },
];

export const AID_KEY_INTERACTIONS = [
  { interaction: 'Max HP increase', detail: 'This is MAX HP, not temp HP. Stacks with temp HP. Healing can heal up to the new max.' },
  { interaction: 'Revives at 0 HP', detail: 'Aid increases current HP. If an ally is at 0 HP, Aid raises them to 5+ HP. Instant revive.' },
  { interaction: 'No concentration', detail: 'Cast before combat. Lasts 8 hours. Free up concentration for combat spells.' },
  { interaction: 'Cast before long rest', detail: 'Cast Aid at end of LR. Lasts 8 hours into the adventuring day. Efficient use of yesterday\'s slots... wait, you already rested. Cast at start of day.' },
  { interaction: 'Multiple casts don\'t stack', detail: 'Same spell doesn\'t stack. But Aid + Heroism (temp HP) DO stack.' },
];

export const AID_TIPS = [
  'Cast Aid first thing in the morning after your long rest.',
  'At higher levels, upcast Aid. L5 Aid (+20 HP to 3 allies) is incredible for a single slot.',
  'Target the squishiest party members: Wizard, Sorcerer, Rogue.',
  'Aid can revive unconscious allies at 0 HP. Emergency ranged healing.',
  'Artificer Homunculus can deliver Aid (if using Spell-Storing Item). Free daily Aid.',
  'Aid + Inspiring Leader (temp HP) + Twilight Sanctuary = massive HP buffers.',
];

export const AID_VS_ALTERNATIVES = {
  vsHeroism: { aid: '8 hours, 3 targets, +5-40 max HP, no concentration', heroism: '1 min, 1 target, CHA mod temp HP/turn, concentration', verdict: 'Aid for pre-combat buffer. Heroism for in-combat temp HP generation.' },
  vsFalseLife: { aid: 'Max HP increase, 3 targets, L2', falseLife: 'Temp HP (1d4+4), self only, L1', verdict: 'Aid is vastly superior for party survivability.' },
};

export function aidHPBoost(slotLevel) {
  const boost = (slotLevel - 1) * 5;
  return { perTarget: boost, threeTargets: boost * 3, note: `L${slotLevel} Aid: +${boost} max HP to each of 3 targets (${boost * 3} total party HP)` };
}
