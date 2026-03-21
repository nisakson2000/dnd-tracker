/**
 * playerDruidWildShapeFormsGuide.js
 * Player Mode: Druid Wild Shape — best forms by level and purpose
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2 per short/long rest. Recover on short rest.',
  action: 'Action to transform (BA for Moon Druid).',
  duration: 'Hours = half druid level (rounded down). Minimum 1 hour.',
  limits: [
    { level: 'L2', maxCR: '1/4', restrictions: 'No flying or swimming speed' },
    { level: 'L4', maxCR: '1/2', restrictions: 'No flying speed' },
    { level: 'L8', maxCR: '1', restrictions: 'None' },
  ],
  moonDruidLimits: [
    { level: 'L2', maxCR: '1', note: 'CR = druid level / 3 (rounded down)' },
    { level: 'L6', maxCR: '2', note: 'Attacks count as magical' },
    { level: 'L9', maxCR: '3', note: 'More powerful forms' },
    { level: 'L12', maxCR: '4', note: 'Elemental Wild Shape available at L10' },
    { level: 'L15', maxCR: '5', note: 'Top-tier beast forms' },
    { level: 'L18', maxCR: '6', note: 'Can cast spells in Wild Shape' },
  ],
  whatYouKeep: 'Mental stats (INT, WIS, CHA), proficiencies (if beast also has them), class features, personality.',
  whatYouLose: 'Physical stats (use beast\'s), can\'t cast spells (until L18 Moon), can\'t talk.',
  hpRule: 'Use beast\'s HP. When beast HP drops to 0, revert to your HP. Excess damage carries over.',
};

export const BEST_FORMS_BY_PURPOSE = {
  combat: [
    { form: 'Brown Bear', cr: '1', hp: 34, ac: 11, damage: '1d8+4 bite + 2d6+4 claws', level: 'L2 Moon', rating: 'S', note: 'Multiattack at L2. Insane for Moon Druids.' },
    { form: 'Dire Wolf', cr: '1', hp: 37, ac: 14, damage: '2d6+3 bite (prone on hit)', level: 'L2 Moon', rating: 'A+', note: 'Pack Tactics + prone. Great with melee allies.' },
    { form: 'Giant Constrictor Snake', cr: '2', hp: 60, ac: 12, damage: '2d6+4 bite + 2d8+4 constrict (grapple)', level: 'L6 Moon', rating: 'S', note: '60 HP + grapple+restrain. Best CR 2 form.' },
    { form: 'Giant Scorpion', cr: '3', hp: 52, ac: 15, damage: '3 attacks + poison', level: 'L9 Moon', rating: 'A+', note: '15 AC, three attacks, poison damage.' },
    { form: 'Giant Crocodile', cr: '5', hp: 85, ac: 14, damage: '2d10+5 bite (grapple) + 2d8+5 tail', level: 'L15 Moon', rating: 'A+', note: 'Huge HP pool + grapple on bite.' },
    { form: 'Mammoth', cr: '6', hp: 126, ac: 13, damage: '4d8+7 gore + 4d6+7 stomp (prone)', level: 'L18 Moon', rating: 'S', note: 'Highest beast HP. Trampling Charge is devastating.' },
  ],
  scouting: [
    { form: 'Cat', cr: '0', hp: 2, special: 'Stealth +4, Perception +3, tiny', level: 'L2', rating: 'S', note: 'Tiny, inconspicuous, great senses. Best scout form.' },
    { form: 'Spider', cr: '0', hp: 1, special: 'Web Sense, Wall Climber, tiny', level: 'L2', rating: 'S', note: 'Climb walls, sense vibrations. Infiltrate anywhere.' },
    { form: 'Rat', cr: '0', hp: 1, special: 'Keen Smell, tiny', level: 'L2', rating: 'A+', note: 'Tiny + Keen Smell. Classic infiltration form.' },
    { form: 'Owl', cr: '0', hp: 1, special: 'Flyby, Darkvision 120ft, Perception +3', level: 'L8 (flying)', rating: 'S+', note: 'Best aerial scout. 120ft Darkvision + Flyby.' },
    { form: 'Hawk', cr: '0', hp: 1, special: 'Keen Sight, 60ft fly', level: 'L8 (flying)', rating: 'A+', note: 'Excellent vision for daytime scouting.' },
  ],
  travel: [
    { form: 'Draft Horse', cr: '1/4', hp: 19, special: '60ft speed', level: 'L2', rating: 'A+', note: 'Fastest L2 land form. Can carry a rider.' },
    { form: 'Elk', cr: '1/4', hp: 13, special: '50ft speed, Charge', level: 'L2', rating: 'A', note: 'Fast + Charge attack. Good overland.' },
    { form: 'Giant Eagle', cr: '1', hp: 26, special: '80ft fly, Keen Sight', level: 'L8', rating: 'S', note: 'Fast flying + can carry a Medium creature. Aerial taxi.' },
    { form: 'Giant Owl', cr: '1/4', hp: 19, special: '60ft fly, Flyby', level: 'L8', rating: 'A+', note: 'Flyby prevents OAs. Safer flight.' },
  ],
  aquatic: [
    { form: 'Reef Shark', cr: '1/2', hp: 22, special: '40ft swim, Pack Tactics', level: 'L4', rating: 'A+', note: 'Pack Tactics + 40ft swim. Best early water form.' },
    { form: 'Hunter Shark', cr: '2', hp: 45, special: '40ft swim, Blood Frenzy', level: 'L6 Moon', rating: 'S', note: 'Advantage on bloodied targets + 45 HP.' },
    { form: 'Giant Octopus', cr: '1', hp: 52, special: '60ft swim, grapple, ink cloud', level: 'L2 Moon', rating: 'A+', note: '52 HP, 15ft reach grapple, ink cloud escape.' },
    { form: 'Killer Whale', cr: '3', hp: 90, special: '60ft swim, Keen Hearing', level: 'L9 Moon', rating: 'S', note: '90 HP aquatic tank. Best underwater combat form.' },
  ],
};

export const ELEMENTAL_WILD_SHAPE = {
  requirement: 'Moon Druid L10. Costs 2 Wild Shape uses.',
  forms: [
    { element: 'Earth Elemental', hp: 126, ac: 17, special: 'Earth Glide, Siege Monster', rating: 'S', note: 'Move through earth/stone. Highest AC. Siege damage.' },
    { element: 'Fire Elemental', hp: 102, ac: 13, special: 'Fire Form (ignite on touch), Illumination', rating: 'A', note: 'Touch damage, ignite enemies. Vulnerable to water.' },
    { element: 'Water Elemental', hp: 114, ac: 14, special: 'Whelm (grapple+restrain), water movement', rating: 'A+', note: 'Whelm is incredible control. Move through cracks.' },
    { element: 'Air Elemental', hp: 90, ac: 15, special: 'Whirlwind, 90ft fly', rating: 'A', note: 'Fastest flight. Whirlwind flings creatures.' },
  ],
};

export const WILD_SHAPE_TIPS = [
  'Wild Shape is primarily a UTILITY feature for non-Moon Druids. Use it for scouting, not combat.',
  'Moon Druids: Wild Shape is your primary combat form at L2-4. You\'re basically a martial.',
  'Conjure Animals (L3 spell) is often better than Wild Shape for combat at higher levels.',
  'You can concentrate on spells while in Wild Shape. Cast Heat Metal, then Wild Shape. Both active.',
  'Excess damage carries over. If you have 1 HP in bear form and take 30 damage, you take 29 to your real HP.',
  'Two Wild Shape uses = two extra HP pools per short rest. Moon Druid at L2: 34+34+your HP = massive.',
  'At L18, Moon Druid can cast spells in Wild Shape. Cast while being a Mammoth. Unfair.',
  'Wild Shape into a tiny creature to fit through gaps, hide in bags, or ride on allies\' shoulders.',
];
