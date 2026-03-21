/**
 * playerHasteSpellGuide.js
 * Player Mode: Haste — powerful buff with dangerous drawback
 * Pure JS — no React dependencies.
 */

export const HASTE_BASICS = {
  spell: 'Haste',
  level: 3,
  school: 'Transmutation',
  castTime: '1 action',
  range: '30 feet (one willing creature)',
  duration: '1 minute (concentration)',
  classes: ['Wizard', 'Sorcerer', 'Artificer'],
  benefits: [
    'Doubled speed.',
    '+2 AC.',
    'Advantage on DEX saves.',
    'One additional action per turn (limited: Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object).',
  ],
  drawback: 'When Haste ends, target can\'t move or take actions until after its next turn. (Lethal if concentration drops mid-combat.)',
  note: 'Incredible buff but the drawback is real. If you lose concentration, the target loses their next turn entirely.',
};

export const HASTE_ACTION_USES = [
  { action: 'Attack (one weapon attack)', detail: 'One extra weapon attack. Not "the Attack action" — so no Extra Attack. Just one swing.', value: 'A' },
  { action: 'Dash', detail: 'Doubled speed + Dash + Haste Dash = 4× normal speed. 120ft for 30ft speed.', value: 'A' },
  { action: 'Disengage', detail: 'Attack with normal action → Disengage with Haste action. Hit and run for free.', value: 'B' },
  { action: 'Hide', detail: 'Attack → Hide. Rogues love this for consistent hiding.', value: 'B (Rogues only)' },
  { action: 'Use an Object', detail: 'Drink a potion, interact with items. Niche but useful.', value: 'C' },
];

export const HASTE_CLASS_VALUE = [
  { class: 'Fighter', rating: 'S', reason: 'Extra Attack already high. One more attack + doubled speed + +2 AC. Fighters are the best Haste target.' },
  { class: 'Paladin', rating: 'S', reason: 'Extra attack = extra smite opportunity. +2 AC on an armored character. Speed for positioning.' },
  { class: 'Rogue', rating: 'A', reason: 'Haste action: Attack (bonus Sneak Attack chance if first misses). Or: Attack + Haste Dash for mega-mobility.' },
  { class: 'Barbarian', rating: 'A', reason: 'One more Reckless attack. +2 AC (stacks with rage). Doubled speed.' },
  { class: 'Monk', rating: 'B', reason: 'Extra attack is nice but Monks already have Flurry. Speed doubling on already fast class is overkill.' },
  { class: 'Caster (self-haste)', rating: 'C', reason: 'Haste action can\'t cast spells. +2 AC and speed are nice but concentration on Haste prevents other concentration spells.' },
];

export const HASTE_VS_ALTERNATIVES = {
  vsBless: {
    haste: 'One target, huge buff, dangerous drawback, concentration.',
    bless: '3 targets, +1d4 attacks and saves, no drawback, concentration.',
    verdict: 'Bless is more efficient per slot. Haste is stronger on one target but riskier.',
  },
  vsGreaterInvisibility: {
    haste: 'Extra action, speed, AC, DEX saves. Dangerous drawback.',
    gi: 'Advantage on all attacks, disadvantage on all attacks against you. No drawback.',
    verdict: 'GI is safer and provides offense+defense. Haste provides more raw action economy.',
  },
};

export const HASTE_RISKS = [
  { risk: 'Concentration loss', detail: 'If concentration drops: target loses next turn (can\'t move or act). In combat, this can be lethal.', severity: 'S' },
  { risk: 'Dispel Magic', detail: 'Enemy Dispels your Haste → target loses next turn. Smart enemies target the caster.', severity: 'A' },
  { risk: 'Opportunity cost', detail: 'Concentration on Haste = no Web, Hypnotic Pattern, or other control spells.', severity: 'A' },
  { risk: 'Caster exposed', detail: 'Caster must maintain concentration. If caster goes down, Haste drops and target is stunned.', severity: 'A' },
];

export const TWIN_HASTE = {
  method: 'Sorcerer: Twin Spell (3 SP) + Haste (L3 slot)',
  result: 'Two allies Hasted simultaneously. Best use of Twin Spell.',
  risk: 'If concentration drops: BOTH allies lose their next turn. Double the risk.',
  note: 'High risk, high reward. Protect concentration at all costs when Twin Hasting.',
};

export function hasteSpeedBonus(baseSpeed) {
  return { hasted: baseSpeed * 2, withDash: baseSpeed * 4, note: `Hasted speed: ${baseSpeed * 2}ft. With Dash + Haste Dash: ${baseSpeed * 4}ft.` };
}
