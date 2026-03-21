/**
 * playerSorcererOptGuide.js
 * Player Mode: Sorcerer optimization — Metamagic, origins, builds
 * Pure JS — no React dependencies.
 */

export const SORCERER_CORE = {
  strengths: ['Metamagic: modify spells uniquely.', 'Font of Magic: convert slots ↔ sorcery points.', 'Fewer spells known = focused power.', 'CON save proficiency.'],
  weaknesses: ['Fewest spells known of any full caster.', 'Limited sorcery points. Run out fast.', 'No ritual casting.', 'No spellbook — can\'t learn new spells from scrolls.'],
  stats: 'CHA > CON > DEX. CHA is primary. CON for concentration + HP.',
  key: 'Metamagic is what makes you special. Without it, you\'re a worse Wizard.',
};

export const METAMAGIC_RANKINGS = [
  { meta: 'Quickened Spell', cost: 2, rating: 'S+', why: 'Cast a spell as BA. Then cantrip with action. Two spells per turn.', note: 'Quickened Fireball → EB with action. Devastating.' },
  { meta: 'Twinned Spell', cost: 'Spell level', rating: 'S+', why: 'Target two creatures with a single-target spell. Polymorph two allies.', note: 'Twin Haste: two allies buffed for one slot. Twin Banishment: remove two.' },
  { meta: 'Subtle Spell', cost: 1, rating: 'S', why: 'No verbal or somatic components. Can\'t be Counterspelled.', note: 'Counterspell-proof your spells. Cast in social situations undetected.' },
  { meta: 'Heightened Spell', cost: 3, rating: 'A+', why: 'Target has disadvantage on save. Expensive but ensures big spells land.', note: 'Use on save-or-suck spells: Banishment, Hold Monster, Polymorph.' },
  { meta: 'Careful Spell', cost: 1, rating: 'B+', why: 'Chosen creatures auto-succeed on save from your spell.', note: 'Fireball allies without damage? Almost — they auto-SAVE, still take half.' },
  { meta: 'Distant Spell', cost: 1, rating: 'B', why: 'Double range or make touch → 30ft.', note: 'Niche. Cure Wounds at 30ft is nice but situational.' },
  { meta: 'Extended Spell', cost: 1, rating: 'B', why: 'Double duration. Good for 1-hour buffs → 2 hours.', note: 'Extended Aid: 16 hours. Extended Polymorph: 2 hours.' },
  { meta: 'Empowered Spell', cost: 1, rating: 'B', why: 'Reroll CHA mod damage dice. Low-floor damage insurance.', note: 'Can use with other Metamagic. Empowered + Quickened.' },
  { meta: 'Transmuted Spell', cost: 1, rating: 'B', why: 'Change damage type. Fire → cold, etc.', note: 'Tasha\'s. Hit fire-immune with cold Fireball.' },
  { meta: 'Seeking Spell', cost: 2, rating: 'B+', why: 'Reroll a missed spell attack.', note: 'Tasha\'s. Good for important attack-roll spells.' },
];

export const ORIGIN_RANKINGS = [
  { origin: 'Clockwork Soul', rating: 'S+', why: 'Extra spells known (fixes Sorcerer\'s biggest weakness). Restore Balance: negate adv/disadv.', note: 'Tasha\'s. Best Sorcerer origin. Extra spells = flexibility.' },
  { origin: 'Aberrant Mind', rating: 'S+', why: 'Extra spells. Psionic Sorcery: cast with SP (no components). Telepathy.', note: 'Tasha\'s. Subtle casting built in. Extra spells fix the class.' },
  { origin: 'Divine Soul', rating: 'S', why: 'Access Cleric spell list + Sorcerer list. Favored by the Gods: +2d4 to failed save.', note: 'Twin Guiding Bolt. Twin Healing Word. Incredible versatility.' },
  { origin: 'Shadow Magic', rating: 'A+', why: 'Darkness + Devil\'s Sight equivalent. Strength of the Grave (cheat death). Hound of Ill Omen.', note: 'Darkness combo without Warlock. Shadow dog forces disadvantage on saves vs your spells.' },
  { origin: 'Draconic Bloodline', rating: 'A', why: '+CHA to element damage. Extra HP (13+level). Natural AC 13+DEX.', note: '+CHA to Fireball damage. Extra HP helps survivability. Simple.' },
  { origin: 'Storm Sorcery', rating: 'B+', why: 'Fly 10ft without OA after casting. Heart of the Storm: lightning/thunder damage aura.', note: 'Thematic but mechanically weaker. Short fly is decent.' },
  { origin: 'Wild Magic', rating: 'B (fun)', why: 'Random wild magic surges. Tides of Chaos: advantage, then DM triggers surge.', note: 'Fun but unreliable. Can be amazing or terrible. Table-dependent.' },
];

export const SORCERY_POINT_ECONOMY = {
  pool: 'Sorcery Points = Sorcerer level. Recover on long rest.',
  conversion: {
    slotToSP: 'Slot level = SP gained. L1 slot → 1 SP.',
    spToSlot: '2 SP → L1. 3 SP → L2. 5 SP → L3. 6 SP → L4. 7 SP → L5.',
    note: 'Creating slots costs MORE SP than you get from converting. Net loss.',
  },
  coffeelock: {
    what: 'Sorlock: convert Warlock Pact slots to SP on short rest. Repeat.',
    method: 'Short rest → Pact slots recover → convert to SP → create spell slots.',
    counter: 'Xanathar\'s: no long rest = CON saves or exhaustion.',
    note: 'Often table-banned. Check with DM.',
  },
  tips: [
    'SP are precious. Don\'t waste on slot conversion unless desperate.',
    'Metamagic is the primary SP use. Quickened + Twinned eat SP fast.',
    'Budget: 2-3 Metamagic uses per combat is realistic at mid levels.',
    'Aberrant Mind: spend SP to cast spells (no slots). Most SP-efficient origin.',
  ],
};

export const SORCERER_SPELL_PICKS = {
  mustHave: [
    'Shield (L1): +5 AC reaction.',
    'Absorb Elements (L1): halve elemental damage.',
    'Silvery Barbs (L1): force reroll.',
    'Web (L2): best L2 control.',
    'Counterspell (L3): negate spells.',
    'Fireball (L3): AoE damage standard.',
    'Polymorph (L4): Giant Ape or remove enemy.',
    'Synaptic Static (L5): 8d6 + debuff, no concentration.',
  ],
  avoid: [
    'Witch Bolt: trap spell. Never take it.',
    'True Strike: wastes your action. Terrible cantrip.',
    'Chromatic Orb: Magic Missile is usually better.',
    'Cloud of Daggers: too small an area.',
  ],
};

export const SORCERER_BUILD_TIPS = [
  'Clockwork Soul or Aberrant Mind: extra spells fix Sorcerer\'s biggest weakness.',
  'Quickened + Twinned: your core Metamagic picks. Take both.',
  'Subtle Spell: Counterspell-proof your spells. Incredible in social situations.',
  'Twinned Haste: buff two allies with one slot. Game-changing.',
  'Divine Soul: access the entire Cleric spell list. Twin Healing Word.',
  'CHA > CON > DEX. Max CHA by L8.',
  'Don\'t take too many damage spells. Control wins more fights.',
  'Sorlock multiclass: short rest SP engine. Very powerful.',
  'You know few spells. Make every pick count. No niche options.',
  'Heightened Spell on save-or-suck: disadvantage on the save ensures it lands.',
];
