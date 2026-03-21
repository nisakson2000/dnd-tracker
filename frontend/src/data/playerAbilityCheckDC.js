/**
 * playerAbilityCheckDC.js
 * Player Mode: DC reference table and check success probability
 * Pure JS — no React dependencies.
 */

export const DC_TABLE = [
  { dc: 5, difficulty: 'Very Easy', description: 'Almost anyone can do this. Only a nat 1 fails (if using crit fail rules).', example: 'Climb a knotted rope. Swim in calm water. Recall common knowledge.' },
  { dc: 10, difficulty: 'Easy', description: 'A trained person succeeds most of the time.', example: 'Pick a simple lock. Track through mud. Recall relevant lore about a well-known place.' },
  { dc: 15, difficulty: 'Medium', description: 'Challenging but achievable for skilled characters.', example: 'Swim against a moderate current. Pick a standard lock. Persuade an indifferent NPC.' },
  { dc: 20, difficulty: 'Hard', description: 'Requires significant skill or luck.', example: 'Pick a high-quality lock. Track over hard ground. Convince a hostile NPC.' },
  { dc: 25, difficulty: 'Very Hard', description: 'Even experts struggle. Requires high modifiers or advantage.', example: 'Navigate a deadly maze. Pick a masterwork lock. Recall obscure arcane lore.' },
  { dc: 30, difficulty: 'Nearly Impossible', description: 'Legendary difficulty. Only the best of the best, with luck.', example: 'Track a creature through a windstorm. Convince a king to abdicate. Leap a 30ft chasm.' },
];

export const SUCCESS_PROBABILITY = {
  // modifier vs DC success chance on d20
  calculate: function(modifier, dc) {
    const needed = dc - modifier;
    if (needed <= 1) return 100; // auto-success (nat 1 doesn't auto-fail ability checks)
    if (needed > 20) return 0;
    return (21 - needed) * 5;
  },
};

export const PASSIVE_CHECK_RULES = {
  formula: '10 + all modifiers that normally apply',
  advantage: '+5 to passive score',
  disadvantage: '-5 to passive score',
  commonPassives: [
    { check: 'Passive Perception', use: 'Notice hidden creatures, traps, secrets without actively searching.' },
    { check: 'Passive Investigation', use: 'Notice clues, inconsistencies, illusory objects without actively searching.' },
    { check: 'Passive Insight', use: 'Detect when someone is lying without actively checking.' },
  ],
  note: 'Passive checks represent the FLOOR of what you notice. If you actively search, you roll — which could be lower than your passive.',
};

export const CONTESTED_CHECK_RULES = {
  description: 'Both sides roll. Higher total wins. Ties go to the status quo (the side being acted upon).',
  commonContests: [
    { action: 'Grapple', attacker: 'Athletics', defender: 'Athletics OR Acrobatics (defender\'s choice)' },
    { action: 'Shove', attacker: 'Athletics', defender: 'Athletics OR Acrobatics (defender\'s choice)' },
    { action: 'Hide', attacker: 'Stealth', defender: 'Perception' },
    { action: 'Deception', attacker: 'Deception', defender: 'Insight' },
    { action: 'Disguise', attacker: 'Deception (with kit)', defender: 'Investigation' },
  ],
};

export const SKILL_CHECK_TIPS = [
  'You can\'t retry a failed check unless circumstances change (new information, different approach).',
  'Nat 20 on ability checks is NOT auto-success (RAW). Nat 1 is NOT auto-fail. DC matters.',
  'Ask to use a different ability with a skill (Athletics with CON for endurance). DM decides.',
  'Help action gives advantage. Always look for ways to help each other.',
  'Guidance adds 1d4 to any ability check. Clerics and Druids should cast it constantly.',
  'Bardic Inspiration adds a die to ability checks too, not just attacks/saves.',
  'Reliable Talent (Rogue 11): minimum 10 on proficient skill checks. Incredibly powerful.',
];

export function calculateSuccessChance(modifier, dc) {
  return SUCCESS_PROBABILITY.calculate(modifier, dc);
}

export function getDCDescription(dc) {
  return DC_TABLE.find(d => dc <= d.dc) || DC_TABLE[DC_TABLE.length - 1];
}

export function calculatePassive(modifier, hasAdvantage, hasDisadvantage) {
  let passive = 10 + modifier;
  if (hasAdvantage) passive += 5;
  if (hasDisadvantage) passive -= 5;
  return passive;
}
