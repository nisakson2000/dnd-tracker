/**
 * playerSpellcasterDuel.js
 * Player Mode: Fighting enemy spellcasters — anti-mage tactics
 * Pure JS — no React dependencies.
 */

export const ANTI_MAGE_PRIORITIES = [
  { priority: 'Break concentration', detail: 'Hit the caster. Force concentration saves. Even a cantrip forces a DC 10 check.', rating: 'S' },
  { priority: 'Counterspell', detail: 'Always have Counterspell ready. 3rd level counters anything 3rd or below automatically.', rating: 'S' },
  { priority: 'Silence', detail: '2nd level, 20ft radius. No verbal components = no spells (most spells need verbal).', rating: 'S' },
  { priority: 'Grapple the caster', detail: 'Speed 0. Can\'t run. Still can cast (somatic/verbal ok) but can\'t escape easily.', rating: 'A' },
  { priority: 'Close distance', detail: 'Most casters are fragile. Get in melee range. They\'ll waste actions on escape.', rating: 'S' },
  { priority: 'Focus fire', detail: 'Kill the caster first. Always. Their spells threaten the whole party.', rating: 'S' },
];

export const COUNTERSPELL_GUIDE = {
  automatic: 'Counterspell at same level or higher = automatic counter. No check needed.',
  check: 'Counterspell at lower level: ability check DC 10 + spell level.',
  range: '60ft. You must SEE the creature casting.',
  reaction: 'Costs your reaction. Can\'t Counterspell and Shield in the same round.',
  counterCounter: 'Enemy can Counterspell YOUR Counterspell. Have a second caster as backup.',
  subtleSpell: 'Subtle Spell Counterspell can\'t be Counterspelled (no visible components).',
};

export const SILENCE_TACTICS = {
  spell: 'Silence (2nd level, concentration)',
  radius: '20ft',
  effect: 'No sound. No verbal components. Most spells require verbal.',
  placement: [
    'Center on the enemy caster. They must leave the area to cast.',
    'Center on the party. Enemy casters outside can\'t affect you (some spells).',
    'Cast on an object near the caster. Object moves, silence stays.',
  ],
  counters: ['Misty Step (no verbal component)', 'Counterspell (no verbal)', 'Just walk out of the area'],
  spellsWithoutVerbal: ['Counterspell (S only)', 'Misty Step (V only — DOES need verbal!)', 'Subtle Spell ignores both'],
  note: 'Misty Step actually DOES have a verbal component. Common misconception. It IS blocked by Silence.',
};

export const ANTI_CASTER_SPELLS = [
  { spell: 'Counterspell', level: 3, note: 'Counter any spell. THE anti-mage tool.' },
  { spell: 'Silence', level: 2, note: 'Shut down most casting in 20ft.' },
  { spell: 'Dispel Magic', level: 3, note: 'Remove active spell effects.' },
  { spell: 'Mage Slayer feat', level: 'Feat', note: 'OA when creature within 5ft casts. Advantage on saves from adjacent casters. Concentration save disadvantage.' },
  { spell: 'Antimagic Field', level: 8, note: 'Nuclear option. 10ft sphere of no magic.' },
  { spell: 'Globe of Invulnerability', level: 6, note: 'Block all spells 5th level and below.' },
];

export const MAGE_SLAYER_FEAT = {
  benefits: [
    'Reaction attack when adjacent creature casts a spell.',
    'Advantage on saves against spells cast by creatures within 5ft.',
    'When you damage a concentrating creature, they have disadvantage on the save.',
  ],
  best: 'Fighter, Barbarian, Rogue — anyone who gets in melee with casters.',
  rating: 'A (S in mage-heavy campaigns)',
};

export function counterspellCheck(casterAbilityMod, spellLevel, counterspellLevel) {
  if (counterspellLevel >= spellLevel) return 100; // automatic
  const dc = 10 + spellLevel;
  const needed = dc - casterAbilityMod;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function concentrationWithMageSlayer(conMod, proficient, profBonus, damage) {
  const dc = Math.max(10, Math.floor(damage / 2));
  const bonus = conMod + (proficient ? profBonus : 0);
  const needed = dc - bonus;
  // Disadvantage: both must succeed
  const singleFail = Math.min(0.95, Math.max(0.05, (needed) / 20));
  return Math.round((1 - singleFail * singleFail) * 100); // chance to fail with disadvantage
}
