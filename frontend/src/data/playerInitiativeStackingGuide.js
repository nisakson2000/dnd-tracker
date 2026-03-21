/**
 * playerInitiativeStackingGuide.js
 * Player Mode: Initiative optimization — go first, win more
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_IMPORTANCE = {
  why: 'Going first lets you control the battlefield before enemies act.',
  math: 'At +0, you average 10.5. At +10, you average 20.5. Going first vs last = full round of action economy.',
};

export const INITIATIVE_BONUSES = [
  { source: 'DEX modifier', bonus: '+1 to +5', rating: 'A' },
  { source: 'Alert feat', bonus: '+5, can\'t be surprised', rating: 'S' },
  { source: 'Harengon (Hare-Trigger)', bonus: '+PB (scales with level)', rating: 'S' },
  { source: 'Swashbuckler (Rogue)', bonus: '+CHA mod', rating: 'A+' },
  { source: 'War Wizard', bonus: '+INT mod', rating: 'A+' },
  { source: 'Gloom Stalker (Ranger)', bonus: '+WIS mod', rating: 'A+' },
  { source: 'Gift of Alacrity', bonus: '+1d8 (8hrs, no concentration)', rating: 'S' },
  { source: 'Weapon of Warning', bonus: 'Advantage on initiative', rating: 'A+' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half PB', rating: 'A' },
  { source: 'Chronurgy Wizard', bonus: '+INT mod', rating: 'S' },
];

export const MAX_INITIATIVE_BUILDS = [
  {
    build: 'Harengon Swashbuckler + Alert + Gift of Alacrity',
    bonus: 'DEX(+5) + CHA(+5) + PB(+6) + Alert(+5) + GoA(+1d8) = +21 + 1d8',
    average: '~25.5',
    rating: 'S+',
  },
  {
    build: 'Harengon Gloom Stalker + Alert + Gift of Alacrity',
    bonus: 'DEX(+5) + WIS(+5) + PB(+6) + Alert(+5) + GoA(+1d8) = +21 + 1d8',
    average: '~25.5',
    rating: 'S+',
  },
  {
    build: 'War Wizard + Alert',
    bonus: 'DEX(+2) + INT(+5) + Alert(+5) = +12',
    average: '~22.5',
    rating: 'S',
  },
];

export const FIRST_ROUND_PRIORITIES = {
  casters: ['Control spells before enemies scatter', 'Buff allies before damage', 'Spirit Guardians = free damage'],
  martials: ['Alpha strike the biggest threat', 'Lock down enemy casters', 'Protect squishies'],
  supports: ['Faerie Fire for party advantage', 'Bless for attack/save boost', 'Save Healing Word for drops'],
};

export const SURPRISE_INTERACTION = {
  rule: 'No "surprise round." Surprised creatures can\'t act turn 1 or react until their turn ends.',
  alertFeat: 'Can\'t be surprised, ever. Even in ambushes, you act normally.',
  assassinate: 'Assassin Rogue: advantage + auto-crit on surprised creatures. Initiative = more crits.',
};
