/**
 * playerTwilightClericGuide.js
 * Player Mode: Twilight Cleric — the most powerful Cleric subclass
 * Pure JS — no React dependencies.
 */

export const TWILIGHT_BASICS = {
  class: 'Cleric (Twilight Domain)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Guardian of the boundary between light and dark. Comfort and protection.',
  armorProf: 'Heavy armor + martial weapons.',
  note: 'Widely considered the strongest Cleric subclass. Twilight Sanctuary is game-warping.',
};

export const TWILIGHT_FEATURES = [
  { feature: 'Eyes of Night', level: 1, effect: 'Darkvision 300ft. Share with PB creatures for 1 hour. WIS mod times/long rest.', note: '300ft darkvision is absurd. Share with whole party.' },
  { feature: 'Vigilant Blessing', level: 1, effect: 'Give one creature advantage on initiative. Lasts until used or you use again.', note: 'Free advantage on initiative for your Fighter/Rogue every day.' },
  { feature: 'Channel Divinity: Twilight Sanctuary', level: 2, effect: 'Action: 30ft dim light sphere centered on you. Lasts 1 min. Each turn, allies inside gain 1d6+Cleric level temp HP OR end charmed/frightened.', note: 'THIS IS THE FEATURE. 1d6+level temp HP to EVERYONE. EVERY TURN. For a full minute. Broken.' },
  { feature: 'Steps of Night', level: 6, effect: 'Bonus action: fly speed = walking speed for 1 minute. PB uses/long rest.', note: 'Flight as a bonus action. Multiple times per day.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 radiant on weapon hit. 2d8 at L14.', note: 'Melee Cleric damage. Stack with Spirit Guardians.' },
  { feature: 'Twilight Shroud', level: 17, effect: 'Twilight Sanctuary also grants half cover (+2 AC, +2 DEX saves) to allies inside.', note: 'Party-wide +2 AC on top of temp HP every turn. Endgame dominance.' },
];

export const TWILIGHT_SANCTUARY_MATH = {
  tempHP: '1d6 + Cleric level per ally per turn.',
  examples: [
    { level: 2, avg: '5.5 (1d6+2) per ally per turn' },
    { level: 5, avg: '8.5 per ally per turn. 4 allies = 34 temp HP/round for the party.' },
    { level: 10, avg: '13.5 per ally per turn. 4 allies = 54 temp HP/round.' },
    { level: 15, avg: '18.5 per ally per turn. 4 allies = 74 temp HP/round.' },
  ],
  comparison: 'A L10 encounter deals maybe 25-40 damage per round to the party. Twilight Sanctuary prevents 54. The party is effectively invincible.',
  note: 'This is why Twilight Cleric is considered overpowered. The temp HP regenerates every turn.',
};

export const TWILIGHT_TACTICS = [
  { tactic: 'Sanctuary + Spirit Guardians', detail: 'Spirit Guardians deals 3d8/turn AoE. Twilight Sanctuary keeps you alive. Walk into enemies.', rating: 'S' },
  { tactic: 'End charmed/frightened', detail: 'Twilight Sanctuary also ends charmed or frightened on any ally within range each turn.', rating: 'A' },
  { tactic: 'Steps of Night + Spirit Guardians', detail: 'Fly 30ft with Spirit Guardians. Float above enemies. They\'re in range, can\'t reach you.', rating: 'S' },
  { tactic: 'Vigilant Blessing on Wizard', detail: 'Free advantage on initiative for your control Wizard. They Hypnotic Pattern before enemies act.', rating: 'A' },
  { tactic: 'Heavy armor + shield + sanctuary', detail: '20 AC minimum. Temp HP refreshing. You\'re the tankiest caster in the game.', rating: 'S' },
];

export const WHY_TWILIGHT_IS_BROKEN = [
  'Temp HP refreshes every turn. You can\'t burst through it in one hit — it comes back.',
  'Affects ALL allies in 30ft. Scales with party size.',
  'Also removes charmed and frightened. Many encounter designs rely on those conditions.',
  'No save, no check, no counter. It\'s a Channel Divinity, not a spell. Can\'t be Counterspelled.',
  'Lasts 1 minute (10 rounds). Most combats are 3-5 rounds. It lasts the entire fight.',
  'Stacks with everything. Shield of Faith, Armor of Agathys, Heroism — all work alongside it.',
];

export function twilightTempHP(clericLevel) {
  return 3.5 + clericLevel; // 1d6 avg + level
}

export function partyTempHPPerRound(clericLevel, allyCount) {
  return (3.5 + clericLevel) * allyCount;
}
