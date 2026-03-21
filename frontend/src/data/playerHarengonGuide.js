/**
 * playerHarengonGuide.js
 * Player Mode: Harengon race guide — the rabbit folk
 * Pure JS — no React dependencies.
 */

export const HARENGON_BASICS = {
  race: 'Harengon',
  source: 'The Wild Beyond the Witchlight / MotM',
  size: 'Small or Medium (choose)',
  speed: '30ft',
  asi: 'Flexible (MotM)',
  theme: 'Lucky rabbit folk. Add proficiency to initiative. Bonus action hop. Perception proficiency.',
  note: 'Excellent race for any class. PB to initiative is always useful. Rabbit Hop is free disengage.',
};

export const HARENGON_TRAITS = [
  { trait: 'Hare-Trigger', effect: 'Add proficiency bonus to initiative rolls.', note: 'PB to initiative = +2 to +6. Going first is always powerful. Best initiative racial feature.' },
  { trait: 'Leporine Senses', effect: 'Proficiency in Perception.', note: 'Free Perception. The most important skill.' },
  { trait: 'Lucky Footwork', effect: 'When you fail a DEX saving throw, add 1d4 to the result (potentially turning failure to success). PB times per long rest.', note: '+1d4 to failed DEX saves. Dodge Fireballs, traps, breath weapons. PB times per day.' },
  { trait: 'Rabbit Hop', effect: 'Bonus action: jump a number of feet = 5 × PB without provoking OA. PB times per long rest.', note: 'Free mini-disengage. 10-30ft jump without OA. PB times per day.' },
];

export const HARENGON_BUILDS = [
  { build: 'Harengon Rogue', detail: 'PB to initiative (go first for SA). Rabbit Hop saves Cunning Action Disengage for Dash. Perception free.', rating: 'S', note: 'Every Rogue feature synergizes. Go first, attack, hop away.' },
  { build: 'Harengon Ranger', detail: 'PB to initiative. Perception proficiency. Lucky Footwork for saves. Natural explorer feel.', rating: 'A' },
  { build: 'Harengon Fighter', detail: 'PB to initiative + Alert feat = never go last. Rabbit Hop for positioning.', rating: 'A' },
  { build: 'Harengon Wizard', detail: 'PB to initiative (important for control casters). Lucky Footwork shores up DEX saves.', rating: 'A' },
  { build: 'Harengon Monk', detail: 'PB to initiative. Rabbit Hop + Step of the Wind mobility. Lucky Footwork + Evasion.', rating: 'A' },
];

export const HARENGON_INITIATIVE_ANALYSIS = {
  atLevel1: { pb: 2, withDex16: '+5 initiative', note: 'Better than most classes at L1.' },
  atLevel5: { pb: 3, withDex16: '+6 initiative', note: 'Matches Alert feat bonus.' },
  atLevel9: { pb: 4, withDex16: '+7 initiative', note: 'Very rarely going last.' },
  atLevel17: { pb: 6, withDex16: '+9 initiative', note: 'Almost always going first.' },
  withAlert: { pb: 6, withDex16andAlert: '+14 initiative', note: 'Highest possible initiative modifier for a non-class-feature character.' },
};

export function harengonInitiative(dexMod, proficiencyBonus) {
  return dexMod + proficiencyBonus;
}

export function rabbitHopDistance(proficiencyBonus) {
  return 5 * proficiencyBonus; // 10ft at L1, 30ft at L17
}

export function rabbitHopUses(proficiencyBonus) {
  return proficiencyBonus;
}

export function luckyFootworkBonus() {
  return 2.5; // 1d4 average
}
