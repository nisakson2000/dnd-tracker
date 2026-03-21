/**
 * playerReactionOptGuide.js
 * Player Mode: Best reactions in 5e — when to use, opportunity cost, and optimization
 * Pure JS — no React dependencies.
 */

export const REACTION_RULES = {
  limit: 'ONE reaction per round. Resets at start of your turn.',
  trigger: 'Each reaction specifies its trigger. Can\'t use without trigger.',
  ready: 'Readied actions use your reaction.',
  opportunityAttack: 'Default reaction: attack when enemy leaves your reach.',
  note: 'Reaction economy matters. Choosing which reaction to use is a key decision.',
};

export const BEST_REACTIONS_RANKED = [
  { reaction: 'Shield', trigger: 'You are hit by attack or targeted by Magic Missile.', effect: '+5 AC until start of next turn.', rating: 'S+', classes: 'Wizard, Sorcerer, EK Fighter, Hexblade', note: 'Best reaction. +5 AC can turn hits into misses.' },
  { reaction: 'Counterspell', trigger: 'A creature within 60ft casts a spell.', effect: 'Negate the spell (auto for ≤3rd, check for higher).', rating: 'S+', classes: 'Wizard, Sorcerer, Warlock', note: 'Deny enemy spells. Game-changing.' },
  { reaction: 'Absorb Elements', trigger: 'You take acid, cold, fire, lightning, or thunder damage.', effect: 'Halve the damage. Next melee attack deals extra 1d6 of that type.', rating: 'S+', classes: 'Wizard, Sorcerer, Druid, Ranger, Artificer', note: 'Half dragon breath damage. Incredible.' },
  { reaction: 'Opportunity Attack', trigger: 'Enemy leaves your reach.', effect: 'One melee attack.', rating: 'A+', classes: 'Everyone', note: 'Free attack. Better with Sentinel (speed 0) or War Caster (spell instead).' },
  { reaction: 'Hellish Rebuke', trigger: 'You are damaged by a creature you can see.', effect: '2d10 fire damage (DEX half).', rating: 'A', classes: 'Warlock, Tiefling', note: 'Decent damage but competes with Shield/Counterspell.' },
  { reaction: 'Cutting Words (Lore Bard)', trigger: 'Creature makes attack/check/damage.', effect: 'Subtract BI die from roll.', rating: 'S', classes: 'Lore Bard', note: 'Reduce enemy attacks, damage, or checks. Very flexible.' },
  { reaction: 'Silvery Barbs', trigger: 'Creature succeeds on attack/check/save.', effect: 'Force reroll. Give ally advantage.', rating: 'S+', classes: 'Bard, Sorcerer, Wizard', note: 'Force reroll on any success. Broken. Banned at some tables.' },
  { reaction: 'Sentinel OA', trigger: 'Enemy attacks ally OR leaves reach.', effect: 'OA + reduce speed to 0.', rating: 'S', classes: 'Sentinel feat', note: 'Speed 0 on OA. Locks enemies in place.' },
  { reaction: 'Uncanny Dodge', trigger: 'Attacker you can see hits you.', effect: 'Halve the damage.', rating: 'S', classes: 'Rogue L5+', note: 'Half damage from one attack per round. No resource cost.' },
  { reaction: 'Deflect Missiles', trigger: 'Hit by ranged weapon attack.', effect: 'Reduce by 1d10+DEX+level. If 0, catch and throw back (1 ki).', rating: 'A+', classes: 'Monk L3+', note: 'Catch arrows. Throw them back for 1 ki. Iconic.' },
  { reaction: 'Warding Flare (Light Cleric)', trigger: 'Creature attacks you or ally within 30ft.', effect: 'Impose disadvantage on attack.', rating: 'A+', classes: 'Light Domain Cleric', note: 'WIS mod times per LR. Great defense.' },
  { reaction: 'Flash of Genius (Artificer)', trigger: 'Ally makes ability check or save.', effect: '+INT modifier to the roll.', rating: 'S', classes: 'Artificer L7+', note: '+5 to any save or check. PB times per LR. Best support reaction.' },
];

export const REACTION_PRIORITY = [
  { scenario: 'Enemy hits you with melee/ranged', priority: ['Shield (+5 AC)', 'Uncanny Dodge (half damage)', 'Absorb Elements (if elemental)'] },
  { scenario: 'Enemy casts a spell', priority: ['Counterspell (deny the spell)', 'Absorb Elements (if damage spell)', 'Shield (if attack spell)'] },
  { scenario: 'Enemy leaves your reach', priority: ['Opportunity Attack', 'Sentinel OA (speed 0)', 'War Caster OA (cast spell instead)'] },
  { scenario: 'Ally is in danger', priority: ['Flash of Genius (+INT to save)', 'Cutting Words (reduce enemy roll)', 'Warding Flare (disadvantage)'] },
];

export const REACTION_TIPS = [
  'ONE reaction per round. Choose wisely between Shield, Counterspell, and OAs.',
  'Shield is the best reaction spell. +5 AC until your next turn.',
  'Counterspell vs Shield: if the enemy spell would do more damage than their attack, Counterspell.',
  'Absorb Elements: halves dragon breath, Fireball, Lightning Bolt. Always prepare it.',
  'Silvery Barbs: force reroll + give ally advantage. Broken for a 1st-level spell.',
  'Sentinel: OA reduces speed to 0. Best martial reaction feat.',
  'War Caster: cast Booming Blade as OA. More damage than regular OA.',
  'Flash of Genius: +5 to ally saves. Can save them from domination, death, etc.',
  'Uncanny Dodge: no resource cost. Halve one attack per round. Rogue durability.',
  'Don\'t waste reactions. Saving it for Counterspell/Shield may be worth more than an OA.',
];
