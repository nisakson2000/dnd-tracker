/**
 * playerPaladinOptGuide.js
 * Player Mode: Paladin optimization — smites, auras, subclasses, builds
 * Pure JS — no React dependencies.
 */

export const PALADIN_CORE = {
  strengths: ['Divine Smite: burst radiant damage on hit.', 'Aura of Protection: +CHA to all saves, 10ft.', 'Lay on Hands: flexible healing pool.', 'Heavy armor + martial weapons + spells.'],
  weaknesses: ['MAD: needs STR + CHA + CON.', 'Half-caster: limited spell slots.', 'Aura requires proximity. Can\'t protect at range.', 'No ranged options without feats.'],
  stats: 'STR > CHA > CON. (DEX builds possible but suboptimal.)',
  key: 'Aura of Protection is the best feature in the game. Max CHA.',
};

export const DIVINE_SMITE_GUIDE = {
  baseDamage: '2d8 radiant (L1 slot). +1d8 per slot level above 1st.',
  maxSlot: '4th level slot = 5d8 radiant.',
  undeadBonus: '+1d8 vs undead and fiends.',
  critSmite: 'ALL smite dice are doubled on a crit. Wait for crits when possible.',
  rules: [
    'Declared AFTER you hit. No wasted slots on misses.',
    'Not a spell. Works while concentrating on another spell.',
    'Stacks with Improved Divine Smite (L11: +1d8 per hit).',
    'Uses spell slots. Budget carefully.',
  ],
  economy: [
    { advice: 'Don\'t smite every hit. Save slots for critical hits.', priority: 'High' },
    { advice: 'L1 slots: 2d8 = average 9. Solid but save for crits.', priority: 'Medium' },
    { advice: 'L2 slots on crits: 6d8 = average 27. Worth it.', priority: 'High' },
    { advice: 'L3+ slots on crits: devastating. 8d8+ = encounter-changing.', priority: 'High' },
  ],
};

export const AURA_OF_PROTECTION = {
  what: '+CHA modifier to ALL saving throws for you and allies within 10ft (30ft at L18).',
  why: 'Best feature in the game. +5 to all saves for your party.',
  optimization: [
    'Max CHA as soon as possible. +5 CHA = +5 to all saves for everyone.',
    'Position centrally. Cover as many allies as possible.',
    'Ring of Protection, Cloak of Protection: stack with the aura.',
    'Bless (+1d4): stacks with Aura. Party becomes nearly immune to saves.',
  ],
  note: 'This single feature makes Paladin the best support in the game.',
};

export const SUBCLASS_RANKINGS = [
  { subclass: 'Devotion', rating: 'S', why: 'Sacred Weapon (+CHA to attacks). Holy Nimbus. Solid spell list.', note: 'Most well-rounded. Great for new players.' },
  { subclass: 'Vengeance', rating: 'S+', why: 'Vow of Enmity: BA advantage vs one target. Hunter\'s Mark. Haste at L9.', note: 'Best damage Paladin. Advantage guarantees smite hits.' },
  { subclass: 'Conquest', rating: 'S+', why: 'Armor of Agathys + Spiritual Weapon. Frightened + Aura = 0 speed.', note: 'Frightened enemies can\'t move near you. Total lockdown.' },
  { subclass: 'Watchers', rating: 'A+', why: 'Extra initiative (+PB). Banishment. Anti-extraplanar.', note: 'Great in campaigns with fiends, fey, aberrations.' },
  { subclass: 'Ancients', rating: 'A+', why: 'Aura of Warding: resistance to spell damage for party. Misty Step.', note: 'Anti-caster Paladin. Spell damage resistance is huge.' },
  { subclass: 'Glory', rating: 'A', why: 'Haste on self. Inspiring Smite: temp HP to allies.', note: 'Offensive support hybrid. Good mobility.' },
  { subclass: 'Redemption', rating: 'A', why: 'Rebuke the Violent: reflect damage. Sleep, Hold Person.', note: 'Pacifist Paladin. Great roleplay. Strong features.' },
  { subclass: 'Crown', rating: 'B+', why: 'Spirit Guardians at L9. Champion Challenge (compel attention).', note: 'Tank Paladin. SCAG-only.' },
  { subclass: 'Oathbreaker', rating: 'A+ (evil)', why: 'Aura: +CHA to damage for all melee (including undead). Animate Dead.', note: 'Evil Paladin. Aura benefits enemies too if not careful.' },
];

export const LAY_ON_HANDS_USAGE = {
  pool: '5 × Paladin level HP',
  uses: [
    { use: 'Pick up unconscious allies', hp: '1 HP', note: 'Just 1 HP from pool. Touch range. Like free Healing Word.' },
    { use: 'Cure disease', hp: '5 HP', note: '5 HP from pool to cure one disease.' },
    { use: 'Cure poison', hp: '5 HP', note: '5 HP from pool to neutralize one poison.' },
    { use: 'Heal between combats', hp: 'Variable', note: 'Top off allies during short rests.' },
    { use: 'Emergency self-heal', hp: 'Variable', note: 'Use on yourself when about to go down. Keeps you up.' },
  ],
  tips: [
    'Don\'t waste the full pool healing scratch damage. Use for KO pickups.',
    'Disease/poison cure costs only 5 HP. Very efficient.',
    '1 HP to pick up downed allies = your version of Healing Word.',
    'Save some pool for emergencies. Don\'t dump it all early.',
  ],
};

export const PALADIN_FEAT_PICKS = [
  { feat: 'Great Weapon Master', rating: 'S+', why: '-5/+10. Vow of Enmity (Vengeance) offsets -5. Massive damage.' },
  { feat: 'Polearm Master', rating: 'S', why: 'BA attack + OA on approach. More smite opportunities.' },
  { feat: 'Sentinel', rating: 'S', why: 'OA stops movement. Lock enemies near your aura.' },
  { feat: 'Resilient (CON)', rating: 'A+', why: 'Concentration saves. Maintain Bless, Shield of Faith.' },
  { feat: 'War Caster', rating: 'A+', why: 'Advantage on concentration. Cast with hands full.' },
  { feat: 'Lucky', rating: 'A', why: 'Reroll 3 times/LR. Save for crit fishing or save failures.' },
  { feat: 'Fey Touched', rating: 'A', why: '+1 CHA + Misty Step + L1 spell. Great half-feat.' },
];

export const PALADIN_BUILD_TIPS = [
  'Aura of Protection is your best feature. Max CHA ASAP.',
  'Don\'t smite every hit. Save slots for crits.',
  'Bless: best concentration spell. +1d4 to attacks AND saves.',
  'Vengeance: Vow of Enmity + GWM = huge damage.',
  'Conquest: Frightened + Aura = enemies can\'t move. Lockdown.',
  'Lay on Hands: 1 HP to pick up downed allies. Efficient.',
  'Position centrally for aura coverage. You\'re the party anchor.',
  'Multiclass: Sorcerer or Warlock for more smite slots.',
  'PAM + Sentinel: control the battlefield. More OA = more smites.',
  'Improved Divine Smite (L11): +1d8 radiant on EVERY hit. Free damage.',
];
