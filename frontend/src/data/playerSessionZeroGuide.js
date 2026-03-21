/**
 * playerSessionZeroGuide.js
 * Player Mode: Session zero preparation and character integration
 * Pure JS — no React dependencies.
 */

export const SESSION_ZERO_TOPICS = [
  { topic: 'Campaign Tone', description: 'Is it dark and gritty? Lighthearted? Heroic fantasy? Horror?', playerAction: 'Build a character that fits the tone. A joke character doesn\'t fit a serious campaign.' },
  { topic: 'Party Composition', description: 'What roles does the party need? Are there gaps?', playerAction: 'Coordinate with other players. Don\'t all play the same class.' },
  { topic: 'Character Connections', description: 'How do the characters know each other?', playerAction: 'Work with at least one other player to create a shared backstory element.' },
  { topic: 'House Rules', description: 'What optional rules are in play? Flanking? Critical hits? Death rules?', playerAction: 'Understand house rules that affect your build choices.' },
  { topic: 'Allowed Content', description: 'Which books? Homebrew? UA?', playerAction: 'Confirm your character options are allowed before building.' },
  { topic: 'Boundaries & Safety', description: 'Topics to avoid? Safety tools (X-card, Lines & Veils)?', playerAction: 'Share your boundaries. Respect others\'. D&D should be fun for everyone.' },
  { topic: 'Schedule & Logistics', description: 'How often? How long? Where? What happens if someone misses?', playerAction: 'Commit to the schedule. Communicate absences early.' },
  { topic: 'Starting Level & Equipment', description: 'What level do you start? Standard equipment or gold buy?', playerAction: 'Build your character to the correct level. Roll or use standard array.' },
  { topic: 'Player vs Player', description: 'Is PvP allowed? Stealing from party members?', playerAction: 'Usually PvP is a bad idea. Cooperate, don\'t compete with your party.' },
  { topic: 'Character Death', description: 'How does the DM handle death? Resurrection available?', playerAction: 'Have a backup character concept ready, just in case.' },
];

export const CHARACTER_INTEGRATION = [
  { step: 'Motivation', question: 'Why is your character adventuring? What drives them?', tip: 'Give the DM hooks to pull your character into the story.' },
  { step: 'Party Bond', question: 'Why does your character stick with this group?', tip: 'Lone wolf characters are hard to play. Give a reason to stay.' },
  { step: 'Personal Goal', question: 'What does your character want to achieve?', tip: 'Goals create dramatic tension and personal quests.' },
  { step: 'Secret', question: 'Does your character have a secret?', tip: 'Share it with the DM even if not the party. Creates great reveal moments.' },
  { step: 'NPC Connection', question: 'Who from your backstory might appear?', tip: 'Give the DM named NPCs (mentor, rival, family) to weave into the story.' },
  { step: 'Flaw', question: 'What is your character\'s weakness?', tip: 'Flaws make characters interesting. A perfect character is boring.' },
];

export const BACKUP_CHARACTER_TIPS = [
  'Always have a backup character concept in mind.',
  'Make it a different class/role than your current character for variety.',
  'Give the DM the backstory so they can introduce the backup naturally.',
  'Don\'t make the backup character dependent on your first character (no siblings seeking revenge).',
  'Consider a character who fills a party gap.',
];

export function getSessionZeroTopic(topic) {
  return SESSION_ZERO_TOPICS.find(t => t.topic.toLowerCase().includes((topic || '').toLowerCase())) || null;
}

export function getIntegrationStep(step) {
  return CHARACTER_INTEGRATION.find(s => s.step.toLowerCase() === (step || '').toLowerCase()) || null;
}
