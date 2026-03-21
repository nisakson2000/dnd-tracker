/**
 * playerBestChannelDivinityGuide.js
 * Player Mode: Channel Divinity — best uses by domain and oath
 * Pure JS — no React dependencies.
 */

export const CD_RULES = {
  uses: 'Cleric: 1 (L2), 2 (L6). Paladin: 1.',
  recovery: 'Short or long rest.',
  turnUndead: 'All Clerics: undead flee (WIS save).',
  destroyUndead: 'L5+: auto-destroy low CR undead.',
};

export const CLERIC_CD = [
  { domain: 'Twilight', cd: 'Twilight Sanctuary', rating: 'S+', effect: '1d6+level temp HP/turn, 30ft, 1 min.' },
  { domain: 'Grave', cd: 'Path to the Grave', rating: 'S', effect: 'Double next attack damage.' },
  { domain: 'Peace', cd: 'Balm of Peace', rating: 'S', effect: 'Move + heal 2d6+WIS each ally.' },
  { domain: 'Tempest', cd: 'Destructive Wrath', rating: 'A+', effect: 'Max lightning/thunder damage.' },
  { domain: 'Life', cd: 'Preserve Life', rating: 'A+', effect: '5x level HP in 30ft.' },
  { domain: 'Order', cd: 'Order\'s Demand', rating: 'A+', effect: 'Charmed + drop weapons.' },
  { domain: 'Light', cd: 'Radiance of the Dawn', rating: 'A', effect: '2d10+level radiant.' },
  { domain: 'War', cd: 'Guided Strike', rating: 'A', effect: '+10 to one attack.' },
];

export const PALADIN_CD = [
  { oath: 'Vengeance', cd: 'Vow of Enmity', rating: 'S', effect: 'Advantage vs one creature.' },
  { oath: 'Conquest', cd: 'Conquering Presence', rating: 'A+', effect: '30ft AoE frightened.' },
  { oath: 'Devotion', cd: 'Sacred Weapon', rating: 'A', effect: '+CHA to attacks.' },
  { oath: 'Redemption', cd: 'Emissary of Peace', rating: 'A', effect: '+5 Persuasion.' },
];

export const CD_TIPS = [
  'CD recharges on short rest. Use every fight.',
  'Twilight Sanctuary: party temp HP every turn.',
  'Path to the Grave + Paladin smite = devastating.',
  'Vow of Enmity: boss fight advantage.',
  'Destructive Wrath: max damage guaranteed.',
  'Turn Undead: all Clerics. Undead flee.',
  'Don\'t hoard. Short rest refills.',
  'Conquest frightened + aura = speed 0.',
  'Sacred Weapon: +CHA to hit with GWM.',
  'Guided Strike: +10 guarantees hits.',
];
