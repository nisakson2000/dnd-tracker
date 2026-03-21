/**
 * playerEscapeStrategies.js
 * Player Mode: Escape plans and retreat tactics when combat goes wrong
 * Pure JS — no React dependencies.
 */

export const RETREAT_SIGNALS = [
  { signal: 'Half the party is down', severity: 'Critical', action: 'Immediate retreat. Someone covers with Fog Cloud or Darkness.' },
  { signal: 'Healer is unconscious', severity: 'Critical', action: 'No healing = death spiral. Retreat or someone stabilizes healer.' },
  { signal: 'Out of spell slots', severity: 'High', action: 'Casters are reduced to cantrips. Strongly consider retreating.' },
  { signal: 'Enemy has Legendary Resistance + full HP', severity: 'High', action: 'This fight will be very long. Assess if you can sustain it.' },
  { signal: 'Reinforcements arriving', severity: 'High', action: 'More enemies = worse action economy. Leave before they arrive.' },
  { signal: 'Tank is at <25% HP', severity: 'Moderate', action: 'Front line is about to collapse. Heal or fall back.' },
  { signal: 'Key abilities used (Rage, Wild Shape, etc.)', severity: 'Moderate', action: 'Resources depleted. The fight is getting harder, not easier.' },
];

export const ESCAPE_METHODS = [
  { method: 'Fog Cloud / Darkness', type: 'Spell', level: 1, detail: 'Block line of sight. Enemies can\'t target what they can\'t see. Run.' },
  { method: 'Misty Step', type: 'Spell', level: 2, detail: 'Bonus action teleport 30ft. Escape grapples, restraints, and reach.' },
  { method: 'Dimension Door', type: 'Spell', level: 4, detail: 'Teleport 500ft with one ally. The ultimate escape.' },
  { method: 'Disengage + Dash', type: 'Action', level: null, detail: 'Disengage to avoid OA, then move full speed. Two turns to fully flee.' },
  { method: 'Cunning Action Disengage', type: 'Class', level: null, detail: 'Rogue: Disengage as bonus action, then Dash as action. Instant escape.' },
  { method: 'Scatter (6th)', type: 'Spell', level: 6, detail: 'Teleport up to 5 creatures 120ft. Entire party escape.' },
  { method: 'Thunder Step (3rd)', type: 'Spell', level: 3, detail: 'Teleport 90ft + bring one ally. Deals damage to enemies near origin.' },
  { method: 'Polymorph into bird', type: 'Spell', level: 4, detail: 'Turn an ally into a Giant Eagle. They fly everyone out.' },
  { method: 'Smoke bomb / caltrops / ball bearings', type: 'Item', level: null, detail: 'Slow pursuers. Improvised escape tools.' },
  { method: 'Phantasmal Force', type: 'Spell', level: 2, detail: 'Create an illusory wall/fire blocking pursuit. Enemy believes it\'s real.' },
];

export const REARGUARD_TACTICS = [
  'One person stays behind to buy time (ideally the tankiest or fastest).',
  'Use Wall spells (Wall of Fire, Wall of Force) to block pursuit.',
  'Create difficult terrain behind you (Spike Growth, Grease).',
  'Caltrops and ball bearings slow pursuers.',
  'Darkness/Fog Cloud at chokepoints blocks line of sight.',
  'The rearguard Dashes after the party has a 1-round head start.',
];

export function assessRetreat(partyHP, partyDown, totalPartySize, slotsRemaining) {
  const downPercent = partyDown / totalPartySize;
  if (downPercent >= 0.5) return { recommendation: 'RETREAT NOW', color: '#f44336' };
  if (partyHP < 25 && slotsRemaining <= 1) return { recommendation: 'Strongly consider retreat', color: '#ff5722' };
  if (partyHP < 40 || downPercent >= 0.25) return { recommendation: 'Prepare escape route', color: '#ff9800' };
  return { recommendation: 'Hold position', color: '#4caf50' };
}
