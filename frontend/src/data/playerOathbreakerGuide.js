/**
 * playerOathbreakerGuide.js
 * Player Mode: Oathbreaker Paladin subclass analysis (DMG villain class, player context)
 * Pure JS — no React dependencies.
 */

export const OATHBREAKER_BASICS = {
  class: 'Paladin (Oathbreaker) — DMG p. 97',
  note: 'DM permission required. Designed as a villain option. Incredibly powerful if allowed.',
  theme: 'Fallen paladin who has broken their sacred oath. Dark powers, undead synergy.',
  requirement: 'Must break your existing oath and embrace evil. DM adjudicates.',
};

export const OATHBREAKER_FEATURES = [
  { feature: 'Aura of Hate', level: 7, effect: 'You and fiends/undead within 10ft add your CHA mod to melee weapon damage.', note: 'CHA to damage STACKS with normal damage. Affects your undead minions too. Broken.' },
  { feature: 'Control Undead (CD)', level: 3, effect: 'Target undead ≤ your level makes WIS save or is controlled for 24 hours.', note: 'Grab an enemy undead permanently. Stack with Animate Dead.' },
  { feature: 'Dreadful Aspect (CD)', level: 3, effect: '30ft: all creatures WIS save or frightened for 1 minute.', note: 'AoE frighten. Disadvantage on attacks and can\'t approach you.' },
  { feature: 'Supernatural Resistance', level: 15, effect: 'Resistance to bludgeoning, piercing, slashing from nonmagical weapons.', note: 'Physical damage resistance without raging.' },
  { feature: 'Dread Lord', level: 20, effect: 'Aura of darkness 30ft. Frightened enemies take 4d10 psychic damage. Bonus action melee spell attack 3d10+CHA necrotic.', note: 'Capstone is terrifying. AoE fear + damage + bonus action attack.' },
];

export const OATHBREAKER_SPELLS = [
  { level: 1, spells: 'Hellish Rebuke, Inflict Wounds', note: 'Reaction damage + high single-target.' },
  { level: 2, spells: 'Crown of Madness, Darkness', note: 'Darkness combos with Devil\'s Sight (if multiclassed Warlock).' },
  { level: 3, spells: 'Animate Dead, Bestow Curse', note: 'Animate Dead + Aura of Hate = CHA-boosted skeleton army.' },
  { level: 4, spells: 'Blight, Confusion', note: 'Single-target necrotic + AoE control.' },
  { level: 5, spells: 'Contagion, Dominate Person', note: 'Dominate Person is incredibly powerful.' },
];

export const OATHBREAKER_COMBOS = [
  { combo: 'Animate Dead + Aura of Hate', detail: '8 skeletons, each adding +5 CHA to damage. 8 attacks at +5 extra damage = +40 damage/round.', rating: 'S' },
  { combo: 'Oathbreaker + Hexblade 1', detail: 'CHA to attacks (Hexblade) + CHA to damage (Aura of Hate) + CHA to saves (Aura of Protection). CHA stacking.', rating: 'S' },
  { combo: 'Dreadful Aspect + Spirit Shroud', detail: 'Frighten everyone, then extra 1d8 per hit vs frightened targets (can\'t approach = stuck in range).', rating: 'A' },
  { combo: 'Control Undead + powerful undead', detail: 'Control an enemy Wight, Mummy, Vampire Spawn. They serve you for 24 hours.', rating: 'A' },
];

export function auraOfHateDamage(chaMod, numberOfUndead, attacksPerUndead) {
  const minionBonus = chaMod * numberOfUndead * attacksPerUndead;
  const selfBonus = chaMod * 2; // Paladin's own attacks
  return minionBonus + selfBonus;
}

export function controlUndeadDC(palLevel, chaMod) {
  return 8 + Math.ceil(palLevel / 2) + chaMod; // Paladin spell save DC
}
