/**
 * playerGrapplingAdvanced.js
 * Player Mode: Advanced grappling tactics and build optimization
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Replaces ONE attack (with Extra Attack, you can grapple + attack in the same action).',
  check: 'STR (Athletics) vs target\'s STR (Athletics) or DEX (Acrobatics).',
  effect: 'Grappled creature\'s speed becomes 0. You can move at half speed dragging them.',
  escape: 'Target uses their action: STR (Athletics) or DEX (Acrobatics) vs your STR (Athletics).',
  size: 'Can only grapple creatures up to one size larger than you.',
  note: 'Grapple does NOT impose disadvantage on attacks. Combine with Prone for that.',
};

export const GRAPPLE_COMBOS = [
  {
    combo: 'Grapple + Shove Prone',
    setup: 'Extra Attack: grapple with first attack, shove prone with second.',
    effect: 'Target is grappled (speed 0) AND prone. Speed 0 = can\'t stand up. All melee attacks have advantage, ranged have disadvantage.',
    counter: 'Break the grapple first (action), then stand up (half movement).',
    rating: 'S',
  },
  {
    combo: 'Grapple + Drag to Hazard',
    setup: 'Grapple the target, then drag them (half speed) into environmental hazards.',
    effect: 'Move them into Spirit Guardians, Spike Growth, Wall of Fire, lava, cliff edge.',
    counter: 'Break the grapple before your turn.',
    rating: 'A',
  },
  {
    combo: 'Grapple + Tavern Brawler',
    setup: 'Punch (bonus action grapple from feat) + grapple in one turn.',
    effect: 'Free up your action for other things.',
    counter: 'Standard grapple escape.',
    rating: 'B',
  },
  {
    combo: 'Enlarge + Grapple',
    setup: 'Enlarge (or Rune Knight) to increase size category.',
    effect: 'Can grapple Huge creatures. Advantage on STR checks while enlarged.',
    counter: 'Dispel Magic on the Enlarge.',
    rating: 'A',
  },
];

export const GRAPPLE_BUILD_TIPS = [
  'Athletics Expertise (Skill Expert feat or Rogue/Bard) makes you near-unbeatable at grappling.',
  'Barbarian: Rage gives advantage on STR checks = advantage on grapple checks.',
  'Rune Knight Fighter: grow to Large size, grapple huge creatures.',
  'Simic Hybrid (Grappling Appendages): grapple as a bonus action.',
  'Loxodon: trunk is a natural grapple tool, keeps hands free.',
  'Tavern Brawler: bonus action grapple after unarmed strike.',
  'Shield Master: bonus action shove after Attack action — combined with grapple.',
  'STR > DEX for grapplers. Athletics is THE grapple skill.',
];

export const ANTI_GRAPPLE = [
  'Freedom of Movement: immune to grapple.',
  'Misty Step: teleport out (no check needed).',
  'Thunderwave: push the grappler away.',
  'Action to escape: STR (Athletics) or DEX (Acrobatics) vs grappler\'s Athletics.',
  'Enlarge yourself to break size limit.',
  'Polymorph into something Huge.',
  'Dimension Door: auto-escape.',
];

export function canGrapple(grapperSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const grapplerIdx = sizes.indexOf(grapperSize);
  const targetIdx = sizes.indexOf(targetSize);
  if (grapplerIdx === -1 || targetIdx === -1) return false;
  return targetIdx <= grapplerIdx + 1;
}

export function grappleDragSpeed(normalSpeed) {
  return Math.floor(normalSpeed / 2);
}
