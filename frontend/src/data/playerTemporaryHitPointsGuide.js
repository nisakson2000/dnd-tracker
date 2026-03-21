/**
 * playerTemporaryHitPointsGuide.js
 * Player Mode: Temporary HP rules and optimization
 * Pure JS — no React dependencies.
 */

export const TEMP_HP_RULES = {
  definition: 'Temporary hit points are a buffer against damage. Not real HP.',
  noStacking: 'Temp HP does NOT stack. If you gain temp HP while you have some, choose to keep the old or take the new.',
  noHealing: 'Temp HP is not healing. Features that "restore hit points" don\'t interact with temp HP.',
  lostFirst: 'Damage reduces temp HP first, then actual HP. Excess damage carries over.',
  duration: 'Temp HP last until depleted or until you finish a long rest (unless duration specified).',
  deathSaves: 'Temp HP doesn\'t help at 0 HP. You can\'t gain temp HP while at 0 HP to stabilize.',
  note: 'Key: temp HP doesn\'t stack. Getting 10 temp HP when you have 8 = you choose 10 (not 18).',
};

export const TEMP_HP_SOURCES = [
  { source: 'Heroism (L1)', amount: 'CHA mod per turn', class: 'Bard, Paladin', duration: 'Concentration, 1 min', note: 'Refreshes every turn. Effectively CHA mod × 10 over the fight.', rating: 'A' },
  { source: 'Armor of Agathys (L1)', amount: '5 per slot level', class: 'Warlock', duration: '1 hour, no concentration', note: 'L5 slot: 25 THP. No concentration. Melee attackers take cold damage equal to THP remaining.', rating: 'S' },
  { source: 'False Life (L1)', amount: '1d4+4', class: 'Wizard, Sorcerer, Artificer', duration: '1 hour', note: 'Average 6.5 THP. No concentration. Decent at L1.', rating: 'B' },
  { source: 'Inspiring Leader feat', amount: 'Level + CHA mod', class: 'Any (feat)', duration: 'Until depleted/LR', note: 'At L10/+5 CHA: 15 THP to 6 creatures = 90 total party THP.', rating: 'S' },
  { source: 'Twilight Sanctuary', amount: '1d6+Cleric level', class: 'Twilight Cleric', duration: 'Refreshes each round, 1 min', note: 'Best THP source in the game. Avg 3.5+level per round to multiple allies. Overpowered.', rating: 'S' },
  { source: 'Dark One\'s Blessing', amount: 'CHA mod + Warlock level', class: 'Fiend Warlock', duration: 'Until depleted/LR', note: 'Kill enemy → gain CHA+level THP. At L10/+5: 15 THP per kill. Great sustain.', rating: 'A' },
  { source: 'Touch of Death', amount: 'WIS mod + Monk level', class: 'Long Death Monk', duration: 'Until depleted/LR', note: 'Kill anything within 5ft → WIS+level THP.', rating: 'A' },
];

export const TEMP_HP_TIPS = [
  { tip: 'Pre-combat buffs', detail: 'Apply Inspiring Leader or Armor of Agathys before fights. Start with a buffer.', priority: 'High' },
  { tip: 'Choose higher, don\'t stack', detail: 'If you have 3 THP and gain 12 THP, take the 12. They don\'t add.', priority: 'Essential' },
  { tip: 'Armor of Agathys upcast', detail: 'Each slot level = +5 THP and +5 cold damage. L5: 25/25. Incredible scaling.', priority: 'High' },
  { tip: 'Inspiring Leader reusability', detail: 'Usable after every short rest. 3x per day = massive party-wide THP over an adventuring day.', priority: 'Medium' },
];

export function inspiringLeaderTHP(level, chaMod, partySize = 6) {
  const perCreature = level + chaMod;
  return { perCreature, totalParty: perCreature * Math.min(partySize, 6) };
}

export function armorOfAgathysByLevel(slotLevel) {
  const thp = slotLevel * 5;
  return { tempHP: thp, coldDamagePerHit: thp };
}
