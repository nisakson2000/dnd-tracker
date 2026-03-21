/**
 * playerWarlockPatronGuide.js
 * Player Mode: Warlock Patron (subclass) comparison and optimization
 * Pure JS — no React dependencies.
 */

export const WARLOCK_PATRONS = [
  {
    patron: 'The Hexblade',
    rating: 'S+',
    source: 'XGE',
    keyFeature: 'Hex Warrior: CHA for weapon attacks. Hexblade\'s Curse: bonus damage + crit on 19-20 + heal on kill.',
    strengths: ['CHA-based melee (SAD build)', 'Medium armor + shields at L1', 'Best multiclass dip in 5e', 'Curse is incredible damage boost'],
    weaknesses: ['So dominant it overshadows other patrons', 'Curse is once per SR at low levels'],
    expandedSpells: ['Shield (S+)', 'Wrathful Smite (A)', 'Blur (A)', 'Branding Smite (B+)', 'Blink (A)', 'Elemental Weapon (B+)', 'Banishment (S)', 'Cone of Cold (A)'],
    playstyle: 'CHA-based warrior. Best gish patron. Best dip patron. Best everything patron.',
  },
  {
    patron: 'The Genie',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'Genie\'s Vessel: extra PB damage once/turn. Bottled Respite: rest inside vessel.',
    strengths: ['Genie type gives great expanded spells (Dao = Spike Growth, Djinni = Greater Invis)', 'Wish at L9 spell (L17)', 'Limited Wish (L14): any L6 or lower from ANY list'],
    weaknesses: ['Vessel can be destroyed', 'Flight only at L6 (10 min/PB)'],
    expandedSpells: 'Varies by genie type. Dao (earth): Spike Growth, Wall of Stone. Djinni (air): Greater Invisibility, Wind Walk. Efreeti (fire): Fireball, Fire Shield. Marid (water): Fog Cloud, Cone of Cold.',
    playstyle: 'Genie-touched. Bonus damage + incredible utility + eventual Wish.',
  },
  {
    patron: 'The Fiend',
    rating: 'A+',
    source: 'PHB',
    keyFeature: 'Dark One\'s Blessing: temp HP = CHA + warlock level when you reduce a creature to 0.',
    strengths: ['Reliable temp HP sustain', 'Fireball on expanded list', 'Dark One\'s Own Luck: +1d10 to save (1/SR)', 'Hurl Through Hell at L14'],
    weaknesses: ['Temp HP relies on killing', 'Less utility than Genie'],
    expandedSpells: ['Burning Hands (B)', 'Command (A+)', 'Scorching Ray (A)', 'Blindness (A)', 'Fireball (S)', 'Stinking Cloud (A)', 'Fire Shield (A)', 'Wall of Fire (S)'],
    playstyle: 'Damage + survival. Kill things, gain temp HP. Blast with Fireball.',
  },
  {
    patron: 'The Fathomless',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Tentacle of the Deeps: BA 2d8 damage + 10ft speed reduction. Swim speed + breathe underwater.',
    strengths: ['BA tentacle is excellent (2d8 + slow, doesn\'t cost spell slot)', 'Swim speed from L1', 'Guardian Coil: reduce damage with tentacle'],
    weaknesses: ['Aquatic features are niche', 'Less impactful than Hexblade/Genie overall'],
    expandedSpells: ['Create or Destroy Water (C)', 'Thunderwave (A)', 'Gust of Wind (B)', 'Silence (A)', 'Lightning Bolt (A)', 'Sleet Storm (A)', 'Control Water (B)', 'Summon Elemental (A+)'],
    playstyle: 'Ocean warlock. BA tentacle damage every turn. Great in aquatic campaigns.',
  },
  {
    patron: 'The Celestial',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Healing Light: BA heal pool (1+warlock level d6, max CHA dice per heal). Bonus fire/radiant cantrips.',
    strengths: ['Only warlock with reliable healing', 'Sacred Flame + Light free', 'Radiant damage focus (rarely resisted)', 'Revivify at L5'],
    weaknesses: ['Healing pool is small', 'Less damage than damage-focused patrons'],
    expandedSpells: ['Cure Wounds (A)', 'Guiding Bolt (A)', 'Flaming Sphere (A)', 'Lesser Restoration (A)', 'Daylight (B)', 'Revivify (S+)', 'Guardian of Faith (A)', 'Wall of Fire (S)'],
    playstyle: 'Healing warlock. EB damage + healing support. Unique niche.',
  },
  {
    patron: 'The Archfey',
    rating: 'B+',
    source: 'PHB',
    keyFeature: 'Fey Presence: charm or frighten all creatures in 10ft cube (1/SR).',
    strengths: ['Misty Escape (invisible + teleport when damaged)', 'Beguiling Defenses (charm immunity)', 'Good flavor'],
    weaknesses: ['Fey Presence is weak AoE', 'Expanded spells are mediocre', 'Outclassed by most other patrons'],
    expandedSpells: ['Faerie Fire (A+)', 'Sleep (B)', 'Calm Emotions (B)', 'Phantasmal Force (A)', 'Blink (A)', 'Plant Growth (A)', 'Dominate Beast (B)', 'Greater Invisibility (S)'],
    playstyle: 'Fey trickster. Charm, teleport, beguile. More flavor than power.',
  },
  {
    patron: 'The Great Old One',
    rating: 'B+',
    source: 'PHB',
    keyFeature: 'Awakened Mind: telepathy 30ft. Thought Shield: psychic resistance + reverse psychic damage.',
    strengths: ['Telepathy from L1', 'Entropic Ward: disadvantage → turn miss into advantage', 'Create Thrall at L14'],
    weaknesses: ['Features are mostly defensive/utility', 'Expanded spells are niche', 'Less combat power'],
    expandedSpells: ['Dissonant Whispers (A)', 'Tasha\'s Hideous Laughter (A)', 'Detect Thoughts (A)', 'Phantasmal Force (A)', 'Clairvoyance (B)', 'Sending (A)', 'Dominate Beast (B)', 'Telekinesis (A)'],
    playstyle: 'Eldritch horror. Telepathy, mind reading, alien power. Lovecraftian vibes.',
  },
  {
    patron: 'The Undead',
    rating: 'A+',
    source: 'VRGR',
    keyFeature: 'Form of Dread: transform (temp HP, fear on hit, immunity to frightened). PB/LR.',
    strengths: ['Form of Dread is excellent (temp HP + fear + immunity)', 'Spirit Projection at L14 (astral form)', 'Grave Touched: necrotic die change'],
    weaknesses: ['Necrotic damage resisted by some undead', 'Fear immunity common at high levels'],
    expandedSpells: ['Bane (A)', 'False Life (B)', 'Blindness (A)', 'Phantasmal Force (A)', 'Phantom Steed (A)', 'Speak with Dead (B+)', 'Death Ward (A+)', 'Greater Invisibility (S)'],
    playstyle: 'Undead-powered warlock. Transform into dread form. Frighten enemies.',
  },
];

export const WARLOCK_GENERAL_TIPS = [
  'Eldritch Blast + Agonizing Blast is your bread and butter. Best at-will damage in the game.',
  'Pact Magic: few slots (1-4) but recover on SHORT rest. Push for SRs. You\'re the most SR-dependent caster.',
  'Hex: +1d6 per EB beam. At L5 (2 beams): +2d6/round. At L11 (3 beams): +3d6/round.',
  'Mystic Arcanum (L11+): one cast each of L6, L7, L8, L9 per long rest. Choose wisely.',
  'Best invocations: Agonizing Blast (S+), Repelling Blast (S), Devil\'s Sight (S), Mask of Many Faces (A+).',
  'Pact of the Tome: get any 3 cantrips (Guidance, Shillelagh, etc.) + Book of Ancient Secrets for ritual casting.',
  'Pact of the Chain: imp familiar. Invisible, shapeshifter, Help action for advantage. Gift of the Ever-Living Ones invocation.',
  'Warlock 2 is the best caster dip: 2 short-rest slots + EB + 2 invocations. Especially for Sorcerers.',
];
