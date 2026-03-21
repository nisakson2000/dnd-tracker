/**
 * playerSpellRangeGuide.js
 * Player Mode: Spell range reference and optimal casting distances
 * Pure JS — no React dependencies.
 */

export const SPELL_RANGES = [
  { range: 'Touch', distance: '0ft (touch)', spells: ['Cure Wounds', 'Inflict Wounds', 'Shocking Grasp', 'Bestow Curse'], note: 'Familiars can deliver touch spells! Owl + Flyby = safe delivery.' },
  { range: 'Self', distance: '0ft (self)', spells: ['Shield', 'Misty Step', 'Spirit Guardians', 'Armor of Agathys'], note: 'Only affects the caster. Some have an area centered on self.' },
  { range: '30ft', distance: '30ft', spells: ['Healing Word', 'Command', 'Bless', 'Guiding Bolt'], note: 'Common short range. Stay within this of your frontline for support.' },
  { range: '60ft', distance: '60ft', spells: ['Counterspell', 'Fireball (origin)', 'Hold Person', 'Dispel Magic'], note: 'Most common spell range. Counterspell range — stay within 60ft of enemy casters.' },
  { range: '90ft', distance: '90ft', spells: ['Eldritch Blast', 'Faerie Fire', 'Slow'], note: 'Extended range. Eldritch Blast with Spell Sniper = 120ft.' },
  { range: '120ft', distance: '120ft', spells: ['Fire Bolt', 'Ray of Frost', 'Lightning Bolt', 'Fireball'], note: 'Standard damage cantrip range. Usually safe from melee.' },
  { range: '150ft', distance: '150ft', spells: ['Fireball (max reach)', 'Meteor Swarm (origin)'], note: 'Fireball at 150ft: cast from 150ft, explodes 150ft away. Total reach.' },
  { range: '300ft', distance: '300ft', spells: ['Eldritch Blast (Spell Sniper)', 'Dimension Door'], note: 'Extreme range. Warlock sniping from safety.' },
  { range: '1 mile+', distance: '1 mile or more', spells: ['Sending', 'Dream', 'Scrying', 'Teleport'], note: 'Communication and travel spells. No combat use at this range.' },
];

export const RANGE_TACTICS = [
  { tactic: 'Counterspell Positioning', detail: 'Stay within 60ft of the enemy caster. Too far = can\'t Counterspell. Too close = melee danger.', idealRange: '55-60ft' },
  { tactic: 'Healer Positioning', detail: 'Healing Word (60ft) lets you heal from safety. Cure Wounds (touch) requires you to be in melee range.', idealRange: '30-60ft behind frontline' },
  { tactic: 'Blaster Positioning', detail: 'Fire Bolt/Eldritch Blast at 120ft. Stay back and blast. Use cover.', idealRange: '80-120ft' },
  { tactic: 'Controller Positioning', detail: 'Most control spells are 60-90ft. Need line of sight but not line of fire.', idealRange: '50-90ft' },
  { tactic: 'Spirit Guardians Cleric', detail: 'Self-centered 15ft radius. Need to be IN the fight. Heavy armor essential.', idealRange: '0-5ft (melee)' },
];

export const SPELL_SNIPER_BENEFITS = {
  feat: 'Spell Sniper',
  effects: [
    'Double the range of attack roll spells',
    'Ignore half and three-quarters cover',
    'Learn one attack roll cantrip from any class',
  ],
  bestFor: 'Warlocks (Eldritch Blast 240ft), long-range blasters',
  rating: 'B (niche but strong when applicable)',
};

export function getSpellRange(spellName) {
  for (const rangeGroup of SPELL_RANGES) {
    if (rangeGroup.spells.some(s => s.toLowerCase().includes((spellName || '').toLowerCase()))) {
      return rangeGroup;
    }
  }
  return null;
}

export function isInRange(casterDistance, spellRange) {
  return casterDistance <= spellRange;
}
