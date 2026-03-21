/**
 * playerSkillCheckGuide.js
 * Player Mode: Skill check tips, common DCs, and creative uses
 * Pure JS — no React dependencies.
 */

export const COMMON_DCS = [
  { dc: 5, difficulty: 'Very Easy', example: 'Climb a knotted rope, recognize a common deity.' },
  { dc: 10, difficulty: 'Easy', example: 'Hear an approaching guard, stabilize a dying creature.' },
  { dc: 15, difficulty: 'Medium', example: 'Pick a standard lock, track through a forest, forge a document.' },
  { dc: 20, difficulty: 'Hard', example: 'Leap across a 20ft chasm, pick a good lock, navigate a labyrinth.' },
  { dc: 25, difficulty: 'Very Hard', example: 'Escape from manacles, climb a slick surface, convince hostile guards.' },
  { dc: 30, difficulty: 'Nearly Impossible', example: 'Track through a blizzard, understand an ancient cipher, leap a 30ft gap.' },
];

export const CREATIVE_SKILL_USES = [
  { skill: 'Athletics', uses: ['Catch a falling ally', 'Break down a door', 'Swim in rapids', 'Wrestle a creature'] },
  { skill: 'Acrobatics', uses: ['Walk a tightrope', 'Tumble through an enemy\'s space', 'Land safely from a jump', 'Balance on a moving vehicle'] },
  { skill: 'Stealth', uses: ['Hide in combat (Rogue)', 'Tail someone in a city', 'Slip past guards', 'Set up an ambush'] },
  { skill: 'Arcana', uses: ['Identify a spell being cast', 'Recall magical lore', 'Identify magical symbols', 'Understand planar mechanics'] },
  { skill: 'History', uses: ['Recall battle tactics', 'Identify a historical artifact', 'Know noble lineages', 'Recognize ancient ruins'] },
  { skill: 'Investigation', uses: ['Search for traps', 'Analyze crime scenes', 'Find secret doors', 'Solve puzzles/riddles'] },
  { skill: 'Nature', uses: ['Identify plants/animals', 'Predict weather', 'Find clean water', 'Navigate wilderness'] },
  { skill: 'Religion', uses: ['Identify undead weaknesses', 'Know deity lore', 'Recognize religious symbols', 'Recall religious history'] },
  { skill: 'Perception', uses: ['Spot hidden enemies', 'Notice subtle details', 'Hear distant sounds', 'Find hidden objects'] },
  { skill: 'Insight', uses: ['Detect lies', 'Read body language', 'Sense hidden motives', 'Evaluate trustworthiness'] },
  { skill: 'Medicine', uses: ['Stabilize dying creature', 'Diagnose illness', 'Determine cause of death', 'Perform surgery (DM discretion)'] },
  { skill: 'Survival', uses: ['Track creatures', 'Forage for food', 'Navigate wilderness', 'Build shelter', 'Predict weather'] },
  { skill: 'Persuasion', uses: ['Negotiate prices', 'Convince NPCs', 'Make alliances', 'Plead for mercy'] },
  { skill: 'Deception', uses: ['Lie convincingly', 'Create a distraction', 'Impersonate someone', 'Bluff in cards'] },
  { skill: 'Intimidation', uses: ['Coerce information', 'Frighten enemies', 'Demand surrender', 'Assert dominance'] },
  { skill: 'Performance', uses: ['Earn money performing', 'Create a distraction', 'Inspire allies (RP)', 'Win a competition'] },
  { skill: 'Sleight of Hand', uses: ['Pick pockets', 'Plant evidence', 'Palm objects', 'Cheat at cards'] },
  { skill: 'Animal Handling', uses: ['Calm a spooked horse', 'Train an animal', 'Ride a difficult mount', 'Befriend a beast'] },
];

export function getDCInfo(dc) {
  for (let i = COMMON_DCS.length - 1; i >= 0; i--) {
    if (dc >= COMMON_DCS[i].dc) return COMMON_DCS[i];
  }
  return COMMON_DCS[0];
}

export function getSkillUses(skillName) {
  const entry = CREATIVE_SKILL_USES.find(s => s.skill.toLowerCase() === (skillName || '').toLowerCase());
  return entry ? entry.uses : [];
}
