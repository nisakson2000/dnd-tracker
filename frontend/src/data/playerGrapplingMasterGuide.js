/**
 * playerGrapplingMasterGuide.js
 * Player Mode: Grappling — the underrated combat tactic
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_BASICS = {
  action: 'Replaces one attack (not full action). Part of Attack action.',
  check: 'Your Athletics vs target Athletics or Acrobatics (their choice).',
  effect: 'Target speed = 0. They use action to escape.',
  size: 'Grapple up to one size larger. Powerful Build = grapple Large.',
};

export const GRAPPLE_SHOVE_COMBO = {
  description: 'Grapple (attack 1) + Shove Prone (attack 2). Target pinned.',
  effect: 'Prone + grappled: speed 0, can\'t stand, melee advantage, ranged disadvantage.',
  requirements: 'Extra Attack + free hand.',
};

export const GRAPPLE_BUILD_PARTS = [
  { part: 'Athletics Expertise', source: 'Rogue 1, Skill Expert, Bard', note: 'Near-guaranteed grapple checks.' },
  { part: 'Barbarian Rage', effect: 'Advantage on STR checks = advantage on grapple.', note: 'Rage + Expertise = unbeatable.' },
  { part: 'Enlarge/Rune Knight', effect: 'Large size = grapple Huge.', note: 'Expands target options.' },
  { part: 'Tavern Brawler', effect: 'BA grapple after unarmed hit.', note: 'Action economy boost.' },
];

export const GRAPPLE_COMBOS = [
  { combo: 'Grapple + Spike Growth', detail: 'Drag through = 2d4 per 5ft. 15ft drag = 6d4.', rating: 'S' },
  { combo: 'Grapple + Spirit Guardians', detail: 'Hold enemy in aura. 3d8/round guaranteed.', rating: 'S' },
  { combo: 'Grapple + cliff', detail: 'Shove off ledge. Environmental instakill.', rating: 'S' },
  { combo: 'Pin + focus fire', detail: 'Prone + grappled. All melee allies attack with advantage.', rating: 'S' },
];

export function grappleCheck(strMod, profBonus, hasExpertise, hasAdvantage) {
  const bonus = strMod + (hasExpertise ? profBonus * 2 : profBonus);
  const avgRoll = hasAdvantage ? 13.83 : 10.5;
  return { bonus, expected: Math.round(avgRoll + bonus) };
}
