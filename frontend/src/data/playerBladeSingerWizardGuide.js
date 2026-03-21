/**
 * playerBladeSingerWizardGuide.js
 * Player Mode: Bladesinging Wizard — the elven sword-mage
 * Pure JS — no React dependencies.
 */

export const BLADESINGER_BASICS = {
  class: 'Wizard (Bladesinging)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Melee wizard. Bladesong adds AC, speed, concentration. Extra Attack with cantrip. Best gish wizard.',
  note: 'Highest AC in the game when Bladesong + Shield + Mage Armor. Full Wizard spell list. Incredible subclass.',
};

export const BLADESINGER_FEATURES = [
  { feature: 'Training in War and Song', level: 2, effect: 'Light armor proficiency. One-handed melee weapon proficiency.', note: 'Allows rapier attacks. Light armor for backup but Mage Armor is usually better.' },
  { feature: 'Bladesong', level: 2, effect: 'Bonus action: activate Bladesong for 1 minute. +INT to AC, concentration saves, Acrobatics, +10ft speed. PB uses/LR.', note: 'At +5 INT: +5 AC, +5 concentration saves, +5 Acrobatics, +10ft speed. Mage Armor (13) + DEX (+4) + INT (+5) = AC 22 without Shield.' },
  { feature: 'Extra Attack', level: 6, effect: 'When you take Attack action: one attack can be replaced with casting a cantrip.', note: 'Attack + Booming Blade in one action. Or attack + Fire Bolt for ranged. Unique to Bladesinger.' },
  { feature: 'Song of Defense', level: 10, effect: 'While Bladesong active, expend spell slot to reduce damage by 5× slot level.', note: 'L3 slot = reduce 15 damage. Emergency damage reduction. Expensive but can save your life.' },
  { feature: 'Song of Victory', level: 14, effect: 'While Bladesong active, add INT mod to melee weapon damage.', note: '+5 melee damage. With Extra Attack: +10 per round. Stacks with Shadow Blade or regular weapon.' },
];

export const BLADESINGER_AC_MATH = [
  { components: 'Mage Armor (13) + DEX 16 (+3) + INT 20 (+5, Bladesong)', ac: 21, note: 'Base Bladesong AC without Shield.' },
  { components: 'Above + Shield spell (+5)', ac: 26, note: 'AC 26 as a reaction. Most attacks miss.' },
  { components: 'Above + Haste (+2)', ac: 28, note: 'AC 28 with Haste. Nearly unhittable. But uses concentration.' },
  { components: 'Shield spell alone', ac: '+5 for 1 round', note: 'Shield is a reaction. Combine with Bladesong AC.' },
];

export const BLADESINGER_TACTICS = [
  { tactic: 'Booming Blade + Extra Attack', detail: 'L6: Attack action = weapon attack + Booming Blade. Total: 2 attacks, one with bonus thunder damage if target moves.', rating: 'S' },
  { tactic: 'Shadow Blade + Bladesong', detail: 'Shadow Blade (2d8 psychic, finesse). Bladesong for AC. Extra Attack at L6. 2 attacks × 2d8+DEX+INT(L14).', rating: 'S' },
  { tactic: 'War Caster + Booming Blade OA', detail: 'War Caster: cast Booming Blade as opportunity attack. Enemy leaves → full Booming Blade damage + movement rider.', rating: 'S' },
  { tactic: 'Bladesong concentration', detail: '+INT to concentration saves. With War Caster (advantage): nearly impossible to lose concentration on DC 10.', rating: 'S' },
  { tactic: 'Melee OR ranged on same turn', detail: 'Extra Attack: weapon swing + Fire Bolt (cantrip). Switch between melee and ranged within one Attack action.', rating: 'A' },
  { tactic: 'Spirit Shroud + Extra Attack', detail: 'Spirit Shroud (L3): +1d8 per hit on attacks. Extra Attack: 2 hits × 1d8 extra = 2d8 bonus per turn.', rating: 'A' },
];

export const BLADESINGER_SPELL_PRIORITIES = [
  { spell: 'Shield', note: '+5 AC reaction. With Bladesong: AC 26+. Essential.', rating: 'S' },
  { spell: 'Absorb Elements', note: 'Halve elemental damage. Bonus melee damage. Keeps you alive.', rating: 'S' },
  { spell: 'Shadow Blade', note: 'Best Bladesinger weapon. 2d8 psychic, advantage in dim light. Scales with upcast.', rating: 'S' },
  { spell: 'Haste', note: 'Self-Haste: +2 AC, double speed, extra Attack action. Risky (concentration + lethargy on loss).', rating: 'A' },
  { spell: 'Mirror Image', note: 'No concentration. 3 duplicates absorb attacks. Stacks with high AC.', rating: 'A' },
  { spell: 'Spirit Shroud', note: 'Extra 1d8 per hit. Better than Haste at L6+ (no lethargy risk).', rating: 'A' },
];

export function bladesongAC(baseDexMod, intMod, hasMageArmor = true) {
  const baseAC = hasMageArmor ? 13 : 10;
  return baseAC + baseDexMod + intMod;
}

export function bladesongConcentrationBonus(intMod, conMod, hasProficiency = false, profBonus = 0) {
  return conMod + intMod + (hasProficiency ? profBonus : 0);
}

export function songOfDefenseReduction(slotLevel) {
  return slotLevel * 5;
}
