/**
 * playerDeathSaveStrategy.js
 * Player Mode: Death save math, strategy, and party response protocol
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  trigger: 'Start of your turn while at 0 HP',
  dc: 10,
  success3: 'Stabilize at 0 HP (don\'t regain HP, just stop dying)',
  fail3: 'You die',
  nat20: 'Regain 1 HP and are conscious. All saves reset.',
  nat1: 'Counts as TWO failures',
  damage: 'Taking damage while at 0 HP = automatic failure. Critical hit (attacker within 5ft) = 2 failures.',
  healing: 'ANY healing while at 0 HP brings you back conscious with that many HP. Resets saves.',
  stable: 'Stabilized: regain 1 HP after 1d4 hours. No more death saves unless damaged.',
};

export const DEATH_SAVE_MATH = {
  singleSaveSuccess: '55% (roll 10+)',
  singleSaveFailure: '45% (roll 1-9)',
  nat1Chance: '5% (counts as 2 failures)',
  nat20Chance: '5% (get up with 1 HP)',
  surviveAll3: '59.51% chance to stabilize before 3 failures',
  dieAll3: '40.49% chance of death (before any help)',
  firstRoundDeath: '15% chance of dying in a single turn (nat 1 = 2 fails, then fail = dead on next turn or another hit)',
  note: 'These odds assume no outside intervention. Healing Word changes everything.',
};

export const PARTY_RESPONSE_PROTOCOL = [
  { priority: 1, action: 'Healing Word (bonus action, 60ft range)', who: 'Cleric/Bard/Druid', reason: 'Gets ally up from range as bonus action. Still have your action. The #1 response.', timing: 'Immediately on your turn' },
  { priority: 2, action: 'Lay on Hands (1 HP)', who: 'Paladin', reason: 'Only 1 HP needed to get them up. Costs action + touch range.', timing: 'Your turn if adjacent' },
  { priority: 3, action: 'Healing potion', who: 'Anyone adjacent', reason: 'Costs their action to administer. 2d4+2 HP. Better than nothing.', timing: 'If no healer available' },
  { priority: 4, action: 'Medicine check DC 10 (Stabilize)', who: 'Anyone adjacent', reason: 'Stabilizes but doesn\'t wake them up. Last resort.', timing: 'Only if no healing available' },
  { priority: 5, action: 'Spare the Dying (cantrip)', who: 'Cleric', reason: 'Touch range, action. Stabilizes. Worse than Healing Word in every way.', timing: 'Don\'t use this. Use Healing Word instead.' },
  { priority: 6, action: 'Kill the thing hitting the downed ally', who: 'Anyone', reason: 'Dead enemies can\'t force more death save failures. Prevent the double-tap.', timing: 'If enemy is about to hit the downed ally' },
];

export const YO_YO_HEALING = {
  name: 'Yo-yo healing / Pop-up healing',
  description: 'Let ally drop to 0, then Healing Word for 1d4+mod to bring them back. They act on their turn. Repeat.',
  advantages: [
    'Keeps Healing Word for when it\'s needed most',
    'Ally gets full action + movement when popped up',
    'Very efficient use of low-level spell slots',
    'Bonus action, so healer still gets their action',
  ],
  disadvantages: [
    'Each drop to 0 = risk of death (enemy hits while down)',
    'Enemy attacks on downed ally = auto-fails (and crits within 5ft)',
    'Exhaustion variant rule: some DMs add exhaustion on going to 0',
    'Feels bad narratively — "I die and come back every round"',
  ],
  when: 'Best in ranged combat or when enemies can\'t easily reach the downed ally.',
};

export const STABILIZE_VS_HEAL = {
  stabilize: {
    methods: ['Spare the Dying (cantrip, touch, action)', 'Medicine check DC 10 (action)', 'Healer\'s Kit (action, no check)'],
    result: 'Stop death saves. Stay at 0 HP. Unconscious for 1d4 hours.',
    when: 'When you have NO healing and the combat is almost over.',
  },
  heal: {
    methods: ['Healing Word (bonus, 60ft)', 'Cure Wounds (action, touch)', 'Potion (action, touch)', 'Lay on Hands (action, touch)'],
    result: 'Conscious immediately. Can act on their turn.',
    when: 'ALWAYS prefer this over stabilizing. Even 1 HP is infinitely better than 0.',
  },
  verdict: 'Always heal if possible. A conscious ally at 1 HP is worth more than a stable ally at 0 HP.',
};

export function survivalChance(currentSuccesses, currentFailures) {
  // Simplified survival probability from current state
  if (currentSuccesses >= 3) return 100;
  if (currentFailures >= 3) return 0;
  // Rough estimates based on remaining saves needed
  const successNeeded = 3 - currentSuccesses;
  const failuresLeft = 3 - currentFailures;
  // Simplified binomial-ish calculation
  const p = 0.55; // 55% chance of success per save
  if (successNeeded === 1 && failuresLeft === 1) return 55;
  if (successNeeded === 1 && failuresLeft === 2) return 79.75;
  if (successNeeded === 2 && failuresLeft === 1) return 30.25;
  if (successNeeded === 2 && failuresLeft === 2) return 50.4;
  if (successNeeded === 3 && failuresLeft === 3) return 59.51;
  return 50;
}

export function bestResponse(healingWordAvailable, adjacentToDown, hasHealingPotion) {
  if (healingWordAvailable) return PARTY_RESPONSE_PROTOCOL[0];
  if (adjacentToDown && hasHealingPotion) return PARTY_RESPONSE_PROTOCOL[2];
  if (adjacentToDown) return PARTY_RESPONSE_PROTOCOL[3];
  return PARTY_RESPONSE_PROTOCOL[5]; // Kill the enemy
}
