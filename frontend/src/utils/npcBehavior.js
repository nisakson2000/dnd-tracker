/**
 * NPC Behavior Engine — Phase 6C
 *
 * Generates NPC behavior suggestions based on personality traits,
 * motivations, trust, and situational context.
 */

// ── Personality Archetypes ──
export const PERSONALITY_ARCHETYPES = {
  schemer: {
    label: 'The Schemer',
    traits: ['cunning', 'ambitious', 'deceptive', 'patient'],
    motivations: ['power', 'control'],
    defaultFearCourage: 40,
    color: '#8b5cf6',
    description: 'Manipulative and calculating — always has a hidden agenda.',
  },
  guardian: {
    label: 'The Guardian',
    traits: ['loyal', 'brave', 'protective', 'honorable'],
    motivations: ['duty', 'protection'],
    defaultFearCourage: 75,
    color: '#3b82f6',
    description: 'Steadfast defender of their charge — honor above all.',
  },
  merchant: {
    label: 'The Merchant',
    traits: ['greedy', 'practical', 'risk-averse', 'shrewd'],
    motivations: ['wealth', 'stability'],
    defaultFearCourage: 30,
    color: '#f59e0b',
    description: 'Profit-driven and pragmatic — everything has a price.',
  },
  zealot: {
    label: 'The Zealot',
    traits: ['devoted', 'unyielding', 'charismatic', 'extreme'],
    motivations: ['faith', 'conversion'],
    defaultFearCourage: 80,
    color: '#ef4444',
    description: 'Unshakeable conviction — will sacrifice anything for their cause.',
  },
  outcast: {
    label: 'The Outcast',
    traits: ['suspicious', 'independent', 'resourceful', 'bitter'],
    motivations: ['survival', 'revenge'],
    defaultFearCourage: 50,
    color: '#6b7280',
    description: 'Mistrustful of others — self-reliance is their only creed.',
  },
  sage: {
    label: 'The Sage',
    traits: ['wise', 'curious', 'patient', 'detached'],
    motivations: ['knowledge', 'understanding'],
    defaultFearCourage: 35,
    color: '#06b6d4',
    description: 'Seeks truth above all — often lost in thought.',
  },
  trickster: {
    label: 'The Trickster',
    traits: ['witty', 'unpredictable', 'charming', 'selfish'],
    motivations: ['fun', 'freedom'],
    defaultFearCourage: 45,
    color: '#ec4899',
    description: 'Life is a game — and they intend to win while laughing.',
  },
  noble: {
    label: 'The Noble',
    traits: ['proud', 'commanding', 'generous', 'entitled'],
    motivations: ['legacy', 'status'],
    defaultFearCourage: 55,
    color: '#a855f7',
    description: 'Born to rule — expects deference and delivers magnanimity.',
  },
};

// ── All personality traits ──
export const ALL_TRAITS = [
  'brave', 'cowardly', 'cunning', 'honest', 'deceptive', 'loyal', 'treacherous',
  'greedy', 'generous', 'cruel', 'kind', 'patient', 'impulsive', 'suspicious',
  'trusting', 'proud', 'humble', 'ambitious', 'lazy', 'devoted', 'selfish',
  'protective', 'reckless', 'cautious', 'charismatic', 'shy', 'witty', 'serious',
  'vengeful', 'forgiving', 'stubborn', 'flexible', 'honorable', 'pragmatic',
];

// ── Motivation types ──
export const MOTIVATION_TYPES = [
  { id: 'wealth', label: 'Wealth & Prosperity', icon: 'coins' },
  { id: 'power', label: 'Power & Dominance', icon: 'crown' },
  { id: 'knowledge', label: 'Knowledge & Discovery', icon: 'book' },
  { id: 'faith', label: 'Faith & Devotion', icon: 'star' },
  { id: 'duty', label: 'Duty & Honor', icon: 'shield' },
  { id: 'protection', label: 'Protection of Others', icon: 'heart' },
  { id: 'revenge', label: 'Revenge & Justice', icon: 'sword' },
  { id: 'survival', label: 'Survival', icon: 'flame' },
  { id: 'freedom', label: 'Freedom & Independence', icon: 'wind' },
  { id: 'fun', label: 'Fun & Pleasure', icon: 'sparkles' },
  { id: 'legacy', label: 'Legacy & Reputation', icon: 'monument' },
  { id: 'love', label: 'Love & Connection', icon: 'heart' },
  { id: 'control', label: 'Control & Order', icon: 'lock' },
  { id: 'status', label: 'Status & Recognition', icon: 'award' },
  { id: 'conversion', label: 'Spreading the Cause', icon: 'megaphone' },
  { id: 'understanding', label: 'Understanding the World', icon: 'eye' },
  { id: 'stability', label: 'Stability & Peace', icon: 'home' },
];

