/**
 * playerCombatComms.js
 * Player Mode: In-combat communication protocols and callout system
 * Pure JS — no React dependencies.
 */

export const COMBAT_CALLOUTS = [
  { callout: 'FOCUS [target]', meaning: 'Everyone attack this target.', when: 'When target priority is established', example: 'FOCUS the caster in the back!' },
  { callout: 'DOWN', meaning: 'A party member has fallen to 0 HP.', when: 'Immediately when someone drops', example: 'Fighter is DOWN! Need heals!' },
  { callout: 'HEALS', meaning: 'Requesting healing.', when: 'Below 25% HP or about to go down', example: 'HEALS on the Rogue — one hit from dropping!' },
  { callout: 'INCOMING [direction]', meaning: 'New enemies or attack from that direction.', when: 'Spotted new threats', example: 'INCOMING from the left flank, 3 archers!' },
  { callout: 'NOVA', meaning: 'Everyone unload — maximum damage this round.', when: 'Boss is low or critical moment', example: 'NOVA — use everything! We can end this!' },
  { callout: 'HOLD', meaning: 'Don\'t advance. Wait for signal.', when: 'Preparing coordinated action', example: 'HOLD until the Wizard drops the Fireball.' },
  { callout: 'PULL BACK', meaning: 'Retreat or reposition backwards.', when: 'Position is compromised', example: 'PULL BACK — too many enemies in melee!' },
  { callout: 'CC [target]', meaning: 'Control/crowd-control this target.', when: 'Dangerous enemy needs to be locked down', example: 'CC the dragon — Hold Monster or Web!' },
  { callout: 'CLEAR', meaning: 'Area is safe. No more enemies.', when: 'After last enemy falls', example: 'CLEAR. Start post-combat procedures.' },
  { callout: 'CONCENTRATION', meaning: 'Protect the caster maintaining concentration.', when: 'Important concentration spell is active', example: 'CONCENTRATION on the Cleric — Spirit Guardians is up!' },
  { callout: 'FLANKING', meaning: 'Get to the opposite side of the enemy.', when: 'Using flanking rules for advantage', example: 'FLANKING on the ogre — circle around!' },
  { callout: 'SAVE YOUR [resource]', meaning: 'Don\'t use a specific resource yet.', when: 'Anticipating harder fight ahead', example: 'SAVE YOUR Action Surge — boss fight is next room.' },
];

export const INITIATIVE_COMMS = [
  { phase: 'Pre-Combat', comms: ['Declare formation', 'Assign targets', 'Confirm buffs are up', 'Agree on opening moves'] },
  { phase: 'Round 1', comms: ['Announce opening moves', 'Call targets', 'Declare concentration spells', 'Note enemy positions'] },
  { phase: 'Mid-Combat', comms: ['Update on HP status', 'Call for heals proactively', 'Suggest focus fire shifts', 'Report resource status'] },
  { phase: 'Endgame', comms: ['Call NOVA when appropriate', 'Confirm kill order', 'Prepare for post-combat', 'Call CLEAR when done'] },
];

export const PARTY_SIGNALS = [
  { signal: 'Raised fist', meaning: 'Stop/hold position', use: 'Stealth situations. No talking allowed.' },
  { signal: 'Flat hand forward', meaning: 'Move forward slowly', use: 'Advance cautiously.' },
  { signal: 'Thumb up', meaning: 'All clear / ready', use: 'Confirm understanding or area is safe.' },
  { signal: 'Thumb down', meaning: 'Danger / don\'t proceed', use: 'Trap detected, enemies spotted.' },
  { signal: 'Two fingers to eyes', meaning: 'I see something / look', use: 'Draw attention to something.' },
  { signal: 'Circling hand', meaning: 'Surround / flank', use: 'Non-verbal flanking order.' },
];

export const TURN_ANNOUNCEMENTS = [
  'Start your turn by stating: current HP, active effects/concentrations, then your action.',
  'Example: "I\'m at 24/45 HP, concentrating on Bless. I attack the goblin with my longsword."',
  'If you need time to decide, say "thinking" so the table knows you\'re not AFK.',
  'After your turn, state what you\'re ready to react with (if anything).',
  'If your turn doesn\'t change the situation, just say what you do and pass. Keep it quick.',
];

export function getCallout(situation) {
  return COMBAT_CALLOUTS.find(c =>
    c.callout.toLowerCase().includes((situation || '').toLowerCase()) ||
    c.meaning.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}

export function getCommsForPhase(phase) {
  return INITIATIVE_COMMS.find(p =>
    p.phase.toLowerCase().includes((phase || '').toLowerCase())
  ) || null;
}
