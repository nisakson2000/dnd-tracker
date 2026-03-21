/**
 * playerAberrantMindGuide.js
 * Player Mode: Aberrant Mind Sorcerer — psionic spellcasting
 * Pure JS — no React dependencies.
 */

export const ABERRANT_MIND_BASICS = {
  class: 'Sorcerer (Aberrant Mind)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Psionic sorcerer. Subtle, undetectable spellcasting. Best sorcerer subclass.',
  note: 'Widely considered the strongest Sorcerer. Psionic Sorcery makes spells undetectable and saves sorcery points.',
};

export const ABERRANT_MIND_FEATURES = [
  { feature: 'Psionic Spells', level: 1, effect: 'Learn extra spells at each level (Arms of Hadar, Dissonant Whispers, etc.). Can swap each for divination/enchantment from Sorc/Warlock/Wizard list.', note: '10 extra spells known. Sorcerer\'s biggest weakness (spells known) solved. Can swap for incredible options.' },
  { feature: 'Telepathic Speech', level: 1, effect: 'Bonus action: telepathy with one creature within 30ft for Sorc level minutes. No shared language needed.', note: 'Silent communication. Great for stealth and RP.' },
  { feature: 'Psionic Sorcery', level: 6, effect: 'Cast psionic spells by spending sorcery points = spell level instead of spell slots. When cast this way: no V, S, or M (non-consumed) components.', note: 'THIS IS THE FEATURE. No components = undetectable casting. Subtle Spell for free. And uses SP instead of slots.' },
  { feature: 'Psychic Defenses', level: 6, effect: 'Resistance to psychic damage. Advantage on saves vs charmed or frightened.', note: 'Solid defensive passives.' },
  { feature: 'Revelation in Flesh', level: 14, effect: 'Spend 1+ SP: gain abilities for 10 min. See invisible (1 SP), fly (1 SP), swim + breathe water (1 SP), squeeze through 1-inch space (1 SP).', note: 'Cheap flight, see invisible, or become ooze. All for 1 SP each.' },
  { feature: 'Warping Implosion', level: 18, effect: 'Action: teleport 120ft. Each creature within 30ft of your old position: STR save or pulled to your old space + 3d10 force damage.', note: 'Teleport + AoE pull + force damage. Once/long rest or 5 SP.' },
];

export const PSIONIC_SPELL_SWAPS = [
  { original: 'Arms of Hadar (1st)', recommended: 'Silvery Barbs or Dissonant Whispers', reason: 'Silvery Barbs is broken. Keep Dissonant Whispers for OA triggers.', rating: 'S' },
  { original: 'Calm Emotions (2nd)', recommended: 'Tasha\'s Mind Whip or Suggestion', reason: 'Mind Whip: INT save, lose reaction + (action OR bonus action OR movement). Incredible.', rating: 'S' },
  { original: 'Hunger of Hadar (3rd)', recommended: 'Enemies Abound or keep Hunger', reason: 'Hunger of Hadar is already great. Enemies Abound is fun chaos.', rating: 'A' },
  { original: 'Evard\'s Black Tentacles (4th)', recommended: 'Summon Aberration or keep Tentacles', reason: 'Both excellent. Tentacles for AoE control, Summon for single target.', rating: 'A' },
  { original: 'Telekinesis (5th)', recommended: 'Synaptic Static or keep Telekinesis', reason: 'Synaptic Static: psychic Fireball + debuff. Telekinesis for utility.', rating: 'S' },
];

export const ABERRANT_MIND_TACTICS = [
  { tactic: 'Undetectable casting', detail: 'Psionic Sorcery: cast with SP instead of slots. No components. No one knows you cast. Social encounters: Suggestion without anyone noticing.', rating: 'S' },
  { tactic: 'SP efficiency', detail: 'Psionic Sorcery uses SP = spell level. Converting slots to SP then casting = more casts per day than normal.', rating: 'S', note: 'L3 slot → 3 SP → cast a 3rd level psionic spell. But you also keep the slot for non-psionic spells.' },
  { tactic: 'Twinned Mind Whip', detail: 'Twin Tasha\'s Mind Whip (2nd level, 2 SP): two targets lose reactions + half their turn. INT save (usually low).', rating: 'S' },
  { tactic: 'Subtle Counterspell', detail: 'Counterspell via Psionic Sorcery: no components. Enemy can\'t Counterspell your Counterspell (they can\'t see you casting).', rating: 'S' },
  { tactic: 'Quickened Synaptic Static', detail: 'Quicken Synaptic Static (bonus action): 8d6 psychic + subtract d6 from attacks/checks/concentration. Then cantrip or another spell.', rating: 'A' },
];

export const ABERRANT_VS_CLOCKWORK = {
  aberrantMind: { pros: ['Undetectable casting', 'SP-efficient casting', 'Better spell swap options', 'Telepathy', 'More offensive'], cons: ['Less defensive', 'No armor/tool proficiencies'] },
  clockworkSoul: { pros: ['Restore Balance (cancel adv/dis)', 'Armor of Agathys (extended list)', 'Bastion of Law (ward)', 'Better defensive options'], cons: ['Less offensive', 'No undetectable casting', 'Worse spell swap pool'] },
  verdict: 'Aberrant Mind for offense and stealth casting. Clockwork for defense and control. Both S-tier.',
};

export function psionicSorcerySPCost(spellLevel) {
  return spellLevel; // SP = spell level
}

export function extraSpellsKnown(sorcererLevel) {
  if (sorcererLevel >= 9) return 10;
  if (sorcererLevel >= 7) return 8;
  if (sorcererLevel >= 5) return 6;
  if (sorcererLevel >= 3) return 4;
  return 2;
}

export function spEfficiency(slotLevel) {
  // Compare: convert slot to SP then cast via Psionic Sorcery
  // Slot → SP conversion: slot level + 1 SP (from Font of Magic table... roughly)
  // But Psionic Sorcery costs exactly spell level in SP
  // Net: you get the spell AND keep flexibility
  const spFromSlot = slotLevel; // simplified
  const psionicCost = slotLevel;
  return { spFromSlot, psionicCost, efficient: true };
}
