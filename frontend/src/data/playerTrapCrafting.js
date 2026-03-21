/**
 * playerTrapCrafting.js
 * Player Mode: Setting traps and creating ambush preparations
 * Pure JS — no React dependencies.
 */

export const PLAYER_TRAPS = [
  { name: 'Hunting Trap', cost: '5 gp', damage: '1d4 piercing', save: 'DC 13 STR to escape', setup: 'Action to set. Creature stepping on it is restrained.', weight: '25 lb' },
  { name: 'Caltrops', cost: '1 gp (bag of 20)', damage: '1 piercing', save: 'DC 15 DEX or stop moving + damage', setup: 'Action to scatter over 5ft square. -10ft speed until healed.', weight: '2 lb' },
  { name: 'Ball Bearings', cost: '1 gp (bag of 1000)', damage: 'None', save: 'DC 10 DEX or fall prone', setup: 'Action to scatter over 10ft square.', weight: '2 lb' },
  { name: 'Oil Flask + Fire', cost: '1 sp (oil)', damage: '5 fire damage', save: 'None (if ignited)', setup: 'Pour oil (action), ignite next turn. Burns for 2 rounds.', weight: '1 lb' },
  { name: 'Tripwire + Bells', cost: '~5 sp', damage: 'None', save: 'DC 13 Perception to notice', setup: 'Use rope + small bells. Alert system, not damage.', weight: '1 lb' },
  { name: 'Pit (Improvised)', cost: 'Time + shovels', damage: '1d6 per 10ft', save: 'DC 12 DEX or fall in', setup: '1 hour to dig 5ft deep. Cover with branches/cloth.', weight: 'N/A' },
  { name: 'Snare (Rope)', cost: '5 sp (rope)', damage: 'None', save: 'DC 12 DEX or restrained/hoisted', setup: 'Survival check DC 15 to set. Pulls target into air.', weight: '1 lb' },
];

export const MAGICAL_TRAPS = [
  { spell: 'Glyph of Warding', level: 3, damage: '5d8 (scales)', trigger: 'Customizable', duration: 'Until dispelled or triggered', note: 'Can store ANY spell of 3rd level or lower. 200 gp incense per casting. Can\'t be moved.' },
  { spell: 'Alarm', level: 1, damage: 'None', trigger: '20ft cube entry', duration: '8 hours', note: 'Ritual castable. Mental or audible (300ft). Perfect early warning.' },
  { spell: 'Snare', level: 1, damage: 'None', trigger: 'Creature enters 5ft area', duration: '8 hours', note: 'Target restrained and hoisted 3ft in air. INT vs spell save DC.' },
  { spell: 'Cordon of Arrows', level: 2, damage: '1d6 per arrow (up to 4)', trigger: 'Creature within 30ft', duration: '8 hours', note: 'Plant 4 arrows. Each strikes a different intruder.' },
  { spell: 'Symbol', level: 7, damage: 'Varies', trigger: 'Customizable', duration: 'Until dispelled or triggered', note: 'Death, Discord, Fear, Hopelessness, Insanity, Pain, Sleep, Stunning.' },
];

export const AMBUSH_PREPARATION = [
  { prep: 'Choose terrain', detail: 'Choke points, elevated positions, cover. Force enemies into kill zones.' },
  { prep: 'Set escape routes', detail: 'Always have a way out. Mark it so the party knows where to run.' },
  { prep: 'Assign roles', detail: 'Initiator (triggers ambush), Striker (first damage), Controller (area denial), Spotter (overwatch).' },
  { prep: 'Pre-buff if possible', detail: 'Cast non-concentration buffs before engaging. Mage Armor, Longstrider, Aid.' },
  { prep: 'Coordinate signal', detail: 'Agree on a trigger phrase or action. "When I fire the arrow" or "when the torch drops."' },
  { prep: 'Layer traps', detail: 'Caltrops behind you for retreat. Hunting traps at entry points. Oil on the ground.' },
];

export function calculateTrapDamage(trapName) {
  const trap = PLAYER_TRAPS.find(t =>
    t.name.toLowerCase().includes((trapName || '').toLowerCase())
  );
  return trap ? trap.damage : 'Unknown trap';
}

export function getTrapSetupTime(trapName) {
  const trap = PLAYER_TRAPS.find(t =>
    t.name.toLowerCase().includes((trapName || '').toLowerCase())
  );
  return trap ? trap.setup : 'Unknown trap';
}
