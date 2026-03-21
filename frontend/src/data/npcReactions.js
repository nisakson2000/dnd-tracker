/**
 * NPC Reaction System — Disposition, Trust, Gossip, Betrayal
 *
 * Covers roadmap items 205-220 (NPC Depth — relationship web, death cascade,
 * emotional state, mood decay, memory, trust, daily routines, betrayal, gossip, aging).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── NPC Dispositions (DMG p.244) ──
export const DISPOSITIONS = [
  { level: -2, label: 'Hostile', description: 'Will oppose, attack, or sabotage. Only threats or overwhelming force work.', dcMod: 10, color: '#ef4444' },
  { level: -1, label: 'Unfriendly', description: 'Suspicious and uncooperative. Requires persuasion for even basic help.', dcMod: 5, color: '#f97316' },
  { level: 0,  label: 'Indifferent', description: 'Neutral. Will help if it benefits them. Default for strangers.', dcMod: 0, color: '#6b7280' },
  { level: 1,  label: 'Friendly', description: 'Willing to help within reason. Shares information and offers fair deals.', dcMod: -5, color: '#22c55e' },
  { level: 2,  label: 'Helpful', description: 'Actively assists. Will take risks and share secrets.', dcMod: -10, color: '#3b82f6' },
];

// ── NPC Trust Levels ──
export const TRUST_LEVELS = [
  { min: -10, max: -6, label: 'Sworn Enemy', description: 'Will actively work to harm the party', color: '#7f1d1d' },
  { min: -5,  max: -3, label: 'Distrustful', description: 'Assumes the worst about party intentions', color: '#dc2626' },
  { min: -2,  max: -1, label: 'Wary', description: 'Cautious and guarded, gives minimal information', color: '#f97316' },
  { min: 0,   max: 2,  label: 'Neutral', description: 'No strong opinion, judges by immediate actions', color: '#6b7280' },
  { min: 3,   max: 5,  label: 'Trusting', description: 'Believes the party means well, shares freely', color: '#22c55e' },
  { min: 6,   max: 8,  label: 'Loyal', description: 'Stands by the party, defends their reputation', color: '#3b82f6' },
  { min: 9,   max: 10, label: 'Devoted', description: 'Would sacrifice for the party, unshakable faith', color: '#7c3aed' },
];

// ── Emotional States ──
export const EMOTIONAL_STATES = {
  calm: { label: 'Calm', description: 'Neutral baseline. Open to conversation.', socialMod: 0, combatMod: 0, decayTo: 'calm', decaySessions: 0 },
  happy: { label: 'Happy', description: 'In good spirits. More generous and talkative.', socialMod: -2, combatMod: 0, decayTo: 'calm', decaySessions: 2 },
  angry: { label: 'Angry', description: 'Short-tempered. Intimidation easier, persuasion harder.', socialMod: 2, combatMod: 1, decayTo: 'irritated', decaySessions: 1 },
  irritated: { label: 'Irritated', description: 'Mildly annoyed. Less patient.', socialMod: 1, combatMod: 0, decayTo: 'calm', decaySessions: 1 },
  afraid: { label: 'Afraid', description: 'Fearful. Will flee if threatened, but may share info to save themselves.', socialMod: -3, combatMod: -2, decayTo: 'nervous', decaySessions: 2 },
  nervous: { label: 'Nervous', description: 'On edge. Speaks quickly, looks around often.', socialMod: 0, combatMod: -1, decayTo: 'calm', decaySessions: 1 },
  grieving: { label: 'Grieving', description: 'Processing loss. Withdrawn and distracted.', socialMod: 3, combatMod: -1, decayTo: 'melancholy', decaySessions: 3 },
  melancholy: { label: 'Melancholy', description: 'Quietly sad. Speaks less, shorter responses.', socialMod: 1, combatMod: 0, decayTo: 'calm', decaySessions: 2 },
  suspicious: { label: 'Suspicious', description: 'Distrustful. Watches party closely, gives half-truths.', socialMod: 3, combatMod: 0, decayTo: 'wary', decaySessions: 2 },
  wary: { label: 'Wary', description: 'Cautious but not hostile. Measures words carefully.', socialMod: 1, combatMod: 0, decayTo: 'calm', decaySessions: 1 },
  elated: { label: 'Elated', description: 'Overjoyed. Generous, may offer rewards or share secrets.', socialMod: -5, combatMod: 0, decayTo: 'happy', decaySessions: 1 },
  desperate: { label: 'Desperate', description: 'At their wit\'s end. Will agree to almost anything.', socialMod: -5, combatMod: 2, decayTo: 'afraid', decaySessions: 1 },
  vengeful: { label: 'Vengeful', description: 'Consumed by desire for revenge. Single-minded.', socialMod: 5, combatMod: 2, decayTo: 'angry', decaySessions: 3 },
};

// ── NPC Death Cascade Effects ──
export const DEATH_CASCADE = {
  family: [
    'Spouse falls into deep grief — becomes reclusive, may refuse to help party',
    'Children become orphans — may seek adoption, join thieves guild, or seek revenge',
    'Parents age visibly from grief — may blame the party',
    'Siblings take over the deceased\'s responsibilities — may or may not honor deals',
  ],
  faction: [
    'Faction leadership struggles — power vacuum creates internal conflict',
    'Faction morale drops — members become less effective, some desert',
    'Successor rises with different priorities — may change faction\'s stance toward party',
    'Faction seeks revenge if death was party\'s fault',
  ],
  economy: [
    'If merchant: prices increase at their shop, supply chain disrupted',
    'If employer: workers become unemployed, may turn to crime',
    'If noble: estates contested, taxes shift, tenants suffer uncertainty',
    'If artisan: quality goods become scarce, competitors raise prices',
  ],
  quests: [
    'Quests given by NPC become uncompletable — unless successor takes over',
    'Secrets the NPC held die with them — alternative sources may exist',
    'Rewards promised by NPC are void — faction may or may not honor them',
    'NPC\'s death may be the trigger for OTHER quests (revenge, investigation)',
  ],
};

// ── Betrayal Engine ──
export const BETRAYAL_TRIGGERS = [
  { trigger: 'Gold exceeds loyalty', description: 'NPC offered more gold than their trust level justifies', threshold: 'Trust < 5 AND bribe > 100 gp' },
  { trigger: 'Fear exceeds loyalty', description: 'NPC threatened with consequences worse than betraying party', threshold: 'Trust < 7 AND threat is credible' },
  { trigger: 'Secret agenda activated', description: 'NPC\'s hidden goal is now achievable by betraying party', threshold: 'NPC has hidden agenda AND opportunity arises' },
  { trigger: 'Faction loyalty conflict', description: 'NPC\'s faction demands action against party', threshold: 'Faction loyalty > party loyalty' },
  { trigger: 'Moral line crossed', description: 'Party did something the NPC finds unforgivable', threshold: 'Party action crosses NPC\'s moral boundary' },
  { trigger: 'Survival instinct', description: 'NPC believes staying with party will get them killed', threshold: 'Multiple near-death experiences while with party' },
];

// ── Gossip Network ──
export const GOSSIP_SPREAD_RATES = {
  tavern: { speed: 'fast', reach: 'local', reliability: 'low', description: 'Rumors spread in hours but become exaggerated.' },
  market: { speed: 'fast', reach: 'regional', reliability: 'medium', description: 'Merchants carry news between towns accurately.' },
  temple: { speed: 'medium', reach: 'regional', reliability: 'high', description: 'Clergy network shares verified information.' },
  thievesGuild: { speed: 'fast', reach: 'urban', reliability: 'medium', description: 'Criminal networks know things others don\'t.' },
  court: { speed: 'slow', reach: 'kingdom', reliability: 'medium', description: 'Court gossip reaches far but slowly.' },
  military: { speed: 'medium', reach: 'frontlines', reliability: 'high', description: 'Scouts and messengers carry tactical information.' },
};

// ── NPC Aging Effects ──
export const AGING_EFFECTS = {
  child: { ageRange: '0-12', effects: 'Small size, limited skills, trusting, easily frightened', statMod: { STR: -4, CON: -2 } },
  youth: { ageRange: '13-17', effects: 'Still growing, impulsive, eager to prove themselves', statMod: { WIS: -2 } },
  youngAdult: { ageRange: '18-30', effects: 'Peak physical condition, ambitious, adventurous', statMod: {} },
  adult: { ageRange: '31-50', effects: 'Experienced, established, often with family/career', statMod: {} },
  middleAged: { ageRange: '51-70', effects: 'Wise, some physical decline, wealthy from years of work', statMod: { STR: -1, DEX: -1, WIS: 1 } },
  elderly: { ageRange: '71-90', effects: 'Frail but wise, repository of knowledge', statMod: { STR: -2, DEX: -2, CON: -1, WIS: 2 } },
  ancient: { ageRange: '90+', effects: 'Venerable, fragile, deeply respected or forgotten', statMod: { STR: -3, DEX: -3, CON: -2, WIS: 3, CHA: 1 } },
};

/**
 * Get disposition by level.
 */
