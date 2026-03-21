/**
 * playerHealingSpiritGuide.js
 * Player Mode: Healing Spirit — the controversial healing spell
 * Pure JS — no React dependencies.
 */

export const HEALING_SPIRIT_BASICS = {
  spell: 'Healing Spirit',
  level: 2,
  school: 'Conjuration',
  castTime: '1 bonus action',
  range: '60ft',
  duration: 'Concentration, up to 1 minute',
  classes: ['Druid', 'Ranger'],
  note: 'Creates a spirit in a 5ft cube. When a creature enters or starts turn there: heal 1d6. Errata: limited to 1 + spellcasting mod uses. Still excellent for out-of-combat healing.',
};

export const HEALING_SPIRIT_VERSIONS = {
  original: {
    healing: '1d6 per creature per round for 10 rounds',
    limit: 'No use limit. Each creature heals once per turn.',
    totalParty4: '4 creatures × 10 rounds × 3.5 = 140 HP from L2 slot',
    note: 'BROKEN. Pre-errata: conga line through the spirit. 140+ HP from one L2 slot. Banned at most tables.',
  },
  errata: {
    healing: '1d6 per creature per round',
    limit: '1 + spellcasting ability modifier total uses (not per creature — total)',
    totalUses: 'WIS +5: 6 uses total. 6 × 3.5 = 21 HP from L2 slot.',
    note: 'Post-errata: still good but not broken. 21 HP from L2 slot is decent out-of-combat healing.',
  },
};

export const HEALING_SPIRIT_SCALING = [
  { slot: 2, diePerHeal: '1d6', uses: 6, avgTotal: 21, note: 'Base. 21 HP total with WIS +5.' },
  { slot: 3, diePerHeal: '2d6', uses: 6, avgTotal: 42, note: 'Upcast: 42 HP total. Very efficient.' },
  { slot: 4, diePerHeal: '3d6', uses: 6, avgTotal: 63, note: 'Upcast: 63 HP total.' },
  { slot: 5, diePerHeal: '4d6', uses: 6, avgTotal: 84, note: 'Upcast: 84 HP total.' },
];

export const HEALING_SPIRIT_TACTICS = [
  { tactic: 'Out-of-combat healing', detail: 'Cast after combat. Party walks through spirit. 21+ HP distributed across party. Better than multiple Cure Wounds.', rating: 'S' },
  { tactic: 'In-combat positioning', detail: 'Place spirit on frontliner. They heal 1d6 at start of each turn. Like passive regeneration.', rating: 'A' },
  { tactic: 'Move the spirit', detail: 'BA: move the spirit 30ft. Reposition to whoever needs healing most. Flexible placement.', rating: 'A' },
  { tactic: 'Concentration cost', detail: 'Requires concentration. Competes with other Druid concentration spells. Best used post-combat when nothing else to concentrate on.', rating: 'B' },
  { tactic: 'Upcast for group healing', detail: 'L3 slot: 2d6 per use = 42 HP total. Split across party = 10 HP each for 4 members. Very efficient.', rating: 'A' },
];

export const HEALING_SPIRIT_VS_ALTERNATIVES = {
  vs_prayer_of_healing: { hsAdvantage: 'Bonus action cast. Moveable. Concentration but flexible.', pohAdvantage: '2d8+WIS per creature (6 creatures). No concentration. 10 min cast.', verdict: 'Prayer of Healing heals more per target. Healing Spirit is more flexible.' },
  vs_cure_wounds: { hsAdvantage: 'Multiple uses from one slot. Party-wide potential.', cwAdvantage: 'Immediate, targeted, no concentration. Higher per-use in combat.', verdict: 'Healing Spirit wins for group healing. Cure Wounds for emergency single-target.' },
  vs_goodberry: { hsAdvantage: 'More healing per slot (without Life Cleric). Faster distribution.', gbAdvantage: 'Lasts 24 hours. Pre-cast. No concentration. Nourishment.', verdict: 'Goodberry with Life Cleric wins. Without Life Cleric: Healing Spirit wins.' },
};

export function healingSpiritTotal(slotLevel, wisdomMod) {
  const uses = 1 + wisdomMod;
  const dicePerHeal = slotLevel - 1;
  const avgPerHeal = dicePerHeal * 3.5;
  return { uses, avgPerHeal, totalAvg: Math.round(uses * avgPerHeal * 10) / 10 };
}
