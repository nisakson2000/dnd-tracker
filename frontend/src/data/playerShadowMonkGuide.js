/**
 * playerShadowMonkGuide.js
 * Player Mode: Way of Shadow Monk — the ninja
 * Pure JS — no React dependencies.
 */

export const SHADOW_BASICS = {
  class: 'Monk (Way of Shadow)',
  source: 'Player\'s Handbook',
  theme: 'Ninja. Darkness manipulation, teleportation, and invisibility.',
  note: 'The stealth monk. Shadow Step is incredible mobility. Best monk for infiltration and ambush.',
};

export const SHADOW_FEATURES = [
  { feature: 'Shadow Arts', level: 3, effect: 'Spend 2 ki to cast: Darkness, Darkvision, Pass Without Trace, Silence. Also Minor Illusion cantrip for free.', note: 'Pass Without Trace (2 ki) is amazing — +10 Stealth to entire party. Darkness + Shadow Step combo.' },
  { feature: 'Shadow Step', level: 6, effect: 'Bonus action: teleport 60ft from dim light/darkness to dim light/darkness. Advantage on first melee attack after teleporting.', note: 'Free teleport. No ki cost. 60ft. Advantage on attack. Every turn. THE reason to play Shadow Monk.' },
  { feature: 'Cloak of Shadows', level: 11, effect: 'Action: become invisible in dim light/darkness until you attack, cast a spell, or enter bright light.', note: 'Free invisibility. No ki cost. No time limit. Just stay in shadows.' },
  { feature: 'Opportunist', level: 17, effect: 'When a creature within 5ft is hit by someone else, you can make a melee attack as a reaction.', note: 'Free reaction attack whenever an ally hits an adjacent enemy. Extra attack every round.' },
];

export const SHADOW_TACTICS = [
  { tactic: 'Shadow Step assault', detail: 'Teleport 60ft (bonus action, free) → attack with advantage → Stunning Strike with advantage → Flurry (use ki instead of Shadow Step bonus action next turn).', rating: 'S', note: 'Advantage on first attack makes Stunning Strike more reliable. Free every turn.' },
  { tactic: 'Darkness combo', detail: 'Cast Darkness (2 ki) on yourself. Enemies can\'t see you → attacks against you have disadvantage. Shadow Step in/out freely.', rating: 'A', note: 'Requires party coordination (allies can\'t see either). Devil\'s Sight Warlock ally helps.' },
  { tactic: 'Pass Without Trace', detail: '2 ki for +10 Stealth to the party for 1 hour. Concentration. Best stealth spell in the game.', rating: 'S', note: 'Normally a 2nd-level spell. You get it for 2 ki. Party Stealth checks become trivial.' },
  { tactic: 'Silence + assassination', detail: 'Cast Silence (2 ki). Casters inside can\'t use verbal components. Combine with stealth for quiet kills.', rating: 'A' },
  { tactic: 'Cloak + approach', detail: 'L11: invisible in darkness. Walk up to targets unseen. Break invisibility with Stunning Strike.', rating: 'A' },
];

export const SHADOW_VS_MERCY = {
  shadow: { pros: ['Shadow Step (free teleport + advantage)', 'Pass Without Trace', 'Stealth/infiltration', 'Free invisibility (L11)', 'Best mobility monk'], cons: ['Darkness-dependent', 'No extra damage feature', 'No healing', 'Less effective in bright light'] },
  mercy: { pros: ['Healing built into Flurry', 'Extra necrotic damage', 'Condition removal', 'Works in any lighting'], cons: ['No teleportation', 'No stealth features', 'Less mobile'] },
  verdict: 'Shadow for ninja/stealth campaigns. Mercy for general-purpose combat. Both strong.',
};

export const SHADOW_DARKNESS_RULES = {
  dimLight: 'Torchlight edges, twilight, moonlight, dense forest canopy. Shadow Step works here.',
  darkness: 'Unlit dungeons, Darkness spell, deep caves. Shadow Step works here.',
  brightLight: 'Daylight, Light cantrip, most indoor lighting. Shadow Step does NOT work here.',
  note: 'Most dungeons have plenty of dim light/darkness. Outdoors at night: works great. Noon in a field: Shadow Step fails.',
  tip: 'Carry a hood/cloak. Ask DM about lighting in each room. Create dim light sources.',
};

export function shadowStepRange() {
  return 60; // ft, free, no ki
}

export function passWithoutTraceBonus() {
  return 10; // +10 to Stealth for party
}

export function shadowArtsCost() {
  return 2; // ki cost for shadow spells
}
