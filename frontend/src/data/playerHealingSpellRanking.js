/**
 * playerHealingSpellRanking.js
 * Player Mode: All healing spells ranked by efficiency and situation
 * Pure JS — no React dependencies.
 */

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, class: 'Bard/Cleric/Druid', heal: '1d4+mod', action: 'Bonus Action', range: '60ft', rating: 'S', note: 'THE best healing spell. BA + 60ft range. Revive unconscious allies while still attacking.' },
  { spell: 'Cure Wounds', level: 1, class: 'Multiple', heal: '1d8+mod', action: 'Action', range: 'Touch', rating: 'B', note: 'More healing than Healing Word but costs your action. Touch range is risky.' },
  { spell: 'Goodberry', level: 1, class: 'Druid/Ranger', heal: '10 × 1 HP berries', action: 'Action', range: 'Self', rating: 'A', note: '10 berries, each heals 1 HP. Great for reviving downed allies. Lasts 24 hours.' },
  { spell: 'Prayer of Healing', level: 2, class: 'Cleric', heal: '2d8+mod (6 targets)', action: '10 min', range: '30ft', rating: 'A', note: 'Out-of-combat only. Heals the whole party. Short rest replacement.' },
  { spell: 'Mass Healing Word', level: 3, class: 'Cleric/Bard', heal: '1d4+mod (6 targets)', action: 'Bonus Action', range: '60ft', rating: 'S', note: 'Heal 6 creatures as BA. Multiple allies down? This fixes it.' },
  { spell: 'Aura of Vitality', level: 3, class: 'Paladin/Cleric', heal: '2d6/round for 10 rounds', action: 'Action + BA each round', range: '30ft', rating: 'A', note: '20d6 total healing over 1 minute. Best total healing for a 3rd slot.' },
  { spell: 'Revivify', level: 3, class: 'Cleric/Paladin/Druid', heal: '1 HP (raise dead)', action: 'Action', range: 'Touch', rating: 'S', note: 'Raise ally who died within 1 minute. 300 gp diamond. Always have one ready.' },
  { spell: 'Life Transference', level: 3, class: 'Cleric/Wizard', heal: '4d8 to target, you take 2× rolled', action: 'Action', range: '30ft', rating: 'B', note: 'You take damage to heal more. Risky but big numbers.' },
  { spell: 'Mass Cure Wounds', level: 5, class: 'Bard/Cleric/Druid', heal: '3d8+mod (6 targets)', action: 'Action', range: '60ft', rating: 'A', note: 'Big AoE heal. ~82 total HP for a 5th slot.' },
  { spell: 'Heal', level: 6, class: 'Cleric/Druid', heal: '70 HP flat', action: 'Action', range: '60ft', rating: 'S', note: '70 HP guaranteed. No roll. Also cures blindness, deafness, disease.' },
  { spell: 'Heroes\' Feast', level: 6, class: 'Cleric/Druid', heal: '2d10 temp HP + immunity', action: '1 hour', range: 'Touch', rating: 'S', note: 'Immune to frightened + poison. WIS save advantage. 2d10 temp HP. Lasts 24 hours.' },
  { spell: 'Regenerate', level: 7, class: 'Cleric/Druid', heal: '4d8+15 instant + 1 HP/round for 1 hour', action: 'Action', range: 'Touch', rating: 'A', note: 'Regrows limbs. 1 HP/round = 600 HP over 1 hour. Best sustained healing.' },
  { spell: 'Mass Heal', level: 9, class: 'Cleric', heal: '700 HP split among targets', action: 'Action', range: '60ft', rating: 'S', note: '700 HP pool. Cures all diseases/blindness/deafness. Ultimate heal.' },
];

export const HEALING_PHILOSOPHY = {
  preventive: 'The best healing is preventing damage: Shield, Absorb Elements, positioning.',
  yoyo: 'Let ally drop to 0, Healing Word for 1 HP. They act normally. Most efficient strategy.',
  inCombat: 'Only heal to prevent death (0 HP revive). Don\'t top off during combat.',
  outOfCombat: 'Use Prayer of Healing, Hit Dice, and Goodberry between fights.',
  rule: 'Healing in D&D 5e cannot keep up with incoming damage. Kill enemies faster instead.',
};

export const LIFE_CLERIC_COMBOS = [
  { combo: 'Disciple of Life + Goodberry', effect: 'Each berry heals 4 HP instead of 1. 40 HP total from a 1st level slot.', rating: 'S' },
  { combo: 'Disciple of Life + Healing Word', effect: 'Extra 2+spell level HP per cast. Healing Word becomes much more efficient.', rating: 'S' },
  { combo: 'Preserve Life (CD)', effect: 'Heal 5×level HP, split among creatures within 30ft. Can\'t exceed half max HP.', rating: 'S' },
  { combo: 'Blessed Healer', effect: 'When you heal others with a spell, you heal 2+spell level HP too. Free self-heal.', rating: 'A' },
];

export function healingPerSlot(spellName, mod, slotLevel) {
  const baseHealing = {
    'Healing Word': 2.5 + mod + (slotLevel - 1) * 2.5,
    'Cure Wounds': 4.5 + mod + (slotLevel - 1) * 4.5,
    'Mass Healing Word': (2.5 + mod) * 6,
    'Heal': 70,
    'Mass Heal': 700,
  };
  return baseHealing[spellName] || 0;
}
