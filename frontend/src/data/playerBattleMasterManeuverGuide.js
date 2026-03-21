/**
 * playerBattleMasterManeuverGuide.js
 * Player Mode: Battle Master Fighter — all maneuvers ranked and optimized
 * Pure JS — no React dependencies.
 */

export const MANEUVER_RULES = {
  dice: 'd8 (d10 at L10, d12 at L18)',
  known: '3 at L3, up to 9 at L15.',
  recovery: 'All superiority dice recover on SHORT REST.',
  save: '8 + PB + STR or DEX mod.',
  note: 'Battle Master is arguably the best Fighter subclass. Maneuvers add tactical depth.',
};

export const MANEUVERS_RANKED = [
  { name: 'Precision Attack', effect: 'Add superiority die to attack roll.', rating: 'S+', note: 'Turn a miss into a hit. Best with GWM/SS -5. Mathematically the best maneuver.' },
  { name: 'Riposte', effect: 'When creature misses you, reaction attack + superiority die damage.', rating: 'S+', note: 'Extra attack on their turn. Free damage. Works every round.' },
  { name: 'Trip Attack', effect: 'Add superiority die. Target falls prone (STR save).', rating: 'S', note: 'Prone = advantage for melee. Use on first attack, remaining attacks have advantage.' },
  { name: 'Menacing Attack', effect: 'Add superiority die. Target frightened (WIS save).', rating: 'S', note: 'Frightened = disadvantage on attacks + can\'t approach. Great debuff.' },
  { name: 'Goading Attack', effect: 'Add superiority die. Target has disadvantage attacking others (WIS save).', rating: 'A+', note: 'Force enemy to attack you. Great for tanks.' },
  { name: 'Commander\'s Strike', effect: 'Ally uses reaction to attack + superiority die.', rating: 'A+', note: 'Give the Rogue a Sneak Attack on YOUR turn. Rogue gets 2 SA/round.' },
  { name: 'Disarming Attack', effect: 'Add superiority die. Target drops item (STR save).', rating: 'A+', note: 'DM-dependent. If the enemy relies on a weapon/focus, devastating.' },
  { name: 'Pushing Attack', effect: 'Add superiority die. Push 15ft (STR save).', rating: 'A+', note: 'Push into hazards. Off cliffs. Into Spike Growth. Forced movement.' },
  { name: 'Feinting Attack', effect: 'BA: advantage on next attack + superiority die.', rating: 'A', note: 'Guaranteed advantage. Good when you need to hit. Uses BA.' },
  { name: 'Maneuvering Attack', effect: 'Add superiority die. Ally moves half speed no OAs.', rating: 'A', note: 'Save an ally from melee. Tactical repositioning.' },
  { name: 'Parry', effect: 'Reduce damage by superiority die + DEX mod.', rating: 'A', note: 'Damage reduction. Better for DEX fighters. Consistent survival.' },
  { name: 'Rally', effect: 'BA: ally gains superiority die + CHA mod temp HP.', rating: 'B+', note: 'Temp HP for an ally. Scales with CHA. Good for support builds.' },
  { name: 'Distracting Strike', effect: 'Add superiority die. Next attack vs target has advantage.', rating: 'B+', note: 'Set up advantage for ally. Less impactful than Trip Attack.' },
  { name: 'Evasive Footwork', effect: 'Add superiority die to AC while moving.', rating: 'B', note: 'AC boost while moving through danger. Niche.' },
  { name: 'Lunging Attack', effect: '+5ft reach + superiority die.', rating: 'B', note: 'Reach is nice but too niche. Better to just move.' },
  { name: 'Sweeping Attack', effect: 'If you hit, deal superiority die to adjacent creature.', rating: 'B', note: 'Cleave damage. Low impact since it\'s only the die, not full damage.' },
  { name: 'Brace', effect: 'When creature enters your reach, reaction attack + superiority die.', rating: 'A', note: 'Like Sentinel but costs a die. Good if you don\'t have Sentinel.' },
  { name: 'Ambush', effect: 'Add superiority die to initiative OR Stealth.', rating: 'A', note: 'Going first matters. Initiative boost is always welcome.' },
  { name: 'Quick Toss', effect: 'BA: throw weapon + superiority die.', rating: 'A', note: 'Extra attack as BA. Good for thrown weapon builds.' },
  { name: 'Tactical Assessment', effect: 'Add superiority die to Investigation, History, or Insight.', rating: 'B', note: 'Out-of-combat utility. Niche but nice.' },
];

export const MANEUVER_PRIORITY = [
  { level: '3 (pick 3)', picks: ['Precision Attack', 'Riposte', 'Trip Attack'], reason: 'Best damage, best reaction, best debuff. Core trio.' },
  { level: '7 (pick 2 more)', picks: ['Menacing Attack', 'Goading Attack'], reason: 'More debuffs. Frighten or force targeting.' },
  { level: '10 (pick 2 more)', picks: ['Ambush', 'Brace'], reason: 'Initiative and reaction attacks.' },
  { level: '15 (pick 2 more)', picks: ['Commander\'s Strike', 'Pushing Attack'], reason: 'Party synergy and forced movement.' },
];

export const MANEUVER_TIPS = [
  'Precision Attack is #1. Turn GWM/SS misses into hits. Best damage per die spent.',
  'Riposte: free reaction attack when missed. Works almost every round.',
  'Trip Attack on first attack → remaining attacks with advantage. Order matters.',
  'Commander\'s Strike + Rogue = extra Sneak Attack per round. Huge DPR boost.',
  'Superiority dice recover on SHORT REST. Use them every fight.',
  'Pushing Attack into Spike Growth, off cliffs, into Wall of Fire. Forced movement combos.',
  'Don\'t hoard dice. 2-3 fights per short rest. Spend them.',
  'Precision Attack: only add AFTER you see the roll. Don\'t waste it on natural 20s.',
];
