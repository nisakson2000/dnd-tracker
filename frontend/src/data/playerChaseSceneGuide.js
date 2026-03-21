/**
 * playerChaseSceneGuide.js
 * Player Mode: Chase scene rules, tactics, and optimization
 * Pure JS — no React dependencies.
 */

export const CHASE_RULES_DMG = {
  initiative: 'Roll initiative. Each creature acts in order.',
  movement: 'On your turn, Dash is free (no action needed). You can use your action for other things.',
  distance: 'Track distance between quarry and pursuers in feet.',
  dashLimit: 'After Dashing for 3 + CON mod rounds (min 0), DC 10 CON save each turn or gain 1 exhaustion.',
  complications: 'DM may use chase complication table (obstacles, crowds, terrain).',
  ending: 'Chase ends when quarry escapes (out of range/sight), is caught, or gives up.',
  spells: 'Spells and ranged attacks are possible but with disadvantage if target is far.',
};

export const CHASE_OPTIMIZATION = [
  { method: 'High CON', benefit: 'More free Dash rounds before exhaustion saves. CON 20 = 8 free rounds.', rating: 'S' },
  { method: 'Dash action + free dash', benefit: 'Double speed on your turn. Monks and Rogues excel.', rating: 'S+' },
  { method: 'Monk: Step of the Wind', benefit: 'BA Dash + Jump. Triple speed (free dash + action dash + BA dash).', rating: 'S+' },
  { method: 'Rogue: Cunning Action Dash', benefit: 'BA Dash every turn. Rogues are best chasers/escapers.', rating: 'S+' },
  { method: 'Longstrider spell', benefit: '+10ft speed for 1 hour. Cast before the chase if possible.', rating: 'A+' },
  { method: 'Haste spell', benefit: 'Double speed + extra action (Dash again). Quadruple movement.', rating: 'S+' },
  { method: 'Fly spell', benefit: 'Ignore ground obstacles. 60ft fly speed.', rating: 'S' },
  { method: 'Misty Step', benefit: 'Teleport 30ft as BA. Bypass obstacles instantly.', rating: 'S' },
  { method: 'Dimension Door', benefit: 'Teleport 500ft. Chase over.', rating: 'S+' },
  { method: 'Hold Person on quarry', benefit: 'Paralyzed = speed 0. Chase ends.', rating: 'S+' },
  { method: 'Entangle/Web behind you', benefit: 'Restrained pursuers. Major speed reduction.', rating: 'S' },
  { method: 'Minor Illusion/Silent Image', benefit: 'Create fake obstacle or hiding spot. Pursuers waste movement.', rating: 'A+' },
  { method: 'Pass Without Trace', benefit: '+10 to Stealth. Duck around corner → invisible.', rating: 'S+' },
];

export const CHASE_TACTICS_PURSUING = [
  'Spread out to cut off escape routes. Don\'t all follow the same path.',
  'Ranged attackers: target legs (Called Shot variant) or use restraining spells.',
  'Hold Person / Command ("halt") ends the chase immediately.',
  'Sentinel feat: if quarry passes you, OA → speed 0. Chase over.',
  'Familiars can track from the air while you take shortcuts.',
  'Mounted characters have massive speed advantage (60ft+ mounts).',
  'Web / Entangle in the quarry\'s path forces saves and slows them.',
  'If you have Sending or Message, coordinate with allies to cut off escape.',
];

export const CHASE_TACTICS_FLEEING = [
  'Dash every round. Don\'t waste actions attacking unless it creates distance.',
  'Drop caltrops, ball bearings, or oil behind you.',
  'Cast Fog Cloud or Darkness behind you to block line of sight.',
  'Duck around a corner + Stealth check (vs Perception). If successful, you\'re hidden.',
  'Pass Without Trace + Hide = nearly impossible to find.',
  'Misty Step through a locked door or over a gap.',
  'Minor Illusion: create a fake wall or hiding spot.',
  'If indoors: lock doors behind you. Each one costs pursuers an action.',
  'If outdoors: head for difficult terrain you can handle (Water Walk, climbing).',
  'Wildshape into a bird (Druid). Chase over.',
];

export const EXHAUSTION_DURING_CHASES = {
  dashLimit: '3 + CON modifier rounds of free Dashing (minimum 0).',
  table: [
    { con: '-1 to 0', freeRounds: '2-3' },
    { con: '+1', freeRounds: '4' },
    { con: '+2', freeRounds: '5' },
    { con: '+3', freeRounds: '6' },
    { con: '+4', freeRounds: '7' },
    { con: '+5', freeRounds: '8' },
  ],
  afterLimit: 'DC 10 CON save each round or gain 1 level of exhaustion.',
  exhaustionEffects: [
    { level: 1, effect: 'Disadvantage on ability checks.' },
    { level: 2, effect: 'Speed halved.' },
    { level: 3, effect: 'Disadvantage on attacks and saves.' },
    { level: 4, effect: 'HP maximum halved.' },
    { level: 5, effect: 'Speed reduced to 0.' },
    { level: 6, effect: 'Death.' },
  ],
  warning: 'Level 2 exhaustion (speed halved) during a chase is devastating. Don\'t push too hard.',
};

export const CHASE_TIPS = [
  'Chases are about speed AND creativity. Use the environment.',
  'DM chases by-the-book are rare. Most DMs use skill challenges instead.',
  'Monks and Rogues are the best chasers. BA Dash is king.',
  'Barbarian: Fast Movement (+10ft at L5) helps but no BA Dash.',
  'Wizard with Expeditious Retreat: BA Dash every turn for 10 minutes.',
  'Mounted pursuit is almost always faster than on foot.',
  'If you can teleport, the chase is over. Dimension Door = 500ft.',
  'Exhaustion is the real enemy in long chases. Know your CON limit.',
];
