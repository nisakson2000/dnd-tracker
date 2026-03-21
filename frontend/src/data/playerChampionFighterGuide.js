/**
 * playerChampionFighterGuide.js
 * Player Mode: Champion Fighter — the simple crit machine
 * Pure JS — no React dependencies.
 */

export const CHAMPION_BASICS = {
  class: 'Fighter (Champion)',
  source: 'Player\'s Handbook',
  theme: 'Simple, reliable, crit-fishing Fighter. No resources to track.',
  note: 'Often underrated. Zero resource management. Improved Critical is always on. Great for beginners or players who want simplicity.',
};

export const CHAMPION_FEATURES = [
  { feature: 'Improved Critical', level: 3, effect: 'Critical hit on 19-20 (normally 20 only).', note: 'Double crit chance. From 5% to 10%. Always on. No cost.' },
  { feature: 'Remarkable Athlete', level: 7, effect: 'Half proficiency (rounded up) to STR/DEX/CON checks you\'re not already proficient in. Running long jump distance increases by STR mod.', note: 'Good at everything physical. Jump farther, climb better, swim stronger.' },
  { feature: 'Additional Fighting Style', level: 10, effect: 'Choose a second Fighting Style.', note: 'Defense (+1 AC) + Great Weapon Fighting, or Archery + Defense. Two styles = more versatility.' },
  { feature: 'Superior Critical', level: 15, effect: 'Critical hit on 18-20.', note: '15% crit chance. With advantage: ~27.75% per attack. Crits are frequent.' },
  { feature: 'Survivor', level: 18, effect: 'At start of each turn, regain 5+CON mod HP if below half HP.', note: 'Regeneration. With 20 CON: 10 HP per turn. You\'re nearly unkillable in prolonged fights.' },
];

export const CHAMPION_CRIT_MATH = {
  improvedCritical: {
    critChance: 0.10, // 19-20
    withAdvantage: 0.19, // 1-(0.9)^2
    note: '10% per attack. 3 attacks at L11 = ~27% chance of at least one crit per round.',
  },
  superiorCritical: {
    critChance: 0.15, // 18-20
    withAdvantage: 0.2775, // 1-(0.85)^2
    note: '15% per attack. 3 attacks at L15 = ~39% chance of at least one crit per round.',
  },
  elvenAccuracy: {
    superCrit: 0.3859, // 1-(0.85)^3 with triple advantage
    note: 'Half-elf Champion with Elven Accuracy: triple advantage. 38.6% crit per attack.',
  },
};

export const CHAMPION_TACTICS = [
  { tactic: 'Crit fishing', detail: 'Use Great Weapon Master or Sharpshooter. When you crit, the +10 damage is gravy on doubled dice.', rating: 'A' },
  { tactic: 'Elven Accuracy Champion', detail: 'Half-elf Champion. Elven Accuracy = 3 dice on advantage. With Superior Crit: 38.6% crit per attack.', rating: 'S', note: 'Best crit build in the game. Play an archer for frequent advantage (Faerie Fire, flanking).' },
  { tactic: 'Two fighting styles', detail: 'L10: pick up Defense (+1 AC) alongside your primary style. Free AC.', rating: 'A' },
  { tactic: 'Survivor tanking', detail: 'L18: regen 10 HP/turn below half HP. With Second Wind + regen, you outlast everything.', rating: 'S', note: 'Paired with heavy armor and a shield: an unkillable tank.' },
  { tactic: 'Simple and fast turns', detail: 'No resources. No decisions. Roll attacks. Check for crits. Done. Fastest turns at the table.', rating: 'A', note: 'Great for new players or anyone tired of complex classes.' },
];

export const CHAMPION_VS_BATTLEMASTER = {
  champion: { pros: ['Zero resource tracking', 'Always-on crit bonus', 'Two fighting styles', 'Regeneration at L18', 'Fastest turns'], cons: ['Less tactical options', 'Lower average DPR', 'Boring if you like complex play'] },
  battlemaster: { pros: ['Maneuvers (tactical options)', 'Trip/Precision/Riposte', 'Higher average DPR', 'Short rest recovery'], cons: ['Resource management', 'Decision fatigue', 'Slower turns'] },
  verdict: 'Champion for simplicity. Battlemaster for optimization. BM is stronger but Champion is fun.',
};

export function critChancePerRound(attacksPerRound, critRange, hasAdvantage = false) {
  const critPerDie = critRange / 20;
  const missPerDie = 1 - critPerDie;
  const rollsPerAttack = hasAdvantage ? 2 : 1;
  const noCritPerAttack = Math.pow(missPerDie, rollsPerAttack);
  return 1 - Math.pow(noCritPerAttack, attacksPerRound);
}

export function survivorHealing(conMod) {
  return 5 + conMod; // HP regained per turn below half HP
}
