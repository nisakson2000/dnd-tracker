/**
 * playerSatyrGuide.js
 * Player Mode: Satyr race guide — the fey trickster
 * Pure JS — no React dependencies.
 */

export const SATYR_BASICS = {
  race: 'Satyr',
  source: 'Mythic Odysseys of Theros / MotM',
  size: 'Medium',
  speed: '35ft',
  type: 'Fey (not Humanoid)',
  asi: '+2 CHA, +1 DEX (Theros) or flexible (MotM)',
  theme: 'Joyful fey creature. Magic resistance, musical talent, and 35ft speed.',
  note: 'Incredibly strong race. Magic Resistance is one of the best racial features in the game. Fey type dodges many spells.',
};

export const SATYR_TRAITS = [
  { trait: 'Fey', effect: 'Your creature type is Fey, not Humanoid.', note: 'HUGE. Hold Person, Charm Person, Dominate Person — don\'t work on you. "Humanoid" targeting spells fail.' },
  { trait: 'Magic Resistance', effect: 'Advantage on saving throws against spells and other magical effects.', note: 'THE feature. Advantage on ALL saves vs magic. Essentially Gnome Cunning but better (includes WIS/CON/STR saves).' },
  { trait: 'Mirthful Leaps', effect: 'When you make a long/high jump, add 1d8 to distance.', note: 'Minor mobility boost. Fun flavor.' },
  { trait: 'Reveler', effect: 'Proficiency in Performance and Persuasion.', note: 'Two CHA skills. Great for face characters.' },
  { trait: 'Ram', effect: 'Unarmed strike: 1d4+STR bludgeoning with head butt.', note: 'Minor. 1d4 unarmed is rarely relevant.' },
];

export const SATYR_FEY_TYPE_IMMUNITY = {
  spellsThatDontWork: [
    'Hold Person (targets humanoids only)',
    'Charm Person (targets humanoids only)',
    'Dominate Person (targets humanoids only)',
    'Crown of Madness (targets humanoids only)',
    'Calm Emotions (targets humanoids only)',
  ],
  spellsThatStillWork: [
    'Hold Monster (targets any creature)',
    'Dominate Monster (targets any creature)',
    'Banishment (targets any creature)',
    'Polymorph (targets any creature)',
  ],
  note: 'Many common control spells target "humanoids." You\'re Fey. They bounce off. This is extremely powerful.',
};

export const SATYR_BUILDS = [
  { build: 'Satyr Bard', detail: '+2 CHA. Performance + Persuasion proficiency. Magic Resistance protects your low saves. Fey type blocks Hold Person.', rating: 'S' },
  { build: 'Satyr Paladin', detail: '+2 CHA. Magic Resistance + Aura of Protection = nearly immune to spell saves. Fey type.', rating: 'S', note: 'Magic Resistance + CHA to saves = absurd save bonuses.' },
  { build: 'Satyr Warlock', detail: '+2 CHA. Magic Resistance for a class with bad saves. Fey type. 35ft speed.', rating: 'S' },
  { build: 'Satyr Sorcerer', detail: '+2 CHA. Same benefits. Magic Resistance compensates for d6 hit die squishiness.', rating: 'A' },
  { build: 'Satyr Rogue', detail: '+1 DEX. Magic Resistance + Evasion + fey type = nearly untouchable by magic.', rating: 'A' },
];

export const SATYR_VS_YUAN_TI = {
  satyr: { pros: ['Fey type (dodge humanoid spells)', '35ft speed', 'Free Persuasion + Performance', 'Not restricted by MotM nerfs'], cons: ['No poison immunity', 'No spellcasting'] },
  yuanTi: { pros: ['Poison immunity', 'Magic Resistance (same)', 'Free spellcasting (pre-MotM)'], cons: ['Humanoid type (MotM)', 'Nerfed in MotM', 'No extra speed'] },
  verdict: 'Satyr is better post-MotM. Yuan-Ti was better pre-MotM. Fey type is the differentiator.',
};

export function magicResistanceSaveBonus(baseSaveBonus, saveDC) {
  const baseChance = Math.min(0.95, Math.max(0.05, (21 - (saveDC - baseSaveBonus)) / 20));
  const advantageChance = 1 - Math.pow(1 - baseChance, 2);
  return { baseChance, advantageChance, improvement: advantageChance - baseChance };
}
