/**
 * Character Arc System — PC Growth & Narrative Tracking
 *
 * Covers roadmap items 255-268 (Bond/Flaw/Ideal triggers, Character arc tracking,
 * PC-NPC relationships, Legacy score, Broken promises, Debt tracking, etc.)
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Bond Trigger Templates ──
export const BOND_TRIGGERS = [
  { bond: 'I would die to recover an ancient relic of my faith.', triggers: ['discover a temple', 'find a holy relic', 'meet a priest of the same faith', 'hear about a desecrated shrine'] },
  { bond: 'I will do anything to protect the temple where I served.', triggers: ['temple is threatened', 'letter from temple', 'meet someone from hometown', 'hear news of attack on temple'] },
  { bond: 'I owe my life to the priest who took me in.', triggers: ['encounter the priest or their order', 'someone else needs rescuing', 'religious ceremony', 'opportunity to repay kindness'] },
  { bond: 'My family is the most important thing in my life.', triggers: ['family mentioned or threatened', 'someone else\'s family is in danger', 'holiday or anniversary', 'letter from home'] },
  { bond: 'I\'m trying to pay off an old debt I owe to a generous benefactor.', triggers: ['encounter wealthy NPC', 'opportunity to earn significant gold', 'benefactor sends word', 'someone else is in debt'] },
  { bond: 'Someone I loved died because of a mistake I made.', triggers: ['similar situation arises', 'visit a graveyard', 'anniversary of the death', 'someone else makes a fatal error'] },
];

// ── Flaw Trigger Templates ──
export const FLAW_TRIGGERS = [
  { flaw: 'I have a weakness for the vices of the city, especially hard drink.', triggers: ['enter a tavern', 'offered alcohol', 'celebration or festival', 'stressful situation resolved'] },
  { flaw: 'I\'m convinced of the significance of my destiny.', triggers: ['humbled by failure', 'prophecy or omen', 'someone doubts them', 'achieve something notable'] },
  { flaw: 'I am suspicious of strangers and expect the worst of people.', triggers: ['meet new NPC', 'someone offers help freely', 'unfamiliar town', 'betrayal by someone trusted'] },
  { flaw: 'Once I pick a goal, I become obsessed to the detriment of everything else.', triggers: ['new quest acquired', 'allies want to take a different path', 'conflicting objectives', 'setback on current goal'] },
  { flaw: 'I am inflexible in my thinking.', triggers: ['presented with moral gray area', 'ally suggests compromise', 'rules don\'t fit situation', 'cultural differences'] },
  { flaw: 'I\'d rather eat my armor than admit when I\'m wrong.', triggers: ['proven wrong about something', 'ally has a better plan', 'mistake leads to consequences', 'NPC calls out their error'] },
];

// ── Ideal Templates ──
export const IDEAL_CATEGORIES = {
  good: [
    { ideal: 'Charity', description: 'I always try to help those in need, no matter the cost.', conflicts: ['opportunity to profit from suffering', 'helping someone who wronged you', 'charity vs self-preservation'] },
    { ideal: 'Protection', description: 'I must protect those who cannot protect themselves.', conflicts: ['protecting innocents vs completing mission', 'protecting enemy civilians', 'overwhelming odds'] },
  ],
  lawful: [
    { ideal: 'Tradition', description: 'The old ways must be preserved and upheld.', conflicts: ['tradition causes harm', 'new way is clearly better', 'tradition conflicts with justice'] },
    { ideal: 'Honor', description: 'If I dishonor myself, I dishonor my whole clan.', conflicts: ['honor vs survival', 'enemy fights dishonorably', 'honorable path is the wrong path'] },
  ],
  chaotic: [
    { ideal: 'Freedom', description: 'Chains are meant to be broken, as are those who would forge them.', conflicts: ['structure provides safety', 'freedom causes chaos', 'someone chooses to serve willingly'] },
    { ideal: 'Independence', description: 'When people follow orders blindly, they embrace a kind of tyranny.', conflicts: ['need to follow a plan', 'ally gives reasonable order', 'teamwork requires compromise'] },
  ],
  evil: [
    { ideal: 'Power', description: 'I will do whatever it takes to gain more power.', conflicts: ['power requires sacrifice', 'someone offers alliance of equals', 'power corrupts'] },
    { ideal: 'Might', description: 'The strong rule. The weak serve. That\'s the natural order.', conflicts: ['weak person shows unexpected strength', 'stronger foe shows mercy', 'compassion'] },
  ],
  neutral: [
    { ideal: 'Knowledge', description: 'The path to power and self-improvement is through knowledge.', conflicts: ['knowledge is dangerous', 'forbidden lore', 'action needed, not study'] },
    { ideal: 'Balance', description: 'There is a natural order to everything, and meddling with it is dangerous.', conflicts: ['injustice requires intervention', 'doing nothing causes harm', 'balance vs compassion'] },
  ],
};

// ── Relationship Types (PC-NPC) ──
export const RELATIONSHIP_TYPES = [
  { type: 'Stranger', level: 0, description: 'No prior interaction. Default starting state.' },
  { type: 'Acquaintance', level: 1, description: 'Brief interaction. Recognizes face/name.' },
  { type: 'Contact', level: 2, description: 'Has worked with or helped. Will share basic information.' },
  { type: 'Ally', level: 3, description: 'Reliable helper. Will assist within reason.' },
  { type: 'Friend', level: 4, description: 'Genuine affection. Will take risks to help.' },
  { type: 'Confidant', level: 5, description: 'Deep trust. Shares secrets. Will sacrifice for this person.' },
  { type: 'Rival', level: -1, description: 'Competitive relationship. Not hostile but not helpful.' },
  { type: 'Enemy', level: -3, description: 'Actively opposed. Will work against their interests.' },
  { type: 'Nemesis', level: -5, description: 'Personal vendetta. Will go to great lengths to destroy.' },
  { type: 'Mentor', level: 4, description: 'Teacher/guide relationship. Respected authority.' },
  { type: 'Protégé', level: 3, description: 'Student/ward. Feels responsible for their growth.' },
  { type: 'Love Interest', level: 4, description: 'Romantic attraction. Complicated feelings.' },
  { type: 'Betrayed', level: -4, description: 'Trust was broken. Deep hurt drives the relationship.' },
];

// ── Relationship Events ──
export const RELATIONSHIP_EVENTS = [
  { event: 'Saved their life', pointChange: 2, description: 'Risked yourself to protect them.' },
  { event: 'Shared a secret', pointChange: 1, description: 'Trusted them with private information.' },
  { event: 'Kept a promise', pointChange: 1, description: 'Followed through on a commitment.' },
  { event: 'Broke a promise', pointChange: -2, description: 'Failed to fulfill a commitment.' },
  { event: 'Gave a gift', pointChange: 1, description: 'Offered something meaningful.' },
  { event: 'Lied to them', pointChange: -1, description: 'Deceived them (may be worse if discovered).' },
  { event: 'Betrayed trust', pointChange: -3, description: 'Acted against their interests after gaining trust.' },
  { event: 'Fought together', pointChange: 1, description: 'Shared danger strengthens bonds.' },
  { event: 'Disagreed publicly', pointChange: -1, description: 'Embarrassed or contradicted them.' },
  { event: 'Asked for help', pointChange: 0, description: 'Neutral — depends on whether help was given.' },
  { event: 'Helped without asking', pointChange: 2, description: 'Anticipated their need and acted.' },
  { event: 'Stole from them', pointChange: -2, description: 'Took something that belonged to them.' },
  { event: 'Forgave a wrong', pointChange: 2, description: 'Let go of a legitimate grievance.' },
  { event: 'Avenged them', pointChange: 2, description: 'Punished someone who wronged them.' },
  { event: 'Ignored their plea', pointChange: -2, description: 'Refused to help when they needed it.' },
];

// ── Legacy Score Components ──
export const LEGACY_CATEGORIES = {
  heroism: { label: 'Heroism', description: 'Brave deeds, protecting innocents, self-sacrifice', examples: ['Defeated a tyrant', 'Saved a village', 'Stood against overwhelming odds'] },
  infamy: { label: 'Infamy', description: 'Cruel acts, wanton destruction, betrayal', examples: ['Burned a village', 'Betrayed an ally', 'Tortured a prisoner'] },
  wisdom: { label: 'Wisdom', description: 'Solving problems diplomatically, learning, teaching', examples: ['Brokered a peace', 'Discovered ancient knowledge', 'Mentored a student'] },
  wealth: { label: 'Wealth', description: 'Accumulation and distribution of riches', examples: ['Built a trade empire', 'Donated to the poor', 'Discovered a treasure hoard'] },
  faith: { label: 'Faith', description: 'Religious devotion, divine acts, temple service', examples: ['Built a temple', 'Received divine blessing', 'Converted a community'] },
  exploration: { label: 'Exploration', description: 'Discovering new places, mapping unknown lands', examples: ['Mapped a new continent', 'Found a lost city', 'Navigated the Underdark'] },
};

// ── Promise/Debt Tracking ──
export const PROMISE_STATUS = ['Active', 'Fulfilled', 'Broken', 'Expired', 'Forgiven'];
export const DEBT_TYPES = ['Gold', 'Favor', 'Service', 'Life Debt', 'Information', 'Protection'];

/**
 * Get relationship type by level.
 */
