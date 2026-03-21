/**
 * playerEldritchInvocationRankingGuide.js
 * Player Mode: All Warlock Eldritch Invocations ranked and optimized
 * Pure JS — no React dependencies.
 */

export const INVOCATIONS_RANKED = [
  { name: 'Agonizing Blast', prereq: 'Eldritch Blast cantrip', effect: 'Add CHA to each EB beam.', rating: 'S+', note: 'Mandatory. Adds 5 damage per beam. 20 extra DPR at L17.' },
  { name: 'Repelling Blast', prereq: 'Eldritch Blast cantrip', effect: 'Push 10ft per beam.', rating: 'S+', note: 'Free forced movement. 40ft push at L17. Combos with Spike Growth (S++).' },
  { name: 'Devil\'s Sight', prereq: 'None', effect: 'See in magical and nonmagical darkness 120ft.', rating: 'S+', note: 'Darkness + Devil\'s Sight = advantage + enemies blinded. Broken combo.' },
  { name: 'Eldritch Mind', prereq: 'None', effect: 'Advantage on concentration saves.', rating: 'S', note: 'Free War Caster (concentration part). Essential for Hex users.' },
  { name: 'Investment of the Chain Master', prereq: 'Pact of the Chain', effect: 'BA to command familiar attack. Use YOUR spell save DC. Fly speed.', rating: 'S', note: 'Makes Chain Pact incredible. Imp with your save DC.' },
  { name: 'Thirsting Blade', prereq: 'Pact of the Blade, L5', effect: 'Extra Attack with pact weapon.', rating: 'S', note: 'Mandatory for Bladelock. Extra Attack.' },
  { name: 'Lifedrinker', prereq: 'Pact of the Blade, L12', effect: 'Add CHA to pact weapon damage (necrotic).', rating: 'S', note: 'Extra CHA mod damage per hit. Bladelock must-have at L12.' },
  { name: 'Grasp of Hadar', prereq: 'Eldritch Blast cantrip', effect: 'Pull 10ft per beam (once/turn).', rating: 'A+', note: 'Pull into hazards. Only once per turn (unlike Repelling).' },
  { name: 'Mask of Many Faces', prereq: 'None', effect: 'At-will Disguise Self.', rating: 'A+', note: 'Infinite disguises. Amazing for social/infiltration.' },
  { name: 'Misty Visions', prereq: 'None', effect: 'At-will Silent Image.', rating: 'A+', note: 'Infinite illusions. Creative players break encounters.' },
  { name: 'Book of Ancient Secrets', prereq: 'Pact of the Tome', effect: 'Ritual casting from any class list.', rating: 'S', note: 'Collect every ritual spell. Detect Magic, Comprehend Languages, etc.' },
  { name: 'Ghostly Gaze', prereq: 'L7', effect: 'See through solid objects 30ft. 1/SR.', rating: 'A+', note: 'X-ray vision. See through walls, spot ambushes, find hidden rooms.' },
  { name: 'Sculptor of Flesh', prereq: 'L7', effect: 'Cast Polymorph 1/LR using a warlock slot.', rating: 'A+', note: 'Free Polymorph. T-Rex or Giant Ape.' },
  { name: 'Whispers of the Grave', prereq: 'L9', effect: 'At-will Speak with Dead.', rating: 'A', note: 'Unlimited interrogation of corpses. Great for investigation.' },
  { name: 'One with Shadows', prereq: 'L5', effect: 'Invisible in dim light/darkness (no action, concentration-free).', rating: 'A', note: 'Free invisibility in shadows. Ambush and scouting.' },
  { name: 'Ascendant Step', prereq: 'L9', effect: 'At-will Levitate (self).', rating: 'A', note: 'Infinite levitation. Decent mobility/safety.' },
  { name: 'Cloak of Flies', prereq: 'L5', effect: 'CHA poison damage aura 5ft. Advantage on Intimidation.', rating: 'B+', note: 'Niche. Good for melee Bladelock intimidation builds.' },
  { name: 'Eldritch Spear', prereq: 'Eldritch Blast cantrip', effect: 'EB range 300ft.', rating: 'B+', note: 'Extreme range. Rarely needed but amazing when it is.' },
  { name: 'Fiendish Vigor', prereq: 'None', effect: 'At-will False Life (1d4+4 temp HP).', rating: 'B+', note: 'Cast between fights for free temp HP. Falls off at higher levels.' },
  { name: 'Beast Speech', prereq: 'None', effect: 'At-will Speak with Animals.', rating: 'B', note: 'Flavorful. Situationally useful for information gathering.' },
  { name: 'Eyes of the Rune Keeper', prereq: 'None', effect: 'Read all writing.', rating: 'B', note: 'Comprehend Languages (reading only). Niche but free.' },
  { name: 'Lance of Lethargy', prereq: 'Eldritch Blast cantrip', effect: 'Reduce speed by 10ft (once/turn).', rating: 'B+', note: 'Slow enemies. Pairs with Repelling for kiting.' },
];

export const INVOCATION_BUILDS = [
  { build: 'EB Turret (Sorlock)', picks: ['Agonizing Blast', 'Repelling Blast', 'Eldritch Mind'], rating: 'S+', note: 'Maximized Eldritch Blast damage and control.' },
  { build: 'Darkness Blaster', picks: ['Agonizing Blast', 'Devil\'s Sight', 'Repelling Blast'], rating: 'S+', note: 'Darkness centered on self + EB with advantage.' },
  { build: 'Bladelock Melee', picks: ['Thirsting Blade', 'Lifedrinker', 'Eldritch Mind'], rating: 'S', note: 'Melee warlock. Extra Attack + CHA damage.' },
  { build: 'Chain Master', picks: ['Investment of the Chain Master', 'Agonizing Blast', 'Devil\'s Sight'], rating: 'S', note: 'Familiar attacks with your save DC. Scout + combat.' },
  { build: 'Tome Ritualist', picks: ['Book of Ancient Secrets', 'Agonizing Blast', 'Mask of Many Faces'], rating: 'A+', note: 'Ritual caster + social master + solid damage.' },
];

export const INVOCATION_TIPS = [
  'Agonizing Blast is mandatory. No exceptions. Take it at L2.',
  'Repelling Blast + Spike Growth = 2d4 per 5ft pushed. 40ft push = 16d4 at L17.',
  'Devil\'s Sight + Darkness: advantage on all attacks, enemies have disadvantage. Warn your party.',
  'You can swap ONE invocation every Warlock level. Experiment freely.',
  'Fiendish Vigor is great L2-4, then swap it out when temp HP doesn\'t scale.',
  'Book of Ancient Secrets: collect rituals from scrolls. Detect Magic, Identify, Tiny Hut.',
  'Investment of the Chain Master: your Imp uses YOUR save DC. Poison sting becomes deadly.',
  'Mask of Many Faces: at-will Disguise Self. Be anyone, anytime, forever.',
];
