/**
 * playerCrossbowExpertGuide.js
 * Player Mode: Crossbow Expert feat — the hand crossbow specialist
 * Pure JS — no React dependencies.
 */

export const CROSSBOW_EXPERT_BASICS = {
  feat: 'Crossbow Expert',
  source: 'Player\'s Handbook',
  benefit1: 'Ignore the loading property of crossbows you\'re proficient with.',
  benefit2: 'No disadvantage on ranged attacks when hostile creature is within 5ft.',
  benefit3: 'When you attack with a one-handed weapon, bonus action attack with a hand crossbow.',
  note: 'Highest single-target ranged DPR feat. Hand crossbow + SS + CBE = the ranged DPR king build.',
};

export const CBE_MATH = {
  bonusAttack: 'Hand crossbow: 1d6 + DEX bonus action attack. With Sharpshooter: 1d6 + DEX + 10.',
  atLevel5: 'Extra Attack (2 attacks) + CBE bonus attack = 3 attacks/turn. All can use Sharpshooter.',
  atLevel11: 'Fighter Extra Attack 2 (3 attacks) + CBE = 4 attacks/turn.',
  atLevel20: 'Fighter Extra Attack 3 (4 attacks) + CBE = 5 attacks/turn with SS = 50 extra damage/round.',
  note: 'CBE is the only way to consistently get a bonus action ranged attack every turn.',
};

export const CBE_COMBOS = [
  { combo: 'CBE + Sharpshooter', detail: '3 attacks/turn × (-5/+10) = +30 potential damage. With Archery Style: -3 effective penalty. Best ranged build.', rating: 'S' },
  { combo: 'CBE + Battlemaster', detail: 'Precision Attack offsets SS -5 penalty. Trip Attack at range. Pushing Attack for positioning.', rating: 'S' },
  { combo: 'CBE + Samurai', detail: 'Fighting Spirit: advantage on all attacks for a turn. 3 SS attacks with advantage. Guaranteed hits.', rating: 'S' },
  { combo: 'CBE + Hunter Ranger', detail: 'Colossus Slayer: +1d8 once per turn. With HM: +1d6 per hit. CBE gives extra proc chances.', rating: 'A' },
  { combo: 'CBE + Artificer (Repeating Shot)', detail: 'Repeating Shot infusion: +1 hand crossbow, ignore loading, creates ammo. Frees up CBE for the bonus attack only.', rating: 'A' },
  { combo: 'CBE in melee', detail: 'No disadvantage in melee. Can make ranged attacks next to enemies. Useful when surrounded.', rating: 'A' },
];

export const CBE_VS_PAM = {
  crossbowExpert: { damage: '1d6+DEX bonus action', range: '30/120ft', note: 'Ranged. Safer. Sharpshooter compatible.' },
  polearmMaster: { damage: '1d4+STR bonus action + OA on enter reach', range: 'Melee 10ft', note: 'Melee. Sentinel combo. Control.' },
  verdict: 'CBE for ranged DPR builds. PAM for melee control builds. Both are S-tier.',
};

export const HAND_CROSSBOW_BUILD = {
  weapon: 'Hand Crossbow',
  damage: '1d6 piercing',
  range: '30/120ft',
  properties: 'Light, Loading (ignored by CBE)',
  note: 'One-handed. Can use with shield (unusual but RAW). Frees a hand for other tasks.',
  withShield: 'RAW: you can hold a hand crossbow in one hand and a shield in the other. CBE loads it (no free hand needed with CBE? DM ruling varies).',
  recommendation: 'Most tables allow hand crossbow + shield with CBE. Check with your DM.',
};

export function cbeDPR(dexMod, attacks, hasSharpshooter, hasArcheryStyle, targetAC) {
  const archeryBonus = hasArcheryStyle ? 2 : 0;
  const ssBonus = hasSharpshooter ? 10 : 0;
  const ssPenalty = hasSharpshooter ? -5 : 0;
  const totalAttacks = attacks + 1; // +1 from CBE bonus action
  const hitChance = Math.min(0.95, Math.max(0.05, (dexMod + archeryBonus + ssPenalty + 21 - targetAC) / 20));
  const damagePerHit = 3.5 + dexMod + ssBonus; // 1d6 + DEX + SS
  return { totalAttacks, hitChance: Math.round(hitChance * 100), dpr: Math.round(totalAttacks * hitChance * damagePerHit * 10) / 10 };
}
