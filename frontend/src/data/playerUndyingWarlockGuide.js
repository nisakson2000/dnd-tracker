/**
 * playerUndyingWarlockGuide.js
 * Player Mode: Undying Warlock — the lich's servant
 * Pure JS — no React dependencies.
 */

export const UNDYING_BASICS = {
  class: 'Warlock (The Undying)',
  source: 'Sword Coast Adventurer\'s Guide',
  theme: 'Patron is an undead lord (lich, vampire, etc.). Survival and undead control.',
  note: 'Widely considered the weakest Warlock patron. Features are underwhelming compared to Undead (Tasha\'s). Avoid unless DM buffs it.',
};

export const UNDYING_FEATURES = [
  { feature: 'Among the Dead', level: 1, effect: 'Learn Spare the Dying cantrip. Undead must WIS save to attack you; on fail, choose a different target. Breaks if you attack/damage/target undead with a spell.', note: 'Undead avoid attacking you. Niche. Only works until you act aggressively toward undead.' },
  { feature: 'Defy Death', level: 6, effect: 'When you succeed on a death save or use Spare the Dying: regain 1d8+CON HP. Once per long rest.', note: 'One self-heal on death save success. Decent survival but once per day is weak.' },
  { feature: 'Undying Nature', level: 10, effect: 'Don\'t need to breathe, eat, drink, or sleep. Age 10× slower. Can\'t be magically aged.', note: 'Flavor features. Rarely mechanically relevant. Cool for RP.' },
  { feature: 'Indestructible Life', level: 14, effect: 'Bonus action: regain 1d8+Warlock level HP. Reattach severed body parts. Once per short rest.', note: 'Self-heal on bonus action. At L14: 1d8+14 = avg 18.5 HP. Decent but late and underwhelming.' },
];

export const UNDYING_VS_UNDEAD = {
  undying: { pros: ['Undead avoidance (level 1)', 'Don\'t need to breathe/eat/sleep'], cons: ['Worst expanded spell list', 'Features are mostly ribbon', 'Defy Death once/LR', 'Capstone is weak healing'] },
  undead: { pros: ['Form of Dread (fear on hit + temp HP)', 'Grave Touched (necrotic damage conversion)', 'Spirit Projection (astral form)', 'Much stronger mechanically'], cons: ['No undead avoidance', 'Tasha\'s required'] },
  verdict: 'Undead (Tasha\'s) is strictly better in almost every way. Play Undead unless you specifically want the Undying flavor.',
};

export function defyDeathHealing(conMod) {
  return 4.5 + conMod; // 1d8 + CON, once per long rest
}

export function indestructibleLifeHealing(warlockLevel) {
  return 4.5 + warlockLevel; // 1d8 + warlock level
}
