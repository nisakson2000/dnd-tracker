/**
 * playerEncounterBuildingPlayerGuide.js
 * Player Mode: Understanding encounter difficulty from a player perspective
 * Pure JS — no React dependencies.
 */

export const ENCOUNTER_DIFFICULTY_THRESHOLDS = {
  easy: 'Few resources spent. Players might not even use spell slots or class features.',
  medium: 'One or two scares. A few spell slots used. Party should be fine.',
  hard: 'Meaningful challenge. Possible death if luck is bad. Significant resources spent.',
  deadly: 'Serious risk of party members dying. Could be a TPK if things go wrong.',
  note: 'As a player, recognizing difficulty helps you decide when to nova vs conserve resources.',
};

export const RESOURCE_MANAGEMENT_BY_DIFFICULTY = [
  { difficulty: 'Easy', spellSlots: 'Cantrips only. Save everything.', abilities: 'Don\'t use limited features.', healing: 'Short rest healing only.', note: 'These fights exist to drain resources slowly.' },
  { difficulty: 'Medium', spellSlots: 'One L1-2 spell max. Maybe none.', abilities: 'Use renewable features (cantrips, at-will abilities).', healing: 'Healing Word if someone drops.', note: 'Standard encounter. Don\'t overspend.' },
  { difficulty: 'Hard', spellSlots: 'Use key spells (L3-4). Control spells are worth it.', abilities: 'Use class features. Action Surge, Rage, Smites.', healing: 'Active healing may be needed.', note: 'This is where you earn your pay.' },
  { difficulty: 'Deadly', spellSlots: 'Use everything. This is the nova.', abilities: 'All features. Save nothing.', healing: 'Heal aggressively. Prevent deaths.', note: 'Survival mode. Use your best stuff.' },
];

export const ADVENTURING_DAY_PACING = {
  expected: '6-8 medium/hard encounters per long rest with 2 short rests.',
  reality: 'Most tables run 2-4 encounters per long rest. This benefits long-rest casters.',
  shortRestClasses: ['Fighter', 'Warlock', 'Monk', 'Battlemaster'],
  longRestClasses: ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Paladin'],
  note: 'If your DM runs few encounters per day, long-rest classes can nova every fight. Short-rest classes suffer.',
};

export const PLAYER_ENCOUNTER_TIPS = [
  { tip: 'Count encounters since last long rest', detail: 'Track how many fights you\'ve had. If this is fight 1 of 1, use everything. If it\'s fight 1 of 6, conserve.', priority: 'High' },
  { tip: 'Identify the real threat', detail: 'Is it one big boss or many minions? AoE for groups. Single-target removal (Banishment, Hold Monster) for bosses.', priority: 'High' },
  { tip: 'Focus fire', detail: 'Killing enemies removes their damage from the fight. A dead enemy deals 0 DPR. Don\'t spread damage.', priority: 'High' },
  { tip: 'Control > damage early', detail: 'Hypnotic Pattern turn 1 removes half the enemies. Then mop up. Control spells have highest impact in round 1-2.', priority: 'High' },
  { tip: 'Know when to run', detail: 'If 2 party members drop in round 1, consider retreat. Teleportation, fog, Darkness for escape.', priority: 'Medium' },
  { tip: 'Short rest after every 2 fights', detail: 'Hit Dice healing, Warlock slots, Fighter Second Wind, Monk Ki. Short rests are free resources.', priority: 'Medium' },
];

export const NOVA_ROUND_GUIDE = {
  definition: 'Using all your best abilities in one round for maximum damage/impact.',
  whenToNova: [
    'Boss fight (deadly encounter)',
    'Last encounter before long rest',
    'Enemy is almost dead — one more burst kills it',
    'Ally is about to die — remove the threat NOW',
  ],
  whenNotToNova: [
    'First encounter of a long day',
    'Against weak enemies (conserve resources)',
    'When the enemy has legendary resistances (waste of save-or-suck spells)',
    'When unsure of remaining encounters',
  ],
};

export function shouldNova(encounterNumber, totalExpected, isDeadly, allyInDanger) {
  if (allyInDanger) return { nova: true, reason: 'Ally in danger — remove threat immediately.' };
  if (isDeadly) return { nova: true, reason: 'Deadly encounter — use best resources.' };
  if (encounterNumber >= totalExpected) return { nova: true, reason: 'Last encounter — nothing to save for.' };
  if (encounterNumber <= 1 && totalExpected >= 4) return { nova: false, reason: 'Early in the day — conserve resources.' };
  return { nova: false, reason: 'Save resources for harder encounters.' };
}
