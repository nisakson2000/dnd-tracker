/**
 * playerBackstoryHooks.js
 * Player Mode: Backstory integration hooks and plot tie-in suggestions
 * Pure JS — no React dependencies.
 */

export const BACKSTORY_ELEMENTS = [
  { element: 'Rival', description: 'A recurring antagonist who shares your background or goals.', plotHook: 'They show up working for the BBEG, or competing for the same quest reward.' },
  { element: 'Lost Family', description: 'A missing relative whose fate drives your character.', plotHook: 'Clues appear in dungeons. Letters, prisoner logs, or NPC mentions.' },
  { element: 'Debt', description: 'You owe someone powerful — money, a favor, or your life.', plotHook: 'The creditor sends agents. Pay up, do a job, or face consequences.' },
  { element: 'Secret', description: 'Something about your past that could destroy your reputation.', plotHook: 'Someone discovers it. Blackmail, or a chance to come clean to the party.' },
  { element: 'Mentor', description: 'The person who taught you. May be dead, missing, or corrupted.', plotHook: 'Mentor reappears — as ally, enemy, or in need of rescue.' },
  { element: 'Homeland', description: 'The place you came from and why you left.', plotHook: 'News arrives: your homeland is threatened. Return or let it fall?' },
  { element: 'Oath', description: 'A vow you made — to a god, person, or yourself.', plotHook: 'Situation forces you to choose between your oath and the party\'s needs.' },
  { element: 'Artifact', description: 'A personal item with mysterious significance.', plotHook: 'It reacts to a dungeon, NPC, or location. It has hidden properties.' },
];

export const BACKSTORY_PROMPTS = [
  'What is your character\'s greatest fear?',
  'Who does your character trust most — and why?',
  'What would your character sacrifice everything for?',
  'What is your character\'s biggest regret?',
  'What does your character want MORE than adventuring?',
  'Who wronged your character, and are they still alive?',
  'What does your character do when no one is watching?',
  'What would make your character leave the party?',
];

export const BOND_INTEGRATION = [
  { bond: 'Protect the innocent', trigger: 'Civilians in danger during combat', effect: 'Character feels compelled to shield bystanders, even at personal risk.' },
  { bond: 'Seek knowledge', trigger: 'Ancient library, magical inscription, unknown language', effect: 'Character MUST investigate. Will delay the party to study.' },
  { bond: 'Prove myself', trigger: 'Someone doubts the character\'s abilities', effect: 'Character takes risks to demonstrate competence.' },
  { bond: 'Avenge the fallen', trigger: 'An ally drops to 0 HP', effect: 'Character focuses attacks on whoever downed the ally.' },
  { bond: 'Honor above all', trigger: 'Opportunity to cheat, steal, or betray', effect: 'Character refuses even when it would benefit the party.' },
];

export function getRandomPrompt() {
  return BACKSTORY_PROMPTS[Math.floor(Math.random() * BACKSTORY_PROMPTS.length)];
}

export function getBackstoryElement(type) {
  return BACKSTORY_ELEMENTS.find(e =>
    e.element.toLowerCase().includes((type || '').toLowerCase())
  ) || null;
}
