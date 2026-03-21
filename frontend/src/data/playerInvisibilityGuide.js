/**
 * playerInvisibilityGuide.js
 * Player Mode: Invisibility rules, spells, and tactical exploitation
 * Pure JS — no React dependencies.
 */

export const INVISIBILITY_RULES = {
  unseen: 'You are heavily obscured. Can\'t be seen without special senses.',
  attacks: 'You have ADVANTAGE on attack rolls. Attacks against you have DISADVANTAGE.',
  endCondition: 'Regular Invisibility ends when you attack or cast a spell.',
  greaterInvis: 'Greater Invisibility does NOT end on attack/spell.',
  detection: 'Enemies can still hear you, smell you, detect your footprints.',
  targeting: 'Enemies can guess your location. Attack with disadvantage at guessed square.',
  aoe: 'AoE spells hit you normally if you\'re in the area. Still need DEX save.',
  note: 'Invisible ≠ undetectable. You still make noise and leave tracks.',
};

export const INVISIBILITY_SPELLS = [
  { spell: 'Invisibility (L2)', duration: '1 hour (concentration)', targets: '1 creature', ends: 'On attack or spell cast.', note: 'Great for scouting, infiltration, positioning.' },
  { spell: 'Greater Invisibility (L4)', duration: '1 minute (concentration)', targets: '1 creature', ends: 'Does NOT end on attack/spell.', note: 'Best combat invisibility. Full actions while invisible.' },
  { spell: 'Pass Without Trace (L2)', duration: '1 hour (concentration)', targets: 'Party (30ft)', ends: 'Not invisibility. +10 Stealth.', note: 'Not invisible but +10 Stealth is nearly as good.' },
  { spell: 'Nondetection (L3)', duration: '8 hours', targets: '1 creature', ends: 'No concentration.', note: 'Hidden from divination. Not visible invisibility.' },
  { spell: 'Wind Walk (L6)', duration: '8 hours', targets: '10 creatures', ends: 'Become gaseous. Not invisible but hard to spot.', note: 'Travel form. 300ft fly. Highly inconspicuous.' },
];

export const INVISIBILITY_COUNTERS = [
  { counter: 'Blindsight', how: 'Perceive surroundings without sight. Sees invisible within range.', sources: 'Some monsters, Blind Fighting style (10ft).' },
  { counter: 'Truesight', how: 'See invisible creatures and objects.', sources: 'True Seeing spell (L6), some high-CR creatures.' },
  { counter: 'See Invisibility (L2)', how: 'See invisible creatures and objects for 1 hour.', sources: 'Wizard, Sorcerer, Bard, Artificer.' },
  { counter: 'Faerie Fire (L1)', how: 'Outlines invisible creatures. No invisibility benefit (no advantage/disadvantage).', sources: 'Druid, Bard. L1 slot.' },
  { counter: 'Detect Magic', how: 'Sense magic aura. Know something magical is present.', sources: 'Many classes. Ritual cast.' },
  { counter: 'Tremorsense', how: 'Detect creatures through ground vibrations.', sources: 'Some monsters. Fly/hover bypasses it.' },
  { counter: 'Flour/Paint/Mud', how: 'Throw on invisible creature. Outlines them.', sources: 'Creativity. DM ruling required.' },
  { counter: 'AoE Spells', how: 'Fireball hits the area. Don\'t need to see the target.', sources: 'Any AoE caster.' },
];

export const INVISIBILITY_TACTICS = [
  { tactic: 'Invisible Scout', how: 'Cast Invisibility on the Rogue. Scout ahead without risk.', note: 'Don\'t attack. Just observe and report.' },
  { tactic: 'Greater Invis + Melee', how: 'Cast Greater Invisibility on Fighter/Paladin. Advantage on all attacks.', note: 'Enemies have disadvantage to hit them. Attack + defense.' },
  { tactic: 'Invisible Caster', how: 'Greater Invisibility on yourself. Cast freely with advantage.', note: 'Enemies can\'t target you with most single-target spells.' },
  { tactic: 'Ambush Setup', how: 'Party goes invisible (Invisibility, 1 person at a time). Surprise round.', note: 'Invisible creatures in position. Enemies surprised.' },
  { tactic: 'Escape', how: 'Cast Invisibility when fleeing. Enemies lose track.', note: 'Move silently. Don\'t attack. Don\'t cast. Just run.' },
];

export const INVISIBILITY_TIPS = [
  'Invisible = advantage on attacks, disadvantage on attacks against you.',
  'Regular Invisibility ends on attack/spell. Greater does not.',
  'You still make noise. Enemies can guess your location.',
  'Faerie Fire (L1): reveals invisible creatures. Keep it prepared.',
  'See Invisibility (L2): counter enemy invisibility. 1 hour duration.',
  'Greater Invisibility on your Fighter: advantage + disadvantage. Huge.',
  'AoE still hits invisible creatures. Fireball doesn\'t care.',
  'Blind Fighting style: 10ft blindsight. Sees invisible in range.',
  'Flour/paint thrown on invisible enemy outlines them.',
  'Invisible doesn\'t mean undetectable. Perception checks still apply.',
];
