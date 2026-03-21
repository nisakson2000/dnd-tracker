/**
 * playerSurpriseRoundRules.js
 * Player Mode: Surprise mechanics, common misconceptions, and tactical usage
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  determination: 'DM compares Stealth checks of hiding side vs Passive Perception of each creature on the other side.',
  perCreature: 'Surprise is determined individually. Some enemies may be surprised while others are not.',
  effect: 'A surprised creature can\'t move or take actions on its first turn, and can\'t take reactions until that turn ends.',
  noSurpriseRound: '5e has NO "surprise round." There\'s a first round of combat where surprised creatures can\'t act.',
  initiative: 'EVERYONE rolls initiative, including surprised creatures. Their turn just does nothing.',
  alertFeat: 'Alert feat: Can\'t be surprised while conscious. Still rolls initiative normally.',
};

export const SURPRISE_MISCONCEPTIONS = [
  { myth: '"Surprise round" exists', truth: 'There is no surprise round. It\'s just the first round of combat where surprised creatures lose their turn.' },
  { myth: 'Surprised creatures can\'t react at all', truth: 'They can\'t take reactions until their (empty) turn ends. After their turn passes, they can react normally.' },
  { myth: 'If one person fails Stealth, no surprise', truth: 'Surprise is per-creature. If the rogue succeeds but the paladin fails, enemies are surprised by the rogue but not the paladin.' },
  { myth: 'Surprised means automatic crit', truth: 'Surprise means they can\'t act on their first turn. Crits come from Assassinate feature or Paralyzed, not surprise itself.' },
  { myth: 'Assassin Rogue auto-crits on surprise', truth: 'Assassinate gives advantage against creatures that haven\'t taken a turn yet AND auto-crits against surprised creatures. Both conditions needed for auto-crit.' },
  { myth: 'You can\'t be surprised if you\'re expecting danger', truth: 'Alertness is represented by Passive Perception. If enemies beat it, you\'re surprised regardless of narrative expectation.' },
];

export const ASSASSIN_INTERACTION = {
  feature: 'Assassinate (Assassin Rogue 3)',
  effect1: 'Advantage on attack rolls against any creature that hasn\'t taken a turn yet.',
  effect2: 'Any hit against a SURPRISED creature is a critical hit.',
  combo: 'Surprise + Assassinate = guaranteed advantage + auto-crit. With Sneak Attack, this is nuclear damage.',
  math: 'Sneak Attack 2d6 (crit: 4d6) + weapon (crit: 2d6 for rapier) = avg 21 damage at level 3. Can one-shot most CR 1 enemies.',
  requirement: 'Must beat the target\'s Passive Perception with Stealth to achieve surprise.',
};

export const SURPRISE_OPTIMIZATION = [
  { method: 'Pass Without Trace', bonus: '+10 Stealth to party', reliability: 'Near-guaranteed surprise vs most enemies', rating: 'S' },
  { method: 'Gloom Stalker\'s invisibility', bonus: 'Invisible to creatures relying on darkvision', reliability: 'Auto-surprise in dark environments', rating: 'S' },
  { method: 'Boots/Cloak of Elvenkind', bonus: 'Advantage on Stealth', reliability: 'Stacks with PWT for insane Stealth', rating: 'A' },
  { method: 'Reliable Talent', bonus: 'Minimum 10 on Stealth check', reliability: 'With +13 Stealth = minimum 23', rating: 'S' },
  { method: 'Distraction', bonus: 'DM may impose disadvantage on Perception', reliability: 'DM dependent', rating: 'B' },
  { method: 'Silence spell', bonus: 'Eliminates sound-based detection', reliability: 'Great combo with stealth approach', rating: 'A' },
];

export function canSurprise(stealthRoll, targetPassivePerception) {
  return stealthRoll >= targetPassivePerception;
}

export function partySurpriseCheck(partyStealthRolls, enemyPassivePerceptions) {
  return enemyPassivePerceptions.map((pp, i) => ({
    enemy: i + 1,
    passivePerception: pp,
    surprisedBy: partyStealthRolls.filter(s => s >= pp).length,
    isSurprised: partyStealthRolls.some(s => s >= pp),
  }));
}

export function assassinateDamage(sneakAttackDice, weaponDice, dexMod) {
  // Auto-crit doubles all dice
  const sneakDice = sneakAttackDice * 2;
  const wpnDice = weaponDice * 2;
  const avgSneak = sneakDice * 3.5;
  const avgWeapon = wpnDice * 3.5;
  return { totalDice: sneakDice + wpnDice, average: avgSneak + avgWeapon + dexMod, modifier: dexMod };
}
