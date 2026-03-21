/**
 * Session Prep System — DM Session Preparation Tools
 *
 * Covers roadmap items 121-128 (Session Prep Wizard, Use last session setup,
 * Session plan templates, Pre-session checklist, Session notes template,
 * Previous session recap, Pre-session AI briefing).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Pre-Session Checklist ──
export const PRE_SESSION_CHECKLIST = [
  { id: 'review_notes', category: 'Review', label: 'Review last session\'s notes and events', required: true },
  { id: 'scene_prep', category: 'Scenes', label: 'Prepare at least 2-3 scenes with descriptions', required: true },
  { id: 'npc_ready', category: 'NPCs', label: 'NPCs for planned scenes have names and personalities', required: true },
  { id: 'encounter_balanced', category: 'Combat', label: 'Combat encounters are balanced for party level', required: false },
  { id: 'maps_ready', category: 'Maps', label: 'Maps and battle maps are ready', required: false },
  { id: 'quest_hooks', category: 'Quests', label: 'Quest hooks prepared for active quests', required: true },
  { id: 'loot_prepared', category: 'Rewards', label: 'Loot and rewards prepared for encounters', required: false },
  { id: 'music_ready', category: 'Audio', label: 'Ambient music and sound effects queued', required: false },
  { id: 'player_followup', category: 'Players', label: 'Address any between-session player requests', required: false },
  { id: 'world_events', category: 'World', label: 'Between-session world events reviewed and approved', required: false },
  { id: 'recap_ready', category: 'Review', label: 'Session recap prepared for players', required: true },
  { id: 'backup_plan', category: 'Backup', label: 'Improv scenarios ready if players go off-script', required: false },
];

// ── Session Plan Templates ──
export const SESSION_PLAN_TEMPLATES = {
  standard: {
    label: 'Standard Session',
    description: 'Balanced mix of roleplay, exploration, and combat.',
    beats: [
      { time: '0-15 min', beat: 'Recap & Hook', description: 'Review last session. Present opening hook or continue from cliffhanger.' },
      { time: '15-45 min', beat: 'Exploration / Social', description: 'Travel, investigation, NPC interactions, information gathering.' },
      { time: '45-90 min', beat: 'Rising Action', description: 'Encounter or challenge. Tension builds. Stakes become clear.' },
      { time: '90-120 min', beat: 'Climax', description: 'Boss fight, dramatic revelation, or critical decision.' },
      { time: '120-135 min', beat: 'Resolution', description: 'Aftermath, loot, rest, consequences. Set up next session.' },
      { time: '135-150 min', beat: 'Wrap-up', description: 'Session summary, XP, milestone check, next session scheduling.' },
    ],
  },
  combatHeavy: {
    label: 'Combat-Heavy Session',
    description: 'Multiple encounters, dungeon crawl, or battlefield.',
    beats: [
      { time: '0-10 min', beat: 'Recap & Setup', description: 'Brief recap. Position party at dungeon entrance or battlefield.' },
      { time: '10-40 min', beat: 'First Encounter', description: 'Scouting, initial combat, or trap sequence.' },
      { time: '40-50 min', beat: 'Short Rest', description: 'Brief RP, hit dice, short rest features. Clue discovery.' },
      { time: '50-90 min', beat: 'Second Encounter', description: 'Harder combat or puzzle. Resource management matters.' },
      { time: '90-130 min', beat: 'Boss Fight', description: 'Final encounter. Lair actions. Legendary actions. Drama.' },
      { time: '130-150 min', beat: 'Loot & Wrap', description: 'Treasure, XP, consequences, next session hook.' },
    ],
  },
  socialIntrigue: {
    label: 'Social / Intrigue Session',
    description: 'Politics, investigation, negotiation, mystery.',
    beats: [
      { time: '0-15 min', beat: 'Recap & Context', description: 'Review relationships, factions, and active political threads.' },
      { time: '15-45 min', beat: 'Investigation', description: 'Gather clues, interview NPCs, examine evidence.' },
      { time: '45-75 min', beat: 'Social Encounters', description: 'Key NPC conversations, negotiations, persuasion challenges.' },
      { time: '75-105 min', beat: 'Complication', description: 'Betrayal, new information, moral dilemma, or time pressure.' },
      { time: '105-135 min', beat: 'Resolution', description: 'Make the deal, solve the mystery, choose sides.' },
      { time: '135-150 min', beat: 'Consequences', description: 'Who\'s happy? Who\'s angry? What comes next?' },
    ],
  },
  exploration: {
    label: 'Exploration / Travel',
    description: 'Overland travel, hex crawl, or new area discovery.',
    beats: [
      { time: '0-10 min', beat: 'Departure', description: 'Set travel goals, supplies check, route selection.' },
      { time: '10-40 min', beat: 'Travel Day 1', description: 'Navigation, foraging, random encounter or discovery.' },
      { time: '40-60 min', beat: 'Camp', description: 'Set up camp, watch rotation, campfire RP, rumors.' },
      { time: '60-90 min', beat: 'Travel Day 2', description: 'Weather event, landmark discovery, NPC encounter.' },
      { time: '90-120 min', beat: 'Arrival / Discovery', description: 'Reach destination or discover something unexpected.' },
      { time: '120-150 min', beat: 'First Impressions', description: 'Explore new location, meet locals, set up next steps.' },
    ],
  },
  oneShot: {
    label: 'One-Shot Adventure',
    description: 'Complete story in a single session.',
    beats: [
      { time: '0-15 min', beat: 'Setup', description: 'Character introductions, setting, quest hook delivered.' },
      { time: '15-45 min', beat: 'Act 1', description: 'First challenge. Establish stakes. Introduce villain/threat.' },
      { time: '45-90 min', beat: 'Act 2', description: 'Escalation. Multiple encounters. Reveal twist or complication.' },
      { time: '90-130 min', beat: 'Climax', description: 'Final battle or challenge. Everything comes together.' },
      { time: '130-150 min', beat: 'Epilogue', description: 'Resolution. Consequences. Celebrate or mourn.' },
    ],
  },
};

// ── Session Notes Template ──
export const SESSION_NOTES_TEMPLATE = {
  sections: [
    { id: 'recap', label: 'Session Recap', placeholder: 'What happened this session in 2-3 sentences...' },
    { id: 'key_moments', label: 'Key Moments', placeholder: 'List the most important events, decisions, and revelations...' },
    { id: 'npc_interactions', label: 'NPC Interactions', placeholder: 'Which NPCs were involved? What was said or promised?' },
    { id: 'combat_notes', label: 'Combat Notes', placeholder: 'How did combat go? Any notable tactics or close calls?' },
    { id: 'quest_progress', label: 'Quest Progress', placeholder: 'Which quests advanced? Any new quests or objectives?' },
    { id: 'loot_awarded', label: 'Loot & Rewards', placeholder: 'Gold, items, XP, or other rewards given...' },
    { id: 'player_reactions', label: 'Player Reactions', placeholder: 'What surprised players? What did they enjoy? What fell flat?' },
    { id: 'world_changes', label: 'World Changes', placeholder: 'How has the world changed because of this session?' },
    { id: 'next_session', label: 'Next Session Setup', placeholder: 'What should happen next? Cliffhangers, hooks, loose threads...' },
    { id: 'dm_notes', label: 'DM Private Notes', placeholder: 'Things to remember, mistakes to fix, ideas for later...' },
  ],
};

// ── Improv Prompts (item 158) ──
export const IMPROV_PROMPTS = [
  { trigger: 'Players go somewhere unexpected', prompt: 'What would realistically be here? Who lives/works here? What sounds/smells/sights?' },
  { trigger: 'Players ask about an NPC you haven\'t prepared', prompt: 'Pick a quick personality (nervous? cheerful? suspicious?), a name, and one secret they know.' },
  { trigger: 'Players try something completely unexpected', prompt: 'Say "yes, and..." or "yes, but..." Set a DC. What\'s the consequence of success or failure?' },
  { trigger: 'Combat is dragging', prompt: 'Add a complication: reinforcements, environmental hazard, or an escape opportunity for one side.' },
  { trigger: 'Players seem bored', prompt: 'Interrupt with: urgent messenger, building shakes, scream in the distance, or something falls from the sky.' },
  { trigger: 'Players are stuck on a puzzle', prompt: 'Have an NPC hint, provide an alternative solution path, or let a skill check reveal a clue.' },
  { trigger: 'Unexpected critical hit/miss', prompt: 'Narrate dramatically. Critical hit: describe the devastating blow. Natural 1: something amusing but not punishing.' },
  { trigger: 'Players want to split the party', prompt: 'Allow it but cut between groups to build tension. Both groups should face a challenge simultaneously.' },
];

/**
 * Get session plan template.
 */
