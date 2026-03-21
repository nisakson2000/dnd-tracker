/**
 * playerSavingThrowDefenseGuide.js
 * Player Mode: Saving throw optimization and defense strategy
 * Pure JS — no React dependencies.
 */

export const SAVE_FREQUENCY = [
  { save: 'DEX', frequency: 'Very Common', threats: 'Fireball, Lightning Bolt, traps, breath weapons', note: 'Most AoE damage. Evasion (Rogue/Monk) makes DEX saves trivial.' },
  { save: 'CON', frequency: 'Common', threats: 'Concentration, poison, Blight, Cloudkill', note: 'Concentration saves are CON. Essential for casters.' },
  { save: 'WIS', frequency: 'Very Common', threats: 'Charm, fear, Hold Person, Dominate', note: 'Most dangerous mental save. Failing = losing control of your character.' },
  { save: 'STR', frequency: 'Uncommon', threats: 'Grapple, Entangle, Maelstrom', note: 'Rarely targeted. Low priority.' },
  { save: 'INT', frequency: 'Rare', threats: 'Mind Flayer, Feeblemind, Synaptic Static', note: 'Very rare but Feeblemind is devastating.' },
  { save: 'CHA', frequency: 'Uncommon', threats: 'Banishment, Plane Shift, Divine Word', note: 'Banishment is the main CHA save threat.' },
];

export const SAVE_BOOSTING = [
  { option: 'Resilient (CON)', effect: '+1 CON, proficiency in CON saves', for: 'Casters needing concentration protection', rating: 'S' },
  { option: 'Resilient (WIS)', effect: '+1 WIS, proficiency in WIS saves', for: 'Martials weak to mental effects', rating: 'S' },
  { option: 'Paladin Aura', effect: '+CHA to ALL saves in 10ft', for: 'Entire party. Best save feature in game.', rating: 'S' },
  { option: 'Bless', effect: '+1d4 to saves and attacks', for: 'Party-wide buff. L1 spell.', rating: 'S' },
  { option: 'Ring/Cloak of Protection', effect: '+1 AC and all saves', for: 'Universal boost. Requires attunement.', rating: 'A' },
  { option: 'Diamond Soul (Monk L14)', effect: 'Proficiency in ALL saves + ki reroll', for: 'Monks only. Best individual save feature.', rating: 'S' },
  { option: 'Lucky feat', effect: '3 rerolls per LR on any d20', for: 'Any class. Universal safety net.', rating: 'A' },
];

export const CLASS_SAVE_WEAKNESSES = [
  { class: 'Barbarian', weakness: 'WIS saves', fix: 'Resilient (WIS) at L8 or L12.' },
  { class: 'Fighter', weakness: 'WIS saves', fix: 'Resilient (WIS). Or stay near Paladin.' },
  { class: 'Wizard', weakness: 'CON saves', fix: 'Resilient (CON) for concentration. Or War Caster.' },
  { class: 'Sorcerer', weakness: 'WIS saves', fix: 'Already has CON proficiency. Take Resilient (WIS) or Lucky.' },
  { class: 'Bard', weakness: 'CON and WIS', fix: 'Resilient (CON) for concentration. WIS is a risk.' },
  { class: 'Ranger', weakness: 'WIS and CON', fix: 'Resilient (WIS) or (CON). Choose based on build.' },
];

export function saveChance(saveMod, dc) {
  return Math.min(0.95, Math.max(0.05, (saveMod + 20 - dc) / 20));
}

export function auraOfProtectionValue(chaMod, partySize) {
  return { perCreaturePerSave: chaMod, totalValueEstimate: `+${chaMod} to all saves for ${partySize} allies` };
}
