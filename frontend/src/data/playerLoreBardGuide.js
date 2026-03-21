/**
 * playerLoreBardGuide.js
 * Player Mode: College of Lore Bard optimization
 * Pure JS — no React dependencies.
 */

export const LORE_BARD_BASICS = {
  class: 'Bard (College of Lore)',
  theme: 'The ultimate support/control caster. Steals spells from other classes.',
  note: 'Widely considered the strongest Bard subclass and one of the best support builds in the game.',
};

export const LORE_FEATURES = [
  { feature: 'Bonus Proficiencies', level: 3, effect: '3 extra skill proficiencies.', note: 'Bard already has 3 + Jack of All Trades. Now you\'re proficient in nearly everything.' },
  { feature: 'Cutting Words', level: 3, effect: 'Reaction: subtract Bardic Inspiration die from enemy attack, check, or damage roll.', note: 'REACTION tax. Enemy rolls high? Subtract 1d8. Can turn hits into misses.' },
  { feature: 'Additional Magical Secrets', level: 6, effect: 'Learn 2 spells from ANY class list.', note: 'Other Bards wait until L10. You get it at L6. Game-changing.' },
  { feature: 'Peerless Skill', level: 14, effect: 'Add Bardic Inspiration to your own ability checks.', note: 'Self-boost. Jack of All Trades + Expertise + Inspiration = dominate every check.' },
];

export const MAGICAL_SECRETS_PICKS = {
  level6: [
    { spell: 'Counterspell', source: 'Wizard', note: 'Bard adds Jack of All Trades to the check. Best Counterspeller in the game.' },
    { spell: 'Fireball', source: 'Wizard', note: 'Bards lack AoE damage. Fireball solves that.' },
    { spell: 'Aura of Vitality', source: 'Paladin', note: '2d6 healing/round as bonus action for 1 minute. 20d6 total healing.' },
    { spell: 'Spirit Guardians', source: 'Cleric', note: '3d8/turn AoE. Bard gets a melee option.' },
    { spell: 'Haste', source: 'Wizard', note: 'Buff your Fighter. Or Twin it if multiclassed Sorcerer.' },
    { spell: 'Revivify', source: 'Cleric', note: 'Raise dead party members. Life insurance.' },
  ],
  level10: [
    { spell: 'Find Greater Steed', source: 'Paladin', note: 'Flying mount. Share self-spells. Only normally Paladin L13+.' },
    { spell: 'Destructive Wave', source: 'Paladin', note: '5d6 thunder + 5d6 radiant AoE. 30ft radius. No friendly fire (choose creatures).' },
    { spell: 'Wall of Force', source: 'Wizard', note: 'Indestructible wall. Split encounters. No save, no check.' },
    { spell: 'Animate Objects', source: 'Wizard', note: '10 tiny objects: +8, 1d4+4 each. Absurd DPR.' },
    { spell: 'Swift Quiver', source: 'Ranger', note: '4 attacks/turn with a bow. Normally Ranger-only.' },
  ],
};

export const CUTTING_WORDS_USAGE = [
  { situation: 'Enemy barely hits', action: 'Subtract die from attack. Turn hit into miss.', priority: 'High' },
  { situation: 'Enemy rolls high on save vs your spell', action: 'Subtract die from save. Spells like Hypnotic Pattern become near-guaranteed.', priority: 'High' },
  { situation: 'Enemy deals big damage', action: 'Subtract die from damage. Less impactful than preventing the hit.', priority: 'Medium' },
  { situation: 'Enemy grapple/shove check', action: 'Subtract die from their Athletics. Help an ally escape.', priority: 'Medium' },
];

export const BARD_SPELL_PRIORITY = [
  { level: 1, picks: 'Healing Word, Faerie Fire, Dissonant Whispers, Silvery Barbs' },
  { level: 2, picks: 'Hold Person, Suggestion, Invisibility, Silence' },
  { level: 3, picks: 'Hypnotic Pattern, Fear, Dispel Magic' },
  { level: 4, picks: 'Polymorph, Greater Invisibility, Dimension Door' },
  { level: 5, picks: 'Synaptic Static, Hold Monster, Animate Objects (Secrets)' },
];

export function cuttingWordsAvg(bardLevel) {
  if (bardLevel >= 15) return 6.5; // d12
  if (bardLevel >= 10) return 5.5; // d10
  if (bardLevel >= 5) return 4.5; // d8
  return 3.5; // d6
}

export function jackOfAllTradesCounterspell(profBonus, targetSpellLevel) {
  const jot = Math.floor(profBonus / 2);
  const dc = 10 + targetSpellLevel;
  const bonus = jot; // Ability check, so JoAT applies
  return { dc, bonus, successChance: Math.min(100, Math.max(5, (21 - (dc - bonus)) * 5)) };
}
