/**
 * playerInvestigationGuide.js
 * Player Mode: Investigation, mystery solving, and clue tracking
 * Pure JS — no React dependencies.
 */

export const INVESTIGATION_SKILLS = [
  { skill: 'Investigation (INT)', use: 'Deduce from clues. Search methodically. Understand mechanisms.', example: 'Finding a hidden compartment by noticing inconsistent measurements.' },
  { skill: 'Perception (WIS)', use: 'Notice things. Spot details. Detect hidden creatures.', example: 'Noticing a faint scratching sound behind the wall.' },
  { skill: 'Insight (WIS)', use: 'Read people. Detect lies. Understand motivations.', example: 'Realizing the innkeeper is nervous when you mention the cellar.' },
  { skill: 'History (INT)', use: 'Recall facts. Identify historical context. Recognize symbols.', example: 'Recognizing the crest on the letter as belonging to a defunct noble house.' },
  { skill: 'Arcana (INT)', use: 'Identify magical phenomena. Understand arcane symbols.', example: 'Recognizing the residue on the victim as Wild Magic.' },
  { skill: 'Medicine (WIS)', use: 'Determine cause of death. Identify poisons. Assess wounds.', example: 'The wound pattern suggests a curved blade, not a straight one.' },
  { skill: 'Survival (WIS)', use: 'Track creatures. Read environments. Follow trails.', example: 'These tracks show someone was dragged, not walking.' },
];

export const INVESTIGATION_METHODS = [
  { method: 'Search the Scene', steps: ['Perception check for obvious clues', 'Investigation check for hidden details', 'Check above, below, and behind objects', 'Search bodies (pockets, hidden compartments)', 'Note what\'s MISSING as well as what\'s there'] },
  { method: 'Interview Witnesses', steps: ['Ask open-ended questions first', 'Insight check to detect deception', 'Ask about what they heard, smelled, felt — not just saw', 'Compare stories between witnesses', 'Note inconsistencies'] },
  { method: 'Follow the Trail', steps: ['Survival check to track', 'Note time of day and weather effects on tracks', 'Look for dropped items along the path', 'Check for ambush points', 'Identify where the trail is deliberately hidden'] },
  { method: 'Research', steps: ['Library: History or Investigation check', 'Ask local experts or sages', 'Check public records, logs, ledgers', 'Send familiar or hireling to gather info', 'Legend Lore spell for legendary subjects'] },
  { method: 'Magical Investigation', steps: ['Detect Magic for magical residue', 'Identify to learn item properties', 'Speak with Dead for victim testimony (5 questions)', 'Zone of Truth for suspect interrogation', 'Divination or Commune for divine guidance'] },
];

export const CLUE_TRACKING = {
  categories: ['Physical Evidence', 'Witness Testimony', 'Documents', 'Magical Traces', 'Circumstantial'],
  template: {
    clue: '',
    source: '',
    category: '',
    leadsTo: '',
    confirmed: false,
    notes: '',
  },
};

export const MYSTERY_TIPS = [
  'Write down EVERY clue the DM gives you. They don\'t waste words.',
  'If three clues point the same direction, that\'s probably the truth.',
  'The most helpful NPC is sometimes the guilty one.',
  'Ask "who benefits?" from the crime. Follow the motive.',
  'Don\'t fixate on one theory. Hold multiple hypotheses.',
  'Revisit old clues after getting new information.',
  'If you\'re stuck, talk to the suspect you trust least.',
  'The DM wants you to solve it. Ask for Investigation checks when stuck.',
  'Maps, timelines, and relationship charts help enormously.',
  'Sometimes the answer is mundane, not magical.',
];

export function createClue(clue, source, category) {
  return {
    ...CLUE_TRACKING.template,
    clue,
    source,
    category: category || 'Physical Evidence',
    timestamp: new Date().toISOString(),
  };
}

export function getInvestigationMethod(situation) {
  return INVESTIGATION_METHODS.find(m =>
    m.method.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}
