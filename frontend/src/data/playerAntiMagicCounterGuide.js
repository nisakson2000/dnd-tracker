/**
 * playerAntiMagicCounterGuide.js
 * Player Mode: Dealing with anti-magic, magic resistance, and counterspelling
 * Pure JS — no React dependencies.
 */

export const ANTIMAGIC_FIELD = {
  spell: 'Antimagic Field (L8, Cleric/Wizard)',
  effect: '10ft sphere centered on self. ALL magic suppressed inside.',
  suppresses: [
    'Spells and spell effects (including ongoing)',
    'Magic items (become mundane)',
    'Supernatural abilities',
    'Summoned creatures (gone while in field)',
    'Magical attacks and damage',
  ],
  doesNotAffect: [
    'Artifacts and deity-level magic',
    'Non-magical abilities (Reckless Attack, Sneak Attack, Extra Attack)',
    'Physical attacks with mundane weapons',
    'Natural abilities (Darkvision — debatable)',
  ],
  note: 'Walk up to an enemy caster. They can\'t cast. You punch them with mundane weapons.',
};

export const MAGIC_RESISTANCE = {
  whatItIs: 'Advantage on saving throws against spells and other magical effects.',
  creatures: 'Many high-CR monsters, Yuan-ti, Satyr, Gnome Cunning (INT/WIS/CHA only).',
  countering: [
    'Force them to roll more saves (burn through advantage with multiple casters).',
    'Use spells without saves (Magic Missile, Heat Metal ongoing, Animate Objects).',
    'Use non-magical effects (grapple, shove, environment, mundane traps).',
    'Heightened Spell (3 SP): impose disadvantage. Cancels their advantage = normal roll.',
    'Features that don\'t count as "spells" bypass MR (Channel Divinity, Ki, Maneuvers).',
  ],
};

export const COUNTERSPELL_TACTICS = {
  basics: {
    range: '60ft. Must see the caster.',
    action: 'Reaction. Cast when you see creature within 60ft casting a spell.',
    autoSuccess: 'If your Counterspell level >= their spell level.',
    check: 'If their spell is higher: ability check DC 10 + spell level.',
  },
  optimization: [
    { tip: 'Position within 60ft of enemy casters.', priority: 'S+' },
    { tip: 'Counter their Counter: if they try to Counterspell YOUR spell, an ally can Counter their Counter.', priority: 'S' },
    { tip: 'Subtle Spell makes your spells uncounterable (no verbal/somatic to see).', priority: 'S+' },
    { tip: 'Abjuration Wizard: +PB to Counterspell checks.', priority: 'S' },
    { tip: 'Bard Jack of All Trades: +half PB to Counterspell checks (ability check).', priority: 'A+' },
    { tip: 'Glibness (Bard L8): minimum 15 on CHA checks. Counterspell checks auto-pass against L5 and below.', priority: 'S' },
    { tip: 'Don\'t counter cantrips. Save reaction for leveled spells.', priority: 'A+' },
    { tip: 'You can\'t identify enemy spells before deciding to counter (RAW). Some DMs allow Arcana checks.', priority: 'Note' },
  ],
};

export const SPELL_RESISTANCE_BYPASS = [
  { method: 'Non-spell abilities', example: 'Channel Divinity, Ki abilities, Battle Master Maneuvers, Breath Weapon', note: 'These aren\'t spells. Magic Resistance doesn\'t apply.' },
  { method: 'No-save spells', example: 'Magic Missile, Heat Metal (after first hit), Cloud of Daggers, Animate Objects', note: 'No save = no advantage. Guaranteed effect.' },
  { method: 'Heightened Spell', example: '3 SP: impose disadvantage on first save', note: 'Disadvantage cancels advantage from Magic Resistance = normal roll.' },
  { method: 'Physical effects', example: 'Grapple, shove, traps, environmental hazards', note: 'Not magical. No resistance applies.' },
  { method: 'Antimagic Field', example: 'Walk into their space. No magic for anyone.', note: 'Nuclear option. Suppresses everything including your own magic.' },
  { method: 'Multiple casters', example: 'Force multiple saves per round', note: 'Advantage helps but can\'t save against everything. Volume beats resistance.' },
];

export const DEALING_WITH_IMMUNITY = {
  note: 'Some creatures are IMMUNE to specific spell effects or damage types.',
  strategies: [
    'Identify immunities first: Arcana/Nature/Religion check, or trial and error.',
    'Switch damage types: Transmuted Spell metamagic, or use different spells.',
    'Use conditions they\'re not immune to: immune to charmed ≠ immune to restrained.',
    'Non-magical damage: punching, pushing, environmental damage bypasses most spell immunities.',
    'Mundane weapons: against magic-immune creatures, physical attacks always work.',
    'Force damage: almost nothing is immune to force. Magic Missile, Eldritch Blast.',
  ],
};
