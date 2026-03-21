/**
 * playerMagicMissileGuide.js
 * Player Mode: Magic Missile rules, damage calculation, and tactical usage
 * Pure JS — no React dependencies.
 */

export const MAGIC_MISSILE_RULES = {
  level: 1,
  castingTime: 'Action',
  range: '120ft',
  damage: '3 darts, each dealing 1d4+1 force damage',
  autoHit: 'Each dart automatically hits. No attack roll. No save.',
  targeting: 'Choose one or more targets. Assign darts individually.',
  upcasting: '+1 dart per slot level above 1st.',
  counters: ['Shield spell (blocks completely)', 'Brooch of Shielding (immunity)'],
  forceType: 'Force damage — almost nothing resists it.',
};

export const MM_DAMAGE_CONTROVERSY = {
  question: 'Do you roll 1d4+1 once (applied to all darts) or separately for each dart?',
  crawfordRuling: 'Roll 1d4+1 ONCE. All darts deal the same damage. (RAI per Crawford)',
  tableRuling: 'Many tables roll separately for each dart. Ask your DM.',
  implication: {
    singleRoll: 'Evocation Wizard\'s Empowered Evocation adds INT to ALL darts (they count as one damage roll).',
    separateRoll: 'Each dart is its own damage roll. Empowered Evocation only adds to one.',
  },
  empoweredEvocation: 'If using Crawford ruling: MM + Empowered = (1d4+1+INT) × darts. At level 10 with INT 20: (1d4+6) × 3 = avg 25.5 with a 1st level slot.',
};

export const MM_TACTICAL_USES = [
  { use: 'Breaking concentration', reason: 'Each dart forces a separate concentration save. 3 darts = 3 CON saves at DC 10.', rating: 'S', note: 'Even with +5 CON, three saves means ~14% chance to fail at least one.' },
  { use: 'Guaranteed damage', reason: 'Can\'t miss. When you absolutely need damage on a target (finishing off 3 HP enemy at 120ft).', rating: 'A' },
  { use: 'Hitting high-AC targets', reason: 'AC 25 dragon? Doesn\'t matter. MM always hits.', rating: 'A' },
  { use: 'Splitting darts', reason: 'One dart to three different enemies. Finish off 3 low-HP enemies in one spell.', rating: 'A' },
  { use: 'Waking up sleeping enemies', reason: 'Exact 1d4+1 per dart. Controlled damage to wake up Hypnotic Pattern targets at right time.', rating: 'B' },
  { use: 'Mirror Image counter', reason: 'MM doesn\'t target a creature — it hits automatically. Some DMs rule it bypasses Mirror Image.', rating: 'B', note: 'Actually debated. Sage Advice says MM still hits images. Ask your DM.' },
];

export const MM_SCALING = [
  { slot: 1, darts: 3, avgDamage: 10.5, avgEmpowered: '25.5 (INT 5)' },
  { slot: 2, darts: 4, avgDamage: 14, avgEmpowered: '34 (INT 5)' },
  { slot: 3, darts: 5, avgDamage: 17.5, avgEmpowered: '42.5 (INT 5)' },
  { slot: 4, darts: 6, avgDamage: 21, avgEmpowered: '51 (INT 5)' },
  { slot: 5, darts: 7, avgDamage: 24.5, avgEmpowered: '59.5 (INT 5)' },
  { slot: 9, darts: 11, avgDamage: 38.5, avgEmpowered: '93.5 (INT 5)' },
];

export const CONCENTRATION_BREAK_MATH = {
  description: 'Each dart forces a separate CON save (DC 10, since damage < 20)',
  probabilities: [
    { conSave: 0, fail1of3: '57.8%', fail1of5: '76.3%' },
    { conSave: 3, fail1of3: '27.1%', fail1of5: '40.1%' },
    { conSave: 5, fail1of3: '14.3%', fail1of5: '22.6%' },
    { conSave: 7, fail1of3: '7.1%', fail1of5: '11.5%' },
    { conSave: 9, fail1of3: '0.1%', fail1of5: '0.2%' },
  ],
  note: 'At +9 CON save (minimum roll 10 = DC), auto-success. War Caster advantage makes this even harder to break.',
};

export function mmDamage(slotLevel, intMod, empoweredEvocation) {
  const darts = 2 + slotLevel;
  const perDart = 3.5 + (empoweredEvocation ? intMod : 0); // 1d4+1 avg = 3.5
  return { darts, perDart, total: darts * perDart };
}

export function concentrationBreakChance(darts, targetConSave) {
  const dc = 10;
  const failChance = Math.max(0.05, Math.min(0.95, (dc - targetConSave) / 20));
  const allSucceed = Math.pow(1 - failChance, darts);
  return Math.round((1 - allSucceed) * 100);
}
