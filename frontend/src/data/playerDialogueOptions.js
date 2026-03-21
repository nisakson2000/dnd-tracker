/**
 * playerDialogueOptions.js
 * Player Mode: Social encounter approaches and dialogue skill usage
 * Pure JS — no React dependencies.
 */

export const SOCIAL_APPROACHES = [
  {
    approach: 'Persuasion',
    skill: 'CHA (Persuasion)',
    description: 'Appeal to reason, goodwill, or shared interests.',
    bestWhen: 'NPC is neutral or friendly. You\'re asking for something reasonable.',
    example: '"We\'re both trying to stop this threat. Working together benefits us all."',
    failureRisk: 'Low. Failed persuasion usually just means "no," not hostility.',
  },
  {
    approach: 'Deception',
    skill: 'CHA (Deception)',
    description: 'Lie, mislead, or hide the truth.',
    bestWhen: 'Truth would be problematic. NPC doesn\'t have reason to suspect you.',
    example: '"We\'re emissaries from the king, here on official business."',
    failureRisk: 'High. Getting caught lying can turn NPCs hostile.',
  },
  {
    approach: 'Intimidation',
    skill: 'CHA (Intimidation)',
    description: 'Use threats, display of power, or fear.',
    bestWhen: 'You have clear physical/political advantage. Time is short.',
    example: '"Tell us what you know, or things will get very uncomfortable."',
    failureRisk: 'Medium. May comply but become hostile. May fight back if brave.',
  },
  {
    approach: 'Performance',
    skill: 'CHA (Performance)',
    description: 'Entertain, distract, or impress through artistry.',
    bestWhen: 'You need a distraction, want to earn trust, or are in a social gathering.',
    example: '"Let me play you a song while my friend... takes care of something."',
    failureRisk: 'Low. Poor performance is embarrassing but rarely dangerous.',
  },
  {
    approach: 'Insight',
    skill: 'WIS (Insight)',
    description: 'Read the NPC\'s intentions, detect lies, understand motivations.',
    bestWhen: 'You suspect the NPC is lying or hiding something.',
    example: '"I watch the merchant\'s body language as they describe the \'legitimate\' goods."',
    failureRisk: 'None. Even a failed check just means you can\'t read them.',
  },
  {
    approach: 'Bribery',
    skill: 'No skill (gold)',
    description: 'Offer money or goods in exchange for cooperation.',
    bestWhen: 'NPC values money. Amount is appropriate for the request.',
    example: '"Perhaps this pouch of gold would help refresh your memory?"',
    failureRisk: 'Low-Medium. May offend honor-bound NPCs. May demand more.',
  },
];

export const SOCIAL_SPELLS = [
  { spell: 'Charm Person (1st)', effect: 'Target regards you as a friendly acquaintance. WIS save.', warning: 'Target KNOWS they were charmed when spell ends.' },
  { spell: 'Suggestion (2nd)', effect: 'Suggest a course of action. Must sound reasonable. WIS save.', warning: 'Can\'t force obviously harmful actions.' },
  { spell: 'Zone of Truth (2nd)', effect: 'Creatures in 15ft sphere can\'t deliberately lie. CHA save to resist.', warning: 'They can still be evasive or refuse to answer.' },
  { spell: 'Detect Thoughts (2nd)', effect: 'Read surface thoughts, or probe deeper (WIS save to resist).', warning: 'Target may sense the probing (WIS save).' },
  { spell: 'Friends (cantrip)', effect: 'Advantage on CHA checks for 1 minute.', warning: 'Target KNOWS they were manipulated afterward and becomes hostile.' },
  { spell: 'Calm Emotions (2nd)', effect: 'Suppress strong emotions or charm/fear effects.', warning: 'Good for de-escalation. Doesn\'t change underlying attitude.' },
];

export const NEGOTIATION_TIPS = [
  'Know what the NPC wants before negotiating. Insight check or prior research.',
  'Start with a reasonable ask. Outrageous requests shut down conversation.',
  'Offer something of value to the NPC, not just to you.',
  'Good cop / bad cop: one player Intimidates, another Persuades.',
  'Information is currency. Sometimes knowing a secret is worth more than gold.',
  'Don\'t roll for everything. Good roleplay can succeed without a check.',
  'If Persuasion fails, try a different approach (Intimidation, Bribery, Deception).',
];

export function getSocialApproach(approach) {
  return SOCIAL_APPROACHES.find(a => a.approach.toLowerCase() === (approach || '').toLowerCase()) || null;
}

export function suggestApproach(npcDisposition) {
  if (npcDisposition >= 1) return getSocialApproach('Persuasion');
  if (npcDisposition === 0) return getSocialApproach('Persuasion');
  if (npcDisposition === -1) return getSocialApproach('Intimidation');
  return getSocialApproach('Deception');
}
