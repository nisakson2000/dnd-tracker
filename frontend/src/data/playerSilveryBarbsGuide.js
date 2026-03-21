/**
 * playerSilveryBarbsGuide.js
 * Player Mode: Silvery Barbs — the most controversial spell
 * Pure JS — no React dependencies.
 */

export const SILVERY_BARBS_BASICS = {
  spell: 'Silvery Barbs',
  level: 1,
  school: 'Enchantment',
  castTime: '1 reaction (when a creature you can see within 60ft succeeds on an attack roll, ability check, or saving throw)',
  range: '60 feet',
  classes: ['Wizard', 'Sorcerer', 'Bard'],
  effects: [
    'Trigger: creature succeeds on attack, check, or save.',
    'Target must reroll and use the lower result.',
    'You choose a different creature (can be yourself): they get advantage on next attack, check, or save before end of their next turn.',
  ],
  note: 'Essentially a L1 reaction that imposes disadvantage retroactively + grants advantage. Many DMs ban this spell.',
};

export const SILVERY_BARBS_POWER = {
  whyBroken: [
    'L1 spell that can force reroll on ANY success — attacks, saves, ability checks.',
    'Can force reroll on enemy saving throws against your party\'s spells.',
    'Grants advantage to an ally as a bonus effect.',
    'Reaction casting = doesn\'t use your action. You can still cast spells normally.',
    'Stacks with itself: multiple casters can each Barbs the same roll.',
  ],
  comparison: [
    'vs Shield (L1 reaction): Shield gives +5 AC. Barbs forces reroll on hit (often better).',
    'vs Cutting Words (Bard): Cutting Words subtracts a die. Barbs forces full reroll (statistically better).',
    'vs Portent (Wizard): Portent replaces the die. Barbs forces reroll but enemy might still pass.',
  ],
};

export const SILVERY_BARBS_USES = [
  { use: 'Enemy saves vs your Hold Person', detail: 'BBEG passes WIS save? Silvery Barbs → reroll. Good chance they fail the second time.', rating: 'S' },
  { use: 'Enemy crits your ally', detail: 'Enemy nat 20? Barbs → reroll. Almost certainly not another nat 20.', rating: 'S' },
  { use: 'Force reroll on enemy save', detail: 'Ally casts Banishment, enemy saves? Barbs → force reroll.', rating: 'S' },
  { use: 'Enemy passes Counterspell check', detail: 'Enemy Counterspells your Fireball and passes the check? Barbs that check.', rating: 'A' },
  { use: 'Grant advantage to Rogue', detail: 'Barbs an enemy → give Rogue advantage → guaranteed Sneak Attack.', rating: 'A' },
];

export const SILVERY_BARBS_CONCERNS = {
  banReasons: [
    'Too efficient for a L1 slot. Feels like it should be L2-L3.',
    'Overshadows class features (Cutting Words, Portent, Lucky).',
    'Reaction spam: Wizard with many L1 slots can Barbs almost every round.',
    'Feels bad for DMs: boss finally saves → immediately Barbs\'d.',
    'Stacking: 3 casters with Barbs = 3 forced rerolls per round.',
  ],
  defenses: [
    'Uses your reaction (can\'t also Shield or Counterspell that round).',
    'Burns spell slots quickly if used every round.',
    'Doesn\'t guarantee failure — enemy might still pass on reroll.',
    'Setting-specific: only available in Strixhaven by default.',
  ],
  dmAdvice: 'If your table allows it, use it wisely. If it feels too strong, discuss with your DM about limiting it.',
};

export const SILVERY_BARBS_ALTERNATIVES = {
  ifBanned: [
    { alt: 'Cutting Words (Bard)', note: 'Similar effect but class feature, not spell. Subtract a die from roll.' },
    { alt: 'Shield (Wizard/Sorcerer)', note: 'Best defensive L1 reaction if Barbs is banned.' },
    { alt: 'Counterspell (L3)', note: 'Specifically counters enemy spells. More targeted but higher level.' },
    { alt: 'Bane (L1)', note: 'Subtract 1d4 from enemy attacks and saves. Concentration, but proactive.' },
  ],
};
