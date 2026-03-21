/**
 * playerLegendaryResistanceGuide.js
 * Player Mode: How to deal with Legendary Resistances as a player
 * Pure JS — no React dependencies.
 */

export const LEGENDARY_RESISTANCE_BASICS = {
  rule: 'When a creature with Legendary Resistance fails a saving throw, it can choose to succeed instead.',
  uses: 'Typically 3/day. Some creatures have fewer or more.',
  note: 'Legendary Resistance protects bosses from save-or-suck spells. You must burn them BEFORE your big spells will work.',
};

export const BURNING_LEGENDARY_RESISTANCES = [
  { method: 'Low-level save-or-suck spells', detail: 'Use L1-2 spells to force saves. If the boss uses LR on Hold Person L2, that\'s a win — you traded a L2 slot for a LR.', rating: 'S', note: 'Faerie Fire (L1), Command (L1), Tasha\'s Hideous Laughter (L1). Cheap spells that force LR burns.' },
  { method: 'Multiple saves per spell', detail: 'Spells that force multiple saves: each failed save burns a LR. Sickening Radiance (save each turn), Heat Metal (no save but forced drops).', rating: 'A', note: 'Repeating save spells are more efficient at burning LRs.' },
  { method: 'Silvery Barbs', detail: 'Boss succeeds a save → Silvery Barbs forces reroll (no LR because Silvery Barbs isn\'t a saving throw). If they fail reroll, they must use a LR or be affected.', rating: 'S', note: 'Double-dips on LR consumption. Force reroll → possible 2nd LR burn per save.' },
  { method: 'Cantrip saves', detail: 'Some cantrips force saves: Mind Sliver (-1d4 next save), Toll the Dead. Free save-forcing each turn.', rating: 'B', note: 'Won\'t burn LR (bosses won\'t waste LR on cantrip effects), but Mind Sliver debuffs next save.' },
  { method: 'Team coordination', detail: 'Multiple casters each use L1-2 spells. 3 casters × 1 save each = 3 LRs burned in round 1. Round 2: big spells work.', rating: 'S', note: 'Coordinate with party. Burn LRs fast, then drop Banishment/Polymorph/Hold Monster.' },
];

export const SPELLS_THAT_BYPASS_LEGENDARY_RESISTANCE = [
  { spell: 'Wall of Force', bypass: 'No saving throw. Just creates an indestructible wall/dome.', rating: 'S' },
  { spell: 'Forcecage', bypass: 'No saving throw (CHA save only to teleport out). Traps the boss.', rating: 'S' },
  { spell: 'Maze', bypass: 'No saving throw. INT checks to escape (not saves). Boss can\'t use LR.', rating: 'S' },
  { spell: 'Animate Objects', bypass: 'Attack rolls, not saves. LR doesn\'t help against 10 attacks.', rating: 'S' },
  { spell: 'Heat Metal', bypass: 'No save for the initial damage or disadvantage. Only save to drop the object.', rating: 'A' },
  { spell: 'Magic Missile', bypass: 'Auto-hit. No save. No attack roll. Guaranteed damage + concentration checks.', rating: 'A' },
  { spell: 'Create Bonfire/other terrain', bypass: 'Creates damaging terrain. Boss chooses to stay or leave. No save for terrain control.', rating: 'B' },
];

export const LEGENDARY_RESISTANCE_STRATEGY = [
  { phase: 'Phase 1: Burn LRs', rounds: '1-2', strategy: 'Multiple casters use L1-2 save spells. Force 3 saves = 3 LRs burned. Martials deal damage.', note: 'Coordinate with casters. Each caster forces one save.' },
  { phase: 'Phase 2: Control', rounds: '3-4', strategy: 'LRs depleted. Drop Banishment, Hold Monster, Polymorph, or other high-impact save-or-suck.', note: 'This is where you win. Boss has no more LRs to burn.' },
  { phase: 'Phase 3: Finish', rounds: '5+', strategy: 'Boss is controlled or debuffed. Full damage. Clean up.', note: 'If control spell holds, fight is effectively over.' },
];

export function lrBurnEfficiency(spellSlotLevel) {
  // Lower slot = more efficient LR burn
  if (spellSlotLevel <= 1) return { efficiency: 'Excellent', note: 'L1 slot traded for a LR = massive value' };
  if (spellSlotLevel <= 2) return { efficiency: 'Good', note: 'L2 slot for a LR = still good trade' };
  if (spellSlotLevel <= 3) return { efficiency: 'Fair', note: 'L3 slot for a LR = acceptable' };
  return { efficiency: 'Poor', note: 'Don\'t burn LRs with high-level slots if possible' };
}

export function roundsToDepleteLRs(legendaryResistances, castersForcingSaves) {
  return Math.ceil(legendaryResistances / castersForcingSaves);
}
