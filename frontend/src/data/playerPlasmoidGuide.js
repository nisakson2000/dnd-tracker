/**
 * playerPlasmoidGuide.js
 * Player Mode: Plasmoid race guide — the amorphous ooze people
 * Pure JS — no React dependencies.
 */

export const PLASMOID_BASICS = {
  race: 'Plasmoid',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Medium or Small (choose)',
  type: 'Ooze',
  languages: ['Common', 'one of your choice'],
  theme: 'Shapeable ooze beings. Squeeze through tiny gaps, resist acid/poison, pseudopod grappling.',
};

export const PLASMOID_TRAITS = [
  { trait: 'Amorphous', effect: 'Squeeze through gaps as narrow as 1 inch. Can\'t carry anything while squeezing that doesn\'t fit.', rating: 'S', note: 'Squeeze through keyholes, under doors, through prison bars. Insane utility for infiltration.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', rating: 'B', note: 'Standard darkvision. Solid baseline.' },
  { trait: 'Hold Breath', effect: 'Hold breath for 1 hour.', rating: 'B', note: 'Good for underwater or poison gas scenarios.' },
  { trait: 'Natural Resilience', effect: 'Advantage on saves vs being poisoned. Resistance to poison damage.', rating: 'A', note: 'Poison is the most common damage type from monsters. Resistance is very useful.' },
  { trait: 'Shape Self', effect: 'Reshape your body: grow pseudopod (10ft reach, manipulate objects, lift up to STR × 5 lbs). Or reshape to look like another humanoid of your size (not enough to fool Investigation).', rating: 'A', note: 'Pseudopod for utility. Disguise for social. Very flexible trait.' },
];

export const PLASMOID_BUILDS = [
  { build: 'Rogue (any)', why: 'Amorphous lets you infiltrate anywhere. Squeeze through gaps to bypass locks, reach treasure, escape capture.', rating: 'S' },
  { build: 'Monk', why: 'Ooze type avoids humanoid spells. Amorphous for escape. Poison resistance helps survivability.', rating: 'A' },
  { build: 'Wizard/Sorcerer', why: 'Amorphous escape route if caught. Poison resistance for a squishy caster. Shape Self utility.', rating: 'A' },
  { build: 'Druid', why: 'Thematic fit. Natural creature. Amorphous + Wild Shape = ultimate infiltrator.', rating: 'A' },
];

export const OOZE_TYPE_INTERACTIONS = {
  immuneTo: ['Hold Person', 'Charm Person', 'Dominate Person', 'Crown of Madness'],
  stillAffectedBy: ['Hold Monster', 'Charm Monster', 'Dominate Monster'],
  note: 'Same as Autognome — "Person" spells target humanoids. Plasmoids are oozes.',
};

export function pseudopodReach() {
  return 10; // 10ft reach for object manipulation
}

export function pseudopodLiftCapacity(strScore) {
  return strScore * 5;
}
