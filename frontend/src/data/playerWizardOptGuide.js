/**
 * playerWizardOptGuide.js
 * Player Mode: Wizard optimization — schools, spellbook management, builds
 * Pure JS — no React dependencies.
 */

export const WIZARD_CORE = {
  strengths: ['Largest spell list in the game.', 'Ritual casting without preparation.', 'Arcane Recovery: recover slots on short rest.', 'Can learn ANY Wizard spell from scrolls/books.'],
  weaknesses: ['d6 HD. Lowest HP.', 'No armor proficiency (without feats/multiclass).', 'Requires spell components/focus.', 'Concentration-dependent.'],
  stats: 'INT > CON > DEX. INT is everything.',
  key: 'Wizard wins through preparation. Right spell at the right time = victory.',
};

export const SCHOOL_RANKINGS = [
  { school: 'Chronurgy', rating: 'S+', why: 'Chronal Shift: force reroll on any attack/save. Convergent Future: force success/failure.', note: 'EGtW. Best Wizard subclass. Time manipulation is absurdly powerful.' },
  { school: 'Divination', rating: 'S+', why: 'Portent: replace ANY d20 roll 2×/LR. Know future rolls. Force fails.', note: 'Roll 2 for enemy save = auto-fail. Most consistent subclass.' },
  { school: 'Abjuration', rating: 'S', why: 'Arcane Ward: extra HP that regenerates. Counterspell expert.', note: 'Tankiest Wizard. Ward absorbs damage. Great with Shield.' },
  { school: 'War Magic', rating: 'A+', why: '+2 AC or +4 to save as reaction. Durable. Power Surge damage.', note: 'Defensive Wizard. Worse than Shield but always available.' },
  { school: 'Order of Scribes', rating: 'A+', why: 'Change damage types. Faster spell copying. Manifest Mind scouting.', note: 'Tasha\'s. Fireball that deals force damage? Yes.' },
  { school: 'Bladesinging', rating: 'S', why: 'Bladesong: +INT to AC, concentration, DEX. Extra Attack at L6.', note: 'Best gish. Highest AC in the game with Bladesong + Shield.' },
  { school: 'Evocation', rating: 'A', why: 'Sculpt Spells: allies auto-save AoE. Fireball without hurting party.', note: 'Friendly Fireball. Simple and effective.' },
  { school: 'Illusion', rating: 'A (DM-dependent)', why: 'Improved Minor Illusion. Malleable Illusions. Illusory Reality at L14.', note: 'Insanely creative at L14+. DM-dependent before that.' },
  { school: 'Conjuration', rating: 'B+', why: 'Minor Conjuration: create any object. Benign Transposition: teleport.', note: 'Creative but mechanically weaker than top schools.' },
  { school: 'Necromancy', rating: 'B+', why: 'Undead Thralls: extra undead from Animate Dead. HP on kills.', note: 'Zombie army. Campaign/table-dependent.' },
  { school: 'Transmutation', rating: 'B', why: 'Transmuter\'s Stone: choose a buff. Minor Alchemy.', note: 'Weak features. Stone is decent but unexciting.' },
  { school: 'Enchantment', rating: 'B', why: 'Hypnotic Gaze: incapacitate one creature. Instinctive Charm.', note: 'Single-target control. Outclassed by other schools.' },
];

export const SPELLBOOK_MANAGEMENT = {
  copying: {
    cost: '50 gp + 2 hours per spell level.',
    source: 'Other spellbooks, spell scrolls.',
    tip: 'Copy every spell you find. Your spellbook is your power.',
  },
  mustHave: [
    'Shield (L1): +5 AC reaction. Non-negotiable.',
    'Absorb Elements (L1): halve elemental damage.',
    'Find Familiar (L1): ritual. Free Help action every turn.',
    'Counterspell (L3): negate enemy spells.',
    'Fireball (L3): damage benchmark.',
    'Hypnotic Pattern (L3): encounter-ending control.',
    'Polymorph (L4): 157 HP Giant Ape.',
    'Wall of Force (L5): indestructible wall.',
    'Animate Objects (L5): 10 attacks/round.',
  ],
  rituals: [
    'Detect Magic: always useful. Free with ritual.',
    'Identify: know what magic items do.',
    'Comprehend Languages: read/understand any language.',
    'Tiny Hut: safe long rest.',
    'Phantom Steed: 100ft speed mount for 1 hour.',
    'Rary\'s Telepathic Bond: party telepathy.',
  ],
};

export const ARCANE_RECOVERY = {
  what: 'Once per day, during short rest, recover spell slots.',
  amount: 'Total slot levels = half Wizard level (rounded up).',
  examples: [
    { level: 5, recovery: '3 levels (one L3 or one L2+L1 or three L1s)' },
    { level: 10, recovery: '5 levels (one L5 or combos)' },
    { level: 15, recovery: '8 levels (one L5+L3 or combos)' },
  ],
  tip: 'Recover your highest-level slots. They\'re the most impactful.',
};

export const WIZARD_SURVIVAL = {
  spells: [
    { spell: 'Shield', ac: '+5 AC reaction. Pushes AC to 20+ easily.' },
    { spell: 'Absorb Elements', dr: 'Halve dragon breath. Reaction.' },
    { spell: 'Misty Step', escape: 'BA 30ft teleport. Escape grapple, pit, melee.' },
    { spell: 'Mirror Image', defense: '3 images. No concentration. Free defense.' },
    { spell: 'Counterspell', prevent: 'Negate enemy spells targeting you.' },
  ],
  feats: [
    { feat: 'War Caster', benefit: 'Advantage on concentration. Cast with hands full.' },
    { feat: 'Resilient (CON)', benefit: 'CON save proficiency. Better at high levels.' },
    { feat: 'Lucky', benefit: '3 rerolls. Survive save-or-die effects.' },
    { feat: 'Alert', benefit: '+5 initiative. Go first. Control the battlefield first.' },
  ],
  positioning: 'Stay behind martials. 60ft+ from enemies. Use cover.',
};

export const WIZARD_BUILD_TIPS = [
  'Shield is your best spell. +5 AC reaction. Never leave without it.',
  'Chronurgy/Divination: best schools. Control fate itself.',
  'Bladesinger: highest AC in the game. Best gish subclass.',
  'Copy every spell you find into your book. Knowledge is power.',
  'Arcane Recovery: get your best slot back on short rest.',
  'INT > everything. Max INT by L8 at latest.',
  'Stay behind the party. You have d6 HP. One hit can down you.',
  'Ritual spells: free casting. Learn Detect Magic, Identify, Tiny Hut.',
  'Counterspell: always have it. Negating enemy spells wins fights.',
  'Multiclass: Fighter 1-2 (armor + Action Surge) or Cleric 1 (armor + healing).',
];
