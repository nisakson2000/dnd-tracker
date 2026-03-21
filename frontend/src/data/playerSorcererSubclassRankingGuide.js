/**
 * playerSorcererSubclassRankingGuide.js
 * Player Mode: Sorcerer subclass (Sorcerous Origin) ranking
 * Pure JS — no React dependencies.
 */

export const SORCERER_SUBCLASS_RANKING = [
  {
    subclass: 'Clockwork Soul',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Extra known spells (huge for Sorcerers). Restore Balance: cancel advantage/disadvantage as reaction. Bastion of Law: damage ward.',
    keyFeatures: ['Clockwork Magic (10 bonus spells, swappable)', 'Restore Balance (cancel advantage/disadvantage)', 'Bastion of Law (damage absorption ward)', 'Trance of Order (treat rolls below 10 as 10)', 'Clockwork Cavalcade (mass heal + repair)'],
    note: 'Fixes Sorcerer\'s biggest problem (too few known spells). Restore Balance is incredible.',
  },
  {
    subclass: 'Aberrant Mind',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Extra known spells + Psionic Sorcery: cast them with SP instead of slots (subtle by default). Telepathic Speech. Revelation in Flesh at L14.',
    keyFeatures: ['Psionic Spells (10 bonus, swappable)', 'Telepathic Speech', 'Psionic Sorcery (SP casting, always subtle)', 'Psychic Defenses (resistance + advantage)', 'Revelation in Flesh', 'Warping Implosion'],
    note: 'Psionic Sorcery = cast spells with SP, automatically Subtle. Uncounterable spells for free.',
  },
  {
    subclass: 'Divine Soul',
    source: "Xanathar's Guide to Everything",
    tier: 'A+',
    reason: 'Access to entire Cleric spell list. Favored by the Gods: +2d4 to failed save/attack (1/SR). Best of both Cleric and Sorcerer.',
    keyFeatures: ['Divine Magic (full Cleric spell list access)', 'Favored by the Gods (+2d4 on fail)', 'Empowered Healing (+reroll healing dice)', 'Otherworldly Wings (fly at L14)', 'Unearthly Recovery (heal half HP at L18)'],
    note: 'Twin Spell + Cleric spells = Twin Guiding Bolt, Twin Heal. Cleric/Sorcerer spell list combined.',
  },
  {
    subclass: 'Shadow Magic',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Strength of the Grave: drop to 1 HP instead of 0 (CHA save). Eyes of the Dark: Darkness + see through it (2 SP). Hound of Ill Omen.',
    keyFeatures: ['Eyes of the Dark (Darkness + Devil\'s Sight combo)', 'Strength of the Grave (survive death)', 'Hound of Ill Omen (disadvantage on saves)', 'Shadow Walk (teleport between shadows)', 'Umbral Form (incorporeal)'],
    note: 'Built-in Darkness + Devil\'s Sight for 2 SP. Hound of Ill Omen = disadvantage on saves vs your spells.',
  },
  {
    subclass: 'Draconic Bloodline',
    source: "Player's Handbook",
    tier: 'B+',
    reason: 'Draconic Resilience: 13+DEX AC, +1 HP/level. Elemental Affinity: +CHA to element damage. Dragon Wings at L14.',
    keyFeatures: ['Draconic Resilience (13+DEX AC, +HP)', 'Elemental Affinity (+CHA to damage + resistance)', 'Dragon Wings (permanent fly at L14)', 'Draconic Presence (AoE charm/frighten)'],
    note: 'Good durability. Elemental Affinity + Fireball = +5 damage to every target. Reliable blaster.',
  },
  {
    subclass: 'Storm Sorcery',
    source: "Xanathar's Guide to Everything / SCAG",
    tier: 'B',
    reason: 'Tempestuous Magic: BA fly 10ft after casting (no OA). Heart of the Storm: AoE damage when casting lightning/thunder. Wind Soul: fly at L18.',
    keyFeatures: ['Tempestuous Magic (BA fly 10ft)', 'Heart of the Storm (AoE damage on cast)', 'Storm Guide (control weather)', 'Storm\'s Fury (reaction push)', 'Wind Soul (fly speed, share)'],
    note: 'Mobility-focused. Tempestuous Magic is great escape. But damage features are underwhelming.',
  },
  {
    subclass: 'Wild Magic',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Wild Magic Surge: random effects on casting. Tides of Chaos: free advantage (1/LR, recharges on surge). Bend Luck: +/-1d4 to any roll.',
    keyFeatures: ['Wild Magic Surge (random effects)', 'Tides of Chaos (advantage + surge)', 'Bend Luck (±1d4 any roll)', 'Controlled Chaos (choose from 2 surges)', 'Spell Bombardment (max damage die extra)'],
    note: 'Fun and chaotic. Tides of Chaos is great if DM triggers surges often. Inconsistent otherwise.',
  },
];

export function sorcererKnownSpells(level, hasBonusSpells) {
  const base = level >= 17 ? 15 : level >= 13 ? (level <= 16 ? 11 + Math.floor((level - 13) / 2) : 15) : Math.min(level + 1, 12);
  const bonus = hasBonusSpells ? 10 : 0;
  return { total: base + bonus, note: `${base} base${bonus ? ` + ${bonus} bonus` : ''} = ${base + bonus} known spells` };
}
