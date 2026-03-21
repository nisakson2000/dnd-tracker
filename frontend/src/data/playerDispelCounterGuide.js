/**
 * playerDispelCounterGuide.js
 * Player Mode: Dispel Magic and Counterspell — rules, timing, and optimization
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_RULES = {
  level: 'L3 (Sorcerer, Warlock, Wizard)',
  casting: 'Reaction. When you see a creature within 60ft casting a spell.',
  autoSuccess: 'Auto-counters spells of L3 or lower.',
  higherLevel: 'Spells L4+: ability check DC = 10 + spell level.',
  upcast: 'Cast Counterspell at higher level to auto-counter that level.',
  note: 'You usually don\'t know what spell is being cast (DM may allow Arcana check).',
};

export const DISPEL_MAGIC_RULES = {
  level: 'L3 (Bard, Cleric, Druid, Paladin, Sorcerer, Warlock, Wizard)',
  casting: 'Action. Choose one creature, object, or magical effect within 120ft.',
  autoSuccess: 'Auto-dispels spells of L3 or lower.',
  higherLevel: 'Spells L4+: ability check DC = 10 + spell level.',
  upcast: 'Cast at higher level to auto-dispel that level.',
  note: 'Targets one effect per cast. Multiple effects = multiple casts.',
};

export const COUNTERSPELL_OPTIMIZATION = [
  { method: 'Abjuration Wizard', bonus: 'Add proficiency to ability checks for Counterspell.', note: 'L10 feature. +4 to +6 on the check. Huge.' },
  { method: 'Subtle Spell (Sorcerer)', bonus: 'Your spells can\'t be countered (no V/S components visible).', note: 'Enemy can\'t Counterspell what they can\'t see you cast.' },
  { method: 'Upcast to Match', bonus: 'Cast at same level as target spell = auto-success.', note: 'If you know it\'s a L5 spell, Counterspell at L5.' },
  { method: 'Glibness (L8 Bard)', bonus: 'Minimum 15 on CHA checks. Counterspell uses CHA.', note: 'Minimum 15 on Counterspell check. Auto-counter up to L8.' },
  { method: 'Jack of All Trades (Bard)', bonus: '+half proficiency to Counterspell check.', note: 'Bards add JoAT to ability checks including Counterspell.' },
  { method: 'Cast from Beyond 60ft', bonus: 'If YOU are more than 60ft from enemy caster, they can\'t counter you.', note: 'Range of Counterspell is 60ft. Stay 65ft away.' },
];

export const WHEN_TO_COUNTERSPELL = [
  { priority: 'S+', spell: 'Hold Person/Monster, Banishment', why: 'Save-or-suck removal of a party member.' },
  { priority: 'S+', spell: 'Power Word Kill/Stun', why: 'No save. Instant incapacitation or death.' },
  { priority: 'S', spell: 'Fireball, Cone of Cold', why: 'High AoE damage to multiple party members.' },
  { priority: 'S', spell: 'Wall of Force, Forcecage', why: 'Traps party members. Fight becomes unwinnable.' },
  { priority: 'A+', spell: 'Counterspell (their counter)', why: 'Counter their Counterspell to protect your ally\'s spell.' },
  { priority: 'A', spell: 'Heal, Mass Cure Wounds', why: 'Undo all your damage output in one spell.' },
  { priority: 'B', spell: 'Buff spells (Haste, Shield of Faith)', why: 'Prevent enemy buffs. Lower priority.' },
  { priority: 'C', spell: 'Low-level/cantrip damage', why: 'Not worth a L3+ slot for minor damage.' },
];

export const COUNTERSPELL_VS_DISPEL = {
  counterspell: { timing: 'Reaction. WHILE spell is being cast.', range: '60ft from caster.', prevents: 'Stops spell from ever taking effect.' },
  dispelMagic: { timing: 'Action. AFTER spell is already active.', range: '120ft from effect.', removes: 'Ends an ongoing magical effect.' },
  decision: 'Counterspell to prevent. Dispel Magic to remove. Both need ability checks for high-level spells.',
};

export const COUNTER_DISPEL_TIPS = [
  'Counterspell: reaction to PREVENT. Dispel Magic: action to REMOVE.',
  'Auto-success if cast at same level or higher than target spell.',
  'You can Counterspell a Counterspell. Yes, really.',
  'Subtle Spell: your spells can\'t be countered. Sorcerer exclusive.',
  'Stay 65ft from enemy casters. They can\'t Counterspell you at 60ft+.',
  'Bard: Jack of All Trades applies to Counterspell checks.',
  'Abjuration Wizard L10: +proficiency to Counterspell checks.',
  'Don\'t waste Counterspell on cantrips or low-level damage.',
  'Counter save-or-suck spells first. Hold Person, Banishment.',
  'Carry Counterspell AND Dispel Magic. Different tools for different jobs.',
];
