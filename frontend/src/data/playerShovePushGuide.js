/**
 * playerShovePushGuide.js
 * Player Mode: Shove, push, and forced movement mechanics
 * Pure JS — no React dependencies.
 */

export const SHOVE_RULES = {
  action: 'Uses one attack (replaces one attack in your Attack action). Not a separate action.',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (target chooses).',
  options: ['Knock Prone (target falls prone)', 'Push 5ft (push target 5ft away from you)'],
  sizeLimit: 'Target can be at most one size larger than you.',
  note: 'Replaces ONE attack — so with Extra Attack you can shove + attack in the same turn.',
};

export const SHOVE_PRONE_TACTICS = [
  { tactic: 'Shove + melee attacks', detail: 'Shove prone → attack with advantage (melee vs prone = advantage). Extra Attack: shove first, attack second.', rating: 'S' },
  { tactic: 'Shove + ally attacks', detail: 'Shove enemy prone → all melee allies attack with advantage until enemy stands up (costs half speed).', rating: 'S' },
  { tactic: 'Shove + Sentinel', detail: 'Enemy is prone. They try to stand (costs movement). If they try to leave, Sentinel OA → speed = 0 → can\'t stand.', rating: 'S' },
  { tactic: 'Shove + grapple combo', detail: 'Grapple enemy (speed = 0) → shove prone → they can\'t stand (standing costs half speed, speed is 0). Permaprone.', rating: 'S' },
  { tactic: 'Prone vs ranged enemies', detail: 'DON\'T shove prone if you have ranged allies. Attacks vs prone from >5ft have DISADVANTAGE.', rating: 'Warning' },
];

export const GRAPPLE_RULES = {
  action: 'Uses one attack (replaces one attack). Not a separate action.',
  check: 'Your Athletics vs target\'s Athletics or Acrobatics (target chooses).',
  effect: 'Target\'s speed becomes 0. You can drag them at half your speed.',
  escape: 'Target uses action: Athletics or Acrobatics vs your Athletics.',
  sizeLimit: 'Target can be at most one size larger than you.',
  note: 'Grapple + shove prone = target can\'t stand (speed 0 can\'t spend half speed to stand). Devastating control.',
};

export const FORCED_MOVEMENT_SOURCES = [
  { source: 'Shove (attack)', distance: '5ft', direction: 'Away from you', note: 'Replaces one attack. Athletics vs Athletics/Acrobatics.' },
  { source: 'Thunderwave (L1)', distance: '10ft', direction: 'Away from you', note: 'On failed STR save. AoE push.' },
  { source: 'Eldritch Blast + Repelling Blast', distance: '10ft per beam', direction: 'Away from you', note: 'No save. Each beam pushes 10ft. 4 beams at L17 = 40ft push.' },
  { source: 'Thorn Whip (cantrip)', distance: '10ft', direction: 'Toward you', note: 'Pull enemy toward you. Combine with Spirit Guardians or hazards.' },
  { source: 'Graviturgy: Gravity Well', distance: '5ft', direction: 'Any direction', note: 'Free 5ft move on any spell that damages/moves. No save.' },
  { source: 'Shield Master (feat)', distance: '5ft', direction: 'Away from you', note: 'Bonus action: shove with shield after Attack action. Free shove each turn.' },
  { source: 'Telekinesis (L5)', distance: '30ft', direction: 'Any direction', note: 'Move creature 30ft in any direction on failed check. Sustained control.' },
];

export const HAZARD_PUSH_COMBOS = [
  { combo: 'Push into Spike Growth', damage: '2d4 per 5ft movement through. Push 30ft = 12d4 (30 avg).', rating: 'S' },
  { combo: 'Push into Wall of Fire', damage: '5d8 fire when entering or starting turn in wall.', rating: 'S' },
  { combo: 'Push off cliff', damage: '1d6 per 10ft fallen.', rating: 'S' },
  { combo: 'Push into Spirit Guardians', damage: '3d8 when entering area.', rating: 'A' },
  { combo: 'Push into Moonbeam', damage: '2d10 when entering beam.', rating: 'A' },
];

export function grappleShoveCombo(athleticsMod, targetAthleticsMod) {
  const successChance = (athleticsMod - targetAthleticsMod + 10.5) / 21; // Opposed roll math
  return { grappleChance: successChance, shoveChance: successChance, bothSucceed: successChance * successChance };
}

export function spikeGrowthPushDamage(distancePushed) {
  const fiveFtSegments = Math.floor(distancePushed / 5);
  return { dice: `${fiveFtSegments * 2}d4`, avg: fiveFtSegments * 2 * 2.5 };
}
