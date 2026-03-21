/**
 * playerClockworkSoulSorcererGuide.js
 * Player Mode: Clockwork Soul Sorcerer — the order-magic controller
 * Pure JS — no React dependencies.
 */

export const CLOCKWORK_SOUL_BASICS = {
  class: 'Sorcerer (Clockwork Soul)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Order magic from Mechanus. Cancel advantage/disadvantage. Restore HP. Massive bonus spell list.',
  note: 'Best Sorcerer subclass. Gets 10 bonus spells (doubles known spells). Swappable for ANY Abjuration/Transmutation from Sorcerer/Wizard list. Bastion of Law absorbs damage.',
};

export const CLOCKWORK_SOUL_FEATURES = [
  { feature: 'Clockwork Magic', level: 1, effect: '10 bonus spells: Aid, Alarm, Lesser Restoration, Protection from Evil, Dispel Magic, etc. Can SWAP each for any Abjuration/Transmutation spell from Sorcerer or Wizard list.', note: 'This is why Clockwork is S-tier. You get 10 extra spells AND can customize them. Sorcerers usually know only 15 spells total — this doubles it.' },
  { feature: 'Restore Balance', level: 1, effect: 'Reaction within 60ft: cancel advantage or disadvantage on a roll. PB uses/LR.', note: 'Enemy has advantage? Cancel it. Ally has disadvantage? Cancel it. Free reaction, PB times/day. Incredibly versatile.' },
  { feature: 'Bastion of Law', level: 6, effect: 'Action: spend 1-5 sorcery points on a creature. They gain that many d8 as a ward. When they take damage, spend ward dice to reduce damage by amount rolled.', note: 'Pre-combat: 5 SP = 5d8 damage absorption (avg 22.5 HP). Basically a big temp HP shield. Lasts until long rest.' },
  { feature: 'Trance of Order', level: 14, effect: 'Bonus action: 1 minute. Attack rolls, ability checks, and saves: treat rolls below 10 as 10.', note: 'Minimum roll of 10 on everything for 1 minute. You literally cannot roll poorly. 1/LR or 7 SP.' },
  { feature: 'Clockwork Cavalcade', level: 18, effect: 'Action: 30ft cube. Restore 100 HP (divided as you choose). Repair damaged objects. End L6 or lower spells on targets.', note: '100 HP healing + mass dispel in a 30ft cube. Once per LR or 7 SP. Incredible capstone.' },
];

export const CLOCKWORK_SPELL_SWAPS = [
  { original: 'Alarm', swapTo: 'Shield', reason: 'Shield is essential for Sorcerers. +5 AC reaction. Always take this.', rating: 'S' },
  { original: 'Protection from Evil', swapTo: 'Absorb Elements', reason: 'Halve elemental damage. Better than Protection from Evil in most campaigns.', rating: 'S' },
  { original: 'Aid', swapTo: 'Web', reason: 'Web is the best L2 control spell. Restrained on failed save, difficult terrain.', rating: 'A' },
  { original: 'Dispel Magic', swapTo: 'Counterspell', reason: 'Counterspell is more impactful. Can keep Dispel Magic if you prefer.', rating: 'A' },
  { original: 'Freedom of Movement', swapTo: 'Polymorph', reason: 'Polymorph is incredibly versatile. Emergency HP, utility, combat.', rating: 'A' },
  { original: 'Wall of Force', swapTo: 'Keep Wall of Force', reason: 'Wall of Force is the best L5 spell in the game. Never swap this.', rating: 'S' },
];

export const CLOCKWORK_TACTICS = [
  { tactic: 'Pre-combat Bastion of Law', detail: 'Before fights: 5 SP on the frontliner = 5d8 damage ward. Absorbs avg 22.5 damage. Better than most healing.', rating: 'S' },
  { tactic: 'Restore Balance on enemy crits', detail: 'Enemy crits (advantage roll)? Cancel the advantage. They reroll normally. Might downgrade from crit to miss.', rating: 'S' },
  { tactic: 'Trance of Order + save-or-suck', detail: 'L14: minimum 10 on spell attack rolls and saves for 1 minute. Your save DCs effectively can\'t be beaten by low rolls.', rating: 'S' },
  { tactic: 'Double spell list', detail: 'With 10 bonus spells + 15 known = 25 spells. Nearly rivals a Wizard\'s prepared spells. Unheard of for a Sorcerer.', rating: 'S' },
  { tactic: 'Subtle Counterspell', detail: 'Subtle Spell + Counterspell: can\'t be countered back (no verbal/somatic to see). Guaranteed Counterspell.', rating: 'S' },
];

export function bastionOfLawAbsorption(sorceryPointsSpent) {
  return { dice: sorceryPointsSpent, avgAbsorption: sorceryPointsSpent * 4.5, maxAbsorption: sorceryPointsSpent * 8 };
}

export function restoreBalanceUses(proficiencyBonus) {
  return proficiencyBonus;
}
