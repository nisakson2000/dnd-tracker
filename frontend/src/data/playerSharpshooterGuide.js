/**
 * playerSharpshooterGuide.js
 * Player Mode: Sharpshooter feat — the ranged power attack
 * Pure JS — no React dependencies.
 */

export const SHARPSHOOTER_BASICS = {
  feat: 'Sharpshooter',
  source: 'Player\'s Handbook',
  benefit1: 'No disadvantage on long-range attacks.',
  benefit2: 'Ignore half and three-quarters cover.',
  benefit3: 'Before making a ranged weapon attack: take -5 to hit, deal +10 damage.',
  note: 'Best ranged feat. -5/+10 is same math as GWM but at range. Cover ignoring is incredibly strong. Most builds with ranged weapons take this.',
};

export const SHARPSHOOTER_MATH = {
  rule: 'Same as GWM: use -5/+10 when enemy AC is low or you have advantage.',
  breakpoints: [
    { ac: '≤ 14', use: 'Always. +10 damage far outweighs accuracy loss.' },
    { ac: '15-17', use: 'Usually. With advantage: always.' },
    { ac: '18-19', use: 'With advantage or Archery Fighting Style.' },
    { ac: '20+', use: 'Only with advantage + other bonuses.' },
  ],
  archeryStyle: 'Archery Fighting Style: +2 to hit. Partially offsets the -5. Effective penalty is only -3.',
};

export const SHARPSHOOTER_COMBOS = [
  { combo: 'SS + Archery Fighting Style', detail: '+2 from Archery partially offsets -5. Effective -3 penalty. Much more usable.', rating: 'S' },
  { combo: 'SS + Crossbow Expert', detail: 'Hand crossbow + Crossbow Expert = bonus action attack. 3 SS attacks per turn at L5. Highest ranged DPR.', rating: 'S' },
  { combo: 'SS + Samurai (Fighter)', detail: 'Fighting Spirit: bonus action for advantage on all attacks this turn. 3 SS attacks with advantage.', rating: 'S' },
  { combo: 'SS + Gloomstalker', detail: 'Dread Ambusher: 3 attacks round 1 with SS. In darkness: advantage from invisibility. Devastating opener.', rating: 'S' },
  { combo: 'SS + Bless', detail: '+1d4 from Bless helps offset -5 penalty. Average +2.5 to hit. Good support combo.', rating: 'A' },
  { combo: 'SS + Steady Aim (Rogue)', detail: 'Tasha\'s Steady Aim: bonus action for advantage (can\'t move). SS with advantage = huge Sneak Attack hit.', rating: 'A' },
];

export const COVER_IGNORING = {
  halfCover: '+2 AC. SS ignores it. You treat enemies behind low walls, other creatures as if they have no cover.',
  threeQuartersCover: '+5 AC. SS ignores it. You can shoot through arrow slits, around pillars.',
  fullCover: 'SS does NOT ignore full cover. You still can\'t hit what you can\'t see.',
  note: 'Ignoring cover is underrated. In practice, most enemies have some cover (+2 or +5 AC). SS negates this entirely.',
};

export const SHARPSHOOTER_CLASS_PRIORITY = [
  { class: 'Fighter', priority: 'S', reason: 'Most attacks = most SS procs. Action Surge for burst. Archery Style built in. Best SS user.' },
  { class: 'Ranger', priority: 'S', reason: 'Archery Style + Hunter\'s Mark + SS = high sustained DPR. Gloomstalker variant is S+ tier.' },
  { class: 'Rogue', priority: 'A', reason: 'One big hit with SS + Sneak Attack. Steady Aim for advantage. Less attacks but each hits harder.' },
  { class: 'Artificer (Battle Smith)', priority: 'A', reason: 'INT to attack + SS + Repeating Infusion. Unique build path.' },
];

export function sharpshooterDPR(baseToHit, targetAC, baseDamage, attacks, hasArcheryStyle = false, hasAdvantage = false) {
  const styleBonus = hasArcheryStyle ? 2 : 0;
  const normalHitChance = Math.min(0.95, Math.max(0.05, (baseToHit + styleBonus + 21 - targetAC) / 20));
  const ssHitChance = Math.min(0.95, Math.max(0.05, (baseToHit + styleBonus - 5 + 21 - targetAC) / 20));

  const advNormal = hasAdvantage ? 1 - (1 - normalHitChance) ** 2 : normalHitChance;
  const advSS = hasAdvantage ? 1 - (1 - ssHitChance) ** 2 : ssHitChance;

  const normalDPR = advNormal * baseDamage * attacks;
  const ssDPR = advSS * (baseDamage + 10) * attacks;

  return { normalDPR: Math.round(normalDPR * 10) / 10, ssDPR: Math.round(ssDPR * 10) / 10, useSS: ssDPR > normalDPR };
}
