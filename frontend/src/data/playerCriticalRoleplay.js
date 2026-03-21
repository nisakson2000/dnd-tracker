/**
 * playerCriticalRoleplay.js
 * Player Mode: Critical hit/miss flavor text and dramatic narration
 * Pure JS — no React dependencies.
 */

export const CRITICAL_HIT_FLAVOR = {
  melee: [
    'Your blade finds the perfect gap in their armor, cutting deep.',
    'A devastating overhead swing connects with bone-crunching force.',
    'You drive your weapon through their guard with unstoppable momentum.',
    'The strike lands with surgical precision on a vital point.',
    'Your weapon sings through the air and finds its mark true.',
    'A feint opens their defense, and you capitalize with lethal efficiency.',
  ],
  ranged: [
    'The arrow pierces exactly where you aimed — right through the weak point.',
    'A perfect shot arcs across the battlefield and strikes true.',
    'Your bolt finds the smallest gap in their armor, sinking deep.',
    'Time seems to slow as your projectile hits the perfect mark.',
  ],
  spell: [
    'Raw arcane energy surges beyond your control, amplifying the spell\'s destructive power.',
    'The spell connects with devastating resonance, overwhelming their defenses.',
    'Your magic finds a weakness in their magical resistance and strikes with amplified force.',
    'The weave of magic twists in your favor, doubling the spell\'s intensity.',
  ],
};

export const CRITICAL_MISS_FLAVOR = {
  melee: [
    'Your swing goes wide, throwing you off balance.',
    'Your weapon clangs harmlessly off their armor, jarring your arm.',
    'You overcommit to the attack and stumble forward.',
    'They easily sidestep your predictable attack.',
  ],
  ranged: [
    'The arrow sails harmlessly into the distance.',
    'Your shot goes wide, embedding in a nearby tree.',
    'The bowstring slips, sending the arrow off course.',
    'A sudden gust of wind carries your projectile astray.',
  ],
  spell: [
    'The spell fizzles at the last moment, the magic dissipating harmlessly.',
    'Your target deftly dodges the incoming magical energy.',
    'The spell goes wild, hitting nothing but empty air.',
    'Your concentration wavers at the crucial moment, misdirecting the spell.',
  ],
};

export const KILLING_BLOW_FLAVOR = [
  'With a final, decisive strike, your enemy crumbles to the ground.',
  'Your attack shatters their last defense, ending the fight.',
  'They look at you with wide eyes before collapsing in a heap.',
  'The light fades from their eyes as your weapon finds its final mark.',
  'Your magic engulfs them in a brilliant flash, and when it clears, they are still.',
  'With practiced efficiency, you end the threat permanently.',
];

export function getRandomCritHit(type) {
  const options = CRITICAL_HIT_FLAVOR[type] || CRITICAL_HIT_FLAVOR.melee;
  return options[Math.floor(Math.random() * options.length)];
}

export function getRandomCritMiss(type) {
  const options = CRITICAL_MISS_FLAVOR[type] || CRITICAL_MISS_FLAVOR.melee;
  return options[Math.floor(Math.random() * options.length)];
}

export function getRandomKillingBlow() {
  return KILLING_BLOW_FLAVOR[Math.floor(Math.random() * KILLING_BLOW_FLAVOR.length)];
}
