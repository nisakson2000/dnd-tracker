/**
 * playerActionSurgeStrategy.js
 * Player Mode: Fighter Action Surge optimization, timing, and multiclass combos
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE_RULES = {
  feature: 'Action Surge (Fighter 2)',
  effect: 'Take one additional action on your turn',
  uses: '1 per short/long rest (2 at Fighter 17)',
  restrictions: [
    'Only one additional action per turn (can\'t stack with another Action Surge)',
    'Bonus action rules still apply (one per turn)',
    'Can be used on the same turn as Extra Attack',
    'Spellcasting rules apply: bonus action spell = only cantrip with other action',
  ],
  note: 'The extra action is a FULL action. Attack action = full Extra Attack. Spell action = full spell.',
};

export const WHEN_TO_SURGE = [
  { situation: 'Round 1 alpha strike', priority: 'S', reason: 'Maximum damage when enemies are clustered and haven\'t spread. Surprise round + Action Surge = devastating.' },
  { situation: 'Finishing the boss', priority: 'S', reason: 'Boss at low HP? Surge for extra attacks to guarantee the kill before it acts again.' },
  { situation: 'Emergency healing/revive', priority: 'A', reason: 'If you need to Dash to reach a downed ally AND use an item/action. Surge = both.' },
  { situation: 'Two full spells (Fighter/Caster)', priority: 'A', reason: 'Action: Fireball. Action Surge: Fireball. Two Fireballs in one turn (if Fighter 2/Wizard X).' },
  { situation: 'Grapple + attack', priority: 'B', reason: 'Action 1: Attack (replace 1 attack with grapple). Action 2: Full attack action on grappled target.' },
  { situation: 'Trash mob cleanup', priority: 'C', reason: 'Don\'t waste Surge on easy fights. Save for tough encounters.' },
];

export const FIGHTER_SURGE_MATH = {
  level5: {
    normal: '2 attacks (2d6+5 each) = avg 24',
    surged: '4 attacks (2d6+5 each) = avg 48',
    withGWM: '4 attacks (-5/+10) = avg 72 (if all hit)',
  },
  level11: {
    normal: '3 attacks = avg 36',
    surged: '6 attacks = avg 72',
    withGWM: '6 attacks (-5/+10) = avg 108 (if all hit)',
  },
  level20: {
    normal: '4 attacks = avg 48',
    surged: '8 attacks = avg 96',
    twoSurges: '12 attacks in 2 turns = avg 144',
  },
};

export const MULTICLASS_SURGE_COMBOS = [
  { combo: 'Fighter 2 / Wizard X', tactic: 'Two leveled spells in one turn. Fireball + Fireball. Or control + damage.', rating: 'S', note: 'The bonus action spell rule limits BA spells, NOT Action Surge spells. Two full action spells is legal.' },
  { combo: 'Fighter 2 / Paladin X', tactic: 'Action: 2 attacks + 2 Smites. Surge: 2 more attacks + 2 more Smites. 4 Smites in one turn.', rating: 'S', note: 'The nova king. 4 attacks = 4 potential Smites. On a crit, devastating.' },
  { combo: 'Fighter 2 / Sorcerer X', tactic: 'Quickened Spell (BA) + Action Spell + Action Surge Spell = 3 spells in one turn.', rating: 'S', note: 'Wait — BA spell limits action to cantrips. But Action Surge is a separate action. Rules debate. Ask DM.' },
  { combo: 'Fighter 2 / Rogue X', tactic: 'Attack (SA) + Action Surge Attack (2nd chance SA if first missed).', rating: 'A', note: 'Insurance for Sneak Attack. Two full rounds of attacks.' },
  { combo: 'Fighter 2 / Cleric X', tactic: 'Spirit Guardians (action) + Spiritual Weapon (BA) + Surge: Dodge or another spell.', rating: 'A', note: 'Set up both concentration + BA spell in one turn. Then Surge for extra defense.' },
  { combo: 'Fighter 11 / Warlock 2', tactic: '6 Eldritch Blast beams + Action Surge: 6 more = 12 beams in one turn.', rating: 'A', note: '12 × (1d10+5) = avg 126 damage. With Hex: avg 168. Absurd.' },
];

export const SURGE_MISTAKES = [
  'Using Surge on round 1 of an easy fight. Save it.',
  'Forgetting you HAVE Action Surge. Use it before the fight ends.',
  'Not combining with GWM/Sharpshooter for maximum damage.',
  'Using Surge for a Dash when you could position better without it.',
  'Not short resting to get it back between encounters.',
  'Surging for one attack when you could wait until you have Extra Attack.',
];

export function surgeDamage(attacksPerAction, avgDamagePerHit, hasGWM) {
  const gwmBonus = hasGWM ? 10 : 0;
  const perHit = avgDamagePerHit + gwmBonus;
  return {
    normal: attacksPerAction * perHit,
    surged: attacksPerAction * 2 * perHit,
    extraDamage: attacksPerAction * perHit,
  };
}

export function shouldSurge(roundNumber, encounterDifficulty, bossHPPercent) {
  if (encounterDifficulty === 'easy') return { surge: false, reason: 'Save for a harder fight.' };
  if (roundNumber === 1 && encounterDifficulty === 'deadly') return { surge: true, reason: 'Alpha strike. Maximum pressure round 1.' };
  if (bossHPPercent && bossHPPercent < 0.25) return { surge: true, reason: 'Finish the boss before it acts again.' };
  if (roundNumber <= 2) return { surge: true, reason: 'Best used early for maximum impact.' };
  return { surge: true, reason: 'Don\'t hold it too long. Use it before combat ends.' };
}
