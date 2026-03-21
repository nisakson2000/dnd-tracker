/**
 * playerTPKPrevention.js
 * Player Mode: Total Party Kill prevention strategies
 * Pure JS — no React dependencies.
 */

export const TPK_WARNING_SIGNS = [
  { sign: 'Multiple party members below 25% HP', severity: 'High', action: 'Mass Healing Word or Heal. Consider retreat.' },
  { sign: '2+ party members unconscious', severity: 'Critical', action: 'Immediate healing. Cover retreat. Use everything.' },
  { sign: 'No spell slots remaining on healers', severity: 'High', action: 'Potions only. Short rest if possible. Retreat if not.' },
  { sign: 'Action economy heavily against you', severity: 'High', action: 'AoE control spells to equalize. Or retreat to a chokepoint.' },
  { sign: 'Boss hasn\'t used Legendary Resistance yet', severity: 'Medium', action: 'Your save-or-suck spells won\'t work until LR is burned.' },
  { sign: 'Enemy reinforcements arriving', severity: 'High', action: 'Finish current enemies FAST or retreat before reinforcements arrive.' },
  { sign: 'Caster lost concentration on key buff', severity: 'Medium', action: 'Reassess tactics. The fight just got harder.' },
  { sign: 'Tank is down', severity: 'Critical', action: 'Enemies now have free access to backline. Someone must step up.' },
];

export const EMERGENCY_ACTIONS = [
  { action: 'Fog Cloud / Darkness', effect: 'Break line of sight. Enemies can\'t target you with spells or attacks.', slot: '1st / 2nd', note: 'Cast between you and enemies. Use the obscurement to retreat or regroup.' },
  { action: 'Wall of Force (dome)', effect: 'Impervious dome protects the party. 10 minutes to plan.', slot: '5th', note: 'Nothing gets through. Use the time to heal, plan, and prepare.' },
  { action: 'Mass Healing Word', effect: 'Get ALL downed allies up in one bonus action.', slot: '3rd', note: '1d4+mod isn\'t much, but alive at 1 HP is infinitely better than unconscious.' },
  { action: 'Polymorph (Giant Ape)', effect: 'Instant 157 HP tank on the field.', slot: '4th', note: 'Turn yourself or an ally into a Giant Ape. Huge HP pool buys time.' },
  { action: 'Dimension Door', effect: 'Teleport 500ft with one willing creature.', slot: '4th', note: 'Grab the most critical party member and get them to safety.' },
  { action: 'Scatter (Xanathar\'s)', effect: 'Teleport up to 5 creatures 120ft each.', slot: '6th', note: 'Move the entire party to safety in one action. Emergency extraction.' },
  { action: 'Teleport', effect: 'Party-wide escape to a known location.', slot: '7th', note: 'Nuclear retreat option. Some chance of mishap but beats TPK.' },
  { action: 'Divine Intervention', effect: 'Cleric calls upon their deity. Level % chance of success.', slot: 'Free', note: 'Worth trying in desperate situations. Auto-success at level 20.' },
];

export const RETREAT_PROTOCOL = [
  { step: 1, action: 'CALLER announces retreat', detail: 'Someone clearly says "RETREAT!" so everyone knows the plan.' },
  { step: 2, action: 'Fog Cloud / obscurement', detail: 'Break line of sight between party and enemies. Prevents spell targeting and opportunity attacks with advantage.' },
  { step: 3, action: 'Healer revives downed allies', detail: 'Healing Word (bonus action, 60ft) to get unconscious allies on their feet. Even 1 HP is enough to run.' },
  { step: 4, action: 'Tank covers withdrawal', detail: 'Rear guard uses Dodge action while retreating. Sentinel to slow pursuers.' },
  { step: 5, action: 'Dash to safety', detail: 'Everyone uses Dash action to move double speed. Monks use Step of the Wind.' },
  { step: 6, action: 'Close/block passage', detail: 'Shut doors, collapse tunnels, cast Wall spells behind you. Prevent pursuit.' },
  { step: 7, action: 'Rally and regroup', detail: 'Meet at a predetermined rally point. Count heads. Assess losses.' },
];

export const PREVENTION_STRATEGIES = [
  'Always have an escape plan BEFORE entering combat. Know where the exits are.',
  'Keep at least one teleportation spell prepared (Misty Step, Dimension Door, Teleport).',
  'Carry 2-3 healing potions per person. When the healer goes down, potions are all you have.',
  'Establish a retreat signal before the dungeon. Everyone knows what "RETREAT" means.',
  'Don\'t fight every battle. Negotiation, stealth, or avoidance are valid strategies.',
  'Short rest between fights. Entering a boss fight at 50% resources is asking for a TPK.',
  'Focus fire. Killing one enemy is better than damaging four. Dead enemies deal 0 damage.',
  'Protect your healer. If the Cleric goes down, everyone goes down.',
];

export function assessTPKRisk(partyDown, partyTotal, healerDown, spellSlotsRemaining) {
  let risk = 0;
  risk += (partyDown / partyTotal) * 50;
  if (healerDown) risk += 30;
  if (spellSlotsRemaining === 0) risk += 20;

  if (risk >= 70) return { level: 'Critical', advice: 'RETREAT NOW or TPK is likely.', color: '#9c27b0' };
  if (risk >= 50) return { level: 'High', advice: 'Use emergency resources. Consider retreat.', color: '#f44336' };
  if (risk >= 30) return { level: 'Elevated', advice: 'Things are getting dangerous. Commit resources.', color: '#ff9800' };
  return { level: 'Low', advice: 'Situation is manageable. Continue fighting.', color: '#4caf50' };
}
