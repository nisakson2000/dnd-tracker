/**
 * playerArtifactOverviewGuide.js
 * Player Mode: Artifacts — the most powerful items in D&D 5e
 * Pure JS — no React dependencies.
 */

export const ARTIFACT_BASICS = {
  rarity: 'Artifact',
  attunement: 'Always required',
  destruction: 'Each artifact has a unique method of destruction. Can\'t be destroyed by normal means.',
  sentience: 'Many artifacts are sentient with their own personality, goals, and alignment.',
  note: 'Artifacts are campaign-defining items. Getting one changes the entire game.',
};

export const MAJOR_ARTIFACTS = [
  {
    name: 'Vorpal Sword',
    type: 'Weapon (any sword)',
    effect: '+3 sword. Nat 20 = decapitate (instant kill if head is required for life). Ignore slashing resistance.',
    note: 'Technically legendary, but artifact-tier power. Instant kill on crits.',
    rating: 'S',
  },
  {
    name: 'Staff of the Magi',
    type: 'Staff',
    effect: '+2 spell attacks, advantage on saves vs spells, absorb spell energy, 50 charges of spells.',
    note: 'THE wizard item. Absorb enemy spells. Retributive Strike: break staff for devastating explosion.',
    rating: 'S+',
  },
  {
    name: 'Book of Exalted Deeds',
    type: 'Wondrous',
    effect: '+2 WIS (max 24), Hallow at will, learn specific spells, Truesight.',
    note: 'Good-aligned only. Permanent WIS increase beyond 20.',
    rating: 'S',
  },
  {
    name: 'Book of Vile Darkness',
    type: 'Wondrous',
    effect: 'Dark lore, command undead, Dominate Monster, summon Nightwalker.',
    note: 'Evil-aligned. Corrupts the user. Campaign-villain material.',
    rating: 'S',
  },
  {
    name: 'Eye and Hand of Vecna',
    type: 'Wondrous',
    effect: 'Eye: Truesight, X-ray, Dominate. Hand: cold damage, disintegrate fingers. Together: more power.',
    note: 'Must gouge out your eye / cut off your hand to use. Legendary evil combo.',
    rating: 'S+',
  },
  {
    name: 'Deck of Many Things',
    type: 'Wondrous',
    effect: 'Draw cards for random effects: gain levels, magic items, wealth... or lose everything.',
    note: 'Campaign-ender. Can TPK or make everyone level 20. Pure chaos.',
    rating: 'S+ (chaotic)',
  },
  {
    name: 'Sword of Kas',
    type: 'Weapon (longsword)',
    effect: '+3, extra 2d10 vs undead, crit on 19-20, various per-day abilities.',
    note: 'The weapon made to destroy Vecna. Sentient, seeks to kill Vecna.',
    rating: 'S',
  },
  {
    name: 'Wand of Orcus',
    type: 'Wand',
    effect: '+3 focus, Command Undead at will, cast high-level necromancy, summon undead.',
    note: 'Orcus\'s personal wand. Corrupts the wielder. Insanely powerful for necromancers.',
    rating: 'S+',
  },
  {
    name: 'Orb of Dragonkind',
    type: 'Wondrous',
    effect: 'Call dragons, charm dragons, detect dragons. Makes you a dragon master.',
    note: 'Campaign-specific. Incredible in dragon-heavy campaigns.',
    rating: 'S (situational)',
  },
];

export const ARTIFACT_PROPERTIES = {
  note: 'Artifacts have random beneficial and detrimental properties rolled from DMG tables.',
  minorBeneficial: [
    'While attuned, wounds don\'t bleed.',
    'While attuned, you gain +1 AC.',
    'While attuned, you can speak one additional language.',
  ],
  majorBeneficial: [
    'While attuned, one ability score increases by 2 (max 24).',
    'While attuned, you regain 1d6 HP at dawn.',
    'While attuned, you can cast a L4 spell once per day.',
  ],
  minorDetrimental: [
    'While attuned, you give off a foul smell.',
    'While attuned, you must eat twice as much.',
    'While attuned, your appearance changes (cosmetic).',
  ],
  majorDetrimental: [
    'While attuned, you take 8d10 psychic damage if you break attunement.',
    'While attuned, your alignment may shift toward the artifact\'s alignment.',
    'While attuned, you can\'t attune to other magic items.',
  ],
};

export const ARTIFACT_TIPS = [
  'Artifacts are DM-placed intentionally. They reshape the campaign.',
  'Read ALL properties carefully — detrimental ones can be severe.',
  'Sentient artifacts may try to control you. Know the rules for sentient items.',
  'Destroying an artifact is often a quest in itself. The method is usually specific and difficult.',
  'Some artifacts corrupt their users over time. Roleplay this!',
  'If you find the Deck of Many Things: seriously consider NOT drawing.',
  'Discuss with your DM how artifacts fit in the campaign narrative.',
];
