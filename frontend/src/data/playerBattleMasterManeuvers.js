/**
 * playerBattleMasterManeuvers.js
 * Player Mode: Battle Master maneuvers reference
 * Pure JS — no React dependencies.
 */

export const SUPERIORITY_DICE = [
  { level: 3, count: 4, die: 'd8' },
  { level: 7, count: 5, die: 'd8' },
  { level: 10, count: 5, die: 'd10' },
  { level: 15, count: 6, die: 'd10' },
  { level: 18, count: 6, die: 'd12' },
];

export const MANEUVERS = [
  { name: 'Commander\'s Strike', trigger: 'When you take Attack action', cost: 'Bonus action + superiority die', effect: 'Forgo one attack. Ally uses reaction to attack + superiority die damage.' },
  { name: 'Disarming Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Target STR save or drops item.' },
  { name: 'Distracting Strike', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Next attack against target (by someone else) has advantage.' },
  { name: 'Evasive Footwork', trigger: 'When you move', cost: 'Superiority die', effect: 'Add die roll to AC until you stop moving.' },
  { name: 'Feinting Attack', trigger: 'Bonus action', cost: 'Superiority die', effect: 'Advantage on next attack against a creature within 5ft. Hit: add die to damage.' },
  { name: 'Goading Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Target WIS save or disadvantage on attacks against anyone but you.' },
  { name: 'Lunging Attack', trigger: 'When you attack', cost: 'Superiority die', effect: '+5ft reach for this attack. Hit: add die to damage.' },
  { name: 'Maneuvering Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Ally can use reaction to move half speed without OA.' },
  { name: 'Menacing Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Target WIS save or frightened until end of your next turn.' },
  { name: 'Parry', trigger: 'When you\'re hit by melee', cost: 'Reaction + superiority die', effect: 'Reduce damage by die + DEX modifier.' },
  { name: 'Precision Attack', trigger: 'When you make attack roll', cost: 'Superiority die', effect: 'Add die to attack roll. Can use after rolling but before knowing if hit.' },
  { name: 'Pushing Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Large or smaller target STR save or pushed 15ft.' },
  { name: 'Rally', trigger: 'Bonus action', cost: 'Superiority die', effect: 'Ally within 30ft gains temp HP = die + CHA modifier.' },
  { name: 'Riposte', trigger: 'Creature misses you with melee', cost: 'Reaction + superiority die', effect: 'Make melee attack. Hit: add die to damage.' },
  { name: 'Sweeping Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'If die roll ≤ original attack roll - target AC, another creature within 5ft takes die damage.' },
  { name: 'Trip Attack', trigger: 'When you hit', cost: 'Superiority die', effect: 'Add die to damage. Large or smaller target STR save or knocked prone.' },
  { name: 'Ambush', trigger: 'When you roll initiative', cost: 'Superiority die', effect: 'Add die to initiative roll.' },
  { name: 'Bait and Switch', trigger: 'On your turn', cost: 'Superiority die + 5ft movement', effect: 'Swap places with ally within 5ft. One of you gains die as AC bonus.' },
  { name: 'Brace', trigger: 'Creature moves within your reach', cost: 'Reaction + superiority die', effect: 'Make melee attack. Hit: add die to damage.' },
  { name: 'Commanding Presence', trigger: 'When you make Intimidation/Performance/Persuasion', cost: 'Superiority die', effect: 'Add die to ability check.' },
  { name: 'Grappling Strike', trigger: 'When you hit', cost: 'Superiority die', effect: 'Try to grapple as part of attack. Add die to Athletics check.' },
  { name: 'Quick Toss', trigger: 'Bonus action', cost: 'Superiority die', effect: 'Make ranged attack with thrown weapon. Add die to damage.' },
  { name: 'Tactical Assessment', trigger: 'When you make Investigation/History/Insight', cost: 'Superiority die', effect: 'Add die to ability check.' },
];

export function getSuperiority(fighterLevel) {
  for (let i = SUPERIORITY_DICE.length - 1; i >= 0; i--) {
    if (fighterLevel >= SUPERIORITY_DICE[i].level) return SUPERIORITY_DICE[i];
  }
  return SUPERIORITY_DICE[0];
}

export function getManeuver(name) {
  return MANEUVERS.find(m => m.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getOffensiveManeuvers() {
  return MANEUVERS.filter(m => m.trigger.includes('hit'));
}

export function getDefensiveManeuvers() {
  return MANEUVERS.filter(m => m.trigger.includes('Reaction') || m.name === 'Evasive Footwork');
}

export function getBonusActionManeuvers() {
  return MANEUVERS.filter(m => m.trigger.includes('Bonus action') || m.cost.includes('Bonus'));
}
