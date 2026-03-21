/**
 * playerTurnOrderFlowGuide.js
 * Player Mode: Combat turn structure — what you can do and in what order
 * Pure JS — no React dependencies.
 */

export const TURN_STRUCTURE = {
  components: [
    { component: 'Movement', detail: 'Up to your speed. Can split before/after actions.' },
    { component: 'Action', detail: 'Attack, Cast Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object.' },
    { component: 'Bonus Action', detail: 'Only if something grants one. Cannot substitute for Action.' },
    { component: 'Free Object Interaction', detail: 'One free: draw/sheathe weapon, open door, pick up item.' },
    { component: 'Reaction', detail: 'One per round. Opportunity Attack, Shield, Counterspell, etc.' },
  ],
  order: 'You can take Movement, Action, and BA in ANY order. Can split movement around actions.',
};

export const ACTIONS_EXPLAINED = [
  { action: 'Attack', detail: 'Make weapon attacks. Extra Attack = multiple within one Action.', note: 'Can replace one attack with grapple or shove.' },
  { action: 'Cast a Spell', detail: 'Cast one spell with casting time of 1 action.', note: 'BA spell rule: if you cast BA spell, action spell must be cantrip.' },
  { action: 'Dash', detail: 'Gain extra movement equal to your speed.', note: 'Double your movement for the turn. Stacks with BA Dash.' },
  { action: 'Disengage', detail: 'Your movement doesn\'t provoke OAs this turn.', note: 'Rogue/Monk get this as BA. Others must use Action.' },
  { action: 'Dodge', detail: 'Attacks against you have disadvantage. Advantage on DEX saves.', note: 'Great when you can\'t do anything useful offensively.' },
  { action: 'Help', detail: 'Give ally advantage on next attack or ability check.', note: 'Must be within 5ft of target for attack advantage.' },
  { action: 'Hide', detail: 'Stealth check. Become hidden.', note: 'Must be obscured. Attacks from hidden = advantage.' },
  { action: 'Ready', detail: 'Prepare action for a trigger. Uses reaction to execute.', note: 'Readied spell = concentration. Uses slot even if not triggered.' },
  { action: 'Search', detail: 'Perception or Investigation check.', note: 'Active search for hidden things.' },
  { action: 'Use Object', detail: 'Use an item that requires action (potion, item, etc.).', note: 'Some DMs allow potion as BA (house rule).' },
];

export const FREE_INTERACTIONS = [
  'Draw or sheathe ONE weapon.',
  'Open or close a door.',
  'Pick up a dropped item.',
  'Hand an item to another creature.',
  'Pull a lever or flip a switch.',
  'Retrieve an item from a container you\'re wearing.',
  'NOTE: Two weapons require two interactions. Drop one (free) + draw new (interaction).',
];

export const COMMON_TURN_SEQUENCES = [
  { name: 'Standard Melee', sequence: 'Move → Attack Action → BA (if available) → remaining movement.', note: 'Most turns look like this.' },
  { name: 'Rogue Hit & Run', sequence: 'Move to target → Attack → Cunning Action Disengage (BA) → Move away.', note: 'Attack + escape every turn.' },
  { name: 'Caster Turn', sequence: 'Cast concentration spell (Action) → Move to safety → BA (if available).', note: 'Cast then reposition.' },
  { name: 'Monk Combo', sequence: 'Move → Attack Action (2 attacks) → Flurry of Blows (BA, 2 more) → Stunning Strike.', note: '4 attacks per turn.' },
  { name: 'Paladin Smite Turn', sequence: 'Move → Attack (Extra Attack) → Smite on hit → BA Smite spell (if applicable).', note: 'Declare smite after hit confirmed.' },
  { name: 'Defensive Turn', sequence: 'Dodge (Action) → no movement if possible → save reaction for Shield.', note: 'When you\'re focused by multiple enemies.' },
];

export const TURN_TIPS = [
  'Split movement: move 15ft, attack, move remaining 15ft.',
  'BA spell + cantrip: if you cast Healing Word (BA), only cantrip with Action.',
  'Free interaction: draw weapon for free. Sheathe one + draw another = 2 interactions (need extra).',
  'Ready Action: uses reaction AND concentration (for spells). Usually not worth it.',
  'Dodge when you can\'t reach enemies or have nothing better to do.',
  'Help action: give ally advantage. Familiar can do this.',
  'One reaction per ROUND (your turn to your next turn).',
  'Plan your turn during others\' turns. Don\'t waste table time.',
  'You can take actions in any order. Move-Attack-Move is legal.',
  'Drop a weapon = free. No action cost. Useful for hand management.',
];
