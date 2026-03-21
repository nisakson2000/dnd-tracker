/**
 * playerBossEncounterGuide.js
 * Player Mode: Boss fight strategy — legendary actions, lair actions, tactics
 * Pure JS — no React dependencies.
 */

export const BOSS_MECHANICS = {
  legendaryResistance: {
    what: 'Boss auto-succeeds a failed save. Usually 3/day.',
    strategy: 'Burn through with cheap spells first. Then use your best spell.',
    spells: ['Faerie Fire (L1)', 'Hold Person (L2)', 'Entangle (L1)', 'Web (L2)'],
    note: 'Don\'t waste Wall of Force or Banishment until LR is gone.',
  },
  legendaryActions: {
    what: 'Extra actions at the end of other creatures\' turns. Usually 3/round.',
    strategy: 'Can\'t prevent. Plan for extra attacks/movement between your turns.',
    note: 'Boss effectively gets 4+ turns per round. Respect the action economy.',
  },
  lairActions: {
    what: 'Environmental effects on initiative 20. Only in the boss\'s lair.',
    strategy: 'Lure the boss out of its lair if possible. Or prepare for extra hazards.',
    note: 'Initiative 20 = an extra "turn" for the dungeon itself.',
  },
};

export const BOSS_FIGHT_PHASES = [
  { phase: 'Round 1: Assess', actions: ['Knowledge check to identify the boss.', 'Burn 1-2 Legendary Resistances with cheap spells.', 'Cast control/buff spells (Bless, Faerie Fire).'], note: 'Don\'t use your best spell yet. Test the waters.' },
  { phase: 'Round 2-3: Control', actions: ['Once LR is down: cast your biggest control spell.', 'Focus fire with martials.', 'Maintain buffs and concentration.'], note: 'This is where you swing the fight. Big spells after LR is gone.' },
  { phase: 'Round 4+: Execute', actions: ['Nova damage. Smites, Action Surge, highest damage.', 'Keep the boss controlled.', 'Heal only if someone goes down.'], note: 'The boss should be weakened. Finish it.' },
];

export const BURN_LEGENDARY_RESISTANCE = {
  method: 'Force saves with cheap spells to waste LR. Then cast big spells.',
  cheapSpells: [
    { spell: 'Faerie Fire (L1)', save: 'DEX', note: 'Advantage on attacks if it sticks. Cheap to force LR use.' },
    { spell: 'Entangle (L1)', save: 'STR', note: 'Restrained. Cheap slot. Force LR.' },
    { spell: 'Hold Person (L2)', save: 'WIS', note: 'Paralyzed. Force LR or get auto-crits.' },
    { spell: 'Levitate (L2)', save: 'CON', note: 'Remove melee boss from combat. Force LR or win.' },
    { spell: 'Command (L1)', save: 'WIS', note: 'One word. Force LR on a L1 slot.' },
    { spell: 'Dissonant Whispers (L1)', save: 'WIS', note: 'Force LR or 3d6 + forced movement.' },
  ],
  afterLR: [
    { spell: 'Banishment (L4)', save: 'CHA', note: 'Remove boss. Fight adds. Then boss returns alone.' },
    { spell: 'Polymorph (L4)', save: 'WIS', note: 'Turn boss into a turtle. Fight adds.' },
    { spell: 'Hold Monster (L5)', save: 'WIS', note: 'Paralyzed = auto-crit melee. Devastating.' },
    { spell: 'Wall of Force (L5)', save: 'None', note: 'Trap the boss. Fight adds first.' },
    { spell: 'Forcecage (L7)', save: 'CHA to teleport out', note: 'No save to trap. Best boss containment.' },
  ],
};

export const BOSS_FIGHT_ROLES = {
  tank: 'Keep the boss\'s attention. High AC + HP. Stand in front of casters.',
  healer: 'Don\'t heal proactively. Healing Word when someone goes to 0.',
  controller: 'Burn LR then control. Wall spells to split boss from adds.',
  striker: 'Focus fire the boss. Save nova for after LR is gone.',
  support: 'Bless, Faerie Fire, Bardic Inspiration. Enhance the team.',
};

export const COMMON_BOSS_TYPES = [
  { type: 'Dragon', danger: 'Breath weapon, fly, fear aura, legendary actions.', strategy: 'Spread out for breath. Ground it. Absorb Elements. Fire resistance.' },
  { type: 'Lich', danger: 'Massive spell list. Legendary actions to cast. Phylactery.', strategy: 'Counterspell EVERYTHING. Antimagic Field. Find and destroy phylactery.' },
  { type: 'Beholder', danger: 'Antimagic cone. Eye rays (random). Legendary actions.', strategy: 'Flank around cone. Martials in cone (magic doesn\'t work). Casters outside.' },
  { type: 'Mind Flayer Elder Brain', danger: 'Psychic powers. Mind blast stun. Tentacles.', strategy: 'High INT saves. Spread out. Kill thralls first.' },
  { type: 'Vampire', danger: 'Charm, bite (HP drain), regeneration, legendary actions.', strategy: 'Sunlight stops regen. Radiant damage. Running water. Stakes.' },
  { type: 'Tarrasque', danger: 'Massive HP. Legendary resistance. Reflective Carapace.', strategy: 'Fly + non-reflected damage (force, psychic). It can\'t fly.' },
];

export const BOSS_FIGHT_TIPS = [
  'Burn Legendary Resistance with cheap spells FIRST.',
  'Don\'t use your best spell until LR is gone.',
  'Focus fire the boss. Don\'t spread damage.',
  'Healing Word to pick up downed allies. Don\'t waste actions on Cure Wounds.',
  'Bless: +1d4 to attacks AND saves. Best concentration for boss fights.',
  'Wall of Force or Forcecage: trap the boss while you deal with adds.',
  'Spread out vs breath weapons and AoE legendary actions.',
  'Dragons: Absorb Elements halves breath damage. Essential.',
  'Counterspell enemy caster bosses. Every spell they lose is huge.',
  'Rest before the boss fight if possible. Full resources = best chance.',
];
