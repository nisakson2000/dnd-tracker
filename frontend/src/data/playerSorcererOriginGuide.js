/**
 * playerSorcererOriginGuide.js
 * Player Mode: Sorcerer Origin (subclass) comparison and optimization
 * Pure JS — no React dependencies.
 */

export const SORCERER_ORIGINS = [
  {
    origin: 'Clockwork Soul',
    rating: 'S+',
    source: 'TCE',
    keyFeature: 'Clockwork Magic: extra spells known (can swap for abjuration/transmutation). Restore Balance: cancel advantage/disadvantage.',
    strengths: ['10 extra spells known (sorcerers normally get 15 total)', 'Bastion of Law: ward allies with SP', 'Trance of Order (L14): treat rolls below 10 as 10'],
    weaknesses: ['Less flashy than other origins', 'Bastion costs sorcery points'],
    playstyle: 'Reliable caster. More spells, cancel randomness, protect allies. Best overall sorcerer.',
  },
  {
    origin: 'Aberrant Mind',
    rating: 'S+',
    source: 'TCE',
    keyFeature: 'Psionic Spells: 10 extra spells. Psionic Sorcery: cast them with SP (no components).',
    strengths: ['10 extra spells', 'Cast psionic spells with SP = no verbal/somatic/material', 'Subtle spell FOR FREE on psionic spells', 'Telepathy 30ft'],
    weaknesses: ['Psionic spells cost SP', 'Telepathy range is short initially'],
    playstyle: 'Psychic caster. Cast without anyone knowing. Best social/stealth caster.',
  },
  {
    origin: 'Divine Soul',
    rating: 'S',
    source: 'XGE',
    keyFeature: 'Access to entire Cleric spell list. Favored by the Gods: +2d4 to failed save/attack (1/SR).',
    strengths: ['Cleric + Sorcerer spell list = biggest options', 'Twin Haste, Twin Greater Invisibility', 'Favored by the Gods saves clutch moments'],
    weaknesses: ['Still limited spells known (only 15+1)', 'Decision paralysis from huge list'],
    bestPicks: ['Spiritual Weapon (S)', 'Spirit Guardians (S)', 'Bless (S)', 'Healing Word (S)', 'Aid (S)', 'Guiding Bolt (A+)'],
    playstyle: 'Divine caster. Twin healing/buff spells. Best support sorcerer.',
  },
  {
    origin: 'Shadow Magic',
    rating: 'A+',
    source: 'XGE',
    keyFeature: 'Eyes of the Dark: 120ft Darkvision + Darkness (2 SP, see through it). Strength of the Grave: don\'t die (1/LR).',
    strengths: ['Free Devil\'s Sight + Darkness combo', 'Hound of Ill Omen (3 SP): shadow dog gives disadvantage on saves', 'Shadow Walk (L14): teleport 120ft in dim/dark'],
    weaknesses: ['Darkness combo annoys party', 'Hound costs SP', 'Strength of the Grave only works once/LR'],
    playstyle: 'Shadow caster. Darkness combo. Summon shadow hound. Teleport through shadows.',
  },
  {
    origin: 'Draconic Bloodline',
    rating: 'A',
    source: 'PHB',
    keyFeature: 'Draconic Resilience: 13+DEX AC, +1 HP/level. Elemental Affinity: +CHA to element damage.',
    strengths: ['Free Mage Armor (saves spell known slot)', '+1 HP/level = sorcerer HP problem solved', '+CHA to one damage roll of chosen element at L6'],
    weaknesses: ['Locked to one element', '+CHA damage is one roll only', 'Less versatile than Clockwork/Aberrant'],
    playstyle: 'Dragon-blooded blaster. Pick fire (most spells), add CHA damage, be tankier than normal.',
  },
  {
    origin: 'Wild Magic',
    rating: 'B+',
    source: 'PHB',
    keyFeature: 'Wild Magic Surge: roll on random effect table after casting. Tides of Chaos: advantage on one roll (recharges on surge).',
    strengths: ['Tides of Chaos: free advantage', 'Bend Luck (L6): +/- 1d4 to any roll you see (2 SP)', 'Wild surges can be amazing'],
    weaknesses: ['Surges can be devastating (Fireball centered on self)', 'DM controls when surges trigger', 'Unreliable by design'],
    playstyle: 'Chaotic caster. Embrace randomness. Sometimes amazing, sometimes catastrophic.',
  },
  {
    origin: 'Storm Sorcery',
    rating: 'B',
    source: 'XGE',
    keyFeature: 'Tempestuous Magic: fly 10ft as BA after casting L1+ spell (no OA). Storm Guide: control weather.',
    strengths: ['Free BA fly 10ft = pseudo-disengage', 'Heart of the Storm: lightning/thunder damage to nearby enemies when casting', 'Thematic'],
    weaknesses: ['Heart of the Storm damage is tiny', 'Features don\'t synergize well', 'Outclassed significantly'],
    playstyle: 'Storm caster. Minor mobility. Minor AoE. Mostly flavor.',
  },
];

