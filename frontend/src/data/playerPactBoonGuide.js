/**
 * playerPactBoonGuide.js
 * Player Mode: Warlock Pact Boons ranked — Chain, Blade, Tome, Talisman
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    pact: 'Pact of the Chain',
    rating: 'S',
    get: 'Improved Find Familiar: Imp, Pseudodragon, Quasit, Sprite.',
    bestInvocations: ['Gift of the Ever-Living Ones (max healing dice)', 'Investment of the Chain Master (BA command, spell DC, fly)'],
    bestFor: 'Support, scouting, utility. Investment of Chain Master makes it combat-viable.',
    note: 'Invisible Imp: best scout in the game. Gift: max healing.',
  },
  {
    pact: 'Pact of the Blade',
    rating: 'S+ (Hexblade)',
    get: 'Summon magic weapon. Extra Attack (L5 invocation). Two-handed weapons.',
    bestInvocations: ['Thirsting Blade (Extra Attack)', 'Lifedrinker (+CHA necrotic per hit)', 'Eldritch Smite (smite + prone)'],
    bestFor: 'Melee Warlock. Hexblade blade builds. Melee DPR.',
    note: 'Requires Thirsting Blade + Lifedrinker. Hexblade makes it SAD.',
  },
  {
    pact: 'Pact of the Tome',
    rating: 'S',
    get: 'Book of Shadows: 3 cantrips from ANY class list.',
    bestInvocations: ['Book of Ancient Secrets (ritual casting from any list)', 'Far Scribe (send messages)', 'Gift of the Protectors (death ward)'],
    bestFor: 'Utility, versatility, ritual casting. Best for non-Hexblade Warlocks.',
    note: 'Guidance + Shillelagh + any cantrip. Book of Ancient Secrets = ritual master.',
  },
  {
    pact: 'Pact of the Talisman',
    rating: 'A',
    get: 'Talisman: +1d4 to failed ability checks.',
    bestInvocations: ['Rebuke of the Talisman (damage + push on hit)', 'Protection of the Talisman (add 1d4 to saves)'],
    bestFor: 'Support. Give talisman to ally. Protection is great.',
    note: 'Weakest combat pact. Protection of the Talisman is the best part.',
  },
];

export const PACT_SELECTION = {
  hexbladeArcher: 'Pact of the Blade (Improved Pact Weapon for bow)',
  hexbladeMelee: 'Pact of the Blade (Thirsting Blade + Lifedrinker)',
  ebBlaster: 'Pact of the Tome (ritual casting + utility cantrips)',
  support: 'Pact of the Chain (invisible scout + max healing)',
  utility: 'Pact of the Tome (Book of Ancient Secrets = best ritual caster)',
};

export const PACT_TIPS = [
  'Hexblade: always Pact of the Blade. It\'s designed for it.',
  'Non-Hexblade: Tome or Chain. Both excellent.',
  'Book of Ancient Secrets: ritual cast ANY class\'s ritual spells.',
  'Gift of the Ever-Living Ones: ALL healing dice maximized near familiar.',
  'Investment of the Chain Master: BA command + spell save DC attacks.',
  'Tome cantrips: Guidance + Shillelagh + any. From ANY class list.',
  'Talisman: weakest combat but Protection of the Talisman is good.',
  'Blade requires 2 invocations minimum (Thirsting + Lifedrinker).',
  'Chain Imp: invisible, fly, deliver touch spells. Best familiar.',
  'Tome: Book of Ancient Secrets is the single best utility invocation.',
];
