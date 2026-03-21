/**
 * playerWeaponSelectionGuide.js
 * Player Mode: Weapon selection — best weapons by build and style
 * Pure JS — no React dependencies.
 */

export const MELEE_WEAPONS = [
  { weapon: 'Greatsword/Maul', damage: '2d6', rating: 'S+ (GWM)', note: '2d6 > 1d12 avg. GWM builds.' },
  { weapon: 'Glaive/Halberd', damage: '1d10', rating: 'S+ (PAM)', note: 'Reach + PAM = OA on entry.' },
  { weapon: 'Longsword', damage: '1d8 (1d10)', rating: 'S (Dueling)', note: 'Best one-handed + shield.' },
  { weapon: 'Rapier', damage: '1d8', rating: 'S (DEX)', note: 'Best finesse weapon.' },
  { weapon: 'Shortsword', damage: '1d6', rating: 'A (TWF)', note: 'Light. Dual wield.' },
  { weapon: 'Lance', damage: '1d12', rating: 'S (mounted)', note: 'One-handed mounted.' },
  { weapon: 'Whip', damage: '1d4', rating: 'B+', note: 'Only finesse reach. Low damage.' },
];

export const RANGED_WEAPONS = [
  { weapon: 'Hand Crossbow', damage: '1d6', rating: 'S+ (CBE)', note: 'CBE + SS = best ranged DPR.' },
  { weapon: 'Longbow', damage: '1d8', rating: 'S', note: '150ft range + SS.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', rating: 'A', note: 'Loading limits without CBE.' },
  { weapon: 'Javelin', damage: '1d6', rating: 'A', note: 'Best thrown. STR-based ranged.' },
];

export const WEAPON_BY_BUILD = {
  gwm: 'Greatsword/Maul. 2d6+10 per hit.',
  pam: 'Glaive/Halberd. BA d4 + OA on entry.',
  tank: 'Longsword + Shield. Dueling +2.',
  dex: 'Rapier. 1d8+DEX.',
  ranged: 'Hand Crossbow (CBE+SS) or Longbow (SS).',
  mounted: 'Lance + Shield. 1d12 one-handed.',
};

export const WEAPON_TIPS = [
  'Greatsword: 2d6 > 1d12. Better average.',
  'Glaive + PAM + Sentinel: best melee control.',
  'Hand Crossbow + CBE: 3 attacks at L5.',
  'Longbow: 150ft safe damage.',
  'Magic weapons bypass BPS resistance.',
  'Lance: best mounted weapon. 1d12 one-handed.',
  'Light property: required for TWF.',
  'Rapier is NOT light. Can\'t TWF without feat.',
];
