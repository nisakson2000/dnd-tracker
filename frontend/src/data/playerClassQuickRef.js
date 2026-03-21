/**
 * playerClassQuickRef.js
 * Player Mode: Per-class quick reference cards for combat turns
 * Pure JS — no React dependencies.
 */

export const CLASS_QUICK_REFS = [
  {
    className: 'Barbarian',
    hitDie: 'd12',
    primaryAbility: 'STR',
    savingThrows: ['STR', 'CON'],
    combatPriority: [
      'Rage (bonus action) if not already raging.',
      'Reckless Attack for advantage (gives enemies advantage too).',
      'Attack (Extra Attack at 5th).',
      'Move to protect squishier allies.',
    ],
    keyReminders: ['Rage: resistance to BPS, advantage on STR, +damage', 'Danger Sense: advantage on DEX saves you can see'],
  },
  {
    className: 'Bard',
    hitDie: 'd8',
    primaryAbility: 'CHA',
    savingThrows: ['DEX', 'CHA'],
    combatPriority: [
      'Concentration spell if not already concentrating (Faerie Fire, Hypnotic Pattern).',
      'Bardic Inspiration to ally (bonus action).',
      'Cantrip attack or weapon attack.',
      'Consider Cutting Words (Lore) as reaction.',
    ],
    keyReminders: ['Jack of All Trades: +half prof to all non-proficient checks', 'Countercharm (6th): advantage vs charm/fear for nearby allies'],
  },
  {
    className: 'Cleric',
    hitDie: 'd8',
    primaryAbility: 'WIS',
    savingThrows: ['WIS', 'CHA'],
    combatPriority: [
      'Spiritual Weapon (bonus action, no concentration!).',
      'Spirit Guardians if in melee range.',
      'Healing Word (bonus action) to revive downed allies.',
      'Sacred Flame or melee attack.',
      'Channel Divinity when appropriate.',
    ],
    keyReminders: ['Spiritual Weapon: bonus action attack each turn, no concentration', 'Preserve Life (Life): distribute 5x level HP as action'],
  },
  {
    className: 'Druid',
    hitDie: 'd8',
    primaryAbility: 'WIS',
    savingThrows: ['INT', 'WIS'],
    combatPriority: [
      'Wild Shape (bonus action) for melee combat.',
      'Concentration spell: Entangle, Call Lightning, Conjure Animals.',
      'Healing Word for downed allies.',
      'Cantrips: Produce Flame, Thorn Whip.',
    ],
    keyReminders: ['Wild Shape HP is a buffer — revert with remaining HP', 'Can maintain concentration while in Wild Shape'],
  },
  {
    className: 'Fighter',
    hitDie: 'd10',
    primaryAbility: 'STR or DEX',
    savingThrows: ['STR', 'CON'],
    combatPriority: [
      'Attack action (Extra Attack: 2 at 5th, 3 at 11th, 4 at 20th).',
      'Action Surge for double action turn.',
      'Second Wind (bonus action) for self-healing.',
      'Battle Master: apply maneuvers to attacks.',
    ],
    keyReminders: ['Action Surge: two full action turns', 'Indomitable (9th): reroll a failed save'],
  },
  {
    className: 'Monk',
    hitDie: 'd8',
    primaryAbility: 'DEX and WIS',
    savingThrows: ['STR', 'DEX'],
    combatPriority: [
      'Attack action (Extra Attack at 5th).',
      'Bonus: Flurry of Blows (1 ki) or Martial Arts (free unarmed strike).',
      'Stunning Strike on hit (1 ki, 5th level).',
      'Patient Defense (1 ki) if surrounded.',
      'Step of the Wind (1 ki) to escape.',
    ],
    keyReminders: ['Stunning Strike: most powerful use of ki', 'Deflect Missiles: reduce ranged damage by 1d10+DEX+level'],
  },
  {
    className: 'Paladin',
    hitDie: 'd10',
    primaryAbility: 'STR and CHA',
    savingThrows: ['WIS', 'CHA'],
    combatPriority: [
      'Attack (Extra Attack at 5th).',
      'Divine Smite on hits (especially crits!).',
      'Smite spells (bonus action, before attacking).',
      'Lay on Hands for emergency healing.',
      'Aura of Protection: +CHA to saves within 10ft.',
    ],
    keyReminders: ['Save smites for crits — all dice doubled!', 'Aura of Protection: allies within 10ft get +CHA to saves'],
  },
  {
    className: 'Ranger',
    hitDie: 'd10',
    primaryAbility: 'DEX and WIS',
    savingThrows: ['STR', 'DEX'],
    combatPriority: [
      'Hunter\'s Mark (bonus action, 1st turn).',
      'Attack (Extra Attack at 5th).',
      'Move Hunter\'s Mark when target dies (bonus action).',
      'Use terrain and range to advantage.',
    ],
    keyReminders: ['Hunter\'s Mark: +1d6 per hit, move when target dies', 'Favored terrain/enemy bonuses if applicable'],
  },
  {
    className: 'Rogue',
    hitDie: 'd8',
    primaryAbility: 'DEX',
    savingThrows: ['DEX', 'INT'],
    combatPriority: [
      'Ensure Sneak Attack conditions (advantage OR ally within 5ft of target).',
      'Attack with finesse/ranged weapon.',
      'Cunning Action: Hide (bonus) for advantage next turn.',
      'Cunning Action: Disengage (bonus) to escape safely.',
      'Uncanny Dodge (reaction) to halve incoming damage.',
    ],
    keyReminders: ['Sneak Attack: once per TURN (not round) — can trigger on OA', 'Two-weapon fighting: second chance to land Sneak Attack'],
  },
  {
    className: 'Sorcerer',
    hitDie: 'd6',
    primaryAbility: 'CHA',
    savingThrows: ['CON', 'CHA'],
    combatPriority: [
      'Apply Metamagic to spells (Quickened, Twinned, etc.).',
      'Concentration spell if not already up.',
      'Damage cantrips: Fire Bolt, Ray of Frost.',
      'Shield (reaction) when hit.',
      'Convert sorcery points to slots if needed.',
    ],
    keyReminders: ['Twinned Haste/Polymorph = double the buff', 'Subtle Spell: uncounterable spells, stealth casting'],
  },
  {
    className: 'Warlock',
    hitDie: 'd8',
    primaryAbility: 'CHA',
    savingThrows: ['WIS', 'CHA'],
    combatPriority: [
      'Hex (bonus action, 1st turn if not up).',
      'Eldritch Blast (force damage, multiple beams at higher levels).',
      'Move Hex when target dies (bonus action).',
      'Save high-level slots for critical moments.',
    ],
    keyReminders: ['Pact slots recharge on SHORT rest', 'Eldritch Blast + Agonizing Blast + Hex = strong sustained damage'],
  },
  {
    className: 'Wizard',
    hitDie: 'd6',
    primaryAbility: 'INT',
    savingThrows: ['INT', 'WIS'],
    combatPriority: [
      'Concentration spell: Web, Hypnotic Pattern, Wall of Force.',
      'Counterspell enemy casters (reaction).',
      'Shield (reaction) when hit.',
      'Damage cantrips: Fire Bolt, Toll the Dead.',
      'Use positioning to stay out of melee.',
    ],
    keyReminders: ['Arcane Recovery: regain slots on 1 short rest/day', 'Prepared spells: INT mod + wizard level'],
  },
];

export function getClassQuickRef(className) {
  return CLASS_QUICK_REFS.find(c => c.className.toLowerCase() === (className || '').toLowerCase()) || null;
}

export function getCombatPriority(className) {
  const ref = getClassQuickRef(className);
  return ref ? ref.combatPriority : [];
}
