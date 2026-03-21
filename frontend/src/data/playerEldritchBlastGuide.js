/**
 * playerEldritchBlastGuide.js
 * Player Mode: Eldritch Blast optimization, invocations, and tactical usage
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_BLAST_RULES = {
  type: 'Cantrip (Evocation)',
  castingTime: 'Action',
  range: '120ft',
  damage: '1d10 force per beam',
  beams: [
    { level: 1, beams: 1, avgDamage: '5.5' },
    { level: 5, beams: 2, avgDamage: '11' },
    { level: 11, beams: 3, avgDamage: '16.5' },
    { level: 17, beams: 4, avgDamage: '22' },
  ],
  attackRoll: 'Separate attack roll for each beam. Each can target different creatures.',
  damageType: 'Force (the best damage type — almost nothing resists it)',
  classes: ['Warlock (class)', 'Magic Initiate (feat)', 'Spell Sniper (feat)'],
};

export const EB_INVOCATIONS = [
  { invocation: 'Agonizing Blast', effect: 'Add CHA modifier to each beam\'s damage', cost: 'Invocation slot', rating: 'S', math: 'At level 5: 2 beams × (1d10+5) = avg 21. Without: avg 11. Nearly doubles damage.' },
  { invocation: 'Repelling Blast', effect: 'Push target 10ft per beam (no save)', cost: 'Invocation slot', rating: 'S', math: 'At level 5: 20ft push. Level 17: 40ft push. Combos with Spike Growth.' },
  { invocation: 'Grasp of Hadar', effect: 'Pull target 10ft toward you (once per turn)', cost: 'Invocation slot', rating: 'A', math: 'Only once per turn regardless of beams. Pull into melee or hazards.' },
  { invocation: 'Lance of Lethargy', effect: 'Reduce target speed by 10ft (once per turn)', cost: 'Invocation slot', rating: 'B', math: 'Stacks with Repelling to keep enemies away. Situational.' },
  { invocation: 'Eldritch Spear', effect: 'Range increases to 300ft', cost: 'Invocation slot', rating: 'C', math: '120ft is already plenty. 300ft is rare to need. Spell Sniper gives 240ft.' },
];

export const EB_COMBOS = [
  { combo: 'EB + Agonizing Blast + Hex', damage: '1d10+CHA+1d6 per beam', avgLevel5: '2×(5.5+5+3.5) = 28', rating: 'S', note: 'Standard Warlock damage. Competitive with martial Extra Attack.' },
  { combo: 'EB + Repelling + Spike Growth', damage: '1d10+CHA per beam + 2d4 per 5ft pushed', avgLevel5: '21 + 4×5 per pushed target = 41', rating: 'S+', note: '10ft push = 4d4 forced movement damage per beam. Two beams = 8d4 (20 avg). Insane with Spike Growth.' },
  { combo: 'EB + Darkness + Devil\'s Sight', damage: 'Normal EB with advantage', avgLevel5: 'Higher hit rate (~91% vs 65%)', rating: 'A', note: 'You see through Darkness. Enemies can\'t see you. Advantage on all beams.' },
  { combo: 'EB + Grasp + Repelling (yo-yo)', damage: 'Pull 10ft in, push 10ft out with second beam', avgLevel5: '21 + forced movement damage', rating: 'A', note: 'Pull through Spirit Guardians, then push back. Repeat next turn.' },
  { combo: 'Quickened EB + EB', damage: 'Double EB in one turn', avgLevel5: '42 damage (4 beams total)', rating: 'A', note: 'Sorcerer/Warlock multiclass. Bonus action EB + action EB. Costly but devastating.' },
];

export const EB_VS_ALTERNATIVES = [
  { spell: 'Fire Bolt', damage: '1d10 fire', beams: 1, invocations: 'None', verdict: 'EB wins at level 5+ (multiple beams) and with invocations.' },
  { spell: 'Toll the Dead', damage: '1d12 necrotic (if injured)', beams: 1, invocations: 'None', verdict: 'Higher single-target damage but no scaling beams. EB wins long-term.' },
  { spell: 'Sacred Flame', damage: '1d8 radiant', beams: 1, invocations: 'None', verdict: 'Targets DEX save (good vs high AC). But lower damage than EB.' },
  { spell: 'Longbow', damage: '1d8+DEX', beams: '1 (no Extra Attack)', invocations: 'None', verdict: 'EB + Agonizing Blast outdamages a non-Fighter\'s longbow.' },
];

export const EB_TARGETING_TIPS = [
  'Split beams between targets to break multiple concentrations',
  'Focus fire one target if they need to die NOW',
  'Use Repelling Blast to push enemies off cliffs, into hazards, or away from squishies',
  'Target the lowest AC enemy first for guaranteed damage',
  'At level 17 with 4 beams, you can push one target 40ft in one turn',
  'Each beam is a separate attack — great for triggering effects on hit',
];

export function ebDamage(level, charisma, hasAgonizing, hasHex) {
  const beamCount = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
  const perBeam = 5.5 + (hasAgonizing ? charisma : 0) + (hasHex ? 3.5 : 0);
  return { beams: beamCount, perBeam, total: beamCount * perBeam };
}

export function ebPushDistance(beams, hasRepelling) {
  return hasRepelling ? beams * 10 : 0;
}

export function spikeGrowthCombo(beams, hasRepelling) {
  if (!hasRepelling) return 0;
  // Each 5ft of forced movement through Spike Growth = 2d4 damage
  const feetPushed = beams * 10; // 10ft per beam
  const d4s = (feetPushed / 5) * 2; // 2d4 per 5ft
  return { d4s, avgDamage: d4s * 2.5 };
}
