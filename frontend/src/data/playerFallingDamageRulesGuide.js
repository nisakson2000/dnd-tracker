/**
 * playerFallingDamageRulesGuide.js
 * Player Mode: Falling damage and fall mitigation
 * Pure JS — no React dependencies.
 */

export const FALLING_RULES = {
  damage: '1d6 bludgeoning per 10 feet fallen.',
  maximum: '20d6 (200ft fall). Terminal velocity.',
  avgDamage: '3.5 per 10ft. 70 avg at 200ft (20d6).',
  instantaneous: 'Fall is instantaneous. You fall 500ft instantly at end of turn.',
  prone: 'You fall prone after taking falling damage (unless you avoid all damage).',
};

export const FALL_DAMAGE_TABLE = [
  { feet: 10, dice: '1d6', avg: 3.5 },
  { feet: 20, dice: '2d6', avg: 7 },
  { feet: 30, dice: '3d6', avg: 10.5 },
  { feet: 50, dice: '5d6', avg: 17.5 },
  { feet: 100, dice: '10d6', avg: 35 },
  { feet: 150, dice: '15d6', avg: 52.5 },
  { feet: 200, dice: '20d6', avg: 70 },
];

export const FALL_MITIGATION = [
  { method: 'Feather Fall (L1)', cost: 'Reaction, L1 slot', effect: 'Slow fall to 60ft/round. No damage. 5 creatures.', rating: 'S', note: 'Wizard, Sorcerer, Bard. Essential spell.' },
  { method: 'Slow Fall (Monk L4)', cost: 'Reaction', effect: 'Reduce fall damage by 5× Monk level.', rating: 'A', note: 'L10 Monk: reduce by 50 damage. Negates most falls.' },
  { method: 'Wild Shape (Druid)', cost: 'Reaction/BA', effect: 'Transform into flying creature before hitting ground.', rating: 'A', note: 'If you can react fast enough. DM ruling may apply.' },
  { method: 'Misty Step', cost: 'BA, L2 slot', effect: 'Teleport 30ft to safe ground while falling.', rating: 'A', note: 'Need to use your BA mid-fall. Works if you have a reaction/BA available.' },
  { method: 'Ring of Feather Falling', cost: 'Attunement', effect: 'Always active Feather Fall. No reaction needed.', rating: 'S', note: 'Rare item. Completely negates fall damage forever.' },
  { method: 'Boots of Levitation', cost: 'Attunement', effect: 'Levitate at will. Can stop falling.', rating: 'A', note: 'Requires activation before hitting ground.' },
  { method: 'Rage (Barbarian)', cost: 'Already raging', effect: 'Resistance to bludgeoning. Half fall damage.', rating: 'B', note: 'Must already be raging. Bear Totem: resistance to ALL damage including fall.' },
];

export const FALL_TACTICS = [
  { tactic: 'Push enemies off ledges', detail: 'Thunderwave, Repelling Blast, shove. Fall damage = free extra damage.', rating: 'S' },
  { tactic: 'Reverse gravity ambush', detail: 'Reverse Gravity (L7): enemies "fall" up 100ft, then fall back down. 20d6 total.', rating: 'S' },
  { tactic: 'Fly then drop', detail: 'Polymorph enemy → fly them up → drop concentration → they fall. Or: grapple + fly + drop.', rating: 'A' },
  { tactic: 'Grapple and drag off cliff', detail: 'Grapple enemy near cliff edge → move off cliff → both fall. You: Feather Fall/Slow Fall. Them: splat.', rating: 'A' },
  { tactic: 'Prone flyers', detail: 'Knock a flying creature prone → they fall. Prone = only cure is standing up (flying = stops fall).', rating: 'A' },
];

export function fallDamage(feet) {
  const dice = Math.min(20, Math.floor(feet / 10));
  const avg = dice * 3.5;
  return { dice: `${dice}d6`, avg: Math.round(avg), note: `${feet}ft fall: ${dice}d6 (${Math.round(avg)} avg) bludgeoning` };
}

export function slowFallReduction(monkLevel, fallDamage) {
  const reduction = monkLevel * 5;
  const remaining = Math.max(0, fallDamage - reduction);
  return { reduction, remaining, note: `Slow Fall: reduce ${fallDamage} by ${reduction} = ${remaining} damage taken` };
}
