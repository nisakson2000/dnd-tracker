/**
 * playerActionSurgeCombo.js
 * Player Mode: Action Surge combos and optimal usage
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE_BASICS = {
  feature: 'Action Surge',
  class: 'Fighter',
  level: 2,
  uses: '1 per short/long rest (2 at level 17)',
  effect: 'Take one additional ACTION on your turn. Not a bonus action — a full action.',
  rules: [
    'You get a full extra ACTION. This is huge.',
    'Can attack twice (or more with Extra Attack) on EACH action.',
    'Can use it to cast a spell AND attack in the same turn.',
    'DOES still follow the bonus action spell rule (no two leveled spells via bonus + action).',
    'Recharges on SHORT rest — use it liberally!',
    'Level 5 Fighter: 4 attacks in one turn (2 + 2). Level 11: 6 attacks. Level 20: 8 attacks.',
  ],
};

export const ACTION_SURGE_COMBOS = [
  { combo: 'GWM + Action Surge', level: 5, attacks: 4, description: 'Great Weapon Master -5/+10 on all 4 attacks. 4d12 + 40 damage potential (greatsword: 4×2d6+40).', rating: 'S', class: 'Fighter (Champion/Battle Master)' },
  { combo: 'Sharpshooter + Action Surge', level: 5, attacks: 4, description: '4 arrows with -5/+10. Hand crossbow + Crossbow Expert = 5 attacks (bonus action attack).', rating: 'S', class: 'Fighter (Battle Master)' },
  { combo: 'Hold Person + Action Surge', level: 5, attacks: 4, description: 'Ally casts Hold Person → you Action Surge → 4 auto-crit attacks on paralyzed target.', rating: 'S', class: 'Fighter + Caster ally' },
  { combo: 'Paladin Smite + Action Surge', level: 5, attacks: 4, description: 'Multiclass Fighter 2/Paladin X. Action Surge + Divine Smite on every hit. Nuclear damage.', rating: 'S', class: 'Fighter 2 / Paladin X' },
  { combo: 'Wizard Spell + Action Surge', level: 7, attacks: '2 spells', description: 'Cast Fireball as action, Action Surge for a second Fireball. Two leveled spells in one turn (both are actions, not bonus).', rating: 'A', class: 'Fighter 2 / Wizard X (Eldritch Knight)' },
  { combo: 'Assassinate + Action Surge', level: 5, attacks: 4, description: 'Surprise round: all attacks have advantage + auto-crit on surprised targets. 4 auto-crit Sneak Attack arrows.', rating: 'S', class: 'Fighter 2 / Rogue (Assassin)' },
  { combo: 'Sentinel + Action Surge', level: 5, attacks: '4 + OA', description: 'Lock enemies in place with Sentinel. Action Surge for maximum damage while they can\'t escape.', rating: 'A', class: 'Fighter (any)' },
  { combo: 'Echo Knight + Action Surge', level: 5, attacks: 5, description: 'Unleash Incarnation adds an attack per action. Two actions = two extra attacks. 6 total at level 5.', rating: 'S', class: 'Fighter (Echo Knight)' },
];

export const WHEN_TO_ACTION_SURGE = [
  { situation: 'First round of combat', reason: 'Establish dominance. Remove a key enemy before they act.', priority: 'High' },
  { situation: 'Boss fight', reason: 'This is what Action Surge is FOR. Maximum damage when it matters most.', priority: 'Critical' },
  { situation: 'Ally cast Hold Person/Monster', reason: 'Auto-crit on paralyzed targets. Multiple attacks = multiple crits.', priority: 'Critical' },
  { situation: 'Multiple weak enemies', reason: 'Cleave through multiple targets with Cleaving rules or GWM bonus action attacks.', priority: 'Medium' },
  { situation: 'Escaping or chasing', reason: 'Dash + Action Surge Dash = triple movement for one turn.', priority: 'Medium' },
  { situation: 'Finishing a weakened enemy', reason: 'Overkill is inefficient. Don\'t waste Action Surge if one attack would finish them.', priority: 'Low' },
];

export function calculateActionSurgeDamage(attacksPerAction, damagePerHit, bonusActionAttack) {
  const totalAttacks = (attacksPerAction * 2) + (bonusActionAttack ? 1 : 0);
  return {
    totalAttacks,
    maxDamage: totalAttacks * damagePerHit,
    avgDamage: totalAttacks * damagePerHit * 0.65, // ~65% hit rate
    description: `${totalAttacks} attacks × ${damagePerHit} damage = ${totalAttacks * damagePerHit} max`,
  };
}

export function getCombo(className) {
  return ACTION_SURGE_COMBOS.filter(c =>
    c.class.toLowerCase().includes((className || '').toLowerCase())
  );
}
