/**
 * playerChronurgyWizardGuide.js
 * Player Mode: Chronurgy Wizard optimization — time manipulation
 * Pure JS — no React dependencies.
 */

export const CHRONURGY_BASICS = {
  class: 'Wizard (Chronurgy Magic)',
  source: 'Explorer\'s Guide to Wildemount',
  theme: 'Manipulate time. Control initiative, save allies, store spells.',
  note: 'Arguably the strongest Wizard subclass. Time manipulation is inherently broken.',
};

export const CHRONURGY_FEATURES = [
  { feature: 'Chronal Shift', level: 2, effect: 'Reaction: force reroll on attack/check/save (you or creature you can see within 30ft). Must use new roll. 2 uses/long rest.', note: 'Better than Silvery Barbs — works on ANY d20 and forces the reroll (not take lower).' },
  { feature: 'Temporal Awareness', level: 2, effect: 'Add INT to initiative rolls.', note: '+5 initiative with 20 INT. Going first as a control Wizard is devastating.' },
  { feature: 'Momentary Stasis', level: 6, effect: 'Action: creature makes CON save or is incapacitated with speed 0 until end of your next turn. INT mod uses/long rest.', note: 'Free incapacitate without a spell slot. CON save. 5 uses/day at INT 20.' },
  { feature: 'Arcane Abeyance', level: 10, effect: 'When you cast a spell of 4th level or lower, store it in a tiny bead. Anyone can use the bead to cast the spell.', note: 'STORE SPELLS FOR ALLIES. Give your Fighter a bead of Fireball. Or Counterspell.' },
  { feature: 'Convergent Future', level: 14, effect: 'Reaction: decide whether a creature you can see succeeds or fails on a save/attack/check. Gain exhaustion. Reset on short rest.', note: 'DECIDE THE OUTCOME. Hold Monster? It fails. Portent but better but with exhaustion cost.' },
];

export const CHRONURGY_TACTICS = [
  { tactic: 'Initiative domination', detail: '+INT to initiative + Alert feat = +10+ initiative. Go first. Hypnotic Pattern. Fight over.', rating: 'S' },
  { tactic: 'Chronal Shift saves', detail: 'Ally fails a Dominate save? Reroll. Enemy crits? Force reroll. Free insurance twice per day.', rating: 'S' },
  { tactic: 'Arcane Abeyance beads', detail: 'Give your Fighter a bead of Haste (casts on themselves). Give Rogue a bead of Greater Invisibility.', rating: 'S' },
  { tactic: 'Convergent Future + save spells', detail: 'Cast Hold Monster. Use Convergent Future to make them fail. Guaranteed paralysis.', rating: 'S' },
  { tactic: 'Gift of Alacrity', detail: 'Dunamancy spell: +1d8 to initiative for 8 hours. No concentration. Cast on party.', rating: 'A' },
  { tactic: 'Momentary Stasis', detail: 'Free incapacitate. Use when out of spell slots or against low-priority targets.', rating: 'A' },
];

export const ARCANE_ABEYANCE_USES = [
  { stored: 'Counterspell bead', recipient: 'Fighter/Rogue', note: 'Non-caster can now counter enemy spells. Game-changing.' },
  { stored: 'Haste bead', recipient: 'Fighter/Barbarian', note: 'They self-buff without you concentrating. Frees your concentration.' },
  { stored: 'Fireball bead', recipient: 'Anyone', note: 'Extra Fireball from anyone in the party. Reaction/action to release.' },
  { stored: 'Web/Entangle bead', recipient: 'Rogue', note: 'Rogue drops crowd control. Unusual and effective.' },
  { stored: 'Dimension Door bead', recipient: 'Squishy ally', note: 'Emergency escape for the Wizard or Sorcerer.' },
];

export function temporalAwarenessInitiative(dexMod, intMod, hasAlert) {
  return dexMod + intMod + (hasAlert ? 5 : 0);
}

export function convergentFutureExhaustion(usesThisFight) {
  return usesThisFight; // 1 exhaustion per use, resets on short rest
}
