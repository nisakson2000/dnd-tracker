/**
 * playerFairyGuide.js
 * Player Mode: Fairy race guide — the tiny flier
 * Pure JS — no React dependencies.
 */

export const FAIRY_BASICS = {
  race: 'Fairy',
  source: 'The Wild Beyond the Witchlight / MotM',
  size: 'Small',
  speed: '30ft, fly 30ft',
  type: 'Fey (not Humanoid)',
  asi: 'Flexible (MotM)',
  theme: 'Tiny fey creature with innate flight and magic.',
  note: 'One of the strongest races. FREE FLIGHT from level 1. Fey type dodges humanoid-targeting spells. Innate spellcasting.',
};

export const FAIRY_TRAITS = [
  { trait: 'Fairy Flight', effect: 'Fly speed 30ft. Cannot use while wearing medium or heavy armor.', note: 'PERMANENT FLIGHT FROM LEVEL 1. Light armor or no armor only. This is the #1 feature.' },
  { trait: 'Fey', effect: 'Creature type is Fey, not Humanoid.', note: 'Hold Person, Charm Person, etc. don\'t affect you. Same as Satyr.' },
  { trait: 'Fairy Magic', effect: 'Faerie Fire (1st level) once per long rest. Enlarge/Reduce (3rd level) once per long rest.', note: 'Free Faerie Fire = party-wide advantage on attacks. Free Enlarge/Reduce.' },
  { trait: 'Small Size', effect: 'Small creature. Disadvantage with heavy weapons.', note: 'Can\'t use greatswords/greataxes effectively. But you\'re flying, so who cares.' },
];

export const FAIRY_FLIGHT_ANALYSIS = {
  advantages: [
    'Stay out of melee range permanently',
    'Bypass ground-based obstacles (pits, difficult terrain, traps)',
    'Reach elevated positions without climbing',
    'Escape grapples by flying up',
    'Kite melee-only enemies indefinitely',
  ],
  limitations: [
    'No medium or heavy armor (light armor or unarmored only)',
    'Can be grounded by ranged attacks',
    'Ceiling-less areas needed for full benefit',
    'DMs may design encounters to counter flight',
    'Falling damage if knocked prone while flying',
  ],
  note: 'Flight is the best mobility option in the game. Having it at level 1 with no resource cost is extremely powerful.',
};

export const FAIRY_BUILDS = [
  { build: 'Fairy Warlock', detail: 'Fly + Eldritch Blast. Stay 120ft up. Rain EB down. Enemies can\'t reach you. No armor needed.', rating: 'S', note: 'The classic. Fly above everything. Blast from safety.' },
  { build: 'Fairy Sorcerer', detail: 'Fly + spell range. Stay airborne. Cast from safety. Fey type blocks Hold Person.', rating: 'S' },
  { build: 'Fairy Wizard', detail: 'Fly + Mage Armor (14 AC with DEX 14). Cast from above. Fey type.', rating: 'S' },
  { build: 'Fairy Bard', detail: 'Fly + support spells. Stay out of danger. Faerie Fire for party advantage.', rating: 'A' },
  { build: 'Fairy Ranger', detail: 'Fly + longbow. Aerial sniper. 150ft range from above.', rating: 'A' },
  { build: 'Fairy Rogue', detail: 'Fly + ranged Sneak Attack. Shortbow from above. Fey type for safety.', rating: 'A' },
  { build: 'Fairy Artificer (Artillerist)', detail: 'Fly + Eldritch Cannon. Airborne turret platform.', rating: 'A' },
];

export const FAIRY_VS_AARAKOCRA = {
  fairy: { pros: ['Fey type (dodge humanoid spells)', 'Free Faerie Fire', 'Free Enlarge/Reduce', 'Small (fit in tight spaces)'], cons: ['30ft fly (not 50)', 'Small (heavy weapon disadvantage)', 'No talons'] },
  aarakocra: { pros: ['50ft fly speed (fastest)', 'Talons (1d6 unarmed)', 'Medium size'], cons: ['Humanoid type', 'No innate spellcasting', 'No fey benefits'] },
  verdict: 'Fairy for casters (fey type + free spells). Aarakocra for speed and martial builds.',
};

export function fairyFlySpeed() {
  return 30;
}

export function faerieFireDamageIncrease(partyAttacksPerRound, hitChanceWithout) {
  // Faerie Fire grants advantage
  const hitChanceWith = 1 - Math.pow(1 - hitChanceWithout, 2);
  const improvement = hitChanceWith - hitChanceWithout;
  return improvement * partyAttacksPerRound; // Extra expected hits per round
}
