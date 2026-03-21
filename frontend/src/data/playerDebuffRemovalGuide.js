/**
 * playerDebuffRemovalGuide.js
 * Player Mode: Removing debuffs, curses, and negative conditions — methods and priority
 * Pure JS — no React dependencies.
 */

export const CONDITION_REMOVAL_SPELLS = [
  { spell: 'Lesser Restoration', level: 2, removes: ['Blinded', 'Deafened', 'Paralyzed', 'Poisoned', 'One disease'], rating: 'S+', note: 'Must-prepare. Covers most common conditions.' },
  { spell: 'Greater Restoration', level: 5, removes: ['Charmed', 'Petrified', 'Curse', 'Ability score reduction', 'HP max reduction', 'One exhaustion level'], rating: 'S+', note: 'Handles everything Lesser can\'t. 100 gp diamond.' },
  { spell: 'Remove Curse', level: 3, removes: ['All curses on target', 'Cursed item detachment'], rating: 'S', note: 'Removes curse but not the item\'s curse permanently.' },
  { spell: 'Dispel Magic', level: 3, removes: ['Any spell effect (L3 auto, higher = check)'], rating: 'S+', note: 'Ends ongoing spell effects on target.' },
  { spell: 'Protection from Evil and Good', level: 1, removes: ['Prevents charm/frighten from specific types', 'Advantage on saves to end existing'], rating: 'A+', note: 'Aberrations, celestials, elementals, fey, fiends, undead.' },
  { spell: 'Calm Emotions', level: 2, removes: ['Charmed', 'Frightened (suppresses)'], rating: 'A', note: 'Suppresses, doesn\'t end. Concentration.' },
  { spell: 'Heal', level: 6, removes: ['Blinded', 'Deafened', 'Any disease'], rating: 'S', note: '70 HP + cures blindness/deafness/disease.' },
];

export const CONDITION_TO_CURE = {
  blinded: ['Lesser Restoration', 'Heal', 'Greater Restoration'],
  charmed: ['Greater Restoration', 'Calm Emotions (suppress)', 'Dispel Magic (if spell-caused)'],
  deafened: ['Lesser Restoration', 'Heal'],
  frightened: ['Calm Emotions (suppress)', 'Heroism (immune)', 'Greater Restoration'],
  paralyzed: ['Lesser Restoration', 'Greater Restoration'],
  petrified: ['Greater Restoration'],
  poisoned: ['Lesser Restoration', 'Protection from Poison', 'Lay on Hands (5 HP)'],
  stunned: ['Wait (usually 1 turn)', 'No spell cure mid-effect'],
  exhaustion: ['Greater Restoration (1 level)', 'Long rest (1 level)', 'Potion of Vitality (all)'],
  cursed: ['Remove Curse', 'Greater Restoration'],
  diseased: ['Lesser Restoration', 'Heal', 'Paladin Lay on Hands (5 HP)'],
};

export const PALADIN_CLEANSING = {
  layOnHands: '5 HP from pool to cure one disease or neutralize one poison.',
  cleansingTouch: 'L14 Paladin: Action to end one spell on willing creature. CHA mod uses/LR.',
  auraOfPurity: 'L4 spell: immune to disease. Advantage vs conditions. 30ft aura.',
  note: 'Paladin is the best debuff cleanser in the game.',
};

export const DEBUFF_PRIORITY = [
  { condition: 'Paralyzed', urgency: 'IMMEDIATE', reason: 'Auto-crit in 5ft. Likely dead in 1 round.' },
  { condition: 'Stunned', urgency: 'IMMEDIATE', reason: 'Can\'t act. Auto-advantage attacks. Very dangerous.' },
  { condition: 'Petrified', urgency: 'HIGH', reason: 'Effectively dead. Only Greater Restoration fixes.' },
  { condition: 'Charmed (by enemy)', urgency: 'HIGH', reason: 'Fighting for wrong side. Ally becomes threat.' },
  { condition: 'Exhaustion (3+)', urgency: 'HIGH', reason: 'Disadvantage on attacks/saves. 6 = death.' },
  { condition: 'Blinded', urgency: 'MEDIUM', reason: 'Disadvantage attacks. Advantage against you.' },
  { condition: 'Frightened', urgency: 'MEDIUM', reason: 'Disadvantage + can\'t move closer. Limits positioning.' },
  { condition: 'Poisoned', urgency: 'MEDIUM', reason: 'Disadvantage attacks + ability checks.' },
  { condition: 'Deafened', urgency: 'LOW', reason: 'Minor impact. Can\'t hear but can still act normally.' },
];

export const DEBUFF_TIPS = [
  'Lesser Restoration: always prepare. Covers most common conditions.',
  'Greater Restoration: 100 gp diamond. Carry spares.',
  'Paladin Lay on Hands: 5 HP cures disease or poison. Very efficient.',
  'Paralyzed = auto-crit. Cure IMMEDIATELY or ally dies.',
  'Remove Curse: frees from cursed items. Always have access.',
  'Dispel Magic: ends spell-caused conditions. Check DC for higher levels.',
  'Calm Emotions: suppresses charm/frighten. Buys time.',
  'Exhaustion: only Greater Restoration or long rest removes it.',
  'Prevention > cure. Bless, Protection from Evil, Aura of Protection.',
  'Potion of Vitality: removes ALL exhaustion. Rare but save it.',
];
