/**
 * playerTeleportationSpellsGuide.js
 * Player Mode: Teleportation spells compared and ranked
 * Pure JS — no React dependencies.
 */

export const TELEPORTATION_SPELLS = [
  { spell: 'Misty Step', level: 2, range: '30ft', castTime: 'Bonus action', note: 'Best low-level teleport. Bonus action = still attack. Escape grapples, cross gaps, reposition.', rating: 'S' },
  { spell: 'Thunder Step', level: 3, range: '90ft', castTime: 'Action', note: 'Teleport 90ft + 3d10 thunder to creatures near departure point. Can bring a willing creature. More range but action cost.', rating: 'A' },
  { spell: 'Dimension Door', level: 4, range: '500ft', castTime: 'Action', note: '500ft range. Can bring one willing Medium creature. Describe destination or state direction/distance. Doesn\'t need line of sight.', rating: 'S' },
  { spell: 'Far Step', level: 5, range: '60ft/turn', castTime: 'Bonus action', note: 'Concentration, 1 min. Bonus action 60ft teleport EVERY TURN. 10 rounds × 60ft = 600ft total teleportation.', rating: 'A' },
  { spell: 'Teleport', level: 7, range: 'Global', castTime: 'Action', note: 'Teleport to any location on the same plane. Familiarity determines accuracy. Can bring 8 creatures.', rating: 'S' },
  { spell: 'Plane Shift', level: 7, range: 'Touch', castTime: 'Action', note: 'Travel to another plane. Or CHA save to banish a creature. Requires tuning fork for destination plane.', rating: 'A' },
  { spell: 'Teleportation Circle', level: 5, range: '10ft', castTime: '1 minute', note: 'Creates circle linked to a permanent circle you know. Guaranteed accuracy. Requires knowing the sigil sequence.', rating: 'A' },
  { spell: 'Word of Recall', level: 6, range: 'Sanctuary', castTime: 'Action', note: 'Teleport up to 5 willing creatures to your prepared sanctuary. No mishap. Cleric only.', rating: 'A' },
  { spell: 'Transport via Plants', level: 6, range: 'Special', castTime: 'Action', note: 'Step into one plant, emerge from another you\'ve seen on the same plane. Druids only. Creative usage.', rating: 'A' },
  { spell: 'Gate', level: 9, range: '60ft', castTime: 'Action', note: 'Open portal to another plane OR summon a specific named creature (CR 20+ can resist). Most powerful teleportation.', rating: 'S' },
];

export const TELEPORTATION_ESCAPE_USES = [
  { situation: 'Grappled/Restrained', spell: 'Misty Step', note: 'Bonus action teleport breaks grapple (you\'re no longer in the grappler\'s space). Best escape.' },
  { situation: 'Trapped in Forcecage', spell: 'Misty Step/Dimension Door', note: 'CHA save vs caster\'s DC to teleport out. If you fail, spell slot wasted.' },
  { situation: 'Falling', spell: 'Misty Step (reaction? No, bonus action)', note: 'Can\'t Misty Step as a reaction. Need Feather Fall or a readied Misty Step before the fall.' },
  { situation: 'TPK imminent', spell: 'Dimension Door', note: 'Grab one ally, teleport 500ft away. Escape. Come back for the rest later (or don\'t).' },
  { situation: 'Plane trapped', spell: 'Plane Shift', note: 'Only way home from another plane (without Gate or special means).' },
];

export const TELEPORT_ACCURACY = {
  familiar: { target: 'Permanent teleportation circle or very familiar place', mishapChance: '0%', note: 'Studying the circle\'s sigil or having been there many times.' },
  associatedObject: { target: 'Place you have an item from', mishapChance: '0% (if using circle), low otherwise', note: 'Having a piece of the destination helps.' },
  seenCasually: { target: 'Place you\'ve seen a few times', mishapChance: '~25% off-target or similar area', note: 'Risky. Might end up in the wrong spot.' },
  description: { target: 'Place you\'ve only heard described', mishapChance: '~50% mishap', note: 'Very risky. High chance of ending up somewhere unexpected or taking damage.' },
  falseDestination: { target: 'Place that doesn\'t exist', mishapChance: '100% mishap', note: 'Always mishap. 1d10 × 1d10 force damage to each creature.' },
};

export function teleportMishapDamage() {
  return { avg: 30.25, dice: '3d10 force', note: 'Each creature takes 3d10 force on mishap and appears in random location.' };
}
