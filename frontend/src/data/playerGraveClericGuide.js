/**
 * playerGraveClericGuide.js
 * Player Mode: Grave Domain Cleric — death's gatekeeper
 * Pure JS — no React dependencies.
 */

export const GRAVE_BASICS = {
  class: 'Cleric (Grave Domain)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Guardian between life and death. Anti-undead, anti-crit, and vulnerability-granting.',
  note: 'Incredible support Cleric. Path to the Grave + ally\'s attack = double damage. Sentinel at Death\'s Door cancels crits.',
};

export const GRAVE_FEATURES = [
  { feature: 'Circle of Mortality', level: 1, effect: 'Healing spells on creatures at 0 HP: use maximum of dice instead of rolling. Spare the Dying at 30ft range as bonus action.', note: 'Max healing on downed allies. Cure Wounds at 0 HP = 8+WIS guaranteed. Spare the Dying as bonus action.' },
  { feature: 'Eyes of the Grave', level: 1, effect: 'Action: detect undead within 60ft (not behind total cover). WIS mod times/long rest.', note: 'Undead detector. Useful in undead-heavy campaigns.' },
  { feature: 'Path to the Grave', level: 2, effect: 'Channel Divinity, action: choose creature within 30ft. Next attack against it deals double damage (vulnerability). Used up whether hit or miss.', note: 'VULNERABILITY. Double damage on next hit. Combo: Path to the Grave → Paladin Smite = quadruple Smite dice on crit.' },
  { feature: 'Sentinel at Death\'s Door', level: 6, effect: 'Reaction: when a creature you can see within 30ft suffers a critical hit, turn it into a normal hit. WIS mod times/long rest.', note: 'Cancel enemy crits. WIS mod times per day. Assassin crits? Negated. Dragon crit? Negated.' },
  { feature: 'Potent Spellcasting', level: 8, effect: 'Add WIS modifier to Cleric cantrip damage.', note: 'Toll the Dead: 1d12+5 at 0 HP targets. Solid cantrip damage.' },
  { feature: 'Keeper of Souls', level: 17, effect: 'When a creature you can see dies within 60ft, you or a creature within 60ft regains HP = creature\'s number of hit dice.', note: 'Passive healing from enemy deaths. Free healing every time something dies near you.' },
];

export const PATH_TO_THE_GRAVE_COMBOS = [
  { combo: 'Path + Paladin Smite', detail: 'Path to Grave (vulnerability) → Paladin attacks with Smite. Smite damage is doubled. On crit: quadrupled.', rating: 'S', note: 'Best combo in the game. Divine Smite 4d8 → 8d8 (vulnerability). On crit: 16d8.' },
  { combo: 'Path + Rogue Sneak Attack', detail: 'Path → Rogue attacks. All SA dice doubled. L11 Rogue: 6d6 SA → 12d6.', rating: 'S' },
  { combo: 'Path + Inflict Wounds', detail: 'Path → Inflict Wounds (3d10). Doubled = 6d10 = avg 33. Self-combo.', rating: 'A' },
  { combo: 'Path + Disintegrate', detail: 'Path → Disintegrate (10d6+40). Doubled = 20d6+80 = avg 150. If target hits 0: dusted.', rating: 'S', note: 'Party Wizard casts Disintegrate. You double it. 150 average damage.' },
  { combo: 'Path + any big hit', detail: 'Any ally with a big single hit. Barbarian\'s Great Weapon Master crit. Fighter\'s Action Surge turn.', rating: 'A' },
];

export const GRAVE_TACTICS = [
  { tactic: 'Yo-yo healing prevention', detail: 'Circle of Mortality: max healing on downed allies. They get up with full heal, not 1 HP.', rating: 'A', note: 'Cure Wounds on downed ally: 8+5 = 13 HP guaranteed at L1 slot.' },
  { tactic: 'Crit denial', detail: 'Sentinel at Death\'s Door: cancel 3-5 crits per day. Protect against assassins, vorpal swords, lucky monsters.', rating: 'S' },
  { tactic: 'Spare the Dying efficiency', detail: 'Bonus action, 30ft range. Stabilize allies without going near danger. No spell slot.', rating: 'A' },
  { tactic: 'Toll the Dead spam', detail: 'Toll the Dead (1d12 on damaged targets) + WIS mod at L8. Reliable cantrip damage.', rating: 'A' },
];

export const GRAVE_VS_LIFE = {
  grave: { pros: ['Path to the Grave (double damage)', 'Cancel crits', 'Max healing on downed allies', 'Spare the Dying at range'], cons: ['Less sustained healing', 'No heavy armor', 'Path uses your action'] },
  life: { pros: ['Best sustained healing', 'Disciple of Life bonus', 'Heavy armor', 'Preserve Life CD'], cons: ['No vulnerability granting', 'No crit canceling', 'No max healing on downed'] },
  verdict: 'Grave for burst combos and crit denial. Life for raw healing throughput.',
};

export function circleOfMortalityHealing(spellLevel, wisMod) {
  const maxDie = spellLevel === 1 ? 8 : spellLevel === 2 ? 8 : 8; // Cure Wounds: d8
  return maxDie + wisMod; // Max roll + WIS
}

export function pathToTheGraveDamage(baseDamage) {
  return baseDamage * 2; // Vulnerability = double
}

export function sentinelUses(wisMod) {
  return Math.max(1, wisMod);
}
