/**
 * playerEscapeArtistGuide.js
 * Player Mode: Escaping grapples, restraints, prisons, and dangerous situations
 * Pure JS — no React dependencies.
 */

export const ESCAPE_GRAPPLE = {
  action: 'Use your action to make Athletics or Acrobatics check vs grappler\'s Athletics.',
  note: 'You choose Athletics OR Acrobatics. Pick whichever is higher.',
  tips: [
    'Acrobatics (DEX) is usually higher for Rogues and Monks.',
    'Athletics (STR) is usually higher for Fighters and Barbarians.',
    'Misty Step: teleport 30ft. Automatically escapes grapple.',
    'Freedom of Movement: can\'t be grappled or restrained. Auto-escape.',
    'Enlarge/Reduce: if you become Huge and grappler is Medium, they physically can\'t hold you.',
    'Wild Shape into a Tiny creature can slip out (DM discretion).',
    'Grease on yourself: advantage on escape checks (DM discretion).',
  ],
};

export const ESCAPE_RESTRAINTS = {
  manacles: 'DC 20 Athletics to break. DC 15 Thieves\' Tools to pick.',
  rope: 'DC determined by tier quality. Thieves\' Tools or Athletics.',
  web: 'STR check (DC 12 for Web spell). Can be cut or burned.',
  magicRestraints: 'Dispel Magic. Freedom of Movement. Knock spell.',
  tips: [
    'Thieves\' Tools proficiency is essential for prisoners.',
    'Subtle Spell casters can cast without components (no gestures needed).',
    'Wildshape into a Tiny creature and slip out of chains.',
    'Misty Step/Dimension Door: teleport out. Most restraints don\'t prevent verbal components.',
    'Message cantrip: silently communicate escape plan to allies.',
  ],
};

export const ESCAPE_IMPRISONMENT = [
  { method: 'Misty Step', requirement: 'Verbal component only', note: 'Teleport 30ft. Through walls if you can see the other side.' },
  { method: 'Dimension Door', requirement: 'Verbal component only', note: '500ft teleport. No line of sight needed. Bring one ally.' },
  { method: 'Gaseous Form', requirement: 'V, S, M', note: 'Become mist. Flow through cracks. 10ft fly speed.' },
  { method: 'Etherealness', requirement: 'Self', note: 'Phase through walls. Walk out of any prison.' },
  { method: 'Passwall', requirement: 'V, S, M', note: 'Create a passage through walls. 5ft wide, 8ft tall, 20ft deep.' },
  { method: 'Plane Shift', requirement: 'V, S, M (tuning fork)', note: 'Leave this plane entirely. Come back somewhere else.' },
  { method: 'Stone Shape', requirement: 'V, S, M', note: 'Reshape stone walls/doors/floors. Create an exit.' },
  { method: 'Knock', requirement: 'V', note: 'Open any lock. LOUD (300ft audible). Quick escape.' },
  { method: 'Wild Shape (Druid)', requirement: 'None (if not restrained)', note: 'Tiny spider → slip through bars. No components.' },
  { method: 'Subtle Spell + any', requirement: 'Sorcerer', note: 'Cast without V or S components. Guards don\'t notice.' },
];

export const ESCAPE_DANGEROUS_SITUATIONS = [
  { situation: 'Falling', solution: 'Feather Fall (reaction). Fly. Misty Step to a ledge. Wild Shape into a bird.', timing: 'Feather Fall is a reaction — cast while falling.' },
  { situation: 'Drowning', solution: 'Water Breathing. Wild Shape (aquatic form). Swim to surface.', timing: 'If you can still cast, Water Breathing saves everyone.' },
  { situation: 'Surrounded', solution: 'Misty Step, Thunder Step, Dimension Door. Fog Cloud for cover.', timing: 'Don\'t waste your action on Disengage. Teleport.' },
  { situation: 'On fire', solution: 'Drop prone + use action to put out (DC 10 DEX). Or Create Water.', timing: 'Dropping prone is free. Use action to extinguish.' },
  { situation: 'Petrified', solution: 'Greater Restoration from an ally. Remove Curse doesn\'t work.', timing: 'Allies must save you. Carry Greater Restoration scroll.' },
  { situation: 'Banished', solution: 'Break caster\'s concentration. Or wait out the duration.', timing: 'If native to plane: return after 1 min. If not: permanent.' },
  { situation: 'Inside Forcecage', solution: 'Teleport (Misty Step, Dimension Door). CHA save DC 15 to teleport out.', timing: 'Forcecage has no save. Only teleportation escapes.' },
];

export const ESCAPE_TIPS = [
  'Misty Step is the best escape spell. Verbal only, BA, 30ft teleport.',
  'Freedom of Movement prevents grapple and restrained. Cast preemptively.',
  'Subtle Spell + Misty Step: escape without anyone noticing the casting.',
  'Wild Shape into a Tiny creature slips through most physical restraints.',
  'Feather Fall: always have it prepared. Falling is the most common emergency.',
  'Knock is loud (300ft). Use it when stealth doesn\'t matter.',
  'Gaseous Form: flow through any crack. Slow but unstoppable escape.',
  'Dimension Door: 500ft, no line of sight. Best long-range escape.',
  'If imprisoned, verbal-only spells work. Most DMs don\'t gag prisoners.',
  'Carry a set of Thieves\' Tools in your boot. DMs love taking your gear.',
];
