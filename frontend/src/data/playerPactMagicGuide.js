/**
 * playerPactMagicGuide.js
 * Player Mode: Warlock Pact Magic system, slot management, and optimization
 * Pure JS — no React dependencies.
 */

export const PACT_MAGIC_RULES = {
  slots: 'Warlocks get very few spell slots (1-4) but they\'re all the same level and refresh on SHORT rest.',
  progression: [
    { level: 1, slots: 1, slotLevel: 1 },
    { level: 2, slots: 2, slotLevel: 1 },
    { level: 3, slots: 2, slotLevel: 2 },
    { level: 5, slots: 2, slotLevel: 3 },
    { level: 7, slots: 2, slotLevel: 4 },
    { level: 9, slots: 2, slotLevel: 5 },
    { level: 11, slots: 3, slotLevel: 5 },
    { level: 17, slots: 4, slotLevel: 5 },
  ],
  mysticArcanum: 'At levels 11, 13, 15, and 17: learn one spell of 6th, 7th, 8th, and 9th level respectively. Cast once per long rest. Not Pact Magic slots.',
  multiclass: 'Pact Magic slots are SEPARATE from multiclass spell slots. But you CAN use them for features like Divine Smite.',
  keyDifference: 'All Pact Magic slots are always cast at maximum level. A level 5 Warlock always casts at 3rd level.',
};

export const SLOT_MANAGEMENT = [
  { tip: 'Short rest whenever possible', detail: 'Your slots come back on short rest. Push for 2-3 short rests per adventuring day. This is your lifeblood.' },
  { tip: 'Eldritch Blast is your bread and butter', detail: 'EB + Agonizing Blast is free, scales with level, and does competitive damage. Save slots for impactful spells.' },
  { tip: 'Don\'t waste slots on damage', detail: 'EB handles damage. Use slots for control (Hypnotic Pattern), utility (Counterspell), or concentration spells (Hex, Darkness).' },
  { tip: 'Every spell auto-upcasts', detail: 'Your slots are always max level. Spells that scale with slot level are premium: Hold Person (more targets), Shatter (more damage).' },
  { tip: 'Invocations replace spell slots', detail: 'At-will invocations (Disguise Self, Detect Magic, Silent Image) save your slots for combat.' },
  { tip: 'Mystic Arcanum is once per day', detail: 'Don\'t waste 6th-9th level spells on minor encounters. Save them for boss fights or critical moments.' },
];

export const BEST_WARLOCK_SPELLS = [
  { spell: 'Hex', level: 1, rating: 'S', note: 'Extra 1d6 per hit. Lasts 8 hours at 3rd level slot. Concentration.' },
  { spell: 'Armor of Agathys', level: 1, rating: 'A', note: 'Scales amazingly with upcasting. 25 temp HP + 25 cold damage at 5th level.' },
  { spell: 'Darkness', level: 2, rating: 'S (with Devil\'s Sight)', note: 'Advantage for you, disadvantage for enemies. Blocks enemy spellcasting requiring sight.' },
  { spell: 'Misty Step', level: 2, rating: 'A', note: 'Bonus action teleport. Escape or reposition. Always useful.' },
  { spell: 'Counterspell', level: 3, rating: 'S', note: 'Shut down enemy spellcasters. Warlock auto-casts at max level.' },
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S', note: 'Best AoE CC in the game. Removes multiple enemies from combat.' },
  { spell: 'Summon Greater Demon', level: 4, rating: 'A', note: 'Powerful summon. Scales well. Risky if you lose concentration.' },
  { spell: 'Synaptic Static', level: 5, rating: 'S', note: '8d6 psychic + INT save debuff. Fireball but better at this level.' },
  { spell: 'Banishment', level: 4, rating: 'A', note: 'Remove a threat entirely. At 5th level, banish TWO creatures.' },
];

export const INVOCATION_TIER_LIST = [
  { invocation: 'Agonizing Blast', tier: 'S', prereq: 'Eldritch Blast', effect: 'Add CHA to EB damage. Mandatory.', note: 'Without this, EB does 1d10. With it, 1d10+5. Non-negotiable.' },
  { invocation: 'Repelling Blast', tier: 'S', prereq: 'Eldritch Blast', effect: 'Push target 10ft per beam. No save.', note: 'Forced movement into Spike Growth, off cliffs, away from allies.' },
  { invocation: 'Devil\'s Sight', tier: 'S', prereq: 'None', effect: 'See in magical darkness 120ft.', note: 'Darkness + Devil\'s Sight combo. Best defensive strategy in the game.' },
  { invocation: 'Book of Ancient Secrets', tier: 'S', prereq: 'Pact of the Tome', effect: 'Ritual cast any class\'s ritual spells.', note: 'Best ritual caster in the game. Learn every ritual you find.' },
  { invocation: 'Mask of Many Faces', tier: 'A', prereq: 'None', effect: 'At-will Disguise Self.', note: 'Unlimited disguises. Social encounters become trivial.' },
  { invocation: 'Thirsting Blade', tier: 'A', prereq: 'Pact of the Blade, 5th', effect: 'Extra Attack with pact weapon.', note: 'Mandatory for Blade Pact. Without it, you attack once.' },
  { invocation: 'Eldritch Mind', tier: 'A', prereq: 'None', effect: 'Advantage on concentration saves.', note: 'War Caster lite. Important for Hex maintenance.' },
  { invocation: 'Grasp of Hadar', tier: 'B', prereq: 'Eldritch Blast', effect: 'Pull target 10ft toward you once per turn.', note: 'Pull into Spike Growth or melee range. Situational but powerful.' },
];

export const PACT_BOONS = [
  { boon: 'Pact of the Chain', playstyle: 'Utility/Support', familiar: 'Improved familiar (Imp, Pseudodragon, Sprite, Quasit)', bestFor: 'Scouting, Help action, spell delivery. Imp is invisible and has hands.' },
  { boon: 'Pact of the Blade', playstyle: 'Melee combat', weapon: 'Summon any melee weapon. Use CHA for attacks (Hexblade).', bestFor: 'Hexblade melee builds. Requires Thirsting Blade + other invocations.' },
  { boon: 'Pact of the Tome', playstyle: 'Full caster', cantrips: '3 cantrips from any class list', bestFor: 'Book of Ancient Secrets = best ritual caster. Guidance, Shillelagh, etc.' },
  { boon: 'Pact of the Talisman', playstyle: 'Support', talisman: '+1d4 to failed ability checks', bestFor: 'Weakest option. Minor skill boost. Can be given to allies.' },
];

export function getSpellSlots(warlockLevel) {
  const entry = [...PACT_MAGIC_RULES.progression].reverse().find(p => warlockLevel >= p.level);
  return entry || { slots: 0, slotLevel: 0 };
}

export function getInvocationsForBuild(pactBoon, level) {
  return INVOCATION_TIER_LIST.filter(inv => {
    if (inv.prereq === 'Pact of the Tome' && pactBoon !== 'Tome') return false;
    if (inv.prereq === 'Pact of the Blade, 5th' && (pactBoon !== 'Blade' || level < 5)) return false;
    return true;
  });
}
