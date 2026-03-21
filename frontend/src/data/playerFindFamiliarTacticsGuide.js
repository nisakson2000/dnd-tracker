/**
 * playerFindFamiliarTacticsGuide.js
 * Player Mode: Find Familiar — the most versatile L1 spell in 5e
 * Pure JS — no React dependencies.
 */

export const FIND_FAMILIAR_RULES = {
  level: 1,
  school: 'Conjuration (ritual)',
  castingTime: '1 hour',
  range: '10 feet',
  components: 'V, S, M (10 gp charcoal, incense, herbs consumed)',
  duration: 'Instantaneous (familiar persists)',
  classes: ['Wizard'],
  access: ['Pact of the Chain Warlock', 'Ritual Caster feat', 'Magic Initiate feat'],
  key: 'Familiar is a spirit in beast form. It acts independently, has its own initiative, but can\'t attack. You can communicate telepathically within 100ft and see through its senses as an action.',
};

export const FAMILIAR_FORMS_RANKED = [
  { form: 'Owl', rating: 'S+', reason: 'Flyby (no OAs). 60ft darkvision. Fly 60ft. Best for Help action + escape.' },
  { form: 'Hawk', rating: 'A+', reason: 'Fly 60ft. Keen Sight (advantage on Perception). Good scout.' },
  { form: 'Bat', rating: 'A+', reason: 'Fly 30ft. Blindsight 60ft. Sees in magical darkness. Tiny.' },
  { form: 'Cat', rating: 'A', reason: 'Stealth +4. Climb speed. Doesn\'t look suspicious in urban settings.' },
  { form: 'Spider', rating: 'A', reason: 'Climb speed. Web Sense. Tiny. Can hide almost anywhere.' },
  { form: 'Raven', rating: 'A', reason: 'Fly 50ft. Mimicry (can speak phrases). Good for delivering messages.' },
  { form: 'Snake (Poisonous)', rating: 'B+', reason: 'Swim speed. Blindsight 10ft. Tiny. Niche but useful.' },
  { form: 'Rat', rating: 'B+', reason: 'Darkvision 30ft. Keen Smell. Tiny. Urban infiltration.' },
  { form: 'Octopus', rating: 'B', reason: 'Swim speed. Darkvision 30ft. Underwater campaigns only.' },
  { form: 'Frog', rating: 'B', reason: 'Swim speed. Amphibious. Tiny. Niche.' },
  { form: 'Weasel', rating: 'B', reason: 'Keen Hearing and Smell. Tiny. Decent scout.' },
];

export const CHAIN_PACT_FORMS = [
  { form: 'Imp', rating: 'S+', reason: 'Invisible at will. Fly 40ft. Shapechange (rat/raven/spider). Magic Resistance. Best chain familiar.' },
  { form: 'Pseudodragon', rating: 'S', reason: 'Magic Resistance. Blindsight 10ft. Fly. Sting (poison + unconscious). Advantage on Perception.' },
  { form: 'Quasit', rating: 'A+', reason: 'Invisible at will. Shapechange (bat/centipede/toad). Scare ability.' },
  { form: 'Sprite', rating: 'A', reason: 'Invisible. Fly 40ft. Heart Sight (detect alignment). Poison (unconscious).' },
];

export const FAMILIAR_TACTICS = [
  { tactic: 'Help Action (Owl)', detail: 'Owl flies in, uses Help to give advantage on an attack, flies out with Flyby. No OA. Repeat every round.', rating: 'S+' },
  { tactic: 'Scouting', detail: 'Send familiar ahead. See through its senses. Risk-free reconnaissance.', rating: 'S+' },
  { tactic: 'Deliver Touch Spells', detail: 'Familiar can deliver touch spells (Shocking Grasp, Cure Wounds, Inflict Wounds). 100ft effective range.', rating: 'S' },
  { tactic: 'Invisible Scout (Imp)', detail: 'Imp turns invisible and scouts. Perfect reconnaissance.', rating: 'S+' },
  { tactic: 'Dragon\'s Breath on Familiar', detail: 'Cast Dragon\'s Breath on familiar. It can use its action to breathe 3d6 AoE.', rating: 'S' },
  { tactic: 'Carry items/potions', detail: 'Familiar can carry a healing potion and administer it to downed ally.', rating: 'A+' },
  { tactic: 'Trigger traps', detail: 'Send familiar to trigger pressure plates, tripwires. It "dies" but resummon for 10gp.', rating: 'A+' },
  { tactic: 'Flanking (if used)', detail: 'Familiar in melee = flanking buddy for rogues. Easy advantage.', rating: 'A (variant rule)' },
  { tactic: 'Message relay', detail: 'Familiar carries messages. Raven can even speak them.', rating: 'A' },
  { tactic: 'Guard duty', detail: 'Familiar watches camp. You perceive through its senses if awakened.', rating: 'A' },
];

export const FAMILIAR_TIPS = [
  'Owl is the best default form. Flyby + Help action is unmatched.',
  'Familiars have 1 HP. They WILL die in combat. Budget 10gp for resummons.',
  'You can dismiss your familiar to a pocket dimension (action) to protect it.',
  'Familiars can\'t attack, but they CAN take other actions (Help, Search, Dash, Dodge, Use Object).',
  'Touch spell delivery: YOUR spell attack modifier, familiar\'s position. 100ft "touch" range.',
  'Ritual casting Find Familiar costs no spell slot — just 1 hour + 10gp materials.',
  'Pact of the Chain: Investment of the Chain Master lets you command familiar as BA and use YOUR save DC.',
  'Familiar death = no concentration or save. Just gone. Resummon when convenient.',
  'In social situations, a cat or raven familiar is inconspicuous. An owl at a tavern is not.',
  'Use familiar for Perception checks — their Perception may be better than yours (owls have advantage).',
];
