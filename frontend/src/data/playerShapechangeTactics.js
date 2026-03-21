/**
 * playerShapechangeTactics.js
 * Player Mode: Polymorph/True Polymorph analysis, best forms, and tactical usage
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_RULES = {
  target: 'One creature. WIS save if unwilling.',
  form: 'Any beast ≤ target\'s level/CR.',
  stats: 'Gain beast stats. Lose class features/spellcasting.',
  revert: 'At 0 beast HP, revert with original HP.',
  duration: '1 hour, concentration.',
};

export const BEST_FORMS = [
  { form: 'Giant Ape', cr: 7, hp: 157, attacks: 'Fist x2 (3d10+6)', rating: 'S' },
  { form: 'T-Rex', cr: 8, hp: 136, attacks: 'Bite (4d12+7) + Tail (3d8+7)', rating: 'S' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: 'Claws x2 + Sting (poison)', rating: 'A' },
  { form: 'Giant Elk', cr: 2, hp: 42, attacks: 'Ram + Hooves charge', rating: 'A' },
  { form: 'Giant Owl', cr: 0.25, hp: 19, attacks: 'Talons', note: 'Flyby scout.', rating: 'B' },
];

export const POLYMORPH_TACTICS = [
  { tactic: 'HP battery', detail: 'Wounded ally → Giant Ape. +157 temp HP. Revert at full health.', rating: 'S' },
  { tactic: 'Enemy removal', detail: 'Boss → turtle. WIS save. Fight over if held.', rating: 'S' },
  { tactic: 'Emergency escape', detail: 'Downed ally → Giant Eagle. Fly away at 80ft.', rating: 'A' },
  { tactic: 'Fall damage combo', detail: 'Enemy → tiny creature. Fly up. Drop. 20d6.', rating: 'A' },
];

export const TRUE_POLYMORPH = {
  spell: '9th level. Any creature (not just beasts). Permanent after 1 hour.',
  bestForms: [
    { form: 'Ancient Brass Dragon', cr: 20, hp: 297 },
    { form: 'Planetar', cr: 16, hp: 200 },
    { form: 'Iron Golem', cr: 16, hp: 210 },
  ],
  note: 'Permanently become an Ancient Dragon. Best caster endgame.',
};

export function bestFormForLevel(level) {
  if (level >= 8) return { form: 'T-Rex', cr: 8, hp: 136 };
  if (level >= 7) return { form: 'Giant Ape', cr: 7, hp: 157 };
  if (level >= 3) return { form: 'Giant Scorpion', cr: 3, hp: 52 };
  return { form: 'Giant Elk', cr: 2, hp: 42 };
}
