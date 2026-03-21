/**
 * playerGrapplingGuide.js
 * Player Mode: Grappling and shoving mechanics deep-dive
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_BASICS = {
  action: 'Replaces ONE attack in the Attack action (not a full action). At L5 with Extra Attack: grapple + attack.',
  check: 'Athletics (STR) vs target\'s Athletics (STR) or Acrobatics (DEX). Target chooses which to use.',
  effect: 'Grappled condition: target\'s speed = 0. They can\'t move. You can drag them at half speed.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics. If they beat you, they escape.',
  sizeLimit: 'Can only grapple creatures up to one size larger. Medium can grapple Large but not Huge.',
  freeHand: 'Need at least one free hand to grapple.',
};

export const SHOVE_BASICS = {
  action: 'Replaces ONE attack. Athletics (STR) vs target\'s Athletics (STR) or Acrobatics (DEX).',
  options: ['Knock prone (target falls prone)', 'Push 5ft away (in any direction)'],
  sizeLimit: 'Can only shove creatures up to one size larger.',
  prone: 'Prone: melee attacks against target have advantage. Ranged attacks have disadvantage. Target spends half movement to stand.',
};

export const GRAPPLE_SHOVE_COMBO = {
  description: 'Grapple first (attack 1) → Shove prone (attack 2). Result: target is grappled + prone.',
  effect: 'Grappled: speed = 0. Can\'t stand up (standing costs movement, but speed = 0). Prone: all melee has advantage.',
  result: 'Target is stuck on the ground with advantage on all melee attacks against them until they break the grapple.',
  counter: 'Target must use action to escape grapple (Athletics/Acrobatics vs your Athletics). THEN they can stand.',
  rating: 'S',
  note: 'This is the grappler\'s bread and butter. Lock down one enemy, entire party gets advantage.',
};

export const GRAPPLE_BUILDS = [
  { build: 'Barbarian (any)', why: 'Rage: advantage on STR checks (Athletics). Reckless Attack for offense. High STR. Ideal grappler.', rating: 'S' },
  { build: 'Rune Knight Fighter', why: 'Giant\'s Might: advantage on STR checks + grow Large (grapple Large creatures). Enlarge: grapple Huge.', rating: 'S' },
  { build: 'Bard (any)', why: 'Expertise in Athletics. Jack of All Trades helps. STR is usually dump stat though. Consider Lore Bard for Cutting Words.', rating: 'A' },
  { build: 'Rogue (any)', why: 'Expertise in Athletics at L1. Use grapple to set up Sneak Attack advantage (shove prone).', rating: 'A' },
  { build: 'Simic Hybrid (any)', why: 'Grappling Appendages: grapple on hit without using a hand. Free grapple + full weapon use.', rating: 'A' },
  { build: 'Astral Self Monk', why: 'Astral Arms: WIS for Athletics in grapple. 10ft reach. Unusual but effective.', rating: 'B' },
];

export const GRAPPLE_FEATS = [
  { feat: 'Skill Expert', effect: 'Expertise in Athletics. +1 to STR/DEX/CON. Best grappling feat.', rating: 'S' },
  { feat: 'Grappler', effect: 'Advantage on attacks vs creatures you grapple. Can pin (restrain both). Trap.', rating: 'C', note: 'Pinning restrains YOU too. Just shove prone instead — better in every way.' },
  { feat: 'Tavern Brawler', effect: 'Bonus action grapple after hitting with unarmed strike/improvised weapon. +1 STR.', rating: 'A', note: 'Action economy: attack + bonus action grapple. Then shove next turn.' },
  { feat: 'Shield Master', effect: 'Bonus action shove with shield. Not grapple, but sets up prone for party.', rating: 'A' },
];

export const GRAPPLE_HAZARD_COMBOS = [
  { combo: 'Grapple + Spike Growth', detail: 'Grapple enemy → drag through Spike Growth. 2d4 per 5ft moved. Drag 15ft = 6d4 damage.', rating: 'S' },
  { combo: 'Grapple + Spirit Guardians', detail: 'Grapple enemy → drag into Spirit Guardians aura. 3d8 damage when entering.', rating: 'S' },
  { combo: 'Grapple + cliff/lava/pit', detail: 'Grapple → shove off cliff. Or grapple and walk off cliff together (if you have Slow Fall/feather fall).', rating: 'A' },
  { combo: 'Grapple + Wall of Fire', detail: 'Grapple → push through Wall of Fire. 5d8 fire damage for passing through.', rating: 'A' },
  { combo: 'Grapple + Moonbeam', detail: 'Grapple enemy in Moonbeam area. They can\'t move out. Take damage every turn start.', rating: 'A' },
];

export function grappleCheck(strMod, profBonus, hasAdvantage = false, hasExpertise = false) {
  const bonus = strMod + (hasExpertise ? profBonus * 2 : profBonus);
  if (hasAdvantage) {
    // Average with advantage
    return bonus + 13.82; // avg d20 with advantage ≈ 13.82
  }
  return bonus + 10.5; // avg d20
}

export function canGrappleSize(grapperSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const gIdx = sizes.indexOf(grapperSize);
  const tIdx = sizes.indexOf(targetSize);
  return tIdx <= gIdx + 1; // can grapple one size larger
}

export function dragSpeed(baseSpeed) {
  return Math.floor(baseSpeed / 2);
}
