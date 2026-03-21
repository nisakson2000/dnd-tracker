/**
 * playerRoleplayGuide.js
 * Player Mode: Roleplay tips and character voice development
 * Pure JS — no React dependencies.
 */

export const ROLEPLAY_PILLARS = [
  { pillar: 'Voice & Mannerisms', tips: ['Pick ONE distinctive trait (accent, speech pattern, catchphrase)', 'Practice a few key phrases before sessions', 'You don\'t need a full accent — a word choice pattern works', 'Reference your character\'s background in how they speak'] },
  { pillar: 'Motivation', tips: ['Know what your character WANTS (short-term and long-term)', 'Know what your character FEARS', 'Every action should connect to a motivation', 'Motivations can evolve — let them change with the story'] },
  { pillar: 'Relationships', tips: ['Have an opinion about every party member', 'Create small moments of connection (shared meal, training together)', 'Disagree IN CHARACTER sometimes — it creates drama', 'Build trust through actions, not declarations'] },
  { pillar: 'Flaws', tips: ['Play your flaws ACTIVELY — they create great moments', 'A flaw isn\'t just "I\'m grumpy" — it should affect decisions', 'Let your flaw cause problems that the party can solve together', 'Overcome a flaw for a dramatic character arc moment'] },
  { pillar: 'Growth', tips: ['Track how your character changes through events', 'Reference past experiences in current decisions', 'Level-ups are character growth moments — describe what changed', 'Allow other characters to influence your growth'] },
];

export const CHARACTER_VOICE_TEMPLATES = [
  { archetype: 'Scholar', speech: 'Precise vocabulary, references obscure knowledge, asks questions', phrases: ['Actually, the correct term is...', 'Fascinating! I\'ve read about this.', 'Logically speaking...'] },
  { archetype: 'Soldier', speech: 'Direct, uses military terms, gives orders naturally', phrases: ['Form up.', 'Contact. Multiple hostiles.', 'Secure the perimeter.'] },
  { archetype: 'Noble', speech: 'Formal, slightly condescending, expects service', phrases: ['I suppose that will do.', 'Do you know who I am?', 'Someone handle this.'] },
  { archetype: 'Street Urchin', speech: 'Casual, slang, suspicious of authority', phrases: ['Don\'t trust \'em.', 'Finders keepers.', 'I know a guy.'] },
  { archetype: 'Hermit', speech: 'Thoughtful, cryptic, uncomfortable in crowds', phrases: ['The silence tells more than words.', 'I... it\'s been a while since I\'ve talked to people.', 'Nature provides.'] },
  { archetype: 'Entertainer', speech: 'Dramatic, metaphorical, always performing', phrases: ['Picture this...', 'And THAT is how it\'s done!', 'Life is a stage, darling.'] },
  { archetype: 'Criminal', speech: 'Guarded, assessing, uses coded language', phrases: ['What\'s the angle?', 'I know people.', 'Let\'s not do anything we\'d regret.'] },
  { archetype: 'Folk Hero', speech: 'Humble, practical, protective of common folk', phrases: ['Someone\'s got to do it.', 'These are good people.', 'That ain\'t right.'] },
];

export const ROLEPLAY_EXERCISES = [
  { exercise: 'The Campfire Scene', description: 'During a long rest, describe what your character does. Cook? Sharpen weapons? Stare at the stars? This reveals personality.', difficulty: 'Easy' },
  { exercise: 'The Letter Home', description: 'Write a short letter your character would send home. Who\'s it to? What do they say? What do they leave out?', difficulty: 'Easy' },
  { exercise: 'The Moral Choice', description: 'When the DM presents a moral dilemma, have your character argue their position. Even if it disagrees with the party.', difficulty: 'Medium' },
  { exercise: 'The Backstory Reveal', description: 'Find a natural moment to share a piece of backstory. Don\'t info-dump — let it come up organically.', difficulty: 'Medium' },
  { exercise: 'The Vulnerability', description: 'Show your character being afraid, uncertain, or wrong. Perfect characters are boring characters.', difficulty: 'Hard' },
];

export const IN_COMBAT_ROLEPLAY = [
  'Describe HOW you attack, not just "I attack."',
  'React to getting hit. Grunt, curse, stagger — don\'t just track HP silently.',
  'Call out to allies by name. "Thorin, behind you!"',
  'Express emotion: fear, anger, determination. Combat is emotional.',
  'Taunt enemies. Challenge them. Insult their mother.',
  'Narrate your killing blows. The DM will love "How do you want to do this?"',
  'Acknowledge ally actions. "Nice shot!" or "I owe you one."',
];

export function getVoiceTemplate(archetype) {
  return CHARACTER_VOICE_TEMPLATES.find(t =>
    t.archetype.toLowerCase().includes((archetype || '').toLowerCase())
  ) || null;
}

export function getRandomExercise() {
  return ROLEPLAY_EXERCISES[Math.floor(Math.random() * ROLEPLAY_EXERCISES.length)];
}
