/**
 * playerSimulacrumMasterGuide.js
 * Player Mode: Simulacrum — the most broken spell in 5e
 * Pure JS — no React dependencies.
 */

export const SIMULACRUM_BASICS = {
  spell: 'Simulacrum',
  level: 7,
  school: 'Illusion',
  castTime: '12 hours',
  range: 'Touch',
  duration: 'Until dispelled',
  cost: '1,500gp powdered ruby (consumed)',
  classes: ['Wizard'],
  effect: 'Create a duplicate of a beast or humanoid. Half the creature\'s HP max. Has all abilities, spells, etc.',
  note: 'The most powerful spell in 5e. A copy of yourself with all your spell slots.',
};

export const SIMULACRUM_KEY_RULES = [
  'The simulacrum has HALF the creature\'s max HP.',
  'It has ALL class features, abilities, and spell slots of the original at time of creation.',
  'It CANNOT regain spell slots. Once spent, they\'re gone forever.',
  'It CANNOT be healed normally — only by mending-type magic in a special workshop.',
  'It obeys your commands completely.',
  'If you cast Simulacrum again, the previous one is destroyed.',
  'It\'s a creature with the construct type, but appears identical to the original.',
  'It has the original\'s equipment (illusory duplicates that function identically).',
];

export const SIMULACRUM_USES = [
  { use: 'Double your spell slots', detail: 'Your simulacrum has all your slots. That\'s effectively double your daily output.', rating: 'S+' },
  { use: 'Concentration doubling', detail: 'You concentrate on Spell A. Simulacrum concentrates on Spell B. Both active.', rating: 'S+' },
  { use: 'Action economy', detail: 'Two of you acting. Two full turns. Doubled initiative presence.', rating: 'S+' },
  { use: 'Copy an ally', detail: 'Make a simulacrum of the Fighter or Paladin. Half HP but full attacks/smites.', rating: 'A+' },
  { use: 'Suicide bomber', detail: 'Simulacrum charges in, burns all slots on damage, dies. You\'re safe.', rating: 'A' },
  { use: 'Backup plan', detail: 'Leave simulacrum at base with Teleportation Circle. Emergency extraction.', rating: 'A' },
];

export const SIMULACRUM_BROKEN_COMBOS = [
  {
    combo: 'Wish + Simulacrum (Simulacrum chain)',
    detail: 'Cast Simulacrum normally → Sim casts Wish to duplicate Simulacrum → new sim casts Wish → infinite copies.',
    ruling: 'Most DMs ban this. Crawford has said it works RAW but is "not intended."',
    rating: 'BANNED',
  },
  {
    combo: 'Simulacrum + True Polymorph',
    detail: 'True Polymorph your simulacrum into an Adult Dragon. Permanent dragon ally.',
    ruling: 'Works RAW. Expensive (1,500gp) but legal.',
    rating: 'S+',
  },
  {
    combo: 'Simulacrum of a full caster ally',
    detail: 'Copy the party\'s Cleric. Half HP but full healing spells. Double party healing.',
    ruling: 'Works. The simulacrum has all of the Cleric\'s spell slots.',
    rating: 'S',
  },
];

export const SIMULACRUM_LIMITATIONS = [
  'Can\'t regain spell slots — limited resource. Once slots are spent, simulacrum is a commoner.',
  'Half max HP — squishy. Goes down fast in combat.',
  'Can\'t learn or grow — no XP, no new spells, no ASIs.',
  '1,500gp cost — not cheap. Expensive to replace if destroyed.',
  '12-hour casting time — can\'t create one in an emergency.',
  'Only one at a time (without Wish abuse) — casting again destroys the previous one.',
  'Dispel Magic can destroy it — single spell removes your 1,500gp investment.',
];

export const DM_RULINGS = {
  note: 'Simulacrum is one of the most DM-dependent spells. Discuss these before casting:',
  questions: [
    'Can my simulacrum use my magic items? (RAW: it has copies, but DMs vary.)',
    'Can I Wish to bypass the Simulacrum component cost?',
    'Is the Simulacrum chain (Wish loop) allowed?',
    'Can my simulacrum be repaired, and how?',
    'What happens to the simulacrum\'s equipment when it\'s destroyed?',
    'Does my simulacrum have its own initiative or acts on my turn?',
  ],
};
