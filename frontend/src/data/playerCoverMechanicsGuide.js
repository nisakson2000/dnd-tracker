/**
 * playerCoverMechanicsGuide.js
 * Player Mode: Cover rules — half, three-quarters, and full
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  { type: 'Half Cover', acBonus: 2, dexSaveBonus: 2, description: 'Half your body covered. Low wall, furniture, another creature.', note: '+2 AC and +2 DEX saves. Position near obstacles for free defense.' },
  { type: 'Three-Quarters Cover', acBonus: 5, dexSaveBonus: 5, description: 'Three-quarters covered. Portcullis, thick tree, arrow slit.', note: '+5 AC and +5 DEX saves. Very hard to hit.' },
  { type: 'Full Cover', acBonus: 'Untargetable', dexSaveBonus: 'N/A', description: 'Completely concealed behind solid obstacle.', note: 'Can\'t be targeted by attacks or most spells.' },
];

export const COVER_INTERACTIONS = [
  { feat: 'Sharpshooter', effect: 'Ignores half and three-quarters cover for ranged weapon attacks.' },
  { feat: 'Spell Sniper', effect: 'Ignores half and three-quarters cover for spell attacks.' },
  { spell: 'Sacred Flame', effect: 'Target gains no benefit from cover on DEX save.' },
  { rule: 'Creatures as cover', effect: 'Allies/enemies between you and attacker = half cover (+2 AC).' },
];

export const COVER_TACTICS = [
  { tactic: 'Use allies as cover', detail: 'Stand behind a party member = +2 AC vs ranged from other side.', rating: 'A' },
  { tactic: 'Lean and shoot', detail: 'Step out of full cover → attack → step back into cover.', rating: 'S' },
  { tactic: 'Create cover', detail: 'Wall of Stone, Mold Earth, Minor Illusion. Create cover where there is none.', rating: 'A' },
];

export function effectiveACWithCover(baseAC, coverType) {
  const bonus = coverType === 'half' ? 2 : coverType === 'three-quarters' ? 5 : 0;
  return { ac: baseAC + bonus, bonus };
}
