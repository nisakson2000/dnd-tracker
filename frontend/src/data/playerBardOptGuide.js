/**
 * playerBardOptGuide.js
 * Player Mode: Bard optimization — Inspiration, colleges, spell selection, builds
 * Pure JS — no React dependencies.
 */

export const BARD_CORE = {
  strengths: ['Jack of All Trades: +half PB to non-proficient checks.', 'Bardic Inspiration: d6-d12 to ally rolls.', 'Full caster with healing AND control.', 'Expertise in 4 skills. Best skill monkey.', 'Magical Secrets: steal spells from any list.'],
  weaknesses: ['d8 HD. Squishy.', 'Limited damage options without Magical Secrets.', 'Inspiration management is a resource.', 'Many features to track simultaneously.'],
  stats: 'CHA > DEX > CON (or CHA > CON > DEX for melee colleges).',
  key: 'Bard does everything well. Focus on control and support, not damage.',
};

export const BARDIC_INSPIRATION_GUIDE = {
  die: 'L1: d6. L5: d8. L10: d10. L15: d12.',
  recovery: 'L1: long rest. L5 (Font of Inspiration): short rest.',
  uses: 'CHA modifier per rest.',
  bestUses: [
    { use: 'Give to martial before their turn', note: 'Extra d6-d12 to attack roll. Helps land GWM/Sharpshooter.' },
    { use: 'Give to ally making crucial save', note: 'Add to saving throw. Prevent Hold Person, Banishment.' },
    { use: 'Give to skill monkey for important check', note: 'Stacks with Guidance. Big bonus to persuasion/stealth.' },
  ],
  tips: [
    'Don\'t hoard Inspiration. Use it every combat.',
    'At L5: recovers on short rest. Use freely.',
    'Give to allies who need it BEFORE their turn.',
    'Lore Bard: Cutting Words uses Inspiration die defensively.',
  ],
};

export const COLLEGE_RANKINGS = [
  { college: 'Lore', rating: 'S+', why: 'Cutting Words (reaction: subtract die from enemy roll). Extra Magical Secrets at L6. 3 extra skill proficiencies.', note: 'Best caster Bard. L6 Magical Secrets = get spells 4 levels early.' },
  { college: 'Eloquence', rating: 'S+', why: 'Unsettling Words: subtract Inspiration die from enemy save. Silver Tongue: minimum 10 on Persuasion/Deception.', note: 'Best debuffer. Reduce enemy saves then cast save-or-suck.' },
  { college: 'Creation', rating: 'A+', why: 'Animating Performance: animate Large object for attacks. Note of Potential: extra Inspiration effects.', note: 'Tasha\'s. Animated object adds action economy.' },
  { college: 'Glamour', rating: 'A+', why: 'Mantle of Inspiration: temp HP + free movement to allies. Enthralling Performance.', note: 'Support powerhouse. Temp HP + repositioning without OA.' },
  { college: 'Swords', rating: 'A', why: 'Extra Attack. Blade Flourishes: damage + effects. Medium armor.', note: 'Best melee Bard. Defensive Flourish: +die to AC and damage.' },
  { college: 'Valor', rating: 'A', why: 'Extra Attack. Medium armor + shields. Combat Inspiration.', note: 'Martial Bard. Less flashy than Swords but more defensive.' },
  { college: 'Whispers', rating: 'B+', why: 'Psychic Blades: extra psychic damage (like Sneak Attack). Steal identity.', note: 'Assassin Bard. Niche but flavorful. Better in social campaigns.' },
  { college: 'Spirits', rating: 'B+', why: 'Random spirit abilities. Spiritual Focus: +d6 to damage/healing.', note: 'Van Richten\'s. Random = inconsistent. Some results are great.' },
];

export const MAGICAL_SECRETS_PICKS = {
  level6Lore: [
    { spell: 'Counterspell', rating: 'S+', why: 'Negate enemy spells. Must-have. Jack of All Trades applies to the check.' },
    { spell: 'Fireball', rating: 'S', why: 'Bard lacks AoE damage. Fireball fills that hole.' },
    { spell: 'Haste', rating: 'S', why: 'Best single-target buff. +2 AC, extra attack, double speed.' },
    { spell: 'Spirit Guardians', rating: 'S', why: 'Best sustained damage spell. Move into enemies.' },
    { spell: 'Aura of Vitality', rating: 'A+', why: '20d6 healing over 1 minute. Best out-of-combat heal.' },
  ],
  level10: [
    { spell: 'Wall of Force', rating: 'S+', why: 'Indestructible wall. Split encounters.' },
    { spell: 'Animate Objects', rating: 'S+', why: '10 attacks/round. Best sustained DPR.' },
    { spell: 'Swift Quiver', rating: 'A+ (Swords/Valor)', why: '2 extra ranged attacks as BA. If you attack.' },
    { spell: 'Steel Wind Strike', rating: 'A+', why: '6d10 force to 5 targets + teleport.' },
    { spell: 'Find Greater Steed', rating: 'A+', why: 'Flying mount. Shares your targeting spells.' },
  ],
  level14: [
    { spell: 'Simulacrum', rating: 'S+', why: 'Clone yourself. Two of you = double everything.' },
    { spell: 'Wish', rating: 'S+', why: 'Most powerful spell in the game.' },
    { spell: 'Forcecage', rating: 'S+', why: 'No save. No HP. Trap anything.' },
  ],
};

export const BARD_COMBAT_STRATEGY = {
  round1: 'Control spell: Hypnotic Pattern, Fear, or Faerie Fire.',
  round2: 'Maintain concentration. Use Inspiration. Cantrip or secondary spell.',
  support: 'Healing Word to pick up downed allies. Never Cure Wounds.',
  face: 'Social encounters: Suggestion, Charm Person, Enhance Ability.',
  key: 'Control the encounter first. Support second. Damage is the martial\'s job.',
};

export const BARD_BUILD_TIPS = [
  'Lore Bard: best caster Bard. L6 Magical Secrets is incredible.',
  'Eloquence: best at making enemies fail saves. Unsettling Words.',
  'Counterspell: Jack of All Trades adds to the check. Take it.',
  'Use Bardic Inspiration every combat. Don\'t hoard it.',
  'At L5: Inspiration recovers on short rest. Use freely.',
  'Magical Secrets: steal the best spells from any class list.',
  'Healing Word over Cure Wounds. Always. BA ranged vs action melee.',
  'Hypnotic Pattern: your best L3 spell. Wins encounters alone.',
  'CHA > DEX > CON. Max CHA. You\'re the face AND the caster.',
  'Expertise: Persuasion + one other. You\'re the party face.',
];
