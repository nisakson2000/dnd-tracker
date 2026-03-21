/**
 * playerHalflingRaceGuide.js
 * Player Mode: Halfling race — the lucky small folk
 * Pure JS — no React dependencies.
 */

export const HALFLING_BASICS = {
  race: 'Halfling',
  source: 'Player\'s Handbook',
  asi: 'DEX +2 (subrace +1)',
  size: 'Small',
  speed: '25ft',
};

export const HALFLING_TRAITS = [
  { trait: 'Lucky', effect: 'Reroll nat 1s on d20 attack/check/save.', rating: 'S', note: 'Never nat 1 again. Best racial trait for consistency.' },
  { trait: 'Brave', effect: 'Advantage on saves vs frightened.', rating: 'A' },
  { trait: 'Halfling Nimbleness', effect: 'Move through Medium+ creatures\' spaces.', rating: 'A' },
  { trait: 'Naturally Stealthy (Lightfoot)', effect: 'Hide behind Medium+ creatures.', rating: 'S' },
];

export const HALFLING_SUBRACES = [
  { subrace: 'Lightfoot', asi: 'CHA +1', special: 'Naturally Stealthy', bestFor: 'Rogue, Bard', rating: 'S' },
  { subrace: 'Stout', asi: 'CON +1', special: 'Poison resistance + advantage', bestFor: 'Martials', rating: 'A' },
  { subrace: 'Ghostwise', asi: 'WIS +1', special: '30ft telepathy', bestFor: 'Monk, Cleric, Druid', rating: 'A' },
];

export const BEST_BUILDS = [
  { build: 'Lightfoot Rogue', why: 'Hide behind allies. Free Sneak Attack advantage.', rating: 'S' },
  { build: 'Divination Wizard', why: 'Lucky + Portent = ultimate dice control.', rating: 'S' },
  { build: 'Ghostwise Monk', why: 'DEX+2, WIS+1. Perfect stats. Lucky on Stunning Strike.', rating: 'A' },
];

export function luckyStatBoost() {
  return { avgD20Increase: 0.275, nat1Reduction: '5% → 0.25%' };
}
