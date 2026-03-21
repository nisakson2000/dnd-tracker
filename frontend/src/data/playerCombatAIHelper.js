/**
 * playerCombatAIHelper.js
 * Player Mode: AI-style combat decision helper for optimal play suggestions
 * Pure JS — no React dependencies.
 */

export const DECISION_TREE = {
  startOfTurn: [
    { check: 'Am I concentrating on a spell?', yes: 'Protect it. Don\'t take unnecessary risks.', no: 'Consider casting a concentration spell.' },
    { check: 'Am I below 25% HP?', yes: 'Heal yourself, Disengage, or use defensive ability.', no: 'Continue normally.' },
    { check: 'Is an ally at 0 HP?', yes: 'Healing Word (bonus action). Stabilize if no spell.', no: 'Focus on offense or control.' },
    { check: 'Are enemies clustered?', yes: 'AoE spell (Fireball, Shatter, Thunderwave).', no: 'Single-target attacks.' },
    { check: 'Is the biggest threat still alive?', yes: 'Focus fire on the biggest threat.', no: 'Mop up remaining enemies.' },
  ],
  actionChoice: [
    { situation: 'Enemy caster is alive and within range', action: 'Kill the caster or Counterspell their spells.', priority: 1 },
    { situation: 'Enemy is nearly dead (below ~15 HP)', action: 'Finish them off. Dead enemies deal 0 damage.', priority: 2 },
    { situation: 'Multiple enemies in AoE range', action: 'AoE spell or ability. Damage multiple targets.', priority: 3 },
    { situation: 'Boss with Legendary Resistance remaining', action: 'Use cheap save-or-suck to burn LR. Don\'t waste big spells.', priority: 4 },
    { situation: 'Open battlefield, no immediate threat', action: 'Highest-DPR attack on primary target.', priority: 5 },
  ],
  bonusAction: [
    { situation: 'Have Healing Word and ally is down', action: 'Healing Word the downed ally. Always.', priority: 1 },
    { situation: 'Have Spiritual Weapon active', action: 'Attack with Spiritual Weapon.', priority: 2 },
    { situation: 'Have Hex/Hunter\'s Mark and target is dead', action: 'Move the mark to a new target.', priority: 3 },
    { situation: 'Have off-hand weapon', action: 'Off-hand attack (but Cunning Action is usually better for Rogues).', priority: 4 },
    { situation: 'Nothing to use bonus on', action: 'Consider if any class features or items use bonus action.', priority: 5 },
  ],
  reaction: [
    { trigger: 'Enemy casts a spell within 60ft', action: 'Counterspell if you have it and it\'s a dangerous spell.', priority: 1 },
    { trigger: 'You\'re hit by an attack', action: 'Shield (+5 AC) or Absorb Elements (if elemental damage).', priority: 2 },
    { trigger: 'Enemy moves away from you in melee', action: 'Opportunity Attack. Free damage.', priority: 3 },
    { trigger: 'Ally is hit by an attack within 5ft', action: 'Protection Fighting Style (impose disadvantage) if you have it.', priority: 4 },
  ],
};

export const QUICK_DECISIONS = [
  { question: 'Attack or spell?', answer: 'Spell if it affects multiple enemies or applies a condition. Attack for single-target damage.' },
  { question: 'Heal or attack?', answer: 'Attack unless someone is at 0 HP. Dead enemies prevent all future damage.' },
  { question: 'Focus fire or spread damage?', answer: 'Focus fire. Always. A dead enemy does 0 damage.' },
  { question: 'Move or stay?', answer: 'Move if you can get cover, avoid AoE, or reach a better target. Stay if you\'re well-positioned.' },
  { question: 'Save spell slot or use it?', answer: 'Use it if the fight is real. Save if it\'s obviously easy or you know there\'s a boss ahead.' },
  { question: 'Risk opportunity attack to reposition?', answer: 'Usually no. Use Disengage or Misty Step. Unless the repositioning is critical.' },
];

export const OPTIMAL_PLAY_RULES = [
  'Action Economy wins fights. Anything that gives you more actions or removes enemy actions is top-tier.',
  'Focus fire. An enemy at 1 HP deals the same damage as at full HP. Dead = 0 damage.',
  'Protect concentration. A dropped concentration spell wastes your slot AND your action.',
  'Reactions are free actions. Never waste them. Shield, Counterspell, or Opportunity Attack.',
  'Bonus actions should be used every turn if possible. An unused bonus action is waste.',
  'Positioning matters as much as actions. Cover, flanking, and AoE avoidance are crucial.',
  'Know when to retreat. A TPK helps no one. Live to fight another day.',
];

export function suggestAction(hp, maxHp, allyDown, enemyCaster, enemiesClustered) {
  if (allyDown) return { action: 'Healing Word on downed ally', type: 'bonus', priority: 'Critical' };
  if (hp / maxHp < 0.25) return { action: 'Disengage + retreat or self-heal', type: 'action', priority: 'High' };
  if (enemyCaster) return { action: 'Attack or Counterspell the enemy caster', type: 'action', priority: 'High' };
  if (enemiesClustered) return { action: 'AoE damage spell (Fireball, Shatter)', type: 'action', priority: 'Medium' };
  return { action: 'Attack highest-priority target', type: 'action', priority: 'Normal' };
}

export function getDecisionTree(phase) {
  return DECISION_TREE[phase] || [];
}
