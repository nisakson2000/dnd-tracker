/**
 * playerLongDeathSaveGuide.js
 * Player Mode: Surviving when everything goes wrong — last resort strategies
 * Pure JS — no React dependencies.
 */

export const LAST_RESORT_ABILITIES = [
  { ability: 'Relentless Rage (Barbarian L11)', effect: 'When reduced to 0 while raging: DC 10 CON save → 1 HP. DC increases by 5 each time.', rating: 'S+', note: 'Multiple extra chances to survive. Resets on SR.' },
  { ability: 'Undying Sentinel (Paladin L15)', effect: 'When reduced to 0: drop to 1 HP instead. 1/LR.', rating: 'S', note: 'Auto-survive one lethal hit per day.' },
  { ability: 'Strength Before Death (Samurai L18)', effect: 'When reduced to 0: take an extra turn immediately.', rating: 'S+', note: 'Extra turn at 0 HP. Can attack, heal, etc.' },
  { ability: 'Rage Beyond Death (Zealot L14)', effect: 'While raging, dropping to 0 HP doesn\'t kill you. Keep fighting.', rating: 'S+', note: 'Unkillable while raging. Death only when rage ends at 0 HP.' },
  { ability: 'Half-Orc Relentless Endurance', effect: 'Drop to 1 HP instead of 0. 1/LR.', rating: 'A+', note: 'Racial. Auto-survive one lethal hit.' },
  { ability: 'Long Death Monk (L11)', effect: 'When reduced to 0: spend 1 Ki → 1 HP.', rating: 'S', note: 'Ki per survival. Multiple uses.' },
  { ability: 'Death Ward (spell)', effect: 'First time reduced to 0: drop to 1 HP instead.', rating: 'S', note: 'L4 spell. No concentration. Pre-buff.' },
];

export const TPK_PREVENTION = [
  { strategy: 'Healing Word from range', how: 'BA ranged heal. Get someone up from 60ft away.', priority: 'S+' },
  { strategy: 'Fog Cloud retreat', how: 'Block targeting. Run away. Regroup.', priority: 'S' },
  { strategy: 'Dimension Door escape', how: 'Teleport 500ft. Bring one ally.', priority: 'S' },
  { strategy: 'Polymorph tank', how: 'Turn dying ally into Giant Ape. 157 bonus HP.', priority: 'S+' },
  { strategy: 'Scatter spell', how: 'Teleport up to 5 creatures 120ft. Emergency relocation.', priority: 'S' },
  { strategy: 'Negotiate surrender', how: 'Some enemies want things other than your death.', priority: 'A+' },
  { strategy: 'Delay via Wall of Force', how: 'Dome over party. 10 minutes to heal/plan.', priority: 'S+' },
];

export const DEATH_SAVE_RULES = {
  roll: 'D20 at start of turn while at 0 HP.',
  success: '10+ = success. 3 successes = stabilize.',
  failure: '9 or below = failure. 3 failures = death.',
  nat20: 'Regain 1 HP. Back in the fight.',
  nat1: 'Counts as 2 failures.',
  damage: 'Taking damage at 0 HP = 1 failure. Crit = 2 failures.',
  massiveDamage: 'Remaining damage ≥ max HP = instant death.',
};

export const SURVIVAL_TIPS = [
  'Healing Word at 0 HP: get up and act on your turn.',
  'Death Ward: pre-cast before dangerous fights. No concentration.',
  'Half-Orc Relentless Endurance: auto-survive one hit/LR.',
  'Zealot Barbarian: literally unkillable while raging at L14.',
  'Fog Cloud: blocks targeting. Buy time to stabilize allies.',
  'Wall of Force dome: 10 minutes of safety to heal and plan.',
  'Don\'t cluster when low HP. One AoE could TPK.',
  'Polymorph dying ally: better than any heal spell.',
  'Spare the Dying cantrip: stabilize at range (Grave Cleric).',
  'Sometimes retreat is the best tactic. Dead parties deal no damage.',
];
