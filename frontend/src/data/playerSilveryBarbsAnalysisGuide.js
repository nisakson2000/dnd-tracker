/**
 * playerSilveryBarbsAnalysisGuide.js
 * Player Mode: Silvery Barbs — the most controversial spell in 5e
 * Pure JS — no React dependencies.
 */

export const SILVERY_BARBS_RULES = {
  level: 1,
  school: 'Enchantment',
  castingTime: '1 reaction (when a creature succeeds on an attack roll, ability check, or saving throw)',
  range: '60 feet',
  components: 'V',
  duration: 'Instantaneous',
  classes: ['Bard', 'Sorcerer', 'Wizard'],
  source: "Strixhaven: A Curriculum of Chaos",
};

export const SILVERY_BARBS_EFFECTS = {
  primary: 'Force a creature to reroll a successful d20 and use the lower result.',
  secondary: 'Grant advantage on the next attack roll, ability check, or saving throw to one creature (including yourself).',
  note: 'This is essentially a L1 reaction that combines disadvantage on an enemy + advantage for an ally.',
};

export const WHY_ITS_CONTROVERSIAL = [
  'L1 spell that\'s better than many L2-3 spells in effect.',
  'Reaction cast — doesn\'t cost your action, just a L1 slot.',
  'Forces reroll on ANYTHING: attack, save, ability check.',
  'Can force reroll on a creature\'s save against YOUR spell (double-dip).',
  'Stacks with disadvantage — enemy rolls 3 dice, takes lowest.',
  'Grants advantage as a bonus effect — two powerful effects in one spell.',
  'Only V component — works while restrained, grappled, hands full.',
  'Available to Bard, Sorcerer, Wizard — the best casters already.',
  'Many DMs ban or restrict it. Always check with your DM first.',
];

export const BEST_USES = [
  { use: 'Force reroll on enemy save vs your control spell', rating: 'S+', detail: 'Cast Hypnotic Pattern, enemy saves, Silvery Barbs → reroll. Double chance to land.' },
  { use: 'Force reroll on critical hit against ally', rating: 'S+', detail: 'Enemy crits your ally → Silvery Barbs → likely not a crit anymore. Life-saving.' },
  { use: 'Force reroll on enemy save vs ally\'s spell', rating: 'S', detail: 'Paladin uses Hold Person, enemy saves → you Silvery Barbs. Team play.' },
  { use: 'Force reroll on enemy ability check', rating: 'A+', detail: 'Enemy tries to grapple, shove, or Counterspell check → force reroll.' },
  { use: 'Grant advantage to Paladin\'s next attack', rating: 'S', detail: 'Advantage on attack = higher crit chance = bigger Smite. Excellent combo.' },
  { use: 'Grant advantage on ally\'s saving throw', rating: 'A+', detail: 'Give advantage on the next save to an ally about to face a big spell.' },
];

export const LIMITATIONS = [
  'Costs a L1 spell slot each time — burns through slots fast.',
  'Uses your reaction — can\'t also cast Shield, Counterspell, or Absorb Elements.',
  'Doesn\'t guarantee failure — just forces reroll. Enemy might still succeed.',
  'Only verbal component but still requires reaction availability.',
  'Some DMs ban it or restrict it to Strixhaven settings only.',
  'At higher levels, L1 slots become less precious but reaction competition increases.',
];

export const SILVERY_BARBS_VS_ALTERNATIVES = [
  { spell: 'Shield', comparison: 'Shield is better for personal defense. Silvery Barbs is better for team play.', verdict: 'Both S-tier. Prepare both.' },
  { spell: 'Counterspell', comparison: 'Counterspell stops spells entirely. Silvery Barbs forces save reroll. Different uses.', verdict: 'Counterspell for spell denial, Barbs for save forcing.' },
  { spell: 'Absorb Elements', comparison: 'AE reduces damage from elemental attacks. Silvery Barbs is more versatile.', verdict: 'AE for elemental damage, Barbs for everything else.' },
  { spell: 'Cutting Words (Bard)', comparison: 'Cutting Words subtracts from the roll. Silvery Barbs forces reroll. Barbs is stronger.', verdict: 'Silvery Barbs is stronger but costs a slot.' },
];

export const SILVERY_BARBS_TIPS = [
  'Always ask your DM if Silvery Barbs is allowed before building around it.',
  'Don\'t blow all your L1 slots on Barbs. Save some for Shield.',
  'Best on Bard/Sorcerer — they have fewer competing L1 spells.',
  'Wizard has too many good reactions (Shield, Counterspell, AE). Slot competition is real.',
  'If allowed, this is arguably the best L1 spell in the game.',
  'Combine with Heightened Spell (Sorcerer): disadvantage + Silvery Barbs reroll = 3 dice, take lowest.',
  'At L1-4, slot cost is significant. At L5+, L1 slots are cheap for this effect.',
];
