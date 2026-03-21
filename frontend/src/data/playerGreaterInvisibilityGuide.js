/**
 * playerGreaterInvisibilityGuide.js
 * Player Mode: Greater Invisibility — best L4 buff
 * Pure JS — no React dependencies.
 */

export const GREATER_INVIS_BASICS = {
  spell: 'Greater Invisibility',
  level: 4,
  school: 'Illusion',
  castTime: '1 action',
  range: 'Touch',
  duration: '1 minute (concentration)',
  classes: ['Bard', 'Sorcerer', 'Wizard', 'Armorer Artificer', 'Archfey Warlock'],
  effect: 'Target is invisible for 1 minute. Doesn\'t break on attacking or casting.',
  note: 'Unlike regular Invisibility, this stays active while you attack. Incredible combat buff.',
};

export const INVISIBILITY_BENEFITS = [
  { benefit: 'Advantage on all attacks', detail: 'Unseen attacker = advantage. Every attack for 10 rounds.', rating: 'S' },
  { benefit: 'Disadvantage on attacks against you', detail: 'Can\'t be seen = disadvantage to hit. Effectively +5 AC.', rating: 'S' },
  { benefit: 'Can\'t be targeted by many spells', detail: 'Many spells require "a creature you can see." Invisible = untargetable.', rating: 'S' },
  { benefit: 'Free Sneak Attack', detail: 'Rogues: advantage from invisibility = guaranteed SA every attack.', rating: 'S' },
  { benefit: 'Hidden spellcasting', detail: 'Counterspell requires seeing the caster. Invisible = can\'t be counterspelled.', rating: 'A+' },
];

export const GREATER_INVIS_VS_REGULAR = {
  greater: {
    level: 4,
    duration: '1 minute',
    breaks: 'Never (lasts full duration)',
    combat: 'Incredible — full minute of advantage + disadvantage',
    note: 'Combat buff. Cast on your Rogue or Fighter.',
  },
  regular: {
    level: 2,
    duration: '1 hour',
    breaks: 'On attack or spell cast',
    combat: 'One surprise hit then done',
    note: 'Utility/stealth spell. Scouting, infiltration.',
  },
};

export const BEST_TARGETS = [
  { target: 'Rogue', why: 'Guaranteed Sneak Attack. Advantage on every attack. Can\'t be targeted.', rating: 'S' },
  { target: 'Fighter (GWM/SS)', why: 'Advantage offsets -5 penalty. All Extra Attacks with advantage.', rating: 'S' },
  { target: 'Paladin', why: 'Advantage = more crits = more Divine Smite damage.', rating: 'A+' },
  { target: 'Self (caster)', why: 'Can\'t be counterspelled. Can\'t be targeted. Advantage on spell attacks.', rating: 'A+' },
  { target: 'Monk', why: 'Advantage on all Flurry of Blows. Stunning Strike more likely with advantage.', rating: 'A' },
];

export const GREATER_INVIS_COUNTERS = [
  'Blindsight — sees through invisibility completely.',
  'Truesight — sees invisible creatures.',
  'See Invisibility — L2 spell, no concentration.',
  'Faerie Fire — outlines invisible creatures (no save if already affected).',
  'AoE spells — don\'t need to see the target. Fireball still hits.',
  'Tremorsense — detects by vibration, not sight.',
  'Dispel Magic — ends the spell.',
  'Attacking where they think you are — disadvantage but still possible.',
];

export const TWIN_GREATER_INVIS = {
  metamagic: 'Twinned Spell',
  cost: '4 Sorcery Points',
  effect: 'Two allies invisible for 1 minute. Both get advantage + disadvantage against them.',
  rating: 'S+',
  note: 'Sorcerer exclusive. Two invisible strikers = absolute carnage. Best use of Twinned Spell.',
};
