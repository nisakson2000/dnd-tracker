/**
 * playerShortRestOptimizer.js
 * Player Mode: Short rest optimization — what recovers and when to rest
 * Pure JS — no React dependencies.
 */

export const SHORT_REST_RECOVERIES = [
  { feature: 'Hit Dice', who: 'Everyone', detail: 'Spend hit dice (class die + CON) to heal. Main short rest benefit.' },
  { feature: 'Action Surge', who: 'Fighter', detail: '1 use (2 at 17th) recovers on short rest.' },
  { feature: 'Second Wind', who: 'Fighter', detail: '1d10 + fighter level HP. Bonus action.' },
  { feature: 'Superiority Dice', who: 'Battle Master', detail: 'All superiority dice recover.' },
  { feature: 'Ki Points', who: 'Monk', detail: 'ALL Ki points recover. Monks love short rests.' },
  { feature: 'Channel Divinity', who: 'Cleric', detail: '1-3 uses recover depending on level.' },
  { feature: 'Wild Shape', who: 'Druid', detail: '2 uses recover. Critical for Moon Druids.' },
  { feature: 'Bardic Inspiration', who: 'Bard (5th+)', detail: 'Recovers on short rest at level 5+ (Font of Inspiration).' },
  { feature: 'Pact Magic Slots', who: 'Warlock', detail: 'ALL pact magic slots recover. Warlocks NEED short rests.' },
  { feature: 'Arcane Recovery', who: 'Wizard', detail: 'Once per day, recover spell slots totaling half wizard level (max 5th). After short rest.' },
  { feature: 'Natural Recovery', who: 'Land Druid', detail: 'Like Arcane Recovery but for druids.' },
  { feature: 'Song of Rest', who: 'Bard (ally)', detail: 'Anyone spending hit dice gets extra d6-d12 healing.' },
  { feature: 'Rage', who: 'Barbarian', detail: 'Does NOT recover on short rest. Long rest only.' },
  { feature: 'Spell Slots (full casters)', who: 'Most casters', detail: 'Do NOT recover on short rest (except special features).' },
];

export const WHEN_TO_SHORT_REST = [
  { situation: 'After any significant combat', recommendation: 'Yes', reason: 'Spend hit dice to top off HP. Recover class features.' },
  { situation: 'Warlock or Monk in party', recommendation: 'Absolutely', reason: 'These classes rely entirely on short rests. Denying them cripples the party.' },
  { situation: 'Multiple party members below 50% HP', recommendation: 'Yes', reason: 'Hit dice healing is free. Use it.' },
  { situation: 'Fighter used Action Surge', recommendation: 'Yes if safe', reason: 'Action Surge is too good to go without.' },
  { situation: 'No immediate time pressure', recommendation: 'Yes', reason: 'There\'s no reason not to if you\'re safe.' },
  { situation: 'Deep in hostile territory', recommendation: 'Risky', reason: 'Set watches. Use Alarm or Tiny Hut if available.' },
  { situation: 'Time-sensitive mission', recommendation: 'Evaluate', reason: 'Weigh the cost of 1 hour vs entering the next fight weakened.' },
];

export const HIT_DICE_STRATEGY = [
  'Don\'t spend ALL your hit dice. Save some for later short rests.',
  'Heal to at least 75% HP. Going in at 50% is risky.',
  'Barbarians have d12 hit dice — they heal the most per die.',
  'Wizards/Sorcerers have d6 — they heal the least. Consider healing spells on them instead.',
  'Song of Rest (Bard) adds d6-d12 extra healing to each party member spending dice.',
  'Chef feat adds +1d8 per short rest for the party.',
  'Long rest recovers HALF your total hit dice (minimum 1).',
];

export function calculateShortRestHealing(hitDie, conMod, numDice, songOfRestDie) {
  const dieMax = parseInt(hitDie.replace('d', ''));
  const avgPerDie = (dieMax / 2 + 0.5) + conMod;
  const songAvg = songOfRestDie ? (parseInt(songOfRestDie.replace('d', '')) / 2 + 0.5) : 0;
  return {
    averageTotal: Math.floor(avgPerDie * numDice + songAvg),
    minimum: numDice * Math.max(1, 1 + conMod) + (songOfRestDie ? 1 : 0),
    maximum: numDice * (dieMax + conMod) + (songOfRestDie ? parseInt(songOfRestDie.replace('d', '')) : 0),
  };
}

export function shouldShortRest(partyState) {
  const { hpPercent, warlockInParty, monkInParty, fighterUsedSurge, hitDiceRemaining } = partyState || {};
  if (warlockInParty || monkInParty) return { should: true, reason: 'Warlock/Monk NEEDS short rests.' };
  if (hpPercent < 50 && hitDiceRemaining > 0) return { should: true, reason: 'Party HP is low. Spend hit dice.' };
  if (fighterUsedSurge) return { should: true, reason: 'Action Surge is too valuable to go without.' };
  return { should: false, reason: 'Party is in good shape. Continue.' };
}
