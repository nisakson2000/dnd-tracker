/**
 * playerGithRaceGuide.js
 * Player Mode: Gith races — Githyanki and Githzerai
 * Pure JS — no React dependencies.
 */

export const GITHYANKI = {
  race: 'Githyanki',
  source: "Monster Manual / Mordenkainen's Tome of Foes / MotM",
  traits: [
    { name: 'Astral Knowledge (MotM)', desc: 'After LR, gain proficiency in one skill and with one tool of your choice until next LR.' },
    { name: 'Githyanki Psionics', desc: 'Mage Hand (cantrip), Jump (L1, 1/LR), Misty Step (L3, 1/LR). Uses INT, WIS, or CHA.' },
    { name: 'Psychic Resilience (MotM)', desc: 'Resistance to psychic damage.' },
    { name: 'Medium Armor + Sword Proficiency (legacy)', desc: 'Some versions grant medium armor and greatsword/longsword proficiency.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (MotM flexible)',
  note: 'Free Misty Step at L3 is incredible. Medium armor proficiency (legacy) makes Githyanki Wizards very durable.',
};

export const GITHZERAI = {
  race: 'Githzerai',
  source: "Monster Manual / Mordenkainen's Tome of Foes / MotM",
  traits: [
    { name: 'Githzerai Psionics', desc: 'Mage Hand (cantrip), Shield (L1, 1/LR), Detect Thoughts (L3, 1/LR). Uses INT, WIS, or CHA.' },
    { name: 'Mental Discipline (MotM)', desc: 'Advantage on saving throws against charmed and frightened conditions.' },
    { name: 'Psychic Resilience (MotM)', desc: 'Resistance to psychic damage.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (MotM flexible)',
  note: 'Free Shield spell at L1 is amazing for any caster. +5 AC reaction once per LR. Detect Thoughts for social play.',
};

export const GITH_CLASS_SYNERGY = [
  { class: 'Wizard (Githyanki)', rating: 'S', reason: 'Medium armor (legacy) + Misty Step on a Wizard. AC 17 + escape tool. Best Wizard race.' },
  { class: 'Fighter (Githyanki)', rating: 'A', reason: 'Free Misty Step for mobility. Astral Knowledge for any skill needed. Flexible toolkit.' },
  { class: 'Sorcerer (Githzerai)', rating: 'S', reason: 'Free Shield spell saves a known spell. Advantage on charm/fear. Psychic resistance.' },
  { class: 'Warlock (Githzerai)', rating: 'A', reason: 'Free Shield with limited slots is massive. Detect Thoughts for social Warlocks.' },
  { class: 'Cleric (Githyanki)', rating: 'A', reason: 'Free Misty Step. Clerics lack teleportation. Medium armor is redundant (Clerics get heavy).' },
  { class: 'Rogue (Githyanki)', rating: 'A', reason: 'Free Misty Step for escape. Medium armor for AC. Astral Knowledge for any skill check.' },
];

export const GITH_COMPARISON = {
  githyanki: { strength: 'Misty Step (mobility), Astral Knowledge (skill flexibility), armor/weapon proficiency', weakness: 'No defensive features beyond armor' },
  githzerai: { strength: 'Shield (defensive), charm/fear advantage, Detect Thoughts (social)', weakness: 'No armor proficiency, less offensive' },
  verdict: 'Githyanki for martials and Wizards (armor + Misty Step). Githzerai for casters who want Shield and mental protection.',
};
