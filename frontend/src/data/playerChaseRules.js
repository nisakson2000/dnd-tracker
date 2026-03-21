/**
 * playerChaseRules.js
 * Player Mode: Chase encounter rules and complications
 * Pure JS — no React dependencies.
 */

export const CHASE_RULES = {
  initiative: 'Roll initiative as normal at the start of a chase.',
  movement: 'Each participant can Dash a number of times = 3 + CON modifier (minimum 0). After that, must make DC 10 CON save or gain 1 exhaustion.',
  distance: 'Track distance in feet between pursuer and quarry.',
  escape: 'Quarry escapes if distance exceeds the pursuer\'s maximum sight/tracking range, or after the chase lasts a number of rounds without the gap closing.',
  opportunityAttacks: 'No opportunity attacks during a chase (everyone is running).',
  spells: 'Can cast spells while running. Ranged spell attacks have disadvantage if the target is beyond 30 feet.',
};

export const URBAN_CHASE_COMPLICATIONS = [
  { roll: 1, complication: 'A large cart blocks the way. DC 10 DEX (Acrobatics) to climb over, or spend 10 extra feet going around.' },
  { roll: 2, complication: 'A crowd fills the street. DC 10 STR (Athletics) or DEX (Acrobatics) to push through, or treat as difficult terrain.' },
  { roll: 3, complication: 'A low wall or fence blocks the path. DC 10 STR (Athletics) to vault over.' },
  { roll: 4, complication: 'An uneven surface (cobblestones, stairs). DC 10 DEX save or fall prone.' },
  { roll: 5, complication: 'A dog/cat runs across your path. DC 10 DEX save or stumble, losing 5 feet of movement.' },
  { roll: 6, complication: 'A water-filled ditch or mud puddle. DC 10 STR (Athletics) to jump, or spend 10 extra feet.' },
  { roll: 7, complication: 'A merchant\'s stall. DC 10 DEX (Acrobatics) to weave through, or crash (1d4 damage, difficult terrain).' },
  { roll: 8, complication: 'A beggar or child grabs at you. DC 10 STR to shake free, or lose 5 feet of movement.' },
  { roll: 9, complication: 'Clothesline strung across the alley. DC 10 DEX save or get tangled (restrained until start of next turn).' },
  { roll: 10, complication: 'No complication this round.' },
];

export const WILDERNESS_CHASE_COMPLICATIONS = [
  { roll: 1, complication: 'Dense undergrowth. DC 10 STR (Athletics) to push through or lose 5 feet.' },
  { roll: 2, complication: 'Uneven ground. DC 10 DEX save or fall prone.' },
  { roll: 3, complication: 'A swarm of insects. DC 10 CON save or blinded until end of turn.' },
  { roll: 4, complication: 'A stream or ravine. DC 10 STR (Athletics) to leap, or enter as difficult terrain.' },
  { roll: 5, complication: 'Low-hanging branches. DC 10 DEX save or take 1d4 bludgeoning damage.' },
  { roll: 6, complication: 'A hidden root or rock. DC 10 DEX save or fall prone and take 1d4 damage.' },
  { roll: 7, complication: 'An animal burrow. DC 10 DEX save or step in it (speed halved for this turn).' },
  { roll: 8, complication: 'Thick mud. Treat as difficult terrain for this turn.' },
  { roll: 9, complication: 'Blinding rain or snow. DC 10 CON save or disadvantage on Perception until next turn.' },
  { roll: 10, complication: 'No complication this round.' },
];

export const CHASE_TACTICS = [
  'Dash aggressively early — your free Dashes are limited.',
  'Use spells to slow pursuers: Grease, Web, Plant Growth.',
  'Monks and Rogues excel at chases with Step of the Wind and Cunning Action Dash.',
  'Misty Step/Dimension Door to bypass obstacles instantly.',
  'If chasing: Longstrider beforehand adds 10ft per round.',
  'Haste doubles speed but costs concentration.',
  'Consider the environment — duck into buildings, climb rooftops, swim across rivers.',
];

export function getMaxDashes(conMod) {
  return Math.max(0, 3 + conMod);
}

export function rollComplication(environment) {
  const table = environment === 'wilderness' ? WILDERNESS_CHASE_COMPLICATIONS : URBAN_CHASE_COMPLICATIONS;
  const roll = Math.floor(Math.random() * table.length);
  return table[roll];
}
