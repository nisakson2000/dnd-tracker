/**
 * playerInitiativeOptimizationGuide.js
 * Player Mode: Initiative optimization and going-first strategies
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_BASICS = {
  formula: 'd20 + DEX modifier + other bonuses',
  tiebreaker: 'RAW: DM decides. Common house rule: higher DEX wins.',
  importance: 'Going first = acting before enemies. Crowd control before they spread. Damage before they buff. Positioning before they close.',
  surprise: 'Surprised creatures can\'t act on their first turn. Still roll initiative. They act normally after their skipped turn.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'Alert feat', bonus: '+5', availability: 'Any class', rating: 'S', note: '+5 is massive. Also can\'t be surprised. Also hidden attackers don\'t get advantage. Best initiative feat.' },
  { source: 'Dexterity modifier', bonus: '+1 to +5', availability: 'Any class', rating: 'S', note: 'High DEX = high initiative. Prioritize DEX for initiative-dependent classes.' },
  { source: 'Rakish Audacity (Swashbuckler)', bonus: '+CHA mod', availability: 'Swashbuckler Rogue', rating: 'A', note: 'Add CHA on top of DEX. +5 DEX + +5 CHA = +10 initiative.' },
  { source: 'Dread Ambusher (Gloom Stalker)', bonus: '+WIS mod', availability: 'Gloom Stalker Ranger', rating: 'A', note: 'Add WIS to initiative. Plus bonus attack + extra damage on first turn.' },
  { source: 'Tactical Wit (War Wizard)', bonus: '+INT mod', availability: 'War Magic Wizard', rating: 'A', note: 'Add INT to initiative. Wizards going first = Hypnotic Pattern before enemies act.' },
  { source: 'Gift of Alacrity (Chronurgy)', bonus: '+1d8', availability: 'Chronurgy Wizard / Fey Touched', rating: 'S', note: 'Non-concentration. 8-hour duration. Average +4.5. Available via Fey Touched feat.' },
  { source: 'Ambush (Battle Master)', bonus: '+superiority die', availability: 'Battle Master Fighter', rating: 'A', note: 'Spend a superiority die to boost initiative. d8-d12 bonus.' },
  { source: 'Hare-Trigger (Harengon)', bonus: '+PB', availability: 'Harengon race', rating: 'A', note: 'Add proficiency bonus. +2 to +6. Very strong racial trait.' },
  { source: 'Vigilant Blessing (Twilight)', bonus: 'Advantage', availability: 'Twilight Cleric', rating: 'A', note: 'Give advantage on initiative to one creature after long rest.' },
  { source: 'Sentinel\'s Intuition (Mark of Sentinel)', bonus: '+1d4 (Insight/Perception)', availability: 'Mark of Sentinel Human', rating: 'B', note: 'Not initiative directly, but related vigilance features.' },
  { source: 'Aura of Alacrity (Glory Paladin)', bonus: '+10ft speed', availability: 'Oath of Glory Paladin', rating: 'B', note: 'Not initiative directly but helps act effectively when you go.' },
];

export const FIRST_TURN_STRATEGIES = [
  { strategy: 'AoE crowd control', class: 'Wizard/Sorcerer/Bard', detail: 'Hypnotic Pattern, Web, or Slow before enemies scatter. Removes threats before they act.', rating: 'S' },
  { strategy: 'Assassinate (Assassin)', class: 'Assassin Rogue', detail: 'Go before enemy: advantage + auto-crit on surprised targets. Massive first-turn burst.', rating: 'S' },
  { strategy: 'Dread Ambusher burst', class: 'Gloom Stalker Ranger', detail: 'Extra attack + 1d8 damage on first turn. Invisible to darkvision creatures. Alpha strike.', rating: 'S' },
  { strategy: 'Action Surge turn 1', class: 'Fighter', detail: 'Go first → Action Surge → double attacks on round 1. Eliminate a threat before it acts.', rating: 'A' },
  { strategy: 'Bless/Spirit Guardians setup', class: 'Cleric', detail: 'Going first with concentration buffs means party has +1d4 before enemies attack. Or Spirit Guardians aura is up.', rating: 'A' },
  { strategy: 'Position before enemies', class: 'Any', detail: 'Going first lets you choose the battlefield. Take cover, chokepoints, high ground. Force enemies to come to you.', rating: 'A' },
];

export function initiativeBonus(dexMod, extras = 0) {
  return dexMod + extras;
}

export function chanceToGoFirst(yourBonus, enemyBonus) {
  // Simplified: compare average rolls
  const diff = yourBonus - enemyBonus;
  // Each +1 ≈ 5% better chance
  return Math.min(0.95, Math.max(0.05, 0.5 + diff * 0.05));
}

export function giftOfAlacrityAvg() {
  return 4.5; // 1d8 average
}
