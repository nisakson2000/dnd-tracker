/**
 * playerWarlockPactGuide.js
 * Player Mode: Warlock pact boon and invocation guide
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    pact: 'Pact of the Blade',
    level: 3,
    benefit: 'Create any melee weapon. Bond with a magic weapon. Use CHA for attacks (Hexblade).',
    playstyle: 'Melee combat warlock.',
    bestPatron: 'Hexblade (CHA attacks, medium armor, shields, crit on 19-20).',
    keyInvocations: ['Thirsting Blade (Extra Attack)', 'Lifedrinker (+CHA necrotic damage)', 'Eldritch Smite (knockback + prone)'],
  },
  {
    pact: 'Pact of the Chain',
    level: 3,
    benefit: 'Improved familiar: Imp, Pseudodragon, Quasit, or Sprite.',
    playstyle: 'Scout, utility, and support.',
    bestPatron: 'Any — Chain is universally good.',
    keyInvocations: ['Investment of the Chain Master (bonus action command, save DC = yours)', 'Voice of the Chain Master (see/hear through familiar, any distance)'],
  },
  {
    pact: 'Pact of the Tome',
    level: 3,
    benefit: '3 cantrips from ANY class list. Can get Guidance, Shillelagh, etc.',
    playstyle: 'Versatile caster with broad spell access.',
    bestPatron: 'Any — Tome is universally good.',
    keyInvocations: ['Book of Ancient Secrets (ritual casting from any list!)', 'Far Scribe (send messages to contacts)'],
  },
  {
    pact: 'Pact of the Talisman',
    level: 3,
    benefit: '+1d4 to failed ability checks. Wearer can be anyone.',
    playstyle: 'Support / team player.',
    bestPatron: 'Genie (for Genie\'s Vessel combo).',
    keyInvocations: ['Rebuke of the Talisman (damage attacker when wearer hit)', 'Protection of the Talisman (add d4 to failed saves)'],
  },
];

export const TOP_INVOCATIONS = [
  { name: 'Agonizing Blast', prerequisite: 'Eldritch Blast', tier: 'S', effect: '+CHA mod to each Eldritch Blast beam. Core damage invocation.' },
  { name: 'Repelling Blast', prerequisite: 'Eldritch Blast', tier: 'S', effect: 'Push target 10ft per beam. Incredible control (push into hazards, off cliffs).' },
  { name: 'Devil\'s Sight', prerequisite: 'None', tier: 'S', effect: 'See normally in magical and nonmagical darkness to 120ft. Darkness + Devil\'s Sight combo.' },
  { name: 'Thirsting Blade', prerequisite: 'Pact of the Blade, 5th', tier: 'S', effect: 'Extra Attack with pact weapon. Required for Blade pact.' },
  { name: 'Book of Ancient Secrets', prerequisite: 'Pact of the Tome', tier: 'S', effect: 'Ritual cast any class\'s ritual spells. Insane utility.' },
  { name: 'Lifedrinker', prerequisite: 'Pact of the Blade, 12th', tier: 'A', effect: '+CHA necrotic damage on pact weapon hits.' },
  { name: 'Eldritch Smite', prerequisite: 'Pact of the Blade, 5th', tier: 'A', effect: 'Spend slot: +1d8 per slot level force damage + prone (huge creature or smaller).' },
  { name: 'Mask of Many Faces', prerequisite: 'None', tier: 'A', effect: 'At-will Disguise Self. Infinite infiltration.' },
  { name: 'Misty Visions', prerequisite: 'None', tier: 'A', effect: 'At-will Silent Image. Infinite illusions.' },
  { name: 'Sculptor of Flesh', prerequisite: '7th level', tier: 'B', effect: 'Cast Polymorph once per long rest. Turn into Giant Ape.' },
];

export const WARLOCK_SLOT_MANAGEMENT = {
  slots: 'Only 1-4 Pact Magic slots. They recharge on SHORT REST.',
  level: 'All slots are always your highest level (up to 5th).',
  strategy: 'Spam Eldritch Blast. Save slots for clutch moments.',
  shortRests: 'Push for short rests whenever possible. Your slots come back!',
  tips: [
    'EB + Agonizing Blast is your bread and butter. Free damage.',
    'Only use slots for high-impact spells (Hold Person, Counterspell, Summon).',
    'Hex is good but concentration — evaluate if it\'s worth maintaining.',
    'Short rest after every 1-2 encounters if possible.',
    'At high levels, Mystic Arcanum gives 1/day of 6th-9th level spells.',
  ],
};

export function getPactInfo(pactName) {
  return PACT_BOONS.find(p => p.pact.toLowerCase().includes((pactName || '').toLowerCase())) || null;
}

export function getInvocationsByTier(tier) {
  return TOP_INVOCATIONS.filter(i => i.tier === tier);
}
