/**
 * playerReactionOptimizationGuide.js
 * Player Mode: Reaction usage — best reactions by class and situation
 * Pure JS — no React dependencies.
 */

export const REACTION_RULES = {
  limit: 'ONE reaction per round. Resets at the start of your turn.',
  timing: 'Can be used on your turn OR others\' turns. Most happen on others\' turns.',
  opportunity: 'If you don\'t use your reaction, it\'s wasted. No carry-over.',
  note: 'Reactions are the most strategically important resource. Save them for the right moment.',
};

export const BEST_REACTIONS_RANKED = [
  { reaction: 'Shield (spell)', classes: 'Wizard, Sorcerer, EK, Hexblade, Artificer', effect: '+5 AC until next turn', rating: 'S+', note: 'Best defensive reaction. +5 AC can turn a hit into a miss.' },
  { reaction: 'Counterspell', classes: 'Wizard, Sorcerer, Warlock, Bard', effect: 'Negate enemy spell', rating: 'S+', note: 'Most impactful reaction. Stops enemy Power Word Kill, Fireball, etc.' },
  { reaction: 'Absorb Elements', classes: 'Wizard, Sorcerer, Ranger, Artificer, Druid', effect: 'Halve elemental damage + bonus on next melee', rating: 'S+', note: 'Halve breath weapons, Fireball, etc. Auto-include.' },
  { reaction: 'Uncanny Dodge', classes: 'Rogue', effect: 'Halve ONE attack\'s damage', rating: 'S', note: 'Use on the biggest single hit. Incredible survival.' },
  { reaction: 'Opportunity Attack', classes: 'All melee', effect: 'Melee attack when enemy leaves reach', rating: 'A+', note: 'Free damage. S+ with Sentinel (speed = 0).' },
  { reaction: 'Hellish Rebuke', classes: 'Warlock, Tiefling', effect: '2d10+ fire to attacker', rating: 'A', note: 'Automatic retaliation. Competes with other reactions.' },
  { reaction: 'Silvery Barbs', classes: 'Wizard, Sorcerer, Bard', effect: 'Force reroll on success + give ally advantage', rating: 'S', note: 'Incredibly powerful. Force enemy to reroll save. Many DMs ban it.' },
  { reaction: 'Cutting Words (Bard)', classes: 'Lore Bard', effect: 'Subtract BI die from attack/ability/damage', rating: 'S', note: 'Versatile. Reduce damage, prevent hits, or hamper checks.' },
  { reaction: 'Deflect Missiles (Monk)', classes: 'Monk', effect: 'Reduce ranged damage by 1d10+DEX+level. Throw back for 1 ki.', rating: 'A+', note: 'Free damage reduction. Ki only needed to throw back.' },
  { reaction: 'Warding Flare (Light Cleric)', classes: 'Light Cleric', effect: 'Impose disadvantage on attack against you.', rating: 'A+', note: 'WIS mod/LR. No spell slot cost.' },
  { reaction: 'Sentinel OA (on Disengage)', classes: 'Anyone with Sentinel', effect: 'OA even when target Disengages', rating: 'S', note: 'OA + speed = 0. Enemies literally can\'t leave.' },
  { reaction: 'War Caster OA (spell)', classes: 'War Caster casters', effect: 'Cast spell instead of melee OA', rating: 'S', note: 'Booming Blade OA = damage + punish further movement.' },
  { reaction: 'Flash of Genius (Artificer)', classes: 'Artificer L7+', effect: '+INT to any save or check you see', rating: 'S', note: 'INT mod/LR. Incredible support. Save an ally\'s life.' },
  { reaction: 'Chronal Shift (Chronurgy Wizard)', classes: 'Chronurgy Wizard', effect: 'Force reroll any d20 within 30ft', rating: 'S+', note: '2/LR. Best wizard subclass reaction.' },
];

export const REACTION_PRIORITY_BY_SITUATION = {
  youreBeingAttacked: [
    '1. Shield (+5 AC) — if the attack would miss with +5 AC',
    '2. Uncanny Dodge (Rogue) — halve the damage if Shield isn\'t available',
    '3. Absorb Elements — if the attack is elemental (dragon breath)',
    '4. Hellish Rebuke — if you\'ll take the hit regardless, punish them',
  ],
  enemyCastsSpell: [
    '1. Counterspell — negate the spell entirely',
    '2. Absorb Elements — if you can\'t counter, halve the elemental damage',
    '3. Shield — if it\'s a spell attack roll, +5 AC might cause a miss',
  ],
  enemyLeavesReach: [
    '1. Sentinel OA — stop them (speed = 0). Best if protecting allies.',
    '2. War Caster OA (Booming Blade) — damage + punish continued movement',
    '3. Normal OA — free damage is free damage',
    '4. Skip — if saving reaction for Shield/Counterspell is more important',
  ],
};

export const REACTION_TIPS = [
  'Don\'t use your reaction early in the round unless it\'s clearly the best use.',
  'Shield is almost always better than OA. Preventing damage > dealing damage.',
  'Counterspell the RIGHT spell. Don\'t counter a cantrip and miss the Fireball next turn.',
  'Save your reaction if you expect a big spell or attack from a later enemy.',
  'If you have no reaction features, OA is your only option. Position to enable it.',
  'Multiple Counterspellers: coordinate. Only one needs to counter each spell.',
  'Silvery Barbs is so good it warps combat. Ask your DM\'s ruling before taking it.',
];
