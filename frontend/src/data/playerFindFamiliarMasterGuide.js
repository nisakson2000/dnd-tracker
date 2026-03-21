/**
 * playerFindFamiliarMasterGuide.js
 * Player Mode: Find Familiar — the most versatile L1 spell
 * Pure JS — no React dependencies.
 */

export const FIND_FAMILIAR_BASICS = {
  spell: 'Find Familiar',
  level: 1,
  school: 'Conjuration (ritual)',
  castTime: '1 hour (ritual)',
  duration: 'Until dismissed or killed',
  cost: '10 gp of charcoal, incense, herbs (consumed)',
  classes: ['Wizard'],
  access: ['Pact of the Chain (Warlock)', 'Magic Initiate', 'Ritual Caster'],
  note: 'Permanent companion. Scout, Help action, spell delivery. One of the best spells in the game at any level.',
};

export const FAMILIAR_FORMS = [
  { form: 'Owl', rating: 'S', reason: 'Flyby (no OA), 60ft darkvision, 60ft fly speed. Best combat familiar. Help action + fly away safely.' },
  { form: 'Hawk', rating: 'A', reason: 'Flyby not available. But Keen Sight (advantage on Perception). Good scout.' },
  { form: 'Cat', rating: 'A', reason: 'Keen Smell. Tiny. Blends in urban environments. Best infiltration form.' },
  { form: 'Spider', rating: 'A', reason: 'Web Sense, Web Walk, Spider Climb. Fits through cracks. Great scout.' },
  { form: 'Bat', rating: 'B+', reason: 'Blindsight 60ft. Flies. Detects invisible creatures. Niche but powerful.' },
  { form: 'Rat', rating: 'B', reason: 'Keen Smell. Tiny. Unremarkable. Good for scouting sewers/dungeons.' },
  { form: 'Raven', rating: 'B', reason: 'Mimicry (repeat phrases). Can deliver verbal messages. Flavor pick.' },
  { form: 'Snake', rating: 'C', reason: 'Blindsight 10ft. Swim speed. Very niche.' },
  { form: 'Octopus', rating: 'C', reason: 'Underwater only. Ink Cloud. Extremely niche.' },
];

export const FAMILIAR_TACTICS = [
  { tactic: 'Help action in combat', detail: 'Familiar uses Help → gives advantage on your next attack. Owl is best (Flyby = no OA on exit).', rating: 'S' },
  { tactic: 'Scout ahead', detail: 'Send familiar 100ft ahead. See through its senses (action). Detect traps, enemies, treasure.', rating: 'S' },
  { tactic: 'Deliver touch spells', detail: 'Familiar can deliver touch-range spells you cast. Inflict Wounds, Shocking Grasp, Cure Wounds at range.', rating: 'S' },
  { tactic: 'Pocket familiar', detail: 'Dismiss to pocket dimension (action). Resummon within 30ft (action). Protects from AoE.', rating: 'A' },
  { tactic: 'Dragon\'s Breath combo', detail: 'Cast Dragon\'s Breath on familiar. It uses its action to breathe 15ft cone. Repeatable damage.', rating: 'S' },
  { tactic: 'Trigger traps safely', detail: 'Send familiar to step on pressure plates, open chests, etc. If it dies, resummon (1hr + 10gp).', rating: 'A' },
  { tactic: 'Carry items/messages', detail: 'Familiar can carry small objects. Deliver potions, keys, notes. Even into combat.', rating: 'B' },
];

export const CHAIN_PACT_FAMILIARS = [
  { form: 'Imp', rating: 'S', reason: 'Invisible at will. Fly. Shapechange (spider/rat/raven). Magic Resistance. Sting with poison.' },
  { form: 'Pseudodragon', rating: 'A', reason: 'Magic Resistance. Sting (sleep poison). Advantage on Perception. Telepathy 100ft.' },
  { form: 'Quasit', rating: 'A', reason: 'Shapechange. Invisible. Scare (1/day). Magic Resistance. Similar to Imp but slightly weaker.' },
  { form: 'Sprite', rating: 'B', reason: 'Invisible. Heart Sight (detect alignment). Ranged attack. Weakest Chain familiar.' },
];

export const INVESTMENT_OF_THE_CHAIN = {
  invocation: 'Investment of the Chain Master',
  benefits: [
    'Familiar attacks use your spell attack bonus and spell save DC.',
    'Familiar attack as BA (your bonus action).',
    'Can give familiar fly or swim speed if it doesn\'t have one.',
  ],
  note: 'Makes Chain Pact familiars into legitimate combatants. Imp with your save DC is terrifying.',
};

export function familiarHelpAdvantage(yourAttackMod, targetAC) {
  const normalHit = (21 - (targetAC - yourAttackMod)) / 20;
  const advantageHit = 1 - Math.pow(1 - normalHit, 2);
  return {
    normalChance: `${Math.round(Math.max(0, Math.min(1, normalHit)) * 100)}%`,
    advantageChance: `${Math.round(Math.max(0, Math.min(1, advantageHit)) * 100)}%`,
    note: 'Familiar Help action gives advantage on your next attack.',
  };
}
