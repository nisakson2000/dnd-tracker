/**
 * playerGolemEncounters.js
 * Player Mode: Fighting constructs and golems — immunities and strategies
 * Pure JS — no React dependencies.
 */

export const CONSTRUCT_TRAITS = {
  immunities: ['Poison damage', 'Psychic damage', 'Poisoned condition', 'Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Petrified'],
  commonResistances: ['Non-magical BPS (most golems)'],
  magicResistance: 'Some have Magic Resistance (advantage on saves vs spells).',
  immutableForm: 'Immune to any spell/effect that would alter form (Polymorph, etc).',
  note: 'Constructs can\'t be charmed, frightened, or poisoned. Most save-or-suck spells fail.',
};

export const GOLEM_TYPES = [
  { type: 'Flesh Golem', cr: 5, hp: 93, ac: 9, key: 'Lightning heals it. Fire/cold slows it. Berserk below 40 HP.', counter: 'Avoid lightning. Use non-elemental damage. Kill fast before Berserk.' },
  { type: 'Clay Golem', cr: 9, hp: 133, ac: 14, key: 'Immune to non-magical attacks. Acid heals it. Haste ability.', counter: 'Magic weapons required. Avoid acid. High burst damage when it slows.' },
  { type: 'Stone Golem', cr: 10, hp: 178, ac: 17, key: 'Slow effect (WIS save). Immune to non-adamantine weapons.', counter: 'Adamantine weapons or spell damage only. WIS saves vs Slow.' },
  { type: 'Iron Golem', cr: 16, hp: 210, ac: 20, key: 'Fire heals it. Poison breath (10d8). Immune to non-adamantine.', counter: 'Adamantine or magic. NO fire. Cold/force/psychic damage. Stay away from breath.' },
  { type: 'Shield Guardian', cr: 7, hp: 142, ac: 17, key: 'Bound to an amulet. Stores spells. Regeneration.', counter: 'Destroy or steal the amulet. Guardian obeys amulet holder.' },
];

export const ANTI_CONSTRUCT_SPELLS = [
  { spell: 'Heat Metal (2nd)', effect: 'Works on metallic constructs. 2d8 fire + disadvantage. Ignores fire healing if DM rules it differently.', note: 'DM may rule Iron Golem absorbs this. Discuss.' },
  { spell: 'Shatter (2nd)', effect: 'Constructs have disadvantage on the save. Thunder damage.', rating: 'S' },
  { spell: 'Disintegrate (6th)', effect: 'Force damage. Bypasses all resistances. 10d6+40.', rating: 'S' },
  { spell: 'Psychic damage spells', effect: 'Wait — constructs are immune to psychic damage!', rating: 'F' },
  { spell: 'Forcecage (7th)', effect: 'Trap the golem. It can\'t get out without CHA save (and golems have bad CHA).', rating: 'S' },
  { spell: 'Antimagic Field (8th)', effect: 'Most constructs are powered by magic. Some DMs rule they go inert in AMF.', rating: 'Depends' },
];

export const CONSTRUCT_TACTICS = [
  'Check for elemental absorption BEFORE casting. Iron Golem heals from fire. Flesh Golem heals from lightning.',
  'Shatter is your best friend — constructs have disadvantage on the save.',
  'Adamantine weapons bypass stone/iron golem weapon immunity.',
  'Force damage (Eldritch Blast, Magic Missile, Disintegrate) bypasses all resistances.',
  'Constructs follow orders. If you can identify and neutralize their controller, they may stop.',
  'Shield Guardians obey whoever holds the amulet. Steal it.',
  'Don\'t waste save-or-suck spells. Constructs are immune to most conditions.',
];

export function canDamageGolem(golemType, damageType, weaponMaterial) {
  const healedBy = { 'Flesh Golem': 'lightning', 'Clay Golem': 'acid', 'Iron Golem': 'fire' };
  if (healedBy[golemType] === damageType) return 'HEALS the golem!';

  const needsAdamantine = ['Stone Golem', 'Iron Golem'];
  if (needsAdamantine.includes(golemType) && weaponMaterial !== 'adamantine' && damageType === 'physical') return false;

  return true;
}
