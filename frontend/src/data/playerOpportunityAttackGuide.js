/**
 * playerOpportunityAttackGuide.js
 * Player Mode: Opportunity attack rules, optimization, and avoidance
 * Pure JS — no React dependencies.
 */

export const OA_RULES = {
  trigger: 'A hostile creature you can see moves OUT of your reach',
  cost: 'Uses your Reaction (one per round)',
  action: 'One melee attack (not a full Attack action)',
  notTriggered: [
    'Teleportation (Misty Step, etc.)',
    'Forced movement (shove, Thunderwave, etc.)',
    'Disengage action',
    'Moving within reach (circling around you)',
  ],
  important: 'You choose whether to take it. It\'s optional.',
};

export const OA_OPTIMIZATION = [
  { feature: 'Sentinel feat', effect: 'OA hits reduce target speed to 0. OA when enemy attacks ally within 5ft. Ignore Disengage.', rating: 'S', classes: ['Fighter', 'Paladin', 'Barbarian'] },
  { feature: 'Polearm Master', effect: 'OA when enemies ENTER your reach (10ft with polearm). Massively increases OA triggers.', rating: 'S', classes: ['Fighter', 'Paladin', 'Barbarian'] },
  { feature: 'PAM + Sentinel combo', effect: 'Enemy enters 10ft reach → OA → speed drops to 0. They can\'t reach you. Ever.', rating: 'S+', classes: ['Fighter', 'Paladin'] },
  { feature: 'War Caster', effect: 'Cast a spell as an OA instead of melee attack. Booming Blade OA is incredible.', rating: 'S', classes: ['Any caster in melee'] },
  { feature: 'Booming Blade OA', effect: 'War Caster + Booming Blade: OA deals BB damage, and if they keep moving, extra thunder damage.', rating: 'S', classes: ['Eldritch Knight', 'Sorcerer', 'Warlock'] },
  { feature: 'Sneak Attack OA', effect: 'Rogues get Sneak Attack on OAs (it\'s a different turn). Second Sneak Attack per round.', rating: 'A', classes: ['Rogue'] },
  { feature: 'Great Weapon Master', effect: '-5/+10 applies to OAs. If it kills, triggers GWM bonus action attack on your turn (no, next turn).', rating: 'B', classes: ['Fighter', 'Barbarian', 'Paladin'] },
];

export const AVOIDING_OAS = [
  { method: 'Disengage action', cost: 'Full action', reliability: '100%', note: 'Guaranteed. But wastes your action. Rogues get this as bonus action.' },
  { method: 'Cunning Action: Disengage', cost: 'Bonus action (Rogue)', reliability: '100%', note: 'Rogues disengage for free every turn. Mobility kings.' },
  { method: 'Misty Step', cost: '2nd level spell, bonus action', reliability: '100%', note: 'Teleport 30ft. No OA trigger. Can still use action.' },
  { method: 'Flyby (trait)', cost: 'Free (racial/class)', reliability: '100%', note: 'Some creatures don\'t provoke OAs when flying. Owls, some monk features.' },
  { method: 'Forced movement on self', cost: 'Varies', reliability: '100%', note: 'Repelling Blast yourself? Weird but technically works.' },
  { method: 'Mobile feat', cost: 'Feat', reliability: '100% vs attacked targets', note: 'After attacking a creature, no OA from it. Hit and run every turn.' },
  { method: 'Shocking Grasp', cost: 'Cantrip', reliability: 'On hit', note: 'Target can\'t take reactions until its next turn. Free escape.' },
  { method: 'Fancy Footwork (Swashbuckler)', cost: 'Free', reliability: '100% vs attacked targets', note: 'Like Mobile feat but built into the subclass.' },
];

export const OA_DECISION_GUIDE = [
  { situation: 'Enemy moving away, you have Sentinel', decision: 'ALWAYS take it', reason: 'Drops speed to 0. They\'re stuck.' },
  { situation: 'Enemy moving away, you need Reaction for Shield', decision: 'Skip the OA', reason: 'Shield is more valuable than one attack of damage.' },
  { situation: 'Enemy moving away, you\'re a Rogue', decision: 'TAKE IT', reason: 'Second Sneak Attack this round. Huge damage.' },
  { situation: 'Enemy caster moving away from you', decision: 'TAKE IT', reason: 'Might break concentration. Keep them pinned.' },
  { situation: 'Enemy moving to attack your wizard', decision: 'Take if Sentinel, skip otherwise', reason: 'Without Sentinel, OA won\'t stop them from reaching the wizard.' },
  { situation: 'You have Counterspell and enemy caster is near', decision: 'SAVE YOUR REACTION', reason: 'Counterspell is almost always better than an OA.' },
];

export function shouldTakeOA(hasSentinel, hasCounterspell, enemyIsCaster, needsShield) {
  if (needsShield) return { take: false, reason: 'Save Reaction for Shield spell' };
  if (hasCounterspell && enemyIsCaster) return { take: false, reason: 'Save Reaction for Counterspell' };
  if (hasSentinel) return { take: true, reason: 'Sentinel stops their movement' };
  return { take: true, reason: 'Free damage is free damage' };
}

export function getOAFeatures(className) {
  return OA_OPTIMIZATION.filter(o =>
    o.classes.some(c => c.toLowerCase().includes((className || '').toLowerCase())) ||
    o.classes.includes('Any caster in melee')
  );
}
