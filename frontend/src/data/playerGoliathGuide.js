/**
 * playerGoliathGuide.js
 * Player Mode: Goliath race guide — the mountain-born powerhouse
 * Pure JS — no React dependencies.
 */

export const GOLIATH_BASICS = {
  race: 'Goliath',
  source: 'Volo\'s Guide to Monsters / EEPC / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 STR, +1 CON (Volo\'s) or flexible (MotM)',
  theme: 'Mountain-dwelling titans. Competitive, strong, and tough.',
  note: 'Excellent martial race. Stone\'s Endurance is a free damage reduction reaction. Natural athlete.',
};

export const GOLIATH_TRAITS = [
  { trait: 'Stone\'s Endurance', effect: 'Reaction when you take damage: roll 1d12+CON mod, reduce damage by that amount. Once per short rest.', note: 'Free damage reduction. 1d12+CON = avg 9.5 with +3 CON. Like a mini-Shield. Recharges on short rest.' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carry/push/lift.', note: 'Carry heavy things. Grapple interactions.' },
  { trait: 'Mountain Born', effect: 'Resistance to cold damage. Acclimated to high altitude (no altitude penalties).', note: 'Cold resistance is great. Altitude immunity is niche but flavorful.' },
  { trait: 'Natural Athlete', effect: 'Proficiency in Athletics.', note: 'Free Athletics. Great for grapple builds.' },
];

export const GOLIATH_BUILDS = [
  { build: 'Goliath Barbarian', detail: '+2 STR +1 CON. Stone\'s Endurance + Rage resistance = double damage reduction layers. Bear Totem = triple.', rating: 'S', note: 'THE Barbarian race. Everything synergizes. Mountain-born + mountain barbarian.' },
  { build: 'Goliath Fighter', detail: '+2 STR. Stone\'s Endurance for durability. Athletics for grapple builds. Great weapon or sword-and-board.', rating: 'S' },
  { build: 'Goliath Paladin', detail: '+2 STR. Stone\'s Endurance + heavy armor + Lay on Hands = extremely tanky Paladin.', rating: 'A' },
  { build: 'Goliath Rune Knight', detail: '+2 STR. Giant\'s Might (Large) + Powerful Build. Grapple builds. Fire Rune + Stone\'s Endurance for survivability.', rating: 'S' },
  { build: 'Goliath Grappler', detail: 'Athletics proficiency + STR. Grapple + shove prone. Barbarian (advantage on STR) or Rune Knight (Large size).', rating: 'A' },
];

export const STONES_ENDURANCE_ANALYSIS = {
  averageReduction: '1d12+CON (avg 6.5+CON mod)',
  atCON16: 9.5,
  atCON20: 11.5,
  perShortRest: true,
  vsRaceCompetitors: 'Hill Dwarf gets +1 HP/level. Goliath gets ~10 damage reduced per short rest. In a typical 2-3 encounter day: 20-30 damage reduced.',
  note: 'Stone\'s Endurance is like having 10 extra HP per short rest. Better than most racial defensive features.',
};

export function stonesEnduranceReduction(conMod) {
  return 6.5 + conMod; // 1d12 avg + CON mod
}

export function goliathEffectiveHP(baseHP, encountersPerShortRest, shortRests, conMod) {
  const reduction = stonesEnduranceReduction(conMod);
  const totalReductions = shortRests + 1; // Uses: 1 per short rest + initial
  return baseHP + (totalReductions * reduction);
}
