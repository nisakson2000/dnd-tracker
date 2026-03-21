/**
 * playerBladesingerGuide.js
 * Player Mode: Bladesinger Wizard subclass optimization
 * Pure JS — no React dependencies.
 */

export const BLADESINGER_BASICS = {
  class: 'Wizard (Bladesinger)',
  restriction: 'Elves only (some DMs waive this, Tasha\'s removed restriction)',
  armorTraining: 'Light armor, one one-handed melee weapon',
  keyFeature: 'Bladesong: +INT to AC, concentration saves, Acrobatics, walking speed +10ft.',
  bladesongUses: 'PB times per long rest (Tasha\'s). Lasts 1 minute.',
  bladesongEnds: 'If you use two hands for a weapon, wear medium/heavy armor, use a shield, or are incapacitated.',
  extraAttack: 'L6: Replace one attack with a cantrip (Booming Blade/Green-Flame Blade).',
};

export const BLADESINGER_AC = {
  base: 'Mage Armor (13) + DEX + INT (Bladesong)',
  example: '13 + 4 (DEX) + 4 (INT) = 21 AC. With Shield spell = 26 AC.',
  comparison: 'Plate + Shield Fighter = 20 AC. Bladesinger can exceed this.',
  note: 'You\'re a Wizard with Fighter-level AC and full spellcasting.',
};

export const BLADESINGER_SPELLS = [
  { spell: 'Shield', level: 1, note: '+5 AC reaction. With Bladesong AC already high, you become untouchable.' },
  { spell: 'Absorb Elements', level: 1, note: 'Halve elemental, add to next melee hit. Synergizes with Extra Attack.' },
  { spell: 'Shadow Blade', level: 2, note: '2d8 psychic finesse. Use with Extra Attack for massive damage.' },
  { spell: 'Haste', level: 3, note: 'Self-Haste: +2 AC (stacks with Bladesong), extra attack, double speed.' },
  { spell: 'Spirit Shroud', level: 3, note: '+1d8 per hit. With 2 attacks = +2d8/round. Scales at higher slots.' },
  { spell: 'Steel Wind Strike', level: 5, note: '6d10 force to up to 5 targets. Teleport to any. Peak Bladesinger spell.' },
  { spell: 'Tenser\'s Transformation', level: 6, note: '2d12 force per hit, 50 temp HP, proficiency in all weapons/armor.' },
];

export const BLADESINGER_TACTICS = [
  { tactic: 'Extra Attack + cantrip', detail: 'Weapon attack + Booming Blade = 2 damage instances + thunder rider.', level: 6 },
  { tactic: 'Shadow Blade + Extra Attack', detail: '2d8 × 2 attacks + cantrip. 4d8+ damage per turn with a 2nd level slot.', level: 6 },
  { tactic: 'Concentration fortress', detail: 'Bladesong adds INT to concentration saves. +4 INT = minimum DC 14 concentration.', level: 2 },
  { tactic: 'Spirit Shroud melee', detail: '+1d8 per hit × 2 attacks = +2d8/round. No attack roll, just extra damage.', level: 6 },
  { tactic: 'Defensive layering', detail: 'Bladesong + Mage Armor + Shield + Mirror Image = nearly unkillable.', level: 2 },
  { tactic: 'Steel Wind Strike finisher', detail: '6d10 force to 5 targets, then teleport. Best AoE melee spell.', level: 9 },
];

export const BLADESINGER_STATS = {
  priority: 'INT > DEX > CON > WIS > CHA > STR',
  note: 'INT is both your spellcasting AND AC/concentration stat. Pump it first.',
  racePicks: ['High Elf (free cantrip + weapon)', 'Custom Lineage (+2 INT + feat)', 'Eladrin (misty step racial)'],
};

export function bladesingerAC(dexMod, intMod, hasMageArmor, hasShield) {
  const base = hasMageArmor ? 13 : 10;
  return base + dexMod + intMod + (hasShield ? 5 : 0);
}

export function bladesongConcentration(conMod, intMod, damage) {
  const dc = Math.max(10, Math.floor(damage / 2));
  const bonus = conMod + intMod;
  const needed = dc - bonus;
  return { dc, bonus, passChance: Math.min(100, Math.max(5, (21 - needed) * 5)) };
}
