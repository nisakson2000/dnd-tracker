/**
 * playerFeats.js
 * Player Mode: Feat reference with mechanical effects for combat prompts
 * Pure JS — no React dependencies.
 */

export const COMBAT_FEATS = [
  {
    name: 'Great Weapon Master',
    combatEffect: { attackMod: -5, damageMod: 10, condition: 'Heavy melee weapon' },
    bonusAction: 'Extra melee attack after crit or kill',
    description: 'Trade accuracy for damage with heavy weapons.',
  },
  {
    name: 'Sharpshooter',
    combatEffect: { attackMod: -5, damageMod: 10, condition: 'Ranged weapon' },
    other: ['No disadvantage at long range', 'Ignore half and three-quarters cover'],
    description: 'Trade accuracy for damage with ranged weapons.',
  },
  {
    name: 'Sentinel',
    combatEffect: null,
    reaction: 'OA when creature attacks ally within reach. Hit = speed 0.',
    other: ['Creatures provoke OA even when Disengaging', 'OA reduces speed to 0'],
    description: 'Punish enemies that ignore you.',
  },
  {
    name: 'Polearm Master',
    bonusAction: '1d4 bludgeoning with butt end of polearm',
    reaction: 'OA when creature enters your reach',
    description: 'Extra attacks with polearms.',
  },
  {
    name: 'War Caster',
    other: ['Advantage on concentration saves', 'Cast spell as opportunity attack', 'Somatic components with hands full'],
    description: 'Better spell concentration and combat casting.',
  },
  {
    name: 'Lucky',
    uses: 3,
    recharge: 'long rest',
    effect: 'Reroll any d20 (attack, check, or save). Choose which to use.',
    description: 'Three lucky rerolls per day.',
  },
  {
    name: 'Savage Attacker',
    effect: 'Once per turn, reroll melee weapon damage dice. Use either total.',
    description: 'Reroll weapon damage once per turn.',
  },
  {
    name: 'Shield Master',
    bonusAction: 'Shove with shield after Attack action',
    other: ['Add shield AC to DEX saves vs single-target effects', 'Evasion-like effect on success'],
    description: 'Offensive and defensive shield use.',
  },
  {
    name: 'Crossbow Expert',
    other: ['No disadvantage for ranged attacks within 5ft', 'Ignore loading property', 'Bonus action hand crossbow attack after Attack action'],
    description: 'Expert crossbow handling.',
  },
  {
    name: 'Resilient',
    effect: 'Gain proficiency in saving throws for one chosen ability.',
    description: 'Better saving throws in one ability.',
  },
  {
    name: 'Alert',
    combatEffect: { initiativeBonus: 5 },
    other: ['Cannot be surprised', '+5 to initiative'],
    description: 'Always ready for combat.',
  },
  {
    name: 'Mobile',
    combatEffect: { speedBonus: 10 },
    other: ['No OA from creatures you attack (hit or miss)', 'Dash ignores difficult terrain'],
    description: 'Faster and more mobile in combat.',
  },
  {
    name: 'Tough',
    effect: 'Max HP increases by 2 per level.',
    description: 'Significantly more hit points.',
  },
  {
    name: 'Mage Slayer',
    reaction: 'Melee attack when adjacent creature casts a spell',
    other: ['Advantage on saves vs adjacent spells', 'Concentration save with disadvantage from your attacks'],
    description: 'Counter spellcasters in melee.',
  },
];

/**
 * Get combat feat by name.
 */
export function getCombatFeat(name) {
  return COMBAT_FEATS.find(f => f.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

/**
 * Get all feats that provide bonus actions.
 */
export function getFeatsWithBonusAction() {
  return COMBAT_FEATS.filter(f => f.bonusAction);
}

/**
 * Get all feats that provide reactions.
 */
export function getFeatsWithReaction() {
  return COMBAT_FEATS.filter(f => f.reaction);
}
