/**
 * playerWildShapeFormsGuide.js
 * Player Mode: Wild Shape forms and optimization
 * Pure JS — no React dependencies.
 */

export const WILDSHAPE_RULES = {
  uses: '2 uses per short rest.',
  duration: 'Half Druid level in hours (rounded down).',
  action: 'Action to transform (bonus action for Moon Druid L2+).',
  hp: 'Gain the beast\'s HP. Revert with your remaining HP when beast HP = 0.',
  gear: 'Equipment merges or falls off. Can\'t use equipment in beast form.',
  spells: 'Can\'t cast spells. Can maintain concentration.',
};

export const CR_LIMITS = [
  { level: 2, maxCR: '1/4', fly: false, swim: false },
  { level: 4, maxCR: '1/2', fly: false, swim: true },
  { level: 8, maxCR: 1, fly: true, swim: true },
  { level: 'Moon L2', maxCR: 1, fly: false, swim: true },
  { level: 'Moon L6', maxCR: 'Level/3', fly: true, swim: true },
];

export const BEST_COMBAT_FORMS = [
  { form: 'Brown Bear', cr: 1, hp: 34, attacks: 'Bite + Claws (multiattack)', speed: '40ft, climb 30ft', note: 'Best early Moon Druid form. Multiattack at CR 1.', rating: 'S' },
  { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite + Constrict (grapple)', speed: '30ft, swim 30ft', note: 'CR 2. Grapple + restrain. 60 HP.', rating: 'S' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: '2 Claws + Sting (poison)', speed: '40ft', note: 'CR 3. Poison damage. Good multiattack.', rating: 'A' },
  { form: 'Mammoth', cr: 6, hp: 126, attacks: 'Gore + Stomp (trampling charge)', speed: '40ft', note: 'CR 6. 126 HP. Massive damage.', rating: 'S' },
  { form: 'Dire Wolf', cr: 1, hp: 37, attacks: 'Bite (knockdown)', speed: '50ft', note: 'Pack Tactics. Knockdown. Fast.', rating: 'A' },
];

export const BEST_UTILITY_FORMS = [
  { form: 'Cat', cr: 0, hp: 2, speed: '40ft, climb 30ft', use: 'Urban scouting. Tiny, inconspicuous.', rating: 'S' },
  { form: 'Spider', cr: 0, hp: 1, speed: '20ft, climb 20ft', use: 'Infiltration. Tiny. Fit through cracks.', rating: 'S' },
  { form: 'Hawk', cr: 0, hp: 1, speed: '60ft fly', use: 'Aerial recon. Keen Sight.', rating: 'A' },
  { form: 'Giant Owl', cr: '1/4', hp: 19, speed: '60ft fly', use: 'Night scouting. Flyby. 120ft darkvision.', rating: 'A' },
  { form: 'Giant Eagle', cr: 1, hp: 26, speed: '80ft fly', use: 'Air travel. Can carry Small creatures.', rating: 'A' },
  { form: 'Rat', cr: 0, hp: 1, speed: '20ft', use: 'Sewers, tight spaces. Darkvision 30ft.', rating: 'B' },
];

export const WILDSHAPE_TACTICS = [
  { tactic: 'Cast then shift', detail: 'Cast Conjure Animals or other concentration spell → Wild Shape → maintain concentration in beast form. Double value.', rating: 'S' },
  { tactic: 'HP buffer', detail: 'Low HP? Wild Shape = extra HP pool. When beast drops, you revert with your HP.', rating: 'S' },
  { tactic: 'Moon Druid bonus action shift', detail: 'Bonus action transform. Action: attack. Full combat turn while transforming.', rating: 'S' },
  { tactic: 'Scout as tiny animal', detail: 'Cat/spider/rat. Scout rooms. If caught, you\'re a normal animal.', rating: 'A' },
];

export function wildshapeDuration(druidLevel) {
  return Math.floor(druidLevel / 2);
}

export function moonDruidMaxCR(druidLevel) {
  if (druidLevel < 2) return 0.25;
  if (druidLevel < 6) return 1;
  return Math.floor(druidLevel / 3);
}
