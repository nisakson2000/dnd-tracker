/**
 * playerHexbladeWarriorGuide.js
 * Player Mode: Hexblade Warlock — the ultimate CHA martial
 * Pure JS — no React dependencies.
 */

export const HEXBLADE_BASICS = {
  subclass: 'Hexblade',
  class: 'Warlock',
  source: "Xanathar's Guide to Everything",
  keyFeatures: [
    { level: 1, feature: 'Hexblade\'s Curse', desc: 'BA: curse a target. +PB to damage, crit on 19-20, heal PB+CHA mod on target death.' },
    { level: 1, feature: 'Hex Warrior', desc: 'Medium armor + shields + martial weapons. Use CHA for one weapon\'s attack/damage.' },
    { level: 6, feature: 'Accursed Specter', desc: 'Slay a humanoid, raise as specter. Temp HP = half your Warlock level.' },
    { level: 10, feature: 'Armor of Hexes', desc: 'Cursed target: when it hits you, roll d6. On 4+, the attack misses.' },
    { level: 14, feature: 'Master of Hexes', desc: 'When cursed target dies, move curse to another creature within 30ft (no BA needed).' },
  ],
  note: 'The strongest Warlock patron by a wide margin. CHA-based attacks make Warlock SAD. Medium armor + shield = tanky.',
};

export const HEXBLADE_MULTICLASS = {
  note: 'Hexblade is the most multiclassed subclass in 5e. 1-3 Hexblade levels benefit almost any CHA class.',
  popularDips: [
    {
      build: 'Hexblade 1 / Paladin X',
      gain: 'CHA for weapon attacks. Medium armor + shield. Hexblade\'s Curse + Smite = nova damage.',
      rating: 'S',
      note: 'SAD Paladin. CHA for attacks, saves, aura, smite, spellcasting. Doesn\'t need STR.',
    },
    {
      build: 'Hexblade 2 / Paladin X',
      gain: 'Agonizing Blast for ranged option. Eldritch Blast at range, smite in melee. Best of both.',
      rating: 'S',
      note: 'Two invocations. EB + Agonizing Blast = ranged fallback.',
    },
    {
      build: 'Hexblade 1 / Swords Bard X',
      gain: 'CHA attacks + medium armor + shield. Bard spells + martial combat.',
      rating: 'S',
      note: 'Swords Bard becomes SAD. AC boost is massive for a Bard.',
    },
    {
      build: 'Hexblade 1 / Sorcerer X (Sorlock)',
      gain: 'Armor + shield + CHA weapon. Quickened EB + Hexblade\'s Curse for burst.',
      rating: 'A',
      note: 'More about EB spam than weapon combat. Armor is the big Hexblade benefit here.',
    },
    {
      build: 'Hexblade 5 / Fighter X',
      gain: 'Thirsting Blade, Eldritch Smite, 2 short rest slots. Fighter gets more ASIs for feats.',
      rating: 'B+',
      note: 'Less common but functional. Fighter action economy + Warlock slots.',
    },
  ],
};

export const HEXBLADE_CURSE_MATH = {
  bonusDamage: 'Proficiency bonus per hit. At L17: +6 per hit.',
  critRange: '19-20 (doubled from 20 crit). With Champion Fighter 3: 18-20 triple crit.',
  healing: 'On target death: Warlock level + CHA mod HP healed.',
  examples: [
    { level: 5, profBonus: 3, extraDPR: '3 per hit × 2 attacks = +6 DPR. Crit on 19-20.', healing: '5+CHA mod' },
    { level: 11, profBonus: 4, extraDPR: '4 per hit × 3 beams = +12 DPR.', healing: '11+CHA mod' },
    { level: 17, profBonus: 6, extraDPR: '6 per hit × 4 beams = +24 DPR.', healing: '17+CHA mod' },
  ],
};

export const HEXBLADE_BUILD_PATHS = [
  { path: 'Blade Pact Hexblade', focus: 'Melee combat', feats: 'PAM, GWM, or Sentinel', note: 'Thirsting Blade + Eldritch Smite. CHA for attacks. Shield for AC.' },
  { path: 'EB Hexblade', focus: 'Ranged blaster', feats: 'War Caster, Alert', note: 'Armor + shield. EB + Agonizing + Hexblade\'s Curse for damage. Tank + blast.' },
  { path: 'Hexblade 1 / Paladin X', focus: 'SAD Paladin', feats: 'PAM, GWM, Sentinel', note: 'Best multiclass in the game. CHA for everything.' },
  { path: 'Sorlock (Hexblade 2-3 / Sorcerer X)', focus: 'EB machine gun', feats: 'War Caster, Alert', note: 'Quickened EB + regular EB. Armor from Hexblade. Short rest slots convert to SP.' },
];

export function hexbladeCurseDPR(profBonus, numAttacks) {
  const extraPerRound = profBonus * numAttacks;
  return { extraDPR: extraPerRound, critRange: '19-20', note: `Hexblade's Curse: +${extraPerRound} DPR (${profBonus} × ${numAttacks} attacks). Crits on 19-20.` };
}
