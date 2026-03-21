/**
 * playerHumanRaceGuide.js
 * Player Mode: Human — the versatile everyman
 * Pure JS — no React dependencies.
 */

export const HUMAN_BASICS = {
  race: 'Human',
  source: 'Player\'s Handbook',
  speed: '30ft',
  size: 'Medium',
  languages: 'Common + one extra',
  note: 'Two versions: Standard (+1 to all stats) and Variant (Custom Lineage +2/+1 + feat + skill). Variant Human is one of the strongest PHB races due to the L1 feat.',
};

export const HUMAN_STANDARD = {
  name: 'Standard Human',
  asis: '+1 to ALL six ability scores',
  traits: ['Extra language'],
  rating: 'C',
  note: 'Generally weak. +1 to everything is less valuable than +2 to your primary stat. No other features. Overshadowed by Variant Human and Custom Lineage.',
  bestFor: 'Point buy builds with lots of odd scores (13, 15) that benefit from multiple +1s.',
};

export const HUMAN_VARIANT = {
  name: 'Variant Human',
  asis: '+1 to two ability scores of your choice',
  traits: ['One feat of your choice', 'One skill proficiency of your choice'],
  rating: 'S',
  note: 'THE power race. A feat at L1 is game-changing. PAM, GWM, SS, Sentinel, Lucky — all at L1. Defines your character from the start. Most popular race in 5e optimization.',
};

export const VHUMAN_FEAT_PRIORITIES = {
  martial_melee: [
    { feat: 'Polearm Master', rating: 'S', reason: 'Bonus action attack + OA when entering reach. Defines melee combat from L1.' },
    { feat: 'Great Weapon Master', rating: 'S', reason: '-5/+10 damage from L1. Reckless Attack or advantage helps offset.' },
    { feat: 'Sentinel', rating: 'A', reason: 'Speed = 0 on OA hit. Lockdown tank from L1.' },
  ],
  martial_ranged: [
    { feat: 'Sharpshooter', rating: 'S', reason: '-5/+10 at range. Ignore cover. Best ranged feat.' },
    { feat: 'Crossbow Expert', rating: 'S', reason: 'Hand crossbow BA attack. No disadvantage in melee. Amazing DPR.' },
  ],
  caster: [
    { feat: 'War Caster', rating: 'S', reason: 'Advantage on concentration saves + somatic with hands full + OA spells.' },
    { feat: 'Resilient (CON)', rating: 'A', reason: 'CON save proficiency. Scales better than War Caster at high levels.' },
    { feat: 'Fey Touched', rating: 'A', reason: '+1 CHA/WIS/INT + Misty Step + L1 spell. Best half-feat for casters.' },
  ],
  universal: [
    { feat: 'Lucky', rating: 'S', reason: '3 luck points per LR. Reroll anything. Universally powerful.' },
    { feat: 'Alert', rating: 'A', reason: '+5 initiative. Can\'t be surprised. Go first = land your spell/attack first.' },
  ],
};

export const HUMAN_CLASS_SYNERGY = [
  { class: 'Fighter', priority: 'S', reason: 'V.Human: PAM or GWM at L1. Fighter gets most ASIs = more feats later. Incredible.', variant: true },
  { class: 'Paladin', priority: 'S', reason: 'V.Human: PAM or Sentinel at L1. CHA caster needs the early feat to offset MAD stats.', variant: true },
  { class: 'Ranger', priority: 'S', reason: 'V.Human: SS or CBE at L1. Ranger is feat-hungry. L1 feat is massive.', variant: true },
  { class: 'Wizard', priority: 'A', reason: 'V.Human: War Caster or Resilient CON at L1. Protect concentration from the start.', variant: true },
  { class: 'Any class', priority: 'A', reason: 'A feat at L1 is universally powerful. V.Human works with everything.', variant: true },
];

export const HUMAN_TACTICS = [
  { tactic: 'PAM Fighter L1', detail: 'V.Human Fighter: PAM at L1. Three attacks at L5 (two + BA). More attacks than any other build at this level.', rating: 'S' },
  { tactic: 'SS Ranger L1', detail: 'V.Human Ranger: Sharpshooter at L1. Archery style + SS = devastating ranged damage early.', rating: 'S' },
  { tactic: 'Lucky on anything', detail: 'V.Human with Lucky: 3 rerolls per day on any class. Save for important attacks, saves, or ability checks.', rating: 'S' },
  { tactic: 'Half-feat optimization', detail: 'V.Human: start 15 in primary, take half-feat (+1 stat + feat). Primary stat = 16 at L1 with a feat.', rating: 'A' },
];

export function variantHumanPointBuy(primaryStat, secondaryStat) {
  return {
    [primaryStat]: 16,
    [secondaryStat]: 14,
    note: 'Standard V.Human: 15+1=16 primary, 13+1=14 secondary. Free feat + skill.',
  };
}