// ── Trust level descriptions ──
export const TRUST_LEVELS = [
  { min: -100, max: -80, label: 'Sworn Enemy', color: '#7f1d1d', description: 'Actively plotting against the party' },
  { min: -79, max: -50, label: 'Hostile', color: '#dc2626', description: 'Refuses aid, may sabotage' },
  { min: -49, max: -20, label: 'Distrustful', color: '#f97316', description: 'Reluctant cooperation, higher prices' },
  { min: -19, max: 19, label: 'Neutral', color: '#6b7280', description: 'Transactional relationship' },
  { min: 20, max: 49, label: 'Friendly', color: '#22c55e', description: 'Offers unsolicited help, better prices' },
  { min: 50, max: 79, label: 'Devoted', color: '#3b82f6', description: 'Risks personal safety for the party' },
  { min: 80, max: 100, label: 'Unbreakable Bond', color: '#a855f7', description: 'Would die for the party, shares secrets' },
];

/**
 * Get the trust level for a given score.
 */
export function getTrustLevel(score) {
  return TRUST_LEVELS.find(l => score >= l.min && score <= l.max) || TRUST_LEVELS[3];
}

// ── Situation types the behavior engine can handle ──
const SITUATION_RESPONSES = {
  party_asks_for_help: (npc) => {
    const { traits, trust } = npc;
    if (trust >= 50) return { action: 'agree_eagerly', reason: 'High trust — devoted to party' };
    if (trust >= 20) return { action: 'agree', reason: 'Friendly — happy to help' };
    if (traits.includes('generous') || traits.includes('kind')) return { action: 'agree', reason: 'Kind nature — helps regardless' };
    if (traits.includes('greedy')) return { action: 'negotiate', reason: 'Greedy — demands payment first', dc: 'Persuasion DC 14' };
    if (trust <= -20) return { action: 'refuse', reason: 'Distrustful — wants nothing to do with party' };
    return { action: 'consider', reason: 'Neutral — weighs the request', dc: 'Persuasion DC 12' };
  },

  party_asks_for_discount: (npc) => {
    const { traits, trust } = npc;
    if (traits.includes('generous') && trust >= 20) return { action: 'give_discount', reason: 'Generous + friendly', discount: '15%' };
    if (trust >= 50) return { action: 'give_discount', reason: 'Devoted — offers best prices', discount: '20%' };
    if (traits.includes('greedy')) return { action: 'refuse_increase', reason: 'Greedy — offended by haggling, prices increase 10%' };
    if (trust >= 0) return { action: 'small_discount', reason: 'Neutral — token gesture', dc: 'Persuasion DC 15', discount: '5%' };
    return { action: 'refuse', reason: 'Hostile — refuses to deal', dc: 'Intimidation DC 18' };
  },

  party_asks_for_information: (npc) => {
    const { traits, trust } = npc;
    if (trust >= 50) return { action: 'share_freely', reason: 'Devoted — shares everything, even secrets' };
    if (trust >= 20 && !traits.includes('deceptive')) return { action: 'share', reason: 'Friendly — shares what they know' };
    if (traits.includes('deceptive') && trust < 20) return { action: 'mislead', reason: 'Deceptive — mixes truth with lies', dc: 'Insight DC 16' };
    if (traits.includes('suspicious')) return { action: 'withhold', reason: 'Suspicious — gives vague answers', dc: 'Persuasion DC 14' };
    if (trust <= -50) return { action: 'lie', reason: 'Hostile — actively deceives', dc: 'Insight DC 18' };
    return { action: 'partial', reason: 'Neutral — shares basic info only', dc: 'Persuasion DC 12' };
  },

  party_threatens: (npc) => {
    const { traits, fearCourage } = npc;
    if (traits.includes('brave') || fearCourage >= 70) return { action: 'stand_firm', reason: 'Brave — refuses to be intimidated' };
    if (traits.includes('cowardly') || fearCourage <= 30) return { action: 'submit', reason: 'Cowardly — capitulates immediately' };
    if (traits.includes('cunning')) return { action: 'pretend_submit', reason: 'Cunning — appears to comply, plans retaliation' };
    if (traits.includes('proud')) return { action: 'escalate', reason: 'Proud — takes offense, situation worsens' };
    return { action: 'consider', reason: 'Weighs options', dc: 'Intimidation DC 13' };
  },

  combat_morale_check: (npc) => {
    const { fearCourage, trust, hpPercentage } = npc;
    const morale = fearCourage + (trust * 0.3) + (hpPercentage * 0.5) - 30;
    if (morale >= 80) return { action: 'fight_recklessly', reason: 'High morale — inspires allies', morale: Math.round(morale) };
    if (morale >= 50) return { action: 'fight', reason: 'Solid morale — holds the line', morale: Math.round(morale) };
    if (morale >= 30) return { action: 'fight_cautiously', reason: 'Wavering — stays but takes fewer risks', morale: Math.round(morale) };
    if (morale >= 10) return { action: 'flee', reason: 'Breaking — attempts to flee', morale: Math.round(morale) };
    return { action: 'surrender', reason: 'Broken — surrenders or panics', morale: Math.round(morale) };
  },

  party_offers_gift: (npc) => {
    const { traits, trust } = npc;
    if (traits.includes('greedy')) return { action: 'accept_eagerly', reason: 'Greedy — delighted', trustChange: +10 };
    if (traits.includes('proud') && trust < 0) return { action: 'refuse', reason: 'Proud — sees gift as insult or bribe' };
    if (trust <= -50) return { action: 'suspicious', reason: 'Hostile — suspects a trap', trustChange: +2 };
    return { action: 'accept_gracefully', reason: 'Appreciates the gesture', trustChange: +5 };
  },

  party_breaks_promise: (npc) => {
    const { traits, trust } = npc;
    if (traits.includes('forgiving')) return { action: 'disappointed', reason: 'Forgiving — gives another chance', trustChange: -5 };
    if (traits.includes('vengeful')) return { action: 'retaliate', reason: 'Vengeful — plans payback', trustChange: -20 };
    if (trust >= 50) return { action: 'hurt', reason: 'Devoted — deeply hurt but loyal', trustChange: -15 };
    return { action: 'angry', reason: 'Trust broken — relationship damaged', trustChange: -10 };
  },
};

