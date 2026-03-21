/**
 * playerTeleportationGuide.js
 * Player Mode: Teleportation spells ranked, mishap tables, and tactical uses
 * Pure JS — no React dependencies.
 */

export const TELEPORT_SPELLS = [
  { spell: 'Misty Step', level: 2, range: '30ft', targets: 'Self', action: 'Bonus action', note: 'No verbal (somatic only). Best escape tool. BA = still attack.', rating: 'S' },
  { spell: 'Thunder Step', level: 3, range: '90ft', targets: 'Self + 1 willing', action: 'Action', note: '3d10 thunder at departure point. Teleport + damage + rescue.', rating: 'A' },
  { spell: 'Dimension Door', level: 4, range: '500ft', targets: 'Self + 1 willing', action: 'Action', note: '500ft range. Don\'t need to see destination. Can go through walls.', rating: 'S' },
  { spell: 'Far Step', level: 5, range: '60ft/turn', targets: 'Self', action: 'BA each turn', note: 'Concentration. BA teleport 60ft every turn for 1 minute.', rating: 'A' },
  { spell: 'Teleport', level: 7, range: 'Global', targets: '8 creatures or 10ft cube', action: 'Action', note: 'Go anywhere. Accuracy depends on familiarity. Mishap possible.', rating: 'S' },
  { spell: 'Plane Shift', level: 7, range: 'Another plane', targets: '8 willing or 1 unwilling (CHA save)', action: 'Action', note: 'Travel between planes. Also works as banishment (CHA save).', rating: 'S' },
  { spell: 'Teleportation Circle', level: 5, range: 'Known circle', targets: 'Everyone who steps through', action: '1 minute', note: 'Reliable (no mishap) if you know the destination sigil. 1 min = not for combat.', rating: 'A' },
  { spell: 'Word of Recall', level: 6, range: 'Sanctuary', targets: '5 creatures', action: 'Action', note: 'Instant teleport to your designated sanctuary. No mishap. Perfect escape.', rating: 'S' },
  { spell: 'Transport via Plants', level: 6, range: 'Any plant on same plane', targets: 'Unlimited through', action: 'Action', note: 'Step through one plant, exit another anywhere on the plane. No mishap.', rating: 'A' },
  { spell: 'Gate', level: 9, range: 'Any plane', targets: 'Portal', action: 'Action', note: 'Open a portal to anywhere. Also summons named creatures.', rating: 'S' },
];

export const TELEPORT_ACCURACY = [
  { familiarity: 'Permanent Circle', onTarget: '100%', offTarget: '-', similar: '-', mishap: '-' },
  { familiarity: 'Associated Object', onTarget: '100%', offTarget: '-', similar: '-', mishap: '-' },
  { familiarity: 'Very Familiar', onTarget: '01-97', offTarget: '98-99', similar: '100', mishap: '-' },
  { familiarity: 'Seen Casually', onTarget: '01-88', offTarget: '89-94', similar: '95-98', mishap: '99-100' },
  { familiarity: 'Viewed Once', onTarget: '01-76', offTarget: '77-88', similar: '89-96', mishap: '97-100' },
  { familiarity: 'Description', onTarget: '01-50', offTarget: '51-74', similar: '75-88', mishap: '89-100' },
  { familiarity: 'False Destination', onTarget: '-', offTarget: '-', similar: '01-50', mishap: '51-100' },
];

export const TACTICAL_TELEPORTATION = [
  { tactic: 'Escape from grapple/restrain', detail: 'Misty Step: BA, no verbal. Teleports you out of any grapple, web, or restraint.', rating: 'S' },
  { tactic: 'Rescue downed ally', detail: 'Thunder Step or Dimension Door: grab an unconscious ally and teleport both of you away.', rating: 'S' },
  { tactic: 'Vertical teleport', detail: 'Misty Step onto a roof, ledge, or flying creature. Or Dimension Door straight up.', rating: 'A' },
  { tactic: 'Bypass walls/doors', detail: 'Dimension Door: 500ft, no line of sight needed. Go through walls and locked doors.', rating: 'S' },
  { tactic: 'Offensive Plane Shift', detail: 'Plane Shift as an attack: CHA save or banished to another plane. Fight-ending.', rating: 'S' },
  { tactic: 'Scatter (6th level)', detail: 'Rearrange up to 5 creatures on the battlefield. Swap positions tactically.', rating: 'A' },
];

export const ANTI_TELEPORTATION = [
  { method: 'Forbiddance (6th, ritual)', effect: 'No teleportation within the area. Also damages non-attuned creatures entering.' },
  { method: 'Forcecage', effect: 'CHA save DC 17 to teleport out. Most fail.' },
  { method: 'Private Sanctum (4th)', effect: 'No teleportation into or out of the area.' },
  { method: 'Dimensional Shackles', effect: 'Prevents teleportation while worn.' },
  { method: 'Antimagic Field', effect: 'No magic = no teleportation.' },
];

export function teleportMishapChance(familiarity) {
  const chances = { 'Very Familiar': 0, 'Seen Casually': 2, 'Viewed Once': 4, 'Description': 12, 'False Destination': 50 };
  return chances[familiarity] || 0;
}
