/**
 * playerWishSpellMasterGuide.js
 * Player Mode: Wish — the most powerful spell in D&D
 * Pure JS — no React dependencies.
 */

export const WISH_BASICS = {
  spell: 'Wish',
  level: 9,
  classes: ['Sorcerer', 'Wizard', 'Genie Warlock (Mystic Arcanum)'],
  effect: 'Duplicate any L8 or lower spell (safe) OR reshape reality (risky).',
};

export const WISH_SAFE_USES = [
  { spell: 'Simulacrum', why: 'Skip 12hr cast + 1500gp. Instant clone.', rating: 'S+' },
  { spell: 'Resurrection', why: 'No 1000gp diamond. Bring anyone back.', rating: 'S' },
  { spell: 'Forcecage', why: 'Instant prison. No save.', rating: 'S' },
  { spell: 'Clone', why: 'Skip 3000gp + 120 days. Instant immortality.', rating: 'S' },
  { spell: 'Antimagic Field', why: 'Shut down enemy casters.', rating: 'A+' },
];

export const WISH_STRESS = {
  trigger: 'Any use other than duplicating L8 or lower spell.',
  effects: ['1d10 necrotic per spell level until LR', 'STR drops to 3 for 2d4 days', '33% chance NEVER cast Wish again'],
  note: 'The 33% loss chance is why most players only duplicate spells.',
};

export const WISH_TIPS = [
  'Always duplicate spells unless truly desperate.',
  'Word creative wishes EXTREMELY carefully.',
  'Discuss with DM before creative use.',
  'Simulacrum duplication is the most common best use.',
  'Genie Warlock: once/LR, no risk of permanently losing it.',
];
