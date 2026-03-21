/**
 * playerWishSpellGuide.js
 * Player Mode: Wish spell — the most powerful spell in D&D, with all its risks
 * Pure JS — no React dependencies.
 */

export const WISH_BASICS = {
  level: 9,
  class: 'Sorcerer, Wizard (Genie Warlock L17 via Mystic Arcanum)',
  castingTime: '1 action',
  effect: 'The mightiest spell a mortal can cast. Reshape reality.',
  note: 'Wish is the most powerful and most dangerous spell. Understand the risks before casting.',
};

export const WISH_SAFE_USES = {
  note: 'Duplicating a spell of 8th level or lower has NO risk and NO stress.',
  examples: [
    'Wish to cast Simulacrum (7th) — instant cast, no material cost, no risk.',
    'Wish to cast Clone (8th) — skip the 120-day clone maturation.',
    'Wish to cast Resurrection (7th) — no 1000 gp diamond needed.',
    'Wish to cast Demiplane (8th) — instant pocket dimension.',
    'Wish to cast Plane Shift (7th) — no tuning fork needed.',
    'Wish to cast Force Cage (7th) — no 1500 gp ruby dust.',
    'Wish to cast any spell from ANY class list up to 8th level.',
  ],
  important: 'This is the SAFEST use of Wish. No stress, no risk of losing it. Always consider this first.',
};

export const WISH_RISKY_USES = {
  note: 'Any use beyond duplicating a spell triggers the Stress mechanic.',
  suggestions: [
    'Create a nonmagical object worth up to 25,000 gp.',
    'Up to 20 creatures regain all HP + end all effects on them.',
    'Up to 10 creatures gain resistance to a chosen damage type.',
    'Up to 10 creatures gain immunity to a single spell/effect for 8 hours.',
    'Undo a single recent event (force reroll of any roll from last round).',
    'Anything else your imagination can conceive (DM interprets).',
  ],
};

export const WISH_STRESS = {
  trigger: 'Any use other than duplicating a spell of 8th or lower.',
  effects: [
    'Necrotic damage: 1d10 per level of spell you cast until your next long rest.',
    'STR drops to 3 for 2d4 days. Can only walk 1 mph. Max carry = 45 lbs.',
    '33% chance you can NEVER cast Wish again. Ever. Period.',
  ],
  mitigation: [
    'Cast Wish as a Simulacrum. The Simulacrum takes the stress, you don\'t.',
    'Genie Warlock: Wish through Limited Wish feature avoids some stress (DM ruling).',
    'Only use Wish to duplicate spells unless it\'s absolutely critical.',
  ],
};

export const WISH_TRAPS = {
  dmInterpretation: [
    '"I wish the dragon was dead." DM: "You are teleported 1000 years into the future. The dragon has died of old age."',
    '"I wish for a million gold." DM: "A million gold coins fall on you. 10,000 lbs of gold. Take 20d6 bludgeoning."',
    '"I wish I was the most powerful being." DM: "You become a deity\'s avatar. Your mortal mind shatters."',
  ],
  safeWording: [
    'Be specific but not overly complex.',
    'Include "without negative consequences to me or my allies."',
    'Specify timeframe: "immediately" or "permanently."',
    'Avoid superlatives: "most powerful," "best," "all."',
    'Keep it simple. The more complex, the more room for misinterpretation.',
  ],
};

export const SIMULACRUM_WISH = {
  combo: 'Cast Simulacrum (7th). Simulacrum casts Wish. Wish to create another Simulacrum of yourself.',
  loop: 'New Simulacrum also knows Wish. It Wishes for another Simulacrum. Infinite army.',
  note: 'This is the most broken combo in D&D 5e. Most DMs ban it immediately.',
  counterarguments: [
    'Simulacra can\'t regain spell slots. Each can only Wish once.',
    'Previous Simulacrum is destroyed when you create a new one (some DMs rule).',
    'The Wish stress applies to the Simulacrum, but 33% = can never cast again.',
    'DM fiat: "No infinite loops at my table."',
  ],
};

export function wishStressDamage(nextSpellLevel) {
  return nextSpellLevel * 5.5; // 1d10 avg per level
}

export function wishLossChance() {
  return 33; // 33% chance to lose Wish forever
}
