/**
 * playerAmbushTactics.js
 * Player Mode: Setting up and executing ambushes
 * Pure JS — no React dependencies.
 */

export const AMBUSH_STEPS = [
  { step: 1, action: 'Choose the kill zone', detail: 'Chokepoints, narrow paths, rooms with one exit. Force enemies through a space you control.' },
  { step: 2, action: 'Set up positions', detail: 'Ranged above, melee flanking entry points. Casters at max range with line of sight.' },
  { step: 3, action: 'Buff before initiating', detail: 'Pass Without Trace (+10 Stealth), Bless, Mage Armor — non-concentration buffs that last.' },
  { step: 4, action: 'Everyone rolls Stealth', detail: 'All hiders roll Stealth vs enemy passive Perception. Each enemy checks individually.' },
  { step: 5, action: 'Agree on the trigger', detail: '"When the last one enters the room" or "When I fire the first arrow." Everyone knows the signal.' },
  { step: 6, action: 'Alpha strike', detail: 'First round: maximum damage. Surprised enemies can\'t act on their first turn. Assassins auto-crit.' },
  { step: 7, action: 'Mop up', detail: 'After surprise round, fight normally. Most of the work should be done in the opening salvo.' },
];

export const AMBUSH_CLASSES = [
  { class: 'Assassin Rogue', role: 'Kill priority target', benefit: 'Assassinate: advantage on any creature that hasn\'t acted. Auto-crit on surprised.', rating: 'S' },
  { class: 'Gloom Stalker Ranger', role: 'First-turn devastation', benefit: 'Dread Ambusher: extra attack + 1d8 on first turn. +WIS to initiative. Invisible in darkness.', rating: 'S' },
  { class: 'Arcane Trickster Rogue', role: 'Setup + burst', benefit: 'Cast Hold Person pre-combat, then Sneak Attack the paralyzed target for auto-crit.', rating: 'A' },
  { class: 'Shadow Monk', role: 'Teleport strike', benefit: 'Shadow Step: teleport 60ft between dim light/darkness. Advantage on first attack.', rating: 'A' },
  { class: 'Any Warlock (Devil\'s Sight)', role: 'Darkness combo', benefit: 'Cast Darkness on enemy group. You see through it, they don\'t. Free advantage for you.', rating: 'A' },
  { class: 'Druid', role: 'Area control', benefit: 'Entangle or Spike Growth in the kill zone before enemies arrive. They walk into the trap.', rating: 'A' },
];

export const STEALTH_BONUSES = [
  { source: 'Pass Without Trace', bonus: '+10', type: 'Spell (2nd)', note: 'Entire party. Nearly guarantees surprise against most enemies.' },
  { source: 'Cloak of Elvenkind', bonus: 'Advantage', type: 'Item (Uncommon)', note: 'Advantage on Stealth. Stacks with PWT.' },
  { source: 'Boots of Elvenkind', bonus: 'Advantage', type: 'Item (Uncommon)', note: 'Silent movement. Advantage on Stealth for sound.' },
  { source: 'Expertise (Stealth)', bonus: 'Double proficiency', type: 'Class feature', note: 'Rogue, Bard, or Skill Expert feat.' },
  { source: 'Reliable Talent', bonus: 'Minimum 10', type: 'Rogue 11+', note: 'Can\'t roll below 10. With +13 Stealth = minimum 23.' },
  { source: 'Mask of the Wild', bonus: 'Hide in nature', type: 'Wood Elf', note: 'Hide when only lightly obscured by natural phenomena.' },
];

export const ANTI_AMBUSH = [
  { defense: 'High passive Perception', effect: 'Notices hidden enemies automatically. 15+ is hard to beat.' },
  { defense: 'Alert feat', effect: 'Can\'t be surprised while conscious. +5 initiative. The anti-ambush feat.' },
  { defense: 'Truesight', effect: 'Sees through magical darkness, invisibility, illusions. Rare but devastating.' },
  { defense: 'Alarm spell', effect: 'Alerts the caster if anyone enters a 20ft cube. Camps use this.' },
  { defense: 'Sentinel guards', effect: 'Guards with high Perception stationed at approaches. Hard to sneak past.' },
];

export function canAmbush(partyStealthMods, passWithoutTrace, enemyPassivePerception) {
  const pwt = passWithoutTrace ? 10 : 0;
  const minStealth = Math.min(...partyStealthMods.map(m => 10 + m + pwt)); // Worst case (10 on die)
  return minStealth >= enemyPassivePerception;
}

export function getAmbushRole(className) {
  return AMBUSH_CLASSES.find(c =>
    c.class.toLowerCase().includes((className || '').toLowerCase())
  ) || null;
}
