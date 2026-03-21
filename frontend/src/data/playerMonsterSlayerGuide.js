/**
 * playerMonsterSlayerGuide.js
 * Player Mode: Monster Slayer Ranger — the supernatural hunter
 * Pure JS — no React dependencies.
 */

export const MONSTER_SLAYER_BASICS = {
  class: 'Ranger (Monster Slayer)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Supernatural hunter. Identify and destroy specific targets. Anti-caster features.',
  note: 'The anti-boss Ranger. Slayer\'s Prey is consistent extra damage. Supernatural Defense and Slayer\'s Counter are incredible defensive tools.',
};

export const MONSTER_SLAYER_FEATURES = [
  { feature: 'Hunter\'s Sense', level: 3, effect: 'Action: learn immunities, resistances, and vulnerabilities of a creature within 60ft. WIS mod times/long rest.', note: 'Know enemy weaknesses before attacking. Avoid immune damage types. Find vulnerabilities.' },
  { feature: 'Slayer\'s Prey', level: 3, effect: 'Bonus action: designate a target. Your first hit each turn deals extra 1d6 damage. No concentration.', note: '1d6 extra per turn. No concentration. Lasts until short rest or you pick a new target. Like Hunter\'s Mark without concentration.' },
  { feature: 'Supernatural Defense', level: 7, effect: 'When your Slayer\'s Prey forces you to make a save, add 1d6 to the save.', note: '+1d6 to saves against your marked target. Boss tries to charm/frighten/blast you? +1d6 on the save.' },
  { feature: 'Magic-User\'s Nemesis', level: 11, effect: 'Reaction: when a creature you see within 60ft casts a spell or teleports, force WIS save. Fail: spell/teleport fails.', note: 'COUNTERSPELL AS A REACTION. WIS save based. Once per short rest. Shuts down casters and teleporters.' },
  { feature: 'Slayer\'s Counter', level: 15, effect: 'When your Slayer\'s Prey forces you to save, reaction: make one weapon attack. If it hits, auto-succeed on the save.', note: 'Boss targets you with a spell? Attack them. If you hit, auto-save. Plus you deal damage. Insane.' },
];

export const MONSTER_SLAYER_TACTICS = [
  { tactic: 'Slayer\'s Prey + attacks', detail: 'Mark target (bonus action, no concentration). Every turn: +1d6 to first hit. Can also use Hunter\'s Mark if you want (but that uses concentration + bonus action).', rating: 'A', note: 'Slayer\'s Prey is free, no concentration. Use other concentration spells freely.' },
  { tactic: 'Supernatural Defense vs bosses', detail: 'Mark the boss. Boss uses breath weapon, fear aura, spells on you? +1d6 to ALL saves against that creature.', rating: 'S' },
  { tactic: 'Magic-User\'s Nemesis', detail: 'L11: enemy caster starts casting → reaction → WIS save. Fail = spell fails. Like Counterspell. Once per short rest.', rating: 'S', note: 'Works on teleportation too. Lich tries to teleport away? Denied.' },
  { tactic: 'Slayer\'s Counter auto-save', detail: 'L15: boss targets you with save spell → reaction attack → hit = auto-succeed. You don\'t even need to roll the save.', rating: 'S', note: 'Dragon breath → you attack → hit → you take 0 damage. Plus the attack deals damage.' },
  { tactic: 'Anti-dragon build', detail: 'Mark the dragon. +1d6 damage per turn. +1d6 to saves vs breath weapon. Counter its casting (if any). Counter-attack on save attempts.', rating: 'S' },
];

export const MONSTER_SLAYER_VS_HUNTER = {
  monsterSlayer: { pros: ['No-concentration extra damage', 'Anti-caster reaction', 'Save bonuses vs prey', 'Auto-save counter (L15)', 'Best boss-killer Ranger'], cons: ['Less AoE (no Volley)', 'Less defensive options', 'Single-target focused'] },
  hunter: { pros: ['AoE options (Volley/Whirlwind)', 'Multiple defensive choices', 'Customizable', 'Better vs groups'], cons: ['No anti-caster features', 'No save bonuses', 'Colossus Slayer needs target at <max HP'] },
  verdict: 'Monster Slayer for boss fights. Hunter for versatility and groups.',
};

export function slayersPreyDamage() {
  return 3.5; // 1d6 per turn
}

export function supernaturalDefenseBonus() {
  return 3.5; // 1d6 average
}

export function slayersCounterAutoSave(attackBonus, targetAC) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  return hitChance; // Chance of auto-saving
}
