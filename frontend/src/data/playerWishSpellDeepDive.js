/**
 * playerWishSpellDeepDive.js
 * Player Mode: Wish spell deep-dive — the most powerful spell in D&D
 * Pure JS — no React dependencies.
 */

export const WISH_BASICS = {
  spell: 'Wish',
  level: 9,
  school: 'Conjuration',
  castingTime: '1 action',
  range: 'Self',
  components: 'V',
  duration: 'Instantaneous',
  classes: ['Wizard', 'Sorcerer', 'Genie Warlock (L9 Mystic Arcanum)'],
  note: 'The most powerful spell in D&D 5e. Can replicate any L8 or lower spell. Using it for anything else risks losing it forever.',
};

export const WISH_SAFE_USES = [
  { use: 'Replicate any L8 or lower spell', detail: 'Cast any spell of L8 or lower from ANY class list. No material components needed. No risk. This is the safest use.', risk: 'None', rating: 'S' },
  { use: 'Create object worth ≤25,000 gp', detail: 'Conjure a nonmagical object up to 300ft cube. Cannot be a magic item.', risk: 'Stress (see below)', rating: 'A' },
  { use: 'Grant 10 creatures resistance', detail: 'Up to 10 creatures gain resistance to a chosen damage type for 8 hours.', risk: 'Stress', rating: 'A' },
  { use: 'Grant immunity to a spell/effect', detail: 'Choose a spell: up to 10 creatures can\'t be affected by it for 8 hours.', risk: 'Stress', rating: 'A' },
  { use: 'Undo a recent event', detail: 'Force a reroll of any roll made in the last round with advantage or disadvantage.', risk: 'Stress', rating: 'A' },
];

export const WISH_STRESS = {
  trigger: 'Using Wish for anything OTHER than replicating a L8 or lower spell.',
  effects: [
    'Take 1d10 necrotic damage per spell level cast before next long rest (can\'t be reduced).',
    'STR drops to 3 for 2d4 days. DC 15 CON save each day or duration extends.',
    '33% chance you can never cast Wish again.',
  ],
  note: 'The 33% chance to lose Wish forever is the key risk. Most players only replicate spells.',
};

export const WISH_BEST_REPLICATIONS = [
  { spell: 'Simulacrum (L7)', detail: 'Create a copy of yourself. Safe use. The copy has half your HP and all your abilities.', rating: 'S' },
  { spell: 'Force Cage (L7)', detail: 'No save cage. Trap any creature. Safe use. Only teleportation escapes it.', rating: 'S' },
  { spell: 'Clone (L8)', detail: 'Create a backup body. Die → soul transfers. No 25,000gp diamond needed via Wish.', rating: 'S' },
  { spell: 'Resurrection (L7)', detail: 'Raise dead ally. No 1,000gp diamond needed via Wish. Safe use.', rating: 'S' },
  { spell: 'Demiplane (L8)', detail: 'Private extradimensional room. Store items, rest, trap enemies.', rating: 'A' },
  { spell: 'Contingency (L6)', detail: 'Set up "if X happens, cast Y." Pre-program emergency responses.', rating: 'A' },
  { spell: 'Heal (L6)', detail: 'Instant 70 HP heal + end blindness/deafness/disease. Emergency healing.', rating: 'A' },
  { spell: 'Plane Shift (L7)', detail: 'Escape to another plane or banish an enemy (CHA save).', rating: 'A' },
];

export const WISH_DM_TIPS = [
  'Be as specific as possible when wording creative wishes.',
  'State your INTENT, not just the words. "I intend for the dragon to peacefully leave."',
  'Greater the wish, greater the DM\'s latitude to twist it.',
  'Stick to L8 spell replication for guaranteed, risk-free results.',
  'Communicate with your DM about Wish expectations before using it creatively.',
  'The monkey\'s paw interpretation is common — overly ambitious wishes get twisted.',
];

export function wishStressNecrotic(spellLevelsCast) {
  return spellLevelsCast * 5.5; // avg 1d10 per spell level
}

export function wishLossChance() {
  return { chance: '33%', fraction: '1/3', note: 'Roll 1 on 1d3 = lose Wish forever' };
}
