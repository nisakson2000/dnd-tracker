/**
 * playerFlankingVariantsGuide.js
 * Player Mode: Flanking rules and variants — optional rule guide
 * Pure JS — no React dependencies.
 */

export const FLANKING_BASICS = {
  rule: 'Optional Rule (DMG p.251)',
  requirement: 'Two allies on opposite sides of an enemy. Both must be able to see the enemy and not be incapacitated.',
  benefit: 'Both flanking creatures have ADVANTAGE on melee attack rolls against the flanked creature.',
  gridRequired: 'Flanking uses the grid. On opposite sides = directly across through the target\'s space.',
  note: 'Many DMs find advantage too strong for flanking. Common house rules tone it down.',
};

export const FLANKING_VARIANTS = [
  { variant: 'RAW Advantage', rule: 'Flanking grants advantage on melee attacks.', balance: 'Overpowered. Devalues abilities that grant advantage (Reckless Attack, Faerie Fire, etc.).', rating: 'C' },
  { variant: '+2 to hit bonus', rule: 'Flanking grants +2 to melee attack rolls instead of advantage.', balance: 'Most popular house rule. Meaningful but doesn\'t overshadow other advantage sources.', rating: 'A' },
  { variant: '+1 to hit bonus', rule: 'Flanking grants +1 to melee attack rolls.', balance: 'Minimal benefit. Still rewards positioning but very subtle.', rating: 'B' },
  { variant: 'No flanking rule', rule: 'Don\'t use flanking at all.', balance: 'Simplest. No positioning game for melee. Some groups prefer this.', rating: 'B' },
  { variant: 'Flanking cancels cover', rule: 'Flanking removes cover bonuses the target has against you.', balance: 'Creative alternative. Rewards positioning differently.', rating: 'A' },
  { variant: 'Enemies flank too', rule: 'Whatever flanking rule you use, enemies ALSO get it.', balance: 'Important: flanking benefits both sides equally. Smart enemies will flank players.', rating: 'Required' },
];

export const FLANKING_POSITIONING = [
  { tip: 'Opposite sides', detail: 'You and an ally must be on directly opposite sides of the target. Draw a line through the center of the target\'s space — both flankers must be on that line.' },
  { tip: 'Diagonal flanking', detail: 'On a grid: corners count. You can flank diagonally. As long as you\'re on opposite sides.' },
  { tip: 'Large creatures', detail: 'Large+ creatures take up multiple squares. Easier to flank because there are more "opposite" positions available.' },
  { tip: 'Reach weapons', detail: 'RAW flanking requires being adjacent (within 5ft). Reach weapons at 10ft don\'t flank unless both flankers are at 10ft on opposite sides (DM ruling).' },
  { tip: 'Three-way flanking', detail: 'If A flanks with B, and B flanks with C, that doesn\'t mean A flanks with C. Each pair must be on opposite sides independently.' },
];

export const FLANKING_CLASS_INTERACTIONS = [
  { class: 'Barbarian', interaction: 'Reckless Attack already gives advantage. Flanking = redundant if using Reckless. Flanking variant (+2) stacks with Reckless.', note: 'RAW flanking devalues Barbarian\'s L2 feature.' },
  { class: 'Rogue', interaction: 'Flanking gives Rogues easy Sneak Attack (need advantage or ally adjacent). Advantage flanking makes Rogue much stronger.', note: 'Rogues benefit the most from flanking rules.' },
  { class: 'Fighter', interaction: 'More attacks × advantage = massive DPR boost. Champions crit on 19-20 with advantage = ~19% crit rate.', note: 'Fighters love flanking.' },
  { class: 'Paladin', interaction: 'Advantage on attacks = more smite crits. Paladin + flanking advantage = frequent devastating smites.', note: 'Advantage flanking is very strong for Paladins.' },
  { class: 'Monk', interaction: 'Many attacks but already has ways to gain advantage (Stunning Strike). Flanking is nice but less impactful.', note: 'Good but not as transformative.' },
];

export function flankingDPRBoost(baseHitChance, attacksPerRound, damagePerHit, variant = 'advantage') {
  let newHitChance;
  if (variant === 'advantage') {
    newHitChance = 1 - (1 - baseHitChance) * (1 - baseHitChance);
  } else if (variant === '+2') {
    newHitChance = Math.min(0.95, baseHitChance + 0.1);
  } else if (variant === '+1') {
    newHitChance = Math.min(0.95, baseHitChance + 0.05);
  } else {
    newHitChance = baseHitChance;
  }
  const baseDPR = baseHitChance * attacksPerRound * damagePerHit;
  const flankDPR = newHitChance * attacksPerRound * damagePerHit;
  return { baseDPR, flankDPR, increase: flankDPR - baseDPR };
}
