/**
 * playerBestWildShapeGuide.js
 * Player Mode: Druid Wild Shape — best forms by level, combat & utility
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2 uses per short rest (L2+).',
  action: 'Action to transform. Bonus action for Moon Druid.',
  duration: 'Hours = half druid level (rounded down). Minimum 1 hour.',
  hpPool: 'Gain beast HP. When it drops to 0, revert with your remaining HP.',
  mentalStats: 'Keep INT, WIS, CHA. Use beast STR, DEX, CON.',
  spellcasting: 'Can\'t cast spells or speak while transformed (until L18).',
  concentration: 'Concentration spells cast BEFORE transforming are maintained.',
  maxCR: 'L2: CR 1/4 (no fly/swim). L4: CR 1/2 (swim). L8: CR 1 (fly).',
  moonDruidCR: 'Moon Druid: CR 1 at L2. CR = druid level / 3 at L6+.',
};

export const BEST_COMBAT_FORMS = {
  low: [
    { form: 'Giant Badger', cr: '1/4', hp: '13', note: 'Multiattack at CR 1/4. Best early form.' },
    { form: 'Wolf', cr: '1/4', hp: '11', note: 'Pack Tactics + prone. Good with melee allies.' },
    { form: 'Black Bear', cr: '1/2', hp: '19', note: 'Multiattack. Climb speed. Available at L4.' },
  ],
  mid: [
    { form: 'Brown Bear', cr: '1', hp: '34', note: 'Moon Druid L2. 34 HP + multiattack. Best early Moon.' },
    { form: 'Dire Wolf', cr: '1', hp: '37', note: '37 HP. Pack Tactics. Prone. Fast.' },
    { form: 'Giant Hyena', cr: '1', hp: '45', note: 'Highest HP at CR 1. Great meat shield.' },
    { form: 'Giant Constrictor Snake', cr: '2', hp: '60', note: 'Grapple + restrain. Best control. 60 HP.' },
  ],
  high: [
    { form: 'Giant Scorpion', cr: '3', hp: '52', note: 'Moon L9+. Multiattack with 3d8 poison sting.' },
    { form: 'Giant Crocodile', cr: '5', hp: '85', note: 'Moon L15+. 85 HP. Grapple bite.' },
    { form: 'Mammoth', cr: '6', hp: '126', note: 'Moon L18+. 126 HP. Trampling Charge prone.' },
  ],
};

export const BEST_UTILITY_FORMS = [
  { form: 'Spider', cr: '0', use: 'Infiltration. Tiny. Fits through cracks.', note: 'Web Sense. Darkvision.' },
  { form: 'Cat', cr: '0', use: 'Urban infiltration. Inconspicuous.', note: 'Keen smell. Stealth +4.' },
  { form: 'Hawk', cr: '0', use: 'Aerial scouting. Keen sight.', note: 'Available at L8 (fly).' },
  { form: 'Giant Eagle', cr: '1', use: 'Party transport. Carry allies. 80ft fly.', note: 'Large. Can carry Medium creature.' },
  { form: 'Giant Owl', cr: '1/4', use: 'Night scouting. Darkvision 120ft.', note: 'Flyby. Silent flight.' },
  { form: 'Horse', cr: '1/4', use: 'Overland travel. Mount for ally.', note: '60ft speed.' },
];

export const WILD_SHAPE_COMBOS = [
  { combo: 'Pre-cast Barkskin', how: 'Cast Barkskin (concentration) then transform. AC 16 minimum in beast form.', note: 'Most beasts have low AC. Barkskin fixes this.' },
  { combo: 'Pre-cast Spike Growth', how: 'Cast Spike Growth then transform into grappler. Drag enemies through.', note: 'Giant Constrictor + Spike Growth = devastating.' },
  { combo: 'Heat Metal + Transform', how: 'Cast Heat Metal on armored enemy. Transform. Bonus action damage each turn.', note: 'Heat Metal is bonus action. Beast form attacks + Heat Metal damage.' },
  { combo: 'Guardian of Nature + Moon Druid', how: 'L8+ spell. Great Tree form + transform. Temp HP + advantage.', note: 'Must be cast before transforming.' },
];

export const WILD_SHAPE_TIPS = [
  'Moon Druid: bonus action transform. CR 1 at L2 (Brown Bear = 34 HP).',
  'Cast concentration spells BEFORE transforming. They stay active.',
  'Wild Shape is an HP pool. Beast HP 0 = revert with your HP.',
  'Two uses per SHORT rest. Use one per fight.',
  'Giant Constrictor Snake: grapple + restrain. Best control form.',
  'Mammoth (CR 6): 126 HP. Moon Druid tanking at high levels.',
  'Utility: spider (infiltrate), cat (urban), hawk (scout).',
  'Pre-cast Barkskin for AC 16 minimum in beast form.',
  'Spike Growth + grapple form: drag enemies through spikes.',
  'L18 Beast Spells: cast while transformed. Game-changing.',
];
