/**
 * playerGnomeRaceGuide.js
 * Player Mode: Gnome — the cunning tinkerer
 * Pure JS — no React dependencies.
 */

export const GNOME_BASICS = {
  race: 'Gnome',
  source: 'Player\'s Handbook',
  asis: '+2 INT',
  speed: '25ft',
  size: 'Small',
  darkvision: '60ft',
  note: 'Gnome Cunning: advantage on INT, WIS, CHA saves vs magic. One of the strongest defensive traits in the game. Rock Gnome gets tinkering. Forest Gnome gets Minor Illusion + animal speak.',
};

export const GNOME_COMMON_TRAITS = [
  { trait: 'Gnome Cunning', effect: 'Advantage on INT, WIS, and CHA saving throws against magic.', note: 'THE best gnome trait. Advantage on 3/6 saves vs ALL magic. Protects against most save-or-suck spells. Incredible.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard.' },
];

export const GNOME_SUBRACES = {
  rock: {
    name: 'Rock Gnome',
    asis: '+1 CON',
    traits: [
      { trait: 'Artificer\'s Lore', effect: '2× proficiency on History checks for magic items, alchemical objects, or technological devices.', note: 'Niche but thematic. Useful for item identification.' },
      { trait: 'Tinker', effect: 'Proficiency with tinker\'s tools. Spend 1 hour + 10gp to build a Tiny clockwork device (fire starter, music box, or toy).', note: 'Flavor-heavy. Fire starter has practical use. Creative players find interesting applications.' },
    ],
    rating: 'A',
    note: 'CON bonus + Gnome Cunning. Solid for any INT class. Artificer thematic match.',
  },
  forest: {
    name: 'Forest Gnome',
    asis: '+1 DEX',
    traits: [
      { trait: 'Natural Illusionist', effect: 'Know the Minor Illusion cantrip. INT is casting stat.', note: 'Free Minor Illusion. One of the best cantrips. Create distractions, fake cover, decoys.' },
      { trait: 'Speak with Small Beasts', effect: 'Communicate simple ideas with Small or smaller beasts.', note: 'Talk to squirrels, birds, cats. Gather information from animals. Fun utility.' },
    ],
    rating: 'A',
    note: 'DEX + free Minor Illusion. Great for Wizards and Rogues. Stealthy illusionist.',
  },
  deep: {
    name: 'Deep Gnome (Svirfneblin)',
    asis: '+1 DEX',
    source: 'SCAG / Mordenkainen\'s Tome of Foes',
    traits: [
      { trait: 'Superior Darkvision', effect: '120ft darkvision.', note: 'Double range. See further in darkness than anyone.' },
      { trait: 'Stone Camouflage', effect: 'Advantage on Stealth in rocky terrain.', note: 'Specialized but powerful underground. Underdark specialist.' },
      { trait: 'Svirfneblin Magic (feat)', effect: 'Free feat: Nondetection at will. Blindness/Deafness, Blur, Disguise Self 1/LR each.', note: 'If allowed: incredible free spells. Nondetection at will blocks divination magic.' },
    ],
    rating: 'A+',
    note: 'Best Gnome for underground campaigns. Svirfneblin Magic feat (if allowed) is incredibly powerful.',
  },
};

export const GNOME_CLASS_SYNERGY = [
  { class: 'Wizard', priority: 'S', reason: '+2 INT. Gnome Cunning protects your concentration from magical saves. Best Wizard race.' },
  { class: 'Artificer', priority: 'S', reason: '+2 INT. Gnome Cunning. Rock Gnome tinkering flavor. Thematic and mechanical perfection.' },
  { class: 'Eldritch Knight Fighter', priority: 'A', reason: 'INT for spells. Gnome Cunning on a tanky chassis. Saves become near-unbreakable.' },
  { class: 'Rogue (Arcane Trickster)', priority: 'A', reason: 'Forest: DEX + INT + Minor Illusion. Arcane Trickster thematic match. Gnome Cunning for save protection.' },
];

export const GNOME_TACTICS = [
  { tactic: 'Gnome Cunning anti-caster', detail: 'Advantage on INT/WIS/CHA saves vs magic. Most save-or-suck spells target these. Near-immune to magical control.', rating: 'S' },
  { tactic: 'Minor Illusion cover', detail: 'Forest Gnome: create illusory objects for pseudo-cover. Hide behind fake barrels. Creative combat applications.', rating: 'A' },
  { tactic: 'Small size stealth', detail: 'Small = hide behind Medium creatures. Easier to find cover. Squeeze through smaller spaces.', rating: 'B' },
  { tactic: 'Gnome Wizard concentration', detail: 'Gnome Cunning = advantage on magical saves that break concentration. Your spells stay running.', rating: 'S' },
];

export function gnomeCunningSaveProbability(saveBonus, dc) {
  const normalChance = Math.max(0, Math.min(1, (21 - (dc - saveBonus)) / 20));
  const advantageChance = 1 - Math.pow(1 - normalChance, 2);
  return { normal: `${(normalChance * 100).toFixed(0)}%`, withCunning: `${(advantageChance * 100).toFixed(0)}%` };
}
