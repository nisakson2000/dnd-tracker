/**
 * playerFiendSlaying.js
 * Player Mode: Fighting fiends — devils, demons, and their unique challenges
 * Pure JS — no React dependencies.
 */

export const DEVIL_VS_DEMON = {
  devils: {
    origin: 'Nine Hells (Lawful Evil)',
    traits: ['Methodical and strategic', 'Make deals and contracts', 'Hierarchical society', 'Fire immunity', 'Poison immunity'],
    combatStyle: 'Tactical. Use minions, contracts, and manipulation before combat.',
  },
  demons: {
    origin: 'Abyss (Chaotic Evil)',
    traits: ['Savage and unpredictable', 'Pure destruction', 'No organization', 'Varied immunities', 'Often poisonous'],
    combatStyle: 'Berserker rush. Overwhelm with numbers and brutality.',
  },
};

export const COMMON_FIEND_FEATURES = {
  immunities: ['Fire (most devils)', 'Poison (almost all fiends)', 'Poisoned condition'],
  resistances: ['Cold (many)', 'Non-magical BPS (most higher CR)'],
  magicResistance: 'Advantage on saves against spells and magical effects. Very common.',
  telepathy: 'Most fiends have telepathy. They can coordinate without speaking.',
  truesight: 'Many powerful fiends have Truesight. Invisibility doesn\'t work.',
};

export const FIEND_THREATS = [
  { fiend: 'Imp', cr: 1, danger: 'Invisible. Shapechange. Spy and report. Poison sting.', counter: 'See Invisibility. Detect Magic. Low HP (10).' },
  { fiend: 'Bearded Devil', cr: 3, danger: 'Infernal Wound: ongoing bleed (1d10/turn). Requires DC 12 Medicine or healing.', counter: 'Heal the wound immediately. Don\'t ignore the bleed.' },
  { fiend: 'Hezrou', cr: 8, danger: 'Stench aura: CON save or poisoned. Strong grappler.', counter: 'Ranged attacks. Protection from Poison. Stay out of stench range.' },
  { fiend: 'Bone Devil', cr: 9, danger: 'Sting poison: poisoned condition. Devil\'s Sight. Fly speed.', counter: 'CON saves. Poison resistance. Ground it.' },
  { fiend: 'Horned Devil', cr: 11, danger: 'Infernal Wound (bleed). High damage. Fly speed.', counter: 'Heal bleed ASAP. Ground with Earthbind.' },
  { fiend: 'Glabrezu', cr: 9, danger: 'Innate spellcasting (Confusion, Fly, Power Word Stun). Grapple + crush.', counter: 'Counterspell. Freedom of Movement vs grapple.' },
  { fiend: 'Marilith', cr: 16, danger: '7 attacks per turn. Reactive (can use reaction on every turn). Magic resistance.', counter: 'Hold Monster after LR burned. Focus fire. She\'ll parry 1 attack/round.' },
  { fiend: 'Balor', cr: 19, danger: 'Fire aura (3d6). Death Throes (20d6 fire in 30ft). Whip pulls you in.', counter: 'Fire resistance MANDATORY. When it dies, RUN (30ft away in 1 round).' },
  { fiend: 'Pit Fiend', cr: 20, danger: 'Fear aura. Poison. Fireball at will. Flight. Multiattack.', counter: 'Heroes\' Feast (fear + poison immune). Fire resistance. Focus fire.' },
];

export const ANTI_FIEND_TOOLKIT = [
  { tool: 'Protection from Evil and Good', effect: 'Disadvantage on fiend attacks. Can\'t be charmed/frightened/possessed.', rating: 'S' },
  { tool: 'Magic Circle', effect: 'Trap a fiend. They can\'t enter/leave the circle.', rating: 'A' },
  { tool: 'Banishment', effect: 'CHA save. Returns fiend to native plane. If held 1 minute: permanent.', rating: 'S' },
  { tool: 'Dispel Evil and Good', effect: 'Banish a fiend on hit. Or end charm/frighten/possession.', rating: 'A' },
  { tool: 'Holy Weapon', effect: '+2d8 radiant per hit. Not fire, so it works on fire-immune fiends.', rating: 'S' },
  { tool: 'Silvered weapons', effect: 'Bypass resistance to non-magical BPS. 100 gp per weapon.', rating: 'A' },
  { tool: 'Forbiddance', effect: 'Fiends take 5d10 radiant for entering the area. Ritual.', rating: 'S' },
];

export function fiendDamageType(fiendType) {
  if (['Devil', 'Pit Fiend', 'Erinyes'].includes(fiendType)) return 'fire';
  if (['Demon', 'Hezrou', 'Vrock'].includes(fiendType)) return 'poison';
  return 'varies';
}

export function silveredWeaponCost(weaponBaseCost) {
  return weaponBaseCost + 100;
}
