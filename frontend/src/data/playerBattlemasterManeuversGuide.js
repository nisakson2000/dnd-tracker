/**
 * playerBattlemasterManeuversGuide.js
 * Player Mode: Battle Master Fighter maneuvers ranked and analyzed
 * Pure JS — no React dependencies.
 */

export const BATTLEMASTER_BASICS = {
  class: 'Fighter (Battle Master)',
  source: 'Player\'s Handbook',
  theme: 'Martial superiority through maneuvers. Versatile combat options. Best PHB Fighter subclass.',
  superiorityDice: [
    { level: 3, dice: 4, dieSize: 'd8' },
    { level: 7, dice: 5, dieSize: 'd8' },
    { level: 10, dice: 5, dieSize: 'd10' },
    { level: 15, dice: 6, dieSize: 'd10' },
    { level: 18, dice: 6, dieSize: 'd12' },
  ],
  maneuversKnown: '3 at L3, 5 at L7, 7 at L10, 9 at L15',
  recharge: 'All superiority dice recharge on short rest.',
};

export const MANEUVERS_RANKED = [
  // S-tier
  { name: 'Precision Attack', trigger: 'Attack roll', effect: 'Add superiority die to attack roll.', rating: 'S', note: 'Turn a miss into a hit. Use with GWM -5 to offset penalty. Most versatile maneuver.' },
  { name: 'Riposte', trigger: 'Reaction: creature misses melee', effect: 'Reaction melee attack + superiority die damage.', rating: 'S', note: 'Free attack on enemy miss. Extra damage. Uses reaction but reaction attacks are free DPR.' },
  { name: 'Trip Attack', trigger: 'Hit with weapon', effect: '+SD damage, target STR save or knocked prone (Large or smaller).', rating: 'S', note: 'Prone = advantage on melee. Trip first attack, advantage on remaining. GWM + trip = devastating.' },
  { name: 'Menacing Attack', trigger: 'Hit with weapon', effect: '+SD damage, target WIS save or frightened until end of your next turn.', rating: 'A', note: 'Frightened = can\'t move closer + disadvantage on attacks/checks. Great debuff + damage.' },

  // A-tier
  { name: 'Goading Attack', trigger: 'Hit with weapon', effect: '+SD damage, target WIS save or disadvantage on attacks against others.', rating: 'A', note: 'Force enemy to target you. Great for tank builds. Protects squishier allies.' },
  { name: 'Commander\'s Strike', trigger: 'Forgo one attack', effect: 'Ally uses reaction to attack + add your SD to damage.', rating: 'A', note: 'Give Rogue a second Sneak Attack. Ally must have reaction available. Great for team coordination.' },
  { name: 'Maneuvering Attack', trigger: 'Hit with weapon', effect: '+SD damage, ally can move half speed without provoking opportunity attacks.', rating: 'A', note: 'Rescue allies from dangerous positions. Free disengage for teammate.' },
  { name: 'Pushing Attack', trigger: 'Hit with weapon', effect: '+SD damage, target STR save or pushed 15ft.', rating: 'A', note: 'Push into hazards (Spike Growth, cliffs, lava). 15ft push is significant.' },
  { name: 'Disarming Attack', trigger: 'Hit with weapon', effect: '+SD damage, target STR save or drops held item.', rating: 'B', note: 'Disarm enemy weapon. DM-dependent on impact. Monsters often use natural weapons.' },

  // B-tier
  { name: 'Feinting Attack', trigger: 'Bonus action', effect: 'Advantage on next attack + SD damage.', rating: 'B', note: 'Uses bonus action. Advantage is good but many sources exist. SD damage is bonus.' },
  { name: 'Rally', trigger: 'Bonus action', effect: 'Ally gains SD + CHA mod temp HP.', rating: 'B', note: 'Temp HP for allies. No attack roll. Useful between combats or for ranged Fighters.' },
  { name: 'Parry', trigger: 'Reaction: hit by melee', effect: 'Reduce damage by SD + DEX mod.', rating: 'B', note: 'Damage reduction. Good for DEX Fighters. Competes with Riposte for reaction.' },
  { name: 'Evasive Footwork', trigger: 'Move', effect: 'Add SD to AC during movement.', rating: 'C', note: 'AC boost only while moving. Doesn\'t help once you stop. Very niche.' },
  { name: 'Sweeping Attack', trigger: 'Hit with weapon', effect: 'If another creature within 5ft: deal SD damage to them (if original attack would hit).', rating: 'C', note: 'Cleave damage. Modest. Only SD damage to second target, not weapon damage.' },
  { name: 'Distracting Strike', trigger: 'Hit with weapon', effect: '+SD damage, next attack by someone else against target has advantage.', rating: 'B', note: 'Grant advantage to next attacker. Good setup for Rogue or Paladin.' },
  { name: 'Lunging Attack', trigger: 'Melee attack', effect: '+5ft reach, +SD damage.', rating: 'C', note: 'Only +5ft reach. Polearm Master gives permanent reach. Very niche.' },

  // Tasha's additions
  { name: 'Ambush', trigger: 'Make initiative or Stealth check', effect: 'Add SD to the roll.', rating: 'A', note: 'Boost initiative or Stealth. Going first is incredibly valuable for Fighters.' },
  { name: 'Bait and Switch', trigger: 'On your turn', effect: 'Swap places with ally within 5ft. You or ally gain +SD AC until start of next turn.', rating: 'A', note: 'Reposition + AC boost. Swap squishy ally out of danger + give them AC.' },
  { name: 'Tactical Assessment', trigger: 'Make Investigation/History/Insight check', effect: 'Add SD to the roll.', rating: 'B', note: 'Skill boost for Fighters. Investigation, History, or Insight. Nice utility.' },
  { name: 'Quick Toss', trigger: 'Bonus action', effect: 'Throw weapon as bonus action + SD damage.', rating: 'A', note: 'Bonus action thrown weapon attack. Great for javelin/dagger. Extra attack per round.' },
];

export const TOP_MANEUVER_SETS = [
  { build: 'GWM Striker', maneuvers: ['Precision Attack', 'Trip Attack', 'Menacing Attack'], note: 'Precision offsets -5. Trip for advantage on GWM. Menacing for control.' },
  { build: 'Tank/Defender', maneuvers: ['Goading Attack', 'Riposte', 'Bait and Switch'], note: 'Force enemies to target you. Punish misses. Protect allies.' },
  { build: 'Team Support', maneuvers: ['Commander\'s Strike', 'Maneuvering Attack', 'Rally'], note: 'Give Rogue extra SA. Reposition allies. Temp HP.' },
  { build: 'Ranged Fighter', maneuvers: ['Precision Attack', 'Ambush', 'Quick Toss'], note: 'Never miss. Go first. Bonus action attacks.' },
];

export function superiorityDieAvg(fighterLevel) {
  if (fighterLevel >= 18) return 6.5; // d12
  if (fighterLevel >= 10) return 5.5; // d10
  return 4.5; // d8
}

export function precisionAttackValue(fighterLevel) {
  return superiorityDieAvg(fighterLevel) * 0.05; // each +1 = 5% hit chance
}

export function superiorityDiceCount(fighterLevel) {
  if (fighterLevel >= 15) return 6;
  if (fighterLevel >= 7) return 5;
  return 4;
}
