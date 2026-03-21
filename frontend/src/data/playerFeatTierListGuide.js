/**
 * playerFeatTierListGuide.js
 * Player Mode: Complete feat tier list with analysis
 * Pure JS — no React dependencies.
 */

export const FEAT_BASICS = {
  concept: 'Feats replace an Ability Score Improvement (ASI). Most classes get ASIs at L4, 8, 12, 16, 19.',
  fighters: 'Fighters get extra ASIs at L6 and L14.',
  rogues: 'Rogues get an extra ASI at L10.',
  halfFeats: 'Half-feats give +1 to an ability score. These are more efficient because they don\'t fully sacrifice an ASI.',
  note: 'Max your primary ability to 20 first unless the feat is S-tier. A +1 to hit/DC affects EVERYTHING.',
};

export const FEATS_RANKED = [
  // S-tier
  { feat: 'Great Weapon Master', asi: 'None', effect: '-5 to hit, +10 damage with heavy weapons. Bonus action attack on crit or kill.', rating: 'S', note: 'Massive DPR increase for heavy weapon users. Pair with advantage sources. Best martial feat.' },
  { feat: 'Sharpshooter', asi: 'None', effect: '-5 to hit, +10 damage with ranged. No disadvantage at long range. Ignore half/three-quarters cover.', rating: 'S', note: 'Ranged version of GWM. Even better because ranged is safer. Best ranged feat.' },
  { feat: 'Polearm Master', asi: 'None', effect: 'Bonus action 1d4 attack with polearm. OA when creature enters your reach.', rating: 'S', note: 'Extra attack + reaction attack on approach. Pairs with Sentinel for lockdown. Mandatory for polearm users.' },
  { feat: 'Sentinel', asi: 'None', effect: 'OA reduces speed to 0. Attack creatures attacking allies. OA even if Disengage.', rating: 'S', note: 'Complete melee lockdown. Enemies can\'t leave. Pairs with Polearm Master for 10ft lockdown.' },
  { feat: 'War Caster', asi: 'None', effect: 'Advantage on CON saves for concentration. Cast with hands full. Spell as OA.', rating: 'S', note: 'Essential for melee casters. Booming Blade opportunity attacks. Concentration protection.' },
  { feat: 'Lucky', asi: 'None', effect: '3 luck points/LR. Reroll any d20 (attack, save, check). Or force enemy reroll on attack against you.', rating: 'S', note: 'Most universally powerful feat. Works on everything. 3 free rerolls per day.' },
  { feat: 'Crossbow Expert', asi: 'None', effect: 'Ignore loading. No disadvantage at melee range. Bonus action hand crossbow attack.', rating: 'S', note: 'Bonus action attack with hand crossbow every turn. Best sustained ranged DPR with SS.' },

  // A-tier
  { feat: 'Resilient (CON)', asi: '+1 CON', effect: 'Proficiency in CON saves.', rating: 'A', note: 'Better than War Caster at higher levels (proficiency scales). Essential for concentration casters.' },
  { feat: 'Alert', asi: 'None', effect: '+5 initiative. Can\'t be surprised. Hidden creatures don\'t get advantage.', rating: 'A', note: '+5 initiative is huge. Going first = controlling the fight. Great for any build.' },
  { feat: 'Elven Accuracy', asi: '+1 DEX/INT/WIS/CHA', effect: 'Triple advantage on attack rolls using DEX/INT/WIS/CHA.', rating: 'A', note: 'Elf only. Super-advantage. Pairs with Eldritch Blast, rapier, or Hexblade. Crit-fishing god.' },
  { feat: 'Fey Touched', asi: '+1 INT/WIS/CHA', effect: 'Learn Misty Step + one L1 divination/enchantment. Free cast 1/LR each + cast with slots.', rating: 'A', note: 'Half-feat. Free Misty Step. Gift of Alacrity or Bless as free L1. Incredible value.' },
  { feat: 'Shadow Touched', asi: '+1 INT/WIS/CHA', effect: 'Learn Invisibility + one L1 illusion/necromancy. Free cast 1/LR each + cast with slots.', rating: 'A', note: 'Half-feat. Free Invisibility. Inflict Wounds or Silent Image. Solid value.' },
  { feat: 'Telekinetic', asi: '+1 INT/WIS/CHA', effect: 'Learn Mage Hand (invisible, 60ft). Bonus action: shove 5ft (INT/WIS/CHA save).', rating: 'A', note: 'Half-feat. Bonus action shove every turn. Push into Spirit Guardians. No resource cost.' },
  { feat: 'Crusher', asi: '+1 CON or STR', effect: 'Bludgeoning hit: push 5ft. Bludgeoning crit: advantage for all attacks vs target until your next turn.', rating: 'A', note: 'Half-feat. Free push on every hit. Crit bonus. Great with Spirit Guardians.' },
  { feat: 'Shield Master', asi: 'None', effect: 'Bonus action shove with shield. Add shield AC to DEX saves. Evasion vs single-target DEX saves.', rating: 'A', note: 'Bonus action prone → advantage on remaining attacks. Shield AC on DEX saves.' },
  { feat: 'Ritual Caster', asi: 'None', effect: 'Learn 2 rituals from a class list. Add more when found. Cast as rituals (no slots).', rating: 'A', note: 'Find Familiar, Detect Magic, Tiny Hut. Incredible utility. Best for non-casters.' },
  { feat: 'Mobile', asi: 'None', effect: '+10ft speed. No OA from creatures you melee. Dash through difficult terrain.', rating: 'A', note: 'Free disengage when you attack. +10ft speed. Great for Monks, melee Rogues.' },

  // B-tier
  { feat: 'Tough', asi: 'None', effect: '+2 HP per level.', rating: 'B', note: '+40 HP at L20. Simple but effective. Good for Barbarians, frontliners.' },
  { feat: 'Inspiring Leader', asi: 'None', effect: '10 min speech: 6 creatures gain temp HP = level + CHA mod.', rating: 'B', note: 'Party-wide temp HP before every fight. Scales with level. Good for CHA classes.' },
  { feat: 'Observant', asi: '+1 INT or WIS', effect: '+5 to passive Perception and Investigation.', rating: 'B', note: 'Half-feat. Passive Perception 20+ makes you nearly impossible to sneak past.' },
  { feat: 'Mounted Combatant', asi: 'None', effect: 'Advantage vs unmounted creatures smaller than mount. Redirect attacks to you. Mount Evasion.', rating: 'B', note: 'Amazing IF you use a mount consistently. Paladin Find Steed build.' },
  { feat: 'Healer', asi: 'None', effect: 'Healer\'s kit: stabilize + 1d6+4+target level HP. Once per creature per rest.', rating: 'B', note: 'Non-magical healing without spell slots. Great for parties without a healer.' },
  { feat: 'Magic Initiate', asi: 'None', effect: '2 cantrips + 1 L1 spell from any class. L1 spell: 1/LR free + can cast with slots if you have them.', rating: 'B', note: 'Booming Blade + Find Familiar for Rogues. Healing Word for anyone. Flexible.' },
];

export function asiVsFeatDecision(currentMainStat) {
  if (currentMainStat < 18) return 'Usually take ASI to increase main stat to 18 or 20 first.';
  if (currentMainStat === 18) return 'Half-feat (+1 to main stat) is great here — reaches 19 AND gets feat benefit.';
  if (currentMainStat === 19) return 'Half-feat to reach 20 is ideal. Otherwise consider S-tier full feat.';
  return 'Main stat maxed. Take your best feat option.';
}

export function gwmExpectedDamage(attackBonus, targetAC, baseDamage, useGWM = true) {
  const mod = useGWM ? attackBonus - 5 : attackBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - mod)) / 20));
  const damage = useGWM ? baseDamage + 10 : baseDamage;
  return hitChance * damage;
}