export function getDisposition(level) {
  return DISPOSITIONS.find(d => d.level === Math.max(-2, Math.min(2, level))) || DISPOSITIONS[2];
}

/**
 * Get trust level from trust points.
 */
export function getTrustLevel(trustPoints) {
  const clamped = Math.max(-10, Math.min(10, trustPoints));
  return TRUST_LEVELS.find(t => clamped >= t.min && clamped <= t.max) || TRUST_LEVELS[3];
}

/**
 * Apply mood decay over sessions.
 */
export function decayEmotion(emotionKey, sessionsPassed) {
  const emotion = EMOTIONAL_STATES[emotionKey];
  if (!emotion || sessionsPassed < emotion.decaySessions) return emotionKey;
  return emotion.decayTo;
}

/**
 * Get death cascade effects.
 */
export function getDeathCascade(npcRoles) {
  const effects = [];
  for (const role of npcRoles) {
    if (DEATH_CASCADE[role]) {
      effects.push(...DEATH_CASCADE[role].map(e => ({ category: role, effect: e })));
    }
  }
  return effects;
}

/**
 * Check if NPC might betray based on conditions.
 */
export function checkBetrayalRisk(trustLevel, conditions = {}) {
  const risks = [];
  for (const trigger of BETRAYAL_TRIGGERS) {
    if (conditions.bribeOffered && trustLevel < 5 && trigger.trigger === 'Gold exceeds loyalty') {
      risks.push(trigger);
    }
    if (conditions.threatened && trustLevel < 7 && trigger.trigger === 'Fear exceeds loyalty') {
      risks.push(trigger);
    }
    if (conditions.hasHiddenAgenda && trigger.trigger === 'Secret agenda activated') {
      risks.push(trigger);
    }
    if (conditions.factionConflict && trigger.trigger === 'Faction loyalty conflict') {
      risks.push(trigger);
    }
    if (conditions.moralLineCrossed && trigger.trigger === 'Moral line crossed') {
      risks.push(trigger);
    }
  }
  return risks;
}

/**
 * Generate gossip about the party.
 */
export function generateGossip(partyActions, channel = 'tavern') {
  const spread = GOSSIP_SPREAD_RATES[channel];
  const action = pick(partyActions);
  const distortions = [
    `${action} (accurate)`,
    `${action}, but exaggerated — the details are blown out of proportion`,
    `${action}, but twisted — the party\'s motivations are misrepresented`,
    `${action}, but incomplete — key context is missing`,
    `A completely fabricated story loosely based on ${action}`,
  ];
  const reliability = spread.reliability === 'high' ? 0 : spread.reliability === 'medium' ? 1 : 2;
  const distortion = distortions[Math.min(reliability + Math.floor(Math.random() * 2), distortions.length - 1)];

  return { channel: spread, gossip: distortion, source: channel };
}
