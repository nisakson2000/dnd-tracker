/**
 * playerPhysicalSaveProtection.js
 * Player Mode: Protecting against the most common and dangerous saving throws
 * Pure JS — no React dependencies.
 */

export const MOST_COMMON_SAVES = [
  { save: 'DEX', frequency: 'Very Common', sources: 'Fireball, breath weapons, Lightning Bolt, Dex-based traps', effect: 'Usually damage. Half on success.' },
  { save: 'CON', frequency: 'Very Common', sources: 'Poison, concentration checks, death effects, disease, Con-based spells', effect: 'Varied: poison, damage, conditions, losing concentration.' },
  { save: 'WIS', frequency: 'Very Common', sources: 'Charm, fear, Hold Person, Hypnotic Pattern, mind control', effect: 'Usually disabling conditions. The most dangerous save failures.' },
  { save: 'STR', frequency: 'Uncommon', sources: 'Grapple, shove, restraining effects, Entangle, Maximilian\'s Grasp', effect: 'Movement restriction. Speed 0, restrained.' },
  { save: 'INT', frequency: 'Rare', sources: 'Mind Flayer, Feeblemind, Synaptic Static, Psychic Lance', effect: 'Devastating when they appear. INT 1 from Feeblemind = no casting.' },
  { save: 'CHA', frequency: 'Rare', sources: 'Banishment, Zone of Truth, Divine Word, plane effects', effect: 'Banished to another plane or forced truthfulness.' },
];

export const SAVE_PROTECTION_METHODS = [
  { method: 'Paladin Aura of Protection (level 6)', save: 'ALL', bonus: '+CHA mod (up to +5)', note: 'Best save-boosting feature in the game. Affects all allies within 10ft. CRITICAL to stay near the Paladin.', rating: 'S' },
  { method: 'Bless (1st level)', save: 'ALL', bonus: '+1d4 (avg 2.5)', note: 'Affects 3 creatures. Also boosts attacks. Low slot cost. Party staple.', rating: 'S' },
  { method: 'Resilient feat', save: 'One chosen', bonus: '+proficiency', note: 'Best for CON (casters) or WIS (martials). Also +1 to the ability score.', rating: 'S' },
  { method: 'Ring/Cloak of Protection', save: 'ALL', bonus: '+1', note: '+1 to ALL saves AND AC. Requires attunement. Best defensive magic items.', rating: 'A' },
  { method: 'Lucky feat', save: 'Any 3/day', bonus: 'Reroll', note: 'Reroll any d20, 3 times per long rest. Works on saves, attacks, checks. Universal insurance.', rating: 'A' },
  { method: 'War Caster feat', save: 'CON (concentration)', bonus: 'Advantage', note: 'Only for concentration saves, not all CON saves. But concentration is critical.', rating: 'A' },
  { method: 'Diamond Soul (Monk 14)', save: 'ALL', bonus: 'Proficiency + ki reroll', note: 'Proficiency in ALL six saves + spend 1 ki to reroll a failure. Monks become untouchable.', rating: 'S' },
  { method: 'Gnome Cunning', save: 'INT/WIS/CHA vs magic', bonus: 'Advantage', note: 'Advantage on the three most important saves against the most common source (magic).', rating: 'S' },
  { method: 'Heroes\' Feast (6th level)', save: 'WIS', bonus: 'Immunity to frightened + advantage', note: 'Also immune to poison, 2d10 temp HP. Lasts 24 hours. Amazing pre-dungeon buff.', rating: 'S' },
  { method: 'Absorb Elements (1st level)', save: 'N/A (reaction)', bonus: 'Resistance to triggering element', note: 'Doesn\'t help the save but halves damage even on failure. Essential for casters.', rating: 'A' },
  { method: 'Evasion (Rogue 7/Monk 7)', save: 'DEX', bonus: 'Half → 0 damage on success', note: 'Pass DEX save = 0 damage. Fail = half damage (instead of full). Best DEX save feature.', rating: 'S' },
  { method: 'Indomitable (Fighter 9)', save: 'Any', bonus: 'Reroll failed save', note: '1-3 uses per long rest. Simple but effective last resort.', rating: 'B' },
];

export const SAVE_BOOSTING_PRIORITY = {
  forMartials: [
    { priority: 1, method: 'Stay near Paladin (if in party)', reason: '+CHA to all saves. Free and massive.' },
    { priority: 2, method: 'Resilient (WIS)', reason: 'WIS saves are the most devastating to fail (charm, dominate, fear).' },
    { priority: 3, method: 'Ring/Cloak of Protection', reason: '+1 all saves and AC. Always useful.' },
    { priority: 4, method: 'Lucky feat', reason: 'Universal insurance against critical failures.' },
  ],
  forCasters: [
    { priority: 1, method: 'War Caster or Resilient (CON)', reason: 'Protect concentration. Your key spell staying active is worth more than extra damage.' },
    { priority: 2, method: 'Stay near Paladin (if in party)', reason: 'Aura protects concentration saves too.' },
    { priority: 3, method: 'Shield + Absorb Elements', reason: 'Reduce damage = fewer/lower concentration DCs.' },
    { priority: 4, method: 'Ring/Cloak of Protection', reason: '+1 to concentration saves AND defense.' },
  ],
};

export function saveBonus(abilityMod, proficient, profBonus, otherBonuses) {
  let total = abilityMod;
  if (proficient) total += profBonus;
  total += otherBonuses.reduce((sum, b) => sum + b, 0);
  return total;
}

export function saveSuccessChance(bonus, dc) {
  const needed = dc - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function mostVulnerableSave(saves) {
  let worst = null;
  let lowestBonus = Infinity;
  for (const [save, bonus] of Object.entries(saves)) {
    if (bonus < lowestBonus) {
      lowestBonus = bonus;
      worst = save;
    }
  }
  return { save: worst, bonus: lowestBonus };
}