/**
 * Generate an NPC's likely response to a situation.
 *
 * @param {Object} npc - { traits: string[], trust: number, fearCourage: number, motivations: string[], hpPercentage?: number }
 * @param {string} situation - one of the SITUATION_RESPONSES keys
 * @returns {Object} { action, reason, dc?, trustChange?, morale?, discount? }
 */
export function predictBehavior(npc, situation) {
  const handler = SITUATION_RESPONSES[situation];
  if (!handler) {
    return { action: 'unknown', reason: 'No behavior model for this situation' };
  }
  return handler(npc);
}

/**
 * Get all available situations the behavior engine can handle.
 */
export function getAvailableSituations() {
  return [
    { id: 'party_asks_for_help', label: 'Party asks for help' },
    { id: 'party_asks_for_discount', label: 'Party asks for a discount' },
    { id: 'party_asks_for_information', label: 'Party asks for information' },
    { id: 'party_threatens', label: 'Party threatens the NPC' },
    { id: 'combat_morale_check', label: 'Combat morale check' },
    { id: 'party_offers_gift', label: 'Party offers a gift' },
    { id: 'party_breaks_promise', label: 'Party breaks a promise' },
  ];
}

/**
 * Calculate trust change from an action.
 * Returns the delta to apply to trust_score.
 */
export function calculateTrustChange(action, npcTraits = []) {
  const BASE_CHANGES = {
    complete_quest: 10,
    save_life: 15,
    give_gift_small: 3,
    give_gift_large: 8,
    keep_promise: 5,
    break_promise: -10,
    steal_from: -15,
    attack: -25,
    kill_ally: -40,
    insult: -5,
    help_in_combat: 8,
    betray: -50,
    protect_in_danger: 12,
    share_secret: 7,
    lie_to: -8,
    pay_debt: 5,
    ignore_plea: -7,
  };

  let change = BASE_CHANGES[action] || 0;

  // Trait modifiers
  if (npcTraits.includes('trusting') && change > 0) change = Math.round(change * 1.3);
  if (npcTraits.includes('suspicious') && change > 0) change = Math.round(change * 0.7);
  if (npcTraits.includes('vengeful') && change < 0) change = Math.round(change * 1.5);
  if (npcTraits.includes('forgiving') && change < 0) change = Math.round(change * 0.6);

  return change;
}

/**
 * Apply trust change and return new score + any threshold event.
 */
export function applyTrustChange(currentTrust, delta) {
  const newTrust = Math.max(-100, Math.min(100, currentTrust + delta));
  const oldLevel = getTrustLevel(currentTrust);
  const newLevel = getTrustLevel(newTrust);
  const thresholdCrossed = oldLevel.label !== newLevel.label;

  return {
    oldTrust: currentTrust,
    newTrust,
    delta,
    oldLevel: oldLevel.label,
    newLevel: newLevel.label,
    thresholdCrossed,
    thresholdEvent: thresholdCrossed ? `${oldLevel.label} → ${newLevel.label}` : null,
  };
}
