/**
 * playerRetreatPlanningGuide.js
 * Player Mode: When and how to retreat from combat
 * Pure JS — no React dependencies.
 */

export const RETREAT_PHILOSOPHY = {
  concept: 'A tactical retreat is not cowardice — it\'s smart. Dead heroes don\'t save anyone.',
  goldRule: 'If the fight is unwinnable, retreat NOW. Every round you delay costs resources and lives.',
};

export const WHEN_TO_RETREAT = [
  { signal: 'Multiple PCs down', detail: '2+ party members at 0 HP and no quick healing available.', severity: 'Critical' },
  { signal: 'Healer out of slots', detail: 'No Healing Word or Revivify available. Deaths become permanent.', severity: 'Critical' },
  { signal: 'Enemy is way too strong', detail: 'First round: enemy one-shots a PC or has resistance/immunity to all your damage.', severity: 'High' },
  { signal: 'Resource depletion', detail: 'No spell slots, no Ki, no rages, no superiority dice. Fighting with cantrips only.', severity: 'High' },
  { signal: 'Bad positioning', detail: 'Surrounded, ambushed, caught in a killzone. Need to reposition.', severity: 'Moderate' },
  { signal: 'Information reveals danger', detail: 'Mid-fight you learn the enemy is a lich, or reinforcements are coming.', severity: 'High' },
  { signal: 'Objective already achieved', detail: 'Got the item, rescued the prisoner, got the info. No need to fight to the death.', severity: 'Moderate' },
];

export const RETREAT_METHODS = [
  { method: 'Fog Cloud / Darkness', detail: 'Drop a cloud between you and the enemy. Blocks line of sight. Run.', rating: 'S', note: 'L1 slot. 20ft radius. Can\'t be targeted through it.' },
  { method: 'Dimension Door', detail: 'Grab an ally → teleport 500ft away. Instant escape.', rating: 'S', note: 'L4 slot but guarantees escape for 2 people.' },
  { method: 'Hypnotic Pattern / Sleep', detail: 'Incapacitate pursuers. Then run.', rating: 'A+', note: 'Buys multiple rounds of free movement.' },
  { method: 'Wall of Force', detail: 'Drop an invincible wall between you and the enemy. Walk away.', rating: 'S', note: 'Nothing gets through. 10-minute escape window.' },
  { method: 'Fighting retreat', detail: 'Melee characters Dodge/Disengage while ranged characters cover. Fall back in order.', rating: 'A', note: 'Organized withdrawal. Tanks last, squishies first.' },
  { method: 'Scatter', detail: 'Everyone runs in different directions. Enemy can only chase one.', rating: 'B+', note: 'Risky but effective against single pursuers.' },
  { method: 'Teleportation Circle', detail: 'If prepared in advance, instant party teleport to a safe location.', rating: 'S', note: 'Requires preparation. 1-minute casting time.' },
  { method: 'Thunder Step', detail: 'Teleport 90ft + take a willing creature + 3d10 thunder to enemies nearby.', rating: 'A+', note: 'Escape + damage. Great panic button.' },
];

export const RETREAT_ROLES = {
  tank: 'Last to leave. Dodge action while covering retreat. Take opportunity attacks if needed.',
  healer: 'Second to last. Keep Healing Word ready for anyone who drops during retreat.',
  caster: 'Drop cover spells (Fog Cloud, Wall of Force) then run. Maintain concentration while moving.',
  ranged: 'First to go. Longest range = shoot while moving away. Cover the retreat.',
  rogue: 'Cunning Action Dash every round. Fastest retreat. Can double back to help.',
};

export const POST_RETREAT = [
  'Short rest immediately if safe. Recover HP, Hit Dice, Warlock slots, Action Surge.',
  'Discuss what happened. What was the enemy? What worked? What didn\'t?',
  'Plan a counter-strategy. Different approach, different spells, different tactics.',
  'Consider ambush: now YOU choose the battlefield. Set traps, prepare terrain.',
  'Level up if close to milestone. Come back stronger.',
  'Seek allies: NPCs, mercenaries, other adventurers. Bring backup.',
  'Get specific gear: resistance items, specific spell scrolls, special ammunition.',
];
