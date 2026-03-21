/**
 * playerBardicSecretsGuide.js
 * Player Mode: Bard Magical Secrets — best spell steals at each tier
 * Pure JS — no React dependencies.
 */

export const MAGICAL_SECRETS_RULES = {
  feature: 'At L10 (L6 for Lore), L14, L18: learn 2 spells from ANY class list.',
  restriction: 'Must be a spell level you can cast.',
  note: 'Magical Secrets is the most powerful class feature in the game. ANY spell.',
};

export const LORE_BARD_L6_PICKS = [
  { spell: 'Counterspell', source: 'Wizard/Sorcerer', rating: 'S+', note: 'Bard adds Jack of All Trades to the Counterspell check. Best Counterspeller.' },
  { spell: 'Fireball', source: 'Wizard/Sorcerer', rating: 'S', note: 'AoE damage. Bard lacks damage spells. Fireball fills the gap.' },
  { spell: 'Aura of Vitality', source: 'Paladin', rating: 'A+', note: '2d6 healing as BA each round for 1 min = 20d6 total healing. Best out-of-combat heal.' },
  { spell: 'Spirit Guardians', source: 'Cleric', rating: 'S', note: '3d8 radiant AoE around you. Concentration. Amazing on a Swords/Valor Bard in melee.' },
  { spell: 'Haste', source: 'Wizard/Sorcerer', rating: 'A+', note: 'Double a martial\'s effectiveness. +2 AC, extra attack, doubled speed.' },
  { spell: 'Find Steed', source: 'Paladin', rating: 'A+', note: 'Permanent mount. Shares self-target spells. Great mobility.' },
];

export const BARD_L10_PICKS = [
  { spell: 'Counterspell', source: 'Wizard/Sorcerer', rating: 'S+', note: 'If you didn\'t take it at L6. Non-negotiable for any Bard.' },
  { spell: 'Wall of Force', source: 'Wizard', rating: 'S+', note: 'No save, no concentration-break. Splits encounters. Best wall spell.' },
  { spell: 'Find Greater Steed', source: 'Paladin', rating: 'S', note: 'Permanent flying mount (Pegasus). Shares self-target spells including Greater Invisibility.' },
  { spell: 'Steel Wind Strike', source: 'Ranger/Wizard', rating: 'A+', note: '6d10 force to up to 5 targets. Teleport to one. Great AoE.' },
  { spell: 'Swift Quiver', source: 'Ranger', rating: 'A (Valor/Swords)', note: '4 attacks per round with a bow. BA 2 attacks. Ranged Bard dream.' },
  { spell: 'Destructive Wave', source: 'Paladin', rating: 'A+', note: '5d6 thunder + 5d6 radiant + prone. AoE nova. No friendly fire (choose targets).' },
  { spell: 'Bigby\'s Hand', source: 'Wizard', rating: 'A+', note: 'Versatile: grapple, damage, push, interpose. BA to command.' },
  { spell: 'Animate Objects', source: 'Wizard/Sorcerer', rating: 'S', note: '10 tiny objects = 47 avg DPR. Best sustained damage summon.' },
];

export const BARD_L14_PICKS = [
  { spell: 'Simulacrum', source: 'Wizard', rating: 'S+', note: 'Copy of yourself (or ally). Half HP, all features. Broken.' },
  { spell: 'Forcecage', source: 'Wizard', rating: 'S+', note: 'No save, no concentration cage. Combine with AoE.' },
  { spell: 'Tenser\'s Transformation', source: 'Wizard', rating: 'A+ (Swords)', note: 'Martial powerhouse. Extra 2d12/hit, 50 temp HP. Swords Bard goes nuclear.' },
  { spell: 'Heal', source: 'Cleric/Druid', rating: 'A+', note: '70 HP heal + cure conditions. Emergency button.' },
];

export const BARD_L18_PICKS = [
  { spell: 'Wish', source: 'Wizard/Sorcerer', rating: 'S++', note: 'THE best spell. Any spell L8 or lower for free. Or wish for anything.' },
  { spell: 'Foresight', source: 'Wizard/Druid', rating: 'S+', note: 'Advantage on everything, 8 hours, no concentration.' },
  { spell: 'True Polymorph', source: 'Wizard', rating: 'S', note: 'Permanent transformation. Turn allies into dragons.' },
  { spell: 'Shapechange', source: 'Druid/Wizard', rating: 'S', note: 'Become any CR creature and keep your features. Concentration.' },
];

export const MAGICAL_SECRETS_TIPS = [
  'Counterspell is mandatory on every Bard. Jack of All Trades applies to the check.',
  'Lore Bard L6 Secrets: Counterspell + your choice (Fireball, Aura of Vitality, Spirit Guardians).',
  'Find Greater Steed: permanent Pegasus. Share Greater Invisibility with it. Invisible flying mount.',
  'Wall of Force: no save, no break. Split the encounter. Win.',
  'Don\'t pick spells the Wizard already has. Fill gaps in your party.',
  'Wish at L18: duplicate any L8 or lower spell. Or do literally anything (with risk).',
  'Swords/Valor Bard: martial spells (Swift Quiver, Tenser\'s) are amazing picks.',
  'Lore Bard: control/support spells since you\'re not in melee.',
];
