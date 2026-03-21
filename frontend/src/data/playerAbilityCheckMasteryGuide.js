/**
 * playerAbilityCheckMasteryGuide.js
 * Player Mode: Skill checks — when to use which skill, DC benchmarks, tips
 * Pure JS — no React dependencies.
 */

export const DC_BENCHMARKS = [
  { dc: 5, difficulty: 'Very Easy', example: 'Climb a knotted rope. Recall common knowledge.' },
  { dc: 10, difficulty: 'Easy', example: 'Climb a rough wall. Notice an obvious clue.' },
  { dc: 15, difficulty: 'Medium', example: 'Pick a simple lock. Track a creature in mud.' },
  { dc: 20, difficulty: 'Hard', example: 'Pick a good lock. Climb a slippery wall.' },
  { dc: 25, difficulty: 'Very Hard', example: 'Pick a masterwork lock. Navigate a maze blindfolded.' },
  { dc: 30, difficulty: 'Nearly Impossible', example: 'Leap across a 30ft chasm. Persuade a hostile dragon.' },
];

export const SKILLS_BY_ABILITY = {
  strength: [
    { skill: 'Athletics', uses: 'Climbing, swimming, jumping, grappling, shoving.', note: 'Primary STR skill. Grapple/shove contests.' },
  ],
  dexterity: [
    { skill: 'Acrobatics', uses: 'Balance, tumbling, escape grapples.', note: 'Alternative to Athletics for escaping grapples.' },
    { skill: 'Sleight of Hand', uses: 'Pickpocketing, planting, concealing objects.', note: 'Rogue specialty.' },
    { skill: 'Stealth', uses: 'Hiding, sneaking, avoiding detection.', note: 'Disadvantage in heavy armor.' },
  ],
  intelligence: [
    { skill: 'Arcana', uses: 'Magic knowledge, identify spells, planar lore.', note: 'Identify spells and magical items.' },
    { skill: 'History', uses: 'Historical events, legends, famous people.', note: 'Ancient ruins, noble lineages, wars.' },
    { skill: 'Investigation', uses: 'Deduce, search for clues, find hidden doors.', note: 'Active searching. Different from Perception.' },
    { skill: 'Nature', uses: 'Plants, animals, weather, terrain.', note: 'Identify creatures and natural phenomena.' },
    { skill: 'Religion', uses: 'Deities, rites, undead lore.', note: 'Gods, cults, divine magic knowledge.' },
  ],
  wisdom: [
    { skill: 'Animal Handling', uses: 'Calm animals, control mounts.', note: 'Stabilize frightened mounts.' },
    { skill: 'Insight', uses: 'Detect lies, read intentions.', note: 'Contested vs Deception.' },
    { skill: 'Medicine', uses: 'Stabilize dying, diagnose illness.', note: 'DC 10 to stabilize.' },
    { skill: 'Perception', uses: 'Notice things, spot hidden creatures, find traps.', note: 'Most important skill in 5e.' },
    { skill: 'Survival', uses: 'Track creatures, navigate, forage.', note: 'Tracking and wilderness navigation.' },
  ],
  charisma: [
    { skill: 'Deception', uses: 'Lie, bluff, misdirect.', note: 'Contested vs Insight.' },
    { skill: 'Intimidation', uses: 'Threaten, coerce, frighten.', note: 'Can use STR per DM ruling.' },
    { skill: 'Performance', uses: 'Entertain, play music, act.', note: 'Bard specialty.' },
    { skill: 'Persuasion', uses: 'Convince, negotiate, diplomacy.', note: 'Most common social skill.' },
  ],
};

export const SKILL_BOOSTERS = [
  { booster: 'Proficiency', bonus: '+2 to +6', note: 'Scales with level.' },
  { booster: 'Expertise', bonus: '+4 to +12 (double prof)', note: 'Rogue L1/6, Bard L3/10.' },
  { booster: 'Guidance', bonus: '+1d4', note: 'Cleric/Druid cantrip. Cast before every check.' },
  { booster: 'Bardic Inspiration', bonus: '+1d6 to +1d12', note: 'Scales with bard level.' },
  { booster: 'Enhance Ability', bonus: 'Advantage', note: 'L2 spell. Advantage = roughly +5.' },
  { booster: 'Jack of All Trades', bonus: '+half prof (unproficient)', note: 'Bard L2. Even applies to initiative.' },
  { booster: 'Reliable Talent', bonus: 'Min roll 10', note: 'Rogue L11. Can\'t fail proficient checks.' },
  { booster: 'Observant feat', bonus: '+5 passive Perception/Investigation', note: 'Passive 20+ catches almost everything.' },
];

export const SKILL_TIPS = [
  'Perception is the most important skill. Everyone should have it.',
  'Guidance: +1d4 to checks. Cast before every skill check.',
  'Expertise doubles proficiency. Rogue/Bard specialty.',
  'Investigation = active deduction. Perception = passive notice.',
  'Persuasion is not mind control. NPC makes reasonable choices.',
  'Athletics for grapple/shove. Acrobatics to escape grapple.',
  'Stealth: disadvantage in heavy armor. Plan around it.',
  'Enhance Ability: advantage on all checks of one ability.',
  'Reliable Talent (Rogue L11): can\'t roll below 10.',
  'Passive checks: 10 + modifiers. Always running in background.',
];
