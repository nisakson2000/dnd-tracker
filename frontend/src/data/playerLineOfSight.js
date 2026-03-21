/**
 * playerLineOfSight.js
 * Player Mode: Line of sight, line of effect, and targeting rules
 * Pure JS — no React dependencies.
 */

export const LINE_OF_SIGHT = {
  definition: 'You can see a target if an unobstructed line can be drawn from any point in your space to any point in the target\'s space.',
  blocked: ['Full cover (walls, closed doors)', 'Heavily obscured areas (darkness without darkvision, dense fog)', 'Opaque barriers'],
  notBlocked: ['Half cover (low walls, creatures)', 'Three-quarter cover (arrow slits)', 'Lightly obscured areas (dim light, light fog)'],
  required: 'Most spells that say "a creature you can see" require line of sight.',
};

export const LINE_OF_EFFECT = {
  definition: 'A clear, unobstructed path from the spell/effect origin to the target. Even if you can see through glass, you might not have line of effect.',
  blocked: ['Total cover', 'Wall of Force', 'Prismatic Wall', 'Forcecage (on some faces)'],
  note: 'Some spells need line of effect, not just line of sight. Fireball can\'t pass through Wall of Force.',
};

export const COVER_AND_TARGETING = {
  noCover: { ac: 0, dex: 0, description: 'Target is fully visible. No penalties or bonuses.' },
  halfCover: { ac: 2, dex: 2, description: 'Low wall, furniture, creature. +2 AC and +2 DEX saves.' },
  threeQuarters: { ac: 5, dex: 5, description: 'Arrow slit, thick tree, portcullis. +5 AC and +5 DEX saves.' },
  full: { ac: 'Untargetable', dex: 'Untargetable', description: 'Completely concealed. Can\'t be directly targeted by attacks or spells.' },
};

export const OBSCUREMENT = {
  lightlyObscured: {
    sources: ['Dim light', 'Patchy fog', 'Moderate foliage'],
    effect: 'Disadvantage on Wisdom (Perception) checks that rely on sight.',
    targeting: 'You CAN still target creatures. Just harder to see.',
  },
  heavilyObscured: {
    sources: ['Darkness (without darkvision)', 'Opaque fog', 'Dense foliage', 'Blindness'],
    effect: 'Effectively blinded. Can\'t see anything in the area.',
    targeting: 'Can\'t target creatures you can\'t see (for most spells). Attacks at disadvantage.',
  },
};

export const TARGETING_THROUGH_ALLIES = {
  ranged: 'RAW: Allies don\'t provide cover for ranged attacks. But many DMs rule they provide half cover.',
  melee: 'You can attack any creature within your reach, regardless of other creatures between you.',
  spells: 'Most spells just need a clear line to the target. Allies don\'t block targeting.',
  aoe: 'AoE spells affect everyone in the area — including allies. Unless Sculpt Spells (Evocation Wizard).',
  sharpshooter: 'Sharpshooter feat: Ignore half and three-quarter cover. You can shoot past allies freely.',
};

export const INVISIBLE_TARGETING = {
  rules: [
    'You know an invisible creature is there (sound, footprints) but can\'t see them.',
    'You can guess their location and target that square.',
    'If they\'re not there, the attack automatically misses (DM might tell you or might not).',
    'Attacks against invisible creatures have disadvantage (unseen target).',
    'Invisible creature\'s attacks have advantage (unseen attacker).',
  ],
  counterplay: [
    'Faerie Fire: DEX save or outlined in light. No more invisibility benefits.',
    'See Invisibility: You can see invisible creatures within 10ft or in the Ethereal Plane.',
    'True Seeing: See invisible, through illusions, into Ethereal. 120ft.',
    'Blindsight/Tremorsense: Detect creatures without sight. Bypasses invisibility.',
    'AoE spells: Don\'t need to see the target. Fireball the area.',
    'Flour/paint/blood: Throw it in the area. It sticks to invisible creatures.',
  ],
};

export const DARKNESS_INTERACTIONS = {
  normal: {
    inDarkness: 'Blinded. Disadvantage on attacks. Advantage against you.',
    solution: 'Light cantrip, torch, lantern, Darkvision.',
  },
  darkvision: {
    inDarkness: 'Treats darkness as dim light (lightly obscured). Disadvantage on Perception, but you can see.',
    inDimLight: 'Treats dim light as bright light. No penalties.',
    note: 'Darkvision is NOT perfect night vision. You still have disadvantage on Perception in darkness.',
  },
  magicalDarkness: {
    spells: ['Darkness (2nd level)', 'Hunger of Hadar (3rd level)'],
    blocks: 'Normal darkvision. Even creatures with darkvision can\'t see in magical darkness.',
    pierces: ['Devil\'s Sight (Warlock invocation, 120ft)', 'True Seeing', 'Blindsight', 'Tremorsense'],
  },
};

export function hasLineOfSight(coverType) {
  return coverType !== 'full';
}

export function effectiveAC(baseAC, coverType) {
  const bonuses = { none: 0, half: 2, threeQuarters: 5, full: Infinity };
  return baseAC + (bonuses[coverType] || 0);
}

export function canTarget(canSee, hasLineOfEffect, spellRequiresSight) {
  if (spellRequiresSight && !canSee) return { canTarget: false, reason: 'Spell requires sight and you can\'t see the target.' };
  if (!hasLineOfEffect) return { canTarget: false, reason: 'No line of effect to the target.' };
  return { canTarget: true, reason: 'Valid target.' };
}
