/**
 * playerConditionTracker.js
 * Player Mode: Tracking active conditions, their effects, and how to remove them
 * Pure JS — no React dependencies.
 */

export const CONDITIONS = {
  Blinded: {
    effects: ['Auto-fail sight-based ability checks', 'Attack rolls against you have advantage', 'Your attack rolls have disadvantage'],
    removal: ['Greater Restoration', 'Heal', 'Lesser Restoration (if caused by disease/poison)', 'Waiting for the spell/effect to end'],
    duration: 'Varies by source',
    severity: 'High',
  },
  Charmed: {
    effects: ['Can\'t attack or target the charmer with harmful abilities/spells', 'Charmer has advantage on social ability checks against you'],
    removal: ['Taking damage from the charmer or charmer\'s allies (some spells)', 'Spell ending', 'Calm Emotions (suppresses)', 'Remove Curse (if curse-based)'],
    duration: 'Varies — some save each round, some on damage',
    severity: 'High',
  },
  Deafened: {
    effects: ['Auto-fail hearing-based ability checks', 'Can\'t hear'],
    removal: ['Lesser Restoration', 'Greater Restoration', 'Heal'],
    duration: 'Varies',
    severity: 'Low (unless caster needing verbal components)',
  },
  Frightened: {
    effects: ['Disadvantage on ability checks and attack rolls while source is in line of sight', 'Can\'t willingly move closer to the source'],
    removal: ['Breaking line of sight', 'Calm Emotions', 'Heroes\' Feast (immune)', 'Berserker Rage (immune while raging)'],
    duration: 'Varies — often save at end of turn',
    severity: 'High',
  },
  Grappled: {
    effects: ['Speed becomes 0', 'Can\'t benefit from speed bonuses'],
    removal: ['Escape: Athletics/Acrobatics vs grappler\'s Athletics', 'Forced movement that separates you', 'Teleportation (Misty Step)', 'Incapacitating the grappler'],
    duration: 'Until escaped or grappler releases',
    severity: 'Medium',
  },
  Incapacitated: {
    effects: ['Can\'t take actions or reactions'],
    removal: ['Depends on source — usually spell ending or save'],
    duration: 'Varies',
    severity: 'Very High',
  },
  Invisible: {
    effects: ['Heavily obscured (can\'t be seen without special senses)', 'Attack rolls against you have disadvantage', 'Your attack rolls have advantage'],
    removal: ['Faerie Fire', 'See Invisibility', 'True Seeing', 'Attacking or casting breaks most invisibility spells', 'AoE spells (don\'t need to see target)'],
    duration: 'Varies',
    severity: 'Beneficial condition',
  },
  Paralyzed: {
    effects: ['Incapacitated', 'Can\'t move or speak', 'Auto-fail STR and DEX saves', 'Attack rolls have advantage', 'Hits within 5ft are automatic crits'],
    removal: ['Save at end of turn (most sources)', 'Greater Restoration', 'Lesser Restoration (if poison/disease)', 'Dispel Magic on the spell'],
    duration: 'Usually save each round',
    severity: 'Critical',
  },
  Petrified: {
    effects: ['Incapacitated', 'Can\'t move or speak', 'Unaware of surroundings', 'Auto-fail STR and DEX saves', 'Resistance to all damage', 'Immune to poison and disease', 'Weight × 10'],
    removal: ['Greater Restoration', 'Flesh to Stone reversal', 'Wish'],
    duration: 'Usually permanent until cured',
    severity: 'Critical',
  },
  Poisoned: {
    effects: ['Disadvantage on attack rolls', 'Disadvantage on ability checks'],
    removal: ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP)', 'Paladin immunity at level 3 (Divine Health)', 'Antitoxin (advantage on saves vs poison for 1 hour)'],
    duration: 'Varies',
    severity: 'Medium',
  },
  Prone: {
    effects: ['Disadvantage on attack rolls', 'Melee attacks against you have advantage', 'Ranged attacks against you have disadvantage', 'Can only crawl (1ft costs 2ft movement)', 'Standing up costs half your speed'],
    removal: ['Stand up (costs half speed)', 'Levitate/Fly (if available)'],
    duration: 'Until you stand up',
    severity: 'Medium',
  },
  Restrained: {
    effects: ['Speed becomes 0', 'Attack rolls against you have advantage', 'Your attack rolls have disadvantage', 'Disadvantage on DEX saves'],
    removal: ['STR check/save against source DC', 'Cutting restraints', 'Freedom of Movement spell', 'Dispel Magic on magical restraints'],
    duration: 'Varies',
    severity: 'High',
  },
  Stunned: {
    effects: ['Incapacitated', 'Can\'t move', 'Can speak only falteringly', 'Auto-fail STR and DEX saves', 'Attack rolls against you have advantage'],
    removal: ['Usually ends at end of target\'s next turn', 'Some effects allow saves'],
    duration: 'Usually 1 round',
    severity: 'Very High',
  },
  Unconscious: {
    effects: ['Incapacitated', 'Can\'t move or speak', 'Unaware of surroundings', 'Drop everything', 'Fall prone', 'Auto-fail STR and DEX saves', 'Attack rolls have advantage', 'Hits within 5ft are automatic crits'],
    removal: ['Healing (any amount)', 'Stabilize + time', 'Wake up (if sleeping)'],
    duration: 'Until healed or stabilized',
    severity: 'Critical',
  },
};

export const CONDITION_IMMUNITIES = {
  Elf: ['Charmed (advantage on saves, not full immunity — Fey Ancestry)'],
  'Half-Elf': ['Charmed (advantage — Fey Ancestry)'],
  Gnome: ['Charmed/Frightened/etc. (advantage on INT/WIS/CHA saves vs magic — Gnome Cunning)'],
  Paladin: ['Disease (immune at level 3)', 'Frightened (Aura of Courage at level 10, extends to allies)'],
  Barbarian: ['Frightened (while raging, Berserker)'],
  Monk: ['Disease (Purity of Body at level 10)', 'Poisoned (Purity of Body at level 10)'],
};

export function getConditionInfo(conditionName) {
  return CONDITIONS[conditionName] || null;
}

export function getRemovalOptions(conditionName) {
  const info = CONDITIONS[conditionName];
  return info ? info.removal : ['Unknown — check the source effect for removal conditions.'];
}

export function createConditionEntry(conditionName, source, dc, duration) {
  return {
    condition: conditionName,
    source,
    dc,
    duration,
    appliedRound: 0,
    effects: CONDITIONS[conditionName]?.effects || [],
    severity: CONDITIONS[conditionName]?.severity || 'Unknown',
  };
}
