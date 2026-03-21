/**
 * playerFallingProneGuide.js
 * Player Mode: Prone condition — rules, exploitation, and when to drop
 * Pure JS — no React dependencies.
 */

export const PRONE_RULES = {
  goingProne: 'Drop prone = free (no movement cost). Intentional.',
  standingUp: 'Costs half your movement to stand up.',
  noMovement: 'If speed = 0, you can\'t stand up.',
  crawling: 'Crawling: every foot costs 1 extra foot of movement.',
  attacks: {
    melee: 'Melee attacks against prone target have ADVANTAGE.',
    ranged: 'Ranged attacks against prone target have DISADVANTAGE.',
    your: 'You attack with DISADVANTAGE while prone.',
  },
  note: 'Prone is powerful if used correctly. Terrible if caught in melee.',
};

export const WAYS_TO_KNOCK_PRONE = [
  { method: 'Shove (Action)', how: 'Athletics contest. Success = prone. Replaces one attack (Extra Attack).', note: 'Free action economy. No resources spent.' },
  { method: 'Shield Master (feat)', how: 'Bonus action shove after Attack action. Athletics contest.', note: 'Attack + prone = remaining attacks with advantage.' },
  { method: 'Open Hand Monk', how: 'Flurry of Blows: target fails DEX save or knocked prone.', note: 'No Athletics contest. DEX save vs ki save DC.' },
  { method: 'Battlemaster Trip Attack', how: 'Superiority die damage + STR save or prone.', note: 'Damage + prone. Excellent maneuver.' },
  { method: 'Wolf Totem Barbarian', how: 'Allies have advantage on melee attacks vs creatures within 5ft of you.', note: 'Not prone, but similar effect. Pack tactics for party.' },
  { method: 'Command: Grovel (L1)', how: 'WIS save or target drops prone. Ends their turn.', note: 'L1 spell. Prone + can\'t stand until next turn.' },
  { method: 'Grease (L1)', how: 'DEX save or prone. Area effect.', note: 'AoE prone. Concentration.' },
  { method: 'Sleet Storm (L3)', how: 'DEX save or prone. Large area.', note: 'Area denial + prone. Difficult terrain + concentration checks.' },
  { method: 'Earthen Grasp (L2)', how: 'STR save or restrained. Can crush for prone.', note: 'Restrained is even better than prone.' },
  { method: 'Thorn Whip + Prone', how: 'Pull target toward you. If ally shoves prone, drag through hazards.', note: 'Combo piece.' },
];

export const PRONE_EXPLOITATION = [
  { exploit: 'Shove + Extra Attack', how: 'First attack: shove prone. Remaining attacks: advantage.', note: 'Fighter with Extra Attack (2): 1 shove + 2 attacks with advantage.' },
  { exploit: 'Prone + Hold Person', how: 'Prone + paralyzed = auto-crit within 5ft.', note: 'Devastating combo. Stack conditions.' },
  { exploit: 'Prone + Grapple', how: 'Grapple then shove prone. Speed = 0, can\'t stand up.', note: 'Locked on the ground. Can\'t escape without breaking grapple first.' },
  { exploit: 'Ranged Safety', how: 'Drop prone behind cover. Ranged attacks at disadvantage + cover.', note: 'Near-immune to ranged attacks. Free to do.' },
  { exploit: 'Prone Flyer', how: 'Stun/paralyze/sleep a flying creature. It falls and takes fall damage + prone.', note: 'Hold Person on flying enemy: fall damage + auto-crit.' },
];

export const WHEN_TO_GO_PRONE = [
  { situation: 'Behind cover, taking ranged fire', do: 'Drop prone.', why: 'Ranged attacks at disadvantage + cover bonus.' },
  { situation: 'In melee combat', do: 'Do NOT go prone.', why: 'Melee attacks against you have advantage. Standing costs half movement.' },
  { situation: 'Dodging AoE (Fireball)', do: 'Prone doesn\'t help.', why: 'Prone gives no DEX save benefit. Fireball ignores prone.' },
  { situation: 'Sleeping/unconscious', do: 'You\'re auto-prone.', why: 'Unconscious = prone + incapacitated. Auto-crit within 5ft.' },
  { situation: 'Mounted and forced off', do: 'DC 10 DEX save or prone.', why: 'Fall from mount. Half movement to stand.' },
];

export const PRONE_TIPS = [
  'Drop prone: free. Stand up: costs half your movement.',
  'Melee advantage, ranged disadvantage against prone targets.',
  'You attack with disadvantage while prone. Bad for you.',
  'Grapple + prone: speed = 0, can\'t stand. Lock them down.',
  'Shield Master: bonus action shove prone after attacking.',
  'Shove replaces one attack with Extra Attack. Free prone attempt.',
  'Prone behind cover: near-immune to ranged attacks.',
  'Never go prone in melee. Melee advantage against you.',
  'Flying creatures fall when knocked prone. Bonus fall damage.',
  'Command: Grovel is a L1 prone spell. Very efficient.',
];
