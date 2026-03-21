/**
 * playerRoleplayPrompts.js
 * Player Mode: Roleplay prompts, character development, and IC conversation starters
 * Pure JS — no React dependencies.
 */

export const RP_PROMPTS_BY_CATEGORY = {
  campfire: [
    'What\'s the happiest memory your character has?',
    'Describe your character\'s ideal day — no adventuring, no danger.',
    'What does your character miss most about home?',
    'Does your character have a recurring dream or nightmare?',
    'What\'s a habit your character has that annoys others?',
    'How does your character feel about the current quest?',
    'What would your character do if they could retire from adventuring?',
    'Share a lie your character has told the party.',
    'What does your character think about when they can\'t sleep?',
    'Describe a meal your character would cook for the party.',
  ],
  combat: [
    'Describe how you strike the killing blow.',
    'What does your character shout as they charge into battle?',
    'How does your character react when an ally goes down?',
    'Describe the look on your character\'s face as they cast this spell.',
    'What\'s going through your character\'s mind during this fight?',
    'How does your character celebrate after a hard-won battle?',
    'Describe your character\'s fighting stance.',
    'What does your character mutter under their breath during combat?',
  ],
  social: [
    'How does your character introduce themselves to strangers?',
    'What\'s your character\'s first impression of this NPC?',
    'Does your character trust this person? Why or why not?',
    'What\'s your character\'s negotiation style? Charm, intimidation, logic?',
    'How does your character handle being lied to?',
    'What gift would your character give to a friend?',
    'How does your character show affection or gratitude?',
    'Describe your character\'s reaction to an insult.',
  ],
  exploration: [
    'What catches your character\'s eye in this new location?',
    'How does your character react to seeing something magical for the first time?',
    'What does your character do during downtime in a new city?',
    'How does your character feel about being underground / underwater / in the air?',
    'What souvenir does your character collect from this place?',
    'How does your character navigate — maps, instinct, asking for directions?',
    'Describe what your character sees when they look at the night sky.',
  ],
};

export const CHARACTER_DEVELOPMENT = [
  { aspect: 'Bonds', prompt: 'Has your character formed new bonds with party members? How have existing bonds changed?' },
  { aspect: 'Flaws', prompt: 'Has your character\'s flaw caused problems recently? Are they working to overcome it?' },
  { aspect: 'Ideals', prompt: 'Have recent events challenged your character\'s ideals? Have they changed?' },
  { aspect: 'Goals', prompt: 'What\'s your character\'s current personal goal? Has it shifted since the campaign started?' },
  { aspect: 'Growth', prompt: 'In what ways has your character grown since the start of the adventure?' },
  { aspect: 'Regrets', prompt: 'Is there a decision your character regrets? Would they do it differently now?' },
  { aspect: 'Relationships', prompt: 'Who does your character trust most in the party? Who do they worry about?' },
];

export const VOICE_TIPS = [
  'Pick one distinctive speech pattern (formal, slang, accent, catchphrase).',
  'Your character doesn\'t have to be you — let them make decisions you wouldn\'t.',
  'React in character to events, even small ones. "My character looks uncomfortable."',
  'It\'s okay to speak in third person: "Grok pounds the table angrily."',
  'Ask other characters questions. RP is collaborative, not a monologue.',
  'Describe your character\'s body language, not just their words.',
  'Embrace your flaws and bonds — they create the best story moments.',
];

export function getRandomPrompt(category) {
  const prompts = RP_PROMPTS_BY_CATEGORY[category];
  if (!prompts) return null;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getRandomDevelopmentPrompt() {
  return CHARACTER_DEVELOPMENT[Math.floor(Math.random() * CHARACTER_DEVELOPMENT.length)];
}
