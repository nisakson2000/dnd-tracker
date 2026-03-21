/**
 * playerOAOptimizationGuide.js
 * Player Mode: Opportunity attack rules, optimization, and builds
 * Pure JS — no React dependencies.
 */

export const OA_RULES = {
  trigger: 'Creature you can see leaves your reach using its movement.',
  notTrigger: ['Teleportation', 'Forced movement (push/pull)', 'Disengage action', 'Being moved without using movement (grapple drag)'],
  cost: 'Uses your REACTION. One per round.',
  type: 'One melee attack (not full Attack action).',
  timing: 'Interrupts the movement. Happens before they leave reach.',
};

export const OA_ENHANCERS = [
  { source: 'Sentinel', effect: 'OA reduces speed to 0. OA when enemy attacks ally. OA on Disengage.', rating: 'S+' },
  { source: 'Polearm Master', effect: 'OA when creature ENTERS reach (10ft).', rating: 'S+' },
  { source: 'PAM + Sentinel', effect: 'Enter 10ft reach → OA → speed 0. Can\'t reach you.', rating: 'S+ (best combo)' },
  { source: 'War Caster', effect: 'Cast spell instead of melee attack for OA.', rating: 'S' },
  { source: 'War Caster + Booming Blade', effect: 'OA with Booming Blade. Move = extra thunder damage.', rating: 'S+' },
  { source: 'Cavalier (Fighter)', effect: 'Unwavering Mark: BA attack on marked target.', rating: 'A+' },
];

export const OA_SPELL_OPTIONS = [
  { spell: 'Booming Blade', effect: 'Melee attack + 1d8 thunder if they move. They triggered OA by moving.', rating: 'S+' },
  { spell: 'Hold Person', effect: 'Paralyze on OA. Brutal if it lands.', rating: 'S (if it lands)' },
  { spell: 'Lightning Lure', effect: 'Pull them back 10ft. Forced movement.', rating: 'A' },
];

export const OA_BUILDS = [
  {
    name: 'PAM + Sentinel Lock-Down',
    classes: ['Fighter', 'Paladin'],
    gear: 'Glaive/Halberd',
    strategy: 'OA at 10ft entry. Speed → 0. They never reach you.',
    rating: 'S+',
  },
  {
    name: 'Booming Blade Sentinel',
    classes: ['Eldritch Knight', 'Hexblade'],
    gear: 'Any melee weapon',
    strategy: 'War Caster OA with Booming Blade. Move = extra damage. Sentinel = speed 0.',
    rating: 'S+',
  },
];

export const OA_TIPS = [
  'PAM + Sentinel: best melee combo. Enemies can\'t close distance.',
  'War Caster: Booming Blade OA. They triggered it by moving — extra thunder guaranteed.',
  'Disengage negates OA. But costs the enemy their Action.',
  'Teleportation bypasses OA. Misty Step, Thunder Step, etc.',
  'Forced movement (Repelling Blast, shove) does NOT trigger OA.',
  'You get ONE reaction per round. OA vs Shield vs Counterspell — choose wisely.',
  'Reach weapons (10ft) = larger OA zone. Glaive/Halberd best.',
  'Sentinel: even if enemy Disengages, you still get the OA.',
  'Position to force enemies through your reach. Doorways and corridors.',
];
