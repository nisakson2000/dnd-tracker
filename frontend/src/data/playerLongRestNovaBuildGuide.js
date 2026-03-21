/**
 * playerLongRestNovaBuildGuide.js
 * Player Mode: Nova builds — maximum burst damage in a single round
 * Pure JS — no React dependencies.
 */

export const NOVA_DEFINITION = {
  concept: 'Nova = spending all resources in one round for maximum damage. "Go nova" = unload everything.',
  when: 'Boss fights, single-enemy encounters, when the fight MUST end NOW.',
  tradeoff: 'After going nova, you\'re resource-depleted. Only nova when the fight is worth it.',
};

export const TOP_NOVA_BUILDS = [
  {
    build: 'Sorcadin (Paladin/Sorcerer)',
    level: 'Paladin 2 / Sorcerer X (or Paladin 6 / Sorcerer X)',
    novaRound: 'Quicken Hold Person → attack with advantage → auto-crit → Smite on each hit',
    damage: '2 attacks: 2 × (2d6 weapon + 4d8 smite doubled + 2d8 crit bonus) ≈ 100-120 in 1 round',
    rating: 'S+',
    note: 'Hold Person = auto-crits. Smite dice doubled on crit. Devastating.',
  },
  {
    build: 'Fighter (Battle Master) Action Surge',
    level: 'Fighter 11+',
    novaRound: 'Action (3 attacks) + Action Surge (3 attacks) = 6 attacks in 1 round',
    damage: '6 × (2d6+5+10 GWM) = 138 avg (all hit with advantage)',
    rating: 'S+',
    note: 'Most attacks in 1 round. GWM on all 6. Precision Attack to ensure hits.',
  },
  {
    build: 'Assassin Rogue / Gloom Stalker',
    level: 'Rogue 3 / Ranger (Gloom Stalker) 5+',
    novaRound: 'Surprise: all hits are auto-crits. 3+ attacks R1 with doubled SA dice.',
    damage: 'Varies wildly. Auto-crit Sneak Attack = doubled doubled dice.',
    rating: 'S+ (if surprised)',
    note: 'Requires surprise. If achieved, potentially 100+ damage R1.',
  },
  {
    build: 'Hexblade Paladin Crit Fisher',
    level: 'Paladin 6 / Hexblade 2+',
    novaRound: 'Hexblade Curse (19-20 crit) + Elven Accuracy (3 dice) + Smite on crits',
    damage: 'Per crit: 2d6+4d8+4d8 (doubled smite) ≈ 50+ per crit. ~27% crit rate.',
    rating: 'S++',
    note: 'Best sustained nova. Every round has ~27% chance of massive crit.',
  },
  {
    build: 'Sorlock (Sorcerer/Warlock) Quicken EB',
    level: 'Sorcerer 5+ / Warlock 2+',
    novaRound: 'EB (action) + Quicken EB (BA) = 4 beams at L5, 8 at L17',
    damage: '4 × (1d10+1d6+5) at L5 = 56 avg. 8 beams at L17 = 112 avg.',
    rating: 'S',
    note: 'Sustained nova. Sorcery points are the limiter.',
  },
  {
    build: 'Berserker Barbarian / Fighter',
    level: 'Barbarian 3 / Fighter 2',
    novaRound: 'Rage + Reckless + Frenzy (BA attack) + Action Surge (extra action)',
    damage: '5 attacks with advantage × (1d12+7+10 GWM) = 115 avg (all hit)',
    rating: 'A+',
    note: 'Frenzy exhaustion is the cost. Worth it for boss kills.',
  },
];

export const NOVA_ENABLERS = [
  { enabler: 'Hold Person/Monster', effect: 'Auto-crits in melee. Doubles all dice.', rating: 'S++', note: 'Best nova enabler. Paladin Smite + auto-crit = insane.' },
  { enabler: 'Action Surge', effect: 'Entire extra action. Double your attacks.', rating: 'S+', note: 'Best feature for nova. 1-turn resource.' },
  { enabler: 'Haste', effect: 'Extra action (1 attack) + double speed.', rating: 'S', note: 'Extra attack + mobility. Risk: lose a turn if concentration drops.' },
  { enabler: 'Advantage (any source)', effect: 'Higher hit rate + crit chance.', rating: 'S', note: 'Reckless Attack, Faerie Fire, flanking, Vow of Enmity.' },
  { enabler: 'Divine Smite (Paladin)', effect: '+2d8 to +5d8 per hit.', rating: 'S+', note: 'Only spent on confirmed hits. Save for crits.' },
  { enabler: 'Hexblade Curse', effect: '+PB to damage + crit on 19-20.', rating: 'S', note: 'Expanded crit + damage. Pairs with Smite.' },
  { enabler: 'Quickened Spell', effect: 'Cast a spell as BA.', rating: 'S', note: 'Hold Person (BA) → attack with auto-crits (action).' },
];

export const NOVA_TIPS = [
  'Only go nova on fights that matter. Don\'t waste resources on trash mobs.',
  'Hold Person/Monster → Smite on auto-crits is the highest single-round damage possible.',
  'Action Surge is the best 2-level dip for any nova build.',
  'Save Smite slots for crits. The dice doubling is the entire point.',
  'Quickened Hold Person → full attack action = entire nova in one round.',
  'Communicate: "I\'m going nova this round. Don\'t waste your action on this enemy."',
  'After nova, you\'re depleted. Have a fallback plan (cantrips, weapons).',
  'Fighter 11 + Action Surge = 6 attacks. With GWM, that\'s 60+ extra damage.',
  'Gloom Stalker R1 burst doesn\'t cost resources — it\'s free nova every combat.',
  'Elven Accuracy + Hexblade Curse: 27% crit rate. Smite on every crit.',
];
