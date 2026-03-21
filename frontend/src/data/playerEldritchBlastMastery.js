/**
 * playerEldritchBlastMastery.js
 * Player Mode: Warlock Eldritch Invocations and Eldritch Blast optimization
 * Pure JS — no React dependencies.
 */

export const INVOCATION_BASICS = {
  count: '2 (L2), 3 (L5), 4 (L7), 5 (L9), 6 (L12), 7 (L15), 8 (L18).',
  swap: 'Swap one invocation per Warlock level.',
};

export const TOP_INVOCATIONS = [
  { name: 'Agonizing Blast', prereq: 'EB', effect: '+CHA per beam.', rating: 'S', note: '+20 at L17.' },
  { name: 'Repelling Blast', prereq: 'EB', effect: '10ft push per beam.', rating: 'S', note: '40ft push at L17. Spike Growth combo.' },
  { name: 'Devil\'s Sight', prereq: 'None', effect: 'See in magical darkness 120ft.', rating: 'S', note: 'Darkness + Devil\'s Sight = permanent advantage.' },
  { name: 'Thirsting Blade', prereq: 'Blade, L5', effect: 'Extra Attack with pact weapon.', rating: 'S', note: 'Mandatory for Bladelock.' },
  { name: 'Lifedrinker', prereq: 'Blade, L12', effect: '+CHA necrotic per hit.', rating: 'S' },
  { name: 'Eldritch Smite', prereq: 'Blade, L5', effect: 'Slot → force damage + prone.', rating: 'S' },
  { name: 'Book of Ancient Secrets', prereq: 'Tome', effect: 'All-class ritual casting.', rating: 'S' },
  { name: 'Investment of Chain Master', prereq: 'Chain', effect: 'Familiar attacks as BA with your DC.', rating: 'S' },
  { name: 'Armor of Shadows', prereq: 'None', effect: 'At-will Mage Armor.', rating: 'A' },
  { name: 'Mask of Many Faces', prereq: 'None', effect: 'At-will Disguise Self.', rating: 'A' },
  { name: 'Grasp of Hadar', prereq: 'EB', effect: '10ft pull once/turn.', rating: 'A' },
];

export const EB_INVOCATION_BUILDS = {
  blaster: ['Agonizing Blast', 'Repelling Blast', 'Devil\'s Sight'],
  bladelock: ['Thirsting Blade', 'Lifedrinker', 'Eldritch Smite'],
  chainlock: ['Investment of Chain Master', 'Agonizing Blast', 'Repelling Blast'],
  tomelock: ['Book of Ancient Secrets', 'Agonizing Blast', 'Repelling Blast'],
};

export function ebDamage(chaMod, beams, hasAgonizing) {
  return (5.5 + (hasAgonizing ? chaMod : 0)) * beams;
}

export function ebBeams(level) {
  if (level >= 17) return 4;
  if (level >= 11) return 3;
  if (level >= 5) return 2;
  return 1;
}
