/**
 * playerArtificerInfusions.js
 * Player Mode: Artificer infusion guide, best picks, and party optimization
 * Pure JS — no React dependencies.
 */

export const INFUSION_RULES = {
  known: 'Learn 4 at level 2, increasing to 12 by level 18.',
  active: 'Can infuse 2 items at level 2, up to 6 by level 18.',
  duration: 'Infusions last until you die or infuse a new item (replacing the oldest).',
  sharing: 'Infused items can be given to ANY party member. Share the magic.',
  stacking: 'An item can only bear one infusion. Can\'t stack multiple infusions on one item.',
  replacement: 'On level up, you can swap one known infusion for another.',
  attunement: 'Some infusions require attunement. Artificers can attune to 4 items at level 14 (vs normal 3).',
};

export const TOP_INFUSIONS = [
  { infusion: 'Enhanced Arcane Focus', level: 2, attunement: true, effect: '+1 to spell attacks and ignore half cover. +2 at level 10.', rating: 'S', bestFor: 'Self (Artillerist, Alchemist)', note: 'Better hit rate on all spell attacks. Great for cantrip-focused builds.' },
  { infusion: 'Enhanced Defense', level: 2, attunement: true, effect: '+1 AC to armor or shield. +2 at level 10.', rating: 'S', bestFor: 'Tank, any frontliner', note: '+1 shield for the Paladin or +1 armor for the Fighter. Always useful.' },
  { infusion: 'Enhanced Weapon', level: 2, attunement: true, effect: '+1 to attack and damage rolls. +2 at level 10.', rating: 'S', bestFor: 'Any martial', note: 'Give the Fighter a +1 weapon at level 2. Huge boost at low levels.' },
  { infusion: 'Bag of Holding', level: 2, attunement: false, effect: 'Create a Bag of Holding', rating: 'S', bestFor: 'Party', note: 'No attunement. Party-wide utility. Solves inventory for everyone.' },
  { infusion: 'Homunculus Servant', level: 2, attunement: true, effect: 'Create a tiny construct companion. Bonus action to command. Force Ballista ranged attack.', rating: 'A', bestFor: 'Self', note: 'Extra bonus action attack. Scales with proficiency. Decent scout.' },
  { infusion: 'Repeating Shot', level: 2, attunement: true, effect: '+1 weapon, ignore loading, create own ammo.', rating: 'A', bestFor: 'Crossbow user', note: 'Fixes hand crossbow for Crossbow Expert builds. Also works with any firearm.' },
  { infusion: 'Returning Weapon', level: 2, attunement: true, effect: '+1 thrown weapon, returns after each throw.', rating: 'B', bestFor: 'Thrown weapon build', note: 'Fixes thrown weapon logistics. Niche but solves a real problem.' },
  { infusion: 'Boots of the Winding Path', level: 6, attunement: true, effect: 'Bonus action: teleport 15ft to a space you occupied in the last round.', rating: 'A', bestFor: 'Melee or caster needing escape', note: 'Free disengage alternative. Step in, attack, teleport back.' },
  { infusion: 'Armor of Magical Strength', level: 2, attunement: true, effect: 'Add INT to STR checks/saves. Use reaction to prevent prone (INT mod times/day).', rating: 'A', bestFor: 'Low-STR character', note: 'INT-based STR. Great for Artificers who dump STR.' },
  { infusion: 'Cloak of Protection', level: 2, attunement: true, effect: '+1 to AC and saving throws.', rating: 'A', bestFor: 'Anyone', note: '+1 AC AND +1 to all saves. Broadly powerful.' },
  { infusion: 'Winged Boots', level: 10, attunement: true, effect: 'Flying speed equal to walking speed for 4 hours/day.', rating: 'S', bestFor: 'Anyone', note: 'Flight is game-changing. Give to caster for safety or melee for positioning.' },
  { infusion: 'Helm of Awareness', level: 10, attunement: true, effect: 'Advantage on initiative rolls. Can\'t be surprised.', rating: 'A', bestFor: 'Party point person', note: 'Alert feat as an item. Give to the character who needs to act first.' },
];

export const PARTY_DISTRIBUTION = {
  principle: 'Artificer\'s power comes from buffing the PARTY. Infusions are best when shared.',
  suggestions: [
    { partyMember: 'Fighter/Barbarian', infusion: 'Enhanced Weapon or Enhanced Defense', reason: 'They attack the most or take the most hits.' },
    { partyMember: 'Paladin', infusion: 'Enhanced Defense (shield)', reason: '+1 shield stacks with their already high AC.' },
    { partyMember: 'Rogue', infusion: 'Cloak of Protection or Boots of the Winding Path', reason: 'Saves and escape options for the squishier martial.' },
    { partyMember: 'Wizard/Sorcerer', infusion: 'Cloak of Protection or Enhanced Arcane Focus', reason: 'Saves and spell accuracy for the glass cannon.' },
    { partyMember: 'Entire Party', infusion: 'Bag of Holding', reason: 'Everyone benefits. No attunement needed.' },
  ],
};

export function getInfusionsForLevel(artificerLevel) {
  return TOP_INFUSIONS.filter(i => artificerLevel >= i.level);
}

export function getInfusionSlots(artificerLevel) {
  if (artificerLevel >= 18) return { known: 12, active: 6 };
  if (artificerLevel >= 14) return { known: 10, active: 5 };
  if (artificerLevel >= 10) return { known: 8, active: 5 };
  if (artificerLevel >= 6) return { known: 6, active: 3 };
  if (artificerLevel >= 2) return { known: 4, active: 2 };
  return { known: 0, active: 0 };
}

export function suggestInfusions(partyComposition, artificerLevel) {
  const available = getInfusionsForLevel(artificerLevel);
  const slots = getInfusionSlots(artificerLevel);
  return { available, activeSlots: slots.active, knownSlots: slots.known };
}
