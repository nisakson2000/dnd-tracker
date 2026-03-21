/**
 * playerCoverAndConcealment.js
 * Player Mode: Cover rules, concealment, and using the environment defensively
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  {
    type: 'Half Cover',
    acBonus: +2,
    savBonus: +2,
    examples: ['Low wall', 'Furniture', 'Another creature', 'Thin tree trunk'],
    rule: 'Target is at least half-blocked by an obstacle between them and the attacker.',
  },
  {
    type: 'Three-Quarters Cover',
    acBonus: +5,
    savBonus: +5,
    examples: ['Arrow slit', 'Behind a thick tree', 'Portcullis', 'Peeking around a corner'],
    rule: 'Target is at least three-quarters blocked by an obstacle.',
  },
  {
    type: 'Total Cover',
    acBonus: 'Can\'t be targeted',
    savBonus: 'N/A',
    examples: ['Fully behind a wall', 'Closed door', 'Complete obstruction'],
    rule: 'Target is completely concealed. Can\'t be directly targeted by attacks or most spells.',
  },
];

export const CONCEALMENT_VS_COVER = {
  cover: 'Physical barrier that blocks attacks. Provides AC and save bonuses.',
  concealment: 'Visual obstruction (fog, darkness, foliage). Doesn\'t block attacks but imposes disadvantage.',
  lightlyObscured: 'Dim light, patchy fog, moderate foliage. Disadvantage on Perception checks relying on sight.',
  heavilyObscured: 'Darkness, opaque fog, dense foliage. Effectively blinded — attacks have disadvantage, attacks against have advantage.',
};

export const COVER_TACTICS = [
  { tactic: 'Ranged peekaboo', detail: 'Step out from total cover, attack, step back behind cover. Enemies can\'t target you on their turn.', rating: 'S' },
  { tactic: 'Use allies as cover', detail: 'RAW, other creatures provide half cover (+2 AC). Stay behind your Barbarian.', rating: 'A' },
  { tactic: 'Flip tables', detail: 'Overturn a table for half cover. Costs an action but provides +2 AC and saves.', rating: 'B' },
  { tactic: 'Arrow slits', detail: 'Three-quarters cover (+5 AC) while attacking through the slit. Massive defensive advantage.', rating: 'S' },
  { tactic: 'Create cover', detail: 'Wall of Stone, Mold Earth, Shape Water to create barriers. Casters make their own cover.', rating: 'A' },
  { tactic: 'Corner fighting', detail: 'Fight at a corner. Step out to attack, step back. Only one enemy can reach you at a time.', rating: 'S' },
  { tactic: 'Prone behind cover', detail: 'Go prone behind half cover. Ranged attacks have disadvantage (prone) + you get +2 AC (cover).', rating: 'A' },
];

export const SPELLS_THAT_IGNORE_COVER = [
  { spell: 'Sacred Flame', note: 'Ignores half and three-quarters cover. DEX save cantrip.' },
  { spell: 'Meteor Swarm', note: 'Spreads around corners. Total cover in radius is irrelevant.' },
  { spell: 'Fireball', note: 'Spreads around corners. Cover in the AoE doesn\'t help.' },
  { spell: 'Lightning Bolt', note: 'Hits everything in the line. Cover along the line doesn\'t apply.' },
  { spell: 'Shatter', note: 'Sound-based AoE that spreads around corners.' },
  { spell: 'Magic Missile', note: 'Auto-hit. No attack roll, so cover AC bonus is irrelevant.' },
];

export const CREATING_COVER_SPELLS = [
  { spell: 'Mold Earth (cantrip)', cover: 'Half cover', note: 'Excavate a trench or raise a dirt wall. 5ft cube. 1 action.' },
  { spell: 'Wall of Stone (5th)', cover: 'Total cover', note: 'Create permanent stone walls. Multiple panels for a fortress.' },
  { spell: 'Wall of Force (5th)', cover: 'Total cover', note: 'Invisible, indestructible wall. Nothing passes through.' },
  { spell: 'Wind Wall (3rd)', cover: 'Blocks projectiles', note: 'Ranged attacks through it auto-fail. Concentration.' },
  { spell: 'Tiny Hut (3rd, ritual)', cover: 'Total cover (from outside)', note: 'Dome blocks everything from outside. Inside can attack out.' },
];

export function effectiveAC(baseAC, coverType) {
  if (coverType === 'half') return baseAC + 2;
  if (coverType === 'three-quarters') return baseAC + 5;
  if (coverType === 'total') return Infinity;
  return baseAC;
}

export function coverSaveBonus(coverType) {
  if (coverType === 'half') return 2;
  if (coverType === 'three-quarters') return 5;
  return 0;
}
