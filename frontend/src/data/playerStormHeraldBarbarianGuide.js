/**
 * playerStormHeraldBarbarianGuide.js
 * Player Mode: Storm Herald Barbarian — the elemental aura
 * Pure JS — no React dependencies.
 */

export const STORM_HERALD_BASICS = {
  class: 'Barbarian (Path of the Storm Herald)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Choose Desert (fire), Sea (lightning), or Tundra (temp HP). Aura environment while raging.',
  note: 'Generally considered weak. Each environment gives a different aura effect. Desert = damage, Sea = single-target lightning, Tundra = temp HP for allies. Can change environment on level up. Tundra is the best option.',
};

export const STORM_HERALD_FEATURES = [
  { feature: 'Storm Aura (Desert)', level: 3, effect: 'When you rage and as BA each turn: each creature within 10ft takes 2 fire (3 at L5, 4 at L10, 5 at L15, 6 at L20).', note: 'AoE fire damage. Scales poorly. 2-6 damage per creature. Hits allies too until L6.' },
  { feature: 'Storm Aura (Sea)', level: 3, effect: 'When you rage and as BA each turn: one creature within 10ft makes DEX save or takes 1d6 lightning (2d6 at L10, 3d6 at L15, 4d6 at L20).', note: 'Single target lightning. Better scaling than Desert but still underwhelming.' },
  { feature: 'Storm Aura (Tundra)', level: 3, effect: 'When you rage and as BA each turn: each creature of choice within 10ft gains 2 temp HP (3 at L5, 4 at L10, 5 at L15, 6 at L20).', note: 'Party temp HP every turn. Best option. At L10: 4 temp HP/turn to everyone nearby. Adds up.' },
  { feature: 'Storm Soul (Desert)', level: 6, effect: 'Fire resistance. When raging: set fire to objects within 10ft as action. Don\'t hurt allies with aura.', note: 'Fire resistance is nice. Aura no longer hurts allies. Setting fires is situational.' },
  { feature: 'Storm Soul (Sea)', level: 6, effect: 'Lightning resistance. Breathe underwater. Swim speed 30ft.', note: 'Aquatic combat specialist. Lightning resistance is useful.' },
  { feature: 'Storm Soul (Tundra)', level: 6, effect: 'Cold resistance. Freeze water within 5ft (action, 5ft square).', note: 'Cold resistance. Freeze water is mostly flavor/utility.' },
  { feature: 'Shielding Storm', level: 10, effect: 'Allies within aura gain resistance matching your Storm Soul type.', note: 'Party-wide fire/lightning/cold resistance. Good defensive buff.' },
  { feature: 'Raging Storm (Desert)', level: 14, effect: 'Reaction: creature in aura hits you → DEX save or knocked prone.', note: 'Free prone on reaction. Gives advantage on next melee attacks. Decent.' },
  { feature: 'Raging Storm (Sea)', level: 14, effect: 'Reaction: creature in aura hit by your attack → STR save or knocked prone. BA: pull creature toward you.', note: 'Prone + pull. Better than Desert version for setting up attacks.' },
  { feature: 'Raging Storm (Tundra)', level: 14, effect: 'When Storm Aura gives temp HP: one creature in aura makes STR save or speed = 0 for 1 turn.', note: 'Free root every turn. No action cost. Best L14 option.' },
];

export const STORM_HERALD_ENVIRONMENT_RANKING = {
  tundra: { rating: 'B+', pros: 'Party temp HP, cold resistance for party, speed = 0 at L14', cons: 'Low temp HP numbers, 10ft range limits application' },
  sea: { rating: 'B', pros: 'Better single-target damage, swim speed, prone at L14', cons: 'Single target only, DEX save (many enemies have good DEX)' },
  desert: { rating: 'C+', pros: 'AoE damage, prone at L14', cons: 'Hits allies until L6, very low damage, fire is commonly resisted' },
  verdict: 'Tundra > Sea > Desert. All are weaker than Totem, Zealot, or Ancestral Guardian.',
};

export const STORM_HERALD_TACTICS = [
  { tactic: 'Tundra temp HP wall', detail: 'BA: give all nearby allies temp HP. Every turn. Over 10 rounds: 20-60 total temp HP distributed to party.', rating: 'B' },
  { tactic: 'Shielding Storm party buff', detail: 'L10: party-wide resistance. Tundra = cold resistance. Sea = lightning. Stack with other defenses.', rating: 'B' },
  { tactic: 'Tundra Raging Storm root', detail: 'L14: free speed=0 every turn. Keep melee enemies locked down while allies kite.', rating: 'A' },
  { tactic: 'Sea pull + prone', detail: 'L14: hit enemy → prone. BA: pull another enemy toward you. Group enemies for AoE.', rating: 'B' },
];

export function stormAuraDamage(environment, barbarianLevel) {
  if (environment === 'desert') {
    return barbarianLevel >= 20 ? 6 : barbarianLevel >= 15 ? 5 : barbarianLevel >= 10 ? 4 : barbarianLevel >= 5 ? 3 : 2;
  }
  if (environment === 'sea') {
    const dice = barbarianLevel >= 20 ? 4 : barbarianLevel >= 15 ? 3 : barbarianLevel >= 10 ? 2 : 1;
    return { dice: `${dice}d6`, avg: dice * 3.5 };
  }
  if (environment === 'tundra') {
    return { tempHP: barbarianLevel >= 20 ? 6 : barbarianLevel >= 15 ? 5 : barbarianLevel >= 10 ? 4 : barbarianLevel >= 5 ? 3 : 2 };
  }
}
