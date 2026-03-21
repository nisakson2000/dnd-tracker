/**
 * playerBossFightStrategyGuide.js
 * Player Mode: Boss fight strategy — preparation, execution, and common patterns
 * Pure JS — no React dependencies.
 */

export const BOSS_PREPARATION = [
  { step: 'Gather intelligence', detail: 'Knowledge checks, NPC rumors, scouting. Know the boss\'s type, abilities, resistances.', priority: 'S+' },
  { step: 'Buff before entering', detail: 'Long-duration buffs: Aid (8hr), Death Ward (8hr), Heroes\' Feast (24hr), Mage Armor (8hr).', priority: 'S' },
  { step: 'Choose terrain', detail: 'If possible, fight on YOUR terms. Chokepoints, open areas for ranged, escape routes.', priority: 'A+' },
  { step: 'Assign roles', detail: 'Tank engages, DPS focuses fire, support buffs/heals, controller debuffs.', priority: 'S' },
  { step: 'Plan for Legendary Resistance', detail: 'Most bosses have 3 LR. Burn them with cheap save-or-suck before the big spell.', priority: 'S+' },
  { step: 'Identify escape plan', detail: 'If it goes wrong, how do you leave? Dimension Door, Teleport, Fog Cloud + run.', priority: 'A' },
];

export const LEGENDARY_RESISTANCE_STRATEGY = {
  howItWorks: 'Boss chooses to succeed on a save they failed. Usually 3/day.',
  burnStrategy: [
    'Use cheap spells first: L1-2 save-or-suck to force LR burns.',
    'Multiple casters target different saves each round.',
    'Cantrips with save effects (Mind Sliver -1d4, Toll the Dead) force decisions.',
    'Silvery Barbs: force reroll on save. If they use LR, Silvery Barbs is "wasted" but LR is burned.',
    'After 3 LR burned, use your big spells: Banishment, Hold Monster, Polymorph.',
  ],
  cheapBurners: [
    { spell: 'Command (L1)', note: 'Grovel is great. If they LR, you only lost a L1 slot.' },
    { spell: 'Faerie Fire (L1)', note: 'If they fail, advantage for party. If LR, cheap burn.' },
    { spell: 'Blindness/Deafness (L2)', note: 'No concentration. If they LR, no big loss.' },
    { spell: 'Web (L2)', note: 'Restrained + difficult terrain. Forces LR or gets controlled.' },
    { spell: 'Slow (L3)', note: 'Targets multiple creatures. Brutal effect if it sticks.' },
  ],
};

export const BOSS_FIGHT_TACTICS = [
  { tactic: 'Focus the boss', detail: 'Kill the boss first. Minions die or flee when the boss falls. Exceptions: lair actions that spawn more.', rating: 'S' },
  { tactic: 'Burn Legendary Actions', detail: 'LAs reset at start of boss\'s turn. They WILL use them. Plan reactions accordingly.', rating: 'A+' },
  { tactic: 'Spread out', detail: 'Bosses often have AoE (breath weapons, spells). 30ft+ apart to avoid all getting hit.', rating: 'S' },
  { tactic: 'Protect concentration', detail: 'Your caster concentrating on Haste/Hold Monster is priority. War Caster, position behind tank.', rating: 'S' },
  { tactic: 'Handle lair actions', detail: 'Some bosses get lair actions on initiative 20. Know what they do and prepare.', rating: 'A+' },
  { tactic: 'Counterspell the boss', detail: 'If the boss is a caster, Counterspell their biggest spells. Position within 60ft.', rating: 'S+' },
  { tactic: 'Action economy advantage', detail: '4 PCs vs 1 boss = 4:1 action ratio. Bosses compensate with LAs. Summons/minions shift this.', rating: 'A+' },
  { tactic: 'Nova round 1', detail: 'Front-load damage. Action Surge, Smites, highest slots. A dead boss can\'t use its legendary abilities.', rating: 'S' },
];

export const COMMON_BOSS_PATTERNS = [
  { type: 'Dragon', pattern: 'Breath weapon (recharge 5-6), fly out of melee, Frightful Presence, lair actions.', counter: 'Spread out vs breath. Ground them (Earthbind, Net). Fear immunity (Berserker, Devotion Paladin).' },
  { type: 'Lich/Archmage', pattern: 'Counterspell, Shield, Legendary Actions to cast more. Globe of Invulnerability.', counter: 'Multiple Counterspellers. Melee to force concentration. Antimagic Field (desperate).' },
  { type: 'Beholder', pattern: 'Antimagic Cone (frontal), Eye Rays (random). Lair actions.', counter: 'Flank to avoid antimagic cone. Martial-heavy party. Ready actions outside cone.' },
  { type: 'Demon Lord/Devil', pattern: 'Magic resistance, fear aura, teleportation, summoning.', counter: 'Silvered/magical weapons. Fear immunity. Banishment (native plane kills them).' },
  { type: 'Vampire', pattern: 'Charm, regeneration, legendary actions (move + bite), wall/ceiling crawling.', counter: 'Radiant damage prevents regen. Sunlight = disadvantage + no regen. Running water, garlic, stakes.' },
  { type: 'Tarrasque', pattern: '676 HP, reflective carapace (ranged attacks reflected), frightful presence.', counter: 'Melee focus. Fly + magic attacks (avoids carapace). Sacred Flame (save, not attack roll). It can\'t fly.' },
];

export const BOSS_FIGHT_MISTAKES = [
  'Don\'t blow your best spell first. Use cheap spells to burn LR, THEN use Hold Monster.',
  'Don\'t cluster together. One breath weapon or Fireball shouldn\'t hit everyone.',
  'Don\'t ignore minions if they\'re buffing/healing the boss. Kill enablers first.',
  'Don\'t forget boss Legendary Actions happen BETWEEN your turns. Plan for them.',
  'Don\'t let the boss control the battlefield. Move to favorable terrain if possible.',
  'Don\'t panic when things go wrong. Stabilize with healing, regroup, adapt.',
  'Don\'t melee a dragon without fire resistance. Breath weapon in melee = bad day.',
];
