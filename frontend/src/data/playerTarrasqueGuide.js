/**
 * playerTarrasqueGuide.js
 * Player Mode: Fighting the Tarrasque — the ultimate boss encounter
 * Pure JS — no React dependencies.
 */

export const TARRASQUE_STATS = {
  cr: 30,
  ac: 25,
  hp: 676,
  speed: '40ft',
  str: 30, dex: 11, con: 30, int: 3, wis: 11, cha: 11,
  saves: 'INT +5, WIS +9, CHA +9',
  damageImmunity: 'Fire, poison. Nonmagical bludgeoning/piercing/slashing.',
  conditionImmunity: 'Charmed, frightened, paralyzed, poisoned.',
  legendaryResistance: '3/day',
  legendaryActions: 3,
  magicResistance: 'Advantage on saves vs spells and magical effects.',
  reflectiveCarapace: 'Any spell targeting only the Tarrasque (line/ray) is reflected back. 1-6 on d6 = reflected at caster.',
  frightfulPresence: '120ft. WIS DC 17 or frightened for 1 minute.',
  swallow: 'On bite hit, if target is Large or smaller: swallowed. 16d6 acid per turn inside.',
};

export const TARRASQUE_ATTACKS = [
  { attack: 'Bite', bonus: '+19', damage: '4d12+10 (36 avg)', note: 'Grappled on hit. Can swallow next turn.' },
  { attack: 'Claw ×2', bonus: '+19', damage: '4d8+10 (28 avg each)', note: 'Reliable damage.' },
  { attack: 'Horns', bonus: '+19', damage: '4d10+10 (32 avg)', note: 'Tail and horns.' },
  { attack: 'Tail', bonus: '+19', damage: '4d6+10 (24 avg)', note: 'If target is Huge or smaller: DC 20 STR or prone.' },
  { attack: 'Total Multiattack', bonus: '+19', damage: '~148 avg/round', note: 'Bite + 2 claws + horns + tail. Plus legendary actions.' },
];

export const TARRASQUE_STRATEGIES = [
  { strategy: 'Fly and shoot', detail: 'Tarrasque has NO ranged attack and NO flying speed. Fly 60ft up and attack with non-reflected spells.', rating: 'S', note: 'Sacred Flame (DEX save, not targeted = no reflect). Toll the Dead. AoE spells.' },
  { strategy: 'Kiting', detail: 'Tarrasque has 40ft speed. Mounted combat (60ft horse) or Haste lets you stay ahead.', rating: 'A', note: 'Tarrasque can Dash for 80ft. You need consistent speed advantage.' },
  { strategy: 'AoE spells only', detail: 'Reflective Carapace only reflects single-target spells. AoE (Fireball) is safe.', rating: 'S', note: 'Fireball, Meteor Swarm, Sickening Radiance, Spirit Guardians all work.' },
  { strategy: 'Force damage focus', detail: 'No force damage resistance. Eldritch Blast, Magic Missile won\'t work (reflected). Spiritual Weapon, Bigby\'s Hand DO work (not rays).', rating: 'A', note: 'Check if spell "targets" the Tarrasque specifically.' },
  { strategy: 'Save-based attacks', detail: 'AC 25 makes attack rolls difficult. Use save-based spells. DEX +0 and WIS +9.', rating: 'A', note: 'DEX save spells like Fireball are most reliable.' },
  { strategy: 'Wish + Simulacrum chain', detail: 'If your DM allows: Simulacrum → Wish → Simulacrum army. Controversial.', rating: 'S (banned at most tables)', note: 'RAW possible but universally considered cheese.' },
  { strategy: 'Polymorph + cliff', detail: 'True Polymorph Tarrasque into a slug. Legendary Resistance blocks 3 times. 4th attempt works.', rating: 'A', note: 'Need to burn LR first. Then Polymorph into something harmless.' },
];

export const TARRASQUE_SURVIVAL = [
  'DO NOT get swallowed. 56 (16d6) acid damage per turn with no way out except cutting through.',
  'Death Ward on everyone who might get bitten. Swallow → 0 HP → Death Ward saves.',
  'Heroes\' Feast: immune to frightened. Frightful Presence is 120ft, WIS DC 17.',
  'Shield of Faith, Haste, or Bladesong to boost AC. +19 to hit means 25+ AC still gets hit ~50%.',
  'Healing Word is critical. Keep downed allies up. Tarrasque can kill unconscious targets.',
  'Don\'t stand next to it. 5 attacks per turn + legendary actions. Melee is a death sentence for squishies.',
];

export function tarrasqueHitChance(targetAC) {
  const bonus = 19;
  const needed = targetAC - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function turnsToKillTarrasque(partyDPR) {
  return Math.ceil(676 / partyDPR);
}

export function swallowDamage(rounds) {
  return rounds * 56; // 16d6 avg per round
}
