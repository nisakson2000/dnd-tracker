/**
 * playerRitualCasterFeatGuide.js
 * Player Mode: Ritual Caster feat — free spells forever
 * Pure JS — no React dependencies.
 */

export const RITUAL_CASTER_BASICS = {
  feat: 'Ritual Caster',
  source: "Player's Handbook",
  prerequisite: 'INT or WIS 13+',
  benefit: 'Learn 2 ritual spells from one class list. Can find and add more rituals to your book.',
  castingTime: 'Normal cast time + 10 minutes. No spell slot used.',
  note: 'Infinite free casting of utility spells. One of the best feats for non-casters and half-casters.',
};

export const BEST_RITUAL_SPELLS = [
  { spell: 'Find Familiar', level: 1, class: 'Wizard', rating: 'S', reason: 'Scout, Help action, touch spell delivery. Best L1 ritual.' },
  { spell: 'Detect Magic', level: 1, class: 'Wizard/Cleric', rating: 'S', reason: 'Infinite magic detection. Essential dungeon tool.' },
  { spell: 'Identify', level: 1, class: 'Wizard', rating: 'A', reason: 'Instant magic item ID. Skips short rest identification.' },
  { spell: "Leomund's Tiny Hut", level: 3, class: 'Wizard', rating: 'S', reason: 'Invulnerable dome for safe long rests. Game-changing.' },
  { spell: 'Phantom Steed', level: 3, class: 'Wizard', rating: 'A', reason: '100ft speed horse for 1 hour. Infinite free travel.' },
  { spell: 'Water Breathing', level: 3, class: 'Wizard/Druid', rating: 'A', reason: '24 hours, 10 creatures. Never worry about water again.' },
  { spell: 'Speak with Animals', level: 1, class: 'Druid', rating: 'B', reason: 'Infinite animal conversations. Situational but fun.' },
  { spell: 'Commune', level: 5, class: 'Cleric', rating: 'A', reason: '3 yes/no questions to deity. Free divination.' },
  { spell: 'Contact Other Plane', level: 5, class: 'Wizard', rating: 'A', reason: '5 questions. Risk of INT drain (DC 15 INT save).' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, class: 'Wizard', rating: 'S', reason: '8 creatures, 1 hour telepathy. Perfect party comms.' },
];

export const RITUAL_CASTER_CLASS_VALUE = [
  { class: 'Fighter/Barbarian/Rogue', value: 'S', reason: 'No spellcasting at all. Ritual Caster adds massive utility.' },
  { class: 'Paladin/Ranger', value: 'A', reason: 'Half-casters with no ritual casting. Huge expansion of utility.' },
  { class: 'Warlock', value: 'A', reason: 'Warlocks have Pact of the Tome for rituals, but feat saves the invocation.' },
  { class: 'Wizard', value: 'C', reason: 'Wizards already have ritual casting + can copy scrolls. Redundant.' },
  { class: 'Cleric/Druid', value: 'C', reason: 'Already have ritual casting from their own list. Take Wizard list for Find Familiar.' },
  { class: 'Bard', value: 'B', reason: 'Bard has ritual casting but limited spell list. Wizard rituals expand options.' },
];

export const WIZARD_VS_CLERIC_LIST = {
  wizard: {
    strengths: 'Find Familiar, Tiny Hut, Phantom Steed, Telepathic Bond',
    note: 'Best overall ritual list. Most impactful spells.',
    recommendation: 'Default choice for most characters.',
  },
  cleric: {
    strengths: 'Detect Magic, Silence (not ritual), Commune',
    note: 'Smaller ritual list. Less impactful than Wizard.',
    recommendation: 'Only if you specifically need Cleric rituals.',
  },
  druid: {
    strengths: 'Speak with Animals, Water Breathing, Commune with Nature',
    note: 'Nature-themed rituals. Niche but flavorful.',
    recommendation: 'For nature-themed non-casters.',
  },
};

export function ritualCastTime(normalCastTime) {
  return { total: `${normalCastTime} + 10 minutes`, note: 'Rituals add 10 minutes to normal cast time. No slot used.' };
}
