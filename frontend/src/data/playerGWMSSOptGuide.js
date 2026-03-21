/**
 * playerGWMSSOptGuide.js
 * Player Mode: Great Weapon Master & Sharpshooter — when to use -5/+10
 * Pure JS — no React dependencies.
 */

export const GWM_RULES = {
  feat: 'Great Weapon Master',
  effects: [
    'Before attacking with a heavy melee weapon: -5 to hit, +10 to damage.',
    'On a critical hit or reducing a creature to 0 HP: make one melee attack as a bonus action.',
  ],
  weapons: 'Greatsword (2d6), Greataxe (1d12), Maul (2d6), Glaive/Halberd (1d10, reach).',
  note: 'The -5/+10 is optional. Decide per attack.',
};

export const SHARPSHOOTER_RULES = {
  feat: 'Sharpshooter',
  effects: [
    'Before attacking with a ranged weapon: -5 to hit, +10 to damage.',
    'Long range attacks don\'t have disadvantage.',
    'Ranged attacks ignore half and three-quarters cover.',
  ],
  weapons: 'Longbow, crossbows, darts — any ranged weapon.',
  note: 'Cover ignoring is often overlooked. Huge tactical advantage.',
};

export const WHEN_TO_USE_POWER_ATTACK = {
  useIt: [
    'You have advantage (Reckless Attack, Faerie Fire, prone target).',
    'Enemy AC is low (≤14). -5 barely affects hit chance.',
    'You have Archery Fighting Style (+2 offset).',
    'Bless is active (+1d4 averages +2.5 to hit).',
    'Precision Attack is available (Battle Master).',
    'Target has lots of HP (boss). +10 per hit adds up.',
    'You\'re fighting many weak enemies (GWM BA attack on kill).',
  ],
  dontUseIt: [
    'Enemy AC is high (≥18) and you don\'t have advantage.',
    'You NEED to hit this attack (finishing blow, concentration check trigger).',
    'Your attack bonus is low (below +5).',
    'You\'re fighting one enemy with moderate HP — missing costs more.',
  ],
};

export const POWER_ATTACK_MATH = [
  { attackBonus: '+5', targetAC: 14, normalHitChance: '60%', powerAttackHitChance: '35%', verdict: 'Don\'t use. Miss rate too high.' },
  { attackBonus: '+5', targetAC: 12, normalHitChance: '70%', powerAttackHitChance: '45%', verdict: 'Marginal. Use with advantage.' },
  { attackBonus: '+7', targetAC: 14, normalHitChance: '70%', powerAttackHitChance: '45%', verdict: 'Use with advantage. Skip without.' },
  { attackBonus: '+7', targetAC: 12, normalHitChance: '80%', powerAttackHitChance: '55%', verdict: 'Use it. Hit rate still decent.' },
  { attackBonus: '+9', targetAC: 14, normalHitChance: '80%', powerAttackHitChance: '55%', verdict: 'Use it. Solid DPR increase.' },
  { attackBonus: '+9', targetAC: 16, normalHitChance: '70%', powerAttackHitChance: '45%', verdict: 'Use with advantage only.' },
  { attackBonus: '+11', targetAC: 16, normalHitChance: '80%', powerAttackHitChance: '55%', verdict: 'Use it. Good hit rate.' },
  { attackBonus: '+11', targetAC: 18, normalHitChance: '70%', powerAttackHitChance: '45%', verdict: 'Only with advantage.' },
];

export const ACCURACY_OFFSETS = [
  { source: 'Advantage', bonus: '~+5 effective', note: 'Best offset. Reckless Attack, Faerie Fire, prone.' },
  { source: 'Archery Fighting Style', bonus: '+2', note: 'Sharpshooter builds get this automatically.' },
  { source: 'Bless', bonus: '+1d4 (~+2.5)', note: 'Party-wide. Excellent support for power attackers.' },
  { source: 'Precision Attack (Battle Master)', bonus: '+1d8 to +1d12', note: 'Add to the roll AFTER seeing it. Perfect for near-misses.' },
  { source: 'Bardic Inspiration', bonus: '+1d6 to +1d12', note: 'Same as Precision but from an ally.' },
  { source: 'Magic weapon (+1/+2/+3)', bonus: '+1 to +3', note: 'Stacks with everything. +3 weapon makes -5 trivial.' },
  { source: 'Elven Accuracy', bonus: '~+2.5 (with advantage)', note: 'Reroll 1 die. Even higher hit rate with -5.' },
];

export const GWM_SS_TIPS = [
  'With advantage, ALWAYS use -5/+10. The math overwhelmingly favors it.',
  'Without advantage, use it against AC ≤ (your attack bonus - 1).',
  'Archery Style (+2) makes Sharpshooter strictly better than GWM mathematically.',
  'Battle Master Precision Attack: roll attack → miss by 3 → add d8 → hit. Perfect synergy.',
  'GWM bonus action attack on kill is often overlooked. Chew through minions.',
  'PAM + GWM: more attacks = more +10 opportunities. Best melee DPR combo.',
  'CBE + SS: BA hand crossbow attack with +10. Best ranged DPR combo.',
  'Bless your GWM/SS users. +2.5 to hit translates directly to more +10 damage.',
  'At low levels (L1-4), -5 is brutal. Wait until your attack bonus is +6 or higher.',
  'These feats are THE reason martial classes keep up with casters in damage.',
];
