/**
 * playerCombatChecklists.js
 * Player Mode: Pre-combat, during-combat, and post-combat checklists
 * Pure JS — no React dependencies.
 */

export const PRE_COMBAT_CHECKLIST = [
  { id: 'pc1', task: 'Check buff spells active', category: 'Spells', detail: 'Mage Armor, Aid, Death Ward, Longstrider still up?' },
  { id: 'pc2', task: 'Note your initiative modifier', category: 'Stats', detail: 'DEX mod + any bonuses (Alert, Weapon of Warning, etc.)' },
  { id: 'pc3', task: 'Review available spell slots', category: 'Resources', detail: 'Know what you have left before committing.' },
  { id: 'pc4', task: 'Check weapon in hand', category: 'Equipment', detail: 'Is your weapon drawn? Shield equipped?' },
  { id: 'pc5', task: 'Review class resources', category: 'Resources', detail: 'Rage charges, Ki points, Channel Divinity, etc.' },
  { id: 'pc6', task: 'Note party positions', category: 'Tactics', detail: 'Who\'s up front? Who needs protection?' },
  { id: 'pc7', task: 'Consider surprise', category: 'Tactics', detail: 'Can we ambush? Are WE being ambushed?' },
  { id: 'pc8', task: 'Check concentration', category: 'Spells', detail: 'Are you concentrating on something? Is it still the best use?' },
];

export const TURN_CHECKLIST = [
  { id: 't1', task: 'Start-of-turn effects', category: 'Effects', detail: 'Auras, Spirit Guardians damage, regeneration, etc.' },
  { id: 't2', task: 'Movement plan', category: 'Movement', detail: 'Where do you need to be? Split before/after action?' },
  { id: 't3', task: 'Action', category: 'Action', detail: 'Your main action for the turn.' },
  { id: 't4', task: 'Bonus action', category: 'Bonus', detail: 'Do you have a bonus action available?' },
  { id: 't5', task: 'Free object interaction', category: 'Free', detail: 'Draw/sheathe weapon, open door, pick up item.' },
  { id: 't6', task: 'End-of-turn saves', category: 'Effects', detail: 'Repeat saves vs Hold Person, Frightened, etc.' },
  { id: 't7', task: 'Reaction plan', category: 'Reaction', detail: 'What\'s your reaction this round? Shield? Counterspell? OA?' },
];

export const POST_COMBAT_CHECKLIST = [
  { id: 'post1', task: 'Check for downed allies', category: 'Party', detail: 'Anyone at 0 HP? Stabilize or heal them first.' },
  { id: 'post2', task: 'End concentration spells', category: 'Spells', detail: 'Drop spells you no longer need.' },
  { id: 'post3', task: 'Record resources used', category: 'Resources', detail: 'Spell slots, Ki, Rage, abilities spent.' },
  { id: 'post4', task: 'Loot the area', category: 'Loot', detail: 'Search bodies, check for treasure, gather ammo.' },
  { id: 'post5', task: 'Consider short rest', category: 'Recovery', detail: 'Spend hit dice, recover short rest abilities.' },
  { id: 'post6', task: 'Update HP', category: 'Stats', detail: 'Record current HP after any healing.' },
  { id: 'post7', task: 'Retrieve ammo', category: 'Equipment', detail: 'Recover half your expended ammunition.' },
  { id: 'post8', task: 'Check temp HP', category: 'Stats', detail: 'Temp HP may have expired (Heroism, etc.).' },
];

export function getChecklist(phase) {
  if (phase === 'pre') return PRE_COMBAT_CHECKLIST;
  if (phase === 'turn') return TURN_CHECKLIST;
  if (phase === 'post') return POST_COMBAT_CHECKLIST;
  return [];
}

export function createChecklistState(phase) {
  return getChecklist(phase).map(item => ({ ...item, checked: false }));
}
