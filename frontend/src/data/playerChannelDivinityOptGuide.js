/**
 * playerChannelDivinityOptGuide.js
 * Player Mode: Channel Divinity optimization
 * Pure JS — no React dependencies.
 */

export const CD_BASICS = {
  cleric: { uses: '1/SR (2 at L6, 3 at L18)', recharge: 'Short rest', note: 'Use every combat — it recharges.' },
  paladin: { uses: '1/SR', recharge: 'Short rest', note: 'Only 1. Choose wisely.' },
};

export const CLERIC_CD_RANKED = [
  { domain: 'Twilight', cd: 'Twilight Sanctuary', effect: '1d6+level temp HP or end charm/frighten. Every round. Whole party.', rating: 'S+' },
  { domain: 'Tempest', cd: 'Destructive Wrath', effect: 'Maximize lightning/thunder damage.', rating: 'S' },
  { domain: 'Grave', cd: 'Path to the Grave', effect: 'Next attack = double damage (vulnerability).', rating: 'S' },
  { domain: 'Life', cd: 'Preserve Life', effect: 'Heal pool = 5×level. Distribute within 30ft.', rating: 'A' },
  { domain: 'Light', cd: 'Radiance of the Dawn', effect: '2d10+level radiant AoE. Dispels darkness.', rating: 'A' },
  { domain: 'Order', cd: 'Order\'s Demand', effect: 'AoE charm. Drop items.', rating: 'A' },
  { domain: 'War', cd: 'Guided Strike', effect: '+10 to one attack.', rating: 'B' },
  { domain: 'Forge', cd: 'Artisan\'s Blessing', effect: 'Create metal item ≤100gp.', rating: 'C' },
];

export const PALADIN_CD_RANKED = [
  { oath: 'Vengeance', cd: 'Vow of Enmity', effect: 'Advantage vs one creature for 1 min.', rating: 'S' },
  { oath: 'Conquest', cd: 'Conquering Presence', effect: 'AoE frighten → speed 0 with Aura.', rating: 'S' },
  { oath: 'Devotion', cd: 'Sacred Weapon', effect: '+CHA to hit for 1 min. No concentration.', rating: 'A' },
  { oath: 'Crown', cd: 'Champion Challenge', effect: 'Enemies can\'t move 30ft+ from you.', rating: 'A' },
];

export const CD_COMBOS = [
  { combo: 'Grave CD + Paladin Smite', detail: 'Path to the Grave → Paladin crits with smite → double ALL damage dice. 100+ damage.', rating: 'S' },
  { combo: 'Tempest CD + Call Lightning', detail: 'Maximize Call Lightning: 3d10 → 30 guaranteed damage.', rating: 'S' },
  { combo: 'Conquest CD + Aura of Conquest', detail: 'Frighten enemies → speed 0 within aura → take psychic damage each turn.', rating: 'S' },
  { combo: 'Vengeance CD + GWM', detail: 'Advantage on BBEG + GWM = constant +10 damage with good hit chance.', rating: 'S' },
];
