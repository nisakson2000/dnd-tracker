/**
 * playerShortRestOptimization.js
 * Player Mode: Getting maximum value from short rests — who benefits, when to rest, and resource management
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_BASICS = {
  duration: '1 hour minimum. No strenuous activity.',
  hitDice: 'Spend hit dice to heal. Roll hit die + CON modifier per die spent.',
  frequency: 'No limit on short rests per day. DMG recommends 2 short rests per long rest.',
  lightActivity: 'Can eat, drink, read, tend wounds. Standing watch counts as light activity.',
  interruption: 'Combat or strenuous activity (1+ hour) during a short rest forces restart.',
};

export const SHORT_REST_CLASSES = {
  tier_S: {
    description: 'These classes NEED short rests. Their power budget assumes 2 per day.',
    classes: [
      { class: 'Warlock', recovers: 'ALL Pact Magic spell slots. Biggest short rest beneficiary.', impact: 'Without short rests, Warlocks have 2-4 spell slots per day total.' },
      { class: 'Fighter', recovers: 'Action Surge, Second Wind, Superiority Dice (Battle Master).', impact: 'Action Surge is one of the best features in the game. Get it back.' },
      { class: 'Monk', recovers: 'ALL ki points. Stunning Strike, Flurry of Blows, Step of the Wind.', impact: 'Ki-starved Monks are significantly weaker. Rest often.' },
    ],
  },
  tier_A: {
    description: 'Significant benefit from short rests.',
    classes: [
      { class: 'Cleric', recovers: 'Channel Divinity (Turn Undead, subclass feature).', impact: 'Turn Undead can end encounters. Subclass channels are often very strong.' },
      { class: 'Druid', recovers: 'Wild Shape uses. Natural Recovery (Land Druid, 1/day).', impact: 'Moon Druids get their HP pool back. Land Druids get spell slots.' },
      { class: 'Bard (5+)', recovers: 'Bardic Inspiration uses (Font of Inspiration at 5).', impact: 'Bardic Inspiration is your class identity. Get it all back.' },
      { class: 'Paladin', recovers: 'Channel Divinity.', impact: 'Sacred Weapon, Vow of Enmity, etc. Strong subclass features.' },
    ],
  },
  tier_B: {
    description: 'Some benefit from short rests.',
    classes: [
      { class: 'Wizard', recovers: 'Arcane Recovery (1/day, half wizard level in spell slots).', impact: 'Once per day. Still good — recovering a 3rd level slot is valuable.' },
      { class: 'Sorcerer', recovers: 'Nothing class-specific. Just hit dice.', impact: 'Sorcerers benefit least from short rests. Long rest class.' },
      { class: 'Ranger', recovers: 'Nothing class-specific until higher levels.', impact: 'Mostly just hit dice healing.' },
      { class: 'Barbarian', recovers: 'Nothing class-specific. Hit dice only.', impact: 'But Barbarian d12 hit dice are the best for healing.' },
      { class: 'Rogue', recovers: 'Nothing class-specific. Hit dice only.', impact: 'Rogues are fairly resource-independent.' },
    ],
  },
};

export const HIT_DICE_OPTIMIZATION = [
  { tip: 'Higher CON = more efficient hit dice', detail: 'CON +3 with a d10 hit die: average 8.5 HP per die. Without CON: 5.5 HP.', priority: 'S' },
  { tip: 'Barbarian d12s are gold', detail: 'Average 6.5 + CON per die. A Barbarian with CON +3 heals 9.5 average per die.', priority: 'A' },
  { tip: 'Save some for later', detail: 'Don\'t spend all hit dice on the first short rest. Save 2-3 for later in the day.', priority: 'A' },
  { tip: 'Song of Rest (Bard)', detail: 'Bard adds 1d6 (scaling to 1d12) to EACH ally\'s hit die healing. Have the Bard present.', priority: 'S' },
  { tip: 'Periapt of Wound Closure', detail: 'Doubles hit dice healing. d8 + CON 3 becomes (2d8 + 3) × 2 per die. Absurd value.', priority: 'S' },
  { tip: 'Chef feat', detail: 'Cook during short rest: d8 temp HP for up to 4+proficiency creatures. Free temp HP.', priority: 'A' },
  { tip: 'Durable feat', detail: 'Minimum hit die healing = 2 × CON mod. CON +3 = minimum 6 per die. Eliminates bad rolls.', priority: 'B' },
];

export const WHEN_TO_SHORT_REST = [
  { condition: 'Warlock/Monk/Fighter are out of resources', priority: 'S', reason: 'These classes recover their core features on short rest. They need it.' },
  { condition: 'Party HP is below 50%', priority: 'A', reason: 'Hit dice healing is free and efficient. 1 hour is worth the HP.' },
  { condition: 'Before a known hard fight', priority: 'S', reason: 'Full resources for a boss fight can be the difference between TPK and victory.' },
  { condition: 'After 2-3 encounters', priority: 'A', reason: 'DMG adventuring day assumes short rests between encounter groups.' },
  { condition: 'Bard is present with Song of Rest', priority: 'A', reason: 'Song of Rest multiplies the value of short rests for everyone.' },
  { condition: 'Safe area available', priority: 'B', reason: 'Short rests in dangerous areas risk interruption. Find a secure spot.' },
];

export const CATNAP_SPELL = {
  description: '3rd level spell. Three creatures get a short rest in 10 minutes instead of 1 hour.',
  caster: 'Bard, Sorcerer, Wizard',
  benefit: 'When time is critical and you need a short rest NOW.',
  note: 'Creatures fall unconscious during the catnap. Need someone to keep watch.',
};

export function hitDiceHealing(hitDieSize, conMod, diceSpent, hasSongOfRest, songDie, hasPeriapt) {
  const avgPerDie = (hitDieSize / 2 + 0.5) + conMod;
  let total = avgPerDie * diceSpent;
  if (hasSongOfRest) total += (songDie / 2 + 0.5);
  if (hasPeriapt) total *= 2;
  return { perDie: avgPerDie, total: Math.floor(total) };
}

export function shouldShortRest(party) {
  const shortRestClasses = ['Warlock', 'Fighter', 'Monk'];
  const hasShortRestClass = party.some(p => shortRestClasses.includes(p.class));
  const lowHP = party.some(p => p.currentHP / p.maxHP < 0.5);
  const lowResources = party.some(p => p.resourcesUsedPercent > 0.5);

  if (hasShortRestClass && lowResources) return { rest: true, urgency: 'high', reason: 'Short rest classes need to recover features.' };
  if (lowHP) return { rest: true, urgency: 'medium', reason: 'Party HP is low. Spend hit dice.' };
  return { rest: false, urgency: 'low', reason: 'Resources and HP are fine. Push on.' };
}
