/**
 * playerCombatEndgame.js
 * Player Mode: Endgame combat scenarios and high-level tactics
 * Pure JS — no React dependencies.
 */

export const HIGH_LEVEL_THREATS = [
  { threat: 'Antimagic Zone', counter: 'Martials fight inside. Casters stay outside and use indirect effects.', level: '12+', note: 'Beholder\'s central eye creates one. All magic suppressed — magic weapons become mundane.' },
  { threat: 'Power Word Kill', counter: 'Stay above 100 HP at all times. No save. Just die if under 100.', level: '15+', note: 'Cast Heroes\' Feast (+2d10 HP) and Aid (extra max HP) before boss fights.' },
  { threat: 'Wish/Reality Warp', counter: 'Counterspell. If you can\'t counter, Legendary Resistance may not help (some Wish effects have no save).', level: '17+', note: 'Only Wish can counter Wish. The nuclear option.' },
  { threat: 'Maze (8th level)', counter: 'DC 20 Intelligence check to escape. Low INT characters are trapped for up to 10 minutes.', level: '15+', note: 'No save. No line of sight needed. INT 20 = 25% per round to escape.' },
  { threat: 'Prismatic Wall', counter: 'Each layer requires a different counter. 7 layers = 7 solutions. Team effort.', level: '17+', note: 'Red=fire immunity, Orange=acid, Yellow=lightning, etc. Dispel each layer individually.' },
  { threat: 'Time Stop', counter: 'Can\'t stop it. But the caster can\'t directly affect you during it — they set up.', level: '17+', note: 'When Time Stop ends, be ready. They\'ve set up Forcecage, delayed blasts, etc.' },
];

export const TIER4_STRATEGIES = [
  { strategy: 'Simulacrum Army', description: 'Wizard creates Simulacrum of themselves. The Simulacrum casts Simulacrum of another caster. Repeat.', counterplay: 'Antimagic Field. Each simulacrum has half HP and can\'t heal. Area damage destroys them.' },
  { strategy: 'True Polymorph + Permanence', description: 'True Polymorph a rock into an Ancient Dragon. It\'s permanent after 1 hour concentration.', counterplay: 'Dispel Magic ends True Polymorph. Even if permanent, Dispel can end it.' },
  { strategy: 'Contingency + Dimension Door', description: 'If I drop below 20 HP, Dimension Door 500ft away. Auto-escape.', counterplay: 'Can\'t really counter this except by killing them in one round from full.' },
  { strategy: 'Clone', description: 'If killed, soul transfers to a clone body with all equipment.', counterplay: 'Find and destroy all clones first. Or use Imprisonment (no saving throw if name known).' },
];

export const ENDGAME_RESOURCES = [
  { resource: 'Wish', use: 'Solve any problem. But using non-standard wishes risks losing Wish forever.', slot: 9 },
  { resource: 'True Resurrection', use: 'Bring back ANYONE who died within 200 years. No body needed.', slot: 9 },
  { resource: 'Gate', use: 'Open portal to another plane. Or summon a specific creature by name.', slot: 9 },
  { resource: 'Foresight', use: 'Advantage on EVERYTHING for 8 hours. No concentration. Best buff spell.', slot: 9 },
  { resource: 'Shapechange', use: 'Become any creature you\'ve seen. Keep your features. Change forms at will.', slot: 9 },
  { resource: 'Invulnerability', use: 'Immune to ALL damage for 10 minutes. Concentration.', slot: 9 },
];

export const LEGENDARY_CREATURE_PROTOCOL = [
  { step: 1, action: 'Burn Legendary Resistances', detail: 'Use cheap save-or-suck spells (Faerie Fire, Blindness) to force LR usage. 3 LRs is standard.' },
  { step: 2, action: 'Break Legendary Actions', detail: 'After LR is depleted, land your best save-or-suck. Hold Monster, Banishment, Polymorph.' },
  { step: 3, action: 'Focus damage', detail: 'Once controlled, everyone dumps maximum damage. Action Surge, Smites, highest spell slots.' },
  { step: 4, action: 'Watch for Lair Actions', detail: 'On initiative 20, the lair acts. Position to avoid or mitigate lair effects.' },
  { step: 5, action: 'Finish decisively', detail: 'Don\'t let up. Legendary creatures can turn fights around in one round.' },
];

export function getHighLevelCounter(threatName) {
  return HIGH_LEVEL_THREATS.find(t =>
    t.threat.toLowerCase().includes((threatName || '').toLowerCase())
  ) || null;
}

export function getLegendaryProtocol() {
  return LEGENDARY_CREATURE_PROTOCOL;
}
