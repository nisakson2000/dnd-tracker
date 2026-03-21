/**
 * playerHighLevelPlay.js
 * Player Mode: Tier 3-4 play (levels 11-20) — scaling challenges and strategies
 * Pure JS — no React dependencies.
 */

export const TIER_3_CHANGES = {
  levels: '11-16',
  name: 'Masters of the Realm',
  keyChanges: [
    'Casters get 6th-7th level spells (game-changing power)',
    'Fighter gets 3rd attack (Extra Attack improvement)',
    'Enemies have Legendary Actions and Resistances',
    'Teleportation becomes common (Teleport, Plane Shift)',
    'Save-or-die effects become real threats',
    'Magic items of Rare+ rarity expected',
  ],
  combatShift: 'Single-round kills become possible. Rocket tag: who acts first wins.',
};

export const TIER_4_CHANGES = {
  levels: '17-20',
  name: 'Masters of the World',
  keyChanges: [
    'Casters get 8th-9th level spells (Wish, Meteor Swarm, True Polymorph)',
    'Fighter gets 4th attack + 2 Action Surges',
    'Subclass capstones kick in',
    'Enemies include demon lords, archdevils, ancient dragons',
    'Players can reshape reality (Wish, True Polymorph, Gate)',
    'Very few published adventures reach this tier',
  ],
  combatShift: 'Encounters are set-piece battles. Every fight could be legendary.',
};

export const HIGH_LEVEL_PRIORITIES = [
  { priority: 'Counterspell coverage', detail: 'At least 2 party members should have Counterspell. Counter their Counterspell of your Counterspell.', tier: 3 },
  { priority: 'Teleportation escape plan', detail: 'Always have Teleport, Plane Shift, or Word of Recall prepared. Never be trapped.', tier: 3 },
  { priority: 'Death prevention', detail: 'Death Ward, Clone, Contingency. At this level, death is a tactical setback, not the end.', tier: 3 },
  { priority: 'Scrying defense', detail: 'Mind Blank, Nondetection, Amulet of Proof Against Detection. Enemies scry on you.', tier: 3 },
  { priority: 'Wish spell usage', detail: 'Never use Wish for anything except duplicating spells (unless desperate). 33% chance to lose it forever.', tier: 4 },
  { priority: 'True Polymorph planning', detail: 'Turn yourself into an Ancient Brass Dragon permanently. Or turn enemies into snails.', tier: 4 },
  { priority: 'Simulacrum management', detail: 'A Simulacrum of yourself is a second you. It has all your spells. Insane action economy.', tier: 4 },
];

export const HIGH_LEVEL_THREATS = [
  { threat: 'Power Word Kill', level: 9, counter: 'Keep HP above 100 at all times. Counterspell.' },
  { threat: 'Meteor Swarm', level: 9, counter: 'Spread out. Fire resistance. 140 avg damage.' },
  { threat: 'Prismatic Wall', level: 9, counter: 'Don\'t touch it. Each layer is a different save. Dispel each layer (DC 19).' },
  { threat: 'Gate', level: 9, counter: 'Enemy can summon anything, including demon lords. Be prepared for anything.' },
  { threat: 'Wish (enemy)', level: 9, counter: 'Counterspell is the only answer. Or die.' },
  { threat: 'Ancient Dragon breath', level: 'N/A', counter: 'Element resistance. Evasion. Absorb Elements. 26d6+ damage.' },
];

export const CLONE_INSURANCE = {
  spell: 'Clone (8th level)',
  effect: 'Create a clone of yourself. If you die, your soul enters the clone. You live again.',
  cost: '1,000 gp diamond + 1 cubic inch of your flesh.',
  time: '120 days to mature.',
  note: 'Cast this as soon as you can. Multiple clones = multiple lives. Hide them well.',
  strategy: 'Cast Clone on yourself AND key party members. Death becomes a minor inconvenience.',
};

export function isRocketTag(partyLevel) {
  return partyLevel >= 11; // Tier 3+ = fights can end in 1-2 rounds
}

export function expectedEnemyCR(partyLevel, partySize) {
  // Rough guide for boss CR
  return Math.floor(partyLevel + (partySize - 4) * 0.5);
}
