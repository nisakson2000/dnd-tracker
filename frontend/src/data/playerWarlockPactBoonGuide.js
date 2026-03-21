/**
 * playerWarlockPactBoonGuide.js
 * Player Mode: Pact Boon options compared — Chain, Blade, Tome, Talisman
 * Pure JS — no React dependencies.
 */

export const PACT_BOON_BASICS = {
  concept: 'At L3, Warlocks choose a Pact Boon that defines their playstyle.',
  options: ['Pact of the Chain', 'Pact of the Blade', 'Pact of the Tome', 'Pact of the Talisman'],
  note: 'Each Pact has dedicated Eldritch Invocations that enhance it. Your Pact choice determines your build.',
};

export const PACT_OF_THE_CHAIN = {
  name: 'Pact of the Chain',
  effect: 'Learn Find Familiar with extra options: Imp, Pseudodragon, Quasit, or Sprite.',
  keyInvocations: [
    { name: 'Investment of the Chain Master', effect: 'Familiar attacks use your spell attack. Reaction: give resistance. Gains fly/swim.', rating: 'S' },
    { name: 'Gift of the Ever-Living Ones', effect: 'Max healing dice when familiar within 100ft.', rating: 'A' },
    { name: 'Voice of the Chain Master', effect: 'Communicate telepathically with familiar anywhere on same plane. Use its senses.', rating: 'B' },
  ],
  bestFamiliar: 'Imp (invisible at will, shapechanger, sting attack with poison, flyby)',
  rating: 'A',
  note: 'Imp scout is incredible. Invisible, flies, sees in darkness. Investment of Chain Master makes it combat-viable.',
};

export const PACT_OF_THE_BLADE = {
  name: 'Pact of the Blade',
  effect: 'Create a pact weapon from nothing. Can bond a magic weapon. Use as spellcasting focus.',
  keyInvocations: [
    { name: 'Thirsting Blade', effect: 'Extra Attack at L5.', rating: 'S (required)' },
    { name: 'Lifedrinker', effect: '+CHA necrotic damage per hit. L12 req.', rating: 'A' },
    { name: 'Eldritch Smite', effect: 'Spend slot: 1d8 per level + 1d8 force + prone. L5 req.', rating: 'A' },
    { name: 'Improved Pact Weapon', effect: '+1 to attack/damage. Can be bow/crossbow. Spellcasting focus.', rating: 'A' },
  ],
  bestWith: 'Hexblade patron (CHA to attacks). Without Hexblade, need STR or DEX.',
  rating: 'A (S with Hexblade)',
  note: 'Blade Pact + Hexblade = the Warlock martial build. Without Hexblade, it\'s MAD (Multiple Ability Dependent).',
};

export const PACT_OF_THE_TOME = {
  name: 'Pact of the Tome',
  effect: 'Book of Shadows: learn 3 cantrips from any class list.',
  keyInvocations: [
    { name: 'Book of Ancient Secrets', effect: 'Ritual casting from any class. Learn 2 rituals. Add more when found.', rating: 'S' },
    { name: 'Far Scribe', effect: 'Write names in book. Cast Sending to them at will.', rating: 'B' },
    { name: 'Gift of the Protectors', effect: 'Write names. When they drop to 0 HP, they go to 1 HP instead. Once per LR.', rating: 'A' },
  ],
  bestCantrips: ['Guidance (Cleric/Druid)', 'Shillelagh (Druid)', 'Spare the Dying (Cleric)', 'Thorn Whip (Druid)'],
  rating: 'S',
  note: 'Most versatile Pact. Any 3 cantrips + ritual casting = massive utility. Best for EB-focused Warlocks who want utility.',
};

export const PACT_OF_THE_TALISMAN = {
  name: 'Pact of the Talisman',
  effect: 'Talisman object: wearer adds 1d4 to failed ability checks. PB times per LR.',
  keyInvocations: [
    { name: 'Rebuke of the Talisman', effect: 'When wearer is hit, use reaction: attacker takes psychic damage + pushed 10ft.', rating: 'B' },
    { name: 'Protection of the Talisman', effect: 'Add 1d4 to failed saving throws. PB times/LR.', rating: 'A' },
    { name: 'Bond of the Talisman', effect: 'Teleport to talisman wearer as action. PB times/LR.', rating: 'B' },
  ],
  rating: 'B',
  note: 'Weakest Pact overall. +1d4 to checks is nice but doesn\'t define a build. Protection of the Talisman is good though.',
};

export const PACT_TIER_LIST = [
  { pact: 'Tome', rating: 'S', reason: 'Any cantrips + ritual casting. Best utility and versatility.' },
  { pact: 'Blade (with Hexblade)', rating: 'S', reason: 'Full martial + casting. Best damage Warlock.' },
  { pact: 'Chain', rating: 'A', reason: 'Invisible Imp scout + combat familiar. Great utility.' },
  { pact: 'Blade (without Hexblade)', rating: 'B', reason: 'MAD. Needs STR/DEX + CHA. Less efficient.' },
  { pact: 'Talisman', rating: 'B', reason: '+1d4 is modest. Protection of Talisman is the main draw.' },
];

export function talismanBonus() {
  return 2.5; // 1d4 average
}
