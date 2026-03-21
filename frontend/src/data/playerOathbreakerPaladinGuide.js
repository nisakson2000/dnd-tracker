/**
 * playerOathbreakerPaladinGuide.js
 * Player Mode: Oathbreaker Paladin — the fallen knight
 * Pure JS — no React dependencies.
 */

export const OATHBREAKER_BASICS = {
  class: 'Paladin (Oathbreaker)',
  source: 'Dungeon Master\'s Guide',
  theme: 'Fallen paladin. Dark auras. Undead control. CHA to damage for all nearby melee allies.',
  note: 'DMG subclass — requires DM permission. Aura of Hate adds CHA to melee damage for you AND undead allies. Incredible damage potential.',
};

export const OATHBREAKER_FEATURES = [
  { feature: 'Oathbreaker Spells', level: 3, effect: 'Hellish Rebuke, Inflict Wounds (L3). Crown of Madness, Darkness (L5). Animate Dead, Bestow Curse (L9). Blight, Confusion (L13). Contagion, Dominate Person (L17).', note: 'Animate Dead is the star. Darkness is situational. Bestow Curse is great with melee focus.' },
  { feature: 'Control Undead', level: 3, effect: 'Channel Divinity: target undead ≤ your level, CHA save or it obeys you for 24 hours.', note: 'Steal enemy undead permanently (refreshable every 24h). Works on powerful undead at higher levels.' },
  { feature: 'Dreadful Aspect', level: 3, effect: 'Channel Divinity: each creature of your choice within 30ft must WIS save or be frightened for 1 minute.', note: 'AoE fear. Frightened = disadvantage on attacks and can\'t approach. Good crowd control.' },
  { feature: 'Aura of Hate', level: 7, effect: '10ft aura: you + friendly undead/fiends add CHA mod to melee weapon damage.', note: 'At +5 CHA: +5 melee damage to EVERY attack. Your skeleton archers get it too. Stacks with Animate Dead army.' },
  { feature: 'Supernatural Resistance', level: 15, effect: 'Resistance to bludgeoning, piercing, and slashing from nonmagical attacks.', note: 'Halve most physical damage. Good durability for a frontliner.' },
  { feature: 'Dread Lord', level: 20, effect: '1 minute: 30ft aura of shadow. Frightened enemies in aura take 4d10 psychic at start of their turn. You can attack as bonus action (melee spell attack, 3d10+CHA necrotic).', note: '4d10 psychic per enemy per round. Bonus action attack. Devastating capstone. 1/LR.' },
];

export const OATHBREAKER_TACTICS = [
  { tactic: 'Animate Dead + Aura of Hate', detail: 'Raise skeleton archers. Each gets +CHA to damage. 4 skeletons × (+5 damage each) = +20 extra damage/round from aura alone.', rating: 'S' },
  { tactic: 'Smite + Aura of Hate stacking', detail: 'Your own attacks: weapon + STR + CHA (Aura) + Smite. Example: 2d6+5+5+2d8 = massive single hits.', rating: 'S' },
  { tactic: 'Control Undead steal', detail: 'Encounter enemy undead? Channel Divinity to steal it. Works on anything ≤ your level. Refresh every 24h.', rating: 'A' },
  { tactic: 'Dreadful Aspect + melee', detail: 'Frighten enemies → they have disadvantage on attacks against you → safely melee. Great defensive option.', rating: 'A' },
  { tactic: 'Darkness + Devil\'s Sight', detail: 'If multiclassed Warlock: Darkness + Devil\'s Sight. You see, enemies don\'t. Attack with advantage. Classic combo.', rating: 'A' },
];

export function auraOfHateDamageBoost(chaMod, numberOfUndeadAllies) {
  const selfBoost = chaMod;
  const allyBoost = chaMod * numberOfUndeadAllies;
  return { selfBoostPerAttack: selfBoost, totalAllyBoostPerRound: allyBoost, combinedPerRound: selfBoost * 2 + allyBoost };
}

export function animateDeadArmyDPR(skeletonCount, chaMod) {
  const baseDamage = 5.5; // 1d6+2 shortbow avg
  const auraDamage = chaMod;
  const perSkeleton = baseDamage + auraDamage;
  return { perSkeleton, totalDPR: perSkeleton * skeletonCount, note: `${skeletonCount} skeletons × ${perSkeleton} avg = ${perSkeleton * skeletonCount} DPR` };
}
