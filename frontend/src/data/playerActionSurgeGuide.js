/**
 * playerActionSurgeGuide.js
 * Player Mode: Fighter Action Surge optimization and timing
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE_BASICS = {
  uses: '1 per short rest (2 at Fighter 17).',
  effect: 'Take one additional action on your turn. Everything resets — Attack action, spells, etc.',
  stacking: 'You can only Action Surge once per turn (even at L17 with 2 uses).',
  note: 'Action Surge is THE Fighter feature. Short rest recovery means you can use it every fight.',
};

export const ACTION_SURGE_USES = [
  { use: 'Double Extra Attack', detail: '2 attacks + 2 attacks = 4 attacks in one turn (8 at Fighter 20). Massive burst.', rating: 'S' },
  { use: 'Attack + Spell (multiclass)', detail: 'Attack action + Action Surge → cast a spell. Or vice versa. Full turn + spell.', rating: 'S' },
  { use: 'Alpha strike round 1', detail: 'Turn 1: Action Surge for maximum opening damage. Set the tone.', rating: 'S' },
  { use: 'Finish a boss', detail: 'Boss at low HP? Action Surge to guarantee the kill before it acts.', rating: 'S' },
  { use: 'Double Dash', detail: 'Dash + Action Surge Dash = triple speed for one turn. Close distance or escape.', rating: 'A' },
  { use: 'Grapple + Attack', detail: 'Grapple (1 attack) + Shove Prone (1 attack) + Action Surge Attack action = damage.', rating: 'A' },
  { use: 'Double spellcasting (multiclass)', detail: 'Cast two leveled spells with Action Surge. Bypasses the BA spell rule.', rating: 'S' },
];

export const ACTION_SURGE_MULTICLASS = [
  { build: 'Fighter 2 / Wizard X', value: 'S', reason: 'Cast Fireball + Action Surge Fireball. Two leveled spells in one turn.' },
  { build: 'Fighter 2 / Paladin X', value: 'S', reason: '4 attacks with Smite on each. Potential 8d8 radiant in one turn.' },
  { build: 'Fighter 2 / Warlock X', value: 'A', reason: 'Eldritch Blast (4 beams) + Action Surge EB (4 beams) = 8 beams.' },
  { build: 'Fighter 2 / Sorcerer X', value: 'S', reason: 'Quicken spell + Action Surge spell. Three spell-like actions in one turn.' },
];

export const WHEN_NOT_TO_SURGE = [
  'Don\'t surge on mook enemies that will die anyway.',
  'Don\'t surge if you\'re about to short rest (save it).',
  'Don\'t surge round 1 if the fight might have multiple phases.',
  'Don\'t surge defensively (Dodge + Dodge) unless you\'re about to die.',
];

export function surgeDamage(attacksPerAction, damagePerHit) {
  return attacksPerAction * 2 * damagePerHit; // double action = double attacks
}

export function extraAttacks(fighterLevel) {
  if (fighterLevel >= 20) return 4;
  if (fighterLevel >= 11) return 3;
  if (fighterLevel >= 5) return 2;
  return 1;
}
