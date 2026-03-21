/**
 * playerReadyActionGuide.js
 * Player Mode: Ready action rules and creative uses
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  cost: 'Uses your action on your turn.',
  trigger: 'Specify a perceivable circumstance that triggers your readied action.',
  reaction: 'When trigger occurs, use your REACTION to take the readied action. Can choose NOT to react.',
  spells: 'Can ready a spell: cast it on your turn (uses slot + concentration), release as reaction on trigger. If trigger doesn\'t happen, spell is wasted.',
  movement: 'Can ready movement: move up to your speed when trigger occurs (uses reaction).',
  duration: 'Readied action lasts until start of your next turn.',
  note: 'Readying delays your action. Only do it when timing matters more than acting now.',
};

export const READY_ACTION_EXAMPLES = [
  { trigger: 'When the door opens, I attack the first creature through it', use: 'Ambush attacks at doorway chokepoints.', rating: 'A' },
  { trigger: 'When the enemy caster starts casting, I shoot them', use: 'Interrupt concentration or force CON save mid-cast.', rating: 'A' },
  { trigger: 'When the enemy moves within 5ft of me, I grapple them', use: 'Grab enemies as they approach. Doesn\'t use your attack action.', rating: 'B' },
  { trigger: 'When the fighter shoves the enemy prone, I attack', use: 'Wait for party setup (prone = advantage). Coordinate burst.', rating: 'A' },
  { trigger: 'When the enemy comes around the corner, I cast Hold Person', use: 'Ready a spell for the perfect moment. Note: uses concentration while held.', rating: 'A' },
  { trigger: 'When the guard looks away, I move across the hall', use: 'Stealth movement timed to NPC behavior.', rating: 'B' },
  { trigger: 'If the hostage is about to be harmed, I attack the captor', use: 'Conditional response in social/tense encounters.', rating: 'A' },
];

export const READY_SPELL_RULES = {
  castOnYourTurn: 'You cast the spell on YOUR turn (expend the slot, begin concentration).',
  holdConcentration: 'While holding the spell, you are concentrating on it. This can break your existing concentration spell.',
  releaseAsReaction: 'Release the spell as your reaction when the trigger occurs.',
  lostIfNotUsed: 'If the trigger never occurs before your next turn, the spell slot is wasted.',
  cantrips: 'Cantrips can be readied too. They use concentration while held (RAW) but DMs often relax this.',
  note: 'Readying spells is usually suboptimal because of the concentration risk and wasted slot possibility.',
};

export const WHEN_TO_READY = [
  { situation: 'Waiting for an enemy to appear', detail: 'Enemy behind cover/door. Ready attack for when they emerge. Better than wasting your turn.', goodIdea: true },
  { situation: 'Coordinating with allies', detail: 'Wait for Rogue to shove prone, then attack with advantage. Teamwork readying.', goodIdea: true },
  { situation: 'Holding a spell', detail: 'Usually bad. You lose concentration and might waste the slot. Only ready spells if timing is critical.', goodIdea: false },
  { situation: 'Delaying your turn', detail: '5e has no "delay" action. Readying is the closest thing but inferior because it uses your reaction.', goodIdea: 'sometimes' },
  { situation: 'Protecting against a specific threat', detail: '"If the dragon flies overhead, I cast Shield." Conditional defense.', goodIdea: true },
];

export function readyActionOpportunityCost() {
  return {
    lost: ['Your action this turn', 'Your reaction until trigger occurs or next turn', 'Concentration (if readying a spell)'],
    gained: ['Precise timing', 'Conditional response', 'Coordinated attacks'],
  };
}
