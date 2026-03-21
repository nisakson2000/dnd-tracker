/**
 * playerMoralDilemmas.js
 * Player Mode: Moral dilemma scenarios and alignment-testing situations
 * Pure JS — no React dependencies.
 */

export const MORAL_DILEMMAS = [
  { scenario: 'The Prisoner', situation: 'You captured a bandit who knows where the hostages are. He won\'t talk willingly.', options: ['Intimidate (may lie under pressure)', 'Torture (effective but evil act)', 'Zone of Truth (requires spell slot + cleric)', 'Release and follow (risky but honorable)', 'Bribe (costs gold but preserves morality)'], alignmentTest: 'Good vs Pragmatic' },
  { scenario: 'The Plague Village', situation: 'A village is infected with magical plague. Quarantine saves the region but dooms the village.', options: ['Quarantine (utilitarian — save the many)', 'Risk infection to find a cure (heroic but dangerous)', 'Burn the village (extreme but ensures containment)', 'Pray for divine intervention (uncertain)', 'Seek a powerful healer (costs time the village may not have)'], alignmentTest: 'Law vs Compassion' },
  { scenario: 'The Traitor Ally', situation: 'An NPC ally has been secretly working for the enemy. They claim they were coerced.', options: ['Execute them (justice/safety)', 'Forgive and watch closely (mercy with caution)', 'Turn them into a double agent (pragmatic)', 'Exile them (compromise)', 'Let the party vote (democratic)'], alignmentTest: 'Mercy vs Justice' },
  { scenario: 'The Innocent Shield', situation: 'The villain is using innocent hostages as shields. You have one shot to stop the ritual.', options: ['Take the shot (some innocents die, ritual stops)', 'Find another way (risk ritual completing)', 'Negotiate (villain may stall for time)', 'Sacrifice yourself to create a distraction', 'Cast a creative spell to separate them'], alignmentTest: 'Sacrifice vs Caution' },
  { scenario: 'The Cursed Artifact', situation: 'A powerful artifact can save your quest but corrupts its user over time.', options: ['Use it sparingly (risk corruption)', 'Destroy it (lose the power)', 'Let the strongest-willed character wield it', 'Seek to purify it (quest within a quest)', 'Give it to an NPC (passes the moral burden)'], alignmentTest: 'Power vs Wisdom' },
  { scenario: 'The Bounty', situation: 'You\'re offered a massive bounty to kill someone who turns out to be innocent — framed by your employer.', options: ['Refuse and expose the employer', 'Fake the death and help the target escape', 'Confront the employer (risky)', 'Complete the contract (honor your word?)', 'Investigate further before acting'], alignmentTest: 'Honor vs Truth' },
];

export const ALIGNMENT_RESPONSES = {
  'Lawful Good': 'Follow the rules AND do the right thing. Seek justice through proper channels.',
  'Neutral Good': 'Do the right thing, rules be damned. Help people however you can.',
  'Chaotic Good': 'Break unjust rules. Fight for freedom and individual rights.',
  'Lawful Neutral': 'Follow the law and established order. Personal feelings don\'t matter.',
  'True Neutral': 'Maintain balance. Act in self-interest without causing unnecessary harm.',
  'Chaotic Neutral': 'Do whatever you want. No rules, no obligations — but not cruel.',
  'Lawful Evil': 'Use systems and rules to gain power. Exploit the law for personal gain.',
  'Neutral Evil': 'Self-interest above all. Betray anyone if it benefits you.',
  'Chaotic Evil': 'Destroy, dominate, cause suffering. Pure selfishness and cruelty.',
};

export const ROLEPLAY_TIPS = [
  'Your character\'s choice doesn\'t have to match YOUR morality. Play the character.',
  'Discuss moral dilemmas in-character. It creates amazing roleplay moments.',
  'There\'s no "right answer." The best choice is the one that makes the best story.',
  'Lawful doesn\'t mean stupid. Evil doesn\'t mean murder-hobo.',
  'Consider what your character has experienced. Trauma shapes moral responses.',
  'It\'s okay to disagree with other PCs. Handle it through roleplay, not arguments.',
];

export function getDilemma(scenario) {
  return MORAL_DILEMMAS.find(d =>
    d.scenario.toLowerCase().includes((scenario || '').toLowerCase())
  ) || null;
}

export function getRandomDilemma() {
  return MORAL_DILEMMAS[Math.floor(Math.random() * MORAL_DILEMMAS.length)];
}

export function getAlignmentResponse(alignment) {
  return ALIGNMENT_RESPONSES[alignment] || 'Unknown alignment.';
}
