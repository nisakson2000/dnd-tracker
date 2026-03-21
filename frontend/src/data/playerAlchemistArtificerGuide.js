/**
 * playerAlchemistArtificerGuide.js
 * Player Mode: Alchemist Artificer — the potion brewer
 * Pure JS — no React dependencies.
 */

export const ALCHEMIST_BASICS = {
  class: 'Artificer (Alchemist)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Potion brewer and experimental elixir creator. Support/healer Artificer.',
  note: 'Weakest Artificer subclass. Experimental Elixirs are random and underwhelming. Spell-Storing Item at L11 saves it somewhat.',
};

export const ALCHEMIST_FEATURES = [
  { feature: 'Experimental Elixir', level: 3, effect: 'After long rest: create one free elixir (roll d6 for type). Can create more using spell slots. Types: Healing (2d6+INT), Swiftness (+10ft speed 1hr), Resilience (+1 AC 10min), Boldness (+1d4 attacks/saves 1min), Flight (10ft fly 10min), Transformation (alter appearance 10min).', note: 'Random free elixir is frustrating. Can choose type if spending a slot. Some options are great (Flight, Resilience).' },
  { feature: 'Alchemical Savant', level: 5, effect: 'When you cast a spell that restores HP or deals acid/fire/necrotic/poison damage: add INT to one roll (must use alchemist supplies as focus).', note: '+INT to healing AND damage spells. Cure Wounds: 1d8+INT+INT. Acid Splash: 2d6+INT.' },
  { feature: 'Restorative Reagents', level: 9, effect: 'Cast Lesser Restoration for free (INT mod times/LR). Experimental Elixirs grant 2d6+INT temp HP when drunk.', note: 'Free Lesser Restorations + temp HP on elixirs. Decent support package.' },
  { feature: 'Chemical Mastery', level: 15, effect: 'Resistance to acid and poison damage. Immune to poisoned condition. Cast Greater Restoration and Heal once each/LR (no material components).', note: 'Free Greater Restoration and Heal. No 100gp/300gp components. Best L15 feature of the subclass.' },
];

export const ELIXIR_TYPES = [
  { roll: 1, type: 'Healing', effect: '2d6+INT HP', note: 'Decent healing. Equivalent to a small Cure Wounds.' },
  { roll: 2, type: 'Swiftness', effect: '+10ft speed for 1 hour', note: 'Good for melee allies.' },
  { roll: 3, type: 'Resilience', effect: '+1 AC for 10 min', note: '+1 AC is always welcome.' },
  { roll: 4, type: 'Boldness', effect: '+1d4 to attacks and saves for 1 min', note: 'Like a personal Bless. 1 minute is short.' },
  { roll: 5, type: 'Flight', effect: '10ft fly speed for 10 min', note: 'Hover over traps, reach high places. 10ft is slow but useful.' },
  { roll: 6, type: 'Transformation', effect: 'Alter Self effect for 10 min', note: 'Disguise or aquatic adaptation. Situational.' },
];

export const ALCHEMIST_TACTICS = [
  { tactic: 'Double INT healing', detail: 'Alchemical Savant: Cure Wounds heals 1d8+INT+INT. With INT 20: 1d8+10. Massive single-target heal for L1 slot.', rating: 'A' },
  { tactic: 'Acid Splash + INT', detail: 'Acid Splash: 2d6+INT acid. Two targets. Free cantrip. Solid AoE cantrip damage.', rating: 'A' },
  { tactic: 'Pre-combat elixirs', detail: 'Give Flight elixirs before a fight. Or Resilience for +1 AC. Distribute to party.', rating: 'B', note: 'Elixir lasts until drunk or long rest. Pre-buff the party.' },
  { tactic: 'Free Lesser Restoration', detail: 'L9: INT mod free Lesser Restorations per day. Remove poison, disease, blindness, deafness, paralysis.', rating: 'A' },
  { tactic: 'Free Heal (L15)', detail: 'L15: cast Heal (70 HP) once per long rest. No slot. No components. Emergency full heal.', rating: 'S' },
];

export function alchemicalSavantHealing(spellDieCount, dieSize, intMod) {
  const dieAvg = { 6: 3.5, 8: 4.5, 10: 5.5 };
  return spellDieCount * (dieAvg[dieSize] || 4.5) + intMod + intMod; // Spell mod + Alchemical Savant
}

export function experimentalElixirHeal(intMod) {
  return 7 + intMod; // 2d6 avg + INT
}

export function freeRestorations(intMod) {
  return Math.max(1, intMod);
}
