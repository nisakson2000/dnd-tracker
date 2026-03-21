/**
 * playerAbyssalEncounters.js
 * Player Mode: Surviving the Abyss — demon encounters and layer hazards
 * Pure JS — no React dependencies.
 */

export const ABYSS_BASICS = {
  layers: 'Infinite layers. Each ruled by a demon lord. No two alike.',
  traits: 'Chaotic Evil. Reality itself is hostile. Terrain shifts, corrupts, and attacks.',
  madness: 'Extended time in the Abyss may require WIS saves vs madness (short or long-term).',
  corruption: 'Prolonged exposure can corrupt alignment. DM may require saves.',
};

export const DEMON_TYPES = [
  { name: 'Dretch', cr: 0.25, note: 'Cannon fodder. Fetid Cloud (poison 10ft). Come in swarms.' },
  { name: 'Quasit', cr: 1, note: 'Invisible, shapechange. Familiar option (Pact of Chain). Scare ability.' },
  { name: 'Shadow Demon', cr: 4, note: 'Incorporeal. Resistant to most damage. Vulnerable to radiant. Hides in darkness.' },
  { name: 'Vrock', cr: 6, note: 'Stunning Screech (CON save). Spores (poison + damage). Flying.' },
  { name: 'Hezrou', cr: 8, note: 'Stench aura (CON save or poisoned). Grappler. Brute force.' },
  { name: 'Glabrezu', cr: 9, note: 'Innate casting (Darkness, Confusion, Dispel Magic, Power Word Stun). Pincers grapple.' },
  { name: 'Nalfeshnee', cr: 13, note: 'Horror Nimbus (WIS save, frightened). Flying. Magic Resistance. Heavy hitter.' },
  { name: 'Marilith', cr: 16, note: '7 attacks/turn (6 longswords + tail). Reactive (3 reactions). Teleport.' },
  { name: 'Goristro', cr: 17, note: 'Siege Monster. Charge (65 damage + prone). Basically a demon kaiju.' },
  { name: 'Balor', cr: 19, note: 'Fire Aura (3d6/round to nearby). Whip (pull 25ft). Death Throes (20d6 fire 30ft on death). Flying.' },
];

export const DEMON_LORD_PREP = {
  orcus: { cr: 26, domain: 'Undeath', prep: 'Radiant damage. Turn Undead. Protection from Evil and Good. He raises undead armies.' },
  demogorgon: { cr: 26, domain: 'Madness', prep: 'WIS save boosters. Heroes\' Feast (frightened immunity). His gaze causes madness.' },
  grazzt: { cr: 24, domain: 'Pleasure/darkness', prep: 'CHA save boosters. He charms. Truesight to see through his illusions.' },
  zuggtmoy: { cr: 23, domain: 'Fungi/decay', prep: 'Poison immunity. CON saves. She infects with spores that control your body.' },
};

export const ANTI_DEMON_TOOLKIT = [
  { tool: 'Protection from Evil and Good', note: 'Prevents fiend charm/possession. Disadvantage on their attacks against you.' },
  { tool: 'Magic Circle', note: 'Trap a demon. They can\'t cross the circle. Can\'t target creatures inside with attacks/spells.' },
  { tool: 'Banishment', note: 'Send demon back to Abyss. If native: CHA save, gone for 1 minute. If not native: permanent.' },
  { tool: 'Holy Water', note: '2d6 radiant. Anyone can throw it. Good vs low-CR demons.' },
  { tool: 'Dispel Evil and Good', note: 'End one enchantment/possession/planar displacement on a creature.' },
  { tool: 'Radiant damage', note: 'No demon is resistant to radiant. Many are weak to it thematically.' },
];

export const DEMON_VS_DEVIL = {
  demons: { alignment: 'Chaotic Evil', organization: 'Chaotic hordes', motivation: 'Destruction for its own sake', weakness: 'Radiant, holy objects', summoning: 'Wild, unpredictable, hard to control' },
  devils: { alignment: 'Lawful Evil', organization: 'Military hierarchy', motivation: 'Corruption of souls via contracts', weakness: 'Silvered weapons, holy objects', summoning: 'Honor contracts strictly, can be bargained with' },
  note: 'Devils can be negotiated with (carefully). Demons just want to destroy.',
};

export function balorDeathThroes(distanceFt) {
  if (distanceFt > 30) return 0;
  return 70; // 20d6 avg = 70. DEX save for half.
}

export function demonMagicResistance() {
  return 'Advantage on saves vs spells and magical effects (most CR 6+ demons)';
}
