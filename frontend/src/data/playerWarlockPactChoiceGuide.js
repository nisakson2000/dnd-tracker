/**
 * playerWarlockPactChoiceGuide.js
 * Player Mode: Warlock Pact Boon comparison and optimization
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    pact: 'Pact of the Blade',
    level: 3,
    rating: 'S',
    benefit: 'Create any melee weapon. Counts as magical. Use CHA for attacks (Hexblade).',
    bestFor: 'Hexblade, melee Warlocks, gish builds.',
    keyInvocations: ['Thirsting Blade (Extra Attack)', 'Lifedrinker (+CHA necrotic)', 'Eldritch Smite (force + prone)', 'Improved Pact Weapon (+1, ranged option)'],
  },
  {
    pact: 'Pact of the Chain',
    level: 3,
    rating: 'S',
    benefit: 'Enhanced familiar: Imp, Pseudodragon, Quasit, or Sprite.',
    bestFor: 'Utility, scouting, EB-focused Warlocks.',
    keyInvocations: ['Investment of the Chain Master (BA command, save DC yours)', 'Voice of the Chain Master (see/speak through familiar, any distance)', 'Gift of the Ever-Living Ones (max healing dice near familiar)'],
  },
  {
    pact: 'Pact of the Tome',
    level: 3,
    rating: 'A+',
    benefit: 'Book of Shadows: 3 cantrips from ANY class list.',
    bestFor: 'Utility casters, ritual casting, cantrip variety.',
    keyInvocations: ['Book of Ancient Secrets (ritual casting from any list)', 'Aspect of the Moon (no sleep needed)', 'Far Scribe (send messages to willing creatures)'],
  },
  {
    pact: 'Pact of the Talisman',
    level: 3,
    rating: 'B+',
    benefit: 'Talisman: +1d4 to failed ability checks.',
    bestFor: 'Support/utility Warlocks. Can give to allies.',
    keyInvocations: ['Rebuke of the Talisman (push attacker 10ft)', 'Protection of the Talisman (+1d4 to failed saves)', 'Bond of the Talisman (teleport to each other)'],
  },
];

export const PACT_COMPARISON = {
  damage: 'Blade > Chain > Tome > Talisman',
  utility: 'Tome > Chain > Talisman > Blade',
  scouting: 'Chain > Tome > Talisman > Blade',
  tanking: 'Blade > Chain (Gift of Ever-Living) > others',
  support: 'Chain = Talisman > Tome > Blade',
};

export const BEST_CHAIN_FAMILIARS = [
  { familiar: 'Imp', rating: 'S', why: 'Invisibility. Fly 40ft. Resistance to nonmagical. Shapechange (rat/raven/spider). Poison sting.' },
  { familiar: 'Quasit', rating: 'A', why: 'Invisibility. Shapechange (bat/centipede/toad). Scare (1/day). Poison claws.' },
  { familiar: 'Pseudodragon', rating: 'A', why: 'Magic Resistance (advantage on saves). Sting: sleep poison. Telepathy 100ft.' },
  { familiar: 'Sprite', rating: 'B+', why: 'Invisibility. Heart Sight (detect alignment). Poison: unconscious on failed save.' },
];

export const PACT_BOON_TIPS = [
  'Hexblade + Blade: CHA to attack + smite + Extra Attack. Best gish.',
  'Chain + Investment of Chain Master: BA Imp attack with YOUR save DC.',
  'Tome + Book of Ancient Secrets: ritual cast any spell. Huge utility.',
  'Imp familiar: invisible scout. See through its eyes at any range.',
  'Blade Invocations: Thirsting (Extra Attack) + Lifedrinker (+CHA damage).',
  'Eldritch Smite: force damage + auto-prone. No save.',
  'Improved Pact Weapon: +1 weapon, can be ranged (bow/crossbow).',
  'Chain familiar can deliver touch spells. Invisible Imp + Vampiric Touch.',
  'Tome: grab Guidance, Shillelagh, and any other missing cantrip.',
  'Talisman: give to the party member who fails checks most.',
];
