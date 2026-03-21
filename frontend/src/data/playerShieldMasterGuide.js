/**
 * playerShieldMasterGuide.js
 * Player Mode: Shield Master feat optimization and shield bash tactics
 * Pure JS — no React dependencies.
 */

export const SHIELD_MASTER_FEAT = {
  benefits: [
    'Bonus action: shove a creature within 5ft (if you take Attack action). Athletics vs Athletics/Acrobatics.',
    'Add shield\'s AC bonus (+2) to DEX saves that target only you (Fireball, etc.).',
    'If a DEX save would deal half damage on success, take 0 damage instead (like Evasion).',
  ],
  note: 'The shove-before-attack ruling is debated. Crawford says shove must come AFTER at least one attack. Some DMs allow before.',
};

export const SHIELD_MASTER_TACTICS = [
  { tactic: 'Shove prone + Extra Attack', detail: 'Shove prone (bonus action). Remaining attacks have advantage (prone target). More hits = more damage.', timing: 'After first attack (RAW Crawford ruling).' },
  { tactic: 'Shove off cliff/into hazard', detail: 'Shove 5ft. Near ledge, pit, lava, Spike Growth. Free environmental damage.', timing: 'Any time adjacent to hazard.' },
  { tactic: 'DEX save Evasion', detail: 'Dragon breath, Fireball, Lightning Bolt — add +2 to save, and if you pass, take 0 damage.', timing: 'Whenever targeted by DEX save AoE.' },
  { tactic: 'Shove + Rogue ally', detail: 'Shove prone = advantage for Rogue\'s next attack = guaranteed Sneak Attack.', timing: 'Before Rogue\'s turn.' },
  { tactic: 'Shove + grapple', detail: 'Attack action: shove prone. Next turn: grapple (they can\'t stand with 0 speed). Pin them.', timing: 'Two-turn lockdown.' },
];

export const SHIELD_MASTER_BUILDS = [
  { build: 'Fighter (Battle Master) + Shield Master', detail: 'Trip Attack + bonus action shove. Double prone. Remaining attacks with advantage.', rating: 'A' },
  { build: 'Paladin + Shield Master', detail: 'Shove prone → Smite with advantage. +2 DEX saves protects concentration.', rating: 'A' },
  { build: 'Barbarian + Shield Master', detail: 'Advantage on Athletics (Rage). Near-guaranteed shove. DEX save bonus with danger sense.', rating: 'A' },
  { build: 'Fighter/Rogue multiclass', detail: 'Shove prone → Sneak Attack (advantage). Shield for AC. Tanky Rogue.', rating: 'B' },
];

export function shoveChance(yourAthleticsBonus, theirContestBonus, yourAdvantage) {
  const diff = yourAthleticsBonus - theirContestBonus;
  const base = 50 + diff * 5;
  const chance = yourAdvantage ? 1 - ((1 - base/100) * (1 - base/100)) : base / 100;
  return Math.min(95, Math.max(5, chance * 100));
}

export function shieldMasterDEXSave(dexMod, profBonus, isProficient) {
  return dexMod + (isProficient ? profBonus : 0) + 2; // +2 from shield
}
