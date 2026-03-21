/**
 * playerBestSubclassDipsGuide.js
 * Player Mode: Best 1-3 level dips for each class
 * Pure JS — no React dependencies.
 */

export const BEST_DIPS_BY_CLASS = {
  fighter: {
    bestDips: [
      { dip: 'Fighter 1', gets: 'Heavy armor, CON save prof, Second Wind, Fighting Style.', bestFor: 'Any class wanting heavy armor + CON saves.' },
      { dip: 'Fighter 2', gets: 'Action Surge. Extra action once per rest.', bestFor: 'Any class. Double spell turn. Best 2-level dip in the game.' },
      { dip: 'Fighter 3', gets: 'Subclass. Battlemaster maneuvers, Echo Knight echo.', bestFor: 'Specific builds wanting maneuvers or echo.' },
    ],
    note: 'Fighter 2 (Action Surge) is the best 2-level dip for any class.',
  },
  warlock: {
    bestDips: [
      { dip: 'Hexblade 1', gets: 'CHA for weapon attacks, Shield spell, Hexblade\'s Curse, medium armor.', bestFor: 'Paladin, Bard, Sorcerer. CHA SAD builds.' },
      { dip: 'Warlock 2', gets: 'Eldritch Invocations (Agonizing Blast, Devil\'s Sight).', bestFor: 'EB builds. Darkness combo builds.' },
      { dip: 'Warlock 3', gets: 'Pact Boon (Pact of the Blade, Chain, Tome).', bestFor: 'Blade Pact builds. Deeper investment.' },
    ],
    note: 'Hexblade 1 is the most powerful single-level dip in 5e.',
  },
  cleric: {
    bestDips: [
      { dip: 'Cleric 1 (Life)', gets: 'Heavy armor, Shield prof, Bless, Healing Word, Life domain bonus healing.', bestFor: 'Druid (Goodberry + Life domain = 40 HP from L1 slot).' },
      { dip: 'Cleric 1 (Forge)', gets: 'Heavy armor, +1 weapon/armor (free), Shield of Faith.', bestFor: 'Any build wanting free +1 item.' },
      { dip: 'Cleric 1 (Twilight)', gets: 'Heavy armor, 300ft darkvision, Faerie Fire.', bestFor: 'Any build. 300ft darkvision is absurd.' },
      { dip: 'Cleric 2', gets: 'Channel Divinity. Varies by domain.', bestFor: 'Knowledge (expertise), Twilight (temp HP), War (bonus attack).' },
    ],
    note: 'Cleric 1 gives heavy armor + WIS casting. Incredible flexibility.',
  },
  rogue: {
    bestDips: [
      { dip: 'Rogue 1', gets: 'Expertise (2 skills), Sneak Attack (1d6), Thieves\' Tools prof.', bestFor: 'Skill monkey builds. Bard, Ranger.' },
      { dip: 'Rogue 2', gets: 'Cunning Action (bonus Dash/Disengage/Hide).', bestFor: 'Any melee that wants mobility.' },
      { dip: 'Rogue 3', gets: 'Subclass. Swashbuckler (free Disengage), Scout (more expertise).', bestFor: 'Specific multiclass combos.' },
    ],
    note: 'Rogue 1 for expertise. Rogue 2 for Cunning Action. Clean dips.',
  },
  paladin: {
    bestDips: [
      { dip: 'Paladin 2', gets: 'Divine Smite, Fighting Style, spellcasting.', bestFor: 'Any CHA melee. Warlock especially (short rest smite slots).' },
      { dip: 'Paladin 6', gets: 'Aura of Protection (+CHA to all saves in 10ft).', bestFor: 'Deep investment but best aura in the game.' },
    ],
    note: 'Paladin 2 for smite. Paladin 6 for aura. Requires STR 13 + CHA 13.',
  },
  barbarian: {
    bestDips: [
      { dip: 'Barbarian 1', gets: 'Rage (resist phys damage), Unarmored Defense (CON + DEX).', bestFor: 'Fighter, Rogue wanting damage resistance.' },
      { dip: 'Barbarian 2', gets: 'Reckless Attack (advantage on STR attacks, enemies get advantage on you).', bestFor: 'Any STR melee wanting consistent advantage.' },
      { dip: 'Barbarian 3', gets: 'Subclass. Bear Totem (resist all damage except psychic while raging).', bestFor: 'Ultimate tank builds.' },
    ],
    note: 'Can\'t cast or concentrate on spells while raging. Big restriction.',
  },
  ranger: {
    bestDips: [
      { dip: 'Ranger 2 (Tasha\'s)', gets: 'Fighting Style + spellcasting.', bestFor: 'Niche. Mostly outclassed by other dips.' },
      { dip: 'Gloom Stalker 3', gets: 'Dread Ambusher (+1 attack round 1, +1d8), invisible to darkvision.', bestFor: 'Fighter (Action Surge + Dread Ambusher = insane round 1).' },
    ],
    note: 'Gloom Stalker 3 + Fighter X is a top-tier multiclass.',
  },
  monk: {
    bestDips: [
      { dip: 'Monk 1', gets: 'Martial Arts, Unarmored Defense (WIS + DEX).', bestFor: 'Very niche. Most builds don\'t want Monk dip.' },
    ],
    note: 'Monk is generally better as a single class. Dip value is low.',
  },
  wizard: {
    bestDips: [
      { dip: 'Wizard 2 (War Magic)', gets: 'Arcane Deflection (+2 AC/+4 saves as reaction). Tactical Wit (INT to initiative).', bestFor: 'Eldritch Knight Fighter wanting better defense.' },
      { dip: 'Wizard 2 (Divination)', gets: 'Portent (replace any roll with pre-rolled d20s).', bestFor: 'Any INT-based build. Portent is incredibly powerful.' },
      { dip: 'Wizard 2 (Bladesinging)', gets: 'Bladesong (AC + INT, concentration saves + INT).', bestFor: 'Gish builds. High-INT melee casters.' },
    ],
    note: 'Wizard dip requires INT 13. Best for classes already using INT.',
  },
};

