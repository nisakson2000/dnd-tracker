/**
 * playerEncounterResourceBudgetGuide.js
 * Player Mode: Managing spell slots, abilities, and HP across an adventuring day
 * Pure JS — no React dependencies.
 */

export const ADVENTURING_DAY_BASELINE = {
  encounters: '6-8 medium/hard encounters per long rest (DMG guidelines).',
  shortRests: '2 short rests per long rest (typical).',
  note: 'Most tables do 2-4 encounters. Adjust spending accordingly.',
};

export const RESOURCE_TIERS = [
  {
    tier: 'Per Long Rest',
    resources: ['Spell slots (full casters)', 'Hit Dice (regain half)', 'Channel Divinity', 'Wild Shape', 'Rage', 'Arcane Recovery', 'Lay on Hands pool', 'Sorcery Points'],
    strategy: 'Ration across all encounters. Don\'t nova early.',
  },
  {
    tier: 'Per Short Rest',
    resources: ['Warlock Pact Magic', 'Fighter Action Surge', 'Fighter Second Wind', 'Monk Ki Points', 'Bard Bardic Inspiration (L5+)', 'Druid Wild Shape', 'Cleric Channel Divinity', 'Hit Dice healing'],
    strategy: 'Use freely. Recover on short rest. Push for short rests.',
  },
  {
    tier: 'At-Will / Cantrip',
    resources: ['Cantrips', 'Weapon attacks', 'Racial abilities (some)', 'Invocations (some)', 'Fighting Style benefits'],
    strategy: 'No cost. Use every turn. Cantrips = infinite damage.',
  },
];

export const SPELL_SLOT_BUDGETING = [
  { slots: 'Highest level slots', rule: 'Save 1-2 for boss fight or emergency.', note: 'Don\'t blow all L5 slots on trash mobs.' },
  { slots: 'Mid-level slots', rule: 'Use for key encounters. 1 per fight.', note: 'Hypnotic Pattern, Fireball, Spirit Guardians.' },
  { slots: 'Low-level slots (L1-2)', rule: 'Use for Shield, Healing Word, utility.', note: 'Cheap and effective. Don\'t hoard these.' },
  { slots: 'Cantrips', rule: 'Default damage. Use when slots aren\'t needed.', note: 'Toll the Dead, Fire Bolt, EB = free damage every turn.' },
];

export const CLASS_RESOURCE_PRIORITY = [
  { class: 'Wizard', priorities: ['Save highest slots for encounters 4+', 'Arcane Recovery on first short rest', 'Shield only when hit would hurt', 'Cantrips for weak enemies'] },
  { class: 'Cleric', priorities: ['Spirit Guardians for hard fights only', 'Healing Word for 0 HP allies only', 'Spiritual Weapon lasts 10 rounds — great value', 'Toll the Dead for cantrip damage'] },
  { class: 'Fighter', priorities: ['Action Surge for boss fights', 'Second Wind for free HP', 'Short rest dependent — push for rests', 'Superiority dice recover on SR'] },
  { class: 'Warlock', priorities: ['2-3 slots recover on SR. Use freely.', 'Short rest = full refuel. Push for rests.', 'Eldritch Blast is your at-will damage.', 'Save slots for Counterspell/Banishment.'] },
  { class: 'Monk', priorities: ['Ki recovers on SR. Use Flurry freely.', 'Save Stunning Strike for key targets.', 'Patient Defense when focused by multiple.', 'Martial Arts BA attack is free (no Ki).'] },
  { class: 'Barbarian', priorities: ['Rage uses per LR. Save for hard fights.', 'Reckless Attack is free — use it.', 'Hit Dice on SR for healing.', 'Low resource class — consistent all day.'] },
  { class: 'Paladin', priorities: ['Save highest smite slots for crits.', 'Lay on Hands: 1 HP per use for revives.', 'Aura passive — no resource cost.', 'Smite conservatively early in day.'] },
  { class: 'Rogue', priorities: ['No resources to manage. Always effective.', 'Cunning Action every turn. Free.', 'Sneak Attack is free — maximize it.', 'Best class for long adventuring days.'] },
];

export const NOVA_VS_SUSTAIN = {
  nova: {
    definition: 'Spend everything for maximum damage in 1-2 rounds.',
    when: 'Boss fights. Final encounter. One deadly fight per day.',
    classes: ['Paladin (smite everything)', 'Fighter (Action Surge + all attacks)', 'Sorcerer (Quickened + twinned)'],
  },
  sustain: {
    definition: 'Spread resources across 4-8 encounters.',
    when: 'Dungeon crawls. Multiple fights per rest. Unknown encounters ahead.',
    classes: ['Warlock (SR recovery)', 'Fighter (SR recovery)', 'Rogue (no resources)', 'Monk (SR recovery)'],
  },
};

export const RESOURCE_TIPS = [
  'Ask DM: "How many encounters today?" Budget accordingly.',
  'Don\'t use highest slots on trash mobs. Cantrips handle those.',
  'Healing Word > Cure Wounds. 1 HP to get ally up. Save higher slots.',
  'Short rest dependent classes (Fighter, Warlock, Monk): push for short rests.',
  'Paladin: smite on crits = double smite dice. Save slots for crits.',
  'Wizard Arcane Recovery: use on first short rest. Free slots.',
  'Rogue and at-will classes shine in long adventuring days.',
  'Save at least 1 high-level slot for emergencies (Revivify, Counterspell).',
  'Cantrips are infinite. If you don\'t need a slot, use a cantrip.',
  'Track party resources. If everyone is tapped, push for long rest.',
];
