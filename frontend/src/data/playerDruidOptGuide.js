/**
 * playerDruidOptGuide.js
 * Player Mode: Druid optimization — Wild Shape, circles, spell strategy
 * Pure JS — no React dependencies.
 */

export const DRUID_CORE = {
  strengths: ['Prepared caster: change spells daily.', 'Wild Shape: versatility and extra HP.', 'Best battlefield control spells.', 'Healing + utility + damage.'],
  weaknesses: ['Wild Shape forms become weak at higher levels (non-Moon).', 'Can\'t wear metal armor (flavor, some DMs enforce).', 'Concentration-heavy. Losing concentration = losing your best spells.', 'Complex: many options creates decision paralysis.'],
  stats: 'WIS > CON > DEX. WIS for spells. CON for concentration + HP.',
  key: 'Druid = control. Spike Growth, Plant Growth, Conjure Animals. Control the battlefield.',
};

export const WILD_SHAPE_RULES = {
  uses: '2 per short rest.',
  duration: 'Hours = half Druid level (rounded down). Min 1 hour.',
  limitations: [
    { level: 2, maxCR: '1/4', movement: 'No flying or swimming' },
    { level: 4, maxCr: '1/2', movement: 'No flying. Swimming OK.' },
    { level: 8, maxCR: '1', movement: 'Flying OK.' },
  ],
  rules: [
    'You use the beast\'s STR, DEX, CON. Keep your INT, WIS, CHA.',
    'You keep your proficiencies and gain the beast\'s.',
    'You can\'t cast spells in Wild Shape (Moon Druid exception at L18).',
    'When you drop to 0 HP, you revert. Excess damage carries over.',
    'You can maintain concentration while in Wild Shape.',
    'Equipment merges into your form (can\'t use it).',
  ],
};

export const BEST_WILD_SHAPE_FORMS = {
  combat: [
    { form: 'Brown Bear', cr: '1', hp: 34, why: 'Multiattack. Best L2 combat form.', level: 2, note: 'Moon Druid only at L2.' },
    { form: 'Dire Wolf', cr: '1', hp: 37, why: 'Pack tactics. Prone on bite.', level: 2, note: 'Moon Druid only.' },
    { form: 'Giant Scorpion', cr: '3', hp: 52, why: 'Three attacks. Grapple with claws.', level: 6, note: 'Moon Druid.' },
    { form: 'Giant Ape', cr: '7', hp: 157, why: 'Best form. Multiattack, 3d10+6. Ranged rock throw.', level: 9, note: 'Moon Druid only. Or Polymorph.' },
    { form: 'Mammoth', cr: '6', hp: 126, why: 'Trampling Charge: prone + stomp.', level: 9, note: 'Moon Druid.' },
  ],
  utility: [
    { form: 'Spider', cr: '0', why: 'Climb speed. Tiny. Darkvision. Perfect scout.', level: 2, note: 'Any Druid.' },
    { form: 'Cat', cr: '0', why: 'Tiny. Inconspicuous. Stealth +4.', level: 2, note: 'Urban scouting.' },
    { form: 'Hawk', cr: '0', why: 'Fly 60ft. Keen Sight (advantage on Perception).', level: 2, note: 'Aerial scouting.' },
    { form: 'Giant Owl', cr: '1/4', why: 'Fly 60ft. Darkvision 120ft. Flyby.', level: 2, note: 'Best aerial scout.' },
    { form: 'Giant Octopus', cr: '1', why: 'Swim. Grapple. Ink cloud. Underwater expert.', level: 4, note: 'Aquatic environments.' },
  ],
};

export const CIRCLE_RANKINGS = [
  { circle: 'Moon', rating: 'S (L2-4, L20)', why: 'Combat Wild Shape. BA to transform. CR scales with level. Elemental forms at L10.', note: 'Incredible at L2 (Brown Bear HP), weak at L5-9, amazing at L20 (unlimited forms).' },
  { circle: 'Shepherd', rating: 'S', why: 'Spirit Totem: buff summons. Mighty Summoner: extra HP for summoned creatures.', note: 'Best summoner. Conjure Animals + Shepherd buffs = broken.' },
  { circle: 'Stars', rating: 'S', why: 'Starry Form: Archer (BA 1d8+WIS), Chalice (heal when casting), Dragon (min 10 on concentration). No Wild Shape needed.', note: 'Tasha\'s. Best overall Druid. Dragon form = never fail concentration.' },
  { circle: 'Wildfire', rating: 'A+', why: 'Wildfire Spirit: BA fire damage + teleport allies. Enhanced Bond: +1d8 to spells.', note: 'Tasha\'s. Great damage + utility. Spirit is excellent.' },
  { circle: 'Land', rating: 'A', why: 'Extra spells from land type. Natural Recovery (like Arcane Recovery). Extra cantrip.', note: 'Caster Druid. Extra spells = more flexibility. Land of the Coast is best.' },
  { circle: 'Spores', rating: 'B+', why: 'Halo of Spores: reaction damage. Symbiotic Entity: temp HP + extra damage.', note: 'Melee Druid. Temp HP from Symbiotic Entity uses Wild Shape.' },
  { circle: 'Dreams', rating: 'B+', why: 'Balm of the Summer Court: BA healing. Hidden Paths: teleport.', note: 'Healing + mobility. Decent support but outclassed.' },
];

export const DRUID_COMBAT_STRATEGY = {
  round1: 'Concentration spell: Spike Growth, Entangle, or Conjure Animals.',
  round2: 'Maintain concentration. Use non-concentration utility or cantrips.',
  nonMoon: 'Wild Shape for scouting/utility only. Cast spells in human form.',
  moon: 'Wild Shape BA → attack in beast form. Cast concentration spell FIRST, then transform.',
  key: 'Cast concentration spell → maintain it. Everything else is gravy.',
};

export const DRUID_BUILD_TIPS = [
  'Stars Druid: best overall circle. Dragon form = can\'t fail concentration.',
  'Shepherd: best summoner. Conjure Animals + spirit totem buffs.',
  'Moon: amazing at L2-4, falls off L5-9, god-tier at L20.',
  'Spike Growth + forced movement = 2d4 per 5ft. Insane damage.',
  'Plant Growth: no concentration. 1/4 speed in 100ft. Best control.',
  'Conjure Animals: 8 wolves. Pack tactics. Best L3 spell.',
  'Cast concentration spell BEFORE Wild Shaping (Moon). You maintain it.',
  'Non-Moon Druid: Wild Shape is for scouting (spider, hawk), not combat.',
  'Goodberry: 10 HP out of combat. Feed to downed allies (1 HP each).',
  'WIS > CON > DEX. Max WIS. Your spells scale with WIS.',
];
