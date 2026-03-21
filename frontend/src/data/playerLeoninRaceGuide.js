/**
 * playerLeoninRaceGuide.js
 * Player Mode: Leonin — lion-like warriors with a roar
 * Pure JS — no React dependencies.
 */

export const LEONIN_BASICS = {
  race: 'Leonin',
  source: 'Mythic Odysseys of Theros',
  size: 'Medium',
  speed: '35 feet',
  traits: [
    { name: 'Darkvision', desc: '60 feet.' },
    { name: 'Claws', desc: 'Unarmed strikes deal 1d4 + STR slashing damage.' },
    { name: 'Hunter\'s Instincts', desc: 'Proficiency in one of: Athletics, Intimidation, Perception, or Survival.' },
    { name: 'Daunting Roar', desc: 'BA: creatures within 10ft that can hear you must WIS save (DC 8 + CON + prof) or be frightened until end of your next turn. 1/SR.' },
  ],
  asi: '+2 CON / +1 STR (legacy)',
  note: '35ft speed. Free AoE frighten as BA. Claws for unarmed builds. Solid melee race.',
};

export const DAUNTING_ROAR_VALUE = {
  effect: 'BA AoE frighten (10ft radius). WIS save or frightened until end of your next turn.',
  duration: '1 round (frightened).',
  frequency: '1/short rest.',
  frightenedCondition: [
    'Disadvantage on ability checks and attack rolls while source is in line of sight.',
    'Can\'t willingly move closer to the source of fear.',
  ],
  note: 'Frightened is a strong condition. Disadvantage on attacks = massive defensive swing. Free BA use.',
  combos: [
    'Roar → enemies have disadvantage on attacks → party takes less damage.',
    'Roar → enemies can\'t move toward you → ranged attackers are safe.',
    'Conquest Paladin: frightened enemies within Aura of Conquest have speed 0. Roar feeds this.',
  ],
};

export const LEONIN_CLASS_SYNERGY = [
  { class: 'Barbarian', rating: 'S', reason: '35ft speed. +2 CON/+1 STR. Daunting Roar while raging. Claws for unarmed backup.' },
  { class: 'Fighter', rating: 'A', reason: 'Good stats. Roar for battlefield control. 35ft base speed.' },
  { class: 'Paladin (Conquest)', rating: 'S', reason: 'Roar frightens → Aura of Conquest freezes frightened enemies (speed 0). Devastating combo.' },
  { class: 'Monk', rating: 'B', reason: '35ft speed. Claws are 1d4 (Monk upgrades this). CON is useful but Monks want DEX/WIS.' },
  { class: 'Cleric', rating: 'B', reason: 'CON for concentration. Roar for frontline Clerics. 35ft for positioning.' },
  { class: 'Wizard/Sorcerer', rating: 'C', reason: 'Wrong stats. Roar requires being within 10ft of enemies. Anti-synergy with casters.' },
];

export function dauntingRoarDC(conMod, profBonus) {
  return { dc: 8 + conMod + profBonus, note: `Daunting Roar save DC: ${8 + conMod + profBonus}` };
}
