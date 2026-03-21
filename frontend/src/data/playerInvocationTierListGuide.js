/**
 * playerInvocationTierListGuide.js
 * Player Mode: Warlock Eldritch Invocation rankings — comprehensive tier list
 * Pure JS — no React dependencies.
 */

export const INVOCATION_TIERS = {
  sTier: [
    { name: 'Agonizing Blast', prereq: 'Eldritch Blast cantrip', effect: 'Add CHA mod to each EB beam damage.', note: 'Mandatory. EB without this is incomplete. +5 damage per beam.' },
    { name: 'Repelling Blast', prereq: 'Eldritch Blast cantrip', effect: 'Push target 10ft per beam hit.', note: 'No save. 40ft push at L17. Incredible control.' },
    { name: 'Devil\'s Sight', prereq: 'None', effect: 'See normally in magical and nonmagical darkness, 120ft.', note: 'Darkness + Devil\'s Sight = advantage on all attacks, enemies blinded.' },
    { name: 'Tomb of Levistus', prereq: 'L5', effect: 'Reaction: gain 10 temp HP per warlock level. Encased in ice.', note: 'Emergency survive button. 50 temp HP at L5. 100 at L10.' },
  ],
  aTier: [
    { name: 'Grasp of Hadar', prereq: 'Eldritch Blast cantrip', effect: 'Pull target 10ft toward you once per turn on EB hit.', note: 'Pull into hazards, off ledges, into melee range.' },
    { name: 'Lance of Lethargy', prereq: 'Eldritch Blast cantrip', effect: 'Reduce target speed by 10ft once per turn on EB hit.', note: 'Stacks with Repelling Blast for total movement denial.' },
    { name: 'Eldritch Smite', prereq: 'L5, Pact of the Blade', effect: 'Spend Pact slot for extra 1d8 per slot level + prone (large or smaller).', note: 'Auto-prone on hit. No save. Combos with Extra Attack.' },
    { name: 'Thirsting Blade', prereq: 'L5, Pact of the Blade', effect: 'Extra Attack with pact weapon.', note: 'Essential for Blade Pact. Without this, you\'re behind.' },
    { name: 'Lifedrinker', prereq: 'L12, Pact of the Blade', effect: 'Add CHA mod necrotic damage to pact weapon attacks.', note: 'Extra CHA damage on every hit. Blade Pact scales.' },
    { name: 'Gift of the Ever-Living Ones', prereq: 'Pact of the Chain', effect: 'Max all healing dice when familiar is within 100ft.', note: 'Healing Word always heals max. Potions heal max. Incredible.' },
    { name: 'Investment of the Chain Master', prereq: 'Pact of the Chain (Tasha\'s)', effect: 'Familiar attacks as bonus action, uses your DC, fly 40ft.', note: 'Makes Chain Pact competitive. Familiar becomes a real combatant.' },
    { name: 'Book of Ancient Secrets', prereq: 'Pact of the Tome', effect: 'Learn 2 ritual spells from any class. Can add more rituals found.', note: 'Ritual casting from any list. Incredible utility.' },
    { name: 'Mask of Many Faces', prereq: 'None', effect: 'At-will Disguise Self.', note: 'Infinite disguises. No slot cost. Social god.' },
  ],
  bTier: [
    { name: 'Misty Visions', prereq: 'None', effect: 'At-will Silent Image.', note: 'Infinite illusions. Creative uses unlimited.' },
    { name: 'Sculptor of Flesh', prereq: 'L7', effect: 'Cast Polymorph once per long rest using a spell slot.', note: 'Polymorph = giant ape (157 HP). Once per day.' },
    { name: 'Whispers of the Grave', prereq: 'L9', effect: 'At-will Speak with Dead.', note: 'Infinite dead interrogation. Investigation tool.' },
    { name: 'Ghostly Gaze', prereq: 'L7', effect: 'See through solid objects 30ft. 1 minute, concentration.', note: 'X-ray vision. See through walls. Once per rest.' },
    { name: 'Cloak of Flies', prereq: 'L5', effect: 'CHA damage in 5ft aura. Advantage on Intimidation.', note: 'Passive damage aura. Disadvantage on other CHA checks.' },
    { name: 'Maddening Hex', prereq: 'L5, Hex or warlock curse', effect: 'Bonus action: CHA psychic damage to cursed target and adjacent.', note: 'Free bonus action damage. Stacks with Hex.' },
    { name: 'Relentless Hex', prereq: 'L7, Hex or warlock curse', effect: 'Bonus action: teleport 30ft to cursed target.', note: 'Free teleport toward your hex target. Mobility.' },
  ],
  cTier: [
    { name: 'Armor of Shadows', prereq: 'None', effect: 'At-will Mage Armor (self).', note: 'AC 13 + DEX. Only useful without actual armor.' },
    { name: 'Beast Speech', prereq: 'None', effect: 'At-will Speak with Animals.', note: 'Fun RP. Niche combat use.' },
    { name: 'Fiendish Vigor', prereq: 'None', effect: 'At-will False Life (L1). 1d4+4 temp HP.', note: 'Spam before combat. 5-8 temp HP. Falls off fast.' },
    { name: 'Eyes of the Rune Keeper', prereq: 'None', effect: 'Read all writing.', note: 'Campaign-dependent. Great in lore-heavy games.' },
    { name: 'Eldritch Sight', prereq: 'None', effect: 'At-will Detect Magic.', note: 'Useful but many classes ritual cast this anyway.' },
  ],
};

export const INVOCATION_COMBOS = [
  { combo: 'Agonizing + Repelling Blast', effect: 'High damage + 10ft push per beam. Control + damage.', tier: 'S' },
  { combo: 'Devil\'s Sight + Darkness', effect: 'You see in Darkness. Enemies don\'t. Advantage + disadvantage.', tier: 'S' },
  { combo: 'Repelling + Grasp + Lance', effect: 'Push, pull, slow. Total EB movement control.', tier: 'S' },
  { combo: 'Eldritch Smite + Thirsting Blade', effect: 'Extra Attack + smite. Auto-prone. Blade Pact core.', tier: 'A+' },
  { combo: 'Gift of Ever-Living + Celestial Warlock', effect: 'Max healing dice. Celestial heal = always max.', tier: 'A+' },
  { combo: 'Book of Ancient Secrets + Tome', effect: 'Ritual caster from any list. Utility monster.', tier: 'A' },
];

export const INVOCATION_TIPS = [
  'Agonizing Blast is non-negotiable. Take it level 2.',
  'Devil\'s Sight + Darkness combo: incredibly strong but blinds allies too.',
  'Repelling Blast: free forced movement. Push into hazards, off cliffs.',
  'Blade Pact needs Thirsting Blade (L5) and Lifedrinker (L12).',
  'Chain Pact: Investment of the Chain Master (Tasha\'s) makes it top-tier.',
  'Tome Pact: Book of Ancient Secrets = ritual casting. Take immediately.',
  'Tomb of Levistus: emergency survival. 10 temp HP per level as reaction.',
  'Mask of Many Faces: at-will Disguise Self. Social encounters trivialized.',
  'You can swap one invocation each level. Experiment freely.',
  'At-will invocations are best at low levels. Scale down in value later.',
];
