/**
 * playerTwoWeaponFightingRulesGuide.js
 * Player Mode: Two-weapon fighting rules and optimization
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  base: [
    'When you take the Attack action with a light melee weapon in one hand, you can use your BA to attack with a different light melee weapon in the other hand.',
    'You don\'t add your ability modifier to the BA attack damage (unless you have the TWF fighting style).',
    'Both weapons must have the Light property.',
    'Drawing/stowing: you can draw one weapon per turn for free. Drawing two requires Dual Wielder feat or two turns.',
  ],
  fightingStyle: {
    name: 'Two-Weapon Fighting',
    effect: 'Add ability modifier to BA attack damage.',
    classes: ['Fighter', 'Ranger'],
    note: 'Essential for TWF. Without this, BA attack deals noticeably less damage.',
  },
  dualWielderFeat: {
    name: 'Dual Wielder',
    effects: [
      '+1 AC while wielding two melee weapons.',
      'Can use non-light weapons for TWF (d8 weapons like longswords, rapiers).',
      'Can draw/stow two weapons at once.',
    ],
    note: 'Upgrades d6 → d8 weapons (+2 avg damage/turn). +1 AC is nice. Overall B-tier feat.',
  },
};

export const TWF_DAMAGE_COMPARISON = [
  { setup: 'Two Shortswords (no style)', mainDie: '1d6+DEX', offDie: '1d6', avgTotal: '10.5+DEX', note: 'Without style, off-hand has no mod.' },
  { setup: 'Two Shortswords (TWF style)', mainDie: '1d6+DEX', offDie: '1d6+DEX', avgTotal: '7+2×DEX', note: 'Style adds mod. Solid damage.' },
  { setup: 'Two Rapiers (Dual Wielder+TWF)', mainDie: '1d8+DEX', offDie: '1d8+DEX', avgTotal: '9+2×DEX', note: 'Best TWF setup. +1 AC too.' },
  { setup: 'Greatsword (GWF style)', mainDie: '2d6+STR', offDie: 'N/A', avgTotal: '8.33+STR', note: 'One hit. BA free. Scales better with GWM.' },
];

export const TWF_PROBLEMS = [
  { problem: 'Uses bonus action', detail: 'Competes with: Hex, Hunter\'s Mark, Cunning Action, Spiritual Weapon, Healing Word, rage.' },
  { problem: 'Scales poorly', detail: 'Extra Attack applies to Attack action only. TWF stays at 1 BA attack forever.' },
  { problem: 'No GWM equivalent', detail: 'Great Weapon Master adds +10 per hit. No TWF equivalent. Damage ceiling is much lower.' },
  { problem: 'Feat tax', detail: 'TWF style + Dual Wielder for modest improvement. Two investments for low return.' },
];

export const TWF_CLASS_VALUE = [
  { class: 'Rogue', rating: 'A', reason: 'Second attack = second Sneak Attack chance if first misses. Very valuable.' },
  { class: 'Ranger', rating: 'B', reason: 'Hunter\'s Mark competes for BA. Once running, BA attack adds HM damage.' },
  { class: 'Fighter', rating: 'C', reason: 'GWM/PAM far superior after L5. TWF strictly inferior.' },
  { class: 'Barbarian', rating: 'C', reason: 'Rage bonus on off-hand nice, but GWM much better.' },
  { class: 'Paladin', rating: 'D', reason: 'BA needed for smite spells. No TWF style. Anti-synergy.' },
];

export function twfDPR(abilityMod, hasFightingStyle, hasDualWielder) {
  const mainDie = hasDualWielder ? 4.5 : 3.5;
  const offDie = hasDualWielder ? 4.5 : 3.5;
  const mainDmg = mainDie + abilityMod;
  const offDmg = offDie + (hasFightingStyle ? abilityMod : 0);
  return { mainHand: Math.round(mainDmg), offHand: Math.round(offDmg), total: Math.round(mainDmg + offDmg) };
}
