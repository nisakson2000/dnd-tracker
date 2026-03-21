/**
 * playerWarlockPactBoonComparisonGuide.js
 * Player Mode: Warlock Pact Boon comparison — Blade vs Chain vs Tome vs Talisman
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    name: 'Pact of the Blade',
    level: 3,
    benefit: 'Create any melee weapon as your pact weapon. Use CHA for attack/damage. Can bond a magic weapon.',
    playstyle: 'Melee Warlock. Hexblade is the go-to patron.',
    rating: 'A',
    note: 'Requires Hexblade for CHA attacks. Without Hexblade, you need STR/DEX which is MAD.',
  },
  {
    name: 'Pact of the Chain',
    level: 3,
    benefit: 'Find Familiar with enhanced options: Imp, Pseudodragon, Quasit, Sprite.',
    playstyle: 'Utility/support Warlock. Invisible scout + Help action.',
    rating: 'S',
    note: 'Imp is invisible at will with Magic Resistance. Investment of the Chain Master makes it a combatant.',
  },
  {
    name: 'Pact of the Tome',
    level: 3,
    benefit: 'Book of Shadows: learn 3 cantrips from any class list.',
    playstyle: 'Utility caster. Grab Guidance, Shillelagh, Spare the Dying.',
    rating: 'S',
    note: 'Book of Ancient Secrets invocation = ritual casting from any list. Infinite free utility spells.',
  },
  {
    name: 'Pact of the Talisman',
    level: 3,
    benefit: 'Talisman: wearer adds 1d4 to failed ability checks. Can be given to allies.',
    playstyle: 'Support/skill Warlock. Share the talisman.',
    rating: 'B',
    note: 'Weakest pact boon. 1d4 to ability checks is niche. Invocations improve it but still trails others.',
  },
];

export const PACT_INVOCATIONS = {
  blade: [
    { name: 'Thirsting Blade', level: 5, effect: 'Extra Attack with pact weapon.', priority: 'Required' },
    { name: 'Lifedrinker', level: 12, effect: 'Add CHA mod necrotic damage to pact weapon attacks.', priority: 'Required' },
    { name: 'Eldritch Smite', level: 5, effect: 'Spend Warlock slot: 1d8 + 1d8/slot level force damage + prone (Huge or smaller).', priority: 'S-tier' },
    { name: 'Improved Pact Weapon', level: 1, effect: '+1 weapon, can be ranged, counts as focus.', priority: 'A-tier (early game)' },
  ],
  chain: [
    { name: 'Investment of the Chain Master', level: 1, effect: 'Familiar attacks use your spell attack/DC. BA to command attack. Can give fly/swim.', priority: 'Required' },
    { name: 'Voice of the Chain Master', level: 1, effect: 'Communicate telepathically with familiar. Perceive through its senses. No range limit.', priority: 'A-tier' },
    { name: 'Chains of Carceri', level: 15, effect: 'Cast Hold Monster at will on celestials/fiends/elementals (1/LR per creature).', priority: 'S-tier (late)' },
  ],
  tome: [
    { name: 'Book of Ancient Secrets', level: 1, effect: 'Ritual casting. Learn 2 rituals. Can copy any ritual spell into book.', priority: 'Required' },
    { name: 'Aspect of the Moon', level: 1, effect: 'No need to sleep. Can\'t be forced to sleep.', priority: 'B-tier (flavor)' },
    { name: 'Far Scribe', level: 5, effect: 'Names in book = Sending spell to them at will.', priority: 'A-tier' },
  ],
  talisman: [
    { name: 'Rebuke of the Talisman', level: 1, effect: 'When wearer hit: reaction to deal PB psychic damage + push 10ft.', priority: 'B-tier' },
    { name: 'Protection of the Talisman', level: 7, effect: 'Add 1d4 to failed saving throws (PB uses/LR).', priority: 'A-tier' },
    { name: 'Bond of the Talisman', level: 12, effect: 'Teleport to talisman wearer or vice versa (PB uses/LR).', priority: 'B-tier' },
  ],
};

export const PACT_RECOMMENDATION = {
  blaster: 'Tome. Grab Guidance + utility cantrips. Book of Ancient Secrets for free rituals. EB is your damage.',
  melee: 'Blade. Hexblade patron. Thirsting Blade + Eldritch Smite. CHA-based martial.',
  support: 'Chain. Invisible Imp scout. Investment of the Chain for BA attacks. Voice for unlimited range scouting.',
  utility: 'Tome. Book of Ancient Secrets turns you into a ritual caster. Most versatile pact boon.',
  newPlayer: 'Tome or Chain. Both are straightforward and powerful. Blade requires more build knowledge.',
};

export function pactWeaponDamage(chamod, weaponDie, hasLifedrinker) {
  const base = weaponDie / 2 + 0.5 + chamod;
  const lifedrinker = hasLifedrinker ? chamod : 0;
  const perHit = base + lifedrinker;
  return { perHit: Math.round(perHit), twoAttacks: Math.round(perHit * 2), note: `Pact weapon: ${Math.round(perHit)} per hit (${Math.round(perHit * 2)} with Thirsting Blade)` };
}
