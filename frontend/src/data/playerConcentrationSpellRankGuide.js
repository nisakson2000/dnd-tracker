/**
 * playerConcentrationSpellRankGuide.js
 * Player Mode: Best concentration spells by level — what's worth concentrating on
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_BY_LEVEL = [
  {
    slotLevel: 1,
    topPicks: [
      { spell: 'Bless', rating: 'S+', effect: '+1d4 attacks + saves to 3 allies.', classes: ['Cleric', 'Paladin'] },
      { spell: 'Faerie Fire', rating: 'S', effect: 'AoE advantage on attacks. Reveals invisible.', classes: ['Bard', 'Druid'] },
      { spell: 'Hex', rating: 'A', effect: '+1d6 per hit. Disadvantage on one ability.', classes: ['Warlock'] },
      { spell: 'Shield of Faith', rating: 'A', effect: '+2 AC to one target.', classes: ['Cleric', 'Paladin'] },
      { spell: 'Entangle', rating: 'A+', effect: 'Restrained in 20ft square.', classes: ['Druid'] },
    ],
  },
  {
    slotLevel: 2,
    topPicks: [
      { spell: 'Web', rating: 'S+', effect: 'Restrained + difficult terrain.', classes: ['Wizard', 'Sorcerer'] },
      { spell: 'Hold Person', rating: 'S', effect: 'Paralyzed. Auto-crit melee.', classes: ['Many'] },
      { spell: 'Spike Growth', rating: 'S', effect: '2d4 per 5ft. Forced movement combo.', classes: ['Druid', 'Ranger'] },
      { spell: 'Moonbeam', rating: 'A+', effect: 'Movable radiant damage. Forces shapechange.', classes: ['Druid'] },
      { spell: 'Summon Beast', rating: 'A', effect: 'Reliable summon. Pack tactics (Land).', classes: ['Druid', 'Ranger'] },
    ],
  },
  {
    slotLevel: 3,
    topPicks: [
      { spell: 'Hypnotic Pattern', rating: 'S+', effect: 'Incapacitated 30ft cube. No repeat saves.', classes: ['Wizard', 'Sorcerer', 'Bard', 'Warlock'] },
      { spell: 'Spirit Guardians', rating: 'S+', effect: '3d8/turn + difficult terrain around you.', classes: ['Cleric'] },
      { spell: 'Haste', rating: 'S+', effect: 'Double speed, +2 AC, extra action.', classes: ['Wizard', 'Sorcerer'] },
      { spell: 'Slow', rating: 'S', effect: '-2 AC, half speed, limited actions. 6 targets.', classes: ['Wizard', 'Sorcerer'] },
      { spell: 'Conjure Animals', rating: 'S', effect: '8 creatures. Massive action economy.', classes: ['Druid', 'Ranger'] },
    ],
  },
  {
    slotLevel: 4,
    topPicks: [
      { spell: 'Banishment', rating: 'S+', effect: 'Remove from fight. Permanent if extraplanar.', classes: ['Many'] },
      { spell: 'Polymorph', rating: 'S+', effect: 'Giant Ape = 157 HP. Or neutralize enemy.', classes: ['Wizard', 'Sorcerer', 'Druid', 'Bard'] },
      { spell: 'Greater Invisibility', rating: 'S+', effect: 'Invisible while attacking. Advantage + disadvantage.', classes: ['Wizard', 'Sorcerer', 'Bard'] },
      { spell: 'Summon Elemental', rating: 'S', effect: 'Reliable summon. Unique elemental effects.', classes: ['Wizard', 'Druid'] },
    ],
  },
  {
    slotLevel: 5,
    topPicks: [
      { spell: 'Wall of Force', rating: 'S+', effect: 'Impenetrable. No save. Only Disintegrate.', classes: ['Wizard'] },
      { spell: 'Animate Objects', rating: 'S+', effect: '10 tiny objects. +8/1d4+4 each. 10 attacks.', classes: ['Wizard', 'Sorcerer', 'Bard'] },
      { spell: 'Hold Monster', rating: 'S', effect: 'Paralyzed. Works on any creature type.', classes: ['Many'] },
      { spell: 'Summon Dragon', rating: 'S', effect: 'Fly + breath weapon + resistance aura.', classes: ['Wizard'] },
    ],
  },
];

export const CONCENTRATION_COMPETITION = {
  rule: 'Only ONE concentration spell at a time.',
  strategy: 'Choose the highest-impact spell for the situation.',
  tiers: [
    { tier: 'S+: fight-ending', spells: ['Hypnotic Pattern', 'Wall of Force', 'Banishment', 'Animate Objects'] },
    { tier: 'S: fight-shaping', spells: ['Spirit Guardians', 'Haste', 'Polymorph', 'Web'] },
    { tier: 'A: strong support', spells: ['Bless', 'Faerie Fire', 'Hold Person', 'Hex'] },
  ],
};

export const CONCENTRATION_TIPS = [
  'Only ONE concentration spell. Make it count.',
  'Hypnotic Pattern: best L3 concentration. Removes multiple threats.',
  'Spirit Guardians: best Cleric concentration. Damage + terrain.',
  'Wall of Force: best L5. No save, no break, fight-ending.',
  'Bless: best L1 concentration. +1d4 to 3 allies\' attacks + saves.',
  'Haste is amazing but losing it = ally loses a turn. Risky.',
  'Protect concentration: War Caster, Resilient (CON), stay safe.',
  'Don\'t concentrate on Hex when you could concentrate on Hypnotic Pattern.',
  'Higher-level concentration spells are usually better than lower ones.',
  'At L5+: upgrade from Bless/Hex to Hypnotic Pattern/Spirit Guardians.',
];
