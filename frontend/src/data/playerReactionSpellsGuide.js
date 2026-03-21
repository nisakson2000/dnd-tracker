/**
 * playerReactionSpellsGuide.js
 * Player Mode: Reaction spells ranked and when to use each
 * Pure JS — no React dependencies.
 */

export const REACTION_SPELLS_RANKED = [
  { spell: 'Shield', level: 1, trigger: 'Hit by attack or targeted by Magic Missile', effect: '+5 AC until start of next turn. Block Magic Missile entirely.', classes: ['Wizard', 'Sorcerer', 'Hexblade', 'EK Fighter', 'AT Rogue'], rating: 'S', note: 'Best reaction spell. +5 AC for a round. Makes you untouchable. Non-negotiable for any class that can learn it.' },
  { spell: 'Absorb Elements', level: 1, trigger: 'Take acid/cold/fire/lightning/thunder damage', effect: 'Resistance to triggering damage. Next melee attack: +1d6 of that element.', classes: ['Wizard', 'Sorcerer', 'Ranger', 'Druid', 'Artificer'], rating: 'S', note: 'Half elemental damage + bonus melee damage. Essential vs dragon breath, Fireball, etc.' },
  { spell: 'Counterspell', level: 3, trigger: 'See creature within 60ft casting a spell', effect: 'Spell fails. Auto-success if spell level ≤ slot used. Otherwise: ability check DC 10 + spell level.', classes: ['Wizard', 'Sorcerer', 'Warlock'], rating: 'S', note: 'Negate any spell. Win spell wars. Save lives. Must-have at L5+.' },
  { spell: 'Silvery Barbs', level: 1, trigger: 'Creature within 60ft succeeds on attack/check/save', effect: 'Force reroll, take lower. Grant advantage on next attack/check/save to an ally.', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S', note: 'From Strixhaven. Widely considered too strong for L1. Force enemy to reroll success + give ally advantage.' },
  { spell: 'Hellish Rebuke', level: 1, trigger: 'Damaged by a creature you can see', effect: '2d10 fire damage to attacker (DEX save for half).', classes: ['Warlock', 'Tiefling (racial)'], rating: 'B', note: 'Revenge damage. 2d10 is decent at low levels. Falls off vs Shield/Absorb Elements at higher levels.' },
  { spell: 'Feather Fall', level: 1, trigger: 'You or creature within 60ft falls', effect: 'Up to 5 creatures: fall at 60ft/round, take no damage.', classes: ['Bard', 'Sorcerer', 'Wizard', 'Artificer'], rating: 'A', note: 'Save lives from falls. Situational but when you need it, nothing else works. Party-wide.' },
  { spell: 'Gift of Alacrity', level: 1, trigger: 'N/A (not reaction, but listed for initiative)', effect: '+1d8 to initiative for 8 hours.', classes: ['Chronurgy Wizard', 'Fey Touched feat'], rating: 'A', note: 'Not a reaction spell but commonly confused as one. Cast pre-combat. Listed for completeness.' },
];

export const REACTION_PRIORITY = {
  principle: 'You only get ONE reaction per round. Choose wisely which reaction spell to use.',
  priority: [
    { scenario: 'Enemy casts Power Word Kill/Disintegrate', use: 'Counterspell', reason: 'Prevent instant death. Nothing is more important.' },
    { scenario: 'Enemy attacks you', use: 'Shield', reason: '+5 AC might make the difference between hit and miss.' },
    { scenario: 'Dragon uses breath weapon', use: 'Absorb Elements', reason: 'Half the massive elemental damage. Saves more HP than Shield.' },
    { scenario: 'Enemy casts Fireball on party', use: 'Counterspell if possible', reason: 'Negating Fireball saves 28 avg damage to multiple allies. Better than Absorb Elements for yourself only.' },
    { scenario: 'Ally drops to 0 HP from fall', use: 'Feather Fall', reason: 'Save their life. But only if you saw the fall trigger.' },
    { scenario: 'Enemy crits on saving throw vs your spell', use: 'Silvery Barbs', reason: 'Force reroll of the save. Your big spell might land after all.' },
  ],
};

export const WHEN_NOT_TO_COUNTERSPELL = [
  { scenario: 'Enemy casts a cantrip', reason: 'Don\'t waste a L3 slot on a cantrip. It\'s not worth the resource.' },
  { scenario: 'You don\'t know what spell it is', reason: 'You might Counterspell a Healing Word when a Hold Person is coming next turn. Identify first if possible.' },
  { scenario: 'Enemy has more casters than you have slots', reason: 'They\'ll bait your Counterspell with a weaker spell. Save it for the big one.' },
  { scenario: 'You\'re out of range (60ft)', reason: 'Counterspell only works within 60ft. If you\'re 65ft away, you can\'t Counter.' },
  { scenario: 'It would break your concentration', reason: 'RAW: Counterspell is a reaction and doesn\'t break concentration. But if you ALSO need your reaction for Shield, priorities conflict.' },
];

export function shieldACTotal(baseAC) {
  return baseAC + 5;
}

export function absorbElementsDamageReduction(incomingDamage) {
  return Math.floor(incomingDamage / 2);
}

export function silveryBarbsExpectedValue(originalRoll, targetDC) {
  // Chance reroll fails (lower result)
  const rerollAvg = 10.5; // d20 average
  if (originalRoll >= targetDC) {
    // They succeeded. Reroll probability of now failing
    return Math.max(0.05, (targetDC - 1) / 20); // chance of rolling below DC
  }
  return 0;
}
