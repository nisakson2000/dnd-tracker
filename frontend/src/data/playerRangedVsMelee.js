/**
 * playerRangedVsMelee.js
 * Player Mode: Choosing between ranged and melee playstyles — pros, cons, and optimization
 * Pure JS — no React dependencies.
 */

export const MELEE_PROS_CONS = {
  pros: [
    'Higher single-hit damage (great weapons: 2d6, greatsword)',
    'Access to Great Weapon Master (-5/+10)',
    'Opportunity Attacks prevent enemies from leaving',
    'Sentinel + PAM = incredible zone control',
    'Grapple/Shove combo for control',
    'Many class features require melee (Divine Smite, Sneak Attack with melee)',
    'No ammunition tracking',
  ],
  cons: [
    'Must be in danger (enemies can hit you back)',
    'Requires movement to reach enemies',
    'Vulnerable to kiting/flying enemies',
    'Can\'t attack enemies behind cover or at range',
    'Crowd control spells (Web, Entangle) can trap you too',
    'Need STR or DEX investment',
  ],
};

export const RANGED_PROS_CONS = {
  pros: [
    'Stay out of melee danger (fewer hits taken)',
    'Attack from behind cover (half/three-quarter)',
    'Sharpshooter ignores cover bonuses',
    'Hit enemies at 150/600ft range (longbow)',
    'Crossbow Expert eliminates disadvantage in melee',
    'Can attack flying enemies easily',
    'Better positioning flexibility',
  ],
  cons: [
    'Disadvantage on ranged attacks in melee (without Crossbow Expert)',
    'Lower damage dice (d8 longbow vs 2d6 greatsword)',
    'Ammunition tracking (optional but RAW)',
    'No Opportunity Attacks with ranged weapons',
    'Cover bonuses apply to targets (unless Sharpshooter)',
    'Need DEX investment',
  ],
};

export const DPR_COMPARISON = {
  description: 'Average damage per round comparison at level 5 (+3 mod, 65% hit rate)',
  builds: [
    { build: 'Greatsword + GWM', attacks: 2, avgDmg: '27.3 DPR', note: '2 attacks × (2d6+13) × 0.4 hit rate with -5. Higher risk, higher reward.' },
    { build: 'Longsword + Shield + Dueling', attacks: 2, avgDmg: '17.4 DPR', note: '2 attacks × (1d8+5) × 0.65. Consistent and tanky (AC 20).' },
    { build: 'Longbow + Sharpshooter', attacks: 2, avgDmg: '25.8 DPR', note: '2 attacks × (1d8+13) × 0.45. Archery style helps offset -5.' },
    { build: 'Hand Crossbow + CBE + SS', attacks: 3, avgDmg: '34.7 DPR', note: '3 attacks × (1d6+13) × 0.45. Highest ranged DPR. Bonus action attack.' },
    { build: 'Rapier + Shield (Rogue)', attacks: 1, avgDmg: '16.6 DPR', note: '1 attack × (1d8+3d6+3) × 0.65. Plus potential OA for second SA.' },
    { build: 'Glaive + PAM + GWM', attacks: 3, avgDmg: '35.1 DPR', note: '2 attacks (1d10+13) + 1 PAM (1d4+13) × 0.4. Highest melee DPR.' },
  ],
};

export const WHEN_MELEE = [
  'You have high AC and HP (tank)',
  'You have melee-only features (Smite, Sneak Attack, Stunning Strike)',
  'The battlefield has chokepoints to hold',
  'Enemies are primarily melee and will reach you anyway',
  'You have Sentinel/PAM and want to control the battlefield',
  'The party needs a frontliner',
];

export const WHEN_RANGED = [
  'Enemies have strong melee attacks (giants, dragons)',
  'The battlefield is open (no cover for enemies)',
  'Enemies are flying',
  'You\'re a caster with low AC/HP',
  'The party already has multiple melee fighters',
  'You have Sharpshooter and/or Crossbow Expert',
];

export const HYBRID_APPROACHES = [
  { approach: 'Thrown weapons', detail: 'Javelins, handaxes. STR-based ranged option. Good for when you can\'t reach melee.', rating: 'B' },
  { approach: 'Returning weapon (Artificer)', detail: 'Returning Weapon infusion: thrown weapon returns. Infinite ranged option for STR builds.', rating: 'A' },
  { approach: 'Eldritch Blast + Hexblade', detail: 'Melee with Hexblade weapon, ranged with Eldritch Blast. CHA for both. True hybrid.', rating: 'S' },
  { approach: 'Monk ranged + melee', detail: 'Monks can throw darts/daggers with Martial Arts die. Melee or ranged each turn.', rating: 'B' },
  { approach: 'Cantrips for range', detail: 'Fire Bolt, Sacred Flame, Toll the Dead. Any caster has a ranged option.', rating: 'A' },
  { approach: 'Longbow backup', detail: 'Every martial should carry a longbow (or crossbow). Even if melee primary, sometimes you need range.', rating: 'A' },
];

export function compareDPR(attacks, avgDamagePerHit, hitChance) {
  return Math.round(attacks * avgDamagePerHit * hitChance * 10) / 10;
}

export function shouldSwitch(currentRange, enemyRange, hasRangedOption, hasMeleeOption) {
  if (currentRange === 'melee' && enemyRange > 30 && hasRangedOption) return 'Switch to ranged — enemy is too far.';
  if (currentRange === 'ranged' && enemyRange <= 5 && hasMeleeOption) return 'Switch to melee — enemy is in your face.';
  return 'Stay with current approach.';
}
