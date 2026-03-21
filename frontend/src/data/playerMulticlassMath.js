/**
 * playerMulticlassMath.js
 * Player Mode: Multiclass spell slot calculations and class combination math
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_SPELL_TABLE = [
  { level: 1, slots: [2,0,0,0,0,0,0,0,0] },
  { level: 2, slots: [3,0,0,0,0,0,0,0,0] },
  { level: 3, slots: [4,2,0,0,0,0,0,0,0] },
  { level: 4, slots: [4,3,0,0,0,0,0,0,0] },
  { level: 5, slots: [4,3,2,0,0,0,0,0,0] },
  { level: 6, slots: [4,3,3,0,0,0,0,0,0] },
  { level: 7, slots: [4,3,3,1,0,0,0,0,0] },
  { level: 8, slots: [4,3,3,2,0,0,0,0,0] },
  { level: 9, slots: [4,3,3,3,1,0,0,0,0] },
  { level: 10, slots: [4,3,3,3,2,0,0,0,0] },
  { level: 11, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 12, slots: [4,3,3,3,2,1,0,0,0] },
  { level: 13, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 14, slots: [4,3,3,3,2,1,1,0,0] },
  { level: 15, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 16, slots: [4,3,3,3,2,1,1,1,0] },
  { level: 17, slots: [4,3,3,3,2,1,1,1,1] },
  { level: 18, slots: [4,3,3,3,3,1,1,1,1] },
  { level: 19, slots: [4,3,3,3,3,2,1,1,1] },
  { level: 20, slots: [4,3,3,3,3,2,2,1,1] },
];

export const CASTER_TYPE_MULTIPLIERS = {
  full: { classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'], multiplier: 1 },
  half: { classes: ['Paladin', 'Ranger'], multiplier: 0.5, note: 'Round down. Need level 2 to count.' },
  third: { classes: ['Eldritch Knight', 'Arcane Trickster'], multiplier: 1/3, note: 'Round down. Need level 3 to count.' },
  artificer: { classes: ['Artificer'], multiplier: 0.5, note: 'Round UP (unlike Paladin/Ranger).' },
  pact: { classes: ['Warlock'], multiplier: 0, note: 'Pact Magic slots are SEPARATE. Don\'t add to multiclass table. But CAN use slots to cast any known spell.' },
};

export const WARLOCK_SLOT_INTERACTION = {
  rule: 'Warlock Pact Magic slots are separate from multiclass spellcaster slots.',
  usage: 'You CAN use Warlock slots to cast non-Warlock spells, and multiclass slots to cast Warlock spells.',
  shortRest: 'Warlock slots recover on short rest. Multiclass slots only on long rest.',
  sorlock: 'Sorlock exploit: Convert short-rest Warlock slots into Sorcery Points. Effectively infinite SP.',
  coffeelock: 'Coffeelock: Don\'t long rest. Keep converting Warlock slots to SP. Controversial. Many DMs ban.',
};

export const POPULAR_MULTICLASS_BREAKPOINTS = [
  { combo: 'Paladin 6 / Warlock 1', reason: 'Aura of Protection (L6) is too important to delay. Then Hexblade dip.' },
  { combo: 'Sorcerer X / Warlock 2', reason: 'EB + Agonizing Blast + 2 short rest slots for SP conversion. Minimal investment.' },
  { combo: 'Fighter 5 / Wizard 2', reason: 'Extra Attack first, then War Wizard for Shield + initiative + Arcane Deflection.' },
  { combo: 'Rogue 5 / Fighter 3', reason: 'Uncanny Dodge first, then Battle Master maneuvers.' },
  { combo: 'Druid X / Cleric 1', reason: 'Life Cleric 1 for Goodberry healing exploit. Then full Druid.' },
  { combo: 'Ranger 5 / Rogue X', reason: 'Extra Attack + Ranger spells, then Rogue for Sneak Attack + Cunning Action.' },
];

export function multiclassCasterLevel(classes) {
  let total = 0;
  for (const c of classes) {
    switch (c.type) {
      case 'full': total += c.level; break;
      case 'half': total += Math.floor(c.level / 2); break;
      case 'third': total += Math.floor(c.level / 3); break;
      case 'artificer': total += Math.ceil(c.level / 2); break;
    }
  }
  return total;
}

export function getSlots(casterLevel) {
  const entry = MULTICLASS_SPELL_TABLE.find(e => e.level === casterLevel);
  return entry ? entry.slots : [0,0,0,0,0,0,0,0,0];
}
