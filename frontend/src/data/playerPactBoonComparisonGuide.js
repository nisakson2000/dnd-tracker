/**
 * playerPactBoonComparisonGuide.js
 * Player Mode: Warlock Pact Boon comparison — Tome vs Chain vs Blade vs Talisman
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    boon: 'Pact of the Tome',
    level: 3,
    rating: 'S+',
    feature: 'Book of Shadows: choose 3 cantrips from ANY class list.',
    keyInvocations: [
      { name: 'Book of Ancient Secrets', effect: 'Learn ritual spells from ANY class. The best invocation in the game.', rating: 'S+' },
      { name: 'Far Scribe', effect: 'Send message to willing creatures who signed your book. Unlimited range.', rating: 'A' },
      { name: 'Gift of the Protectors', effect: 'PB creatures signed in book: drop to 1 HP instead of 0, 1/LR each.', rating: 'S' },
    ],
    strengths: [
      'Access to ANY cantrip (Guidance, Shillelagh, etc.)',
      'Book of Ancient Secrets = ritual casting from ALL classes.',
      'Most versatile pact. Turns Warlock into utility powerhouse.',
      'Gift of the Protectors is party-wide death save insurance.',
    ],
    weaknesses: [
      'No combat boost.',
      'Requires invocations to unlock full potential.',
    ],
    bestFor: 'Utility Warlocks, Celestial Warlocks, any Warlock wanting ritual casting.',
    verdict: 'Best overall pact. Book of Ancient Secrets alone makes it S+.',
  },
  {
    boon: 'Pact of the Chain',
    level: 3,
    rating: 'S',
    feature: 'Find Familiar with special forms: Imp, Quasit, Pseudodragon, Sprite.',
    keyInvocations: [
      { name: 'Investment of the Chain Master', effect: 'Command familiar as BA. Familiar uses YOUR spell save DC. Flying familiar = flying attack.', rating: 'S+' },
      { name: 'Voice of the Chain Master', effect: 'Communicate through and perceive through familiar at ANY distance on same plane.', rating: 'A+' },
      { name: 'Chains of Carceri', effect: 'At-will Hold Monster on celestials/fiends/elementals. Once per creature per LR.', rating: 'A' },
    ],
    strengths: [
      'Imp: invisible at will. Best scout in the game.',
      'Investment of the Chain Master: BA attack with your DC. Actual damage.',
      'Deliver touch spells at range through familiar.',
      'Pseudo-dragon: Magic Resistance shared.',
    ],
    weaknesses: [
      'Without Investment of the Chain Master, combat contribution is limited.',
      'Familiar has low HP. Can die easily.',
    ],
    bestFor: 'Scout-focused Warlocks, combat Warlocks wanting BA attack, support Warlocks.',
    verdict: 'Incredible scouting + combat with Investment of the Chain Master.',
  },
  {
    boon: 'Pact of the Blade',
    level: 3,
    rating: 'A+',
    feature: 'Create pact weapon (any melee). Bond to magic weapon. Use CHA for attacks (Hexblade).',
    keyInvocations: [
      { name: 'Thirsting Blade', effect: 'Extra Attack with pact weapon.', rating: 'S (mandatory)' },
      { name: 'Lifedrinker', effect: 'Add CHA to pact weapon damage.', rating: 'S' },
      { name: 'Eldritch Smite', effect: 'Expend slot: +1d8 per slot level + prone (no save). Force damage.', rating: 'S+' },
      { name: 'Improved Pact Weapon', effect: '+1 weapon. Can be ranged. Use as focus.', rating: 'A+' },
    ],
    strengths: [
      'Melee Warlock. Eldritch Smite = massive burst.',
      'Hexblade synergy: CHA attacks, medium armor, shields.',
      'Can bond to any magic weapon found.',
      'Improved Pact Weapon: +1 bow for ranged Bladelock.',
    ],
    weaknesses: [
      'Requires 3-4 invocations to function well.',
      'Invocation-hungry: Thirsting Blade + Lifedrinker + Eldritch Smite = 3 invocations.',
      'Without Hexblade, MAD (needs STR/DEX + CHA + CON).',
    ],
    bestFor: 'Hexblade melee builds, Paladin multiclass, gish Warlocks.',
    verdict: 'Best for melee but costs the most invocations. Hexblade required.',
  },
  {
    boon: 'Pact of the Talisman',
    level: 3,
    rating: 'B+',
    feature: 'Talisman: wearer adds 1d4 to failed ability checks (PB/LR).',
    keyInvocations: [
      { name: 'Rebuke of the Talisman', effect: 'When wearer hit: deal PB psychic + push 10ft. Reaction.', rating: 'A' },
      { name: 'Protection of the Talisman', effect: 'Add 1d4 to failed saving throws (PB/LR).', rating: 'A+' },
      { name: 'Bond of the Talisman', effect: 'Teleport to talisman wearer (or them to you). PB/LR.', rating: 'A' },
    ],
    strengths: [
      'Can give talisman to an ally — they benefit.',
      'Protection of the Talisman: +1d4 to saves is very strong.',
      'Doesn\'t require invocations to be useful (but benefits from them).',
      'Bond of the Talisman: team teleportation utility.',
    ],
    weaknesses: [
      'Weakest baseline feature (1d4 to ability checks only).',
      'Invocation upgrades are good but not as impactful as other pacts.',
      'Released in Tasha\'s — less tested, fewer optimization resources.',
    ],
    bestFor: 'Support Warlocks, team-oriented play, Celestial Warlocks.',
    verdict: 'Decent but outclassed. Good for support-focused builds only.',
  },
];

export const PACT_BOON_SELECTION_GUIDE = [
  { goal: 'Maximum versatility/utility', pick: 'Tome', reason: 'Ritual casting from all classes + any 3 cantrips.' },
  { goal: 'Best scouting/reconnaissance', pick: 'Chain', reason: 'Invisible Imp familiar. Unmatched scouting.' },
  { goal: 'Melee combat', pick: 'Blade', reason: 'Extra Attack + Eldritch Smite + Lifedrinker. Hexblade required.' },
  { goal: 'Party support', pick: 'Tome or Talisman', reason: 'Tome: Gift of Protectors. Talisman: share +1d4 to saves.' },
  { goal: 'Ranged damage', pick: 'Tome or Chain', reason: 'Eldritch Blast builds don\'t need Blade. Tome for utility, Chain for BA damage.' },
];

export const PACT_BOON_TIPS = [
  'Tome is the safest pick. Book of Ancient Secrets is game-changing.',
  'Chain with Investment of the Chain Master makes combat contribution significant.',
  'Blade requires Hexblade patron. Without it, you\'re too MAD.',
  'Talisman is underrated for support. Protection of the Talisman is very strong.',
  'If you\'re Eldritch Blast focused, you DON\'T need Blade. Take Tome or Chain.',
  'Blade costs 3+ invocations. Make sure the melee payoff is worth it.',
  'Tome lets you grab Guidance (Cleric cantrip). +1d4 to skill checks is huge.',
];
