/**
 * playerGoingFirstGuide.js
 * Player Mode: Initiative optimization — going first wins encounters
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_RULES = {
  roll: 'D20 + DEX modifier.',
  type: 'Initiative is a DEX ability check (not a save).',
  ties: 'DM decides between monster/PC. Between PCs: players choose.',
  surprise: 'Surprised creatures can\'t act first turn. No reactions until turn ends.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'Alert (feat)', bonus: '+5 initiative. Can\'t be surprised.', rating: 'S+' },
  { source: 'High DEX', bonus: '+1 to +5', rating: 'S' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half PB', rating: 'A+', note: 'Initiative IS an ability check.' },
  { source: 'War Wizard', bonus: '+INT to initiative', rating: 'S' },
  { source: 'Swashbuckler', bonus: '+CHA to initiative', rating: 'S' },
  { source: 'Gift of Alacrity', bonus: '+1d8 for 8 hours', rating: 'S+' },
  { source: 'Weapon of Warning', bonus: 'Advantage on initiative. Can\'t be surprised.', rating: 'S+' },
  { source: 'Harengon (race)', bonus: '+PB to initiative', rating: 'S' },
  { source: 'Gloom Stalker', bonus: '+WIS to initiative', rating: 'S' },
  { source: 'Feral Instinct (Barb L7)', bonus: 'Advantage on initiative', rating: 'A+' },
];

export const MAX_INITIATIVE_BUILDS = [
  { name: 'Swashbuckler Rogue', total: 'DEX (+5) + CHA (+5) + Alert (+5) = +15' },
  { name: 'War Wizard', total: 'DEX (+3) + INT (+5) + Alert (+5) = +13' },
  { name: 'Gloom Stalker', total: 'DEX (+5) + WIS (+4) + Alert (+5) = +14' },
  { name: 'Harengon Bard', total: 'DEX (+3) + PB (+6) + JoAT (+3) + Alert (+5) = +17' },
];

export const GOING_FIRST_VALUE = [
  'Control spells before enemies act: Hypnotic Pattern, Web, Hold Person.',
  'Buff allies before they\'re hit: Bless, Haste, Shield of Faith.',
  'Position before enemies: cover, high ground, chokepoints.',
  'Surprise round: enemies can\'t act. Full free turn.',
  'Kill threats before they attack: dead enemies deal no damage.',
  'Gloom Stalker: extra attack + extra 1d8 on first turn only.',
];

export const INITIATIVE_TIPS = [
  'Alert feat: +5 initiative + can\'t be surprised. Best combat feat.',
  'Initiative is a DEX ability CHECK. Jack of All Trades applies.',
  'Gift of Alacrity: +1d8 initiative for 8 hours. Cast before adventuring.',
  'Weapon of Warning: advantage on initiative. Uncommon magic item.',
  'Going first = control spells before enemies act. Encounter-winning.',
  'Swashbuckler: +CHA to initiative on top of DEX. +15 possible.',
  'If going last: Dodge turn 1, full offense turn 2.',
  'Surprise: high group Stealth. Pass Without Trace helps.',
];
