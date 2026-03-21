/**
 * playerGraviturgistWizardGuide.js
 * Player Mode: Graviturgy Magic Wizard — the gravity manipulator
 * Pure JS — no React dependencies.
 */

export const GRAVITURGIST_BASICS = {
  class: 'Wizard (Graviturgy Magic)',
  source: 'Explorer\'s Guide to Wildemount',
  theme: 'Control gravity. Adjust weight. Move enemies. Devastating crowd control with gravity wells.',
  note: 'Excellent controller with unique weight manipulation. Gravity Well is free forced movement on every spell.',
};

export const GRAVITURGIST_FEATURES = [
  { feature: 'Adjust Density', level: 2, effect: 'Action: halve or double a creature/object\'s weight for 1 minute. CON save if unwilling. Concentration.', note: 'Halve weight: +10ft speed, jump distance doubled, disadvantage on STR checks. Double weight: -10ft speed, advantage vs being pushed/pulled.' },
  { feature: 'Gravity Well', level: 6, effect: 'When you cast a spell that moves or damages a creature, move it 5ft in any direction (if it fails the save or is hit).', note: 'FREE 5ft forced movement on EVERY damage spell. Move enemies into AoEs, off cliffs, into hazards. No save against the movement.' },
  { feature: 'Violent Attraction', level: 10, effect: 'Reaction: when creature within 60ft hits with weapon attack, increase damage by 1d10. Or when creature falls, increase damage by 2d10. PB uses/LR.', note: 'Free 1d10 damage boost for allies. Or 2d10 extra fall damage — combos with gravity spells that knock prone/push.' },
  { feature: 'Event Horizon', level: 14, effect: 'Action: 30ft aura for 1 minute. Hostile creatures starting turn in aura: STR save or take 2d10 force + speed = 0. On save: half damage. Concentration.', note: 'Enemies can\'t leave the aura on failed save. 2d10 force per round. Concentration but devastating area denial.' },
];

export const GRAVITURGIST_TACTICS = [
  { tactic: 'Gravity Well + Web', detail: 'Cast Web. On failed saves, use Gravity Well to drag enemies 5ft deeper into the Web. They can\'t escape easily.', rating: 'S' },
  { tactic: 'Gravity Well + Wall spells', detail: 'Cast damage spell, use Gravity Well to push enemy into your Wall of Fire/Force. Free repositioning every spell.', rating: 'S' },
  { tactic: 'Adjust Density + Grapple ally', detail: 'Halve an ally\'s weight → they jump further, move faster. Or double an enemy → they move slower, easier to pin.', rating: 'A' },
  { tactic: 'Violent Attraction + Rogue', detail: 'Reaction: add 1d10 to Rogue\'s Sneak Attack hit. Free damage boost for your biggest hitter.', rating: 'A' },
  { tactic: 'Gravity Well + Cliff', detail: 'Any damage spell near a ledge: Gravity Well pushes enemy 5ft over the edge. No save against the push.', rating: 'S' },
  { tactic: 'Event Horizon + Sickening Radiance', detail: 'L14: Event Horizon pins enemies in place. Sickening Radiance stacks exhaustion. Deadly combo if you can maintain both.', rating: 'A' },
];

export const GRAVITURGIST_SPELL_SYNERGIES = [
  { spell: 'Immovable Object', note: 'Graviturgy exclusive. Make an object immovable in space. Creative uses: floating platforms, blocking doors, improvised cover.', rating: 'A' },
  { spell: 'Magnify Gravity', note: 'Graviturgy exclusive. 2d8 force + halve speed. Gravity Well adds 5ft push. Good L1 AoE.', rating: 'A' },
  { spell: 'Gravity Sinkhole', note: 'Graviturgy exclusive. 5d10 force in 20ft sphere + pull to center. Gravity Well adds 5ft more movement.', rating: 'A' },
  { spell: 'Dark Star', note: 'Graviturgy exclusive. 40ft sphere: difficult terrain, no sound, 8d10 force per round. CON save or disintegrated at 0 HP.', rating: 'S' },
  { spell: 'Ravenous Void', note: 'Graviturgy exclusive. 20ft sphere: creatures pulled 25ft toward center, 5d10 force, restrained. Concentration. Capstone spell.', rating: 'S' },
];

export function adjustDensityEffect(isHalved) {
  if (isHalved) return { speedBonus: 10, jumpMultiplier: 2, strCheckPenalty: 'disadvantage' };
  return { speedPenalty: -10, pushResistance: 'advantage' };
}

export function violentAttractionDamage(isWeaponHit) {
  return isWeaponHit ? 5.5 : 11; // 1d10 avg or 2d10 avg for falls
}
