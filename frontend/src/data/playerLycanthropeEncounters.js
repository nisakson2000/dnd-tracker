/**
 * playerLycanthropeEncounters.js
 * Player Mode: Fighting lycanthropes and dealing with lycanthropy
 * Pure JS — no React dependencies.
 */

export const LYCANTHROPE_TYPES = [
  { type: 'Werewolf', cr: 3, alignment: 'CE', immunity: 'Non-silvered, non-magical BPS', note: 'Most common. Pack Tactics. Bite spreads lycanthropy.' },
  { type: 'Wererat', cr: 2, alignment: 'LE', immunity: 'Non-silvered, non-magical BPS', note: 'Sneaky. Often in urban settings. Thieves\' guilds.' },
  { type: 'Wereboar', cr: 4, alignment: 'NE', immunity: 'Non-silvered, non-magical BPS', note: 'Charge attack. Relentless (drop to 1 HP instead of 0 once). Tough.' },
  { type: 'Weretiger', cr: 4, alignment: 'N', immunity: 'Non-silvered, non-magical BPS', note: 'Pounce (prone on charge). Often solitary. Not inherently evil.' },
  { type: 'Werebear', cr: 5, alignment: 'NG', immunity: 'Non-silvered, non-magical BPS', note: 'Good-aligned. May be an ally. Strong in bear form.' },
];

export const FIGHTING_LYCANTHROPES = {
  keyChallenge: 'Immune to BPS from non-silvered, non-magical weapons. If your party has no magic weapons, you can\'t hurt them.',
  solutions: [
    { method: 'Silvered weapons', cost: '100 gp per weapon', note: 'Bypasses immunity. Prepare in advance if you know you\'re fighting them.' },
    { method: 'Magic weapons', cost: 'Varies', note: 'Any magic weapon bypasses the immunity. +1 sword works fine.' },
    { method: 'Spell damage', cost: 'Spell slots', note: 'Fire Bolt, Guiding Bolt, Sacred Flame — all bypass weapon immunity.' },
    { method: 'Monk unarmed strikes', cost: 'Ki', note: 'At Monk 6, unarmed strikes count as magical. Before that, they don\'t work.' },
    { method: 'Moon Druid', cost: 'Wild Shape', note: 'Natural weapon attacks in Wild Shape aren\'t affected by the immunity. DM-dependent ruling.' },
  ],
};

export const LYCANTHROPY_RULES = {
  contraction: 'Bitten by a lycanthrope. CON save (DC varies, usually 12-15) or cursed.',
  effects: [
    'Gain the lycanthrope\'s alignment (unwilling lycanthropes try to resist).',
    'Gain shapechanger trait. Can transform into hybrid or beast form.',
    'Gain immunity to non-silvered, non-magical BPS.',
    'DM controls you in beast form if you can\'t control the curse.',
  ],
  cure: [
    'Remove Curse (3rd level) before first transformation.',
    'After first transformation: only Wish or DM-specific quest can cure it.',
    'Some settings allow Greater Restoration.',
  ],
  playerUse: 'Some DMs allow players to embrace lycanthropy for the power. Discuss with your DM.',
};

export const MOONLIGHT_TACTICS = [
  'Silver your weapons BEFORE the fight if you suspect lycanthropes.',
  'Fight in human form if possible — lycanthropes are weaker in human form.',
  'Full moon: werewolves are forced to transform. Plan around lunar cycles.',
  'Wolfsbane (300 gp/dose) can prevent transformation if consumed.',
  'If an ally is bitten, cast Remove Curse IMMEDIATELY (before their first transform).',
  'Moonbeam (2nd level Druid): forces shapechanger to revert on failed save. Excellent counter.',
];

export function silverWeaponCost(baseWeaponCost) {
  return baseWeaponCost + 100;
}

export function canDamageLycanthrope(weaponIsMagical, weaponIsSilvered, isSpellDamage) {
  return weaponIsMagical || weaponIsSilvered || isSpellDamage;
}
