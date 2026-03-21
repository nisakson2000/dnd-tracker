/**
 * playerStunningStrikeOptGuide.js
 * Player Mode: Stunning Strike optimization — Monk's best feature
 * Pure JS — no React dependencies.
 */

export const STUNNING_STRIKE_BASICS = {
  feature: 'Stunning Strike',
  class: 'Monk',
  level: 5,
  cost: '1 Ki point per attempt',
  timing: 'When you hit a creature with a melee weapon attack.',
  save: 'CON save vs your Ki save DC (8 + WIS mod + proficiency).',
  effect: 'Stunned until end of your next turn.',
  note: 'Stunned is one of the best conditions. But CON saves are the most common strong save.',
};

export const STUNNED_CONDITION = {
  effects: [
    'Incapacitated (can\'t take actions or reactions).',
    'Can\'t move.',
    'Automatically fails STR and DEX saves.',
    'Attacks against stunned creature have advantage.',
    'Speaks falteringly.',
  ],
  note: 'Stunned is devastating. Auto-fail STR/DEX saves means auto-success on grapple and advantage on all attacks.',
};

export const STUNNING_STRIKE_PROBLEMS = [
  { problem: 'CON save', detail: 'CON is the most commonly strong save. Almost every monster has good CON. Success rate is low.' },
  { problem: 'Ki-hungry', detail: 'At L5: 5 Ki points. Each Stunning Strike costs 1. Flurry costs 1. You run out fast.' },
  { problem: 'Save DC scales slowly', detail: 'DC = 8 + WIS + prof. At L5 with WIS 16: DC 14. Many CR 5+ monsters save easily.' },
  { problem: 'Competes with other Ki uses', detail: 'Flurry of Blows, Patient Defense, Step of the Wind all cost Ki. Stunning Strike devours your pool.' },
  { problem: 'One round duration', detail: 'Stunned ends at the end of YOUR next turn. Only benefits the party for one round.' },
];

export const STUNNING_STRIKE_OPTIMIZATION = [
  { tip: 'Target low-CON enemies', detail: 'Mages, rogues, humanoid casters. Avoid dragons, giants, beasts (high CON).', rating: 'S' },
  { tip: 'First hit of the round', detail: 'Stun on first hit → rest of your attacks (and party) have advantage. Maximum value.', rating: 'S' },
  { tip: 'Don\'t spam on high-CON targets', detail: 'If the dragon saves twice, stop spending Ki. Save it for Flurry/Patient Defense.', rating: 'S' },
  { tip: 'Max WIS', detail: 'Ki save DC = 8 + WIS + prof. WIS to 20 ASAP. Every +1 WIS = ~5% better stun rate.', rating: 'S' },
  { tip: 'Setup advantage first', detail: 'Flanking, Faerie Fire, or ally Help → attack with advantage → more hits → more stun attempts.', rating: 'A' },
  { tip: 'Combine with Flurry', detail: 'Flurry of Blows (1 Ki) → 4 attacks → up to 4 stun attempts. But costs 5 Ki total (1 Flurry + 4 stun).', rating: 'B' },
];

export const STUN_PROBABILITY = [
  { dc: 14, conSave: '+3', chance: '50%', note: 'Typical low-CON humanoid. Coin flip.' },
  { dc: 14, conSave: '+5', chance: '40%', note: 'Average monster. Below coin flip.' },
  { dc: 14, conSave: '+8', chance: '25%', note: 'High-CON monster. Low chance. Don\'t bother.' },
  { dc: 16, conSave: '+3', chance: '60%', note: 'WIS 20 Monk vs weak CON. Good odds.' },
  { dc: 16, conSave: '+5', chance: '50%', note: 'WIS 20 vs average. Coin flip.' },
  { dc: 16, conSave: '+8', chance: '35%', note: 'WIS 20 vs high CON. Still risky.' },
  { dc: 19, conSave: '+5', chance: '65%', note: 'L17 Monk (prof 6 + WIS 5 + 8). Very good.' },
];

export const MONK_KI_BUDGET = [
  { level: 5, ki: 5, advice: '1-2 Stunning Strikes max. Save rest for Flurry and Patient Defense.' },
  { level: 9, ki: 9, advice: '2-3 Stunning Strikes. More room for attempts.' },
  { level: 13, ki: 13, advice: '3-4 attempts affordable. Still don\'t spam on high-CON.' },
  { level: 17, ki: 17, advice: 'Generous Ki pool. Can attempt more freely. Still prioritize good targets.' },
];

export function stunChance(wisMod, profBonus, targetConSave) {
  const dc = 8 + wisMod + profBonus;
  const needed = dc - targetConSave;
  const chance = Math.max(0.05, Math.min(0.95, needed / 20));
  return { dc, chance: `${Math.round(chance * 100)}%`, note: `Ki DC ${dc} vs CON +${targetConSave}: ${Math.round(chance * 100)}% stun chance` };
}
