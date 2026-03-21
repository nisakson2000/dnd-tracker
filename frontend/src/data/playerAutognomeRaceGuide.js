/**
 * playerAutognomeRaceGuide.js
 * Player Mode: Autognome — mechanical gnome construct
 * Pure JS — no React dependencies.
 */

export const AUTOGNOME_BASICS = {
  race: 'Autognome',
  source: 'Spelljammer: Adventures in Space',
  size: 'Small',
  speed: '30 feet',
  type: 'Construct (not Humanoid)',
  traits: [
    { name: 'Armored Casing', desc: 'Base AC = 13 + DEX modifier (no armor needed).' },
    { name: 'Built for Success', desc: 'Add 1d4 to a failed attack roll, ability check, or saving throw. PB uses per LR.' },
    { name: 'Healing Machine', desc: 'Mending cantrip can stabilize you at 0 HP. Also affected by Cure Wounds and similar.' },
    { name: 'Mechanical Nature', desc: 'Advantage on saves vs paralyzed, poisoned, and being put to sleep. Don\'t need to eat, drink, or breathe.' },
    { name: 'Sentry\'s Rest', desc: '6 hours of inactivity for a long rest (conscious, can see and hear normally).' },
    { name: 'Specialized Design', desc: 'Two tool proficiencies of your choice.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (flexible)',
  note: 'Construct type avoids Hold/Charm/Dominate Person. AC 13+DEX is great. Built for Success is mini-Lucky.',
};

export const AUTOGNOME_AC_ANALYSIS = {
  formula: '13 + DEX modifier',
  comparison: [
    { dex: 14, autognomeAC: 15, mageArmorAC: 15, studdedLeatherAC: 14, note: 'Matches Mage Armor. Beats studded leather.' },
    { dex: 16, autognomeAC: 16, mageArmorAC: 16, studdedLeatherAC: 15, note: 'Still matches Mage Armor. No spell slot needed.' },
    { dex: 20, autognomeAC: 18, mageArmorAC: 18, studdedLeatherAC: 17, note: 'AC 18 without any armor or spells.' },
  ],
  note: 'Better than Mage Armor (no concentration, no slot, no casting needed). Free Mage Armor+1 forever.',
};

export const CONSTRUCT_TYPE_BENEFITS = [
  { spell: 'Hold Person', effect: 'Targets humanoids only. Autognome is Construct. Immune.' },
  { spell: 'Charm Person', effect: 'Targets humanoids only. Immune.' },
  { spell: 'Dominate Person', effect: 'Targets humanoids only. Immune.' },
  { spell: 'Crown of Madness', effect: 'Targets humanoids only. Immune.' },
  { benefit: 'No food/water/air', effect: 'Don\'t need to eat, drink, or breathe. Underwater, vacuum, no food = no problem.' },
  { benefit: 'Conscious rest', effect: 'Aware during long rest. Can keep watch without penalty.' },
  { downside: 'Anti-construct effects', effect: 'Some effects target constructs. Rare but possible.' },
];

export const AUTOGNOME_CLASS_SYNERGY = [
  { class: 'Wizard', rating: 'S', reason: 'AC 13+DEX (free Mage Armor+1). Construct type dodges Hold/Charm Person. Built for Success helps saves.' },
  { class: 'Sorcerer', rating: 'S', reason: 'Same as Wizard. Saves a known spell (Mage Armor). Built for Success on concentration saves.' },
  { class: 'Artificer', rating: 'S', reason: 'Thematic perfection. Good AC. Tool proficiencies stack. Construct creator is a construct.' },
  { class: 'Rogue', rating: 'A', reason: 'AC 13+DEX matches studded leather+1. Built for Success on failed ability checks. Two tool proficiencies.' },
  { class: 'Warlock', rating: 'A', reason: 'Free AC. Construct immunities. Built for Success on saves. No need for Armor of Shadows invocation.' },
  { class: 'Fighter', rating: 'C', reason: 'Heavy armor is better. Autognome AC caps lower. Small size = no Heavy weapons.' },
];

export function builtForSuccessValue(profBonus) {
  return { uses: profBonus, avgBonus: 2.5, note: `Built for Success: ${profBonus} uses/LR, adds 1d4 (avg 2.5) to failed d20 rolls.` };
}
