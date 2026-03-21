/**
 * playerBardicInspirationGuide.js
 * Player Mode: Earning/using Inspiration + Bardic Inspiration optimization
 * Pure JS — no React dependencies.
 */

export const DM_INSPIRATION = {
  what: 'Single-use advantage on any d20 roll. Binary: have it or don\'t.',
  earning: 'DM awards for good RP, creative solutions, playing flaws.',
  using: 'Before or after the roll. Gives advantage.',
  stacking: 'Can\'t have more than 1. Use it or lose it.',
  sharing: 'CAN give your Inspiration to another player.',
};

export const BARDIC_INSPIRATION = {
  what: 'Bard BA: give one creature within 60ft a die (d6→d12 by level).',
  uses: 'Add to attack roll, ability check, or saving throw. 10 min duration.',
  recovery: 'CHA mod uses/LR. Short rest recovery at Bard L5+.',
  timing: 'Add AFTER roll, BEFORE outcome is declared.',
};

export const BARDIC_BEST_TARGETS = [
  { target: 'GWM/SS martial', benefit: '+die to hit. Ensures +10 damage attacks land.', rating: 'S+' },
  { target: 'Concentrating caster', benefit: 'Add to CON save. Protect crucial spell.', rating: 'S' },
  { target: 'Party face', benefit: 'Add to Persuasion/Deception. Campaign-changing.', rating: 'A+' },
  { target: 'Tank on key save', benefit: 'Failed WIS save on tank = disaster. BI prevents.', rating: 'S' },
];

export const SUBCLASS_INSPIRATION = [
  { subclass: 'Eloquence', feature: 'Unsettling Words: subtract BI from enemy save.', rating: 'S+' },
  { subclass: 'Lore', feature: 'Cutting Words: subtract BI from enemy attack/check/damage.', rating: 'S+' },
  { subclass: 'Glamour', feature: 'Mantle: temp HP + free movement for allies.', rating: 'S' },
  { subclass: 'Valor', feature: 'Combat Inspiration: add to damage or AC.', rating: 'A+' },
  { subclass: 'Swords', feature: 'Blade Flourish: BI to damage + special effect.', rating: 'A+' },
  { subclass: 'Creation', feature: 'Note of Potential: bonus effect based on roll type.', rating: 'A+' },
];

export const INSPIRATION_TIPS = [
  'Don\'t hoard DM Inspiration. Use it on big moments.',
  'Bardic Inspiration on GWM/SS user = more +10 hits.',
  'Eloquence: Unsettling Words → control spell. Devastating.',
  'BI recovers on short rest at L5+. Hand it out every fight.',
  'Cutting Words is a REACTION. Turn enemy hits into misses.',
  'Glamour Bard Mantle: best combat opener. Temp HP + reposition.',
  'Play your flaws for DM Inspiration. DMs reward good RP.',
  'BI scales: d6→d8→d10→d12. Gets stronger every tier.',
];
