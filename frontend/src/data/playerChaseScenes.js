/**
 * playerChaseScenes.js
 * Player Mode: Chase rules, pursuit tactics, and escape strategies
 * Pure JS — no React dependencies.
 */

export const CHASE_RULES = {
  initiative: 'Roll initiative as normal. Quarry and pursuer act in initiative order.',
  distance: 'Track distance in feet. Quarry starts at a set distance ahead.',
  dash: 'You can Dash freely for 3 + CON mod rounds. After that, DC 10 CON save each round or gain 1 exhaustion.',
  speed: 'Faster creatures close 30ft/round gap (or whatever the speed difference is).',
  terrain: 'DM may roll on a Chase Complications table each round.',
  ending: 'Chase ends when quarry is caught, escapes (out of sight + hidden), or either side gives up.',
};

export const CHASE_COMPLICATIONS = [
  'Obstacle: DC 10 DEX (Acrobatics) or fall prone.',
  'Crowd: DC 10 STR (Athletics) or speed halved this turn.',
  'Rough terrain: DC 10 DEX save or 2d4 damage + speed halved.',
  'Narrow passage: DC 12 DEX (Acrobatics) or stuck for 1 round.',
  'Overturned cart: DC 12 STR (Athletics) to vault over or lose 10ft.',
];

export const PURSUIT_TACTICS = [
  { tactic: 'Expeditious Retreat', effect: 'Bonus action Dash every turn. No exhaustion. Chase for 10 minutes.', type: 'spell' },
  { tactic: 'Longstrider', effect: '+10ft speed for 1 hour. No concentration.', type: 'spell' },
  { tactic: 'Haste', effect: 'Double speed + Haste Dash. Lethargy risk if you lose concentration.', type: 'spell' },
  { tactic: 'Misty Step', effect: 'Bonus action 30ft teleport. Bypass obstacles.', type: 'spell' },
  { tactic: 'Dimension Door', effect: '500ft teleport. Escape/close gap instantly.', type: 'spell' },
  { tactic: 'Monk Step of the Wind', effect: 'Bonus action Dash or Disengage. Ki cost 1.', type: 'class' },
  { tactic: 'Rogue Cunning Action', effect: 'Bonus action Dash/Disengage/Hide every turn. Free.', type: 'class' },
  { tactic: 'Barbarian Fast Movement', effect: '+10ft speed (L5). Stacks with Dash.', type: 'class' },
  { tactic: 'Mounted pursuit', effect: 'Warhorse speed 60ft. Dash for 120ft/round.', type: 'equipment' },
];

export const ESCAPE_TACTICS = [
  { tactic: 'Fog Cloud / Darkness', detail: 'Break line of sight. Then Hide (Stealth check). Chase ends if you escape sight + hide.' },
  { tactic: 'Minor Illusion', detail: 'Create a fake wall/obstacle. Pursuers waste a round investigating.' },
  { tactic: 'Caltrops / Ball Bearings', detail: 'DEX save or fall prone. Slows pursuers by a round.' },
  { tactic: 'Web', detail: 'Restrained on failed save. Even on success, difficult terrain.' },
  { tactic: 'Plant Growth', detail: '100ft radius, 4 feet of movement per 1 foot. Devastating slow.' },
  { tactic: 'Grease', detail: '10ft square. DEX save or fall prone. Slows pursuit.' },
  { tactic: 'Disguise Self', detail: 'Break line of sight, then Disguise Self. Walk away casually.' },
];

export function dashBeforeExhaustion(conMod) {
  return 3 + Math.max(0, conMod);
}

export function roundsToClose(pursuerSpeed, quarrySpeed, startingDistance) {
  const gap = pursuerSpeed - quarrySpeed;
  if (gap <= 0) return Infinity; // can't catch
  return Math.ceil(startingDistance / gap);
}

export function totalChaseDistance(speed, rounds, dashes) {
  return speed * rounds + speed * dashes;
}
