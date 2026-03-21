/**
 * playerHighLevelPlayGuide.js
 * Player Mode: Tier 3-4 play guide — levels 11-20
 * Pure JS — no React dependencies.
 */

export const TIER_3_BASICS = {
  levels: '11-16',
  name: 'Masters of the Realm',
  threats: 'Dragons, liches, demon lords, interplanar threats',
  gameChangers: ['L6 spells', 'Third attack (Fighter)', 'Proficiency in all saves (Monk L14)', 'Legendary items'],
  note: 'Combat becomes rocket tag. Save-or-suck spells dominate. Whoever goes first and lands their spell wins.',
};

export const TIER_4_BASICS = {
  levels: '17-20',
  name: 'Masters of the World',
  threats: 'Archdevils, Tiamat, Tarrasque, world-ending events',
  gameChangers: ['L9 spells (Wish, True Polymorph)', 'Capstone abilities', 'Nearly unlimited resources'],
  note: 'Players are demigods. Balance breaks down. Embrace the chaos. DMs need creative challenges.',
};

export const HIGH_LEVEL_COMBAT_CHANGES = [
  { change: 'Save-or-suck dominates', detail: 'Forcecage, Maze, Banishment, Power Word Kill. One failed save = fight over. Initiative and Counterspell matter most.', impact: 'Critical' },
  { change: 'Flight is mandatory', detail: 'If you can\'t fly, you can\'t participate in many high-level fights. Winged Boots, Fly spell, or racial flight.', impact: 'High' },
  { change: 'Counterspell wars', detail: 'Casters counterspell each other. Subtle Spell metamagic or Counterspell from hiding wins these wars.', impact: 'High' },
  { change: 'Legendary Resistances', detail: 'Every boss has 3 LRs. Burn them with cheap saves before using big spells.', impact: 'High' },
  { change: 'Rocket tag', detail: 'Whoever acts first and lands their spell/attack wins. Initiative bonuses are incredibly valuable.', impact: 'Critical' },
  { change: 'Martial-caster gap', detail: 'Casters can reshape reality. Martials still hit things. Subclasses that blur the line (EK, Bladesinger) do better.', impact: 'High' },
];

export const HIGH_LEVEL_MUST_HAVES = [
  { item: 'Counterspell', for: 'Any arcane caster', note: 'Can\'t let enemy cast Forcecage/Maze/Power Word Kill. Must have counter.' },
  { item: 'Teleportation (Misty Step/Dimension Door)', for: 'Everyone', note: 'Escape Forcecage, reposition, flee. Non-negotiable.' },
  { item: 'Flight', for: 'Everyone', note: 'Winged Boots, Fly spell, racial. If you can\'t fly, you can\'t fight.' },
  { item: 'Death Ward', for: 'Cleric on frontliners', note: 'Power Word Kill one-shots below 100 HP. Death Ward prevents it.' },
  { item: 'Clone (Wizard L8)', for: 'Self-resurrection insurance', note: 'Die → soul transfers to clone. Ultimate safety net. No diamond needed via Wish.' },
  { item: 'Heroes\' Feast', for: 'Before boss fights', note: 'Poison immunity, fear immunity, +2d10 temp HP. 1,000gp but worth every copper.' },
];

export const HIGH_LEVEL_PLAYER_TIPS = [
  { tip: 'Win initiative', detail: 'Alert feat (+5), Gift of Alacrity (+1d8), DEX investment. Acting first = landing your spell first.' },
  { tip: 'Have a plan B', detail: 'If Forcecage fails, what\'s your next move? Always have 2-3 options prepared.' },
  { tip: 'Protect concentration', detail: 'Your L6-9 concentration spell IS the fight. If you lose it, you might lose the encounter.' },
  { tip: 'Use Wish for L8 replication', detail: 'Safest Wish use. Clone, Demiplane, Maze. No risk of losing Wish.' },
  { tip: 'Coordinate with party', detail: 'High-level play rewards coordination. Burn LRs together, ready Counterspells, time your buffs.' },
];

export function powerWordKillThreshold() {
  return 100; // Instant death if current HP ≤ 100
}

export function deathWardValue(characterLevel) {
  return { preventsDeathFrom: ['Power Word Kill', 'Massive damage', 'Disintegrate at 0 HP'], note: 'Death Ward is insurance. Cast it before the boss fight.' };
}
