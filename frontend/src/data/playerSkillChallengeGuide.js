/**
 * playerSkillChallengeGuide.js
 * Player Mode: Skill challenge mechanics, strategy, and common scenarios
 * Pure JS — no React dependencies.
 */

export const SKILL_CHALLENGE_RULES = {
  concept: 'A series of skill checks where the party must accumulate successes before failures.',
  standardFormat: 'X successes before 3 failures.',
  scaling: [
    { difficulty: 'Easy', successes: 3, failures: 3 },
    { difficulty: 'Medium', successes: 5, failures: 3 },
    { difficulty: 'Hard', successes: 7, failures: 3 },
    { difficulty: 'Very Hard', successes: 10, failures: 3 },
  ],
  rules: [
    'Each player uses a different skill each round (can\'t repeat the same skill)',
    'DM sets DC for each check (usually 10-20)',
    'Creative solutions with unusual skills should be rewarded with lower DCs',
    'Failed checks may have consequences beyond just counting as a failure',
    'Some DMs allow "assists" (Help action) to give advantage',
  ],
  origin: 'Originally from D&D 4e. Popular houserule in 5e.',
};

export const COMMON_SCENARIOS = [
  {
    scenario: 'Chase Scene',
    description: 'Pursuing or fleeing from enemies through a city/wilderness.',
    goodSkills: ['Athletics (running/climbing)', 'Acrobatics (parkour)', 'Perception (spotting shortcuts)', 'Stealth (losing pursuers)', 'Animal Handling (horse chase)'],
    badSkills: ['Arcana (unless casting)', 'History', 'Religion'],
    spells: ['Misty Step', 'Haste', 'Grease (behind you)', 'Fog Cloud (cover escape)'],
  },
  {
    scenario: 'Navigating a Storm',
    description: 'Sailing through or surviving a dangerous storm.',
    goodSkills: ['Athletics (securing rigging)', 'Nature (reading weather)', 'Survival (navigation)', 'Perception (spotting hazards)', 'Persuasion (rallying crew)'],
    badSkills: ['Arcana', 'Deception', 'Stealth'],
    spells: ['Control Water', 'Gust of Wind', 'Calm Emotions (crew morale)', 'Mending (repairs)'],
  },
  {
    scenario: 'Political Negotiation',
    description: 'Convincing a council, noble, or faction to support your cause.',
    goodSkills: ['Persuasion (direct arguments)', 'Deception (hiding weaknesses)', 'Insight (reading the room)', 'History (citing precedent)', 'Intimidation (power play)'],
    badSkills: ['Athletics', 'Stealth', 'Survival'],
    spells: ['Zone of Truth', 'Suggestion', 'Detect Thoughts', 'Charm Person (risky)'],
  },
  {
    scenario: 'Heist/Infiltration',
    description: 'Breaking into a secured location undetected.',
    goodSkills: ['Stealth (movement)', 'Thieves\' Tools (locks)', 'Perception (patrols)', 'Deception (disguise)', 'Sleight of Hand (stealing keys)'],
    badSkills: ['Athletics (noisy)', 'Performance (draws attention)'],
    spells: ['Invisibility', 'Pass Without Trace', 'Knock (LOUD)', 'Disguise Self', 'Silence'],
  },
  {
    scenario: 'Wilderness Survival',
    description: 'Surviving in hostile terrain (desert, arctic, jungle).',
    goodSkills: ['Survival (finding food/water/shelter)', 'Nature (identifying dangers)', 'Medicine (treating exposure)', 'Athletics (climbing/swimming)', 'Perception (spotting threats)'],
    badSkills: ['Persuasion', 'Deception', 'Performance'],
    spells: ['Goodberry', 'Create Water', 'Tiny Hut', 'Endure Elements', 'Druidcraft (weather prediction)'],
  },
  {
    scenario: 'Collapsing Dungeon Escape',
    description: 'Getting out of a crumbling structure before it collapses.',
    goodSkills: ['Athletics (running/climbing)', 'Acrobatics (dodging debris)', 'Perception (finding exits)', 'Investigation (structural weak points)', 'Arcana (magical barriers)'],
    badSkills: ['Persuasion', 'History', 'Deception'],
    spells: ['Misty Step', 'Dimension Door', 'Passwall', 'Stone Shape', 'Feather Fall'],
  },
];

export const SKILL_CHALLENGE_TIPS = [
  'Be creative with skill choices. The DM rewards unusual but logical approaches.',
  'Coordinate with your party. Don\'t all use the same skills.',
  'Play to your strengths. Use skills you have proficiency or expertise in.',
  'Describe HOW you use the skill, not just the skill name. Narration matters.',
  'Spells can count as automatic successes or lower DCs. Use them wisely.',
  'Help Action: if your DM allows it, give advantage to the party member most likely to succeed.',
  'Some failures create complications rather than flat failure. The story continues.',
  'If you have Guidance, use it every chance you get (+1d4 to checks).',
];

export function getScenarioAdvice(scenarioName) {
  return COMMON_SCENARIOS.find(s =>
    s.scenario.toLowerCase().includes((scenarioName || '').toLowerCase())
  ) || null;
}

export function suggestSkill(scenario, characterSkills) {
  const sc = COMMON_SCENARIOS.find(s =>
    s.scenario.toLowerCase().includes((scenario || '').toLowerCase())
  );
  if (!sc) return null;
  const good = sc.goodSkills.filter(gs =>
    (characterSkills || []).some(cs => gs.toLowerCase().includes(cs.toLowerCase()))
  );
  return good.length > 0 ? good : ['Try a creative approach with any proficient skill'];
}
