/**
 * playerReadyActionMastery.js
 * Player Mode: Advanced Ready action usage — triggers, timing, and tactical applications
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  action: 'Ready (uses your action)',
  declaration: 'Declare a trigger and an action to take when the trigger occurs.',
  reaction: 'Taking the readied action uses your REACTION when the trigger occurs.',
  concentration: 'If you ready a spell, you concentrate on it until the trigger. Lose it if concentration breaks.',
  spellSlot: 'Readying a spell USES the spell slot even if the trigger never occurs.',
  timing: 'You can choose to NOT take the readied action when the trigger occurs.',
  movement: 'You can ready the Move action (up to your speed as a reaction to a trigger).',
};

export const BEST_READY_TRIGGERS = [
  { trigger: '"When the enemy comes within range"', action: 'Attack/spell', why: 'Forces enemies to approach on YOUR terms. They take damage entering your range.' },
  { trigger: '"When the wizard casts Hold Person"', action: 'Melee attack', why: 'Attack a paralyzed target = auto-crit. Coordinate with the caster.' },
  { trigger: '"When the enemy exits cover"', action: 'Ranged attack', why: 'Wait for the perfect shot instead of shooting at cover.' },
  { trigger: '"When an ally moves out of the way"', action: 'AoE spell', why: 'Avoid friendly fire by waiting until allies clear the blast zone.' },
  { trigger: '"When the enemy starts casting a spell"', action: 'Attack/Counterspell', why: 'Interrupt or counter enemy spells reactively.' },
  { trigger: '"When the door opens"', action: 'Attack the first thing through', why: 'Ambush setup. First hit on entry.' },
  { trigger: '"When the enemy tries to flee"', action: 'Attack', why: 'Catch retreating enemies. Works like an OA but with range.' },
  { trigger: '"When I see the signal"', action: 'Any', why: 'Coordinate party ambushes and simultaneous attacks.' },
];

export const READY_SPELL_CONSIDERATIONS = [
  { concern: 'Costs spell slot immediately', detail: 'You cast the spell on YOUR turn and hold it. The slot is gone even if the trigger never happens.' },
  { concern: 'Requires concentration', detail: 'Holding a readied spell takes concentration. If you take damage and fail the CON save, the spell is wasted.' },
  { concern: 'Drops existing concentration', detail: 'If you\'re concentrating on another spell, readying a spell drops it.' },
  { concern: 'One reaction per round', detail: 'Taking the readied action uses your reaction. No Shield or OA the same round.' },
  { concern: 'Cantrips are safe', detail: 'Readying a cantrip costs nothing but your action. No slot wasted.' },
  { concern: 'Best for non-concentration spells', detail: 'Fireball, Counterspell, Healing Word — spells that don\'t need ongoing concentration.' },
];

export const TACTICAL_APPLICATIONS = [
  { tactic: 'Hold Person combo', classes: ['Caster + Melee'], detail: 'Caster readies attack. Other caster casts Hold Person. Readied attack hits paralyzed target = auto-crit.', rating: 'S' },
  { tactic: 'Ambush coordination', classes: ['Any'], detail: 'Everyone readies an action with the trigger "when I say GO." Simultaneous strike.', rating: 'A' },
  { tactic: 'Counterspell positioning', classes: ['Caster'], detail: 'Ready to Counterspell. When the enemy caster starts a spell, use your reaction to counter.', rating: 'A' },
  { tactic: 'Kiting with readied move', classes: ['Ranged'], detail: 'Attack on your turn, then ready movement: "When the melee enemy approaches within 10ft, I move away."', rating: 'B' },
  { tactic: 'Readied Dash/Disengage', classes: ['Any'], detail: 'Ready a Dash or Disengage in response to enemies closing distance. Useful for retreats.', rating: 'B' },
  { tactic: 'Spike Growth + Ready', classes: ['Caster + Warlock'], detail: 'Cast Spike Growth, then ready Eldritch Blast with Repelling Blast to push enemies through on their turn.', rating: 'S' },
];

export const READY_VS_ALTERNATIVES = [
  { scenario: 'Enemy might approach', ready: 'Ready an attack for when they enter range', alternative: 'Dodge action if multiple enemies; OA handles single approaching enemy', winner: 'OA is free — Ready wastes your action if they don\'t approach' },
  { scenario: 'Waiting for ally combo', ready: 'Ready attack for when ally casts debuff', alternative: 'Just attack normally and benefit from debuff next round', winner: 'Ready is better for crits on Paralyzed, otherwise just attack' },
  { scenario: 'Enemy behind cover', ready: 'Ready ranged attack for when they pop out', alternative: 'Move to a position with line of sight', winner: 'Moving is usually better — you keep your reaction' },
];

export function shouldReady(hasGoodTrigger, isSpell, hasBetterAction) {
  if (!hasGoodTrigger) return { ready: false, reason: 'No clear trigger. Your action is better used attacking or Dodging.' };
  if (isSpell && !hasGoodTrigger) return { ready: false, reason: 'Readying a spell risks wasting the slot.' };
  if (hasBetterAction) return { ready: false, reason: 'Attacking or casting a spell directly is more reliable.' };
  return { ready: true, reason: 'Good trigger available. Ready your action for the optimal moment.' };
}
