/**
 * playerOwlinRaceGuide.js
 * Player Mode: Owlin — flight + stealth proficiency
 * Pure JS — no React dependencies.
 */

export const OWLIN_BASICS = {
  race: 'Owlin',
  source: 'Strixhaven: A Curriculum of Chaos',
  size: 'Small or Medium (your choice)',
  speed: '30 feet',
  flySpeed: '30 feet (no armor restriction)',
  darkvision: '120 feet',
  traits: [
    { name: 'Flight', desc: '30ft fly speed. No armor restrictions.' },
    { name: 'Darkvision', desc: '120 feet. Superior darkvision range.' },
    { name: 'Silent Feathers', desc: 'Proficiency in Stealth.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (MotM flexible)',
  note: 'Flight + 120ft darkvision + Stealth proficiency. The ultimate scout/sniper race.',
};

export const OWLIN_VS_FAIRY_VS_AARAKOCRA = [
  { trait: 'Fly Speed', owlin: '30ft', fairy: '30ft', aarakocra: '50ft', winner: 'Aarakocra' },
  { trait: 'Darkvision', owlin: '120ft', fairy: 'None', aarakocra: 'None', winner: 'Owlin' },
  { trait: 'Extra Proficiency', owlin: 'Stealth', fairy: 'None (but Druidcraft cantrip)', aarakocra: 'None', winner: 'Owlin' },
  { trait: 'Innate Spells', owlin: 'None', fairy: 'Faerie Fire + Enlarge/Reduce', aarakocra: 'None', winner: 'Fairy' },
  { trait: 'Creature Type', owlin: 'Humanoid', fairy: 'Fey (immune to Hold Person)', aarakocra: 'Humanoid', winner: 'Fairy' },
  { trait: 'Size Options', owlin: 'Small/Medium', fairy: 'Small only', aarakocra: 'Medium only', winner: 'Owlin (flexible)' },
];

export const OWLIN_CLASS_SYNERGY = [
  { class: 'Rogue', rating: 'S', reason: 'Stealth proficiency + 120ft darkvision + flight = ultimate infiltrator. Fly above, see in darkness, move silently.' },
  { class: 'Gloom Stalker Ranger', rating: 'S', reason: '120ft darkvision + Umbral Sight (invisible in darkness to darkvision). Fly in darkness = invisible flying sniper.' },
  { class: 'Warlock', rating: 'S', reason: 'Fly + EB from range. Devil\'s Sight + 120ft darkvision = see in all darkness. Darkness spell combo.' },
  { class: 'Wizard/Sorcerer', rating: 'A', reason: 'Fly above enemies. 120ft darkvision for dungeon exploration. Stealth for avoiding detection.' },
  { class: 'Cleric', rating: 'A', reason: 'Fly + Spirit Guardians. 120ft darkvision covers Clerics who often lack it.' },
  { class: 'Barbarian', rating: 'C', reason: 'Flight wasted on melee. Stealth clashes with loud barbarian play. 120ft darkvision is nice though.' },
];

export const OWLIN_STEALTH_BUILDS = [
  { build: 'Shadow Monk Owlin', detail: 'Fly + Shadow Step + Stealth proficiency + 120ft darkvision. Teleport between shadows while flying.' },
  { build: 'Assassin Rogue Owlin', detail: 'Fly above, Stealth approach, guaranteed surprise round. 120ft darkvision spots targets before they spot you.' },
  { build: 'Gloom Stalker Owlin', detail: 'Invisible to darkvision + 120ft darkvision + flight. The ultimate night-time sniper.' },
  { build: 'Shadow Sorcerer Owlin', detail: 'Darkness spell + Eyes of the Dark (see through your own Darkness) + flight. Fly in magical darkness.' },
];
