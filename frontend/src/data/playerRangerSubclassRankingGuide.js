/**
 * playerRangerSubclassRankingGuide.js
 * Player Mode: Ranger subclass ranking
 * Pure JS — no React dependencies.
 */

export const RANGER_SUBCLASS_RANKING = [
  {
    subclass: 'Gloom Stalker',
    source: "Xanathar's Guide to Everything",
    tier: 'S',
    reason: 'Dread Ambusher: extra attack + 1d8 on round 1. WIS to initiative. Invisible to darkvision in darkness. Best Ranger.',
    keyFeatures: ['Dread Ambusher (extra attack round 1)', 'Umbral Sight (invisible to darkvision)', 'Iron Mind (WIS save proficiency)', 'Stalker\'s Flurry (reroll missed attack)'],
    note: 'The burst damage king. Round 1: 3 attacks + SS + Dread Ambusher bonus. Invisible in darkness is insane.',
  },
  {
    subclass: 'Horizon Walker',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Planar Warrior: BA convert weapon damage to force. Ethereal Step: BA Etherealness. Distant Strike: teleport 10ft between attacks.',
    keyFeatures: ['Planar Warrior (force damage conversion)', 'Ethereal Step (BA Etherealness)', 'Distant Strike (teleport + extra attack at L11)', 'Spectral Defense (reaction: halve damage)'],
    note: 'Great mobility. Distant Strike at L11 = 3 attacks + teleport. Force damage bypasses most resistances.',
  },
  {
    subclass: 'Drakewarden',
    source: "Fizban's Treasury of Dragons",
    tier: 'A',
    reason: 'Drake companion scales with Ranger level. Drake\'s Breath (AoE breath weapon). Perfected Bond = flight at L15.',
    keyFeatures: ['Drake Companion (scales with level)', 'Drake\'s Breath (AoE breath weapon)', 'Bond of Fang and Scale (resistance)', 'Perfected Bond (Large drake, flight)'],
    note: 'Best companion Ranger. Drake is a real combatant that scales properly. Flight at L15.',
  },
  {
    subclass: 'Fey Wanderer',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'WIS to CHA checks. Dreadful Strikes: +1d4 psychic per turn. Beguiling Twist: redirect charm/frightened to enemies.',
    keyFeatures: ['Dreadful Strikes (extra psychic damage)', 'Otherworldly Glamour (WIS to CHA checks)', 'Beguiling Twist (redirect charm/fear)', 'Misty Wanderer (Misty Step + ally)'],
    note: 'Best face Ranger. WIS to CHA checks = excellent social character. Psychic damage is rarely resisted.',
  },
  {
    subclass: 'Swarmkeeper',
    source: "Tasha's Cauldron of Everything",
    tier: 'B+',
    reason: 'Gathered Swarm: on hit, choose: +1d6 damage, push 15ft, or move 5ft without OA. Creative effects.',
    keyFeatures: ['Gathered Swarm (damage/push/move on hit)', 'Writhing Tide (hover 10ft)', 'Mighty Swarm (upgrade to prone, half cover, grapple)', 'Swarming Dispersal (teleport when hit)'],
    note: 'Versatile effects on every hit. Push + Spike Growth is excellent. Underrated.',
  },
  {
    subclass: 'Hunter',
    source: "Player's Handbook",
    tier: 'B+',
    reason: 'Choices at L3, L7, L11, L15. Colossus Slayer (+1d8/turn), Horde Breaker (extra attack vs adjacent). Simple but effective.',
    keyFeatures: ['Colossus Slayer (extra 1d8 on injured)', 'Horde Breaker (extra attack nearby)', 'Multiattack (Volley or Whirlwind)', 'Defensive options at L7/L15'],
    note: 'No bad choices but no amazing ones either. Solid all-around. Good for new players.',
  },
  {
    subclass: 'Monster Slayer',
    source: "Xanathar's Guide to Everything",
    tier: 'B',
    reason: 'Slayer\'s Prey: +1d6 to one target. Supernatural Defense: add d6 to saves vs target. Anti-boss subclass.',
    keyFeatures: ['Slayer\'s Prey (1d6 extra damage)', 'Supernatural Defense (d6 to saves)', 'Magic-User\'s Nemesis (Counterspell reaction)', 'Slayer\'s Counter (force save reroll)'],
    note: 'Good single-target focus. Slayer\'s Counter at L15 is excellent vs BBEG.',
  },
  {
    subclass: 'Beast Master',
    source: "Player's Handbook (Tasha's update)",
    tier: 'B',
    reason: 'Primal Companion (Tasha\'s version): decent beast that scales. Original PHB version is terrible. Tasha\'s fix makes it viable.',
    keyFeatures: ['Primal Companion (Beast of the Land/Sea/Sky)', 'Exceptional Training (BA command)', 'Bestial Fury (multiattack at L11)', 'Share Spells'],
    note: 'ONLY viable with Tasha\'s Primal Companion. Original PHB beast doesn\'t scale. Always use Tasha\'s rules.',
  },
];

export function rangerExtraAttackDPR(dexMod, weaponDie, subclassDie, numAttacks) {
  const perHit = weaponDie / 2 + 0.5 + dexMod;
  const subclassAvg = subclassDie / 2 + 0.5;
  const total = perHit * numAttacks + subclassAvg;
  return { perHit: Math.round(perHit), withSubclass: Math.round(perHit * numAttacks + subclassAvg), note: `${numAttacks} attacks + subclass bonus = ~${Math.round(perHit * numAttacks + subclassAvg)} avg before hit chance` };
}
