/**
 * playerYuanTiRaceGuide.js
 * Player Mode: Yuan-ti Pureblood — the magic-resistant serpent
 * Pure JS — no React dependencies.
 */

export const YUAN_TI_BASICS = {
  race: 'Yuan-ti Pureblood',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 CHA, +1 INT (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Magic Resistance (advantage on ALL saves vs spells/magic effects). Poison immunity. One of the strongest races in the game. Often banned for being too powerful.',
};

export const YUAN_TI_TRAITS_LEGACY = [
  { trait: 'Magic Resistance', effect: 'Advantage on saving throws against spells and other magical effects.', note: 'THE most powerful racial trait in 5e. Advantage on EVERY magical save. Fireball, Hold Person, Banishment — all with advantage.' },
  { trait: 'Poison Immunity', effect: 'Immune to poison damage and the poisoned condition.', note: 'Full immunity, not just resistance. Poison is common. Never worry about it.' },
  { trait: 'Innate Spellcasting', effect: 'Poison Spray cantrip. At L3: Animal Friendship (snakes only, unlimited). At L3: Suggestion 1/LR.', note: 'Free Suggestion once per day. No concentration. Powerful utility.' },
];

export const YUAN_TI_TRAITS_MOTM = [
  { trait: 'Magic Resistance (nerfed)', effect: 'Advantage on saves vs spells. PB uses/LR (recharges uses, not permanent).', note: 'MotM nerfed to PB uses/LR. Still strong but not "always on" anymore.' },
  { trait: 'Poison Resilience', effect: 'Resistance to poison damage. Advantage on saves vs poisoned.', note: 'Downgraded from immunity to resistance. Still good.' },
  { trait: 'Serpentine Spellcasting', effect: 'Animal Friendship, Poison Spray. At L3: Suggestion 1/LR.', note: 'Same spellcasting. Suggestion remains great.' },
];

export const YUAN_TI_CLASS_SYNERGY = [
  { class: 'Paladin', priority: 'S', reason: 'CHA bonus. Magic Resistance + Aura of Protection = nearly immune to spells. Best anti-caster character in the game.' },
  { class: 'Warlock', priority: 'S', reason: 'CHA caster. Magic Resistance protects concentration. Poison immunity. Free Suggestion.' },
  { class: 'Sorcerer', priority: 'A', reason: 'CHA caster. Magic Resistance keeps your concentration spells running. Incredibly durable caster.' },
  { class: 'Bard', priority: 'A', reason: 'CHA synergy. Magic Resistance. Free Suggestion on top of Bard spells.' },
  { class: 'Any class', priority: 'A', reason: 'Magic Resistance is universally powerful. Any character benefits from advantage on magical saves.' },
];

export const YUAN_TI_TACTICS = [
  { tactic: 'Anti-caster frontliner', detail: 'Paladin: Magic Resistance + Aura of Protection (+5 to all saves). Nearly auto-succeed magical saves.', rating: 'S' },
  { tactic: 'Concentration protection', detail: 'Caster: Magic Resistance = advantage on CON saves from magical damage. Concentration almost never breaks.', rating: 'S' },
  { tactic: 'Free Suggestion', detail: 'Once per LR: Suggestion with no spell slot. "Guard this door and let no one pass." Social/exploration tool.', rating: 'A' },
  { tactic: 'Poison environment', detail: 'Poison immunity: walk through poison gas, drink poisoned drinks, handle venomous creatures. Zero risk.', rating: 'A' },
];

export function magicResistanceSaveBonus(saveBonus, dcTarget) {
  const normalChance = (21 - (dcTarget - saveBonus)) / 20;
  const advantageChance = 1 - Math.pow(1 - Math.max(0, Math.min(1, normalChance)), 2);
  return { normal: `${(normalChance * 100).toFixed(0)}%`, withAdvantage: `${(advantageChance * 100).toFixed(0)}%`, improvement: `+${((advantageChance - normalChance) * 100).toFixed(0)}%` };
}
