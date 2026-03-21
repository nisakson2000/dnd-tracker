/**
 * playerSpellCounterplay.js
 * Player Mode: How to counter common enemy spells and abilities
 * Pure JS — no React dependencies.
 */

export const ENEMY_SPELL_COUNTERS = [
  { spell: 'Fireball', counter: 'Absorb Elements (reaction, halve + gain element), Evasion (Rogue/Monk), Counterspell, spread out to limit targets', priority: 'High' },
  { spell: 'Hold Person', counter: 'High WIS save, Calm Emotions, Dispel Magic, allies can repeat your save by dealing damage', priority: 'Critical' },
  { spell: 'Banishment', counter: 'High CHA save, Counterspell. If banished: party must break caster\'s concentration. You return where you left.', priority: 'Critical' },
  { spell: 'Hypnotic Pattern', counter: 'Avert your gaze (disadvantage but safe), Elves immune (Fey Ancestry), ally uses action to shake you awake', priority: 'High' },
  { spell: 'Wall of Force', counter: 'Disintegrate destroys it. Teleport bypasses it. Otherwise... wait 10 minutes.', priority: 'Medium' },
  { spell: 'Counterspell', counter: 'Subtle Spell (Sorcerer), cast from beyond 60ft, cast from behind cover (they must SEE you), use Darkness', priority: 'High' },
  { spell: 'Dominate Person', counter: 'High WIS save, repeat saves when taking damage, allies grapple/restrain you until it ends', priority: 'Critical' },
  { spell: 'Power Word Kill', counter: 'Stay above 100 HP. That\'s the ONLY defense (no save). Counterspell if you see it coming.', priority: 'Critical' },
  { spell: 'Polymorph (enemy)', counter: 'Kill the polymorphed form quickly — they revert with full HP but wasted concentration. Or Dispel Magic.', priority: 'Medium' },
  { spell: 'Fear', counter: 'High WIS save, can\'t see the caster = immune, Heroes\' Feast makes you immune', priority: 'High' },
  { spell: 'Slow', counter: 'High WIS save. Save at end of each turn. Dispel Magic. Less devastating than Hold but still bad.', priority: 'Medium' },
  { spell: 'Forcecage', counter: 'Almost nothing. Teleport works but DC 10 CHA save. Disintegrate on the bars. Prevention is key.', priority: 'Critical' },
];

export const LEGENDARY_ACTION_COUNTERS = [
  { ability: 'Legendary Resistance', counter: 'Burn them with low-level save-or-suck spells first. 3 uses typically. Then drop the big spell.', tip: 'Faerie Fire, Entangle, and Blindness are great LR bait (low slots, still good if resisted).' },
  { ability: 'Lair Actions', counter: 'Fight OUTSIDE the lair if possible. If not, be ready for environmental effects on initiative 20.', tip: 'Lair actions happen on initiative count 20. Plan movement accordingly.' },
  { ability: 'Frightful Presence', counter: 'Heroes\' Feast (immune to fear), Paladin Aura of Courage, or high WIS saves.', tip: 'If you save once, you\'re immune for 24 hours. Tank the first save.' },
  { ability: 'Breath Weapon', counter: 'Spread out (don\'t cluster). Absorb Elements. Evasion. Fire/Cold resistance.', tip: 'After a breath weapon, there\'s usually a recharge (5-6 on d6). Expect 2-3 per fight.' },
];

export const ANTI_MAGIC_TACTICS = [
  { tactic: 'Kill the caster first', detail: 'Casters are usually squishy. Rush them. Stun them. Silence them.' },
  { tactic: 'Break concentration', detail: 'Damage forces a CON save. Multiple small hits are better than one big hit for breaking concentration.' },
  { tactic: 'Counterspell', detail: 'The premier anti-caster tool. But costs your reaction and a 3rd+ level slot.' },
  { tactic: 'Silence', detail: '20ft radius sphere. No verbal components = most spells can\'t be cast. Devastating.' },
  { tactic: 'Grapple the caster', detail: 'Grappled = speed 0. Can\'t escape without using their action. Limits positioning.' },
  { tactic: 'Line of sight', detail: 'Most spells need to see the target. Full cover, Darkness, Fog Cloud all block spells.' },
  { tactic: 'Dispel Magic', detail: 'End ongoing spell effects. Auto-success for same level or lower, check for higher.' },
];

export function getCounter(spellName) {
  return ENEMY_SPELL_COUNTERS.find(e =>
    e.spell.toLowerCase().includes((spellName || '').toLowerCase())
  ) || null;
}

export function getCriticalCounters() {
  return ENEMY_SPELL_COUNTERS.filter(e => e.priority === 'Critical');
}
