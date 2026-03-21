/**
 * playerGoodberryLifeClericGuide.js
 * Player Mode: Goodberry + Life Cleric combo — the healing exploit
 * Pure JS — no React dependencies.
 */

export const GOODBERRY_LIFE_BASICS = {
  combo: 'Goodberry + Disciple of Life',
  classes: 'Life Cleric 1 / Druid or Ranger X',
  rulingStatus: 'Controversial — works RAW, many DMs rule against it',
  note: 'Goodberry creates 10 berries that heal 1 HP each. Disciple of Life adds 2 + spell level to healing spells. RAW: each berry heals 4 HP (1 + 2 + 1). 10 berries × 4 = 40 HP from a L1 slot.',
};

export const GOODBERRY_LIFE_MATH = {
  rawGoodberry: { perBerry: 1, total: 10, note: 'Base Goodberry: 10 berries × 1 HP = 10 HP total' },
  withDiscipleOfLife: { perBerry: 4, total: 40, note: '1 HP + 2 + 1 (spell level) = 4 per berry. 40 HP from L1 slot.' },
  withDiscipleL2: { perBerry: 5, total: 50, note: 'Upcast to L2: 1 + 2 + 2 = 5 per berry. 50 HP from L2 slot.' },
  comparison: {
    cureWoundsL1: { avg: 8.5, note: '1d8 + WIS mod (~3-5). Single target. Action.' },
    healingWordL1: { avg: 5.5, note: '1d4 + WIS mod. Single target. Bonus action.' },
    goodberryLife: { avg: 40, note: '40 HP distributed freely. No action in combat. Cast before long rest.' },
  },
};

export const GOODBERRY_LIFE_BUILDS = [
  { build: 'Life Cleric 1 / Druid X', note: 'Heavy armor + shield + Goodberry healing + full Druid progression. Shepherd Druid especially good.', rating: 'S' },
  { build: 'Life Cleric 1 / Ranger X', note: 'Ranger gets Goodberry at L2. Martial chassis + incredible out-of-combat healing.', rating: 'A' },
  { build: 'Life Cleric 1 / Stars Druid X', note: 'Chalice form + Goodberry = heal two creatures when you heal one. Extra efficiency.', rating: 'A' },
];

export const GOODBERRY_LIFE_TACTICS = [
  { tactic: 'Pre-rest casting', detail: 'Cast Goodberry with all remaining L1 slots before long rest. Berries last 24 hours. Start next day with 40+ HP of healing banked.', rating: 'S' },
  { tactic: 'Distribute berries', detail: 'Give berries to party members. They can self-heal (no action in 5e, DM-dependent). Spread healing across the group.', rating: 'S' },
  { tactic: 'Emergency revive', detail: 'Berry on an unconscious ally = 4 HP. No medicine check. Better than Healing Word in some cases.', rating: 'A' },
  { tactic: 'Ration replacement', detail: 'Goodberry provides nourishment for 24 hours. No need for food rations. Survival campaigns.', rating: 'A' },
];

export const DM_RULINGS = {
  rawWorks: 'Each berry is a separate "healing" instance. Disciple of Life triggers per instance. RAW: 4 HP per berry.',
  commonHouseRule: 'Many DMs rule Disciple of Life applies once to the whole spell (10 + 3 = 13 HP total). Less broken.',
  sage_advice: 'Jeremy Crawford confirmed RAW interpretation (each berry benefits). But many tables still house-rule it.',
  recommendation: 'Check with your DM before building around this combo. If allowed: incredibly powerful. If not: still a good multiclass.',
};

export function goodberryLifeHealing(spellLevel, numBerries = 10) {
  const perBerry = 1 + 2 + spellLevel;
  return { perBerry, total: perBerry * numBerries, spellLevel, note: `${numBerries} berries × ${perBerry} HP = ${perBerry * numBerries} total` };
}

export function slotsToHealing(numL1Slots) {
  return { totalHP: numL1Slots * 40, berries: numL1Slots * 10, note: `${numL1Slots} L1 slots = ${numL1Slots * 40} HP banked overnight` };
}
