/**
 * playerSimicHybridGuide.js
 * Player Mode: Simic Hybrid race guide — the bio-enhanced adaptors
 * Pure JS — no React dependencies.
 */

export const SIMIC_HYBRID_BASICS = {
  race: 'Simic Hybrid',
  source: 'Guildmasters\' Guide to Ravnica',
  asi: '+2 CON, +1 any',
  speed: 30,
  size: 'Medium',
  languages: ['Common', 'Elvish or Vedalken'],
  theme: 'Biomancy-enhanced humanoids. Extra limbs, gills, acid spit. Choose your mutations.',
};

export const ANIMAL_ENHANCEMENTS_L1 = [
  { enhancement: 'Manta Glide', effect: 'Reduce falling damage by 100ft (not true flight). Glide: move 2ft horizontally per 1ft descended.', rating: 'B', note: 'Niche. Prevents fall damage. Some creative movement in vertical areas.' },
  { enhancement: 'Nimble Climber', effect: 'Climbing speed equal to walking speed.', rating: 'B', note: 'Good for dungeon exploration. Less useful than flight.' },
  { enhancement: 'Underwater Adaptation', effect: 'Breathe water + swim speed equal to walking speed.', rating: 'B', note: 'Niche but comprehensive when needed. Full aquatic capability.' },
];

export const ANIMAL_ENHANCEMENTS_L5 = [
  { enhancement: 'Grappling Appendages', effect: 'Extra appendages: unarmed strike (1d6+STR). On hit, can grapple (medium or smaller). Can\'t use appendages to hold weapons/items.', rating: 'A', note: 'Free grapple on hit. Doesn\'t use hands. Great for grapplers who want to attack AND grapple.' },
  { enhancement: 'Carapace', effect: '+1 AC when not wearing heavy armor.', rating: 'A', note: 'Flat +1 AC is always good. Stacks with shields, medium armor, Unarmored Defense.' },
  { enhancement: 'Acid Spit', effect: 'Ranged attack (30ft): DEX save (8+CON+prof), 2d10 acid damage. CON mod uses per long rest.', rating: 'B', note: '2d10 ranged damage. CON-based uses. Decent for martials who want ranged options.' },
];

export const SIMIC_HYBRID_BUILDS = [
  { build: 'Rune Knight Fighter (Grappler)', why: '+2 CON +1 STR. Grappling Appendages + enlarge. Grapple while attacking. Pin enemies.', rating: 'S' },
  { build: 'Barbarian', why: '+2 CON. Carapace +1 AC stacks with Unarmored Defense. Grappling Appendages while raging.', rating: 'A' },
  { build: 'Monk', why: 'Carapace +1 AC stacks with Unarmored Defense. Climbing speed for mobility. +1 DEX or WIS.', rating: 'A' },
  { build: 'Artificer', why: '+2 CON +1 INT. Acid Spit for extra damage. Carapace for AC.', rating: 'A' },
];

export function carapaceAC(baseAC) {
  return baseAC + 1; // +1 AC (no heavy armor)
}

export function acidSpitUses(conMod) {
  return Math.max(1, conMod);
}
