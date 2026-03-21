/**
 * playerExplorationChecklist.js
 * Player Mode: Exploration procedures and dungeon room investigation
 * Pure JS — no React dependencies.
 */

export const ROOM_INVESTIGATION_STEPS = [
  { step: 1, action: 'Check for threats', skill: 'Perception', detail: 'Look for enemies, traps, and hazards. Passive Perception catches some automatically.' },
  { step: 2, action: 'Check for traps', skill: 'Investigation / Perception', detail: 'Search door frames, floor tiles, chests. DC 10-20 depending on trap.' },
  { step: 3, action: 'Check for magic', skill: 'Detect Magic (ritual)', detail: 'Sense magic within 30ft. Identifies school of magic on items/effects.' },
  { step: 4, action: 'Search for loot', skill: 'Investigation', detail: 'Search bodies, containers, hidden compartments. DC 15+ for hidden items.' },
  { step: 5, action: 'Check for secrets', skill: 'Investigation / Perception', detail: 'Secret doors, hidden passages, concealed mechanisms. DC 15-25.' },
  { step: 6, action: 'Listen at doors', skill: 'Perception', detail: 'Before opening, listen for activity on the other side.' },
  { step: 7, action: 'Check the ceiling', skill: 'Perception', detail: 'Players always forget the ceiling. Piercers, lurkers, traps above.' },
  { step: 8, action: 'Map the room', skill: 'None', detail: 'Sketch layout, note exits, mark explored areas.' },
];

export const EXPLORATION_ROLES = [
  { role: 'Point (Scout)', position: 'Front', skills: ['Stealth', 'Perception', 'Thieves\' Tools'], duty: 'Move ahead, check for traps, scout rooms.' },
  { role: 'Mapper', position: 'Middle', skills: ['Investigation', 'Cartographer\'s Tools'], duty: 'Track where the party has been. Note details.' },
  { role: 'Lookout', position: 'Rear', skills: ['Perception', 'Insight'], duty: 'Watch behind the party. Notice followers.' },
  { role: 'Leader', position: 'Middle-Front', skills: ['Persuasion', 'History', 'Religion'], duty: 'Make decisions. Handle NPC encounters.' },
  { role: 'Support', position: 'Middle', skills: ['Medicine', 'Arcana', 'Nature'], duty: 'Identify things. Provide healing. Utility spells.' },
];

export const EXPLORATION_TOOLS = [
  { tool: '10-foot pole', use: 'Probe for traps, pit traps, pressure plates. The classic.' },
  { tool: 'Ball bearings', use: 'Spread on floor to detect invisible creatures or trap pursuers.' },
  { tool: 'Chalk', use: 'Mark explored passages. Leave messages. Track where you\'ve been.' },
  { tool: 'Pitons', use: 'Climbing anchors. Wedge doors open (or shut).' },
  { tool: 'Mirror', use: 'Look around corners without exposing yourself.' },
  { tool: 'String', use: 'Tie to entrance. Never get lost in a maze.' },
  { tool: 'Caltrops', use: 'Scatter behind you to slow pursuers.' },
  { tool: 'Holy water', use: 'Detect shapeshifters, harm undead/fiends, test suspicious liquids.' },
];

export function createExplorationState() {
  return {
    roomsExplored: 0,
    secretsFound: 0,
    trapsTriggered: 0,
    trapsDisarmed: 0,
    currentMarchingOrder: [],
    notes: [],
  };
}

export function getInvestigationStep(stepNumber) {
  return ROOM_INVESTIGATION_STEPS.find(s => s.step === stepNumber) || null;
}
