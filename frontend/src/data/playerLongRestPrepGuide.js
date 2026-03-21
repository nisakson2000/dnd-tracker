/**
 * playerLongRestPrepGuide.js
 * Player Mode: Long rest preparation — what to do before and after resting
 * Pure JS — no React dependencies.
 */

export const LONG_REST_RULES = {
  duration: '8 hours. At least 6 hours sleeping. Up to 2 hours light activity.',
  recovery: 'Regain all HP. Recover half total Hit Dice (rounded down). All spell slots. Most class features.',
  frequency: 'One per 24-hour period.',
  interruption: 'Combat or strenuous activity (1+ hour) interrupts. Must restart.',
  lightActivity: 'Reading, talking, eating, standing watch (up to 2 hours) is fine.',
  note: 'Elves: Trance = 4 hours of meditation instead of 8 hours sleep.',
};

export const BEFORE_LONG_REST = [
  { action: 'Cast Long-Duration Spells', why: 'Mage Armor (8h), Aid (8h), Goodberry (24h). Cast before sleeping — they last through rest.', note: 'Use leftover slots before resting. They refresh anyway.' },
  { action: 'Burn Remaining Spell Slots', why: 'Goodberry with leftover L1 slots. Create Food and Water. Healing before rest.', note: 'Don\'t waste slots. Use for utility before they reset.' },
  { action: 'Set Up Alarm (Ritual)', why: 'Wizard/Ranger: Alarm spell protects camp. 8-hour duration. Ritual = no slot.', note: 'Multiple Alarms around camp = perimeter security.' },
  { action: 'Tiny Hut (Ritual)', why: 'Wizard L5+: Leomund\'s Tiny Hut. Impenetrable dome. Safe rest guaranteed.', note: 'Ritual cast. No slot. Best rest protection.' },
  { action: 'Set Watch Order', why: 'At least one person awake at all times. Rotate every 2 hours.', note: '4 party members = 2 hours each. Everyone gets enough sleep.' },
  { action: 'Identify Magic Items', why: 'Use remaining time to Identify items found during the day.', note: 'Ritual cast Identify during the 2 hours of light activity.' },
];

export const AFTER_LONG_REST = [
  { action: 'Prepare Spells', why: 'Wizards, Clerics, Druids, Paladins: choose prepared spells for the day.', note: 'Adapt to expected challenges. Going to fight undead? Prepare Turn Undead spells.' },
  { action: 'Cast Morning Buffs', why: 'Mage Armor, Aid, Death Ward, Heroes\' Feast — long-duration spells.', note: 'Cast before leaving camp. 8-hour buffs last most of the day.' },
  { action: 'Arcane Recovery (Wizard)', why: 'If you used Arcane Recovery yesterday, it resets.', note: 'Save for after your first fight today.' },
  { action: 'Inspiring Leader Speech', why: '10 minutes. 6 allies get level+CHA temp HP.', note: 'Free temp HP for the whole party. Do this every morning.' },
  { action: 'Check Inventory', why: 'Healing potions? Diamonds for Revivify? Rations? Torches?', note: 'Make sure you\'re stocked before leaving camp.' },
  { action: 'Goodberry Stockpile', why: 'Goodberries from last night still have 24 hours. Eat breakfast.', note: '10 berries = 10 HP total. Free healing/food.' },
];

export const EFFICIENT_REST = [
  { tip: 'Cast long-duration spells before sleeping. They persist through rest.' },
  { tip: 'Burn leftover slots on Goodberry. 10 berries per L1 slot.' },
  { tip: 'Tiny Hut: best rest protection. Ritual cast. No slot.' },
  { tip: 'Alarm: ritual perimeter security. Multiple alarms = safe.' },
  { tip: 'Prepare spells for expected encounters. Adapt daily.' },
  { tip: 'Morning buffs: Aid, Mage Armor, Death Ward before leaving camp.' },
  { tip: 'Inspiring Leader: 10-min speech. Party temp HP every morning.' },
  { tip: 'Check inventory: potions, diamonds, rations, components.' },
  { tip: 'Catnap (L3): 10-minute short rest for 3 creatures. Quick recovery.' },
  { tip: 'Elves: 4-hour Trance. More time for watch duty and activities.' },
];
