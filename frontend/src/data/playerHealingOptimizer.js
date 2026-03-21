/**
 * playerHealingOptimizer.js
 * Player Mode: Healing spell comparison and optimization guide
 * Pure JS — no React dependencies.
 */

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, action: 'Bonus Action', range: '60ft', healing: '1d4+MOD', avgPerSlot: 4.5, note: 'Best action economy — heals AND lets you attack/cast cantrip. Use to pick up downed allies.', tier: 'S' },
  { spell: 'Cure Wounds', level: 1, action: 'Action', range: 'Touch', healing: '1d8+MOD', avgPerSlot: 6.5, note: 'More healing but costs your action. Use out of combat or when bonus action is needed.', tier: 'A' },
  { spell: 'Mass Healing Word', level: 3, action: 'Bonus Action', range: '60ft', healing: '1d4+MOD to 6 creatures', avgPerSlot: 27, note: 'Pick up multiple downed allies at once. Game-changing when party is getting wiped.', tier: 'S' },
  { spell: 'Mass Cure Wounds', level: 5, action: 'Action', range: '60ft', healing: '3d8+MOD to 6 creatures', avgPerSlot: 91.5, note: 'Massive group heal but costs 5th level slot. Big combat turning spell.', tier: 'A' },
  { spell: 'Heal', level: 6, action: 'Action', range: '60ft', healing: '70 HP', avgPerSlot: 70, note: 'Flat 70 HP, no roll. Also ends blindness, deafness, and diseases. Reliable.', tier: 'S' },
  { spell: 'Prayer of Healing', level: 2, action: '10 min', range: '30ft', healing: '2d8+MOD to 6 creatures', avgPerSlot: 57, note: 'Out-of-combat only (10 min cast). Perfect for post-combat top-off.', tier: 'A' },
  { spell: 'Goodberry', level: 1, action: 'Action', range: 'Touch', healing: '10 HP (10 berries)', avgPerSlot: 10, note: '10 berries, 1 HP each. Lasts 24 hours. Feed to unconscious allies. Counts as food.', tier: 'A' },
  { spell: 'Aura of Vitality', level: 3, action: 'Action', range: '30ft aura', healing: '2d6/round for 1 min', avgPerSlot: 70, note: 'Concentration. 2d6 as bonus action each round for 10 rounds. Best sustained healing.', tier: 'A' },
  { spell: 'Life Transference', level: 3, action: 'Action', range: '30ft', healing: '4d8 (you take 2d8 necrotic)', avgPerSlot: 18, note: 'Take damage to heal double. Risky but efficient if you have HP to spare.', tier: 'B' },
  { spell: 'Revivify', level: 3, action: 'Action', range: 'Touch', healing: '1 HP (from death)', avgPerSlot: null, note: 'Brings back the dead (within 1 minute). 300gp diamond consumed. ALWAYS prepare this.', tier: 'S' },
];

export const HEALING_STRATEGY = [
  'Don\'t pre-heal. In 5e, it\'s better to let allies drop to 0 HP then pick them up with Healing Word.',
  'Yo-yo healing: Healing Word to pick up a downed ally (bonus action), then use your action to attack/cast.',
  'A creature at 1 HP is just as effective as one at full HP — action economy matters more than HP.',
  'Prayer of Healing after combat, Healing Word during combat. Don\'t waste combat turns on big heals.',
  'Goodberry: cheap out-of-combat healing, can be fed to unconscious allies, and counts as food for the day.',
  'Save your high-level healing slots for emergencies. Low-level Healing Word is usually enough.',
  'Heal (6th level) is for emergencies — 70 flat HP when someone is critically low in a tough fight.',
  'Life Cleric + Goodberry/Healing Word = bonus healing from Disciple of Life feature.',
];

export const HEALER_FEAT = {
  description: 'With a healer\'s kit, stabilize AND restore 1d6+4+creature\'s max hit dice of HP. Once per rest per creature.',
  note: 'Healer\'s Kit costs 5 gp (10 uses). No spell slot needed. Great for non-caster healers.',
  synergy: 'Thief Rogue can use as bonus action with Fast Hands!',
};

export function compareHealingEfficiency(spellA, spellB) {
  const a = HEALING_SPELLS_RANKED.find(s => s.spell.toLowerCase() === (spellA || '').toLowerCase());
  const b = HEALING_SPELLS_RANKED.find(s => s.spell.toLowerCase() === (spellB || '').toLowerCase());
  if (!a || !b) return null;
  return { better: a.avgPerSlot >= b.avgPerSlot ? a.spell : b.spell, aEfficiency: a.avgPerSlot, bEfficiency: b.avgPerSlot };
}

export function getBestHealingForSituation(situation) {
  const s = (situation || '').toLowerCase();
  if (s.includes('downed') || s.includes('unconscious')) return 'Healing Word (bonus action, 60ft range)';
  if (s.includes('multiple') || s.includes('party')) return 'Mass Healing Word or Prayer of Healing (out of combat)';
  if (s.includes('dead') || s.includes('died')) return 'Revivify (within 1 minute, 300gp diamond)';
  if (s.includes('emergency') || s.includes('critical')) return 'Heal (70 flat HP, no roll)';
  return 'Healing Word (best general-purpose healing)';
}
