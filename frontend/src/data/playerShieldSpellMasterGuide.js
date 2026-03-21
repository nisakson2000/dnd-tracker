/**
 * playerShieldSpellMasterGuide.js
 * Player Mode: Shield spell — the best reaction in the game
 * Pure JS — no React dependencies.
 */

export const SHIELD_BASICS = {
  spell: 'Shield',
  level: 1,
  school: 'Abjuration',
  castTime: '1 reaction (when hit by attack or targeted by Magic Missile)',
  duration: '1 round (until start of your next turn)',
  classes: ['Wizard', 'Sorcerer'],
  effect: '+5 AC until start of your next turn. Blocks Magic Missile completely.',
  note: 'The single best defensive spell in the game. +5 AC as a reaction is absurd. Always prepare this.',
};

export const SHIELD_AC_EXAMPLES = [
  { base: 'Wizard (Mage Armor 13 + DEX 2)', normalAC: 15, shieldedAC: 20, note: 'Goes from hittable to tank-level.' },
  { base: 'Sorcerer (Draconic 13 + DEX 2)', normalAC: 15, shieldedAC: 20, note: 'Same as Mage Armor baseline.' },
  { base: 'Eldritch Knight (Chain 16 + Shield 2)', normalAC: 18, shieldedAC: 23, note: 'Nearly unhittable at low levels.' },
  { base: 'Hexblade (Half Plate 15 + Shield 2 + DEX 2)', normalAC: 19, shieldedAC: 24, note: 'Best AC in the game with Shield.' },
  { base: 'Bladesinger (Mage Armor 13 + DEX 5 + INT 5)', normalAC: 23, shieldedAC: 28, note: 'AC 28. Nothing hits you.' },
];

export const SHIELD_SLOT_MANAGEMENT = {
  lowLevels: 'L1-4: You have 2-4 L1 slots. Shield uses them fast. Save for big hits only.',
  midLevels: 'L5-10: More slots available. Use Shield more freely but track usage.',
  highLevels: 'L11+: L1 slots are cheap. Shield whenever needed.',
  rule: 'Only Shield when the +5 AC would change a hit to a miss. If they rolled a 25, don\'t waste a slot.',
  tip: 'Ask the DM "does a X hit?" before deciding to Shield. Many DMs announce attack rolls.',
};

export const SHIELD_ACCESS = [
  { method: 'Wizard/Sorcerer class', cost: 'Free (class spell list)', note: 'Always prepare Shield. No exceptions.' },
  { method: 'Eldritch Knight (Fighter)', cost: 'Subclass', note: 'Abjuration spell. Available from L3.' },
  { method: 'Arcane Trickster (Rogue)', cost: 'Subclass', note: 'Not on default schools. Available via "any school" picks at L8+.' },
  { method: 'Hexblade Warlock', cost: 'Subclass', note: 'On Hexblade expanded list. Uses Warlock slots (recover on SR).' },
  { method: 'Magic Initiate (Wizard)', cost: 'Feat', note: 'Once per LR without slot. Good for non-casters.' },
  { method: 'Multiclass 1 Wizard', cost: '1 level', note: 'Get Shield + Find Familiar + Absorb Elements. Best 1-level dip.' },
];

export const SHIELD_VS_ABSORB = {
  shield: { trigger: 'Hit by attack', bonus: '+5 AC', duration: '1 round', best: 'Against multiple attacks (stays up)' },
  absorbElements: { trigger: 'Take elemental damage', bonus: 'Resistance to triggering element', duration: 'Until start of next turn', best: 'Against breath weapons, fireballs' },
  verdict: 'Both are S-tier. Prepare both always. Shield for attacks, Absorb Elements for saves/AoE.',
};

export function shieldWorthIt(attackRoll, currentAC) {
  const wouldHit = attackRoll >= currentAC;
  const wouldMiss = attackRoll < currentAC + 5;
  if (!wouldHit) return { useShield: false, reason: 'Attack already misses. Save the slot.' };
  if (wouldHit && wouldMiss) return { useShield: true, reason: `Attack ${attackRoll} hits AC ${currentAC} but misses AC ${currentAC + 5}. Shield turns hit into miss.` };
  return { useShield: false, reason: `Attack ${attackRoll} hits even AC ${currentAC + 5}. Shield won't help. Save the slot.` };
}
