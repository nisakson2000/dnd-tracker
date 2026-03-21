/**
 * playerAmbushSetup.js
 * Player Mode: How to set up and execute ambushes
 * Pure JS — no React dependencies.
 */

export const AMBUSH_SETUP = [
  { step: 1, action: 'Scout the Area', detail: 'Send a stealthy character (Rogue, Ranger) ahead. Identify enemy numbers, positions, patrol routes.' },
  { step: 2, action: 'Choose the Kill Zone', detail: 'Pick terrain that favors you: chokepoints, elevation, cover. Force enemies into a disadvantageous position.' },
  { step: 3, action: 'Position the Party', detail: 'Spread along the ambush route. Casters in back with line of sight. Melee ready to block escape routes.' },
  { step: 4, action: 'Buff Before Engagement', detail: 'Pass without Trace (+10 Stealth), Bless, Haste, Hunter\'s Mark — pre-cast non-concentration buffs.' },
  { step: 5, action: 'Set the Trigger', detail: 'Agree on when to attack: "When the leader reaches the X" or "When I shoot the first arrow."' },
  { step: 6, action: 'Execute: Surprise Round', detail: 'Stealth checks vs enemy passive Perception. Surprised enemies can\'t act or react on turn 1.' },
  { step: 7, action: 'Nova on Round 1', detail: 'All resources on the first round. Assassinate, Smite, Fireball. Maximum alpha strike.' },
];

export const AMBUSH_SPELLS = [
  { spell: 'Pass without Trace (2nd)', role: 'Essential', effect: '+10 to Stealth for entire party. Concentration.' },
  { spell: 'Silence (2nd)', role: 'Utility', effect: 'No sound in 20ft sphere. Hide noisy party members.' },
  { spell: 'Spike Growth (2nd)', role: 'Trap', effect: '2d4 per 5ft moved. Enemies flee INTO the trap.' },
  { spell: 'Entangle (1st)', role: 'Control', effect: 'Lock enemies in place after ambush starts.' },
  { spell: 'Fog Cloud (1st)', role: 'Escape', effect: 'Block line of sight if things go wrong. Cover retreat.' },
  { spell: 'Snare (1st)', role: 'Trap', effect: 'Pre-placed trap. Triggered enemy is restrained and hoisted in the air.' },
];

export const AMBUSH_ROLES = [
  { role: 'Triggerman', bestClass: 'Ranger, Rogue', description: 'First to attack. Signals the ambush start.' },
  { role: 'Blocker', bestClass: 'Fighter, Paladin, Barbarian', description: 'Blocks escape routes. Engages enemies in melee.' },
  { role: 'Artillery', bestClass: 'Wizard, Sorcerer', description: 'Opens with AoE. Fireball the kill zone.' },
  { role: 'Support', bestClass: 'Cleric, Bard, Druid', description: 'Maintains buffs, ready with healing if things go sideways.' },
  { role: 'Assassin', bestClass: 'Rogue (Assassin)', description: 'Targets the leader. Auto-crit on surprised targets.' },
];

export function calculateSurpriseChance(partyStealthMod, avgPassivePerception) {
  // Simplified: party must ALL beat enemy passive Perception
  // With Pass without Trace (+10), even heavy armor has a good chance
  const estimatedRoll = 10 + partyStealthMod; // average d20 = 10.5
  return estimatedRoll >= avgPassivePerception;
}
