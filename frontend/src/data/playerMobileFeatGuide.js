/**
 * playerMobileFeatGuide.js
 * Player Mode: Mobile feat — hit-and-run master
 * Pure JS — no React dependencies.
 */

export const MOBILE_BASICS = {
  feat: 'Mobile',
  source: 'Player\'s Handbook',
  benefit1: 'Speed +10ft.',
  benefit2: 'Dash action ignores difficult terrain.',
  benefit3: 'When you make a melee attack against a creature, you don\'t provoke OAs from that creature for the rest of the turn (hit or miss).',
  note: 'Perfect hit-and-run feat. Attack → move away freely. No Disengage needed. Incredible for Monks and melee Rogues.',
};

export const MOBILE_CLASS_SYNERGY = [
  { class: 'Monk', priority: 'S', reason: 'Already fast. +10ft stacks. Flurry of Blows: hit 4 creatures → no OAs from any of them. Zoom around the battlefield.' },
  { class: 'Rogue', priority: 'S', reason: 'Attack → free retreat (no Disengage needed). Frees Cunning Action for Hide instead. Massive action economy gain.' },
  { class: 'Bladesinger Wizard', priority: 'A', reason: 'Bladesong + Mobile = extra speed. Attack with Booming Blade → move away. Enemy must chase (triggering BB extra damage) or stay.' },
  { class: 'Fighter', priority: 'B', reason: 'Less impact — Fighters usually want to stand and fight, not retreat. Better for skirmisher builds.' },
  { class: 'Barbarian', priority: 'C', reason: 'Barbarians WANT to be in melee. Mobile doesn\'t synergize with Reckless Attack tanking.' },
];

export const MOBILE_TACTICS = [
  { tactic: 'Booming Blade + Mobile', detail: 'Hit with Booming Blade → move away (no OA). Enemy must follow (taking BB thunder damage) or stay put. Win-win.', rating: 'S' },
  { tactic: 'Monk hit-and-run', detail: 'Run in → Flurry of Blows (4 attacks) → run away. No OAs from anyone you attacked. No ki spent on Step of the Wind.', rating: 'S' },
  { tactic: 'Rogue Sneak Attack + retreat', detail: 'Attack (Sneak Attack) → move away free → next turn: repeat. Don\'t need to use Cunning Action: Disengage.', rating: 'S' },
  { tactic: 'Difficult terrain immunity (Dash)', detail: 'Dash through difficult terrain as if it\'s normal. Catch fleeing enemies in webs, undergrowth, etc.', rating: 'A' },
  { tactic: 'Multi-target skirmishing', detail: 'Attack enemy A → no OA from A → move to enemy B → attack B → no OA from B → retreat. Hit multiple targets safely.', rating: 'A' },
];

export function mobileSpeed(baseSpeed) {
  return baseSpeed + 10;
}

export function mobileVsDisengage() {
  return { mobile: 'Free on attack (no action cost)', disengage: 'Costs action (or bonus action for Rogue/Monk)', note: 'Mobile saves your action/bonus action every turn you want to retreat after attacking.' };
}
