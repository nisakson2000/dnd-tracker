/**
 * playerSpellUpcastGuide.js
 * Player Mode: Best spells to upcast — which spells scale well with higher slots
 * Pure JS — no React dependencies.
 */

export const BEST_UPCASTS = [
  { spell: 'Spirit Guardians', baseLevel: 3, scaling: '+1d8 per slot level', rating: 'S+', note: 'Best upcast. 3d8 → 6d8 at L6. Sustained AoE damage.' },
  { spell: 'Fireball', baseLevel: 3, scaling: '+1d6 per slot level', rating: 'A+', note: '8d6 → 11d6 at L6. Good but other L5+ options better.' },
  { spell: 'Spiritual Weapon', baseLevel: 2, scaling: '+1d8 per 2 slot levels', rating: 'A+', note: 'L4: 2d8+mod BA attack. No concentration.' },
  { spell: 'Aid', baseLevel: 2, scaling: '+5 max HP per slot level', rating: 'S', note: 'L5 Aid: +15 max HP to 3 targets. Not concentration.' },
  { spell: 'Cure Wounds', baseLevel: 1, scaling: '+1d8 per slot level', rating: 'B', note: 'Scales but Healing Word is usually better.' },
  { spell: 'Inflict Wounds', baseLevel: 1, scaling: '+1d10 per slot level', rating: 'A', note: '3d10 at L1 → 6d10 at L4. Huge single-target.' },
  { spell: 'Hold Person', baseLevel: 2, scaling: '+1 target per slot level', rating: 'S', note: 'L4: paralyze 3 humanoids. Multiple auto-crits.' },
  { spell: 'Banishment', baseLevel: 4, scaling: '+1 target per slot level', rating: 'S+', note: 'L5: banish 2 creatures. L6: banish 3. Incredible.' },
  { spell: 'Animate Dead', baseLevel: 3, scaling: '+2 undead per slot level', rating: 'S (Necromancer)', note: 'L5: 5 undead. Army grows.' },
  { spell: 'Summon spells (Tasha\'s)', baseLevel: '2-6', scaling: 'Better stats per slot', rating: 'S', note: 'Higher HP, damage, AC. Always worth upcasting.' },
  { spell: 'Scorching Ray', baseLevel: 2, scaling: '+1 ray per slot level', rating: 'A', note: 'L3: 4 rays. Good with advantage.' },
  { spell: 'Magic Missile', baseLevel: 1, scaling: '+1 dart per slot level', rating: 'A', note: 'Always hits. Good for finishing low HP targets.' },
  { spell: 'Shield of Faith', baseLevel: 1, scaling: 'No benefit', rating: 'F upcast', note: 'Never upcast. Always L1.' },
  { spell: 'Shield', baseLevel: 1, scaling: 'No benefit', rating: 'F upcast', note: 'Never upcast. Always L1.' },
  { spell: 'Counterspell', baseLevel: 3, scaling: 'Auto-counter spells of slot level', rating: 'S', note: 'L5 Counterspell auto-counters L5 spells. Worth upcasting vs known high spells.' },
];

export const UPCAST_CATEGORIES = {
  alwaysUpcast: ['Spirit Guardians', 'Aid', 'Hold Person', 'Banishment', 'Summon spells', 'Counterspell'],
  sometimesUpcast: ['Fireball', 'Spiritual Weapon', 'Scorching Ray', 'Inflict Wounds'],
  neverUpcast: ['Shield', 'Shield of Faith', 'Misty Step', 'Healing Word (usually)', 'Hex'],
};

export const UPCAST_TIPS = [
  'Spirit Guardians: ALWAYS upcast. +1d8/level is massive sustained DPR.',
  'Aid: upcast for +5 HP per level. Not concentration. Stacks with everything.',
  'Hold Person: upcast for more targets. 3 paralyzed = fight over.',
  'Banishment: L5 = 2 targets. L6 = 3 targets. Best upcast scaling.',
  'Shield: NEVER upcast. +5 AC is the same at any level.',
  'Counterspell: upcast to auto-counter. L5 slot vs L5 enemy spell.',
  'Fireball: decent upcast but L5+ slots have better options.',
  'Summon spells: always upcast. Better HP/damage/AC.',
  'Healing Word: usually keep at L1. 1 HP is enough to revive.',
  'Inflict Wounds: 3d10 at L1. Scales well for melee clerics.',
];
