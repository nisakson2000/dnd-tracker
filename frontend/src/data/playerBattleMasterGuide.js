/**
 * playerBattleMasterGuide.js
 * Player Mode: Battle Master Fighter maneuver optimization
 * Pure JS — no React dependencies.
 */

export const BATTLE_MASTER_BASICS = {
  class: 'Fighter (Battle Master)',
  superiorityDice: { level3: '4d8', level7: '5d8', level10: '5d10', level15: '6d10', level18: '6d12' },
  maneuversKnown: { level3: 3, level7: 5, level10: 7, level15: 9 },
  recovery: 'All superiority dice recover on short or long rest.',
  saveDC: '8 + proficiency + STR or DEX modifier.',
};

export const MANEUVERS_RANKED = [
  { name: 'Precision Attack', effect: 'Add superiority die to attack roll.', rating: 'S', note: 'Turn miss into hit. Best with GWM/SS (-5/+10). Use AFTER seeing the roll.' },
  { name: 'Trip Attack', effect: 'Add die to damage. Target STR save or prone.', rating: 'S', note: 'Prone = advantage on remaining attacks. Use on first hit.' },
  { name: 'Riposte', effect: 'Reaction: when enemy misses you, attack + die damage.', rating: 'S', note: 'Extra attack outside your turn. Pairs with Sentinel.' },
  { name: 'Menacing Attack', effect: 'Add die to damage. Target WIS save or frightened until end of your next turn.', rating: 'A', note: 'Frightened = disadvantage on attacks/checks. Can\'t approach you.' },
  { name: 'Goading Attack', effect: 'Add die to damage. Target WIS save or disadvantage on attacks not targeting you.', rating: 'A', note: 'Taunt effect. Protect the backline.' },
  { name: 'Disarming Attack', effect: 'Add die to damage. Target STR save or drops weapon/item.', rating: 'A', note: 'Kick weapon away. Enemy wastes action picking it up.' },
  { name: 'Pushing Attack', effect: 'Add die to damage. Target STR save or pushed 15ft.', rating: 'A', note: 'Push into hazards (Spike Growth, cliffs, fire).' },
  { name: 'Commander\'s Strike', effect: 'Forgo one attack. Ally uses reaction to attack + add your die.', rating: 'A', note: 'Give Rogue an extra Sneak Attack on YOUR turn.' },
  { name: 'Maneuvering Attack', effect: 'Add die to damage. Ally moves half speed without OA.', rating: 'B', note: 'Reposition the squishy caster to safety.' },
  { name: 'Rally', effect: 'Bonus action: ally gains die + CHA mod temp HP.', rating: 'B', note: 'No attack needed. Use when no enemies in reach.' },
  { name: 'Feinting Attack', effect: 'Bonus action: advantage on next attack + die damage.', rating: 'B', note: 'Only if you can\'t get advantage another way (flanking, etc.).' },
  { name: 'Parry', effect: 'Reaction: reduce damage by die + DEX mod.', rating: 'C', note: 'Riposte is almost always better (damage > damage reduction).' },
  { name: 'Evasive Footwork', effect: 'Add die to AC while moving.', rating: 'C', note: 'Only during movement. Too situational.' },
  { name: 'Sweeping Attack', effect: 'Hit another creature adjacent. Apply die as damage.', rating: 'C', note: 'Only die damage, not weapon damage. Very low impact.' },
  { name: 'Lunging Attack', effect: '+5ft reach + die damage.', rating: 'C', note: 'PAM or reach weapon is better.' },
  { name: 'Bait and Switch', effect: 'Swap places with ally within 5ft. One of you gets +die AC.', rating: 'B', note: 'Good for rescuing grappled/surrounded allies.' },
  { name: 'Ambush', effect: 'Add die to initiative or Stealth check.', rating: 'B', note: 'Going first matters. Use on initiative.' },
  { name: 'Quick Toss', effect: 'Bonus action: throw weapon + die damage.', rating: 'A', note: 'Bonus action attack. Works with thrown weapon builds.' },
  { name: 'Tactical Assessment', effect: 'Add die to Investigation, History, or Insight check.', rating: 'C', note: 'Out of combat utility. Rarely worth a die.' },
];

export const BM_COMBOS = [
  { combo: 'Trip + GWM', detail: 'Trip Attack first hit → prone. Remaining attacks with advantage + GWM +10.', rating: 'S' },
  { combo: 'Precision + GWM/SS', detail: 'Take -5 penalty. If roll barely misses, add Precision die to hit. Convert miss to +10 damage.', rating: 'S' },
  { combo: 'Commander\'s Strike + Rogue', detail: 'Rogue gets reaction attack = extra Sneak Attack. Your die + SA dice.', rating: 'S' },
  { combo: 'Push + Spike Growth', detail: 'Push enemy 15ft through Spike Growth = 6d4 forced movement damage.', rating: 'A' },
  { combo: 'Riposte + Sentinel', detail: 'Enemy attacks you, misses = Riposte. Enemy attacks ally = Sentinel. Reaction either way.', rating: 'A' },
];

export function superiorityDie(fighterLevel) {
  if (fighterLevel >= 18) return 12;
  if (fighterLevel >= 10) return 10;
  return 8;
}

export function maneuverDC(profBonus, strOrDexMod) {
  return 8 + profBonus + strOrDexMod;
}
