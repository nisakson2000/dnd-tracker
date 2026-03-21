/**
 * playerPolymorphFormGuide.js
 * Player Mode: Best Polymorph forms by CR — offense, defense, and utility
 * Pure JS — no React dependencies.
 */

export const POLYMORPH_RULES = {
  targets: 'One creature you can see. Unwilling: WIS save.',
  forms: 'Transform into a BEAST with CR ≤ target\'s level (or CR for creatures).',
  stats: 'Target gains beast\'s HP, AC, STR, DEX, CON. Retains personality and alignment.',
  loses: 'Loses class features, spellcasting, and original stat block.',
  duration: 'Concentration, up to 1 hour.',
  endCondition: 'Reverts when HP drops to 0. Excess damage carries over.',
  note: 'Polymorph is BOTH offensive (enemy → snail) and defensive (ally → T-Rex).',
};

export const BEST_OFFENSIVE_FORMS = [
  { form: 'T-Rex', cr: 8, hp: 136, ac: 13, damage: '4d12+7 bite + 2d8+7 tail', speed: '50ft', rating: 'S+', note: 'Best combat form. 136 HP buffer + massive damage. Multiattack.' },
  { form: 'Giant Ape', cr: 7, hp: 157, ac: 12, damage: '3d10+6 × 2', speed: '40ft, climb 40ft', rating: 'S+', note: 'Highest HP beast. Rock throw (range 50/100). Versatile.' },
  { form: 'Mammoth', cr: 6, hp: 126, ac: 13, damage: '4d8+7 gore + 4d6+7 stomp', speed: '40ft', rating: 'S', note: 'Trampling Charge: prone + bonus stomp. High damage.' },
  { form: 'Giant Crocodile', cr: 5, hp: 85, ac: 14, damage: '3d10+5 bite + 2d8+5 tail', speed: '30ft, swim 50ft', rating: 'A+', note: 'Grapple on bite hit. Hold prey in water. Aquatic fights.' },
  { form: 'Elephant', cr: 4, hp: 76, ac: 12, damage: '3d8+5 gore + 2d6+5 stomp', speed: '40ft', rating: 'A+', note: 'Trampling Charge. Good at CR 4.' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, ac: 15, damage: '2×(1d8+2) claws + 1d10+2+4d10 poison sting', speed: '40ft', rating: 'A+', note: 'Three attacks. Poison sting is devastating if they fail CON save.' },
];

export const BEST_DEFENSIVE_FORMS = [
  { form: 'T-Rex', cr: 8, hp: 136, note: 'Turn a dying ally into 136 HP of angry dinosaur. Best emergency heal.', rating: 'S+' },
  { form: 'Giant Ape', cr: 7, hp: 157, note: 'Highest beast HP. 157 HP buffer on a nearly-dead ally.', rating: 'S+' },
  { form: 'Mammoth', cr: 6, hp: 126, note: '126 HP at CR 6. Good for mid-level parties.', rating: 'S' },
  { form: 'Killer Whale', cr: 3, hp: 90, note: 'High HP at CR 3. Underwater only.', rating: 'A (aquatic)' },
  { form: 'Giant Elk', cr: 2, hp: 42, note: 'Decent HP at CR 2 + 60ft speed for escape.', rating: 'A' },
];

export const BEST_UTILITY_FORMS = [
  { form: 'Giant Eagle', cr: 1, hp: 26, speed: '80ft fly', note: 'Fast flying. Can carry a Medium creature. Escape or travel.', rating: 'S' },
  { form: 'Giant Owl', cr: '1/4', hp: 19, speed: '60ft fly', note: 'Flyby. Stealth +3. Darkvision 120ft. Scouting.', rating: 'A+' },
  { form: 'Whale', cr: 6, hp: 90, speed: 'swim 60ft', note: 'Huge size. Can carry entire party underwater. Hold breath 30 min.', rating: 'A+ (aquatic)' },
  { form: 'Spider', cr: '0', hp: 1, speed: '30ft climb', note: 'Tiny. Infiltration. Web sense. Polymorph enemy → spider, step on it.', rating: 'S (enemy target)' },
  { form: 'Snail/slug', cr: '0', hp: 1, speed: '5ft', note: 'Polymorph enemy into snail. Speed 5ft. Can\'t fight. 1 HP.', rating: 'S+ (enemy target)' },
];

export const POLYMORPH_TACTICS = [
  'Defensive Polymorph: ally at 5 HP → T-Rex at 136 HP. Best emergency "heal."',
  'Offensive Polymorph: enemy fails WIS save → snail. Step on it. Done.',
  'Wait — stepping on Polymorphed enemy just reverts them. Trap them instead (jar, cage, pit).',
  'Better: Polymorph enemy into something harmless, then Banish/imprison the form.',
  'Self-Polymorph: turn yourself into a T-Rex. You keep your personality and can still strategize.',
  'Polymorph doesn\'t end when you attack. T-Rex for full 1 hour of combat.',
  'Polymorph does end if concentration breaks. Protect concentration or you lose the T-Rex.',
  'Polymorph + Dispel Magic: ally Polymorphs enemy → you Dispel their Polymorph if they escape.',
  'At L7 (4th level slots), T-Rex is available. Game-changing moment.',
];

export const POLYMORPH_TIPS = [
  'T-Rex and Giant Ape are the two best forms. Know their stats by heart.',
  'Polymorph is concentration. One failed save and the T-Rex reverts.',
  'Excess damage carries over. If T-Rex takes 200 damage at 1 HP, ally takes 199.',
  'You lose ALL class features in beast form. No spells, no Extra Attack, no rage.',
  'Polymorph on enemy: target the low-WIS martial enemy. Mages have high WIS saves.',
  'True Polymorph (L9) can turn into ANY creature, not just beasts. Permanent.',
  'Animal Shapes (L8, Druid) Polymorphs entire party at once. Multiple T-Rexes.',
  'Best used on martial allies. They lose less (no spells) and gain more (huge HP).',
];
