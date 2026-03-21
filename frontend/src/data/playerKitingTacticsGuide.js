/**
 * playerKitingTacticsGuide.js
 * Player Mode: Kiting — ranged combat movement strategy
 * Pure JS — no React dependencies.
 */

export const KITING_BASICS = {
  concept: 'Stay at range, move away when enemies approach, attack from safety.',
  goal: 'Deal damage while never being in melee range of enemies.',
  bestFor: ['Ranged attackers', 'Casters', 'Low-HP characters', 'Characters with speed advantages'],
  note: 'Kiting works because most monsters have 30ft speed. If you also have 30ft, you need tools to create distance.',
};

export const KITING_METHODS = [
  { method: 'Superior speed', detail: 'Wood Elf (35ft), Monk (40ft+), Mobile feat, Longstrider, Haste. Outrun enemies.', rating: 'S', note: 'If you\'re faster, just walk away and shoot.' },
  { method: 'Difficult terrain', detail: 'Spike Growth, Plant Growth, Web, Entangle. Enemies move at half speed.', rating: 'S', note: 'You move normally; they crawl. Devastating control.' },
  { method: 'Forced movement', detail: 'Eldritch Blast + Repelling Blast (10ft push per beam). Push them away every round.', rating: 'S', note: 'Warlock staple. 4 beams = 40ft push. They never reach you.' },
  { method: 'Teleportation', detail: 'Misty Step, Dimension Door, Fey Step, Thunder Step. Instant escape.', rating: 'A+', note: 'Costs a spell slot but guarantees escape.' },
  { method: 'Disengage', detail: 'Use Disengage action → move away → ally attacks. Costs your action.', rating: 'B+', note: 'Costly (no attack) unless you have Cunning Action (Rogue) or bonus Disengage.' },
  { method: 'Mobile feat', detail: 'After melee attack, no OA from that creature. Attack → move away free.', rating: 'A+', note: 'Make a melee attack, then walk away. Best on Monks.' },
  { method: 'Mounted combat', detail: 'Mount Disengages → you attack → mount moves away. Free kiting.', rating: 'A', note: 'Mount uses its action to Disengage. You keep your action for attacks.' },
];

export const KITING_BUILDS = [
  { build: 'Warlock (EB + Repelling)', detail: '4 beams at L17, each pushes 10ft. 40ft pushback per round. Grasp of Hadar pulls first.', rating: 'S' },
  { build: 'Monk (Speed + Mobile)', detail: '45ft+ speed, Disengage as BA, hit and run constantly.', rating: 'A+' },
  { build: 'Rogue (Cunning Action)', detail: 'Disengage as BA → full movement → ranged Sneak Attack.', rating: 'A+' },
  { build: 'Ranger (Longbow + terrain spells)', detail: 'Spike Growth + longbow (150ft range). Enemies can\'t reach you through the thorns.', rating: 'A' },
  { build: 'Bladesinger (high speed + spells)', detail: 'Bladesong speed boost + Misty Step + ranged cantrips.', rating: 'A' },
];

export const ANTI_KITING_AWARENESS = [
  'Enemies with ranged attacks negate kiting. You both take damage at range.',
  'Flying enemies ignore ground-based difficult terrain.',
  'Enemies with Dash action close the gap if they have same speed.',
  'Teleporting enemies (Misty Step, Shadow Step) can close instantly.',
  'Enemies with reach (10ft+) catch you if you\'re only 5ft away.',
  'Legendary actions let some monsters move outside their turn.',
  'Charming/fear effects can force you to approach.',
];

export const SPIKE_GROWTH_KITING = {
  spell: 'Spike Growth',
  combo: 'Cast Spike Growth → pull/push enemies through it → they take 2d4 per 5ft moved.',
  bestWith: [
    'Eldritch Blast + Repelling Blast + Grasp of Hadar (push/pull through spikes)',
    'Thorn Whip (pull 10ft through spikes = 4d4)',
    'Gust of Wind (push through continuously)',
    'Telekinetic feat (BA push 5ft = 2d4)',
  ],
  damagePerBeam: '2d4 per 5ft pushed = up to 4d4 per 10ft push',
  note: 'EB (4 beams) + Repelling (10ft per beam) through Spike Growth = 16d4 bonus piercing damage.',
  rating: 'S+',
};
