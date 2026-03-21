/**
 * playerNegotiationInCombat.js
 * Player Mode: Social interaction during combat — surrender, parley, intimidation
 * Pure JS — no React dependencies.
 */

export const COMBAT_NEGOTIATION_RULES = {
  action: 'Speaking is free (brief phrase or sentence). Longer speech may require your action (DM discretion).',
  persuasion: 'Persuasion check against enemy. DC depends on their morale and situation.',
  intimidation: 'Intimidation to frighten or coerce surrender. Easier when you\'re winning.',
  deception: 'Deception to bluff ("reinforcements are coming!"). Contested by Insight.',
};

export const WHEN_TO_NEGOTIATE = [
  { situation: 'Enemies are intelligent and losing', chance: 'High', approach: 'Offer surrender terms. "Drop your weapons and we let you live."' },
  { situation: 'You\'re outnumbered/losing', chance: 'Medium', approach: 'Offer parley. "We don\'t need to fight. What do you want?"' },
  { situation: 'Boss is near death', chance: 'Medium', approach: 'Boss may bargain for its life. Information for mercy.' },
  { situation: 'Enemies are mindless (undead, constructs)', chance: 'None', approach: 'Can\'t negotiate. Fight or flee.' },
  { situation: 'Enemies are fanatics', chance: 'Very Low', approach: 'Religious or ideological fanatics rarely surrender.' },
  { situation: 'Enemies are mercenaries', chance: 'High', approach: 'Mercenaries fight for gold. Outbid their employer.' },
];

export const MORALE_BREAKS = [
  { trigger: 'Leader killed', effect: 'Remaining enemies likely to flee or surrender.', dc: 'DC 10-12' },
  { trigger: 'Half the group killed', effect: 'Morale check. WIS save or flee.', dc: 'DC 13-15' },
  { trigger: 'Party shows overwhelming power', effect: 'Intelligent enemies may surrender preemptively.', dc: 'DC 10' },
  { trigger: 'Party offers fair terms', effect: 'Enemies with families/reasons to live may accept.', dc: 'DC 12-15' },
  { trigger: 'Illusion of greater force', effect: 'Major Image, Minor Illusion of reinforcements. Deception check.', dc: 'DC varies' },
];

export const INTIMIDATION_IN_COMBAT = [
  { method: 'Kill the biggest enemy first', effect: 'Remaining enemies see their strongest fall. Morale drops.' },
  { method: 'Display of power', effect: 'Fireball the group\'s allies. Survivors reconsider.' },
  { method: 'Menacing Attack (Battle Master)', effect: 'Superiority die + WIS save or frightened. Free intimidation built into an attack.' },
  { method: 'Conquest Paladin aura', effect: 'Frightened creatures near you have speed 0 + take psychic damage. Terrifying.' },
  { method: 'Thaumaturgy/Prestidigitation', effect: 'Make your voice boom or eyes glow. +advantage on Intimidation (DM may allow).' },
];

export const SURRENDER_PROTOCOLS = [
  'Disarm surrendered enemies immediately.',
  'Bind prisoners with rope or manacles.',
  'Search for hidden weapons.',
  'Decide what to do: release, interrogate, or turn over to authorities.',
  'Some enemies will fake surrender to ambush you. Insight check.',
  'Paladins with specific oaths may be required to accept surrender (Redemption).',
];

export function moraleCheckDC(enemiesRemaining, totalEnemies, leaderAlive) {
  let dc = 15;
  const ratio = enemiesRemaining / totalEnemies;
  if (ratio <= 0.25) dc -= 5;
  else if (ratio <= 0.5) dc -= 3;
  if (!leaderAlive) dc -= 3;
  return Math.max(5, dc);
}

export function intimidationDC(enemyWisMod, isLosing, isIntelligent) {
  let dc = 10 + enemyWisMod;
  if (isLosing) dc -= 3;
  if (!isIntelligent) dc += 10; // mindless creatures can't be intimidated
  return dc;
}
