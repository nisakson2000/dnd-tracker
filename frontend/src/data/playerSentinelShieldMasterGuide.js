/**
 * playerSentinelShieldMasterGuide.js
 * Player Mode: Sentinel + Shield Master — the ultimate defensive feat combo
 * Pure JS — no React dependencies.
 */

export const SENTINEL_FEAT = {
  effects: [
    'When you hit with an OA, the creature\'s speed becomes 0 for the rest of the turn.',
    'Creatures within 5ft that Disengage still provoke OAs from you.',
    'When a creature within 5ft attacks someone other than you, you can use reaction to make a melee attack.',
  ],
  rating: 'S+',
  bestFor: 'Tanks, frontliners, anyone wanting to lock enemies in place.',
  combos: [
    { with: 'Polearm Master', effect: 'OA when entering 10ft reach → speed 0. Enemies can\'t reach you.', rating: 'S++' },
    { with: 'Great Weapon Master', effect: 'OA deals -5/+10 damage. Punish movement severely.', rating: 'S' },
    { with: 'War Caster', effect: 'Cast spell as OA. Booming Blade + speed 0 = devastating.', rating: 'S' },
  ],
};

export const SHIELD_MASTER_FEAT = {
  effects: [
    'After Attack action, BA to shove with shield (prone or push 5ft).',
    'Add shield AC bonus (+2) to DEX saves targeting only you.',
    'On DEX save success for half damage, take no damage instead (Evasion-lite).',
  ],
  rating: 'A+',
  bestFor: 'Sword-and-board fighters, Paladins, any shield user.',
  note: 'BA shove after Attack: prone = advantage on remaining attacks. Shield Evasion is incredibly defensive.',
  controversy: 'RAW timing debate: "after Attack action" may mean after ALL attacks, not between them. Crawford ruled after all attacks.',
};

export const SENTINEL_SHIELD_MASTER_COMBO = {
  description: 'Take both feats for maximum tank effectiveness.',
  synergy: [
    'Sentinel: enemies can\'t leave your reach without getting stopped.',
    'Shield Master: BA shove prone after attacking. Prone + grappled (if you grapple too) = stuck.',
    'Shield AC to DEX saves: +2 DEX saves vs Fireball, breath weapons, etc.',
    'Shield Evasion: DEX save success = 0 damage. With +2 bonus, even more likely to succeed.',
  ],
  buildPath: {
    race: 'Variant Human (start with Sentinel)',
    level4: 'Shield Master',
    stats: 'STR > CON > WIS. Max STR for attack + shove.',
    weapons: 'Longsword (versatile 1d10 one-handed) + Shield',
  },
};

export const DEFENSIVE_FEAT_COMPARISON = [
  { feat: 'Sentinel', type: 'Control', effect: 'Lock enemies. OA speed = 0.', rating: 'S+' },
  { feat: 'Shield Master', type: 'Defense + Control', effect: 'BA shove, DEX save bonus, Evasion.', rating: 'A+' },
  { feat: 'Heavy Armor Master', type: 'Damage Reduction', effect: '-3 from nonmagical BPS.', rating: 'A (early) / B (late)' },
  { feat: 'Tough', type: 'HP', effect: '+2 HP/level.', rating: 'A' },
  { feat: 'Resilient (CON)', type: 'Saves', effect: 'CON save proficiency.', rating: 'S (casters)' },
  { feat: 'Resilient (WIS)', type: 'Saves', effect: 'WIS save proficiency.', rating: 'A+ (non-WIS classes)' },
  { feat: 'Lucky', type: 'Universal', effect: '3 rerolls/LR. Any d20.', rating: 'S+' },
];
