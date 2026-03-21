/**
 * playerEldritchBlastOptGuide.js
 * Player Mode: Eldritch Blast optimization — the best cantrip
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_BLAST_BASICS = {
  cantrip: 'Eldritch Blast',
  class: 'Warlock (others via feat/multiclass)',
  damage: '1d10 force per beam',
  range: '120 feet',
  scaling: '1 beam L1, 2 at L5, 3 at L11, 4 at L17',
  attackRoll: 'Separate attack roll per beam',
  note: 'Best cantrip in the game. Force damage (rarely resisted). Scales like Extra Attack.',
};

export const EB_INVOCATIONS = [
  { invocation: 'Agonizing Blast', effect: 'Add CHA mod to each beam\'s damage.', rating: 'S+', note: 'MANDATORY. Without this, EB is mediocre. With it, best cantrip by far.' },
  { invocation: 'Repelling Blast', effect: 'Push target 10ft per beam hit.', rating: 'S', note: '4 beams = 40ft push. Incredible control. Spike Growth combo.' },
  { invocation: 'Grasp of Hadar', effect: 'Pull target 10ft closer once per turn.', rating: 'A', note: 'Pull + push combo. Pull into Spirit Guardians then push through Spike Growth.' },
  { invocation: 'Lance of Lethargy', effect: 'Reduce target speed by 10ft once per turn.', rating: 'A', note: 'Speed reduction stacks with difficult terrain. Kiting support.' },
  { invocation: 'Eldritch Spear', effect: 'EB range becomes 300 feet.', rating: 'B', note: '300ft is overkill in most combats. Niche for outdoors/siege.' },
];

export const EB_DAMAGE_BY_LEVEL = [
  { level: 1, beams: 1, damage: '1d10+4', avg: 9.5, note: 'Single beam. Decent for a cantrip.' },
  { level: 5, beams: 2, damage: '2×(1d10+4)', avg: 19, note: 'Two beams. Matches martial Extra Attack.' },
  { level: 11, beams: 3, damage: '3×(1d10+5)', avg: 31.5, note: 'Three beams. Exceeds most martials.' },
  { level: 17, beams: 4, damage: '4×(1d10+5)', avg: 42, note: 'Four beams. Fighter-level DPR from a cantrip.' },
];

export const EB_COMBOS = [
  { combo: 'EB + Hex', damage: '+1d6 per beam', total_L5: '2×(1d10+1d6+4) = 26 avg', rating: 'A+', note: 'Hex adds necrotic per hit. BA to cast, concentration.' },
  { combo: 'EB + Repelling + Spike Growth', damage: '2d4 per 5ft pushed per beam', rating: 'S+', note: '4 beams × 10ft push through spikes = 16d4 bonus. Devastating.' },
  { combo: 'Quickened EB + EB (Sorlock)', damage: '4 beams + 4 beams at L17', total: '8×(1d10+5) = 84 avg', rating: 'S+', note: 'Requires Sorcerer multiclass for Quickened Spell.' },
  { combo: 'EB + Hexblade\'s Curse', damage: '+PB per beam', rating: 'S', note: 'PB added to every beam. At L17: +6 per beam × 4 = +24 DPR.' },
  { combo: 'EB + Darkness + Devil\'s Sight', effect: 'Advantage on all EB attacks. Enemies can\'t see you.', rating: 'A+', note: 'You see through Darkness. They don\'t. Free advantage.' },
];

export const EB_VS_OTHER_CANTRIPS = {
  eldritchBlast: { damage: '1d10 force', range: 120, beams: 'Yes', push: 'Yes (invocation)', note: 'Best by far with invocations.' },
  fireBolt: { damage: '1d10 fire', range: 120, beams: 'No (single hit)', push: 'No', note: 'No CHA scaling. No forced movement. Worse in every way.' },
  tollTheDead: { damage: '1d12 necrotic (damaged target)', range: 60, beams: 'No', push: 'No', note: 'Save-based. No invocation support.' },
  sacredFlame: { damage: '1d8 radiant', range: 60, beams: 'No', push: 'No', note: 'DEX save. No cover bonus. Worst damage.' },
};

export const EB_ACCESS_WITHOUT_WARLOCK = [
  { method: 'Magic Initiate (Warlock)', note: 'Get EB + one other Warlock cantrip + L1 Warlock spell.', rating: 'B', caveat: 'No Agonizing Blast. EB without AB is mediocre.' },
  { method: 'Spell Sniper', note: 'Get EB + doubled range (240ft).', rating: 'B', caveat: 'Still no Agonizing Blast.' },
  { method: 'Warlock 2 dip', note: 'Get EB + Agonizing Blast + one more invocation.', rating: 'S', caveat: 'Best method. 2 levels for full EB power.' },
];
