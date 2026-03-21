/**
 * playerStormSorcererGuide.js
 * Player Mode: Storm Sorcery Sorcerer — the tempest caster
 * Pure JS — no React dependencies.
 */

export const STORM_SORCERER_BASICS = {
  class: 'Sorcerer (Storm Sorcery)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Storm magic. Fly when casting. Lightning resistance. Wind-based crowd control.',
  note: 'Thematic and fun but mechanically weaker than Divine Soul or Clockwork. Tempestuous Magic gives free fly-by movement. Storm Guide is flavorful.',
};

export const STORM_SORCERER_FEATURES = [
  { feature: 'Wind Speaker', level: 1, effect: 'Speak, read, write Primordial (and its dialects: Aquan, Auran, Ignan, Terran).', note: 'Ribbon feature. Free languages. Useful when dealing with elementals.' },
  { feature: 'Tempestuous Magic', level: 1, effect: 'When you cast a L1+ spell, bonus action: fly 10ft without provoking opportunity attacks.', note: 'Free disengage-fly every time you cast a spell. Hit-and-run caster. No concentration, no resource cost.' },
  { feature: 'Heart of the Storm', level: 6, effect: 'Resistance to lightning and thunder damage. When you cast a L1+ lightning/thunder spell: deal half your Sorcerer level in lightning or thunder damage to creatures of your choice within 10ft.', note: 'Free AoE damage when casting lightning/thunder spells. At L10: 5 damage to all nearby enemies. Plus resistance.' },
  { feature: 'Storm Guide', level: 6, effect: 'Action: stop rain in 20ft sphere around you. Or bonus action: choose wind direction in 100ft sphere.', note: 'Mostly flavor/RP. Can matter in sailing campaigns or weather-dependent encounters. No resource cost.' },
  { feature: 'Storm\'s Fury', level: 14, effect: 'When hit by melee attack: reaction: deal lightning damage = Sorcerer level to attacker. STR save or pushed 20ft straight away.', note: 'At L14: 14 lightning damage + potential 20ft push. No resource cost. Punishes melee attackers.' },
  { feature: 'Wind Soul', level: 18, effect: 'Immunity to lightning and thunder. Permanent fly speed of 60ft. Action: reduce fly to 30ft, grant 30ft fly to 3+CHA creatures for 1 hour.', note: 'Permanent 60ft flight. Can share with party. Capstone is excellent but you need to reach L18.' },
];

export const STORM_SORCERER_TACTICS = [
  { tactic: 'Tempestuous Magic hit-and-run', detail: 'Cast spell → bonus action fly 10ft away → no opportunity attacks. Kite melee enemies every turn for free.', rating: 'S' },
  { tactic: 'Booming Blade + Tempestuous Magic', detail: 'Melee Booming Blade → fly 10ft away. Enemy must move to reach you → triggers Booming Blade extra damage.', rating: 'A' },
  { tactic: 'Heart of the Storm + Thunderwave', detail: 'Cast Thunderwave (thunder spell). Heart of the Storm deals bonus damage to nearby enemies. Double AoE hit.', rating: 'A' },
  { tactic: 'Lightning Bolt + Heart of the Storm', detail: 'Lightning Bolt for line damage. Heart of the Storm hits anyone within 10ft of you. Then Tempestuous Magic fly away.', rating: 'A' },
  { tactic: 'Storm\'s Fury melee punish', detail: 'L14: enemies hit you in melee → 14 lightning + potential 20ft push. Makes you dangerous to engage in melee.', rating: 'A' },
];

export const STORM_SORCERER_SPELL_PICKS = [
  { spell: 'Thunderwave', note: 'L1 thunder AoE + push. Triggers Heart of the Storm. Con save. Good early game.', rating: 'A' },
  { spell: 'Shatter', note: 'L2 thunder damage. 3d8 in 10ft sphere. Triggers Heart of the Storm bonus.', rating: 'A' },
  { spell: 'Lightning Bolt', note: 'L3 lightning line. 8d6 damage. Triggers Heart of the Storm. Classic blaster spell.', rating: 'A' },
  { spell: 'Storm Sphere', note: 'L4 concentration. 20ft sphere: difficult terrain, 2d6 bludgeoning. Bonus action: 4d6 lightning bolt each turn.', rating: 'A' },
  { spell: 'Chain Lightning', note: 'L6. 10d8 to primary, 45 avg to 3 secondary targets. Massive multi-target damage.', rating: 'S' },
];

export function heartOfTheStormDamage(sorcererLevel) {
  return Math.floor(sorcererLevel / 2);
}

export function stormsFuryDamage(sorcererLevel) {
  return sorcererLevel;
}
