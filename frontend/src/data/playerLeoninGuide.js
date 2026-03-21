/**
 * playerLeoninGuide.js
 * Player Mode: Leonin race guide — the lion warrior
 * Pure JS — no React dependencies.
 */

export const LEONIN_BASICS = {
  race: 'Leonin',
  source: 'Mythic Odysseys of Theros',
  size: 'Medium',
  speed: '35ft',
  asi: '+2 CON, +1 STR',
  theme: 'Proud lion warrior. Roar for fear. Claws for natural attacks.',
  note: 'Solid martial race. 35ft speed, darkvision, natural weapons, and a fear roar. Good for Barbarian/Fighter/Paladin.',
};

export const LEONIN_TRAITS = [
  { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard darkvision.' },
  { trait: 'Claws', effect: 'Unarmed strikes deal 1d4+STR slashing.', note: '1d4 claws. Useful for grapple builds (deal damage while grappling).' },
  { trait: 'Hunter\'s Instincts', effect: 'Proficiency in one of: Athletics, Intimidation, Perception, Survival.', note: 'Free skill. Athletics for grapple, Intimidation for fear synergy, Perception for utility.' },
  { trait: 'Daunting Roar', effect: 'Bonus action: creatures within 10ft that can hear you must WIS save (8+prof+CON) or be frightened until end of your next turn. Once per short rest.', note: 'AoE fear as bonus action. 10ft radius. Short rest recharge. Great opening move.' },
];

export const LEONIN_BUILDS = [
  { build: 'Leonin Barbarian', detail: '+1 STR +2 CON. Daunting Roar + Rage. Frighten enemies then hit them. Path of the Berserker: Intimidating Presence synergy.', rating: 'A' },
  { build: 'Leonin Conquest Paladin', detail: '+1 STR +2 CON. Daunting Roar + Aura of Conquest. Frightened enemies near you have speed 0 + take psychic damage.', rating: 'S', note: 'THE combo. Roar → frighten → Aura of Conquest locks them in place → they take damage each turn.' },
  { build: 'Leonin Fighter', detail: '+1 STR. 35ft speed. Daunting Roar for crowd control. Solid martial.', rating: 'A' },
  { build: 'Leonin Paladin', detail: '+1 STR +2 CON. Roar + Smite. 35ft charge speed. Good general Paladin race.', rating: 'A' },
];

export const DAUNTING_ROAR_CONQUEST_COMBO = {
  step1: 'Bonus action: Daunting Roar → enemies within 10ft make WIS save or frightened.',
  step2: 'Aura of Conquest: frightened enemies within 10ft have speed = 0.',
  step3: 'They can\'t move. Each start of their turn: take psychic damage = half your Paladin level.',
  step4: 'Attack them with advantage (they\'re frightened = disadvantage on ability checks, not attacks — but you\'re scary).',
  note: 'This combo locks down melee enemies. They can\'t move, they take damage, and they struggle to break free.',
  rating: 'S-tier racial + subclass synergy',
};

export function dauntingRoarDC(profBonus, conMod) {
  return 8 + profBonus + conMod;
}

export function conquestComboLockDamage(paladinLevel) {
  return Math.floor(paladinLevel / 2); // Psychic damage per turn to frightened enemies in aura
}
