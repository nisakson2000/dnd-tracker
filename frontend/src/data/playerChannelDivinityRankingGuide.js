/**
 * playerChannelDivinityRankingGuide.js
 * Player Mode: Channel Divinity — Cleric and Paladin options ranked
 * Pure JS — no React dependencies.
 */

export const CD_RULES = {
  uses: '1/SR (2 at Cleric L6, 3 at L18).',
  note: 'Short rest recovery. Use freely.',
};

export const CLERIC_CD_RANKED = [
  { domain: 'Twilight', cd: 'Twilight Sanctuary', effect: '1d6+level temp HP or end charm/frighten. All allies. 30ft. Each round. 1 min.', rating: 'S++' },
  { domain: 'Grave', cd: 'Path to the Grave', effect: 'Next attack vs target deals DOUBLE damage.', rating: 'S' },
  { domain: 'Tempest', cd: 'Destructive Wrath', effect: 'Maximize thunder/lightning damage.', rating: 'S' },
  { domain: 'Peace', cd: 'Balm of Peace', effect: 'Move without OAs, heal 2d6+WIS to each ally passed.', rating: 'S' },
  { domain: 'Order', cd: 'Order\'s Demand', effect: 'AoE charm + disarm. WIS save.', rating: 'A+' },
  { domain: 'Life', cd: 'Preserve Life', effect: 'Heal 5×level HP distributed in 30ft.', rating: 'A+' },
  { domain: 'Knowledge', cd: 'Knowledge of Ages', effect: 'Any skill/tool proficiency for 10 min.', rating: 'A' },
  { domain: 'War', cd: 'Guided Strike', effect: '+10 to one attack roll.', rating: 'A' },
  { domain: 'Trickery', cd: 'Invoke Duplicity', effect: 'Illusory double. Advantage + cast from its position.', rating: 'A' },
  { domain: 'Light', cd: 'Radiance of Dawn', effect: '2d10+level radiant. Dispel darkness.', rating: 'A' },
  { domain: 'Forge', cd: 'Artisan\'s Blessing', effect: 'Create metal object up to 100gp.', rating: 'B+' },
];

export const PALADIN_CD_RANKED = [
  { oath: 'Vengeance', cd: 'Vow of Enmity', effect: 'Advantage on all attacks vs 1 creature. 1 min.', rating: 'S+' },
  { oath: 'Conquest', cd: 'Conquering Presence', effect: 'AoE frighten 30ft. Pairs with Aura of Conquest.', rating: 'A+' },
  { oath: 'Devotion', cd: 'Sacred Weapon', effect: '+CHA to attacks. 1 min.', rating: 'A+' },
  { oath: 'All', cd: 'Harness Divine Power', effect: 'Regain 1 spell slot. PB/LR.', rating: 'A+' },
  { oath: 'Ancients', cd: 'Nature\'s Wrath', effect: 'Restrain creature.', rating: 'A' },
  { oath: 'Conquest', cd: 'Guided Strike', effect: '+10 to one attack.', rating: 'A' },
  { oath: 'Redemption', cd: 'Emissary of Peace', effect: '+5 Persuasion 10 min.', rating: 'A' },
];

export const CD_TIPS = [
  'CD recovers on SHORT REST. Use it every fight.',
  'Twilight Sanctuary is the best CD in the game.',
  'Grave Path to the Grave + Paladin Smite = doubled smite.',
  'Tempest: maximize Shatter = 24 guaranteed damage.',
  'Harness Divine Power: free spell slot when Turn Undead isn\'t needed.',
  'Vengeance Vow: advantage = more crits = more smites.',
];