export const MULTICLASS_REQUIREMENTS = [
  { class: 'Barbarian', requirement: 'STR 13' },
  { class: 'Bard', requirement: 'CHA 13' },
  { class: 'Cleric', requirement: 'WIS 13' },
  { class: 'Druid', requirement: 'WIS 13' },
  { class: 'Fighter', requirement: 'STR 13 or DEX 13' },
  { class: 'Monk', requirement: 'DEX 13 and WIS 13' },
  { class: 'Paladin', requirement: 'STR 13 and CHA 13' },
  { class: 'Ranger', requirement: 'DEX 13 and WIS 13' },
  { class: 'Rogue', requirement: 'DEX 13' },
  { class: 'Sorcerer', requirement: 'CHA 13' },
  { class: 'Warlock', requirement: 'CHA 13' },
  { class: 'Wizard', requirement: 'INT 13' },
  { class: 'Artificer', requirement: 'INT 13' },
];

export const SUBCLASS_DIP_TIPS = [
  'Hexblade 1: best single-level dip. CHA for attacks + Shield spell.',
  'Fighter 2 (Action Surge): best 2-level dip. Extra action = double spell turn.',
  'Cleric 1: heavy armor + healing spells. Huge for any WIS-based class.',
  'Life Cleric 1 + Druid: Goodberry heals 4 HP each (40 total from L1 slot).',
  'Don\'t multiclass before L5 in your main class. Extra Attack/L3 spells.',
  'Paladin 6 (Aura): best aura in 5e. +CHA to all saves in 10ft.',
  'Barbarian rage: can\'t cast spells. Major restriction for caster dips.',
  'Gloom Stalker 3 + Fighter: insane round 1 burst. Top multiclass combo.',
  'Check ability score requirements before planning a multiclass.',
  'Single class is always viable. Multiclass for specific combos, not power.',
];
