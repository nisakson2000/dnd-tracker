/**
 * playerTempHpBufferGuide.js
 * Player Mode: Temporary HP — rules, sources, and optimization
 * Pure JS — no React dependencies.
 */

export const TEMP_HP_RULES = {
  stacking: 'Temp HP does NOT stack. Choose to keep current or take new amount.',
  healing: 'Temp HP is NOT healing. Separate buffer on top of HP.',
  duration: 'Lasts until depleted or long rest (unless specified).',
  damage: 'Temp HP absorbs damage first, then regular HP.',
  deathSaves: 'Temp HP does NOT help at 0 HP.',
  resistances: 'Resistance/vulnerability apply BEFORE temp HP absorbs.',
};

export const TEMP_HP_SOURCES = [
  { source: 'Heroism (L1)', amount: 'CHA mod/turn', duration: 'Conc 1 min', rating: 'A+', note: 'Refreshes every turn. Immune to frightened.' },
  { source: 'Armor of Agathys (L1)', amount: '5 per slot level', duration: 'Until depleted', rating: 'S', note: 'Cold damage to attackers. 25 at L5.' },
  { source: 'Aid (L2)', amount: '+5 max HP (not temp)', duration: '8 hours', rating: 'A+', note: 'Stacks WITH temp HP.' },
  { source: 'False Life (L1)', amount: '1d4+4', rating: 'B+', note: 'At-will via Fiendish Vigor.' },
  { source: 'Twilight Sanctuary', amount: '1d6+cleric level/turn', rating: 'S+', note: 'Refreshes EVERY TURN. Best in game.' },
  { source: 'Inspiring Leader feat', amount: 'Level+CHA (6 targets)', rating: 'S', note: '10-min speech. Party buffer.' },
  { source: 'Dark One\'s Blessing', amount: 'CHA+warlock level on kill', rating: 'A+', note: 'Free on kills. Fiend Warlock.' },
  { source: 'Chef feat treats', amount: '1d8 per creature', rating: 'A', note: 'Prof bonus treats per long rest.' },
];

export const TEMP_HP_COMBOS = [
  { combo: 'Armor of Agathys + Bear Totem', how: 'Resist all damage. Temp HP lasts 2x longer. Cold retaliates.' },
  { combo: 'Aid + Inspiring Leader', how: 'Aid = max HP. Inspiring Leader = temp HP. Both stack.' },
  { combo: 'Twilight Sanctuary + Party', how: 'Every turn, party refreshes temp HP.' },
];

export const TEMP_HP_TIPS = [
  'Temp HP does NOT stack. Keep the higher amount.',
  'Armor of Agathys: scales with slot level. Cold retaliation.',
  'Inspiring Leader: party-wide temp HP. 10-min speech.',
  'Twilight Sanctuary: refreshes every turn. Best source.',
  'Aid increases max HP, not temp HP. They stack together.',
  'Resistance doubles effective temp HP value.',
  'False Life + Fiendish Vigor: at-will before combat.',
  'Dark One\'s Blessing: free temp HP per kill.',
  'Temp HP absorbs damage before regular HP.',
  'Not real HP — doesn\'t help at 0 HP or death saves.',
];
