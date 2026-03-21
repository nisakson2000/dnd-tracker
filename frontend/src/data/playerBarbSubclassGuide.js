/**
 * playerBarbSubclassGuide.js
 * Player Mode: All Barbarian subclasses (Primal Paths) ranked
 * Pure JS — no React dependencies.
 */

export const BARB_PATHS_RANKED = [
  {
    path: 'Totem Warrior (Bear)',
    rating: 'S+',
    role: 'Tank',
    keyFeatures: ['Bear L3: resistance to ALL damage except psychic while raging.', 'Eagle/Wolf/Elk options at L6, L14.', 'Can mix totems at each level.'],
    note: 'Best tank in the game. Effectively double HP against everything.',
  },
  {
    path: 'Zealot',
    rating: 'S',
    role: 'Damage/Unkillable',
    keyFeatures: ['Divine Fury L3: +1d6+half level radiant/necrotic on first hit.', 'Warrior of the Gods L3: free resurrection (no material cost).', 'Rage Beyond Death L14: can\'t die while raging.'],
    note: 'Free extra damage + can\'t die while raging. Free to resurrect.',
  },
  {
    path: 'Ancestral Guardian',
    rating: 'S',
    role: 'Tank/Support',
    keyFeatures: ['Ancestral Protectors L3: first hit → target has disadvantage attacking others + others resist.', 'Spirit Shield L6: reduce ally damage by 2d6.', 'Vengeful Ancestors L14: reflect reduced damage.'],
    note: 'Best aggro mechanic. Forces enemies to attack you.',
  },
  {
    path: 'Wild Magic',
    rating: 'A+',
    role: 'Chaotic/Versatile',
    keyFeatures: ['Wild Surge L3: random beneficial effect when raging.', 'Magic Awareness L3: detect magic.', 'Bolstering Magic L6: +1d3 to ally attacks/checks or restore spell slot.'],
    note: 'Random but most results are strong. Bolstering Magic supports casters.',
  },
  {
    path: 'Beast',
    rating: 'A+',
    role: 'Damage',
    keyFeatures: ['Form of the Beast L3: Bite (heal), Claws (extra attack), Tail (reaction +1d8 AC).', 'Bestial Soul L6: climb/swim/jump.', 'Call the Hunt L14: +1d6 to party.'],
    note: 'Claws = 3 attacks at L5. Best early melee damage.',
  },
  {
    path: 'Storm Herald',
    rating: 'A',
    role: 'Aura',
    keyFeatures: ['Desert: 2-6 fire aura.', 'Sea: 1d6 lightning reaction.', 'Tundra: 2-6 temp HP to allies.'],
    note: 'Aura effects are modest. Tundra is best for support.',
  },
  {
    path: 'Totem Warrior (Wolf)',
    rating: 'A+',
    role: 'Support',
    keyFeatures: ['Wolf L3: allies have advantage on melee attacks vs enemies within 5ft of you.'],
    note: 'Pack Tactics for your whole melee party. Amazing with Rogues.',
  },
  {
    path: 'Berserker',
    rating: 'B',
    role: 'Damage',
    keyFeatures: ['Frenzy L3: BA attack while raging. Exhaustion when rage ends.', 'Mindless Rage L6: immune to charm/frighten.', 'Retaliation L14: reaction attack when hit.'],
    note: 'Exhaustion penalty is brutal. Only Frenzy for boss fights.',
  },
];

export const BARB_PATH_TIPS = [
  'Bear Totem: resist ALL damage. Best tank. No question.',
  'Zealot: can\'t die while raging at L14. Free resurrections.',
  'Ancestral Guardian: best aggro. First hit forces enemy to ignore allies.',
  'Beast Claws: 3 attacks at L5. Best early Barbarian damage.',
  'Wolf Totem: party-wide advantage for melee allies. Rogue loves you.',
  'Berserker: Frenzy only for boss fights. Exhaustion is punishing.',
  'Wild Magic Bolstering: restore a caster\'s spell slot. Surprising support.',
  'Reckless Attack + GWM: every Barbarian\'s bread and butter.',
  'Danger Sense + Rage resistance: you\'re very hard to kill.',
  'All Barbarians are good. Even B-tier paths have Rage + Reckless.',
];
