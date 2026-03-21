/**
 * playerBeastMasterRangerGuide.js
 * Player Mode: Beast Master Ranger — the animal companion ranger
 * Pure JS — no React dependencies.
 */

export const BEAST_MASTER_BASICS = {
  class: 'Ranger (Beast Master)',
  source: 'Player\'s Handbook (revised in Tasha\'s)',
  theme: 'Animal companion. Fight alongside your beast. Tasha\'s primal beasts fix the subclass.',
  note: 'Original PHB Beast Master was weak. Tasha\'s Primal Companion fixes it completely. Always use Tasha\'s rules if your DM allows.',
};

export const BEAST_MASTER_PHB_ISSUES = [
  { issue: 'Action economy', detail: 'PHB: beast uses YOUR action to attack. You lose your own attacks. Terrible at L5+ when Extra Attack comes online.', severity: 'Critical' },
  { issue: 'Beast HP scaling', detail: 'PHB beasts have fixed stats. They die easily at higher levels. No HP scaling.', severity: 'High' },
  { issue: 'Beast attack scaling', detail: 'PHB beast attacks don\'t scale with proficiency bonus. Fall behind quickly.', severity: 'High' },
  { issue: 'Resummon cost', detail: '8 hours and a spell slot to get a new beast. Dead companion = long replacement.', severity: 'Medium' },
];

export const TASHAS_PRIMAL_COMPANION = {
  source: 'Tasha\'s Cauldron of Everything (optional feature)',
  fix: 'Replace PHB beast with Primal Beast: Beast of the Land, Beast of the Sea, or Beast of the Sky.',
  actionEconomy: 'Primal beast attacks as YOUR bonus action. You keep your full Attack action.',
  scaling: 'Beast\'s HP = 5 × Ranger level. Attack = your spell attack mod. Damage = 1d8 + 2 + PB.',
  note: 'Tasha\'s Beast Master is actually good. Bonus action attack + your Extra Attack = strong damage.',
};

export const PRIMAL_BEASTS = [
  { beast: 'Beast of the Land', type: 'Melee', speed: '40ft, climb 40ft', hp: '5 × Ranger level + 5', attack: 'Spell attack mod', damage: '1d8+2+PB (maul)', special: 'Charge: if beast moves 20ft straight → bonus 1d6 damage + DC vs prone.', rating: 'A', note: 'Best for melee Rangers. Charge knockdown combos with your attacks on prone targets.' },
  { beast: 'Beast of the Sea', type: 'Aquatic', speed: '5ft, swim 60ft', hp: '5 × Ranger level + 5', attack: 'Spell attack mod', damage: '1d6+2+PB (binding strike)', special: 'Hit → target grappled (escape DC = your spell save DC). Beast has 60ft swim.', rating: 'B', note: 'Niche. Great in water campaigns. Grapple on hit is useful but limited to aquatic settings.' },
  { beast: 'Beast of the Sky', type: 'Ranged/Support', speed: '10ft, fly 60ft', hp: '5 × Ranger level + 5', attack: 'Spell attack mod', damage: '1d4+3+PB (shred)', special: 'Flyby (no opportunity attacks when flying out). 60ft fly speed.', rating: 'A', note: 'Flyby is excellent. Harass backline enemies. Flying + no OA = hard to pin down.' },
];

export const BEAST_MASTER_TACTICS = [
  { tactic: 'Beast bonus action + Extra Attack', detail: 'Your turn: Attack action (2 attacks with Extra Attack) + bonus action (beast attack). 3 total attacks per round.', rating: 'S' },
  { tactic: 'Beast of Land charge + prone', detail: 'Beast charges 20ft → bonus damage + knock prone → you attack prone target with advantage.', rating: 'S' },
  { tactic: 'Beast of Sky flyby harassment', detail: 'Send bird to attack backline casters. Flyby = no OA. Force concentration saves on enemy casters.', rating: 'A' },
  { tactic: 'Hunter\'s Mark + beast attacks', detail: 'Hunter\'s Mark: +1d6 per hit. Your 2 attacks + beast attack = 3×1d6 extra per round from HM alone.', rating: 'A' },
  { tactic: 'Beast as scout', detail: 'Send beast ahead to scout. If it dies, resummon during short rest (Tasha\'s: 1 spell slot + 1 hour).', rating: 'A' },
  { tactic: 'Beast flanking', detail: 'Beast engages in melee → flanking with you (if using flanking rules). Free advantage.', rating: 'A' },
];

export function primalBeastHP(rangerLevel) {
  return 5 * rangerLevel + 5;
}

export function beastMasterDPR(rangerLevel, dexMod, profBonus, hasHuntersMark = false) {
  const rangerAttacks = rangerLevel >= 5 ? 2 : 1;
  const rangerDamage = rangerAttacks * (4.5 + dexMod); // 1d8 + DEX
  const beastDamage = 4.5 + 2 + profBonus; // 1d8+2+PB
  const hmBonus = hasHuntersMark ? (rangerAttacks + 1) * 3.5 : 0; // +1d6 per hit
  return { rangerDamage, beastDamage, huntersMark: hmBonus, totalDPR: rangerDamage + beastDamage + hmBonus };
}
