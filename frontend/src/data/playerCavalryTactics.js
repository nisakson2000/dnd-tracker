/**
 * playerCavalryTactics.js
 * Player Mode: Advanced mounted combat tactics and cavalry strategies
 * Pure JS — no React dependencies.
 */

export const PALADIN_MOUNT_SYNERGY = {
  findSteed: {
    spell: 'Find Steed (2nd level)',
    forms: ['Warhorse', 'Pony', 'Camel', 'Elk', 'Mastiff'],
    sharedSpells: 'Any spell targeting only yourself also affects your steed (Haste, Shield of Faith, Compelled Duel).',
    telepathy: 'Communicate telepathically within 1 mile.',
    resummon: 'If steed dies, cast Find Steed again. It returns (same or different form).',
    bestCombo: 'Haste on yourself = Haste on steed too. Double movement, extra action, +2 AC for both.',
  },
  findGreaterSteed: {
    spell: 'Find Greater Steed (4th level)',
    forms: ['Griffon', 'Pegasus', 'Peryton', 'Dire Wolf', 'Rhinoceros', 'Saber-toothed Tiger'],
    bestForm: 'Pegasus — 90ft flying speed. Turns Paladin into aerial cavalry.',
    note: 'Same shared-spell synergy as Find Steed. Haste on a Pegasus is absurd.',
  },
};

export const MOUNTED_CHARGE_COMBOS = [
  { build: 'Lance Paladin', combo: 'Charge in → Divine Smite on lance hit (1d12 + 2d8 radiant) → ride away with remaining movement.', dpr: 'Huge burst + safe retreat.' },
  { build: 'Cavalier Fighter', combo: 'Unwavering Mark on charge → Born to the Saddle (mount for free) → Warding Maneuver to protect mount.', dpr: 'Consistent + mount protection.' },
  { build: 'Beast Master + Mount', combo: 'Ranger on mount + beast companion flanking → both attack → reposition.', dpr: 'Three attackers on the field.' },
  { build: 'Halfling Mastiff Rider', combo: 'Small race on Medium mount → fits in tight spaces → lance + shield (1d12 + AC).', dpr: 'Budget cavalry build.' },
];

export const MOUNT_PROTECTION = [
  { method: 'Mounted Combatant feat', effect: 'Redirect attacks from mount to you. Evasion for mount on DEX saves.', priority: 'S' },
  { method: 'Find Steed resummon', effect: 'If mount dies, cast Find Steed again. Only costs a spell slot.', priority: 'A' },
  { method: 'Warding Bond on mount', effect: 'Mount gets +1 AC, +1 saves, resistance to all damage. You take the same damage it takes.', priority: 'A' },
  { method: 'Shield of Faith', effect: '+2 AC to mount (shared via Find Steed).', priority: 'B' },
  { method: 'Position behind cover', effect: 'Keep mount behind half cover when not charging.', priority: 'B' },
];

export const FLYING_MOUNT_TACTICS = [
  'Hover at 60ft+ altitude. Most melee enemies can\'t reach you at all.',
  'Dive bomb: fly down, attack, fly back up (costs movement but enemy can\'t follow).',
  'If knocked off a flying mount, Feather Fall saves you (reaction). Always have it prepared.',
  'Watch for ranged attackers — they can still hit you while flying.',
  'Dispel Magic or losing concentration on Fly = you fall. Keep concentration saves strong.',
  'Some DMs rule that Dash while flying lets you move 180ft in a turn (Pegasus). Confirm ruling.',
];

export function chargeDistance(mountSpeed, isDashing) {
  return isDashing ? mountSpeed * 2 : mountSpeed;
}

export function lanceDamage(strMod, smiteLevel) {
  const base = 6.5 + strMod; // 1d12 avg + STR
  const smite = smiteLevel > 0 ? (smiteLevel + 1) * 4.5 : 0; // (level+1)d8 avg
  return base + smite;
}
