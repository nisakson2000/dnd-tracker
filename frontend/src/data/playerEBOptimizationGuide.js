/**
 * playerEBOptimizationGuide.js
 * Player Mode: Eldritch Blast — the best cantrip in 5e, optimized
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_BLAST_BASICS = {
  type: 'Cantrip (Evocation)',
  castingTime: '1 action',
  range: '120 feet',
  components: 'V, S',
  duration: 'Instantaneous',
  damage: '1d10 force per beam',
  beams: [
    { level: '1-4', beams: 1, avgDamage: '5.5' },
    { level: '5-10', beams: 2, avgDamage: '11' },
    { level: '11-16', beams: 3, avgDamage: '16.5' },
    { level: '17-20', beams: 4, avgDamage: '22' },
  ],
  note: 'Force damage (almost nothing resists). Multiple beams = multiple attack rolls.',
};

export const KEY_INVOCATIONS = [
  { name: 'Agonizing Blast', effect: 'Add CHA to each beam\'s damage.', rating: 'S+ (mandatory)', note: 'At CHA 20, L17: 4 × (1d10+5) = 42 avg damage as a CANTRIP.' },
  { name: 'Repelling Blast', effect: 'Push target 10ft per beam hit.', rating: 'S+', note: '4 beams = 40ft push. Into hazards, off cliffs.' },
  { name: 'Grasp of Hadar', effect: 'One beam pulls target 10ft toward you.', rating: 'A+', note: 'Pull + push = 20ft displacement per round.' },
  { name: 'Lance of Lethargy', effect: 'One beam reduces speed by 10ft.', rating: 'A', note: 'Slow + push = enemies can never close distance.' },
  { name: 'Eldritch Spear', effect: 'EB range becomes 300ft.', rating: 'B+', note: '120ft is usually enough. Niche.' },
];

export const EB_DAMAGE_TABLE = [
  { level: 5, beams: 2, noCHA: '11', withAB: '21', withHex: '28', note: 'Competitive with Fighter Extra Attack.' },
  { level: 11, beams: 3, noCHA: '16.5', withAB: '31.5', withHex: '42', note: 'Exceeds most martial DPR.' },
  { level: 17, beams: 4, noCHA: '22', withAB: '42', withHex: '56', note: 'Best sustained cantrip damage.' },
];

export const EB_COMBOS = [
  { combo: 'EB + Agonizing + Hex', damage: '4×(1d10+1d6+5) = 56 avg at L17', rating: 'S+' },
  { combo: 'EB + Repelling + Spike Growth', damage: 'Push through = +2d4 per 5ft', rating: 'S++' },
  { combo: 'EB + Repelling + Wall of Fire', damage: 'Push through wall = +5d8 fire', rating: 'S+' },
  { combo: 'EB + Darkness + Devil\'s Sight', damage: 'Advantage on all beams', rating: 'S' },
  { combo: 'Sorlock Quicken EB', damage: '8 beams per round at L17', rating: 'S++' },
];

export const EB_TIPS = [
  'Agonizing Blast is MANDATORY. Without it, EB is just decent.',
  'Multiple beams = consistent damage and multiple chances to trigger effects.',
  'Force damage is resisted by almost nothing.',
  'Repelling Blast + Spike Growth = best cantrip combo in the game.',
  'EB scales with character level, not Warlock level. Multiclass freely.',
  'Sorlock: Sorcerer 3+ for Quickened Spell doubles your EB output.',
];
