/**
 * playerKnowledgeClericGuide.js
 * Player Mode: Knowledge Domain Cleric — the omniscient scholar
 * Pure JS — no React dependencies.
 */

export const KNOWLEDGE_BASICS = {
  class: 'Cleric (Knowledge Domain)',
  source: 'Player\'s Handbook',
  theme: 'Divine scholar. Expertise in knowledge skills. Read minds and steal proficiencies.',
  note: 'Best skill Cleric. Knowledge of the Ages lets you become proficient in any skill or tool as an action. Visions of the Past is amazing RP.',
};

export const KNOWLEDGE_FEATURES = [
  { feature: 'Blessings of Knowledge', level: 1, effect: 'Choose 2 from: Arcana, History, Nature, Religion. You gain proficiency AND expertise (double proficiency) in them.', note: 'Free expertise in two knowledge skills. +8 to +12 to those checks at mid-levels.' },
  { feature: 'Knowledge of the Ages', level: 2, effect: 'Channel Divinity, action: gain proficiency in one skill or tool for 10 minutes.', note: 'Any skill. Any tool. For 10 minutes. Need Thieves\' Tools? Athletics for a climb? Stealth for sneaking? Done.' },
  { feature: 'Read Thoughts', level: 6, effect: 'Channel Divinity: read a creature\'s surface thoughts within 60ft (WIS save). On fail: also cast Suggestion (no save) on them.', note: 'Read thoughts + free Suggestion with no save. Incredible social tool.' },
  { feature: 'Potent Spellcasting', level: 8, effect: 'Add WIS to cantrip damage.', note: 'Standard. Sacred Flame/Toll the Dead + WIS mod.' },
  { feature: 'Visions of the Past', level: 17, effect: 'Meditate on an object or area for 1 minute: see past events related to it (up to days/years of history). Once/short rest.', note: 'Psychometry. Touch a murder weapon: see the murder. Enter a ruin: see what happened. Incredible RP/investigation tool.' },
];

export const KNOWLEDGE_TACTICS = [
  { tactic: 'Universal proficiency', detail: 'Knowledge of the Ages: become proficient in ANYTHING for 10 minutes. Lockpicking? Herbalism? Vehicles? Any skill check coming up.', rating: 'S', note: 'This alone makes the subclass worthwhile. You\'re proficient in everything, 10 min at a time.' },
  { tactic: 'Read Thoughts interrogation', detail: 'Read surface thoughts (WIS save). If they fail: Suggestion with NO save. "Tell me everything you know about the cult."', rating: 'S' },
  { tactic: 'Knowledge check monster', detail: 'Expertise in Arcana + Religion = +12 or more. Identify any magic item, recall lore about any creature, recognize any spell.', rating: 'A' },
  { tactic: 'Investigation leader', detail: 'Visions of the Past + Read Thoughts + expertise checks = solve any mystery. Best investigation Cleric.', rating: 'A' },
];

export const KNOWLEDGE_SPELLS = {
  domainSpells: [
    { level: 1, spells: 'Command, Identify', note: 'Command is great. Identify for free item identification.' },
    { level: 2, spells: 'Augury, Suggestion', note: 'Both excellent. Augury for DM info. Suggestion for social control.' },
    { level: 3, spells: 'Nondetection, Speak with Dead', note: 'Speak with Dead: question corpses. Investigation essential.' },
    { level: 4, spells: 'Arcane Eye, Confusion', note: 'Arcane Eye: invisible scouting. Confusion: AoE chaos.' },
    { level: 5, spells: 'Legend Lore, Scrying', note: 'Legend Lore: ask about anything. Scrying: spy on anyone.' },
  ],
};

export function knowledgeSkillBonus(clericLevel, wisMod) {
  const profBonus = Math.min(6, 2 + Math.floor((clericLevel + 3) / 4));
  return wisMod + (profBonus * 2); // Expertise = double proficiency
}

export function knowledgeOfTheAgesDuration() {
  return 10; // minutes
}
