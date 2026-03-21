/**
 * playerShortSwordVsRapierGuide.js
 * Player Mode: Weapon comparison — which weapons to use and why
 * Pure JS — no React dependencies.
 */

export const MELEE_WEAPONS_COMPARED = [
  { weapon: 'Greatsword', damage: '2d6 (7 avg)', properties: 'Heavy, two-handed', bestFor: 'GWM builds. Highest average melee damage.', rating: 'S (STR builds)' },
  { weapon: 'Greataxe', damage: '1d12 (6.5 avg)', properties: 'Heavy, two-handed', bestFor: 'Half-Orc/Brutal Critical (more dice to double on crit).', rating: 'A+ (crit builds)' },
  { weapon: 'Glaive/Halberd', damage: '1d10 (5.5 avg)', properties: 'Heavy, reach, two-handed', bestFor: 'PAM builds. 10ft reach. BA attack with butt end.', rating: 'S (PAM builds)' },
  { weapon: 'Longsword', damage: '1d8 (4.5) / 1d10 versatile', properties: 'Versatile', bestFor: 'Sword & board. Or two-handed without GWM.', rating: 'A' },
  { weapon: 'Rapier', damage: '1d8 (4.5)', properties: 'Finesse', bestFor: 'DEX builds. Highest one-handed finesse damage.', rating: 'S (DEX builds)' },
  { weapon: 'Shortsword', damage: '1d6 (3.5)', properties: 'Finesse, light', bestFor: 'TWF (light property). Rogues (finesse + light).', rating: 'A' },
  { weapon: 'Scimitar', damage: '1d6 (3.5)', properties: 'Finesse, light', bestFor: 'Same as shortsword. Flavor difference.', rating: 'A' },
  { weapon: 'Whip', damage: '1d4 (2.5)', properties: 'Finesse, reach', bestFor: 'Reach + finesse. Niche for DEX reach builds.', rating: 'B' },
  { weapon: 'Quarterstaff', damage: '1d6 / 1d8 versatile', properties: 'Versatile', bestFor: 'Monks, Druids (Shillelagh). PAM compatible.', rating: 'A' },
  { weapon: 'Spear', damage: '1d6 / 1d8 versatile', properties: 'Thrown, versatile', bestFor: 'PAM compatible + thrown option. Underwater viable.', rating: 'A' },
];

export const RANGED_WEAPONS_COMPARED = [
  { weapon: 'Longbow', damage: '1d8 (4.5)', range: '150/600', properties: 'Ammunition, heavy, two-handed', bestFor: 'Best ranged weapon. Longest range.', rating: 'S' },
  { weapon: 'Hand Crossbow', damage: '1d6 (3.5)', range: '30/120', properties: 'Ammunition, light, loading', bestFor: 'CBE builds. One-handed. BA attack with CBE.', rating: 'S (with CBE)' },
  { weapon: 'Heavy Crossbow', damage: '1d10 (5.5)', range: '100/400', properties: 'Ammunition, heavy, loading, two-handed', bestFor: 'Highest ranged damage without feats.', rating: 'A (without CBE)' },
  { weapon: 'Light Crossbow', damage: '1d8 (4.5)', range: '80/320', properties: 'Ammunition, loading, two-handed', bestFor: 'Default ranged for most classes.', rating: 'A' },
  { weapon: 'Shortbow', damage: '1d6 (3.5)', range: '80/320', properties: 'Ammunition, two-handed', bestFor: 'No loading = multiple attacks. Monk/Rogue option.', rating: 'B+' },
  { weapon: 'Javelin', damage: '1d6 (3.5)', range: '30/120', properties: 'Thrown', bestFor: 'STR builds wanting a ranged option.', rating: 'B+' },
  { weapon: 'Dart', damage: '1d4 (2.5)', range: '20/60', properties: 'Finesse, thrown', bestFor: 'Finesse thrown option.', rating: 'C+' },
];

export const WEAPON_FEATS = [
  { feat: 'Great Weapon Master', weapons: 'Heavy, two-handed', effect: '-5 to hit, +10 damage. BA attack on crit/kill.', rating: 'S' },
  { feat: 'Sharpshooter', weapons: 'Ranged', effect: '-5 to hit, +10 damage. No disadvantage at long range. Ignore cover.', rating: 'S' },
  { feat: 'Polearm Master', weapons: 'Glaive, halberd, quarterstaff, spear', effect: 'BA attack (1d4). OA when entering reach.', rating: 'S' },
  { feat: 'Crossbow Expert', weapons: 'Crossbows', effect: 'Ignore loading. No disadvantage at melee range. BA hand crossbow attack.', rating: 'S' },
  { feat: 'Dual Wielder', weapons: 'Any one-handed', effect: '+1 AC. Use non-light weapons for TWF. Draw two weapons.', rating: 'B+' },
];

export const WEAPON_SELECTION_TIPS = [
  'STR melee: Greatsword + GWM or Glaive + PAM. Best damage.',
  'DEX melee: Rapier + shield. Or Rapier + Shortsword (TWF) if Rogue.',
  'Ranged: Longbow for most. Hand Crossbow + CBE for feat-heavy builds.',
  'Monk: Use monk weapons. Quarterstaff (1d8 versatile) until martial arts die catches up.',
  'Magic weapons: use whatever magic weapon you find. +1 dagger > nonmagical greatsword past L5.',
  'Underwater: only daggers, javelins, shortswords, spears, tridents work without disadvantage.',
];
