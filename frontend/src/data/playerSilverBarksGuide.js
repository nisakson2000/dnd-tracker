/**
 * playerSilverBarksGuide.js
 * Player Mode: Silvery Barbs — the most controversial spell
 * Pure JS — no React dependencies.
 */

export const SILVERY_BARBS_BASICS = {
  spell: 'Silvery Barbs',
  level: 1,
  school: 'Enchantment',
  castingTime: 'Reaction (when a creature succeeds on an attack roll, ability check, or saving throw)',
  range: '60ft',
  components: 'V',
  duration: 'Instantaneous',
  classes: ['Bard', 'Sorcerer', 'Wizard'],
  source: 'Strixhaven: A Curriculum of Chaos',
  note: 'Arguably the most powerful L1 spell ever printed. Force a reroll AND give advantage to an ally. Many DMs ban or limit it.',
};

export const SILVERY_BARBS_EFFECTS = {
  trigger: 'Creature within 60ft succeeds on an attack roll, ability check, or saving throw.',
  effect1: 'Target must reroll the d20 and use the LOWER result.',
  effect2: 'Choose a different creature within 60ft: it has advantage on the next attack roll, ability check, or saving throw it makes within 1 round.',
  note: 'Two effects for 1 reaction and a L1 slot. Force a reroll + grant advantage. Incredible value.',
};

export const SILVERY_BARBS_USES = [
  { use: 'Force save reroll', detail: 'Enemy saves vs your Hold Person? Silvery Barbs → reroll the save. If they fail the reroll, they\'re paralyzed.', rating: 'S' },
  { use: 'Negate enemy crit', detail: 'Enemy crits you? Silvery Barbs → reroll. New roll is likely not a crit (only 5% chance). Turns crit into normal hit or miss.', rating: 'S' },
  { use: 'Grant advantage to Rogue', detail: 'Second effect: give advantage to the Rogue. Guarantees Sneak Attack eligibility for free.', rating: 'A' },
  { use: 'Counter enemy save vs Banishment', detail: 'Boss saves vs Banishment → Silvery Barbs → reroll. Banishment with no repeated saves = fight over.', rating: 'S' },
  { use: 'Stack with save debuffs', detail: 'Eloquence Bard: Unsettling Words (-1d8 save) + Silvery Barbs (reroll). Double debuff on saves.', rating: 'S' },
  { use: 'Legendary Resistance burn', detail: 'Force reroll → enemy might fail → must use LR. Then Silvery Barbs again on the next save. Burns LRs faster.', rating: 'A' },
];

export const SILVERY_BARBS_BALANCE = {
  arguments_for_banning: [
    'L1 slot for what is essentially a better Cutting Words + Bardic Inspiration combined.',
    'Makes save-or-suck spells way too reliable when stacked.',
    'Competes with Shield/Absorb Elements for reaction, but is often better.',
    'Scales with the power of the spell it protects, not its own level.',
  ],
  arguments_against_banning: [
    'Costs a L1 slot AND your reaction. Can\'t Shield or Counterspell that round.',
    'Only forces a reroll, doesn\'t guarantee failure.',
    'Bards already have Cutting Words which is similar.',
    'High-level play has bigger problems than a L1 spell.',
  ],
  note: 'Check with your DM before taking this spell. Many tables ban or limit it.',
};

export const SILVERY_BARBS_VS_ALTERNATIVES = [
  { spell: 'Silvery Barbs', cost: 'L1 slot + reaction', effect: 'Force reroll + grant advantage', rating: 'S' },
  { spell: 'Shield', cost: 'L1 slot + reaction', effect: '+5 AC for 1 round', rating: 'S (defensive)' },
  { spell: 'Absorb Elements', cost: 'L1 slot + reaction', effect: 'Halve elemental damage + bonus melee damage', rating: 'A (situational)' },
  { spell: 'Cutting Words (Bard)', cost: 'Bardic Inspiration + reaction', effect: 'Subtract BI die from attack/check/damage', rating: 'A' },
  { spell: 'Counterspell', cost: 'L3 slot + reaction', effect: 'Cancel a spell entirely', rating: 'S (vs casters)' },
];

export function rerollImpact(originalRoll, dc) {
  // If they succeeded with originalRoll, chance they fail on reroll
  if (originalRoll < dc) return 0; // They didn't actually succeed
  const failChance = (dc - 1) / 20; // Chance of rolling below DC
  return failChance;
}
