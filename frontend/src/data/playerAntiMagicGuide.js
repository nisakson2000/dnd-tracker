/**
 * playerAntiMagicGuide.js
 * Player Mode: Antimagic Field, countermeasures, and magic suppression
 * Pure JS — no React dependencies.
 */

export const ANTIMAGIC_FIELD = {
  level: 8,
  casting: 'Action',
  duration: '1 hour, concentration',
  range: '10ft radius sphere, centered on you, moves with you',
  effects: [
    'Spells can\'t be cast within the field.',
    'Active spell effects are suppressed (resume when they leave).',
    'Magic items become mundane.',
    'Summoned creatures disappear (return when field moves away).',
    'Magical effects (like a dragon\'s breath) are NOT suppressed.',
  ],
  exceptions: [
    'Artifacts and deity-granted powers still work.',
    'Areas of antimagic don\'t suppress each other.',
  ],
};

export const ANTIMAGIC_TACTICS = [
  { tactic: 'Walk up to enemy caster', method: 'AMF on self → walk into enemy caster. They can\'t cast.', rating: 'S+', note: 'Shuts down enemy caster completely.' },
  { tactic: 'Martial + AMF', method: 'Fighter/Barbarian ally operates normally in AMF. Casters don\'t.', rating: 'S+', note: 'Martial classes are unaffected by AMF.' },
  { tactic: 'AMF vs magic-dependent boss', method: 'Drop AMF on boss using only magical abilities.', rating: 'S+', note: 'Liches, beholders (not their eye), etc.' },
  { tactic: 'Defensive AMF', method: 'Use as protection against magical attacks.', rating: 'A+', note: 'Nothing magical works in the field. Including your stuff.' },
];

export const SURVIVING_AMF = [
  { method: 'Use mundane weapons', note: 'Martial classes unaffected. Swords still work.' },
  { method: 'Stay outside the field', note: '10ft radius. Cast from beyond 10ft.' },
  { method: 'Dispel it', note: 'Dispel Magic from outside the field works on the field itself.' },
  { method: 'Wait it out', note: 'Concentration. Break caster\'s concentration.' },
  { method: 'Physical attacks on caster', note: 'The AMF caster can be hit normally. Break concentration.' },
];

export const MAGIC_SUPPRESSION_SPELLS = [
  { spell: 'Antimagic Field', level: 8, effect: 'Complete suppression in 10ft.', rating: 'S+' },
  { spell: 'Counterspell', level: 3, effect: 'Negate one spell.', rating: 'S+' },
  { spell: 'Dispel Magic', level: 3, effect: 'End one ongoing spell.', rating: 'S+' },
  { spell: 'Silence', level: 2, effect: 'Block V component spells in 20ft.', rating: 'A+' },
  { spell: 'Globe of Invulnerability', level: 6, effect: 'Block spells L5 and below from entering.', rating: 'S' },
];

export const ANTIMAGIC_TIPS = [
  'AMF suppresses YOUR magic too. Plan accordingly.',
  'Martial classes are unaffected. Swords still work.',
  'Walk AMF into enemy caster. They become helpless.',
  'AMF is concentration. Break it to restore magic.',
  'Magic items become mundane in AMF. +3 sword = normal sword.',
  'Summoned creatures vanish in AMF. Teleport out from within.',
  'Dragon breath is NOT magical. AMF doesn\'t stop it.',
  'Artifacts still work in AMF. Divine power still works.',
  'Globe of Invulnerability: blocks L5 and below spells from entering.',
  'Silence: 20ft anti-caster zone. Most spells need V component.',
];
