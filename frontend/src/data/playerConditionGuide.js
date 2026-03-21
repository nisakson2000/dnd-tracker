/**
 * playerConditionGuide.js
 * Player Mode: All D&D 5e conditions — effects, sources, and counters
 * Pure JS — no React dependencies.
 */

export const CONDITIONS = [
  {
    condition: 'Blinded',
    effects: ['Auto-fail checks requiring sight', 'Attack rolls have disadvantage', 'Attacks against you have advantage'],
    sources: ['Blindness/Deafness', 'Color Spray', 'Darkness (no darkvision)', 'Fog Cloud'],
    counters: ['Lesser Restoration', 'Dispel Magic', 'Blindsight/Tremorsense', 'Leave the area (Darkness/Fog)'],
    severity: 'High',
  },
  {
    condition: 'Charmed',
    effects: ['Can\'t attack the charmer', 'Charmer has advantage on social checks against you'],
    sources: ['Charm Person', 'Hypnotic Pattern', 'Vampire Charm', 'Fey creatures'],
    counters: ['Calm Emotions', 'Protection from Evil and Good', 'Dispel Magic', 'Damage from charmer ends some charms'],
    severity: 'Medium-High',
  },
  {
    condition: 'Deafened',
    effects: ['Auto-fail checks requiring hearing', 'Immune to Thunder damage effects? No — just can\'t hear'],
    sources: ['Blindness/Deafness', 'Thunderwave (temporary)', 'Silence (area, not condition)'],
    counters: ['Lesser Restoration', 'Dispel Magic'],
    severity: 'Low',
  },
  {
    condition: 'Frightened',
    effects: ['Disadvantage on ability checks and attacks while source is in line of sight', 'Can\'t willingly move closer to source'],
    sources: ['Fear', 'Cause Fear', 'Dragon Frightful Presence', 'Wraith Life Drain', 'Conquest Paladin'],
    counters: ['Heroes\' Feast (immune)', 'Calm Emotions', 'Berserker Rage (immune)', 'Devotion Paladin Aura (immune in 10ft)'],
    severity: 'Medium-High',
  },
  {
    condition: 'Grappled',
    effects: ['Speed becomes 0', 'Condition ends if grappler is incapacitated or you\'re moved out of reach'],
    sources: ['Grapple action (Athletics vs Athletics/Acrobatics)', 'Monster abilities (tentacles, etc.)'],
    counters: ['Escape (Athletics/Acrobatics vs Athletics)', 'Misty Step/teleportation', 'Thunderwave (pushes grappler)', 'Freedom of Movement (immune)'],
    severity: 'Medium',
  },
  {
    condition: 'Incapacitated',
    effects: ['Can\'t take actions or reactions'],
    sources: ['Hypnotic Pattern', 'Tasha\'s Hideous Laughter', 'Banishment (on native plane creatures)'],
    counters: ['Damage often breaks it', 'Ally uses action to shake you free', 'Dispel Magic'],
    severity: 'High',
  },
  {
    condition: 'Invisible',
    effects: ['Impossible to see without special sense/magic', 'Advantage on attacks, disadvantage on attacks against you'],
    sources: ['Invisibility', 'Greater Invisibility', 'Potion of Invisibility'],
    counters: ['See Invisibility', 'Faerie Fire', 'Truesight', 'Blindsight', 'AoE spells (don\'t need to see)'],
    severity: 'Beneficial (for you)',
  },
  {
    condition: 'Paralyzed',
    effects: ['Incapacitated + can\'t move or speak', 'Auto-fail STR and DEX saves', 'Attacks have advantage', 'Hits from within 5ft are auto-crits'],
    sources: ['Hold Person/Monster', 'Ghoul Touch', 'Beholder Paralyzing Ray'],
    counters: ['Repeat save each turn (Hold Person)', 'Dispel Magic', 'Freedom of Movement (immune)', 'Lesser Restoration'],
    severity: 'Critical',
  },
  {
    condition: 'Petrified',
    effects: ['Transformed to inanimate stone. Incapacitated. Weight × 10. Unaware. Resistance to all damage. Immune to poison/disease. Suspended aging.'],
    sources: ['Flesh to Stone', 'Beholder Petrification Ray', 'Medusa/Basilisk/Cockatrice gaze'],
    counters: ['Greater Restoration (5th)', 'Stone to Flesh (Transmute, if available)', 'Wish'],
    severity: 'Critical (effectively dead)',
  },
  {
    condition: 'Poisoned',
    effects: ['Disadvantage on attack rolls and ability checks'],
    sources: ['Poison damage (many sources)', 'Ray of Sickness', 'Giant Spider bite', 'Assassin\'s Blood'],
    counters: ['Lesser Restoration', 'Protection from Poison', 'Paladin Lay on Hands (5 HP for one poison)', 'Antitoxin (advantage on saves)'],
    severity: 'Medium',
  },
  {
    condition: 'Prone',
    effects: ['Disadvantage on attacks', 'Melee attacks against you have advantage', 'Ranged attacks against you have disadvantage', 'Must spend half movement to stand up'],
    sources: ['Shove action', 'Trip Attack', 'Grease/Sleet Storm', 'Knocked flying (Thunderwave)'],
    counters: ['Stand up (costs half movement)', 'Can\'t stand if grappled (speed 0)', 'Fly (immune to prone from ground effects)'],
    severity: 'Medium',
  },
  {
    condition: 'Restrained',
    effects: ['Speed becomes 0', 'Attacks have disadvantage', 'Attacks against you have advantage', 'Disadvantage on DEX saves'],
    sources: ['Entangle', 'Web', 'Grappler feat (pin)', 'Net', 'Ensnaring Strike'],
    counters: ['STR check/save to break free', 'Misty Step/teleportation', 'Slashing damage to cut web/rope', 'Freedom of Movement'],
    severity: 'High',
  },
  {
    condition: 'Stunned',
    effects: ['Incapacitated + can\'t move + can only speak falteringly', 'Auto-fail STR and DEX saves', 'Attacks against you have advantage'],
    sources: ['Stunning Strike (Monk)', 'Power Word Stun', 'Mind Blast (Mind Flayer)', 'Contagion (Slimy Doom)'],
    counters: ['Repeat save (most effects)', 'Can\'t be prevented during the stun'],
    severity: 'Critical',
  },
  {
    condition: 'Unconscious',
    effects: ['Incapacitated + can\'t move or speak + drop what you\'re holding + fall prone', 'Auto-fail STR/DEX saves', 'Attacks have advantage', 'Hits from 5ft are auto-crits'],
    sources: ['0 HP', 'Sleep spell', 'Drow Poison', 'Eyebite'],
    counters: ['Healing (any amount wakes from 0 HP)', 'Damage wakes from sleep', 'Action to wake (shake/slap)'],
    severity: 'Critical',
  },
];

export const CONDITION_REMOVAL = {
  lesserRestoration: { level: 2, removes: ['Blinded', 'Deafened', 'Paralyzed', 'Poisoned'] },
  greaterRestoration: { level: 5, removes: ['Charmed', 'Petrified', 'Cursed', 'Ability score reduction', 'Max HP reduction', 'Exhaustion (1 level)'] },
  freedomOfMovement: { level: 4, prevents: ['Grappled', 'Restrained', 'Paralyzed (movement only)', 'Difficult terrain', 'Underwater movement penalties'] },
  herosFeast: { level: 6, prevents: ['Frightened', 'Poisoned'], duration: '24 hours' },
  calmEmotions: { level: 2, suppresses: ['Charmed', 'Frightened'], duration: 'Concentration, 1 minute' },
};

export function conditionSeverity(conditionName) {
  const c = CONDITIONS.find(cond => cond.condition.toLowerCase() === conditionName.toLowerCase());
  return c ? c.severity : 'Unknown';
}
