/**
 * playerFlankingRules.js
 * Player Mode: Flanking rules, positioning advantages, and optional rules
 * Pure JS — no React dependencies.
 */

export const FLANKING_RULES = {
  standard: {
    name: 'No Flanking (Default RAW)',
    description: 'By default, 5e does NOT have flanking rules. There is no benefit to positioning behind an enemy.',
    note: 'This is the standard rule. Many tables add flanking as a variant.',
  },
  variant: {
    name: 'Variant: Flanking (DMG p.251)',
    description: 'When two allies are on opposite sides of an enemy, they both get ADVANTAGE on melee attacks against that enemy.',
    requirements: [
      'Both allies must be able to see the target',
      'Both allies must be within 5ft of the target',
      'Both allies must be on opposite sides (draw a line through the center)',
      'Only applies to melee attacks',
      'Works on a grid: directly opposite squares',
    ],
    controversy: 'Many DMs feel advantage from flanking is too strong. It devalues other sources of advantage (Reckless Attack, spell effects, etc.).',
  },
  houserule_alternatives: [
    { name: '+2 to hit instead of advantage', description: 'Less powerful than advantage but still rewarding positioning.', popularity: 'Very Common' },
    { name: '+1 to hit per flanking ally', description: 'Scales with more allies. Max +3 or +4.', popularity: 'Common' },
    { name: 'Flanking negates cover', description: 'Instead of advantage, flanking removes the target\'s cover bonus.', popularity: 'Uncommon' },
    { name: 'No flanking at all', description: 'Simplest. Use Help action instead if you want advantage in melee.', popularity: 'Common' },
  ],
};

export const POSITIONING_ADVANTAGES = [
  { position: 'High Ground', benefit: 'No RAW benefit, but many DMs give +2 to ranged attacks or advantage.', note: 'Ask your DM at session zero.' },
  { position: 'Behind Cover', benefit: 'Half cover = +2 AC/DEX saves. Three-quarters = +5. Full = can\'t be targeted.', note: 'Walls, trees, creatures, furniture all provide cover.' },
  { position: 'Prone (as defender)', benefit: 'Ranged attacks against you have disadvantage. Melee attacks have advantage.', note: 'Drop prone when taking ranged fire. Stand up when melee approaches.' },
  { position: 'Darkness/Obscurement', benefit: 'Attacks against you have disadvantage. Your attacks have advantage vs those who can\'t see you.', note: 'But your attacks also have disadvantage. Cancels out unless you have special sight.' },
  { position: 'Doorway/Chokepoint', benefit: 'Limits how many enemies can attack you simultaneously. Natural cover.', note: 'Sentinel feat + doorway = enemies can\'t pass. Incredible defense.' },
];

export const COVER_TYPES = [
  { type: 'Half Cover', ac: '+2 AC', dex: '+2 DEX saves', examples: 'Low wall, furniture, another creature, thin tree trunk' },
  { type: 'Three-Quarters Cover', ac: '+5 AC', dex: '+5 DEX saves', examples: 'Portcullis, arrow slit, thick tree trunk, barricade' },
  { type: 'Full Cover', ac: 'Can\'t be targeted', dex: 'Can\'t be targeted', examples: 'Complete wall, closed door, behind a pillar' },
];

export function getCoverBonus(coverType) {
  const cover = COVER_TYPES.find(c =>
    c.type.toLowerCase().includes((coverType || '').toLowerCase())
  );
  return cover || null;
}

export function isFlanking(attacker, ally, target) {
  // Simplified check: are attacker and ally on opposite sides?
  // In actual implementation, would check grid positions
  return attacker && ally && target && attacker !== ally;
}
