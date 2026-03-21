/**
 * playerShadowWarfare.js
 * Player Mode: Stealth in combat, hiding, surprise, and ambush tactics
 * Pure JS — no React dependencies.
 */

export const STEALTH_RULES = {
  hide: 'Action to Hide: Stealth check vs passive Perception. Must have cover/obscurement.',
  unseen: 'Attacks against unseen = disadvantage. Attacks FROM hiding = advantage.',
  revealOnAttack: 'Attacking reveals your position even if you miss.',
  invisibility: 'Invisible ≠ hidden. Enemies know your location unless you also Hide.',
};

export const SURPRISE_RULES = {
  how: 'Party Stealth vs enemies\' passive Perception. Those who fail to notice = surprised.',
  effect: 'Surprised: can\'t move or act turn 1. No reactions until turn ends.',
  assassin: 'Assassin Rogue: advantage + auto-crit on surprised. DEVASTATING alpha strike.',
  partyProblem: 'If ANY party member fails, that enemy isn\'t surprised. Heavy armor = problem.',
};

export const HIDING_IN_COMBAT = [
  { class: 'Rogue', method: 'Cunning Action: Hide (BA)', frequency: 'Every turn', rating: 'S' },
  { class: 'Gloom Stalker', method: 'Invisible to darkvision in darkness', frequency: 'Passive', rating: 'S' },
  { class: 'Goblin', method: 'Nimble Escape: Hide as BA', frequency: 'Every turn', rating: 'A' },
  { class: 'Lightfoot Halfling', method: 'Hide behind Medium+ creatures', frequency: 'Behind ally', rating: 'A' },
];

export const AMBUSH_SETUP = [
  'Choose choke point or high ground.',
  'Position melee blockers at exits (Sentinel ideal).',
  'Casters ready AoE spells for when enemies enter kill zone.',
  'Rogues/Rangers open from stealth for alpha strike.',
  'Group Stealth check: half party must succeed.',
];

export const DARKNESS_COMBOS = [
  { combo: 'Devil\'s Sight + Darkness', effect: 'You see in magical dark. Adv on attacks, enemies have disadv.', class: 'Warlock', rating: 'S' },
  { combo: 'Shadow of Moil', effect: 'Heavily obscured. Adv on your attacks, disadv on attacks against you.', class: 'Warlock', rating: 'S' },
  { combo: 'Fog Cloud + Blindfighting', effect: '10ft blindsight in fog. You see, they don\'t.', class: 'Fighter/Ranger', rating: 'A' },
];

export const SNEAK_ATTACK_TRIGGERS = [
  'Advantage on attack roll (hiding, invisible, Faerie Fire, prone melee)',
  'Enemy of target within 5ft of target (no disadvantage required)',
  'Owl familiar Help action (free advantage)',
  'Flanking (optional rule)',
];

export function stealthCheckAvg(dexMod, profBonus, hasExpertise) {
  return 10.5 + dexMod + profBonus * (hasExpertise ? 2 : 1);
}

export function canSurprise(stealthResults, passivePerception) {
  const successes = stealthResults.filter(s => s >= passivePerception).length;
  return successes >= Math.ceil(stealthResults.length / 2);
}
