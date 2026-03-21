/**
 * playerRpSocialTacticsGuide.js
 * Player Mode: Social encounters — persuasion, deception, intimidation tactics
 * Pure JS — no React dependencies.
 */

export const SOCIAL_SKILLS = {
  persuasion: { when: 'Convincing with logic, charm. Honest approach.', note: 'Most common social skill.' },
  deception: { when: 'Lying, misleading, hiding truth.', note: 'Contested vs Insight.' },
  intimidation: { when: 'Threatening, coercing, displaying dominance.', note: 'Some DMs allow STR-based.' },
  insight: { when: 'Detecting lies, reading motives.', note: 'Contested vs Deception.' },
  performance: { when: 'Entertaining, distracting, performing.', note: 'Bard specialty.' },
};

export const SOCIAL_SPELLS = [
  { spell: 'Charm Person (L1)', effect: 'Friendly attitude. Advantage on CHA checks.', risk: 'Target knows when it ends.' },
  { spell: 'Suggestion (L2)', effect: 'Suggest reasonable action. 8 hours.', risk: 'Target doesn\'t realize they were influenced.' },
  { spell: 'Zone of Truth (L2)', effect: 'Can\'t lie in area. CHA save to resist.', risk: 'Can stay silent. Knows the spell is active.' },
  { spell: 'Detect Thoughts (L2)', effect: 'Read surface thoughts. WIS save for deeper probe.', risk: 'Target may sense probing.' },
  { spell: 'Friends cantrip', effect: 'Advantage on CHA checks. 1 minute.', risk: 'Target knows afterward. Likely hostile.' },
  { spell: 'Calm Emotions (L2)', effect: 'Suppress charm/fright or make hostile indifferent.', risk: 'Ends if threatened.' },
  { spell: 'Tongues (L3)', effect: 'Speak any language. 1 hour.', risk: 'None.' },
  { spell: 'Modify Memory (L5)', effect: 'Change 10 min of memory. WIS save.', risk: 'Must charm first.' },
];

export const SOCIAL_TACTICS = [
  { tactic: 'Good Cop / Bad Cop', how: 'Intimidate + Persuade combo.' },
  { tactic: 'Bribe', how: 'Gold solves many problems. Read the room.' },
  { tactic: 'Find Common Ground', how: 'Insight check to learn NPC motivation. Offer what they need.' },
  { tactic: 'Invoke Authority', how: 'Name-drop. Show credentials. Invoke patron.' },
  { tactic: 'Create Urgency', how: 'Real threat creates pressure to cooperate.' },
  { tactic: 'Appeal to Morality', how: 'Works on good-aligned NPCs.' },
];

export const SOCIAL_TIPS = [
  'Persuasion is NOT mind control. NPCs act in character.',
  'Describe your approach, then roll. Good RP lowers DCs.',
  'Charm Person: target knows when it ends. Plan accordingly.',
  'Suggestion: must sound reasonable. "Let us pass" works.',
  'Zone of Truth: can\'t lie but CAN stay silent.',
  'Bribery works. Gold is universal.',
  'Good Cop / Bad Cop: Intimidation + Persuasion combo.',
  'Calm Emotions: de-escalate hostile situations.',
  'Insight before Persuasion: learn what they want.',
  'Tongues spell: essential for diplomacy across languages.',
];
