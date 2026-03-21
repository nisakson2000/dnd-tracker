/**
 * playerSneakAttackMastery.js
 * Player Mode: Rogue Sneak Attack rules, triggers, and optimization
 * Pure JS — no React dependencies.
 */

export const SNEAK_ATTACK_RULES = {
  damage: '1d6 per 2 Rogue levels (1d6 at L1, 2d6 at L3, ..., 10d6 at L19).',
  frequency: 'Once per TURN (not round). You can SA on your turn AND on an opportunity attack.',
  weaponReq: 'Must use a finesse or ranged weapon. Can still use STR for the attack.',
  conditions: 'Need EITHER advantage on the attack OR an enemy of the target within 5ft (and no disadvantage).',
};

export const SNEAK_ATTACK_TRIGGERS = [
  { trigger: 'Ally within 5ft of target', difficulty: 'Easy', note: 'Most common trigger. Just need a melee ally near the target. No advantage needed.' },
  { trigger: 'Hiding (Cunning Action)', difficulty: 'Easy', note: 'Hide as BA → attack with advantage → SA. Repeat every round.' },
  { trigger: 'Owl familiar Help action', difficulty: 'Easy', note: 'Owl flies to target, Help (advantage for you), Flyby out. Free every round.' },
  { trigger: 'Faerie Fire / Guiding Bolt', difficulty: 'Easy', note: 'Allies cast these → advantage on your attacks → SA guaranteed.' },
  { trigger: 'Prone target (melee only)', difficulty: 'Medium', note: 'Prone = advantage on melee attacks. Shove + SA.' },
  { trigger: 'Flanking (optional rule)', difficulty: 'Easy', note: 'If your table uses flanking, it\'s trivially easy to get SA.' },
  { trigger: 'Steady Aim (Tasha\'s)', difficulty: 'Easy', note: 'BA: give yourself advantage. Can\'t move this turn. Ranged Rogues love this.' },
  { trigger: 'Swashbuckler feature', difficulty: 'Auto', note: 'SA without advantage or allies if target is only creature within 5ft of you.' },
  { trigger: 'Insightful Fighting (Inquisitive)', difficulty: 'Medium', note: 'BA: Insight vs Deception. Success = SA for 1 minute without advantage.' },
];

export const SNEAK_ATTACK_OPTIMIZATION = [
  { tip: 'SA on opportunity attacks', detail: 'SA is once per TURN. Your turn + enemy turn = 2 SAs per round. Use Sentinel or Commander\'s Strike.', rating: 'S' },
  { tip: 'Dual wield for insurance', detail: 'Miss your first attack? Bonus action off-hand attack = second chance for SA.', rating: 'A' },
  { tip: 'Booming Blade + SA', detail: 'BB deals extra damage if target moves. Combined with SA, massive total damage.', rating: 'A' },
  { tip: 'Hold Person combo', detail: 'Paralyzed = auto-crit within 5ft. SA dice are DOUBLED on crit. Devastating.', rating: 'S' },
  { tip: 'Elven Accuracy', detail: 'Triple advantage with finesse weapons. Almost guaranteed to hit + fish for crits.', rating: 'S' },
  { tip: 'Ready action (off-turn SA)', detail: 'Ready your attack for an enemy\'s turn. If it triggers, you get SA on THEIR turn + yours.', rating: 'A' },
];

export const SA_DAMAGE_TABLE = [
  { level: 1, dice: '1d6', avg: 3.5 }, { level: 3, dice: '2d6', avg: 7 },
  { level: 5, dice: '3d6', avg: 10.5 }, { level: 7, dice: '4d6', avg: 14 },
  { level: 9, dice: '5d6', avg: 17.5 }, { level: 11, dice: '6d6', avg: 21 },
  { level: 13, dice: '7d6', avg: 24.5 }, { level: 15, dice: '8d6', avg: 28 },
  { level: 17, dice: '9d6', avg: 31.5 }, { level: 19, dice: '10d6', avg: 35 },
];

export function sneakAttackDice(rogueLevel) {
  return Math.ceil(rogueLevel / 2);
}

export function sneakAttackAvg(rogueLevel) {
  return sneakAttackDice(rogueLevel) * 3.5;
}

export function sneakAttackCritAvg(rogueLevel) {
  return sneakAttackDice(rogueLevel) * 7; // double dice on crit
}
