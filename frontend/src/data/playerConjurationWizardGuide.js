/**
 * playerConjurationWizardGuide.js
 * Player Mode: School of Conjuration Wizard — summoner and teleporter
 * Pure JS — no React dependencies.
 */

export const CONJURATION_BASICS = {
  class: 'Wizard (School of Conjuration)',
  source: 'Player\'s Handbook',
  theme: 'Summoner and teleporter. Create objects, summon creatures, teleport across planes.',
  note: 'Minor Conjuration is creative, Benign Transposition is excellent, but overall weaker than top-tier Wizard subclasses.',
};

export const CONJURATION_FEATURES = [
  { feature: 'Minor Conjuration', level: 2, effect: 'Action: create a nonmagical object up to 3ft per side, up to 10 lbs. Lasts until you use this again, take damage, or 1 hour. Object is visibly magical.', note: 'Create: keys, coins, tools, rope, acid flasks (temporarily). Visibly magical limits deception use.' },
  { feature: 'Benign Transposition', level: 6, effect: 'Action: teleport 30ft to unoccupied space. OR swap places with a willing Small/Medium creature within 30ft. Recharges on long rest or when you cast a conjuration spell.', note: 'Free teleport, recharges when you cast conjuration spells (Misty Step, summons). Effectively unlimited.' },
  { feature: 'Focused Conjuration', level: 10, effect: 'Concentration on conjuration spells can\'t be broken by taking damage.', note: 'Unbreakable concentration on summons and conjuration spells. Summon creatures without fear of losing them to damage.' },
  { feature: 'Durable Summons', level: 14, effect: 'Conjured creatures gain 30 temporary HP.', note: '+30 temp HP on all summons. Makes them significantly tankier.' },
];

export const CONJURATION_TACTICS = [
  { tactic: 'Minor Conjuration utility', detail: 'Create: a key to fit a lock (if you\'ve seen it), acid flask (throw it, it poofs), manacles, caltrops, a mirror, a crowbar.', rating: 'A', note: 'Object is visibly magical and poofs after 1 hour or damage. But temporarily having any tool is great.' },
  { tactic: 'Benign Transposition + summon refresh', detail: 'Teleport 30ft. Cast Misty Step (conjuration). Benign Transposition recharges. Teleport again next turn.', rating: 'A', note: 'Conjuration spells recharge it. Misty Step, any Summon spell, Web (conjuration). Effectively unlimited teleports.' },
  { tactic: 'Unbreakable summons', detail: 'L10: concentration on summons can\'t break from damage. Only effects that specifically end concentration (or death) stop your summons.', rating: 'S', note: 'Summon Fiend/Elemental/Aberration and never worry about losing them to a stray hit.' },
  { tactic: 'Durable summon tanking', detail: 'L14: summons get +30 temp HP. Summon creatures already have decent HP. +30 makes them real tanks.', rating: 'A' },
  { tactic: 'Swap with ally', detail: 'Benign Transposition: swap places with an ally. Pull the squishy Sorcerer out of danger, putting yourself (with Shield/Mirror Image) in their place.', rating: 'A' },
];

export const CONJURATION_VS_NECROMANCY = {
  conjuration: { pros: ['Unbreakable concentration on summons', 'Free teleportation', 'Durable summons (+30 HP)', 'Minor Conjuration utility'], cons: ['Weaker early features', 'Minor Conjuration is limited', 'Durable Summons comes late'] },
  necromancy: { pros: ['Army of undead (Animate Dead)', 'Undead Thralls bonus', 'Inured to Undeath (resistance)', 'More damage-focused'], cons: ['Undead are squishy', 'Moral issues with undead', 'Slot-intensive to maintain army'] },
  verdict: 'Conjuration for quality summons. Necromancy for quantity (zombie army).',
};

export function durableSummonHP(baseHP) {
  return baseHP + 30; // +30 temp HP on summon
}

export function benignTranspositionRange() {
  return 30; // ft teleport
}
