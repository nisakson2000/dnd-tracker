/**
 * playerSurpriseMechanicsGuide.js
 * Player Mode: Surprise rules — the most misunderstood mechanic
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  misconception: 'There is NO "surprise round" in 5e. Surprise is a condition applied to individual creatures.',
  actual: [
    'DM determines which creatures are surprised (compare Stealth vs passive Perception).',
    'ALL creatures roll initiative normally — even surprised ones.',
    'Surprised creatures can\'t move or take actions on their first turn.',
    'Surprised creatures can\'t take reactions until after their first turn ends.',
    'After their turn passes (doing nothing), they are no longer surprised for the rest of combat.',
  ],
  note: 'A surprised creature with high initiative "wastes" their turn early, then acts normally next round.',
};

export const SURPRISE_EXAMPLES = [
  { scenario: 'Rogue (init 18) surprises Goblin (init 5)', result: 'Rogue acts at 18. Goblin does nothing at 5. Round 2: both act.', note: 'Best case.' },
  { scenario: 'Rogue (init 5) surprises Goblin (init 18)', result: 'Goblin does nothing at 18. Rogue acts at 5. Round 2: both act.', note: 'Goblin wastes turn first.' },
  { scenario: 'Party ambushes 4 goblins, 1 sentry was watching', result: '3 goblins surprised. Sentry acts normally.', note: 'Surprise is per-creature.' },
];

export const ASSASSINATE_AND_SURPRISE = {
  feature: 'Assassinate (Assassin Rogue L3)',
  rules: [
    'Advantage on attacks against creatures that haven\'t taken a turn yet.',
    'Any hit against a surprised creature is a critical hit.',
  ],
  requirements: ['Target must be surprised.', 'You must go before the target in initiative.', 'You must hit.'],
  note: 'Alert feat is S-tier for Assassin Rogues — higher initiative = act before surprised creatures\' turns pass.',
};

export const HOW_TO_SURPRISE = [
  { method: 'Stealth approach', detail: 'Group Stealth vs enemies\' passive Perception. If sneakers beat PP, enemies surprised.', rating: 'S' },
  { method: 'Pass without Trace', detail: '+10 Stealth to all party members. Even heavy armor wearers sneak well.', rating: 'S' },
  { method: 'Disguise/social', detail: 'Approach under false pretenses. DM may grant surprise.', rating: 'A' },
  { method: 'Invisibility', detail: 'Auto-unseen. Still need Stealth for sound.', rating: 'A' },
];

export const ANTI_SURPRISE = [
  { defense: 'Alert feat', effect: 'Can\'t be surprised while conscious.', rating: 'S' },
  { defense: 'Weapon of Warning', effect: 'You and allies within 30ft can\'t be surprised. Advantage on initiative.', rating: 'S' },
  { defense: 'High passive Perception', effect: 'Beat ambushers\' Stealth to detect them.', rating: 'A' },
  { defense: 'Feral Instinct (Barbarian L7)', effect: 'If surprised, can act normally if you rage first.', rating: 'A' },
];

export function surpriseCheck(stealthRoll, passivePerception) {
  const surprised = stealthRoll >= passivePerception;
  return { surprised, note: surprised ? `Stealth ${stealthRoll} ≥ PP ${passivePerception}: surprised.` : `Stealth ${stealthRoll} < PP ${passivePerception}: not surprised.` };
}
