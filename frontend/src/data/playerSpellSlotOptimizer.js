/**
 * playerSpellSlotOptimizer.js
 * Player Mode: Spell slot budgeting and when to upcast
 * Pure JS — no React dependencies.
 */

export const SLOT_BUDGETING = {
  shortDay: {
    label: 'Short Adventuring Day (1-2 encounters)',
    strategy: 'You can afford to go all-out. Use high-level slots freely.',
    suggestion: 'Open with your best concentration spell. Use remaining slots aggressively.',
  },
  mediumDay: {
    label: 'Medium Adventuring Day (3-4 encounters)',
    strategy: 'Balance conservation with effectiveness. Save at least 1-2 high slots.',
    suggestion: 'Use 1st-2nd level slots for early fights. Save 3rd+ for dangerous encounters.',
  },
  longDay: {
    label: 'Long Adventuring Day (5-6+ encounters)',
    strategy: 'Conserve heavily. Cantrips and low-level spells for easy fights.',
    suggestion: 'Only use high-level slots when the encounter is clearly dangerous. Rely on cantrips.',
  },
};

export const UPCAST_VALUE = [
  { spell: 'Cure Wounds', baseLevel: 1, upcastBenefit: '+1d8 per level', verdict: 'Mediocre. Healing Word is better action economy.', worth: 'C' },
  { spell: 'Healing Word', baseLevel: 1, upcastBenefit: '+1d4 per level', verdict: 'Not worth upcasting. The value is the bonus action, not the healing amount.', worth: 'D' },
  { spell: 'Scorching Ray', baseLevel: 2, upcastBenefit: '+1 ray per level', verdict: 'Good. Each ray can crit and applies hex/hunter\'s mark damage.', worth: 'A' },
  { spell: 'Spirit Guardians', baseLevel: 3, upcastBenefit: '+1d8 per level', verdict: 'Excellent. Already the best cleric spell, more damage is always good.', worth: 'S' },
  { spell: 'Fireball', baseLevel: 3, upcastBenefit: '+1d6 per level', verdict: 'Decent but there are better 4th+ level options.', worth: 'B' },
  { spell: 'Hold Person', baseLevel: 2, upcastBenefit: '+1 target per level', verdict: 'Excellent. Holding 2-3 humanoids is devastating.', worth: 'S' },
  { spell: 'Animate Dead', baseLevel: 3, upcastBenefit: '+2 undead per level', verdict: 'Great for necromancers. Action economy value compounds.', worth: 'A' },
  { spell: 'Counterspell', baseLevel: 3, upcastBenefit: 'Auto-counter higher level spells', verdict: 'Excellent. 5th slot counters a 5th level spell guaranteed.', worth: 'S' },
  { spell: 'Dispel Magic', baseLevel: 3, upcastBenefit: 'Auto-dispel higher level effects', verdict: 'Same as Counterspell. Certainty is worth the slot.', worth: 'A' },
  { spell: 'Summon Beast', baseLevel: 2, upcastBenefit: 'Summon scales with slot level', verdict: 'Great. Tasha\'s summons scale better than conjure spells.', worth: 'A' },
];

export const CANTRIP_SCALING = [
  { level: 1, dice: '1 die', note: 'Single die of damage.' },
  { level: 5, dice: '2 dice', note: 'First scaling at 5th level.' },
  { level: 11, dice: '3 dice', note: 'Second scaling at 11th level.' },
  { level: 17, dice: '4 dice', note: 'Final scaling at 17th level.' },
];

export const SLOT_TIPS = [
  'Cantrips are free — use them for easy fights instead of wasting slots.',
  'Concentration spells give the most value per slot (sustained effect over many rounds).',
  'Don\'t upcast healing in combat — the action economy of Healing Word matters more than the amount.',
  'Save your highest slot for the "oh crap" moment: Counterspell, Revivify, or a clutch Hold Person.',
  'Ritual spells (Detect Magic, Identify, Leomund\'s Tiny Hut) cost no slots. Always ritual cast when you have time.',
  'Short rest casters (Warlock, Arcane Recovery) can be more aggressive with slots.',
];

export function getUpcastInfo(spellName) {
  return UPCAST_VALUE.find(s => s.spell.toLowerCase() === (spellName || '').toLowerCase()) || null;
}

export function getCantripDice(characterLevel) {
  if (characterLevel >= 17) return 4;
  if (characterLevel >= 11) return 3;
  if (characterLevel >= 5) return 2;
  return 1;
}
