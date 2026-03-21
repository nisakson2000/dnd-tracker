/**
 * playerSkillMonkeyBuildGuide.js
 * Player Mode: Skill monkey builds — maximum skill proficiencies and expertise
 * Pure JS — no React dependencies.
 */

export const SKILL_MONKEY_CLASSES = [
  { class: 'Rogue', proficiencies: '4 class + 2 background + 2 expertise (L1) + 2 expertise (L6)', rating: 'S+', note: 'Reliable Talent at L11: minimum 10 on proficient checks. Can\'t roll below ~20.' },
  { class: 'Bard', proficiencies: '3 class + 2 background + Jack of All Trades + 2 expertise (L3) + 2 expertise (L10)', rating: 'S+', note: 'JoAT adds half PB to ALL non-proficient checks. Includes initiative and Counterspell.' },
  { class: 'Ranger', proficiencies: '3 class + 2 background + Canny (expertise, Tasha\'s)', rating: 'A+', note: 'Tasha\'s Deft Explorer: expertise + languages. Good in exploration.' },
  { class: 'Knowledge Cleric', proficiencies: '2 class + 2 background + 2 knowledge skills with expertise', rating: 'A', note: 'Expertise in 2 knowledge skills + Channel Divinity for any proficiency for 10 min.' },
];

export const MAX_SKILL_BUILD = {
  race: 'Half-Elf (+2 skills) or Custom Lineage (Skill Expert feat)',
  class: 'Rogue 1 → Bard X or Bard 1 → Rogue X',
  background: '2 skills',
  totalSkills: 'Up to 10-12 proficiencies. 4-6 expertise.',
  keyFeatures: [
    'Rogue: 4 skills + 2 expertise (L1) + 2 more expertise (L6)',
    'Bard: 3 skills + Jack of All Trades + 2 expertise (L3) + 2 expertise (L10)',
    'Skill Expert feat: +1 proficiency + 1 expertise',
    'Prodigy feat (Half-Elf/Human/Half-Orc): +1 proficiency + 1 expertise + 1 tool + 1 language',
    'Tasha\'s optional Ranger: Canny = 1 expertise',
  ],
};

export const SKILL_BOOSTERS = [
  { source: 'Guidance (cantrip)', bonus: '+1d4', duration: '1 min (concentration)', rating: 'S+', note: 'Cast before EVERY ability check. Best utility cantrip.' },
  { source: 'Enhance Ability (L2)', bonus: 'Advantage on one ability\'s checks', duration: '1 hour (conc)', rating: 'A+', note: 'Advantage on all STR checks = grapple god. Advantage on CHA = social god.' },
  { source: 'Pass Without Trace (L2)', bonus: '+10 Stealth', duration: '1 hour (conc)', rating: 'S+', note: 'Entire party sneaks.' },
  { source: 'Bardic Inspiration', bonus: '+1d6 to +1d12', duration: 'One check', rating: 'A+', note: 'Add to any check when you need it most.' },
  { source: 'Flash of Genius (Artificer)', bonus: '+INT mod', duration: 'Reaction', rating: 'S', note: 'Adds INT to any check or save. Incredible support.' },
  { source: 'Reliable Talent (Rogue L11)', bonus: 'Minimum 10 on proficient checks', duration: 'Permanent', rating: 'S+', note: 'Can\'t roll below 10+mod+PB. Floor of 20+ on expertise skills.' },
  { source: 'Jack of All Trades (Bard L2)', bonus: '+half PB to non-proficient', duration: 'Permanent', rating: 'S', note: 'Everything you\'re not proficient in still gets a bonus.' },
  { source: 'Skill Expert (feat)', bonus: '+1 proficiency + 1 expertise', duration: 'Permanent', rating: 'A+', note: 'Best feat for skill builds.' },
  { source: 'Glibness (L8, Bard)', bonus: 'Minimum 15 on CHA checks', duration: '1 hour', rating: 'S+ (social)', note: 'Can\'t roll below 15 on Persuasion/Deception. Also beats Counterspell checks.' },
];

export const PASSIVE_CHECKS = {
  rule: 'Passive check = 10 + all modifiers. DM uses when no active check is called for.',
  common: [
    { check: 'Passive Perception', use: 'Notice hidden creatures, traps, secret doors. Most important passive.', boost: 'Observant (+5), Sentinel Shield (advantage = +5).' },
    { check: 'Passive Investigation', use: 'Notice clues, inconsistencies, illusions.', boost: 'Observant (+5).' },
    { check: 'Passive Insight', use: 'Detect lies and hidden motives.', boost: 'Less commonly used but helpful.' },
  ],
  maxPassivePerception: 'L11 Rogue with Expertise + WIS 20 + Observant: 10 + 4(PB×2) + 5(WIS) + 5(Observant) = 28 passive Perception.',
};

export const SKILL_TIPS = [
  'Guidance before every check. +1d4 average is massive over a campaign.',
  'Expertise is more impactful than proficiency. Prioritize it on your most-used skills.',
  'Perception and Stealth are the two most commonly rolled skills. Prioritize these.',
  'Athletics expertise makes you the best grappler in the party.',
  'Reliable Talent means you physically cannot fail a DC 15 check on expertise skills.',
  'Help action: give advantage to an ally\'s check. Free and underused.',
  'Tool proficiencies can be as valuable as skills. Thieves\' tools are critical.',
];
