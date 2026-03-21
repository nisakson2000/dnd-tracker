/**
 * playerEmergencyProtocols.js
 * Player Mode: Emergency response protocols for critical combat situations
 * Pure JS — no React dependencies.
 */

export const EMERGENCY_PROTOCOLS = [
  {
    emergency: 'Total Party Kill (TPK) Incoming',
    signs: ['3+ party members down', 'Healer unconscious', 'No spell slots remaining'],
    protocol: [
      'Priority 1: Someone casts Fog Cloud/Darkness to block enemy attacks.',
      'Priority 2: Anyone conscious Dashes toward the exit.',
      'Priority 3: Stabilize/Healing Word the most mobile ally to help evacuate.',
      'Priority 4: Leave the dead. Revivify has a 1-minute window — come back later.',
      'Last resort: Dimension Door out with one ally. Thunder Step out.',
    ],
    color: '#f44336',
  },
  {
    emergency: 'Boss Is Unkillable',
    signs: ['Boss has 3 Legendary Resistances up', 'Can\'t penetrate AC', 'Regeneration faster than damage'],
    protocol: [
      'Burn Legendary Resistance with cheap save-or-suck spells first.',
      'Switch from attacks to save-based damage if AC is too high.',
      'Look for environmental solutions (collapse the ceiling, lure to hazard).',
      'Focus fire — don\'t spread damage across minions and boss.',
      'If regeneration: find the weakness (fire for trolls, radiant for vampires).',
    ],
    color: '#ff9800',
  },
  {
    emergency: 'Ambushed!',
    signs: ['Enemy has surprise round', 'Party is spread out', 'No cover nearby'],
    protocol: [
      'First round: DODGE action (if no better option). Survive the alpha strike.',
      'Move toward cover or group up with allies.',
      'Identify the most dangerous enemy and focus them once you can act.',
      'If terrain is terrible, fight through to better ground.',
    ],
    color: '#ff5722',
  },
  {
    emergency: 'Concentration Spell Broken at Worst Time',
    signs: ['Haste drops (target loses next turn)', 'Polymorph drops (ally reverts low HP)', 'Wall of Force drops (enemies rush in)'],
    protocol: [
      'Haste lethargy: protect the affected character for 1 round.',
      'Polymorph revert: immediate healing on the now-vulnerable ally.',
      'Wall down: defensive actions, fall back to secondary positions.',
      'Prevention: War Caster + Resilient (CON). Protect the concentrator.',
    ],
    color: '#ffc107',
  },
  {
    emergency: 'Friendly Fire Incident',
    signs: ['AoE hit allies', 'Charm/confusion caused ally to attack', 'Environmental hazard triggered on party'],
    protocol: [
      'Heal affected allies immediately.',
      'Adjust positioning — spread out more.',
      'Use Sculpt Spells or Careful Spell for future AoEs.',
      'Communicate: "I\'m about to Fireball — move away from the door!"',
    ],
    color: '#ff9800',
  },
];

export const EMERGENCY_ITEMS = [
  { item: 'Potion of Healing', uses: 'Quick 2d4+2 heal when healer is down or out of slots.' },
  { item: 'Scroll of Revivify', uses: 'Backup resurrection if Cleric is dead.' },
  { item: 'Necklace of Fireballs', uses: 'Emergency AoE damage. Can clear a room.' },
  { item: 'Dust of Disappearance', uses: 'Entire party invisible for 2d4 minutes. Ultimate escape.' },
  { item: 'Bead of Force', uses: 'Trap an enemy in an impenetrable sphere for 1 minute.' },
];

export function getEmergencyProtocol(situation) {
  return EMERGENCY_PROTOCOLS.find(p =>
    p.emergency.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}

export function assessEmergencyLevel(partyDown, partySize, healerConscious, slotsRemaining) {
  if (partyDown >= Math.ceil(partySize / 2)) return { level: 'CRITICAL', protocol: EMERGENCY_PROTOCOLS[0] };
  if (!healerConscious && partyDown > 0) return { level: 'SEVERE', protocol: EMERGENCY_PROTOCOLS[0] };
  if (slotsRemaining === 0 && partyDown > 0) return { level: 'HIGH', protocol: EMERGENCY_PROTOCOLS[0] };
  return { level: 'MANAGEABLE', protocol: null };
}
