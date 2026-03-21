/**
 * playerPolymorphBestFormsGuide.js
 * Player Mode: Best Polymorph forms — combat, utility, and True Polymorph
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_RULES = {
  targetCR: 'CR ≤ target\'s level (or CR for creatures).',
  restrictions: 'Beast only (Polymorph). Any creature (True Polymorph).',
  hp: 'Target gets beast\'s HP. At 0, reverts to original.',
  stats: 'Replaces ALL stats. Lose class features.',
  concentration: 'Concentration, 1 hour.',
};

export const COMBAT_FORMS = [
  { form: 'Giant Ape', cr: 7, hp: 157, attacks: '2 × 3d10+6', rating: 'S+', note: 'Best form. 157 HP. Multiattack + ranged rock.' },
  { form: 'T-Rex', cr: 8, hp: 136, attacks: 'Bite 4d12+7', rating: 'S+', note: 'Highest single hit. Grapple on bite.' },
  { form: 'Mammoth', cr: 6, hp: 126, attacks: 'Gore + Stomp', rating: 'A+', note: 'Trampling Charge.' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: '3 attacks + poison', rating: 'A', note: 'Grapple + poison sting.' },
  { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite + grapple/restrain', rating: 'A', note: 'Good HP for CR 2.' },
];

export const UTILITY_FORMS = [
  { form: 'Giant Eagle', cr: 1, speed: '80ft fly', rating: 'S+', note: 'Best escape. Can carry Medium.' },
  { form: 'Killer Whale', cr: 3, speed: '60ft swim', hp: 90, rating: 'A (aquatic)', note: 'Best water form.' },
  { form: 'Spider', cr: 0, speed: 'Climb 30ft', rating: 'A (infiltration)', note: 'Tiny. Web Sense.' },
  { form: 'Warhorse', cr: '1/2', speed: '60ft', rating: 'A', note: 'Mount form.' },
];

export const POLYMORPH_TACTICS = [
  { tactic: 'Damage Sponge', method: 'Dying ally → Giant Ape. 157 bonus HP.', rating: 'S+' },
  { tactic: 'Enemy Removal', method: 'Polymorph enemy into snail. WIS save.', rating: 'S+' },
  { tactic: 'Emergency Escape', method: 'Giant Eagle. 80ft fly.', rating: 'S' },
  { tactic: 'Environment Bypass', method: 'Fish for water. Spider for climbing.', rating: 'A+' },
];

export const POLYMORPH_TIPS = [
  'Giant Ape: best form. 157 HP + multiattack.',
  'Polymorph dying ally: better than any heal spell.',
  'Enemy → snail: remove from fight entirely.',
  'Lose ALL class features while polymorphed.',
  'Concentration: protect the caster.',
  'Giant Eagle: best escape form. 80ft fly.',
  'True Polymorph: permanent after 1 hour. Become a dragon.',
  'Beast only for Polymorph. True Polymorph = any creature.',
];
