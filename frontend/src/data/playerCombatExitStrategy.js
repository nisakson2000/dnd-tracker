/**
 * playerCombatExitStrategy.js
 * Player Mode: Tactical combat ending — mopping up, securing the area
 * Pure JS — no React dependencies.
 */

export const COMBAT_ENDING_PHASES = [
  { phase: 1, name: 'Mop Up', tasks: ['Finish off remaining enemies', 'Secure unconscious/surrendering foes', 'Check for hidden enemies (Perception)'], timing: 'Last enemy drops' },
  { phase: 2, name: 'Triage', tasks: ['Stabilize or heal downed allies', 'Check for death saves in progress', 'Apply first aid to injured NPCs'], timing: 'Immediately after combat' },
  { phase: 3, name: 'Secure Area', tasks: ['Check for traps or reinforcements', 'Lock/bar doors', 'Set up defensive positions'], timing: '1-2 minutes post-combat' },
  { phase: 4, name: 'Loot & Search', tasks: ['Search bodies for valuables', 'Detect Magic on interesting items', 'Recover spent ammunition (50%)'], timing: '5-10 minutes post-combat' },
  { phase: 5, name: 'Recovery', tasks: ['Consider short rest', 'Spend hit dice', 'Reassess resources and plan next steps'], timing: '10+ minutes post-combat' },
];

export const PRISONER_HANDLING = [
  { option: 'Interrogate', method: 'Intimidation/Persuasion check. Zone of Truth if available.', risk: 'May lie without Zone of Truth. Charm Person helps but they know afterward.' },
  { option: 'Release', method: 'Let them go with a warning.', risk: 'May alert allies or return with reinforcements.' },
  { option: 'Bind and Leave', method: 'Tie up with rope (DC 20 Athletics/Acrobatics to escape).', risk: 'Will eventually escape. Someone may find them.' },
  { option: 'Turn In', method: 'Bring to authorities.', risk: 'Slows travel. May have bounty value.' },
  { option: 'Recruit', method: 'Persuasion to join your side.', risk: 'Loyalty uncertain. May betray at worst time.' },
];

export const NONLETHAL_RULES = {
  meleeOnly: 'You can choose to knock out instead of kill with MELEE attacks only (not ranged/spells).',
  declaration: 'Declare nonlethal when the attack drops the target to 0 HP.',
  result: 'Target is unconscious and stable (not dying).',
  note: 'Spells with attack rolls or saves CANNOT be nonlethal by default (DM discretion).',
};

export const LOOT_SEARCH_CHECKLIST = [
  { item: 'Weapons & Armor', check: 'Anything magical or valuable?', skill: 'None' },
  { item: 'Gold & Gems', check: 'Search pouches and pockets.', skill: 'Investigation DC 10' },
  { item: 'Magic Items', check: 'Detect Magic (ritual) reveals auras.', skill: 'Arcana to identify' },
  { item: 'Keys & Documents', check: 'Letters, maps, keys to locked doors.', skill: 'Investigation DC 12' },
  { item: 'Hidden Items', check: 'False bottoms, hidden sheaths, hollow heels.', skill: 'Investigation DC 15+' },
  { item: 'Ammunition', check: 'Recover half your expended ammo.', skill: 'None' },
  { item: 'Spell Components', check: 'Component pouches, foci, diamonds.', skill: 'Arcana DC 10' },
  { item: 'Monster Parts', check: 'Teeth, hide, organs for crafting/selling.', skill: 'Nature/Survival DC 12' },
];

export function getCombatEndPhase(minutesSinceCombat) {
  if (minutesSinceCombat < 1) return COMBAT_ENDING_PHASES[0];
  if (minutesSinceCombat < 2) return COMBAT_ENDING_PHASES[1];
  if (minutesSinceCombat < 5) return COMBAT_ENDING_PHASES[2];
  if (minutesSinceCombat < 10) return COMBAT_ENDING_PHASES[3];
  return COMBAT_ENDING_PHASES[4];
}
