/**
 * playerInitiativeBoostGuide.js
 * Player Mode: Initiative optimization — going first wins fights
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_RULES = {
  roll: 'DEX check: d20 + DEX modifier + any bonuses.',
  ties: 'DM decides (usually higher DEX wins, or roll off).',
  surprise: 'Surprised creatures can\'t act round 1. Not the same as "going first."',
  importance: 'Going first = acting before enemies. Control spells, positioning, burst damage all benefit enormously.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'High DEX', bonus: '+1 to +5', type: 'Ability', rating: 'S', note: 'Base initiative. DEX 20 = +5. Universal.' },
  { source: 'Alert feat', bonus: '+5', type: 'Feat', rating: 'S+', note: '+5 initiative, can\'t be surprised, hidden creatures don\'t gain advantage.' },
  { source: 'War Wizard (L2)', bonus: '+INT to initiative', type: 'Class', rating: 'S', note: '+4 or +5 initiative from INT. Stacks with DEX.' },
  { source: 'Chronurgy Wizard (L2)', bonus: '+INT to initiative', type: 'Class', rating: 'S', note: 'Same as War Wizard. Chronurgy is also S+ subclass overall.' },
  { source: 'Swashbuckler Rogue (L3)', bonus: '+CHA to initiative', type: 'Class', rating: 'S', note: '+CHA to initiative. With high DEX + CHA = very high init.' },
  { source: 'Dread Ambusher (Gloom Stalker)', bonus: '+WIS to initiative', type: 'Class', rating: 'S+', note: 'Add WIS to initiative. Plus extra attack/damage round 1.' },
  { source: 'Weapon of Warning', bonus: 'Advantage on initiative', type: 'Magic Item', rating: 'S', note: 'Advantage on initiative rolls. Uncommon rarity.' },
  { source: 'Gift of Alacrity (Chronurgy)', bonus: '+1d8', type: 'Spell', rating: 'S+', note: '1d8 to initiative for 8 hours. No concentration.' },
  { source: 'Bardic Inspiration', bonus: '+1d6 to +1d12', type: 'Ally', rating: 'A+', note: 'If given before combat, add to initiative roll.' },
  { source: 'Remarkable Athlete (Champion)', bonus: '+half PB', type: 'Class', rating: 'B+', note: 'Adds to initiative (DEX check).' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half PB', type: 'Class', rating: 'A', note: 'Initiative is an ability check. JoT applies.' },
  { source: 'Harengon (race)', bonus: '+PB', type: 'Race', rating: 'S', note: 'Add proficiency bonus to initiative.' },
];

export const MAX_INITIATIVE_BUILDS = [
  {
    build: 'Gloom Stalker / Chronurgy Wizard',
    breakdown: 'DEX (+5) + WIS (+4) + INT (+4) + Alert (+5) + Gift of Alacrity (+1d8)',
    average: '+18 + 1d8 ≈ +22.5',
    note: 'Highest possible initiative.',
  },
  {
    build: 'Swashbuckler Rogue with Alert',
    breakdown: 'DEX (+5) + CHA (+4) + Alert (+5)',
    average: '+14',
    note: 'No multiclass needed. Pure Rogue.',
  },
  {
    build: 'War Wizard with Alert',
    breakdown: 'DEX (+2) + INT (+5) + Alert (+5)',
    average: '+12',
    note: 'Wizard who controls the battlefield first.',
  },
];

export const WHY_INITIATIVE_MATTERS = [
  'Control spells cast BEFORE enemies act = fight won.',
  'Burst damage round 1 can eliminate threats before they swing.',
  'Gloom Stalker: extra attack + damage only on round 1. Going first maximizes it.',
  'Surprise + high initiative = enemies never act.',
  'In a 3-round combat, going first gives you 33% more effective turns.',
];

export const INITIATIVE_TIPS = [
  'DEX is the universal initiative stat. Don\'t dump it.',
  'Alert is the best general-purpose feat for initiative.',
  'Gift of Alacrity: 1d8 for 8 hours, no concentration. Ask your Chronurgy Wizard.',
  'Weapon of Warning is uncommon. Ask your DM for it early.',
  'Going first with a control spell can end encounters before they begin.',
  'Harengon Gloom Stalker: +PB +WIS +DEX = absurd initiative at any level.',
];
