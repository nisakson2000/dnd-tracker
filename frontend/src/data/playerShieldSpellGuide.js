/**
 * playerShieldSpellGuide.js
 * Player Mode: Shield spell rules, when to use, and slot management
 * Pure JS — no React dependencies.
 */

export const SHIELD_RULES = {
  level: 1,
  castingTime: 'Reaction (when hit by an attack or targeted by Magic Missile)',
  duration: 'Until the start of your next turn',
  effect: '+5 to AC (including against the triggering attack)',
  magicMissile: 'Also blocks Magic Missile entirely',
  component: 'V, S (somatic — need a free hand or War Caster)',
  classes: ['Wizard', 'Sorcerer', 'Hexblade Warlock', 'Eldritch Knight Fighter', 'Artillerist Artificer'],
};

export const SHIELD_MATH = {
  examples: [
    { baseAC: 13, withShield: 18, note: 'Mage Armor wizard. 13 → 18. Blocks most attacks up to level 5.' },
    { baseAC: 16, withShield: 21, note: 'Chain mail Fighter. 16 → 21. Nearly untouchable for mid-levels.' },
    { baseAC: 18, withShield: 23, note: 'Plate + shield Paladin. 18 → 23. Adult dragons struggle to hit you.' },
    { baseAC: 20, withShield: 25, note: 'Plate + shield + Defense. 20 → 25. Ancient dragons need 15+ to hit.' },
  ],
  note: '+5 AC for a round is the best defensive value per spell slot in the game.',
};

export const WHEN_TO_SHIELD = [
  { situation: 'Attack would hit by 1-5', decision: 'SHIELD', reason: 'Shield turns this hit into a miss. Perfect use case.' },
  { situation: 'Attack would hit by 6+', decision: 'DON\'T SHIELD', reason: '+5 AC won\'t help. The attack still hits. Save the slot.' },
  { situation: 'Multiple attackers targeting you', decision: 'SHIELD', reason: '+5 AC until your next turn blocks multiple attacks, not just this one.' },
  { situation: 'You\'re concentrating on a key spell', decision: 'SHIELD', reason: 'Avoiding damage = no concentration save. Shield protects concentration.' },
  { situation: 'It\'s the last enemy\'s last attack', decision: 'MAYBE NOT', reason: 'Is the damage survivable? If so, save the slot. If it would down you, shield.' },
  { situation: 'You have 1 spell slot left', decision: 'SAVE IT', reason: 'Unless Shield saves your life, save the last slot for an emergency.' },
  { situation: 'Magic Missile', decision: 'SHIELD', reason: 'Shield completely blocks Magic Missile. Always worth it against MM.' },
];

export const SHIELD_VS_ABSORB_ELEMENTS = {
  shield: {
    trigger: 'Hit by attack or Magic Missile',
    effect: '+5 AC, blocks MM',
    bestAgainst: 'Weapon attacks, multiattack creatures, archers',
  },
  absorbElements: {
    trigger: 'Take acid, cold, fire, lightning, or thunder damage',
    effect: 'Resistance to triggering damage type until start of next turn. Extra 1d6 on next melee.',
    bestAgainst: 'Breath weapons, elemental spells, environmental damage',
  },
  verdict: 'Shield for attacks. Absorb Elements for elemental damage (especially AoE saves you failed).',
};

export const SLOT_MANAGEMENT = [
  'Shield is worth a 1st level slot almost every time it turns a hit into a miss.',
  'At high levels, 1st level slots are cheap. Shield freely.',
  'At low levels (1-4), slots are precious. Only Shield against big attacks.',
  'If you have Arcane Ward (Abjuration Wizard), Shield also recharges your ward.',
  'Counterspell competes with Shield for your reaction. Prioritize based on threat.',
  'War Caster lets you cast Shield with weapons/shield in hands.',
];

export function shouldShield(attackRoll, currentAC, currentHP, maxHP, slotsRemaining) {
  const wouldHitNormally = attackRoll >= currentAC;
  const wouldMissWithShield = attackRoll < currentAC + 5;

  if (!wouldHitNormally) return { shield: false, reason: 'Attack already misses. Don\'t waste the slot.' };
  if (!wouldMissWithShield) return { shield: false, reason: 'Attack still hits even with Shield. Save the slot.' };
  if (slotsRemaining <= 1 && currentHP > maxHP * 0.5) return { shield: false, reason: 'Low on slots. You can take the hit.' };
  return { shield: true, reason: `Shield turns this ${attackRoll} vs AC ${currentAC} into a miss (AC ${currentAC + 5}).` };
}

export function shieldACWithClass(baseAC, hasRealShield, hasMageArmor) {
  let ac = baseAC;
  if (hasMageArmor) ac = Math.max(ac, 13); // Mage Armor sets base
  if (hasRealShield) ac += 2;
  return { normal: ac, withShieldSpell: ac + 5 };
}
