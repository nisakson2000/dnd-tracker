/**
 * playerOwlinGuide.js
 * Player Mode: Owlin race guide — the silent flier
 * Pure JS — no React dependencies.
 */

export const OWLIN_BASICS = {
  race: 'Owlin',
  source: 'Strixhaven: A Curriculum of Chaos',
  size: 'Small or Medium (choose)',
  speed: '30ft, fly 30ft',
  asi: 'Flexible',
  theme: 'Owl folk. Flight + stealth proficiency. Silent hunter.',
  note: 'Flight + Stealth proficiency. Simple but powerful. Like Fairy but trades fey type and spells for Stealth and darkvision.',
};

export const OWLIN_TRAITS = [
  { trait: 'Flight', effect: 'Fly speed 30ft. Cannot use while wearing medium or heavy armor.', note: 'Permanent flight from level 1. Same restriction as Fairy (light armor only).' },
  { trait: 'Darkvision', effect: '120ft darkvision.', note: '120ft darkvision is excellent. Double the standard. See much farther in darkness.' },
  { trait: 'Silent Feathers', effect: 'Proficiency in Stealth.', note: 'Free Stealth. Combined with flight: fly silently above enemies. Aerial scout.' },
];

export const OWLIN_BUILDS = [
  { build: 'Owlin Rogue', detail: 'Fly + Stealth (free). Sneak Attack from above. 120ft darkvision for dungeon scouting.', rating: 'S', note: 'Fly silently above enemies. Drop down for Sneak Attack. Fly away.' },
  { build: 'Owlin Ranger (Gloom Stalker)', detail: 'Fly + 120ft darkvision + Gloom Stalker\'s Umbral Sight. Invisible to darkvision + flying + stealthy.', rating: 'S' },
  { build: 'Owlin Warlock', detail: 'Fly + EB from above. 120ft darkvision. Devil\'s Sight + Darkness combo from the air.', rating: 'S' },
  { build: 'Owlin Wizard', detail: 'Fly above danger. 120ft darkvision for scouting. Stealth for sneaking.', rating: 'A' },
  { build: 'Owlin Monk', detail: 'Fly + Unarmored Defense (no armor restriction issue). 120ft darkvision. Shadow Monk synergy.', rating: 'A' },
];

export const OWLIN_VS_FAIRY = {
  owlin: { pros: ['120ft darkvision (double standard)', 'Free Stealth proficiency', 'Size choice (Small or Medium)', 'Simpler/no restrictions on weapon size if Medium'], cons: ['No fey type', 'No innate spellcasting', 'Humanoid (Hold Person works)'] },
  fairy: { pros: ['Fey type (dodge humanoid spells)', 'Free Faerie Fire', 'Free Enlarge/Reduce', 'More magical'], cons: ['Only Small', '60ft darkvision (standard)', 'No Stealth proficiency'] },
  verdict: 'Owlin for stealth/darkvision. Fairy for magical defense. Both excellent fliers.',
};

export function owlinDarkvisionRange() {
  return 120; // Superior darkvision
}

export function aerialSneakAttackAdvantage(flyHeight) {
  // If flying above and unseen (Stealth), attack with advantage
  return flyHeight > 0 ? 'advantage (if hidden)' : 'normal';
}
