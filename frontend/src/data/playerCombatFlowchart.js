/**
 * playerCombatFlowchart.js
 * Player Mode: Decision flowcharts for common combat situations
 * Pure JS — no React dependencies.
 */

export const ATTACK_FLOWCHART = [
  { question: 'Can you see the target?', yes: 'Continue', no: 'Disadvantage on attack (or can\'t target for spells requiring sight).' },
  { question: 'Are you within range?', yes: 'Continue', no: 'Move closer or Dash. Can\'t attack if out of range.' },
  { question: 'Is there an enemy within 5ft of you?', yes: 'Disadvantage on ranged attacks.', no: 'Ranged attacks are normal.' },
  { question: 'Do you have advantage from any source?', yes: 'Roll 2d20, take higher.', no: 'Roll normally.' },
  { question: 'Do you have disadvantage from any source?', yes: 'Roll 2d20, take lower (advantage + disadvantage = normal).', no: 'Roll normally.' },
  { question: 'Roll d20 + attack mod. Meet or beat AC?', yes: 'HIT! Roll damage.', no: 'MISS. End attack.' },
  { question: 'Natural 20?', yes: 'CRITICAL HIT! Double all damage dice.', no: 'Normal damage.' },
  { question: 'Natural 1?', yes: 'AUTO MISS regardless of modifiers.', no: 'Apply normal hit/miss.' },
];

export const SHOULD_I_SPELL_FLOWCHART = [
  { question: 'Do I have spell slots remaining?', yes: 'Continue', no: 'Use cantrips or weapon attacks.' },
  { question: 'Will this spell significantly impact the fight?', yes: 'Continue', no: 'Use a cantrip instead. Save the slot.' },
  { question: 'How many encounters remain today?', answer: '2+: Be conservative. 1: Go nova. 0: Save for emergencies.' },
  { question: 'Will this require concentration?', yes: 'Is it better than what I\'m concentrating on?', no: 'Fewer restrictions. Slightly more favorable.' },
  { question: 'Can I achieve similar results with a lower slot?', yes: 'Use the lower slot.', no: 'Use the minimum effective slot.' },
  { question: 'Will multiple enemies be affected?', yes: 'AoE is efficient. Fireball it.', no: 'Single-target: consider if the slot is worth it vs just attacking.' },
];

export const HEAL_OR_ATTACK_FLOWCHART = [
  { question: 'Is an ally at 0 HP?', yes: 'Healing Word (bonus action) → then attack with your action.', no: 'Continue to next question.' },
  { question: 'Is an ally below 25% HP and being targeted?', yes: 'Consider healing. But killing the enemy may be better "healing."', no: 'Attack. Prevention > cure.' },
  { question: 'Can you kill an enemy this turn?', yes: 'ATTACK. Dead enemies deal 0 damage. Best healing in the game.', no: 'Evaluate: is healing more impactful than chip damage?' },
  { question: 'Are multiple allies in danger?', yes: 'Mass Healing Word or area healing. Otherwise, prioritize the most endangered.', no: 'Attack unless the one ally is critically low.' },
];

export const RETREAT_FLOWCHART = [
  { question: 'Is more than half the party down?', yes: 'RETREAT. Now.', no: 'Continue fighting.' },
  { question: 'Is the healer down and no one can pick them up?', yes: 'RETREAT or stabilize healer immediately.', no: 'Continue.' },
  { question: 'Are you out of healing resources AND multiple allies are low?', yes: 'Strongly consider retreat.', no: 'Continue.' },
  { question: 'Are reinforcements arriving for the enemy?', yes: 'Retreat before they arrive. Action economy will get worse.', no: 'Continue.' },
  { question: 'Can you escape safely?', yes: 'Disengage + Dash. Fog Cloud. Misty Step.', no: 'Fighting may be your only option. Go all-in.' },
];

export function getFlowchart(type) {
  const charts = {
    attack: ATTACK_FLOWCHART,
    spell: SHOULD_I_SPELL_FLOWCHART,
    heal: HEAL_OR_ATTACK_FLOWCHART,
    retreat: RETREAT_FLOWCHART,
  };
  return charts[type] || null;
}
