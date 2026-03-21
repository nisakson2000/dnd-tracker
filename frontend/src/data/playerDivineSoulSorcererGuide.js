/**
 * playerDivineSoulSorcererGuide.js
 * Player Mode: Divine Soul Sorcerer — the Cleric/Sorcerer hybrid
 * Pure JS — no React dependencies.
 */

export const DIVINE_SOUL_BASICS = {
  class: 'Sorcerer (Divine Soul)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Access to the entire Cleric spell list ON TOP of the Sorcerer list. Best Sorcerer subclass.',
  note: 'Twinned Healing Word. Twinned Guiding Bolt. Quickened Spirit Guardians. The ultimate versatile caster.',
};

export const DIVINE_SOUL_FEATURES = [
  { feature: 'Divine Magic', level: 1, effect: 'Learn spells from the Cleric AND Sorcerer spell lists. Get one free affinity spell (Good: Cure Wounds is best).', note: 'THIS IS THE SUBCLASS. Two full spell lists. Metamagic on Cleric spells. Transformative.' },
  { feature: 'Favored by the Gods', level: 1, effect: 'When you fail a save or miss an attack: add 2d4 to the roll. Once per short rest.', note: '+2d4 (avg 5) on a failed save or missed attack. Reliable clutch feature. Recharges on short rest.' },
  { feature: 'Empowered Healing', level: 6, effect: 'When you or ally within 5ft rolls healing dice, spend 1 SP to reroll any number of dice. Once per turn.', note: 'Reroll low healing dice. 1 SP for better heals. Modest but useful.' },
  { feature: 'Otherworldly Wings', level: 14, effect: 'Bonus action: spectral wings grant 30ft fly speed. No concentration. Permanent until dismissed.', note: 'Free permanent flight at L14. No concentration. Incredible.' },
  { feature: 'Unearthly Recovery', level: 18, effect: 'When below half HP: bonus action to regain HP = half your max HP. Once per long rest.', note: 'Massive self-heal. At L18 with ~100 HP: heal 50 HP as bonus action. Emergency recovery.' },
];

export const BEST_CLERIC_SPELLS_FOR_DIVINE_SOUL = [
  { spell: 'Guidance', level: 0, note: '+1d4 to ability checks. Best cantrip in the game. Always concentrate on this out of combat.' },
  { spell: 'Healing Word', level: 1, note: 'Bonus action ranged heal. Twin it: heal two allies for 1 SP + L1 slot.', metamagic: 'Twinned (1 SP)' },
  { spell: 'Bless', level: 1, note: '+1d4 to attacks and saves for 3 targets. Twin doesn\'t work (multiple targets). Concentrate.', metamagic: 'N/A' },
  { spell: 'Spiritual Weapon', level: 2, note: 'Bonus action 1d8+CHA force attack. No concentration. Free damage every turn.', metamagic: 'N/A' },
  { spell: 'Aid', level: 2, note: 'Increase max HP by 5 per slot level for 3 creatures. 8 hours. No concentration. Extended Spell doubles it.', metamagic: 'Extended (16 hrs)' },
  { spell: 'Spirit Guardians', level: 3, note: '3d8 AoE damage, half speed. Walk into enemies. Quicken for bonus action casting.', metamagic: 'Quickened (2 SP)' },
  { spell: 'Revivify', level: 3, note: 'Bring back the dead (within 1 minute). Sorcerers normally can\'t do this.', metamagic: 'N/A' },
  { spell: 'Death Ward', level: 4, note: 'Drop to 1 HP instead of 0 (once). No concentration. Twin it: protect two allies.', metamagic: 'Twinned (4 SP)' },
  { spell: 'Guardian of Faith', level: 4, note: '60 HP of radiant damage to enemies within 10ft. No concentration. Stacks with Spirit Guardians.', metamagic: 'N/A' },
  { spell: 'Holy Weapon', level: 5, note: '+2d8 radiant per hit. Concentration. Better than any Sorcerer L5 damage buff.', metamagic: 'N/A' },
];

export const DIVINE_SOUL_COMBOS = [
  { combo: 'Twinned Healing Word', cost: '1 SP + L1 slot', effect: 'Heal two downed allies as bonus action. Two people up from 0 HP.', rating: 'S' },
  { combo: 'Twinned Guiding Bolt', cost: '1 SP + L1 slot', effect: 'Two 4d6 radiant attacks with advantage grants. 2 SP at higher levels.', rating: 'A' },
  { combo: 'Quickened Spirit Guardians', cost: '2 SP + L3 slot', effect: 'Cast Spirit Guardians as bonus action → cantrip or spell as action.', rating: 'S' },
  { combo: 'Twinned Death Ward', cost: '4 SP + L4 slot', effect: 'Two allies have free "get out of death" for 8 hours. No concentration.', rating: 'S' },
  { combo: 'Subtle Counterspell + Cleric heals', cost: '1 SP', effect: 'Counter enemy spells undetectably. Then heal party. Do everything.', rating: 'S' },
  { combo: 'Extended Aid', cost: '1 SP + L2 slot', effect: 'Aid lasts 16 hours instead of 8. More max HP for longer.', rating: 'A' },
];

export function favoredByTheGodsBonus() {
  return 5; // 2d4 average
}

export function unearthlyRecoveryHealing(maxHP) {
  return Math.floor(maxHP / 2);
}

export function twinHealingWordTotal(spellLevel, chaMod) {
  const avgDie = (spellLevel === 1) ? 4.5 : 4.5 * spellLevel; // rough
  return 2 * (avgDie + chaMod); // two targets
}
