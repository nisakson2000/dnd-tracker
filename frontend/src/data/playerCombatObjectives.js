/**
 * playerCombatObjectives.js
 * Player Mode: Non-kill combat objectives and win conditions
 * Pure JS — no React dependencies.
 */

export const COMBAT_OBJECTIVES = [
  {
    objective: 'Defeat All Enemies',
    description: 'Standard kill/incapacitate all hostile creatures.',
    tactics: ['Focus fire on one target at a time.', 'Take out the biggest threat first (usually spellcasters).', 'Use AoE on clustered enemies.'],
    priority: 'common',
  },
  {
    objective: 'Protect the NPC',
    description: 'Keep a VIP alive while enemies try to reach them.',
    tactics: ['Position tanks between NPC and enemies.', 'Use Sanctuary or Shield of Faith on the NPC.', 'Have the NPC take Dodge or Dash actions.', 'Healing Word (bonus action) to keep NPC standing.'],
    priority: 'common',
  },
  {
    objective: 'Escape / Reach the Exit',
    description: 'Get the party to a specific location, not necessarily fighting.',
    tactics: ['Dash as your action when possible.', 'Use Fog Cloud/Darkness to block pursuit.', 'Designate a rear guard to delay enemies.', 'Monks and Rogues go first to clear the path.'],
    priority: 'common',
  },
  {
    objective: 'Hold the Position',
    description: 'Defend a location for X rounds or until reinforcements arrive.',
    tactics: ['Use chokepoint formation.', 'Barricade entrances (Arcane Lock, furniture).', 'Concentrate fire on enemies that breach the perimeter.', 'Save resources — this is a marathon, not a sprint.'],
    priority: 'uncommon',
  },
  {
    objective: 'Destroy the Object',
    description: 'Break a MacGuffin, altar, crystal, portal, etc.',
    tactics: ['One person focuses on the object while others defend.', 'Check object immunities (many objects immune to poison/psychic).', 'Use Disintegrate or Shatter for objects.', 'Objects have AC (usually 10-19) and HP.'],
    priority: 'uncommon',
  },
  {
    objective: 'Capture Alive',
    description: 'Knock unconscious, not kill. Need information.',
    tactics: ['Melee attacks can choose to knock out at 0 HP (PHB p.198).', 'Use Sleep, Hold Person, or Command (Surrender).', 'Avoid AoE damage (can\'t choose nonlethal at range).', 'Have Manacles ready.'],
    priority: 'uncommon',
  },
  {
    objective: 'Survive X Rounds',
    description: 'Stall for time — reinforcements, ritual completion, etc.',
    tactics: ['Dodge action is your friend.', 'Prioritize healing over damage.', 'Use control spells to limit enemy actions.', 'Fall back and force enemies to spend turns moving.'],
    priority: 'uncommon',
  },
  {
    objective: 'Stealth Encounter',
    description: 'Complete objective without being detected.',
    tactics: ['Pass without Trace is essential (+10 Stealth).', 'Use Silence for noisy actions.', 'Invisibility for key members.', 'Have a Plan B if detected.', 'Nonlethal takedowns of sentries.'],
    priority: 'uncommon',
  },
];

export const NONLETHAL_RULES = {
  melee: 'When you reduce a creature to 0 HP with a melee attack, you can choose to knock it unconscious instead of killing it.',
  ranged: 'RAW: nonlethal only works with melee attacks. Ranged attacks always kill at 0 HP.',
  spells: 'Most damaging spells kill at 0 HP. DM may allow nonlethal for some spells.',
  sleep: 'Sleep spell incapacitates without damage — best for capture.',
  holdPerson: 'Paralyzed target can be tied up easily.',
};

export function getObjective(name) {
  return COMBAT_OBJECTIVES.find(o => o.objective.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getCommonObjectives() {
  return COMBAT_OBJECTIVES.filter(o => o.priority === 'common');
}
