/**
 * playerChannelDivinity.js
 * Player Mode: Channel Divinity options by domain/oath
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// CHANNEL DIVINITY RULES
// ---------------------------------------------------------------------------

export const CHANNEL_DIVINITY_RULES = {
  usesPerRest: { default: 1, level6: 2, level18: 3 },
  rechargeOn: 'Short or Long Rest',
  action: 'Varies by option (usually action or bonus action).',
};

// ---------------------------------------------------------------------------
// CLERIC CHANNEL DIVINITY
// ---------------------------------------------------------------------------

export const CLERIC_CHANNEL_DIVINITY = {
  universal: {
    name: 'Turn Undead',
    action: 'Action',
    effect: 'Each undead within 30ft must make WIS save or be turned for 1 minute.',
    note: 'At higher levels, undead of low CR are destroyed instead (Destroy Undead).',
    destroyUndead: [
      { level: 5, maxCR: '1/2' },
      { level: 8, maxCR: 1 },
      { level: 11, maxCR: 2 },
      { level: 14, maxCR: 3 },
      { level: 17, maxCR: 4 },
    ],
  },
  domains: [
    { domain: 'Life', name: 'Preserve Life', action: 'Action', effect: 'Distribute HP equal to 5x cleric level among creatures within 30ft (max half their HP).' },
    { domain: 'Light', name: 'Radiance of the Dawn', action: 'Action', effect: 'Dispel magical darkness within 30ft. Hostile creatures make CON save or take 2d10+level radiant damage (half on save).' },
    { domain: 'Tempest', name: 'Destructive Wrath', action: 'When you roll lightning/thunder damage', effect: 'Deal maximum damage instead of rolling.' },
    { domain: 'War', name: 'Guided Strike', action: 'On your attack roll', effect: '+10 bonus to one attack roll.' },
    { domain: 'War', name: 'War God\'s Blessing', action: 'Reaction', effect: '+10 to an ally\'s attack roll within 30ft. Level 6 feature.' },
    { domain: 'Knowledge', name: 'Knowledge of the Ages', action: 'Action', effect: 'Gain proficiency in one skill or tool for 10 minutes.' },
    { domain: 'Trickery', name: 'Invoke Duplicity', action: 'Action', effect: 'Create illusory duplicate within 30ft for 1 minute (concentration). Advantage on attacks when you and duplicate are within 5ft of target.' },
    { domain: 'Nature', name: 'Charm Animals and Plants', action: 'Action', effect: 'Each beast/plant creature within 30ft makes WIS save or is charmed for 1 minute.' },
    { domain: 'Forge', name: 'Artisan\'s Blessing', action: '1 hour ritual', effect: 'Create a nonmagical metal item worth up to 100gp.' },
    { domain: 'Grave', name: 'Path to the Grave', action: 'Action', effect: 'Curse creature within 30ft — next attack against it deals double damage (vulnerability).' },
  ],
};

// ---------------------------------------------------------------------------
// PALADIN CHANNEL DIVINITY
// ---------------------------------------------------------------------------

export const PALADIN_CHANNEL_DIVINITY = [
  { oath: 'Devotion', name: 'Sacred Weapon', action: 'Action (1 minute)', effect: 'Add CHA mod to attack rolls, weapon emits bright light 20ft.' },
  { oath: 'Devotion', name: 'Turn the Unholy', action: 'Action', effect: 'Fiends and undead within 30ft make WIS save or be turned for 1 minute.' },
  { oath: 'Vengeance', name: 'Abjure Enemy', action: 'Action', effect: 'One creature within 60ft makes WIS save or be frightened, speed 0.' },
  { oath: 'Vengeance', name: 'Vow of Enmity', action: 'Bonus Action', effect: 'Advantage on attack rolls against one creature within 10ft for 1 minute.' },
  { oath: 'Ancients', name: 'Nature\'s Wrath', action: 'Action', effect: 'Restrain a creature within 10ft with spectral vines (STR/DEX save).' },
  { oath: 'Ancients', name: 'Turn the Faithless', action: 'Action', effect: 'Fey and fiends within 30ft make WIS save or be turned for 1 minute.' },
  { oath: 'Crown', name: 'Champion Challenge', action: 'Action', effect: 'Each creature within 30ft can\'t willingly move more than 30ft from you.' },
  { oath: 'Conquest', name: 'Conquering Presence', action: 'Action', effect: 'Each creature within 30ft makes WIS save or be frightened for 1 minute.' },
  { oath: 'Conquest', name: 'Guided Strike', action: 'On attack roll', effect: '+10 to one attack roll.' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get channel divinity uses per rest.
 */
export function getChannelDivinityUses(level) {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  return 1;
}

/**
 * Get Destroy Undead max CR for cleric level.
 */
export function getDestroyUndeadCR(clericLevel) {
  const thresholds = CLERIC_CHANNEL_DIVINITY.universal.destroyUndead;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (clericLevel >= thresholds[i].level) return thresholds[i].maxCR;
  }
  return null;
}

/**
 * Get domain-specific channel divinity options.
 */
export function getDomainOptions(domain) {
  return CLERIC_CHANNEL_DIVINITY.domains.filter(
    d => d.domain.toLowerCase() === (domain || '').toLowerCase()
  );
}

/**
 * Get oath-specific channel divinity options.
 */
export function getOathOptions(oath) {
  return PALADIN_CHANNEL_DIVINITY.filter(
    p => p.oath.toLowerCase() === (oath || '').toLowerCase()
  );
}
