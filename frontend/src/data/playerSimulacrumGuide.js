/**
 * playerSimulacrumGuide.js
 * Player Mode: Simulacrum spell — the duplicate strategy
 * Pure JS — no React dependencies.
 */

export const SIMULACRUM_BASICS = {
  spell: 'Simulacrum',
  level: 7,
  school: 'Illusion',
  castingTime: '12 hours',
  range: 'Touch',
  components: 'V, S, M (snow/ice + 1,500 gp ruby dust, consumed)',
  duration: 'Until dispelled',
  classes: ['Wizard'],
  note: 'Creates a duplicate of a creature with half its HP max. Has all abilities, spell slots, and features. Cannot regain spell slots. Lasts until destroyed or dispelled.',
};

export const SIMULACRUM_RULES = {
  halfHP: 'Simulacrum has half the target\'s HP maximum.',
  noSlotRecovery: 'Cannot regain expended spell slots. Once used, gone forever.',
  noHealing: 'Cannot be healed by normal means. Must be repaired in an alchemical laboratory (100gp per HP, 24 hours per HP).',
  obedient: 'Simulacrum is friendly and obeys your commands.',
  oneAtATime: 'If you cast Simulacrum again, the previous one is immediately destroyed.',
  equipment: 'Simulacrum has duplicates of all equipment. Duplicated items disappear if Simulacrum is destroyed.',
  note: 'The most game-breaking spell in D&D. Your DM WILL have opinions about this.',
};

export const SIMULACRUM_STRATEGIES = [
  { strategy: 'Simulacrum of yourself', detail: 'Copy yourself. Clone has half your HP but all your class features and spell slots. It can fight alongside you.', rating: 'S', note: 'Two of you. Double concentration spells, double actions. The Sim can burn all its slots since it can\'t recover them.' },
  { strategy: 'Simulacrum of an ally', detail: 'Copy the Fighter or Paladin. They get half HP but full class features. Extra frontliner with no slot dependency.', rating: 'A', note: 'Martials make better Sim targets because they don\'t rely on spell slots.' },
  { strategy: 'Nova the Simulacrum', detail: 'Sim has all your spell slots. Have it burn everything in one fight. Use all highest-level spells. It was going to lose them anyway.', rating: 'S', note: 'The Sim can\'t recover slots. So blast everything. Wall of Force, Forcecage, all the big guns.' },
  { strategy: 'Wish + Simulacrum loop', detail: 'Sim of yourself casts Wish to create another Sim of you. New Sim has fresh spell slots. Repeat. Infinite army.', rating: 'BANNED', note: 'This is the most broken combo in D&D. Most DMs ban it outright. And they should.' },
];

export const SIMULACRUM_TARGETS_RANKED = [
  { target: 'Yourself (Full Caster)', value: 'S', reason: 'All your spell slots. Double concentration. Nova both sets of slots.' },
  { target: 'Party Fighter/Barbarian', value: 'A', reason: 'No slot dependency. Full martial features. Half HP but still effective.' },
  { target: 'Party Paladin', value: 'A', reason: 'Smite slots + Aura of Protection. Amazing even at half HP.' },
  { target: 'A Dragon (if you can touch one)', value: 'S', reason: 'Half a dragon\'s HP, all breath weapons, flight, resistances. Insane.' },
  { target: 'Another Full Caster', value: 'A', reason: 'Their slots + your slots. But they can\'t recover theirs. Nova them.' },
];

export const SIMULACRUM_LIMITS = [
  { limit: 'HP management', detail: 'Half your HP, can\'t heal normally. Sim dies faster. Keep it in back.' },
  { limit: 'No long rest recovery', detail: 'No slot recovery, no hit dice, no feature refreshes. One-shot resource.' },
  { limit: 'DM adjudication', detail: 'Most DMs will limit Simulacrum heavily. Discuss expectations before casting.' },
  { limit: 'Expensive', detail: '1,500 gp ruby dust consumed. 12-hour casting time. Not casual.' },
  { limit: 'Dispel Magic kills it', detail: 'One Dispel Magic and your 1,500gp investment is gone. Protect the Sim.' },
];

export function simulacrumHP(targetMaxHP) {
  return Math.floor(targetMaxHP / 2);
}

export function simulacrumRepairCost(hpToRestore) {
  return { gold: hpToRestore * 100, hours: hpToRestore * 24 };
}
