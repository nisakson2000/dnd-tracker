/**
 * playerUndeadHunting.js
 * Player Mode: Fighting undead — vulnerabilities, immunities, and tactics
 * Pure JS — no React dependencies.
 */

export const UNDEAD_UNIVERSAL_TRAITS = {
  immunities: ['Poison damage', 'Poisoned condition', 'Exhaustion (most)'],
  commonResistances: ['Necrotic damage (many)', 'Non-magical bludgeoning/piercing/slashing (some)'],
  commonVulnerabilities: ['Radiant damage (many take extra or have features negated by it)', 'Fire (some, like mummies)'],
  turnUndead: 'Cleric Channel Divinity: Turn Undead forces WIS save or flee. Destroy Undead instantly kills low-CR undead.',
};

export const UNDEAD_BY_THREAT = [
  { creature: 'Zombie', cr: '1/4', key: 'Undead Fortitude: CON save to stay at 1 HP instead of 0. Radiant/crit bypasses.', counter: 'Radiant damage or crits bypass Undead Fortitude. Otherwise, hit them again.' },
  { creature: 'Skeleton', cr: '1/4', key: 'Vulnerability to bludgeoning. Low HP.', counter: 'Maces, hammers, clubs. Bludgeoning does double damage.' },
  { creature: 'Ghoul', cr: 1, key: 'Paralysis on hit (CON save). Elves are immune.', counter: 'Elves can\'t be paralyzed by ghouls. High CON saves. Freedom of Movement.' },
  { creature: 'Ghost', cr: 4, key: 'Incorporeal. Possession (CHA save). Ethereal movement.', counter: 'Magic weapons required. Protection from Evil prevents possession. Force damage works across planes.' },
  { creature: 'Wight', cr: 3, key: 'Life Drain reduces max HP. Commands zombies.', counter: 'Kill the wight first — its zombies collapse. Greater Restoration restores max HP.' },
  { creature: 'Wraith', cr: 5, key: 'Incorporeal. Life Drain. Can create specter from slain humanoid.', counter: 'Radiant damage. Magic weapons. Don\'t let it kill party members (creates specters).' },
  { creature: 'Mummy', cr: 3, key: 'Dreadful Glare (frightened). Rotting Fist (curse, max HP reduction).', counter: 'Fire vulnerability. Remove Curse for the rot. Heroes\' Feast for frightened immunity.' },
  { creature: 'Vampire', cr: 13, key: 'Regeneration (20 HP/turn). Charm. Children of Night. Legendary actions.', counter: 'Radiant/running water stops regen. Sunlight: disadvantage + no regen. Stake through heart in coffin.' },
  { creature: 'Lich', cr: 21, key: 'Full caster. Legendary actions. Phylactery (respawns if not destroyed).', counter: 'Find and destroy phylactery first. Counterspell their big spells. Burn legendary resistances.' },
  { creature: 'Death Knight', cr: 17, key: 'Hellfire Orb (10d6 fire + 10d6 necrotic). Spellcasting. High AC (20).', counter: 'Fire resistance helps with Hellfire Orb. Dispel Magic on its buffs. Focus fire.' },
];

export const ANTI_UNDEAD_TOOLKIT = [
  { tool: 'Turn Undead (Cleric)', effect: 'Flee or be destroyed (low CR).', rating: 'S' },
  { tool: 'Radiant damage spells', effect: 'Many undead are vulnerable or weak to radiant.', rating: 'S' },
  { tool: 'Protection from Evil and Good', effect: 'Disadvantage on undead attacks. Can\'t be charmed/frightened/possessed.', rating: 'S' },
  { tool: 'Holy Water', effect: '2d6 radiant as improvised weapon. 25 gp.', rating: 'B' },
  { tool: 'Remove Curse', effect: 'Cures mummy rot and similar undead curses.', rating: 'A' },
  { tool: 'Greater Restoration', effect: 'Restores max HP reduction from Life Drain.', rating: 'A' },
  { tool: 'Magic Circle', effect: 'Trap undead in a circle. They can\'t enter.', rating: 'A' },
  { tool: 'Sunlight/Dawn', effect: 'Vampires: disadvantage + no regen. Dawn spell creates sunlight.', rating: 'S' },
];

export const RADIANT_DAMAGE_SOURCES = [
  'Sacred Flame (Cleric cantrip)', 'Guiding Bolt (1st, 4d6)', 'Spirit Guardians (3rd, 3d8/turn)',
  'Flame Strike (5th, 4d6 fire + 4d6 radiant)', 'Holy Weapon (5th, 2d8 per hit)',
  'Divine Smite (2d8+ per hit)', 'Sun Bolt (Monk, Sun Soul)', 'Sunbeam (6th, 6d8 line)',
];

export function undeadFortitudeDC(damageTaken, isRadiant) {
  if (isRadiant) return Infinity; // Can't use Undead Fortitude vs radiant
  return 5 + damageTaken;
}

export function turnUndeadDestroyCR(clericLevel) {
  if (clericLevel >= 17) return 4;
  if (clericLevel >= 14) return 3;
  if (clericLevel >= 11) return 2;
  if (clericLevel >= 8) return 1;
  if (clericLevel >= 5) return 0.5;
  return 0;
}
