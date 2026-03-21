/**
 * playerNegotiationTactics.js
 * Player Mode: Advanced negotiation and diplomacy strategies
 * Pure JS — no React dependencies.
 */

export const NEGOTIATION_APPROACHES = [
  { approach: 'Appeal to Self-Interest', skill: 'Persuasion', description: 'Show them how helping you benefits THEM.', example: '"If the bandits take over the road, YOUR trade caravans suffer too."', effectiveness: 'High — most reliable approach.' },
  { approach: 'Intimidation', skill: 'Intimidation', description: 'Threaten consequences for non-compliance.', example: '"We just killed a dragon. Do you really want to negotiate the hard way?"', effectiveness: 'Medium — works once, creates enemies.' },
  { approach: 'Emotional Appeal', skill: 'Persuasion', description: 'Appeal to their emotions, morality, or compassion.', example: '"The children in that village have no one else to turn to."', effectiveness: 'Medium — depends on NPC personality.' },
  { approach: 'Bribery', skill: 'None (gold)', description: 'Offer payment for cooperation.', example: '"50 gold now, 50 when the job is done."', effectiveness: 'High — but expensive. Some NPCs are offended.' },
  { approach: 'Deception', skill: 'Deception', description: 'Lie or mislead to get what you want.', example: '"We\'re agents of the crown, here on official business."', effectiveness: 'High risk, high reward. Insight checks oppose.' },
  { approach: 'Alliance', skill: 'Persuasion', description: 'Propose mutual cooperation against a shared threat.', example: '"We both want the cult gone. Let\'s work together."', effectiveness: 'Very high — creates lasting partnerships.' },
  { approach: 'Trade/Exchange', skill: 'Persuasion', description: 'Offer something they want in exchange.', example: '"We\'ll clear the mines if you give us the map."', effectiveness: 'High — fair deals build trust.' },
  { approach: 'Authority', skill: 'Persuasion/Intimidation', description: 'Invoke a higher power or organization.', example: '"Lord Neverember sent us. You can verify with the guard captain."', effectiveness: 'Medium — needs actual backing or good Deception.' },
];

export const NPC_PERSONALITY_TELLS = [
  { personality: 'Greedy', tell: 'Eyes linger on your gear. Mentions money often.', bestApproach: 'Bribery or Trade', avoid: 'Emotional Appeal' },
  { personality: 'Fearful', tell: 'Nervous mannerisms. Avoids eye contact. Flinches.', bestApproach: 'Intimidation or Protection offer', avoid: 'Aggressive demands' },
  { personality: 'Honorable', tell: 'Stands tall. Keeps word. Values reputation.', bestApproach: 'Alliance or Appeal to duty', avoid: 'Deception or Bribery' },
  { personality: 'Suspicious', tell: 'Questions everything. Checks credentials. Tests you.', bestApproach: 'Provide proof. Show credentials.', avoid: 'Deception — they\'ll catch you' },
  { personality: 'Desperate', tell: 'Talks fast. Agrees too quickly. Looks exhausted.', bestApproach: 'Offer help. They\'ll agree to almost anything.', avoid: 'Don\'t exploit too hard — they\'ll resent you' },
  { personality: 'Arrogant', tell: 'Dismissive. Name-drops. Talks down to you.', bestApproach: 'Flatter them. Make it their idea.', avoid: 'Direct confrontation (they\'ll double down)' },
];

export const NEGOTIATION_TIPS = [
  'Let the NPC state their position first. You gain information without revealing yours.',
  'Never accept the first offer. Counter with something better but reasonable.',
  'Use silence as a tool. After making an offer, stop talking. Let them fill the void.',
  'Find out what they REALLY want. It\'s often not what they SAY they want.',
  'Have a walk-away point. Don\'t agree to bad deals just to avoid conflict.',
  'Good cop / bad cop works. One party member threatens, another offers compromise.',
  'Take notes on NPC names and promises. Hold them accountable later.',
  'Build rapport before making requests. Buy them a drink. Ask about their day.',
];

export const DC_MODIFIERS = [
  { condition: 'NPC is friendly', modifier: -5, note: 'Already disposed to help' },
  { condition: 'NPC is hostile', modifier: +5, note: 'Actively opposed to you' },
  { condition: 'You have leverage', modifier: -3, note: 'Information, threat, or something they need' },
  { condition: 'Request is dangerous for NPC', modifier: +5, note: 'Asking them to risk their life/livelihood' },
  { condition: 'Request is trivial', modifier: -3, note: 'Costs them nothing' },
  { condition: 'You\'ve helped them before', modifier: -2, note: 'Reciprocity' },
  { condition: 'You\'ve wronged them before', modifier: +5, note: 'Grudge' },
];

export function suggestApproach(npcPersonality) {
  const profile = NPC_PERSONALITY_TELLS.find(p =>
    p.personality.toLowerCase().includes((npcPersonality || '').toLowerCase())
  );
  return profile ? { best: profile.bestApproach, avoid: profile.avoid } : null;
}

export function estimateDC(baseDC, conditions) {
  let dc = baseDC || 15;
  (conditions || []).forEach(cond => {
    const mod = DC_MODIFIERS.find(m =>
      m.condition.toLowerCase().includes(cond.toLowerCase())
    );
    if (mod) dc += mod.modifier;
  });
  return Math.max(5, Math.min(30, dc));
}