export function getSessionPlan(templateId) {
  return SESSION_PLAN_TEMPLATES[templateId] || SESSION_PLAN_TEMPLATES.standard;
}

/**
 * Get all plan templates for UI.
 */
export function getSessionPlanOptions() {
  return Object.entries(SESSION_PLAN_TEMPLATES).map(([key, plan]) => ({
    id: key, label: plan.label, description: plan.description,
  }));
}

/**
 * Get the pre-session checklist.
 */
export function getChecklist() {
  return PRE_SESSION_CHECKLIST;
}

/**
 * Calculate prep completeness.
 */
export function calculatePrepCompleteness(checkedItems) {
  const required = PRE_SESSION_CHECKLIST.filter(c => c.required);
  const optional = PRE_SESSION_CHECKLIST.filter(c => !c.required);
  const requiredDone = required.filter(c => checkedItems.includes(c.id)).length;
  const optionalDone = optional.filter(c => checkedItems.includes(c.id)).length;

  return {
    requiredComplete: requiredDone,
    requiredTotal: required.length,
    optionalComplete: optionalDone,
    optionalTotal: optional.length,
    percentage: Math.round(((requiredDone + optionalDone) / PRE_SESSION_CHECKLIST.length) * 100),
    ready: requiredDone === required.length,
  };
}

/**
 * Get a random improv prompt.
 */
export function getImprovPrompt(trigger) {
  if (trigger) {
    const match = IMPROV_PROMPTS.find(p => p.trigger.toLowerCase().includes(trigger.toLowerCase()));
    if (match) return match;
  }
  return pick(IMPROV_PROMPTS);
}

/**
 * Get session notes template.
 */
export function getSessionNotesTemplate() {
  return SESSION_NOTES_TEMPLATE;
}

/**
 * Generate auto-recap from event log.
 */
export function generateAutoRecap(events = []) {
  if (events.length === 0) return 'No events recorded for this session.';

  const combats = events.filter(e => e.type === 'combat');
  const social = events.filter(e => e.type === 'social');
  const quests = events.filter(e => e.type === 'quest');
  const loot = events.filter(e => e.type === 'loot');

  const parts = [];
  if (combats.length > 0) parts.push(`The party fought ${combats.length} encounter${combats.length > 1 ? 's' : ''}.`);
  if (social.length > 0) parts.push(`Key social interactions: ${social.map(e => e.summary || e.name).join(', ')}.`);
  if (quests.length > 0) parts.push(`Quest progress: ${quests.map(e => e.summary || e.name).join(', ')}.`);
  if (loot.length > 0) parts.push(`Loot: ${loot.map(e => e.summary || e.name).join(', ')}.`);

  return parts.join(' ') || 'Session events recorded but no automatic summary available.';
}
