/**
 * playerDungeonRoles.js
 * Player Mode: Dungeon crawl party roles and procedures
 * Pure JS — no React dependencies.
 */

export const DUNGEON_ROLES = [
  { role: 'Scout', responsibility: 'Move ahead of the party. Check for traps, enemies, and paths.', idealClass: 'Rogue, Ranger, Monk', skills: ['Stealth', 'Perception', 'Investigation', 'Thieves\' Tools'], tips: ['Stay within 60ft of the party', 'Use familiar or Mage Hand for extra safety', 'Signal system: 1 tap = safe, 2 taps = danger, 3 taps = come quick'] },
  { role: 'Mapper', responsibility: 'Track the party\'s route. Note rooms, doors, and landmarks.', idealClass: 'Anyone with paper', skills: ['Cartographer\'s Tools', 'Survival'], tips: ['Draw as you go — don\'t trust memory', 'Mark which doors are locked, trapped, or unexplored', 'Note room numbers for DM reference'] },
  { role: 'Caller', responsibility: 'Communicate party decisions to the DM. Prevent chaos.', idealClass: 'Party leader or face', skills: ['Charisma', 'Leadership'], tips: ['Ask the party before committing to actions', 'Keeps combat moving by prompting turns', 'Prevents the "everyone talks at once" problem'] },
  { role: 'Trap Specialist', responsibility: 'Find and disable traps. Test suspicious areas.', idealClass: 'Rogue, Artificer', skills: ['Investigation', 'Thieves\' Tools', 'Perception'], tips: ['Check doors before opening (handle, frame, hinges)', 'Use a 10ft pole for pressure plates', 'Mage Hand for suspicious objects'] },
  { role: 'Rear Guard', responsibility: 'Watch behind the party. Prevent flanking and ambush.', idealClass: 'Fighter, Paladin, Cleric', skills: ['Perception', 'Athletics'], tips: ['Face backwards periodically', 'Close doors behind the party', 'Mark the path for retreat'] },
  { role: 'Resource Tracker', responsibility: 'Track torches, rations, arrows, spell slots.', idealClass: 'Anyone organized', skills: ['Math'], tips: ['Announce resource levels proactively', 'Track time (torches = 1 hour, lantern oil = 6 hours)', 'Know when to suggest short rests'] },
];

export const DUNGEON_PROCEDURES = [
  { procedure: 'Entering a Room', steps: ['Listen at the door (Perception DC 15)', 'Check for traps (Investigation DC varies)', 'Open carefully (Rogue or 10ft pole)', 'Scout enters, checks corners', 'Signal all-clear for party'] },
  { procedure: 'Checking a Corridor', steps: ['Check for traps every 30ft', 'Note intersections and doors', 'Check ceiling and floor (not just walls)', 'Listen at branches before choosing', 'Mark direction of travel'] },
  { procedure: 'Finding a Locked Door', steps: ['Knock first (really — it sometimes works)', 'Check for traps on the lock/handle', 'Thieves\' Tools (DC 15 typical)', 'Knock spell if available', 'Force it (STR check DC 15-20, LOUD)'] },
  { procedure: 'Rest in a Dungeon', steps: ['Find a defensible room (one entrance ideal)', 'Check for secret doors (monsters use them too)', 'Barricade the door (pitons + rope)', 'Set Alarm spell or tripwire', 'Post a watch (2-hour shifts)'] },
  { procedure: 'Retreat', steps: ['Caller announces retreat', 'Rear guard covers withdrawal', 'Dash action (but watch for opportunity attacks)', 'Close/lock doors behind you', 'Rally at the last safe point'] },
];

export const DUNGEON_HAZARDS = [
  { hazard: 'Darkness', counter: 'Torches, Darkvision, Light cantrip, Driftglobe', note: 'Darkvision treats darkness as dim light — still disadvantage on Perception.' },
  { hazard: 'Collapsing Ceiling', counter: 'DEX save DC 15 or 4d10 bludgeoning. Half on success.', note: 'Usually triggered by traps or combat vibrations.' },
  { hazard: 'Poisonous Gas', counter: 'CON save or poisoned/damage. Gust of Wind clears it.', note: 'Detect Poison and Disease identifies it. Hold breath helps.' },
  { hazard: 'Flooding', counter: 'STR (Athletics) to swim. Heavy armor = disadvantage.', note: 'Waterbreathing trivializes. Water Walk lets you stand on it.' },
  { hazard: 'Webs', counter: 'STR check DC 12 to break free. Fire burns them (clears 5ft/round).', note: 'Giant spiders are nearby. Always.' },
  { hazard: 'Slippery Floor', counter: 'DEX save DC 10 or fall prone.', note: 'Ice, slime, or blood. Affects movement and combat.' },
];

export function getRole(roleName) {
  return DUNGEON_ROLES.find(r =>
    r.role.toLowerCase().includes((roleName || '').toLowerCase())
  ) || null;
}

export function getProcedure(situation) {
  return DUNGEON_PROCEDURES.find(p =>
    p.procedure.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}

export function assignRoles(partyMembers) {
  const roleOrder = ['Scout', 'Trap Specialist', 'Rear Guard', 'Mapper', 'Caller', 'Resource Tracker'];
  return partyMembers.map((member, i) => ({
    member,
    role: roleOrder[i % roleOrder.length],
  }));
}
