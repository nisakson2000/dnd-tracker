/**
 * playerThriKreenGuide.js
 * Player Mode: Thri-kreen race guide — the insectoid warriors
 * Pure JS — no React dependencies.
 */

export const THRI_KREEN_BASICS = {
  race: 'Thri-kreen',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Medium or Small (choose)',
  type: 'Monstrosity',
  languages: ['Common', 'one of your choice', 'Thri-kreen (telepathy)'],
  theme: 'Four-armed insectoid. Extra arms for wielding. Chameleon camouflage. Telepathic.',
};

export const THRI_KREEN_TRAITS = [
  { trait: 'Chameleon Carapace', effect: 'Change color to match surroundings. Advantage on Stealth checks to hide.', rating: 'A', note: 'Permanent advantage on Stealth to hide. Great for any stealthy character.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', rating: 'B', note: 'Standard.' },
  { trait: 'Secondary Arms', effect: 'Two smaller arms below primary arms. Can manipulate objects, open doors. CANNOT wield weapons or shields with secondary arms.', rating: 'A', note: 'Hold torches, potions, spell components while keeping weapons in primary hands. Free up actions for item use.' },
  { trait: 'Sleepless', effect: 'Don\'t need sleep. Must remain inactive 6 hours for long rest but conscious.', rating: 'A', note: 'Can\'t be put to sleep. Always on watch. Immune to Sleep spell.' },
  { trait: 'Thri-kreen Telepathy', effect: 'Telepathy 120ft. Can transmit but not receive (one-way unless target has telepathy).', rating: 'B', note: 'Silent communication. Great for stealth coordination. One-way limits it.' },
];

export const THRI_KREEN_BUILDS = [
  { build: 'Ranger (Gloom Stalker)', why: 'Chameleon Carapace advantage on Stealth + Dread Ambusher. Secondary arms hold items. Sleepless for watches.', rating: 'S' },
  { build: 'Rogue', why: 'Advantage on Stealth = easier Hide. Secondary arms for tools while weapons ready. Telepathy for silent plans.', rating: 'S' },
  { build: 'Fighter', why: 'Secondary arms hold potions/items. Use potion as bonus action (if DM allows) or interact with object. Chameleon for ambush.', rating: 'A' },
  { build: 'Artificer', why: 'Secondary arms hold infused items. Chameleon for scouting. Tool use while hands are occupied.', rating: 'A' },
];

export const MONSTROSITY_TYPE_INTERACTIONS = {
  immuneTo: ['Hold Person', 'Charm Person', 'Dominate Person'],
  stillAffectedBy: ['Hold Monster', 'Charm Monster', 'Banishment'],
  note: 'Monstrosity type dodges all "Person" spells. Same benefit as Construct/Ooze types.',
};

export function chameleonStealthAdvantage(stealthMod, dc) {
  const singleChance = Math.min(0.95, Math.max(0.05, (21 - (dc - stealthMod)) / 20));
  return 1 - (1 - singleChance) * (1 - singleChance);
}
