/**
 * playerStatusEffectPriorityGuide.js
 * Player Mode: Conditions ranked by impact — which to inflict and which to avoid
 * Pure JS — no React dependencies.
 */

export const CONDITIONS_RANKED = [
  { condition: 'Paralyzed', rating: 'S+', effect: 'Incapacitated + auto-fail STR/DEX saves + attacks have advantage + melee crits auto.', inflictWith: 'Hold Person/Monster, Stunning Strike', note: 'Best condition. Auto-crits = smite goldmine.' },
  { condition: 'Stunned', rating: 'S+', effect: 'Incapacitated + auto-fail STR/DEX saves + attacks have advantage.', inflictWith: 'Stunning Strike, Power Word Stun, Divine Word', note: 'Like Paralyzed without auto-crits. Still devastating.' },
  { condition: 'Incapacitated', rating: 'S', effect: 'Can\'t take actions or reactions.', inflictWith: 'Hypnotic Pattern, Tasha\'s Hideous Laughter, Sleep', note: 'Enemy does nothing. Skip their turn entirely.' },
  { condition: 'Unconscious', rating: 'S+', effect: 'Incapacitated + prone + auto-fail STR/DEX saves + melee crits auto + attacks have advantage.', inflictWith: 'Sleep, going to 0 HP', note: 'Worst condition. Totally helpless.' },
  { condition: 'Petrified', rating: 'S', effect: 'Incapacitated + auto-fail STR/DEX saves + resistance to all damage + unaware.', inflictWith: 'Flesh to Stone, Medusa gaze, Basilisk', note: 'Effectively dead until cured. Greater Restoration fixes.' },
  { condition: 'Restrained', rating: 'A+', effect: 'Speed 0 + attacks have advantage against + their attacks have disadvantage + disadvantage on DEX saves.', inflictWith: 'Entangle, Web, Grapple (homebrew), Ensnaring Strike', note: 'Excellent control. Speed 0 prevents escape.' },
  { condition: 'Frightened', rating: 'A+', effect: 'Disadvantage on attacks/checks while source is visible. Can\'t willingly move closer to source.', inflictWith: 'Fear, Wrathful Smite, Conquest Paladin, Cause Fear', note: 'Incredible for keeping enemies at range. Many creatures immune.' },
  { condition: 'Blinded', rating: 'A+', effect: 'Auto-fail sight-dependent checks. Attacks have disadvantage. Attacks against have advantage.', inflictWith: 'Blindness/Deafness, Blinding Smite, Fog Cloud (both sides)', note: 'Effectively advantage/disadvantage swap. Very strong.' },
  { condition: 'Prone', rating: 'A', effect: 'Disadvantage on attacks. Melee attacks have advantage. Ranged attacks have disadvantage. Must use half move to stand.', inflictWith: 'Shove, Trip Attack, Thunderous Smite, Grease', note: 'Free for martials (shove). Combine with grapple to prevent standing.' },
  { condition: 'Grappled', rating: 'A', effect: 'Speed becomes 0.', inflictWith: 'Grapple action, some monster attacks', note: 'Speed 0 is good but no other penalties. Combine with prone for S+ combo.' },
  { condition: 'Charmed', rating: 'B+', effect: 'Can\'t attack charmer. Charmer has advantage on social checks.', inflictWith: 'Charm Person, Hypnotic Pattern, Crown of Madness', note: 'Many creatures immune. Useful for social but limited in combat.' },
  { condition: 'Poisoned', rating: 'B+', effect: 'Disadvantage on attacks and ability checks.', inflictWith: 'Poison spray, poisoned weapons, Contagion', note: 'Many creatures immune or resistant. Disadvantage on attacks is nice.' },
  { condition: 'Deafened', rating: 'C', effect: 'Auto-fail hearing checks. That\'s it.', inflictWith: 'Blindness/Deafness (deafness option)', note: 'Almost useless. Doesn\'t prevent spellcasting RAW.' },
];

export const EXHAUSTION_LEVELS = [
  { level: 1, effect: 'Disadvantage on ability checks.', note: 'Skill checks hurt. Combat mostly unaffected.' },
  { level: 2, effect: 'Speed halved.', note: 'Movement severely limited. Hard to position.' },
  { level: 3, effect: 'Disadvantage on attacks and saves.', note: 'Combat effectiveness destroyed. Very dangerous.' },
  { level: 4, effect: 'HP max halved.', note: 'Fragile. One more level = incapacitated.' },
  { level: 5, effect: 'Speed reduced to 0.', note: 'Can\'t move at all. Effectively helpless.' },
  { level: 6, effect: 'Death.', note: 'Instant death. No death saves. No HP threshold.' },
];

export const EXHAUSTION_TIPS = [
  'Exhaustion is the most dangerous condition. It doesn\'t go away on its own — need long rests.',
  'Each long rest removes only 1 level of exhaustion. Multiple levels take multiple days.',
  'Greater Restoration removes 1 level of exhaustion (100gp). Only reliable fast removal.',
  'Potion of Vitality: removes all exhaustion. Very Rare but incredible.',
  'Berserker Barbarian Frenzy causes 1 exhaustion after rage. Avoid Frenzy unless it\'s the last fight.',
  'Sickening Radiance (L4): 1 level exhaustion on failed CON save each round. Can kill with 6 levels in 6 rounds.',
];
