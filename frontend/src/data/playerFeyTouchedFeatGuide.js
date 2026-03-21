/**
 * playerFeyTouchedFeatGuide.js
 * Player Mode: Fey Touched — best half-feat in the game
 * Pure JS — no React dependencies.
 */

export const FEY_TOUCHED_BASICS = {
  feat: 'Fey Touched',
  source: "Tasha's Cauldron of Everything",
  type: 'Half-feat (+1 INT, WIS, or CHA)',
  benefits: [
    '+1 to INT, WIS, or CHA.',
    'Learn Misty Step (free cast 1/LR, also castable with spell slots).',
    'Learn one L1 divination or enchantment spell (free cast 1/LR, also castable with slots).',
  ],
  note: 'Best half-feat in the game. Misty Step is an incredible spell. The bonus L1 spell is gravy. Rounds odd mental stats.',
};

export const BEST_L1_SPELL_PICKS = [
  { spell: 'Bless', school: 'Enchantment', rating: 'S', reason: '+1d4 to attacks AND saves for 3 targets. Best buff in the game. Non-Cleric access.' },
  { spell: 'Gift of Alacrity', school: 'Divination', rating: 'S', reason: '+1d8 initiative for 8 hours. Huge. Normally Dunamancy-only (DM approval needed).' },
  { spell: 'Hex', school: 'Enchantment', rating: 'A', reason: '+1d6 necrotic per hit. For Warlocks who want it without spending a known spell.' },
  { spell: 'Hunter\'s Mark', school: 'Divination', rating: 'A', reason: '+1d6 per hit. For non-Rangers wanting martial damage boost.' },
  { spell: 'Command', school: 'Enchantment', rating: 'A', reason: 'Versatile single-target control. Flee, Grovel, Drop, Halt.' },
  { spell: 'Silvery Barbs', school: 'Enchantment', rating: 'S', reason: 'Force reroll on enemy success + give advantage to ally. Broken if available (DM may ban).' },
  { spell: 'Heroism', school: 'Enchantment', rating: 'B', reason: 'Temp HP each turn + immunity to frightened. Good for frontliners.' },
  { spell: 'Detect Magic', school: 'Divination', rating: 'B', reason: 'Always useful utility. Free cast 1/LR is nice but you can ritual cast this anyway.' },
];

export const FEY_TOUCHED_CLASS_VALUE = [
  { class: 'Paladin', rating: 'S', reason: '+1 CHA rounds odd score. Misty Step not on Paladin list. Bless stacks with Paladin Aura.' },
  { class: 'Cleric', rating: 'S', reason: '+1 WIS. Misty Step for emergency escape. Bless is already on list (pick something else).' },
  { class: 'Sorcerer', rating: 'S', reason: '+1 CHA. Free Misty Step saves a known spell. Bless access is incredible.' },
  { class: 'Warlock', rating: 'A', reason: '+1 CHA. Free Misty Step + free L1 spell = slot conservation. Warlocks need slot efficiency.' },
  { class: 'Wizard', rating: 'A', reason: '+1 INT. Misty Step may already be on your list but free cast saves slots.' },
  { class: 'Fighter/Barbarian', rating: 'A', reason: 'Misty Step on a martial is huge. Teleport in/out of danger. Bless for party support.' },
  { class: 'Druid', rating: 'A', reason: '+1 WIS. Misty Step not on Druid list. Teleportation for a class that lacks it.' },
  { class: 'Rogue', rating: 'B', reason: 'Misty Step for escape. But competes with Cunning Action: Disengage. Still good.' },
];

export const MISTY_STEP_VALUE = {
  spell: 'Misty Step',
  level: 2,
  castTime: '1 bonus action',
  range: '30ft teleport (self)',
  uses: [
    'Escape grapples (teleport breaks grapple).',
    'Cross gaps, chasms, locked doors.',
    'Reposition in combat without OA.',
    'Escape from dangerous effects (Web, Entangle, etc.).',
    'Reach elevated positions.',
  ],
  note: 'One of the best spells in the game. BA teleportation solves so many problems. Free cast 1/LR via Fey Touched.',
};
