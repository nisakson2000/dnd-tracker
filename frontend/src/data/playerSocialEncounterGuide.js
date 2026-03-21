/**
 * playerSocialEncounterGuide.js
 * Player Mode: Social encounter mechanics and persuasion strategies
 * Pure JS — no React dependencies.
 */

export const NPC_ATTITUDES = [
  { attitude: 'Hostile', dc: '20+', color: '#f44336', approach: 'Don\'t threaten. Appeal to self-interest. Offer something they want.', risk: 'May attack if provoked. Intimidation can backfire.' },
  { attitude: 'Unfriendly', dc: '15-20', color: '#ff9800', approach: 'Find common ground. Be respectful. Offer favors or gold.', risk: 'Won\'t help willingly. May give misleading info.' },
  { attitude: 'Indifferent', dc: '10-15', color: '#ffc107', approach: 'Standard persuasion/deception. Offer fair trades.', risk: 'Won\'t go out of their way. Needs a reason to help.' },
  { attitude: 'Friendly', dc: '5-10', color: '#8bc34a', approach: 'Ask nicely. They want to help. Don\'t push too hard.', risk: 'Minimal. May refuse unreasonable requests.' },
  { attitude: 'Allied', dc: '0-5', color: '#4caf50', approach: 'They actively support you. Ask for what you need.', risk: 'Almost none. Will help even at personal cost.' },
];

export const SOCIAL_SKILLS_GUIDE = [
  { skill: 'Persuasion', when: 'Honest appeal. You\'re asking nicely with good arguments.', bestFor: 'Negotiations, requests, pleas, diplomacy.', example: '"The town needs your help. You\'re the only one who knows the way."' },
  { skill: 'Deception', when: 'Lying or misleading. You\'re not telling the truth.', bestFor: 'Bluffing, disguises, false promises, misdirection.', example: '"We\'re merchants from the capital, here on official business."' },
  { skill: 'Intimidation', when: 'Threats or shows of force. Making them fear consequences.', bestFor: 'Interrogation, demanding compliance, scaring off enemies.', example: '"Tell me where the hideout is, or my friend here gets... creative."' },
  { skill: 'Insight', when: 'Reading the NPC. Understanding their motives and honesty.', bestFor: 'Detecting lies, reading emotions, understanding motivations.', example: '"I watch their face as they answer — do they seem genuine?"' },
  { skill: 'Performance', when: 'Entertaining or creating a spectacle.', bestFor: 'Distraction, earning trust, public events, celebrations.', example: '"I play a rousing ballad to warm up the crowd before we make our request."' },
];

export const NEGOTIATION_TIPS = [
  'Learn what the NPC wants BEFORE you make an offer.',
  'Insight check first to read their mood and motivations.',
  'Offer something they value, not just gold.',
  'Have a backup plan if persuasion fails.',
  'Don\'t make threats you can\'t back up.',
  'Roleplay the conversation. DMs often give advantage for good RP.',
  'Multiple party members can assist (Help action = advantage).',
  'A natural 20 on Persuasion doesn\'t mean they\'ll do anything. It means they\'re as helpful as possible given their disposition.',
  'Know when to stop pushing. Over-persuading can backfire.',
];

export const BRIBE_SCALE = [
  { npc: 'Common Peasant', amount: '1-5 gp', notes: 'A week\'s wages. Very persuasive.' },
  { npc: 'Town Guard', amount: '5-20 gp', notes: 'Risky. They might report you.' },
  { npc: 'Merchant', amount: '10-50 gp', notes: 'They understand value. Fair trade works better.' },
  { npc: 'Noble/Official', amount: '50-500 gp', notes: 'They want discretion. Favors may work better than gold.' },
  { npc: 'Powerful Figure', amount: '500+ gp', notes: 'Money alone won\'t work. They need influence, artifacts, or services.' },
];

export function getApproach(attitude) {
  return NPC_ATTITUDES.find(a => a.attitude.toLowerCase() === (attitude || '').toLowerCase()) || null;
}

export function suggestSkill(situation) {
  return SOCIAL_SKILLS_GUIDE.find(s =>
    s.when.toLowerCase().includes((situation || '').toLowerCase()) ||
    s.bestFor.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}
