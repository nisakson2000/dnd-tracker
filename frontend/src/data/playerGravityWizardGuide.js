/**
 * playerGravityWizardGuide.js
 * Player Mode: Graviturgy Wizard optimization — gravity manipulation
 * Pure JS — no React dependencies.
 */

export const GRAVITURGY_BASICS = {
  class: 'Wizard (Graviturgy Magic)',
  source: 'Explorer\'s Guide to Wildemount',
  theme: 'Control gravity to crush, slow, and reposition enemies.',
  note: 'Less flashy than Chronurgy but powerful battlefield control.',
};

export const GRAVITURGY_FEATURES = [
  { feature: 'Adjust Density', level: 2, effect: 'Action: double or halve a creature\'s weight for 1 minute (CON save for unwilling). Concentration.', note: 'Doubled: -10ft speed, +1d10 falling. Halved: +10ft speed, jump ×2, disadvantage on STR checks.' },
  { feature: 'Gravity Well', level: 6, effect: 'When you deal damage with a spell, move the target 5ft toward or away from you. No save.', note: 'Free forced movement on EVERY damage spell. Works with Spike Growth.' },
  { feature: 'Event Horizon', level: 10, effect: 'Action: 30ft aura for 1 minute (concentration). Hostile creatures that start turn in area or enter: STR save or restrained. 10ft forced movement toward you.', note: '30ft aura that restrains enemies and pulls them in. Incredible control.' },
  { feature: 'Gravity Sinkhole', level: 14, effect: 'Not a feature — it\'s a Dunamancy spell. But worth mentioning.', note: 'See Dunamancy spell list for Graviturgy-specific spells.' },
];

export const GRAVITURGY_TACTICS = [
  { tactic: 'Gravity Well + Spike Growth', detail: 'Cast Spike Growth. Every time you deal spell damage, move enemy 5ft through it. 2d4 per 5ft.', rating: 'S' },
  { tactic: 'Adjust Density + flight', detail: 'Halve an ally\'s weight: jump distance doubled, +10ft speed. Or double enemy: crashes through weak floors.', rating: 'B' },
  { tactic: 'Event Horizon pull', detail: 'Activate aura. Enemies are pulled toward you and restrained. You\'re a black hole.', rating: 'A' },
  { tactic: 'Gravity Well + Wall of Fire', detail: 'Wall of Fire in a line. Gravity Well pushes enemies into the hot side. 5d8 per push.', rating: 'A' },
  { tactic: 'Gravity Sinkhole spell', detail: '4th level: 20ft sphere, 5d10 force, creatures pulled to center. STR save.', rating: 'A' },
];

export const DUNAMANCY_SPELLS = [
  { spell: 'Sapping Sting', level: 0, school: 'Necromancy', effect: '1d4 necrotic (scales). CON save or prone.', note: 'Cantrip that prones. Triggers Gravity Well for free 5ft move.' },
  { spell: 'Gift of Alacrity', level: 1, school: 'Divination', effect: '+1d8 to initiative for 8 hours. No concentration.', note: 'Party-wide initiative buff. Cast on everyone before adventuring.' },
  { spell: 'Magnify Gravity', level: 1, school: 'Transmutation', effect: '2d8 force, 10ft sphere. STR save: halved speed 1 turn.', note: 'Decent AoE with slow rider.' },
  { spell: 'Fortune\'s Favor', level: 2, school: 'Divination', effect: 'Grant one creature the ability to reroll any d20. 100 gp consumed.', note: 'Pre-cast. One free reroll. Expensive but powerful for boss fights.' },
  { spell: 'Immovable Object', level: 2, school: 'Transmutation', effect: 'Object ≤10 lbs becomes immovable in space. DC 10-25 STR to move.', note: 'Creative uses: lock doors, create handholds, pin objects in air.' },
  { spell: 'Wristpocket', level: 2, school: 'Conjuration', effect: 'Send object (5 lbs) to extradimensional space. Retrieve as action.', note: 'Ritual. Hide items, smuggle objects, store key items safely.' },
  { spell: 'Pulse Wave', level: 3, school: 'Evocation', effect: '6d6 force in 30ft cone. Pull or push targets 15ft.', note: 'AoE force damage + positioning. Good combo with hazards.' },
  { spell: 'Gravity Sinkhole', level: 4, school: 'Evocation', effect: '5d10 force in 20ft sphere. Creatures pulled to center. STR save.', note: 'Cluster enemies. Follow up with Fireball or Spike Growth.' },
  { spell: 'Dark Star', level: 8, school: 'Evocation', effect: '40ft sphere: difficult terrain, no light, deafened, 8d10 force/turn. Concentration.', note: 'Mini black hole. 8d10 force per turn in a massive area.' },
  { spell: 'Ravenous Void', level: 9, school: 'Evocation', effect: '20ft sphere: 5d10 force, pull creatures/objects 100ft toward center. Difficult terrain 100ft radius.', note: 'Ultimate gravity spell. 9th level reality warper.' },
];

export function gravityWellSpikeGrowthDamage(spellsCastPerRound) {
  return spellsCastPerRound * 5; // 5ft move × 2d4 avg = 5 per trigger
}

export function adjustDensityFallDamage(isDoubled, fallHeight) {
  const dice = Math.min(20, Math.floor(fallHeight / 10));
  return isDoubled ? dice * 3.5 + dice * 5.5 : dice * 3.5; // +1d10 per 10ft if doubled
}
