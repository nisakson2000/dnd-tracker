/**
 * playerHitDiceOptimizationGuide.js
 * Player Mode: Hit Dice — healing on short rests and HP recovery
 * Pure JS — no React dependencies.
 */

export const HIT_DICE_BASICS = {
  what: 'Each class has a Hit Die size. You have total Hit Dice equal to your level.',
  sizes: [
    { die: 'd6', classes: ['Sorcerer', 'Wizard'], avgHP: 4 },
    { die: 'd8', classes: ['Artificer', 'Bard', 'Cleric', 'Druid', 'Monk', 'Rogue', 'Warlock'], avgHP: 5 },
    { die: 'd10', classes: ['Fighter', 'Paladin', 'Ranger'], avgHP: 6 },
    { die: 'd12', classes: ['Barbarian'], avgHP: 7 },
  ],
  spending: 'On a short rest: spend any number of Hit Dice (up to your max). Roll each + CON mod = HP recovered.',
  recovery: 'On a long rest: recover HALF your total Hit Dice (rounded down, minimum 1).',
};

export const HIT_DICE_MATH = [
  { class: 'Wizard (d6, CON +2)', avg: '5.5 per HD', atL10: '55 HP recoverable (10 HD)', note: 'Lowest. Spend carefully.' },
  { class: 'Fighter (d10, CON +3)', avg: '8.5 per HD', atL10: '85 HP recoverable (10 HD)', note: 'High. Can afford to spend freely.' },
  { class: 'Barbarian (d12, CON +4)', avg: '10.5 per HD', atL10: '105 HP recoverable (10 HD)', note: 'Highest. Massive SR healing.' },
];

export const HIT_DICE_OPTIMIZATION = [
  { tip: 'Always spend Hit Dice on SR', detail: 'They\'re free healing. Not spending them wastes resources.', rating: 'S' },
  { tip: 'Don\'t overspend early', detail: 'If you have 6+ encounters today, save some HD for later SRs.', rating: 'A+' },
  { tip: 'Song of Rest (Bard)', detail: 'Bard in party: everyone gets +1d6-1d12 extra healing per HD spent.', rating: 'A+' },
  { tip: 'Chef feat', detail: 'Cook treats: PB creatures get +1d8 HP during SR. Stacks with Song of Rest.', rating: 'A' },
  { tip: 'Durable feat', detail: 'Minimum HP per HD = 2× CON mod. Guarantees decent healing.', rating: 'B+' },
  { tip: 'Periapt of Wound Closure', detail: 'Double HP from Hit Dice. d10+3 becomes 2×(d10+3) = avg 17 per HD.', rating: 'S' },
  { tip: 'Gift of the Ever-Living Ones', detail: 'Warlock (Chain): maximize ALL healing dice. HD always roll max.', rating: 'S' },
];

export const HIT_DICE_RECOVERY = {
  longRest: 'Recover half your total HD (rounded down) per long rest.',
  example: 'L10 Fighter: 10 HD total. Recover 5 per LR.',
  multiclass: 'Recover HD proportionally. Choose which class\'s HD to recover.',
  tip: 'If you spent all HD today, you only recover half tomorrow. Budget across multiple days.',
};

export const SR_HEALING_BONUSES = [
  { source: 'Song of Rest', class: 'Bard', bonus: '+1d6 (L2) to +1d12 (L13)', note: 'Per creature that spends HD.' },
  { source: 'Chef feat', bonus: '+1d8 to PB creatures', note: 'Once per SR per creature.' },
  { source: 'Durable feat', bonus: 'Minimum 2×CON mod per HD', note: 'CON +3: minimum 6 per HD.' },
  { source: 'Periapt of Wound Closure', bonus: 'Double HD healing', note: 'Attunement. Incredibly powerful.' },
  { source: 'Gift of the Ever-Living Ones', bonus: 'Max healing dice', note: 'Warlock Chain. All dice maximized.' },
  { source: 'Healer feat', bonus: '1d6+4+level to one creature', note: 'Uses healer\'s kit. Once per creature per SR.' },
];
