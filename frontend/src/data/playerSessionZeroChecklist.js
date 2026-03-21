/**
 * playerSessionZeroChecklist.js
 * Player Mode: Session zero checklist for players
 * Pure JS — no React dependencies.
 */

export const SESSION_ZERO_TOPICS = [
  {
    category: 'Table Rules',
    items: [
      { topic: 'Phone/laptop policy', question: 'Devices at the table? Phones away or allowed for character sheets?' },
      { topic: 'Metagaming', question: 'How strict is the DM about player vs character knowledge?' },
      { topic: 'PvP', question: 'Is player-vs-player combat or theft allowed? Under what circumstances?' },
      { topic: 'Session length', question: 'How long are sessions? Hard stop or flexible?' },
      { topic: 'Absence policy', question: 'What happens to your character if you miss a session?' },
      { topic: 'Snacks/food', question: 'Who brings food? Rotate? Order delivery? Potluck?' },
    ],
  },
  {
    category: 'Game Mechanics',
    items: [
      { topic: 'Ability scores', question: 'Point buy, standard array, or rolling? 4d6 drop lowest? Rerolls?' },
      { topic: 'Starting level', question: 'What level do characters start at?' },
      { topic: 'Starting equipment', question: 'Class equipment or gold buy? Any bonus items?' },
      { topic: 'Flanking', question: 'Does flanking grant advantage, +2, or nothing?' },
      { topic: 'Critical hits', question: 'Double dice, double all, or max + roll? Fumble tables?' },
      { topic: 'Death', question: 'How is character death handled? Resurrection available? Backup character ready?' },
      { topic: 'Homebrew', question: 'Any homebrew rules, classes, or races?' },
      { topic: 'Encumbrance', question: 'Tracked strictly, loosely, or ignored?' },
    ],
  },
  {
    category: 'Campaign Info',
    items: [
      { topic: 'Setting', question: 'What world? Forgotten Realms, homebrew, other? Tone?' },
      { topic: 'Campaign type', question: 'Dungeon crawl, political intrigue, exploration, combat-heavy, RP-heavy?' },
      { topic: 'Allowed sources', question: 'PHB only? All official books? UA? Third party?' },
      { topic: 'Restricted content', question: 'Any races, classes, or spells banned or limited?' },
      { topic: 'Expected length', question: 'One-shot, short campaign (10 sessions), or long campaign (50+)?' },
      { topic: 'Level range', question: 'What levels will the campaign cover? Tier 1-4?' },
    ],
  },
  {
    category: 'Safety & Comfort',
    items: [
      { topic: 'Content limits', question: 'Any topics that are off-limits? Horror, romance, violence level?' },
      { topic: 'Safety tools', question: 'X-card? Lines and veils? How to signal discomfort?' },
      { topic: 'Tone', question: 'Serious, lighthearted, dark, comedic, or a mix?' },
      { topic: 'RP expectations', question: 'First-person or third-person? Voices expected? Accent okay?' },
    ],
  },
  {
    category: 'Party Coordination',
    items: [
      { topic: 'Party balance', question: 'Coordinate roles: tank, healer, DPS, support, face?' },
      { topic: 'Character connections', question: 'Do characters know each other? Shared backstory elements?' },
      { topic: 'Party motivation', question: 'Why is the party together? What keeps them together?' },
      { topic: 'Communication style', question: 'How does the party make decisions? Leader? Democracy?' },
    ],
  },
];

export const PLAYER_QUESTIONS_FOR_DM = [
  'What\'s your experience level as a DM?',
  'How do you handle rules disputes at the table?',
  'What\'s your philosophy on player death?',
  'How much roleplay vs combat do you prefer?',
  'How do you handle character backstories? Will they come up in the campaign?',
  'What\'s the best way to reach you between sessions?',
  'How do you handle magic item distribution?',
  'Are there any world-specific lore things we should know before making characters?',
];

export function getChecklist(category) {
  return SESSION_ZERO_TOPICS.find(c =>
    c.category.toLowerCase().includes((category || '').toLowerCase())
  ) || null;
}

export function getAllTopics() {
  return SESSION_ZERO_TOPICS.flatMap(c => c.items);
}

export function getUnanswered(answeredTopics) {
  const all = getAllTopics();
  return all.filter(item =>
    !(answeredTopics || []).includes(item.topic)
  );
}
