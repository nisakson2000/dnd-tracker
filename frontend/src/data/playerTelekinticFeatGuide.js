/**
 * playerTelekinticFeatGuide.js
 * Player Mode: Telekinetic feat — invisible BA shove
 * Pure JS — no React dependencies.
 */

export const TELEKINETIC_BASICS = {
  feat: 'Telekinetic',
  source: "Tasha's Cauldron of Everything",
  type: 'Half-feat (+1 INT, WIS, or CHA)',
  benefits: [
    '+1 to INT, WIS, or CHA.',
    'Mage Hand cantrip (invisible, 60ft range). If already known: +30ft range.',
    'BA: shove a creature within 30ft 5ft toward or away from you (STR save vs spell DC). No save on willing creatures.',
  ],
  note: 'The BA shove is the star. Works on allies (no save) and enemies. Breaks grapples, repositions, triggers effects.',
};

export const BA_SHOVE_USES = [
  { use: 'Break ally from grapple', detail: 'Shove grappled ally 5ft away. Breaks grapple immediately. No save (willing).', rating: 'S' },
  { use: 'Push into Spirit Guardians', detail: 'Shove enemy 5ft into your Cleric\'s Spirit Guardians aura. Triggers SG damage immediately.', rating: 'S' },
  { use: 'Push into hazards', detail: 'Shove into Spike Growth, Wall of Fire, Cloud of Daggers, Moonbeam. Extra damage.', rating: 'S' },
  { use: 'Pull ally out of danger', detail: 'Shove ally toward you = pull them 5ft out of AoE, melee range, hazard.', rating: 'A' },
  { use: 'Push enemy off ledge', detail: '5ft push over a cliff, into a pit, off a bridge. Fall damage or removal.', rating: 'A' },
  { use: 'Trigger Booming Blade', detail: 'Hit enemy with Booming Blade → shove 5ft → triggers BB movement damage (enemy "moved").', rating: 'S' },
  { use: 'Create distance', detail: 'Push melee enemy 5ft away. May put them out of melee range. No OA.', rating: 'B' },
  { use: 'Move downed ally', detail: 'Shove unconscious ally away from danger. They\'re willing (unconscious = DM ruling).', rating: 'B' },
];

export const TELEKINETIC_COMBOS = [
  { combo: 'Telekinetic + Spirit Guardians', class: 'Cleric', detail: 'BA shove enemies into SG for extra damage proc. Does this every turn.', rating: 'S' },
  { combo: 'Telekinetic + Spike Growth', class: 'Druid/Ranger', detail: 'Shove into Spike Growth = 2d4 piercing per 5ft. Forced movement triggers SG.', rating: 'S' },
  { combo: 'Telekinetic + Booming Blade', class: 'Any with BB', detail: 'BB hit → forced 5ft move → triggers BB rider damage. Guaranteed proc.', rating: 'S' },
  { combo: 'Telekinetic + Repelling Blast', class: 'Warlock', detail: 'EB pushes 10ft + BA shove 5ft = 15ft total push per round. Better with Spike Growth.', rating: 'A' },
  { combo: 'Telekinetic + Web/Entangle', class: 'Any', detail: 'Shove enemy back into Web/Entangle area after they escape.', rating: 'A' },
];

export const TELEKINETIC_CLASS_VALUE = [
  { class: 'Cleric', rating: 'S', reason: 'Spirit Guardians + Telekinetic shove = extra SG damage every turn. +1 WIS. Best user.' },
  { class: 'Druid', rating: 'A', reason: 'Spike Growth combo. +1 WIS. Good BA use.' },
  { class: 'Wizard/Sorcerer', rating: 'A', reason: 'Invisible Mage Hand. +1 INT/CHA. Booming Blade combo for Bladesingers.' },
  { class: 'Warlock', rating: 'A', reason: 'EB + push + Telekinetic shove. +1 CHA. Hex competes for BA though.' },
  { class: 'Fighter', rating: 'B', reason: 'BA shove is nice but Fighters have better BA options. +1 to a mental stat is less useful.' },
];

export function telekineticShoveDC(spellcastingMod, profBonus) {
  return { dc: 8 + spellcastingMod + profBonus, note: `Telekinetic shove DC: ${8 + spellcastingMod + profBonus}. Willing creatures: no save needed.` };
}
