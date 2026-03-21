/**
 * playerRulesDisputes.js
 * Player Mode: Common rules misunderstandings and correct rulings
 * Pure JS — no React dependencies.
 */

export const COMMON_MISUNDERSTANDINGS = [
  {
    topic: 'Bonus Action Spells',
    wrong: 'You can cast two leveled spells if one is a bonus action.',
    correct: 'If you cast a spell as a bonus action, the only other spell you can cast that turn is a CANTRIP with a casting time of 1 action.',
    source: 'PHB p.202',
  },
  {
    topic: 'Stealth in Combat',
    wrong: 'You can hide anywhere on the battlefield.',
    correct: 'You must be heavily obscured or behind total cover to attempt to Hide. The DM decides if the situation allows it.',
    source: 'PHB p.177',
  },
  {
    topic: 'Darkvision',
    wrong: 'Darkvision lets you see perfectly in darkness.',
    correct: 'Darkvision treats darkness as DIM LIGHT (grayscale). You still have disadvantage on Perception checks that rely on sight.',
    source: 'PHB p.183',
  },
  {
    topic: 'Twin Spell',
    wrong: 'You can Twin any single-target spell.',
    correct: 'You can only Twin spells that target ONE creature and are incapable of targeting more than one at the level cast. Dragon\'s Breath, Ice Knife (AoE component) can\'t be Twinned.',
    source: 'PHB p.102, Sage Advice',
  },
  {
    topic: 'Opportunity Attacks',
    wrong: 'Any movement triggers opportunity attacks.',
    correct: 'OA only triggers when you use your MOVEMENT to leave a hostile creature\'s reach. Forced movement (shove, Repelling Blast), teleportation, and Disengage don\'t trigger OA.',
    source: 'PHB p.195',
  },
  {
    topic: 'Sneak Attack',
    wrong: 'You need to be hidden/stealthy for Sneak Attack.',
    correct: 'Sneak Attack triggers when: (1) you have advantage on the attack, OR (2) another enemy of the target is within 5ft of it. No stealth required!',
    source: 'PHB p.96',
  },
  {
    topic: 'Counterspell',
    wrong: 'You can Counterspell any spell you see.',
    correct: 'You must use your REACTION. If you already used your reaction (Shield, OA), you can\'t Counterspell. Also, you must be within 60ft and see the caster.',
    source: 'PHB p.228',
  },
  {
    topic: 'Healing Word vs Cure Wounds',
    wrong: 'Cure Wounds is better because it heals more.',
    correct: 'Healing Word is generally better because it\'s a BONUS ACTION (lets you still attack/cast cantrip) and has 60ft RANGE (don\'t need to be in melee).',
    source: 'PHB p.250, 256',
  },
  {
    topic: 'Paladin Smite Timing',
    wrong: 'You must declare Smite before attacking.',
    correct: 'You can decide to Smite AFTER you hit (even after seeing if it\'s a crit!). This is why Paladin Smite is so good — no wasted slots.',
    source: 'PHB p.85',
  },
  {
    topic: 'Falling Damage',
    wrong: 'You fall slowly over multiple turns.',
    correct: 'Falling is INSTANTANEOUS — 500 feet per round. You take 1d6 per 10 feet (max 20d6 = 200ft). Feather Fall is the counter.',
    source: 'PHB p.183, Xanathar\'s p.77',
  },
  {
    topic: 'Prone + Ranged',
    wrong: 'Being prone is always good for defense.',
    correct: 'Prone gives disadvantage on melee attacks against you, but ADVANTAGE on ranged attacks against you. Don\'t go prone against archers!',
    source: 'PHB p.292',
  },
  {
    topic: 'Shield Spell Duration',
    wrong: 'Shield lasts until the end of your turn.',
    correct: 'Shield lasts until the START of your next turn. It protects you for the entire round, including other creatures\' turns.',
    source: 'PHB p.275',
  },
];

export function getRuling(topic) {
  return COMMON_MISUNDERSTANDINGS.find(r => r.topic.toLowerCase().includes((topic || '').toLowerCase())) || null;
}

export function searchRulings(query) {
  const q = (query || '').toLowerCase();
  return COMMON_MISUNDERSTANDINGS.filter(r =>
    r.topic.toLowerCase().includes(q) ||
    r.correct.toLowerCase().includes(q) ||
    r.wrong.toLowerCase().includes(q)
  );
}
