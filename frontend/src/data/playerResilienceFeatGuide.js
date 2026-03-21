/**
 * playerResilienceFeatGuide.js
 * Player Mode: Resilient feat — saving throw proficiency
 * Pure JS — no React dependencies.
 */

export const RESILIENT_BASICS = {
  feat: 'Resilient',
  source: "Player's Handbook",
  type: 'Half-feat (+1 to chosen ability score)',
  benefit: '+1 to one ability score + proficiency in saving throws of that ability.',
  note: 'The go-to feat for shoring up a weak save. Scales with level (proficiency bonus increases).',
};

export const RESILIENT_OPTIONS_RANKED = [
  {
    ability: 'CON',
    rating: 'S',
    reason: 'Concentration saves are CON saves. Proficiency in CON saves = much better spell maintenance.',
    bestFor: 'Any concentration caster: Wizard, Sorcerer, Druid, Cleric, Bard.',
    math: 'At L9 (+4 prof): CON save goes from +2 to +6. Huge improvement on DC 10 checks.',
  },
  {
    ability: 'WIS',
    rating: 'A',
    reason: 'WIS saves are the most common "save or suck" save. Hold Person, Hypnotic Pattern, Command.',
    bestFor: 'Fighters, Rogues, Barbarians, Sorcerers — any class without WIS save proficiency.',
    math: 'At L9: WIS save from +1 to +5. Could be the difference against Hold Person.',
  },
  {
    ability: 'DEX',
    rating: 'B',
    reason: 'DEX saves are common (Fireball, Lightning Bolt, traps). But many classes already have proficiency.',
    bestFor: 'Classes without DEX saves: Cleric, Druid, Barbarian, Fighter (if not using DEX).',
    math: 'Often less impactful because DEX saves are usually for half damage (still take some).',
  },
  {
    ability: 'CHA',
    rating: 'C',
    reason: 'CHA saves are rare but devastating (Banishment, Divine Word). Niche.',
    bestFor: 'Characters worried about Banishment. Very campaign-dependent.',
  },
  {
    ability: 'INT',
    rating: 'C',
    reason: 'INT saves are very rare. Synaptic Static, Mind Flayer abilities. Extremely niche.',
    bestFor: 'Only if fighting many Mind Flayers or aberrations.',
  },
  {
    ability: 'STR',
    rating: 'D',
    reason: 'STR saves are rare and usually for positional effects. Least impactful.',
    bestFor: 'Almost never. STR saves are uncommon and minor.',
  },
];

export const RESILIENT_CON_VS_WAR_CASTER = {
  resilientCon: {
    saves: 'Adds proficiency to CON saves (+2 to +6).',
    otherBenefits: '+1 CON (rounds odd score, +HP).',
    scaling: 'Gets better as proficiency bonus increases.',
    breakpoint: 'Better at level 9+ (when PB is +4 or higher).',
  },
  warCaster: {
    saves: 'Advantage on CON saves (~+3.3 average).',
    otherBenefits: 'Somatic components with hands full. OA can be a spell.',
    scaling: 'Advantage is consistent regardless of level.',
    breakpoint: 'Better at levels 1-8 (advantage > low proficiency).',
  },
  verdict: 'War Caster early (L4), Resilient CON late (L8+). Both together is ideal. If you can only take one: War Caster for versatility.',
};

export const SAVING_THROW_FREQUENCY = [
  { save: 'DEX', frequency: 'Very Common', examples: 'Fireball, Lightning Bolt, traps, dragon breath.' },
  { save: 'WIS', frequency: 'Very Common', examples: 'Hold Person, Hypnotic Pattern, Command, Fear.' },
  { save: 'CON', frequency: 'Common', examples: 'Concentration, Blight, Banishment (CHA), poison.' },
  { save: 'CHA', frequency: 'Uncommon', examples: 'Banishment, Zone of Truth, Calm Emotions.' },
  { save: 'STR', frequency: 'Rare', examples: 'Entangle, Telekinesis, some grapple effects.' },
  { save: 'INT', frequency: 'Very Rare', examples: 'Synaptic Static, Mind Flayer, Feeblemind.' },
];

export function resilientSaveBonus(abilityMod, profBonus) {
  return { without: abilityMod, with: abilityMod + profBonus, improvement: profBonus, note: `Resilient: save goes from +${abilityMod} to +${abilityMod + profBonus} (+${profBonus} improvement)` };
}