export const SORCERER_GENERAL_TIPS = [
  'Sorcery Points = Sorcerer level. Convert spell slots ↔ SP. Recover on long rest.',
  'Metamagic defines sorcerer. Best options: Quickened (S+), Twinned (S+), Subtle (S), Heightened (A+).',
  'Twinned Spell: target two creatures with single-target spells. Twin Haste = best buff. Twin Polymorph = two T-Rexes.',
  'Quickened Spell: cast a spell as BA, then cantrip as action. EB + Quickened EB = 4-8 beams in one turn.',
  'Subtle Spell: cast without verbal/somatic. Can\'t be Counterspelled. Cast in social situations secretly.',
  'Heightened Spell: impose disadvantage on first save. 3 SP. Use on save-or-suck spells (Hold Person, Banishment).',
  'Sorcerers know very few spells (15 at L20). Every spell choice matters. Pick versatile options.',
  'Font of Magic: convert slots to SP and back. Generally, convert high slots to SP only for metamagic, never the reverse.',
  'Flexible Casting math: 1st slot = 2 SP, 2nd = 3 SP, 3rd = 5 SP. Creating slots costs more SP than converting them gives.',
];

export const SORCERER_METAMAGIC_RANKED = [
  { metamagic: 'Quickened Spell', cost: '2 SP', effect: 'Cast 1 action spell as BA.', rating: 'S+', note: 'Cantrip + spell in one turn. Or two Eldritch Blasts (Sorlock).' },
  { metamagic: 'Twinned Spell', cost: 'Spell level SP', effect: 'Target two creatures with single-target spell.', rating: 'S+', note: 'Twin Haste, Twin Polymorph, Twin Greater Invisibility. Incredible value.' },
  { metamagic: 'Subtle Spell', cost: '1 SP', effect: 'No verbal or somatic components.', rating: 'S', note: 'Can\'t be Counterspelled. Cast in social situations without anyone knowing.' },
  { metamagic: 'Heightened Spell', cost: '3 SP', effect: 'One target has disadvantage on first save.', rating: 'A+', note: 'Expensive but guarantees save-or-suck lands. Combo with Portent.' },
  { metamagic: 'Careful Spell', cost: '1 SP', effect: 'CHA mod creatures auto-succeed on save.', rating: 'B+', note: 'Worse than Sculpt Spells (Evocation Wizard). They still take half damage.' },
  { metamagic: 'Empowered Spell', cost: '1 SP', effect: 'Reroll CHA mod damage dice.', rating: 'B', note: 'Small average increase. Can combine with other metamagics.' },
  { metamagic: 'Extended Spell', cost: '1 SP', effect: 'Double duration (max 24 hours).', rating: 'B', note: 'Niche. 8-hour Aid, 16-hour Mage Armor. Mostly downtime use.' },
  { metamagic: 'Transmuted Spell', cost: '1 SP', effect: 'Change damage type.', rating: 'B', note: 'Bypass resistance. Turn Fireball into thunder for Tempest Cleric multiclass.' },
  { metamagic: 'Seeking Spell', cost: '2 SP', effect: 'Reroll attack roll on miss.', rating: 'B', note: 'Niche. Only for attack roll spells.' },
  { metamagic: 'Distant Spell', cost: '1 SP', effect: 'Double range (touch → 30ft).', rating: 'C+', note: 'Rarely needed. Touch spells at 30ft is niche.' },
];
