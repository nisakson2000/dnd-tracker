/**
 * playerStealthSneakingGuide.js
 * Player Mode: Stealth mechanics, group stealth, and infiltration tactics
 * Pure JS — no React dependencies.
 */

export const STEALTH_RULES = {
  hide: 'Action to Hide. Stealth check vs Passive Perception.',
  requirements: 'Must be heavily obscured OR have cover/concealment.',
  movement: 'Half speed = no penalty.',
  breaksStealth: ['Attacking', 'V component spell', 'Making noise', 'Losing cover'],
  heavyArmor: 'Disadvantage on Stealth. Mithral removes this.',
};

export const GROUP_STEALTH = {
  rule: 'Half or more succeed = group succeeds.',
  bestFix: 'Pass Without Trace: +10 to entire party.',
  alternatives: ['Silence on noisy members', 'Leave heavy armor behind', 'Social infiltration instead'],
};

export const STEALTH_BOOSTERS = [
  { source: 'Pass Without Trace', bonus: '+10 party Stealth', rating: 'S+' },
  { source: 'Expertise', bonus: 'Double PB', rating: 'S+' },
  { source: 'Reliable Talent (Rogue L11)', bonus: 'Min 10 on d20', rating: 'S+' },
  { source: 'Cloak of Elvenkind', bonus: 'Advantage + disadvantage to perceive', rating: 'S' },
  { source: 'Invisibility', bonus: 'Can Hide anywhere', rating: 'S' },
  { source: 'Greater Invisibility', bonus: 'Invisible while attacking', rating: 'S+' },
];

export const INFILTRATION = [
  { method: 'Stealth + PWT', approach: 'Sneak past guards. +10 to party.', rating: 'S' },
  { method: 'Disguise Self', approach: 'Impersonate authority. Deception check.', rating: 'S' },
  { method: 'Invisible Entry', approach: 'Walk right in. Invisibility/Greater.', rating: 'S+' },
  { method: 'Gaseous Form', approach: 'Slip through cracks.', rating: 'A+' },
  { method: 'Dimension Door', approach: 'Teleport past walls. 500ft.', rating: 'S' },
  { method: 'Familiar Recon', approach: 'Imp scouts invisible. See through eyes.', rating: 'S' },
];

export const STEALTH_TIPS = [
  'Pass Without Trace: +10 party. Best infiltration spell.',
  'Group Stealth: half succeed. Carry the noisy ones.',
  'Reliable Talent: Rogue can\'t fail Stealth.',
  'Mithral armor: no Stealth disadvantage.',
  'Disguise > Stealth when guards are alert.',
  'Dimension Door: 500ft teleport past walls.',
  'Silence: 20ft no-sound sphere for noisy party.',
  'Darkvision ≠ perfect. Dim light = Perception disadvantage.',
];
