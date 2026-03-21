/**
 * playerNegotiationTacticsGuide.js
 * Player Mode: Social encounter negotiation tactics
 * Pure JS — no React dependencies.
 */

export const NEGOTIATION_BASICS = {
  principle: 'Social encounters are skill challenges. Persuasion, Deception, Intimidation, and Insight are your weapons.',
  dcBaseline: 'Easy: DC 10. Medium: DC 15. Hard: DC 20. Nearly Impossible: DC 25. Very Easy: DC 5.',
  note: 'Most DMs set DCs based on how reasonable your request is. Good roleplay can lower the DC. Bad asks raise it.',
};

export const SOCIAL_SKILLS_GUIDE = [
  { skill: 'Persuasion', use: 'Convince someone of the truth or a reasonable request. "Help us, it\'s in your interest."', bestWhen: 'NPC is neutral or friendly. Request is reasonable.', note: 'The #1 social skill. Always useful.' },
  { skill: 'Deception', use: 'Convince someone of a lie. "We\'re here on the king\'s orders."', bestWhen: 'NPC would refuse if they knew the truth. You need to hide something.', note: 'Opposed by Insight. Risky if caught.' },
  { skill: 'Intimidation', use: 'Threaten or cow someone. "Tell us or else."', bestWhen: 'You have leverage. NPC is weaker. Short-term compliance needed.', note: 'Works fast but creates enemies. NPC may betray you later.' },
  { skill: 'Insight', use: 'Read NPC emotions/intentions. "Is the merchant lying?"', bestWhen: 'You suspect deception. Need to understand motivations.', note: 'Defensive social skill. Information gathering.' },
  { skill: 'Performance', use: 'Entertain to distract or impress.', bestWhen: 'Need a distraction. Want to gain favor through art.', note: 'Niche but powerful with the right audience.' },
];

export const NEGOTIATION_TACTICS = [
  { tactic: 'Offer something they want', detail: 'Find out what the NPC values. Offer it in exchange. "We\'ll clear the goblins if you give us the map."', rating: 'S', note: 'Win-win negotiations are easiest. Both sides benefit.' },
  { tactic: 'Good cop / bad cop', detail: 'One player Intimidates, another Persuades. "My friend here is dangerous, but I can keep them in check if you cooperate."', rating: 'A', note: 'Classic technique. Works in D&D just like real life.' },
  { tactic: 'Gather intel first', detail: 'Insight check to understand NPC motivations. Then tailor your pitch. "I know you hate the baron. We can help remove him."', rating: 'S', note: 'Information is leverage. Know what they want before negotiating.' },
  { tactic: 'Leverage position of power', detail: 'Demonstrate strength first, then negotiate. "We just killed the dragon. Now let\'s talk about the reward."', rating: 'A', note: 'Show, don\'t tell. Prove you\'re powerful, then be reasonable.' },
  { tactic: 'Use Zone of Truth creatively', detail: 'Offer to submit to Zone of Truth to prove sincerity. Shows good faith. NPC may reciprocate.', rating: 'A', note: 'Works both ways. Make sure your truths are actually helpful.' },
  { tactic: 'Bribe', detail: 'Sometimes gold talks louder than Persuasion. 50-100gp can change an NPC\'s mind on minor matters.', rating: 'A', note: 'DM sets the price. But gold always helps.' },
];

export const SOCIAL_SPELL_SUPPORT = [
  { spell: 'Charm Person', level: 1, effect: 'Target regards you as friend. Advantage on social checks.', warning: 'Target KNOWS it was charmed when it ends. Can create enemies.' },
  { spell: 'Suggestion', level: 2, effect: 'Suggest a reasonable course of action. Target follows it.', warning: 'Must be worded as "reasonable." DM interprets.' },
  { spell: 'Zone of Truth', level: 2, effect: 'Can\'t lie in the zone. CHA save. Even on success, you know they saved.', warning: 'Targets can refuse to speak. Can omit truths.' },
  { spell: 'Detect Thoughts', level: 2, effect: 'Read surface thoughts. Deeper probe with INT save.', warning: 'Target might notice the deeper probe (INT save).' },
  { spell: 'Friends', level: 0, effect: 'Advantage on CHA checks vs one target for 1 minute.', warning: 'Target KNOWS you enchanted them when it ends. Almost always backfires.' },
  { spell: 'Modify Memory', level: 5, effect: 'Rewrite the target\'s memory of an event.', warning: 'Very powerful but ethically dubious. DM may have consequences.' },
];

export function socialCheckDC(requestReasonableness) {
  const dcs = { veryReasonable: 10, reasonable: 13, neutral: 15, unreasonable: 20, absurd: 25 };
  return dcs[requestReasonableness] || 15;
}
