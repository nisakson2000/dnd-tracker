/**
 * playerGenieWarlockGuide.js
 * Player Mode: Genie Warlock — the wish granter
 * Pure JS — no React dependencies.
 */

export const GENIE_BASICS = {
  class: 'Warlock (The Genie)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Genie patron. Extra damage, flight, and eventually Limited Wish.',
  note: 'Strongest Warlock patron for sustained damage. Genie\'s Wrath adds PB to damage once per turn. Bottled Respite is unique utility.',
};

export const GENIE_FEATURES = [
  { feature: 'Genie\'s Vessel', level: 1, effect: 'Tiny object as spellcasting focus. Bottled Respite: enter the vessel as an action (extradimensional space, 20ft cylinder). Stay for 2× Warlock level hours. Genie\'s Wrath: on hit, add PB extra damage of your genie type.', note: 'PB extra damage on first hit per turn = +2 to +6. Bottled Respite = portable safe room.' },
  { feature: 'Elemental Gift', level: 6, effect: 'Resistance to genie\'s damage type. Bonus action: fly speed 30ft for 10 min. PB times/long rest.', note: 'Elemental resistance + PB uses of flight per day. Both excellent.' },
  { feature: 'Sanctuary Vessel', level: 10, effect: 'When you enter your vessel, up to 5 willing creatures can join. Everyone inside benefits from a short rest in 10 minutes.', note: 'Party-wide 10-minute short rest inside your bottle. Incredible action economy for adventuring days.' },
  { feature: 'Limited Wish', level: 14, effect: 'Once per 1d4 long rests: cast any 6th-level or lower spell from any class list. No material components.', note: 'ANY SPELL. Any class. 6th level or lower. Heal, Contingency, Globe of Invulnerability, Eyebite, you name it.' },
];

export const GENIE_TYPES = [
  { genie: 'Dao (Earth)', element: 'Bludgeoning', resistance: 'Bludgeoning', note: 'Bludgeoning is the most common physical damage type. Best resistance.', rating: 'A' },
  { genie: 'Djinni (Air)', element: 'Thunder', resistance: 'Thunder', note: 'Thunder is uncommon. But access to Wind Wall and Greater Invisibility spells.', rating: 'A' },
  { genie: 'Efreeti (Fire)', element: 'Fire', resistance: 'Fire', note: 'Fire is the most common elemental damage. Good resistance. Fire damage spells.', rating: 'S' },
  { genie: 'Marid (Water)', element: 'Cold', resistance: 'Cold', note: 'Cold is decent. Sleet Storm and Cone of Cold access.', rating: 'A' },
];

export const GENIE_TACTICS = [
  { tactic: 'EB + Genie\'s Wrath', detail: 'Eldritch Blast + PB extra damage on first hit. At L5: EB beam hits for 1d10+CHA+PB. With Agonizing Blast: 1d10+5+3.', rating: 'S', note: 'Free extra damage every turn. No resource cost.' },
  { tactic: 'Spike Growth + Repelling Blast + Genie\'s Wrath', detail: 'Spike Growth. EB pushes enemies through it. Genie\'s Wrath adds to first hit. Massive damage.', rating: 'S' },
  { tactic: 'Bottled Respite escape', detail: 'About to die? Enter your vessel. You\'re in an extradimensional space. Enemies can\'t follow.', rating: 'A' },
  { tactic: '10-min short rest', detail: 'L10: entire party short rests in 10 minutes inside your vessel. Between encounters: quick recovery.', rating: 'S' },
  { tactic: 'Limited Wish versatility', detail: 'L14: any 6th-level or lower spell from ANY list. Heal (Cleric), Find Greater Steed (Paladin), Contingency (Wizard). Whatever you need.', rating: 'S' },
];

export const GENIE_VS_FIEND = {
  genie: { pros: ['PB extra damage/turn (free)', 'Flight (PB/LR)', 'Safe room (vessel)', '10-min party short rest', 'Limited Wish (any spell)'], cons: ['Less burst than Hurl Through Hell', 'Vessel can be destroyed', 'Element locked to genie type'] },
  fiend: { pros: ['Dark One\'s Blessing (temp HP on kill)', 'Hurl Through Hell (10d10 at L14)', 'Fire damage spells'], cons: ['No extra damage/turn', 'No flight', 'No safe room', 'No Limited Wish'] },
  verdict: 'Genie for sustained damage + utility. Fiend for temp HP + burst. Genie is generally stronger.',
};

export function geniesWrathDamage(proficiencyBonus) {
  return proficiencyBonus; // Extra damage once per turn
}

export function bottledRespiteDuration(warlockLevel) {
  return warlockLevel * 2; // Hours
}

export function elementalGiftFlightUses(proficiencyBonus) {
  return proficiencyBonus;
}
