/**
 * playerSpellSlotConservationGuide.js
 * Player Mode: Spell slot management — don't nova too early
 * Pure JS — no React dependencies.
 */

export const SPELL_SLOT_PHILOSOPHY = {
  problem: 'Casters who burn all slots in fight 1 are useless in fights 2-6.',
  solution: 'Budget your slots across the adventuring day. Save high slots for critical moments.',
  goldRule: 'If a cantrip or low-level option solves the problem, use it. Save slots for when they matter.',
};

export const SLOT_BUDGET_BY_ENCOUNTER = [
  { encounters: '1-2 per day', budget: 'Nova freely. Most slots per fight. This is how most tables play.', note: 'LR-dependent classes dominate.' },
  { encounters: '3-4 per day', budget: 'Moderate usage. 1-2 high slots per fight. Save some for later.', note: 'Balanced play. Short rest classes start to shine.' },
  { encounters: '6-8 per day', budget: 'Strict conservation. Cantrips > low slots > high slots. Only big spells for hard fights.', note: 'DMG-recommended. SR classes dominate. Very rare in practice.' },
];

export const SLOT_MANAGEMENT_TIPS = [
  { tip: 'Cantrips are free', detail: 'Eldritch Blast, Fire Bolt, Sacred Flame deal good damage at no cost. Use them as your default.', rating: 'S' },
  { tip: 'Ritual cast everything possible', detail: 'Detect Magic, Identify, Find Familiar, Tiny Hut — never burn a slot on a ritual spell.', rating: 'S' },
  { tip: 'Concentration spells are efficient', detail: 'One slot for 10 rounds of effect. Spirit Guardians, Bless, Hex — cast once, benefit for entire combat.', rating: 'S' },
  { tip: 'Don\'t upcast when unnecessary', detail: 'L1 Shield and L3 Shield do the same thing. Don\'t waste a high slot on a spell that doesn\'t scale.', rating: 'A' },
  { tip: 'Save highest slots for emergencies', detail: 'Keep at least one high slot for Counterspell, emergency healing, or a clutch save spell.', rating: 'S' },
  { tip: 'Track encounters', detail: 'Ask your DM: "How many fights today?" Adjust conservation based on expected encounters.', rating: 'A' },
  { tip: 'Short rest = Warlock reset', detail: 'Warlocks: push for short rests. Each SR = full slot refresh. Effectively unlimited spells with rests.', rating: 'S (Warlock)' },
];

export const WHEN_TO_NOVA = [
  'Boss fights: the one encounter that matters. Dump everything.',
  'Life-or-death situations: party wipe imminent. No point saving slots if you\'re dead.',
  'Last encounter of the day: LR coming. Spend everything remaining.',
  'When one big spell ends the fight: Hypnotic Pattern on a group, Banishment on the boss.',
  'Surprise round: maximum burst before enemies act.',
];

export const WHEN_TO_CONSERVE = [
  'Unknown number of encounters remaining.',
  'Early in the adventuring day with no short rest in sight.',
  'Easy encounters: don\'t burn L3 slots on 4 goblins. Cantrips handle them.',
  'You\'re the party\'s only healer: save slots for Healing Word.',
  'Enemy has Counterspell: they might waste your spell AND your slot.',
];

export const SPELL_RECOVERY = [
  { feature: 'Arcane Recovery (Wizard)', timing: 'Once per day, on short rest', slots: 'Recover slots = half wizard level (rounded up). No slot above L5.', note: 'Essential. Always use on SR.' },
  { feature: 'Natural Recovery (Land Druid)', timing: 'Once per day, on short rest', slots: 'Same as Arcane Recovery. Up to half druid level.', note: 'Land Druid exclusive.' },
  { feature: 'Harness Divine Power (Cleric/Paladin)', timing: 'Use Channel Divinity', slots: 'Recover one slot = half PB (rounded up).', note: 'Tasha\'s optional. Burns CD for a slot.' },
  { feature: 'Font of Magic (Sorcerer)', timing: 'BA', slots: 'Convert Sorcery Points to slots or vice versa.', note: 'Flexible but expensive. 2 SP = L1 slot, 3 SP = L2, etc.' },
  { feature: 'Pact Magic (Warlock)', timing: 'Short rest', slots: 'All Warlock slots recover on SR.', note: 'Only 2-4 slots but always max level. SR recovery is incredible.' },
];

export function slotsPerDay(classLevel, hasRecovery) {
  const baseSlots = classLevel >= 9 ? 22 : classLevel >= 5 ? 10 : classLevel >= 3 ? 6 : 3;
  const recoverable = hasRecovery ? Math.ceil(classLevel / 2) : 0;
  return { base: baseSlots, withRecovery: baseSlots + recoverable, note: `~${baseSlots} base slots${recoverable ? ` + ${recoverable} recoverable` : ''}` };
}
