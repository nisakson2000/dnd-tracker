/**
 * playerReadiedActionTimingGuide.js
 * Player Mode: Ready action — rules, timing, and tactical usage
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  cost: 'Uses your Action on your turn.',
  trigger: 'You specify a perceivable trigger and a reaction to take when it occurs.',
  reaction: 'When the trigger occurs, you can use your reaction to perform the readied action, OR ignore the trigger.',
  lostAction: 'If the trigger never occurs, you wasted your action.',
  spells: 'You can ready a spell: cast it on your turn (uses the slot), hold concentration, release as reaction. If you don\'t release before your next turn, the spell and slot are lost.',
  note: 'Ready action is powerful but costly. Only use when the timing advantage outweighs losing your action.',
};

export const READY_ACTION_USES = [
  { use: 'Attack when enemy appears', trigger: '"When the enemy comes around the corner, I attack."', rating: 'A+', note: 'Ambush. Great for ranged characters behind cover.' },
  { use: 'Attack after ally debuffs', trigger: '"When the Wizard casts Hold Person, I attack the paralyzed target."', rating: 'S', note: 'Coordinate with party. Guaranteed crits on paralyzed targets.' },
  { use: 'Ready a spell for interruption', trigger: '"When the enemy starts casting, I Counterspell."', rating: 'A', note: 'Save your Counterspell reaction for the right moment.' },
  { use: 'Dash when door opens', trigger: '"When the rogue picks the lock, I dash through."', rating: 'B+', note: 'Coordinate movement with party actions.' },
  { use: 'Ready ranged attack', trigger: '"When the invisible creature attacks, I shoot where it is."', rating: 'A', note: 'Attack reveals position. Ready to strike when you know where it is.' },
  { use: 'Double movement trick', trigger: '"I Dash on my turn, then Ready to move 30ft more when X happens."', rating: 'A', note: 'RAW: you can ready movement. Dash + readied move = 90ft total.' },
  { use: 'Hold AoE for cluster', trigger: '"When 3+ enemies are within 15ft of me, I cast Thunderwave."', rating: 'A+', note: 'Maximize AoE by waiting for optimal positioning.' },
];

export const READY_ACTION_PITFALLS = [
  { pitfall: 'Losing your action', detail: 'If the trigger never happens, you did NOTHING on your turn. Huge waste.', fix: 'Choose triggers that are very likely to occur.' },
  { pitfall: 'Spell slot lost', detail: 'If you ready a spell and the trigger doesn\'t happen, the slot is consumed and gone.', fix: 'Only ready cheap spells or when the trigger is near-certain.' },
  { pitfall: 'Only ONE attack', detail: 'Extra Attack only works on YOUR turn. A readied attack is ONE attack, not your full Attack action.', fix: 'Usually better to attack on your turn for full Extra Attack.' },
  { pitfall: 'Concentration to hold spell', detail: 'Holding a readied spell requires concentration. If concentrating on another spell, you lose it.', fix: 'Don\'t ready spells while concentrating on something important.' },
  { pitfall: 'Vague triggers', detail: '"When something bad happens" is too vague. DM may rule it doesn\'t trigger.', fix: 'Be specific: "When the creature moves within 5 feet of me..."' },
  { pitfall: 'Uses reaction', detail: 'Taking the readied action uses your reaction. No Shield, Counterspell, or OA until next turn.', fix: 'Weigh the readied action against potential defensive reactions.' },
];

export const WHEN_TO_READY_VS_ACT = {
  readyWhen: [
    'You need to coordinate with an ally\'s action (Hold Person + attack)',
    'The enemy is hiding and you expect them to appear',
    'You want to interrupt an enemy action at the perfect moment',
    'You can\'t reach the enemy this turn and want to strike when they approach',
    'Setting up a trap or ambush scenario',
  ],
  justActWhen: [
    'You have Extra Attack (readied attack = 1 attack instead of 2-4)',
    'You can reach an enemy now — attacking > waiting',
    'You\'re concentrating on an important spell (readied spell breaks it)',
    'The trigger is uncertain — you might waste your whole turn',
    'You have better uses for your reaction (Shield, Counterspell)',
  ],
};
