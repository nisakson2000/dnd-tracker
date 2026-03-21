/**
 * playerWarlockInvocationsGuide.js
 * Player Mode: Eldritch Invocations ranked and analyzed
 * Pure JS — no React dependencies.
 */

export const INVOCATION_BASICS = {
  concept: 'Eldritch Invocations are customizable features Warlocks gain at L2. Gain 2 at L2, more at higher levels.',
  progression: [
    { level: 2, invocations: 2 },
    { level: 5, invocations: 3 },
    { level: 7, invocations: 4 },
    { level: 9, invocations: 5 },
    { level: 12, invocations: 6 },
    { level: 15, invocations: 7 },
    { level: 18, invocations: 8 },
  ],
  note: 'Can swap one invocation each level-up. Choose wisely but don\'t stress — you can adapt.',
};

export const INVOCATIONS_RANKED = [
  // S-tier
  { name: 'Agonizing Blast', prereq: 'EB cantrip', effect: 'Add CHA to EB damage', rating: 'S', note: 'Mandatory. +5 damage per beam. Non-negotiable for EB Warlocks.' },
  { name: 'Repelling Blast', prereq: 'EB cantrip', effect: 'Push target 10ft per beam', rating: 'S', note: 'Control + Spike Growth combo. Each beam pushes. 4 beams = 40ft push at L17.' },
  { name: 'Devil\'s Sight', prereq: 'None', effect: 'See normally in darkness (including magical) 120ft', rating: 'S', note: 'See through Darkness spell. Cast Darkness on yourself: you see, enemies don\'t. Advantage on all attacks, disadvantage on theirs.' },

  // A-tier
  { name: 'Eldritch Mind', prereq: 'None', effect: 'Advantage on CON saves for concentration', rating: 'A', note: 'Like free War Caster (concentration part). Keep Hex/Spirit Shroud running.' },
  { name: 'Grasp of Hadar', prereq: 'EB cantrip', effect: 'Once per turn, EB pulls target 10ft toward you', rating: 'A', note: 'Pull + Repelling Blast push = total forced movement control.' },
  { name: 'Lance of Lethargy', prereq: 'EB cantrip', effect: 'Once per turn, EB reduces target speed by 10ft', rating: 'A', note: 'Slow enemies down. Prevents approach. Stacks with push/pull.' },
  { name: 'Mask of Many Faces', prereq: 'None', effect: 'Cast Disguise Self at will', rating: 'A', note: 'Unlimited disguises. Great for social Warlocks. Changeling makes this redundant.' },
  { name: 'Misty Visions', prereq: 'None', effect: 'Cast Silent Image at will', rating: 'A', note: 'Unlimited illusions. Creative utility. Walls, distractions, decoys.' },
  { name: 'Gift of the Ever-Living Ones', prereq: 'Pact of the Chain', effect: 'When you regain HP while familiar is within 100ft, treat all dice as max', rating: 'A', note: 'Healing Word on you = max roll. Short rest Hit Dice = max. Incredible with Chain Pact.' },
  { name: 'Investment of the Chain Master', prereq: 'Pact of the Chain', effect: 'Familiar attacks use your spell attack. Reaction: give familiar resistance. Familiar gains fly/swim.', rating: 'A', note: 'Makes Chain familiar actually useful in combat. Imp/Pseudodragon attacks scale with your bonus.' },

  // B-tier
  { name: 'Thirsting Blade', prereq: 'Pact of the Blade, L5', effect: 'Extra Attack with pact weapon', rating: 'A', note: 'Required for Blade Pact. Extra Attack at L5 like Fighter.' },
  { name: 'Lifedrinker', prereq: 'Pact of the Blade, L12', effect: 'Add CHA to pact weapon necrotic damage', rating: 'A', note: '+CHA necrotic per hit. Blade Pact tax but strong.' },
  { name: 'Eldritch Smite', prereq: 'Pact of the Blade, L5', effect: 'On pact weapon hit, spend Warlock slot: 1d8 per slot level + 1d8 force + knock prone (Large or smaller)', rating: 'A', note: 'Warlock smite. Force damage + prone. Stacks with Paladin smite on multiclass.' },
  { name: 'Tomb of Levistus', prereq: 'None', effect: 'Reaction when damaged: gain 10× Warlock level temp HP. You\'re incapacitated and frozen until end of next turn. Once/short rest.', rating: 'B', note: 'Emergency temp HP. You freeze but survive. At L10: 100 temp HP. Last resort.' },
  { name: 'Ghostly Gaze', prereq: 'L7', effect: 'Action: see through solid objects 30ft for 1 min. Concentration. Once/short rest.', rating: 'B', note: 'See through walls. Scout rooms. Find hidden doors. Once per short rest.' },
  { name: 'Sculptor of Flesh', prereq: 'L7', effect: 'Cast Polymorph using a Warlock slot. Once/long rest.', rating: 'B', note: 'Free-ish Polymorph. Strong spell. But uses your precious Warlock slot.' },

  // C-tier
  { name: 'Beast Speech', prereq: 'None', effect: 'Cast Speak with Animals at will', rating: 'C', note: 'Unlimited animal conversation. Fun RP but rarely impactful.' },
  { name: 'Book of Ancient Secrets', prereq: 'Pact of the Tome', effect: 'Ritual casting from any class list. Learn 2 rituals + can add more.', rating: 'A', note: 'Actually A-tier for Tome Pact. Any ritual from any class. Find Familiar, Detect Magic, Tiny Hut.' },
  { name: 'Eyes of the Rune Keeper', prereq: 'None', effect: 'Read all writing.', rating: 'C', note: 'Read any language. Useful but niche. Comprehend Languages does similar.' },
  { name: 'Fiendish Vigor', prereq: 'None', effect: 'Cast False Life at will (no slot)', rating: 'C', note: 'Unlimited 1d4+4 temp HP. Before combat: cast until you roll a 4 = 8 temp HP. Decent at low levels.' },
];

export const MUST_HAVE_COMBOS = [
  { combo: 'Agonizing + Repelling Blast', note: 'Core EB combo. Damage + push. Every EB Warlock needs these two.', rating: 'S' },
  { combo: 'Devil\'s Sight + Darkness', note: 'You see in magical darkness. Enemies don\'t. Advantage on attacks, disadvantage for them. Be warned: allies are also blinded.', rating: 'S' },
  { combo: 'Agonizing + Repelling + Grasp + Lance', note: 'Full EB control suite. Push, pull, slow, and damage. Total forced movement mastery.', rating: 'A' },
  { combo: 'Gift of Ever-Living + Chain', note: 'Max healing dice when familiar is near. Short rest HD = max. Healing Word = max.', rating: 'A' },
];

export function ebDPRWithAgonizing(warlockLevel, chaMod, targetAC) {
  const beams = warlockLevel >= 17 ? 4 : warlockLevel >= 11 ? 3 : warlockLevel >= 5 ? 2 : 1;
  const profBonus = Math.min(6, 2 + Math.floor((warlockLevel + 3) / 4));
  const attackBonus = chaMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  return beams * hitChance * (5.5 + chaMod); // 1d10 + CHA per beam
}
