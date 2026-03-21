/**
 * playerCounterspellMasteryGuide.js
 * Player Mode: Counterspell optimization — when to counter and when to hold
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_RULES = {
  level: 3,
  school: 'Abjuration',
  castingTime: '1 reaction (when a creature within 60 feet casts a spell)',
  range: '60 feet',
  components: 'S',
  duration: 'Instantaneous',
  classes: ['Sorcerer', 'Warlock', 'Wizard'],
  effect: 'Automatically counter spells of 3rd level or lower. For higher level spells, make an ability check: DC = 10 + spell level.',
};

export const COUNTERSPELL_CHECK_PROBABILITY = [
  { spellLevel: 4, dc: 14, rawChance: '35%', withJoT: '45%', withAE: '55%', note: 'Risky without bonuses.' },
  { spellLevel: 5, dc: 15, rawChance: '30%', withJoT: '40%', withAE: '50%', note: 'Coin flip at best.' },
  { spellLevel: 6, dc: 16, rawChance: '25%', withJoT: '35%', withAE: '45%', note: 'Upcast Counterspell or boost.' },
  { spellLevel: 7, dc: 17, rawChance: '20%', withJoT: '30%', withAE: '40%', note: 'Very difficult.' },
  { spellLevel: 8, dc: 18, rawChance: '15%', withJoT: '25%', withAE: '35%', note: 'Upcast to L5+ or boost.' },
  { spellLevel: 9, dc: 19, rawChance: '10%', withJoT: '20%', withAE: '30%', note: 'Almost impossible raw. Need bonuses.' },
];

export const COUNTERSPELL_BOOSTERS = [
  { method: 'Upcast Counterspell', effect: 'Counter spells at or below the slot used. No check needed.', rating: 'S+', note: 'L5 slot → auto-counter L5 and below. Most reliable method.' },
  { method: 'Abjuration Wizard', effect: 'Add proficiency to ability check for Counterspell.', rating: 'S+', note: 'Best class for Counterspelling. +6 at high levels.' },
  { method: 'Jack of All Trades (Bard)', effect: 'Add half PB to the check.', rating: 'A+', note: 'Bards can learn Counterspell via Magical Secrets. JoT applies.' },
  { method: 'Flash of Genius (Artificer)', effect: 'Add INT mod to ability check (reaction, 30ft).', rating: 'S', note: 'Artificer ally can boost YOUR Counterspell check.' },
  { method: 'Enhance Ability (Cat\'s Grace/etc)', effect: 'Advantage on one type of ability check.', rating: 'B+', note: 'Doesn\'t directly apply to Counterspell checks. DM discretion.' },
  { method: 'Bardic Inspiration', effect: 'Add BI die to the check.', rating: 'A+', note: 'If ally gave you Inspiration, use it on the Counterspell check.' },
  { method: 'Glibness (Bard L8)', effect: 'Minimum 15 on CHA checks. If Counterspell uses CHA...', rating: 'S (if CHA-based)', note: 'Technically ability check defaults to spellcasting ability. CHA for Bard/Sorc/Lock.' },
];

export const WHEN_TO_COUNTERSPELL = [
  { situation: 'Enemy casts Fireball/big damage spell', priority: 'High', reason: 'Prevent massive party damage. Worth a L3 slot.' },
  { situation: 'Enemy casts Banishment/Polymorph on ally', priority: 'Very High', reason: 'Removing an ally = losing an entire turn economy.' },
  { situation: 'Enemy casts Heal/Revivify', priority: 'High', reason: 'Prevent enemy from recovering. Keep pressure up.' },
  { situation: 'Enemy casts buff spell (Haste/Shield of Faith)', priority: 'Medium', reason: 'Depends on how impactful the buff is. Haste = counter. Bless = maybe.' },
  { situation: 'Enemy casts Counterspell on YOUR ally', priority: 'Very High', reason: 'Counter-counterspell! Save your ally\'s spell. Meta but effective.' },
  { situation: 'Enemy casts a cantrip', priority: 'Low', reason: 'Don\'t waste a L3 slot on a cantrip. Exception: Power Word Kill setup.' },
  { situation: 'Enemy casts Teleport/Plane Shift (escape)', priority: 'Maximum', reason: 'If the enemy escapes, you may never catch them. Counter at all costs.' },
  { situation: 'You don\'t know what the spell is', priority: 'Medium', reason: 'Arcana check (reaction, DC 15 + spell level) to identify. Risky to counter blind.' },
];

export const COUNTERSPELL_ETIQUETTE = [
  'You must be able to SEE the creature casting. Subtle Spell counters Counterspell.',
  'You must be within 60 feet. Position matters.',
  'RAW: you may not know the spell level before deciding to Counterspell.',
  'Some DMs allow Arcana checks (reaction) to identify the spell first.',
  'Counter-counterspelling is legal and a key tactic.',
  'Warlocks: your slots are high level but scarce. Counterspell costs more for you.',
  'Sorcerer Subtle Spell: your spells CAN\'T be Counterspelled (no S component visible).',
];

export const COUNTERSPELL_TIPS = [
  'Position within 60ft of enemy casters. If you\'re 65ft away, you can\'t Counterspell.',
  'Save Counterspell for fight-ending spells. Don\'t blow it on low-impact magic.',
  'Sorcerers: Subtle Spell your big spells to avoid getting counter-countered.',
  'Abjuration Wizard is THE Counterspell specialist. +PB to checks is game-changing.',
  'Bard with Counterspell (Magical Secrets) + Jack of All Trades + Glibness = auto-counter everything.',
  'If the enemy Counterspells your ally, you Counterspell their Counterspell. Chain complete.',
  'At L5, upcast to L5 to auto-counter anything L5 and below. Worth the slot.',
  'Having two Counterspellers in the party is incredible insurance.',
  'Subtle Spell Counterspell can\'t be counter-counterspelled. Ultimate denial.',
];
