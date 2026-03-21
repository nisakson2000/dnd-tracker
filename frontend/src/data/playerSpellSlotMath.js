/**
 * playerSpellSlotMath.js
 * Player Mode: Spell slot usage math and daily budget planning
 * Pure JS — no React dependencies.
 */

export const ADVENTURING_DAY_BUDGET = {
  standardDay: '6-8 encounters with 2 short rests',
  slotBudget: [
    { level: 1, totalSlots: 2, perEncounter: '1 leveled spell per 2 encounters', cantripsPerEncounter: 'Rely on cantrips 70% of the time' },
    { level: 3, totalSlots: 6, perEncounter: '1 per encounter with reserves', cantripsPerEncounter: 'Mix cantrips and leveled spells' },
    { level: 5, totalSlots: 9, perEncounter: '1-2 per encounter', cantripsPerEncounter: 'Cantrips for cleanup, slots for impact' },
    { level: 9, totalSlots: 14, perEncounter: '2 per encounter comfortably', cantripsPerEncounter: 'Cantrips for minor threats only' },
    { level: 13, totalSlots: 17, perEncounter: '2-3 per encounter', cantripsPerEncounter: 'High-level slots for bosses/emergencies' },
    { level: 17, totalSlots: 20, perEncounter: '3 per encounter', cantripsPerEncounter: 'Still conserve 6th+ slots' },
  ],
  rule_of_thumb: 'Save your highest 2 spell levels for bosses/emergencies. Use mid-level slots for regular encounters.',
};

export const UPCASTING_EFFICIENCY = [
  { spell: 'Fireball', base: '8d6 (28 avg)', upcast: '+1d6 per level', efficiency: 'Low — damage increase is small relative to slot cost', verdict: 'Usually not worth upcasting' },
  { spell: 'Cure Wounds', base: '1d8+mod', upcast: '+1d8 per level', efficiency: 'Medium — decent scaling but Healing Word is often better', verdict: 'Upcast in emergencies only' },
  { spell: 'Spirit Guardians', base: '3d8', upcast: '+1d8 per level', efficiency: 'High — damage per round increases significantly', verdict: 'Always worth upcasting if concentration protected' },
  { spell: 'Hold Person', base: '1 target', upcast: '+1 target per level', efficiency: 'Very High — each extra target is a potential auto-crit setup', verdict: 'Excellent upcast target' },
  { spell: 'Shield', base: '+5 AC', upcast: 'Does not scale', efficiency: 'N/A', verdict: 'Always cast at 1st level' },
  { spell: 'Counterspell', base: 'Auto-counter 3rd-', upcast: 'Auto-counter up to slot level', efficiency: 'Very High — guaranteed counter vs using higher slot', verdict: 'Match the enemy spell level' },
  { spell: 'Magic Missile', base: '3 missiles', upcast: '+1 missile per level', efficiency: 'Medium — reliable damage scaling', verdict: 'Good upcast for concentration breaking' },
  { spell: 'Animate Dead', base: '1 undead', upcast: '+2 undead per level', efficiency: 'High — army grows quadratically', verdict: 'Excellent upcast for necromancers' },
];

export const SLOT_CONSERVATION = [
  { tip: 'Lead with cantrips against weak enemies. Save slots for threats.', importance: 'Critical' },
  { tip: 'Use ritual casting whenever possible. Detect Magic, Identify, Alarm = free.', importance: 'High' },
  { tip: 'Concentration spells are slot-efficient. One slot for many rounds of effect.', importance: 'Critical' },
  { tip: 'Short rest classes (Warlock, Monk, Fighter) should spend freely. They recover.', importance: 'High' },
  { tip: 'Before a long rest, dump remaining slots. Don\'t waste them.', importance: 'Medium' },
  { tip: 'Goodberry before long rest: cast with remaining 1st-level slots for 10 berries each.', importance: 'Medium' },
  { tip: 'Sorcerers: convert unused slots to sorcery points before long rest (they persist).', importance: 'High' },
  { tip: 'Warlocks: you have 2 slots (3-4 later). Every slot matters. Make them count.', importance: 'Critical' },
];

export function calculateDailySlots(casterLevel, fullCaster) {
  if (!fullCaster) casterLevel = Math.floor(casterLevel / 2);
  const table = [
    [2], [3], [4,2], [4,3], [4,3,2], [4,3,3], [4,3,3,1], [4,3,3,2],
    [4,3,3,3,1], [4,3,3,3,2], [4,3,3,3,2,1], [4,3,3,3,2,1],
    [4,3,3,3,2,1,1], [4,3,3,3,2,1,1], [4,3,3,3,2,1,1,1],
    [4,3,3,3,2,1,1,1], [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1],
    [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1],
  ];
  const slots = table[Math.min(casterLevel, 20) - 1] || [];
  return {
    slots,
    total: slots.reduce((a, b) => a + b, 0),
    perEncounter: Math.floor(slots.reduce((a, b) => a + b, 0) / 6),
  };
}

export function isWorthUpcasting(spellName) {
  const entry = UPCASTING_EFFICIENCY.find(s =>
    s.spell.toLowerCase().includes((spellName || '').toLowerCase())
  );
  return entry ? { worth: entry.verdict, efficiency: entry.efficiency } : null;
}
