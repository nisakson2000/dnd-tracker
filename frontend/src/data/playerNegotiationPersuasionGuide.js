/**
 * playerNegotiationPersuasionGuide.js
 * Player Mode: Social encounters — persuasion, negotiation, and social spells
 * Pure JS — no React dependencies.
 */

export const PERSUASION_MECHANICS = {
  check: 'CHA (Persuasion) vs DM-set DC or opposed Insight.',
  advantage: 'Enhance Ability (Eagle\'s Splendor) = advantage on CHA checks.',
  minimumRoll: 'Reliable Talent (Rogue 10) or Glibness (min 15) makes you unstoppable.',
  note: 'Persuasion doesn\'t mind control. The NPC still has to be willing.',
};

export const SOCIAL_DC_GUIDE = [
  { attitude: 'Friendly', dc: '0-10', note: 'Already inclined to help. Easy requests succeed.' },
  { attitude: 'Indifferent', dc: '10-15', note: 'No strong feelings. Reasonable requests work.' },
  { attitude: 'Unfriendly', dc: '15-20', note: 'Doesn\'t like you. Need good arguments or leverage.' },
  { attitude: 'Hostile', dc: '20-25+', note: 'Actively against you. Very difficult without leverage.' },
  { attitude: 'Sworn Enemy', dc: '25-30', note: 'Nearly impossible without magic or extreme circumstances.' },
];

export const SOCIAL_SPELL_TOOLKIT = [
  { spell: 'Charm Person', level: 1, effect: 'Charmed for 1 hour. Advantage on CHA checks. They know after.', rating: 'A', note: 'Target knows you charmed them after. Use wisely.' },
  { spell: 'Suggestion', level: 2, effect: 'Force a reasonable action for 8 hours. WIS save.', rating: 'S+', note: '"Leave this place" or "give me the key" works. Must be reasonable.' },
  { spell: 'Charm Monster', level: 4, effect: 'Charm any creature type. WIS save. 1 hour.', rating: 'A+', note: 'Works on non-humanoids. Same charm rules.' },
  { spell: 'Dominate Person', level: 5, effect: 'Total control. WIS save. Concentration.', rating: 'S', note: 'Complete control but concentration. Damage gives new save.' },
  { spell: 'Mass Suggestion', level: 6, effect: '12 creatures. No concentration. 24 hours. WIS save.', rating: 'S+', note: 'Encounter-ending. "Surrender" to 12 enemies.' },
  { spell: 'Modify Memory', level: 5, effect: 'Rewrite 10 minutes of memory. WIS save.', rating: 'S', note: 'They don\'t remember being interrogated.' },
  { spell: 'Zone of Truth', level: 2, effect: 'Can\'t lie. CHA save. They can avoid questions.', rating: 'A', note: 'They know the spell is active. Can refuse to speak.' },
  { spell: 'Detect Thoughts', level: 2, effect: 'Read surface thoughts. Deeper probe: WIS save.', rating: 'A+', note: 'Know what they\'re thinking. Probe deeper for secrets.' },
  { spell: 'Friends', level: 0, effect: 'Advantage on CHA checks for 1 minute. Target knows after.', rating: 'B', note: 'Cantrip but target becomes hostile afterward.' },
  { spell: 'Enhance Ability', level: 2, effect: 'Eagle\'s Splendor: advantage on CHA checks.', rating: 'A+', note: 'Pre-cast before social encounter.' },
];

export const NEGOTIATION_TACTICS = [
  { tactic: 'Establish Common Ground', how: 'Find shared interests or enemies. "We both want X."', note: 'Reduces effective DC. Makes them see you as an ally.' },
  { tactic: 'Offer Value', how: 'What do they want? Offer something they need.', note: 'Trade goods, services, information. NPCs have motivations.' },
  { tactic: 'Show Strength', how: 'Demonstrate you\'re powerful enough to be worth dealing with.', note: 'Intimidation check. Show magic, combat prowess, or connections.' },
  { tactic: 'Good Cop / Bad Cop', how: 'One player threatens, another offers a way out.', note: 'Classic. Intimidation + Persuasion tag team.' },
  { tactic: 'Information Leverage', how: 'Know secrets about them. Use as leverage.', note: 'Detect Thoughts, investigation, background research.' },
  { tactic: 'Appeal to Authority', how: 'Name-drop powerful allies, noble patrons, deity.', note: 'Works on NPCs who respect/fear that authority.' },
  { tactic: 'Deadline Pressure', how: 'Create urgency. "This offer expires when we leave."', note: 'Forces a decision. Prevents them from consulting others.' },
];

export const FACE_CHARACTER_BUILD = {
  bestClasses: ['Bard (Eloquence)', 'Warlock (Hexblade)', 'Paladin', 'Sorcerer'],
  keySkills: ['Persuasion', 'Deception', 'Insight', 'Intimidation'],
  keyFeats: [
    { feat: 'Skill Expert', effect: 'Expertise in Persuasion. +PB doubled.' },
    { feat: 'Actor', effect: '+1 CHA. Advantage on Deception to impersonate.' },
    { feat: 'Fey Touched', effect: '+1 CHA + Misty Step + utility spell.' },
  ],
  keySpells: ['Enhance Ability', 'Suggestion', 'Zone of Truth', 'Detect Thoughts'],
};

export const NEGOTIATION_TIPS = [
  'Persuasion doesn\'t mind control. NPCs must be willing.',
  'Enhance Ability (Eagle\'s Splendor): advantage on CHA checks. Pre-cast.',
  'Suggestion: "Walk away" ends encounters without violence.',
  'Detect Thoughts: know their secrets during negotiation.',
  'Zone of Truth: they can\'t lie but CAN refuse to answer.',
  'Good Cop / Bad Cop: Intimidation + Persuasion combo.',
  'Eloquence Bard: minimum 10 on Persuasion/Deception. Social god.',
  'Glibness: minimum 15 on CHA checks. Unstoppable social.',
  'Offer NPCs what they want. Everyone has a price.',
  'Combat is the last resort. Negotiation preserves resources.',
];