export function getRelationshipType(level) {
  const sorted = [...RELATIONSHIP_TYPES].sort((a, b) => Math.abs(b.level) - Math.abs(a.level));
  if (level >= 0) {
    return sorted.find(r => r.level >= 0 && r.level <= level) || RELATIONSHIP_TYPES[0];
  }
  return sorted.find(r => r.level < 0 && r.level >= level) || RELATIONSHIP_TYPES.find(r => r.type === 'Enemy');
}

/**
 * Get bond triggers for narrative prompting.
 */
export function checkBondTrigger(bondText, currentScene) {
  const bond = BOND_TRIGGERS.find(b => bondText.toLowerCase().includes(b.bond.toLowerCase().substring(0, 20)));
  if (!bond) return null;
  const matchedTrigger = bond.triggers.find(t => currentScene.toLowerCase().includes(t.toLowerCase()));
  return matchedTrigger ? { bond: bond.bond, trigger: matchedTrigger } : null;
}

/**
 * Get ideal conflicts for a given alignment tendency.
 */
export function getIdealConflicts(alignment) {
  return IDEAL_CATEGORIES[alignment] || IDEAL_CATEGORIES.neutral;
}

/**
 * Generate a relationship event suggestion.
 */
export function suggestRelationshipEvent(currentLevel) {
  if (currentLevel >= 3) {
    return pick(RELATIONSHIP_EVENTS.filter(e => e.pointChange !== 0));
  }
  return pick(RELATIONSHIP_EVENTS.filter(e => e.pointChange > 0));
}

export { RELATIONSHIP_TYPES as RELATIONSHIP_LEVELS };
