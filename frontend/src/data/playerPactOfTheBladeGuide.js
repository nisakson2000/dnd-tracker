/**
 * playerPactOfTheBladeGuide.js
 * Player Mode: Warlock Pact of the Blade optimization
 * Pure JS — no React dependencies.
 */

export const PACT_BLADE_BASICS = {
  feature: 'Create a pact weapon (any melee weapon form). Use CHA for attacks with Hex Warrior (Hexblade).',
  bondWeapon: 'Can bond a magic weapon as your pact weapon instead of conjuring one.',
  summon: 'Appears in your hand as an action. Can\'t be disarmed. Disappears if 5+ feet away for 1 min.',
  twoHanded: 'Can create greatswords, halberds — any melee weapon.',
  improved: 'Improved Pact Weapon invocation: +1 weapon, can be a bow/crossbow, use as arcane focus.',
};

export const BLADE_INVOCATIONS = [
  { invocation: 'Improved Pact Weapon', level: 1, effect: '+1 weapon, ranged options, arcane focus.', priority: 'Must-have' },
  { invocation: 'Thirsting Blade', level: 5, effect: 'Extra Attack with pact weapon.', priority: 'Must-have' },
  { invocation: 'Lifedrinker', level: 12, effect: '+CHA mod necrotic damage per hit.', priority: 'Must-have' },
  { invocation: 'Eldritch Smite', level: 5, effect: 'Expend warlock slot: 1d8 + 1d8/slot level force damage. Target knocked prone (huge).', priority: 'Must-have' },
  { invocation: 'Superior Pact Weapon (UA)', level: 9, effect: '+2 weapon.', priority: 'If available' },
];

export const HEXBLADE_SYNERGY = {
  hexWarrior: 'Use CHA for attack and damage with one weapon. At L3 (Pact of Blade), extends to pact weapon.',
  hexbladeCurse: 'Bonus action: +prof to damage, crit on 19-20, heal on kill. Once per short rest.',
  combo: 'Hexblade\'s Curse + Eldritch Smite on a crit = devastating burst damage.',
  armorProf: 'Medium armor + shields from Hexblade. AC comparable to fighters.',
};

export const BLADE_BUILDS = [
  { build: 'Hexblade Bladelock', levels: 'Hexblade Warlock X', style: 'PAM + GWM with greatsword/glaive. Hex + Curse + Smite burst.', rating: 'S' },
  { build: 'Hexblade / Paladin', levels: 'Hexblade 5 / Paladin X', style: 'CHA to attacks, short rest smite slots + paladin slots, double smite sources.', rating: 'S' },
  { build: 'Hexblade / Sorcerer', levels: 'Hexblade 5 / Sorcerer X', style: 'Melee blaster. Quicken Booming Blade + attack. Shield spell.', rating: 'A' },
  { build: 'Hexblade Archer', levels: 'Hexblade X', style: 'Improved Pact Weapon longbow. CHA to ranged attacks. Eldritch Smite at range.', rating: 'A' },
];

export const BLADE_VS_EB = {
  blade: { pros: ['Higher burst (Eldritch Smite)', 'Can use GWM/PAM/SS', 'Melee presence'], cons: ['MAD without Hexblade', 'Fragile in melee', 'Invocation tax (3-4 invocations)'] },
  eldritchBlast: { pros: ['No invocation tax beyond Agonizing', 'Safe at range', 'Repelling Blast control'], cons: ['Lower burst', 'Can\'t use martial feats', 'Less cool'] },
  verdict: 'Blade with Hexblade is competitive. Without Hexblade, EB is better.',
};

export function eldritchSmiteDamage(slotLevel) {
  return (1 + slotLevel) * 4.5; // 1d8 + 1d8 per slot level
}

export function bladelockDPR(chamod, profBonus, weaponDie, hasLifedrinker, hasCurse) {
  const base = weaponDie / 2 + chamod;
  const lifedrinker = hasLifedrinker ? chamod : 0;
  const curse = hasCurse ? profBonus : 0;
  return (base + lifedrinker + curse) * 2; // 2 attacks (Thirsting Blade)
}
