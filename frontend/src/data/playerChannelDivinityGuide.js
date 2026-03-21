/**
 * playerChannelDivinityGuide.js
 * Player Mode: Channel Divinity options by subclass, when to use them, and optimization
 * Pure JS — no React dependencies.
 */

export const CHANNEL_DIVINITY_BASICS = {
  uses: '1 use per short/long rest (2 at Cleric 6, 3 at Cleric 18). Paladin: 1 per rest (all levels).',
  action: 'Usually an action unless stated otherwise.',
  recharge: 'Short rest. Use it every fight — it comes back quickly.',
  note: 'One of the most commonly forgotten features. USE IT.',
};

export const CLERIC_CD_OPTIONS = [
  { subclass: 'Life', cd: 'Preserve Life', effect: 'Heal up to 5× cleric level HP, split among creatures within 30ft. Can\'t heal above half HP.', rating: 'S', when: 'Multiple allies below half HP. Mass emergency heal.' },
  { subclass: 'Light', cd: 'Radiance of the Dawn', effect: 'Each hostile within 30ft: CON save or 2d10+level radiant. Dispels magical darkness.', rating: 'A', when: 'Surrounded by enemies. Also clears magical darkness.' },
  { subclass: 'Tempest', cd: 'Destructive Wrath', effect: 'Max damage on lightning or thunder spell. No action — apply when you deal that damage.', rating: 'S', when: 'MAX a Call Lightning or Shatter. Guaranteed huge damage.' },
  { subclass: 'War', cd: 'Guided Strike', effect: '+10 to one attack roll. No action — use after you see the roll.', rating: 'S', when: 'Must-hit moment. Turn a miss into a hit. Great for Inflict Wounds.' },
  { subclass: 'Knowledge', cd: 'Knowledge of the Ages', effect: 'Proficiency in any skill or tool for 10 minutes.', rating: 'B', when: 'Need a specific skill check you don\'t have.' },
  { subclass: 'Trickery', cd: 'Invoke Duplicity', effect: 'Illusory duplicate within 30ft. Cast spells from its space. Advantage when you and it are within 5ft of target.', rating: 'A', when: 'Deliver touch spells at range. Advantage on attacks near the clone.' },
  { subclass: 'Forge', cd: 'Artisan\'s Blessing', effect: 'Create a metal object worth ≤100 gp. 1 hour ritual.', rating: 'B', when: 'Need specific equipment. Create 100 gp of metal items from raw material.' },
  { subclass: 'Grave', cd: 'Path to the Grave', effect: 'Next attack against target deals DOUBLE damage. Action.', rating: 'S', when: 'Before Paladin Smite or Rogue Sneak Attack. Double a massive hit.' },
  { subclass: 'Twilight', cd: 'Twilight Sanctuary', effect: '1d6+level temp HP to allies ending turn in 30ft sphere. Or end charm/frighten. 1 minute.', rating: 'S', when: 'Start of every combat. Passive temp HP for the whole party for 10 rounds.' },
  { subclass: 'Order', cd: 'Order\'s Demand', effect: 'Each creature within 30ft: WIS save or charmed until end of your next turn + drop held items.', rating: 'A', when: 'Crowd control. Disarm and freeze multiple enemies.' },
  { subclass: 'Peace', cd: 'Balm of Peace', effect: 'Move up to speed without OAs. Heal 2d6+WIS to each creature you move within 5ft of.', rating: 'S', when: 'Run through the party healing everyone. Mobile mass heal.' },
];

export const PALADIN_CD_OPTIONS = [
  { subclass: 'Devotion', cd: 'Sacred Weapon', effect: '+CHA to attack rolls for 1 minute. Weapon emits bright light.', rating: 'A', when: 'Boss fights. +3 to +5 to hit for 10 rounds is massive.' },
  { subclass: 'Vengeance', cd: 'Vow of Enmity', effect: 'Advantage on attacks against one creature for 1 minute. Bonus action.', rating: 'S', when: 'Every boss fight. Free advantage = more crits = more Smites.' },
  { subclass: 'Ancients', cd: 'Nature\'s Wrath', effect: 'Restrain a creature (STR/DEX save). Repeat save at end of each turn.', rating: 'B', when: 'Restrain a melee enemy. They\'re stuck and attacks have advantage.' },
  { subclass: 'Conquest', cd: 'Conquering Presence', effect: 'Each creature within 30ft: WIS save or frightened for 1 minute.', rating: 'S', when: 'Conquest aura + frightened = speed 0 + psychic damage. Devastating combo.' },
  { subclass: 'Redemption', cd: 'Emissary of Peace', effect: '+5 to Persuasion checks for 10 minutes.', rating: 'B', when: 'Before any social encounter. +5 is huge for Persuasion.' },
  { subclass: 'Crown', cd: 'Champion Challenge', effect: 'Each creature within 30ft can\'t move more than 30ft from you (WIS save).', rating: 'A', when: 'Lock down enemies near you. Protect the back line.' },
  { subclass: 'Glory', cd: 'Peerless Athlete', effect: 'Advantage on Athletics and Acrobatics. +10 to jump distance. 10 minutes.', rating: 'B', when: 'Before a grapple contest or athletic challenge.' },
  { subclass: 'Watchers', cd: 'Watcher\'s Will', effect: 'Advantage on INT/WIS/CHA saves for up to allies equal to CHA mod. 1 minute.', rating: 'A', when: 'Fighting spellcasters or creatures with mental saves.' },
];

export const ALL_TURN_UNDEAD = {
  effect: 'Each undead within 30ft: WIS save or turned for 1 minute (flee, can\'t take actions).',
  destroyUndead: 'At Cleric 5+, undead below certain CR are instantly destroyed (no save).',
  destroyThresholds: [
    { level: 5, cr: '1/2' },
    { level: 8, cr: 1 },
    { level: 11, cr: 2 },
    { level: 14, cr: 3 },
    { level: 17, cr: 4 },
  ],
  note: 'Against hordes of low-CR undead, this instantly clears the field.',
};

export function destroyUndeadCR(clericLevel) {
  if (clericLevel >= 17) return 4;
  if (clericLevel >= 14) return 3;
  if (clericLevel >= 11) return 2;
  if (clericLevel >= 8) return 1;
  if (clericLevel >= 5) return 0.5;
  return 0;
}

export function twilightTempHP(clericLevel) {
  return 3.5 + clericLevel; // 1d6 avg + level
}
