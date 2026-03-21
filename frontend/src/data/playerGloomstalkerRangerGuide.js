/**
 * playerGloomstalkerRangerGuide.js
 * Player Mode: Gloom Stalker Ranger — the darkness hunter
 * Pure JS — no React dependencies.
 */

export const GLOOMSTALKER_BASICS = {
  class: 'Ranger (Gloom Stalker)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Invisible in darkness. Devastating first turn. Extra attack + speed on round 1. Darkvision master.',
  note: 'Widely considered the best Ranger subclass. Dread Ambusher is one of the strongest first-turn features in the game. Invisible to darkvision creatures in darkness.',
};

export const GLOOMSTALKER_FEATURES = [
  { feature: 'Dread Ambusher', level: 3, effect: 'First turn of combat: +WIS to initiative, +10ft speed, one extra attack that deals +1d8 damage.', note: 'First turn: Extra Attack (2 attacks) + Dread Ambusher (1 extra) = 3 attacks at L5. With +1d8. Devastating opener.' },
  { feature: 'Umbral Sight', level: 3, effect: 'Gain 60ft darkvision (or +30ft if you have it). While in darkness, invisible to creatures relying on darkvision.', note: 'Most underground/dungeon enemies have darkvision. You\'re INVISIBLE to them in darkness. Free advantage, they can\'t target you.' },
  { feature: 'Gloom Stalker Spells', level: 3, effect: 'Disguise Self (L3), Rope Trick (L5), Fear (L9), Greater Invisibility (L13), Seeming (L17).', note: 'Rope Trick is a free safe short rest. Greater Invisibility at L13 is amazing. Fear for crowd control.' },
  { feature: 'Iron Mind', level: 7, effect: 'Proficiency in WIS saves. If already proficient: INT or CHA saves instead.', note: 'WIS save proficiency. The most important mental save. Huge defensive boost.' },
  { feature: 'Stalker\'s Flurry', level: 11, effect: 'Once per turn: when you miss an attack, make another weapon attack.', note: 'Miss → free attack. You almost never fully whiff a turn. Smooths out bad luck.' },
  { feature: 'Shadowy Dodge', level: 15, effect: 'When attacked (no advantage against you): reaction to impose disadvantage on the attack.', note: 'Free disadvantage on one attack per round. Excellent defensive reaction. No resource cost.' },
];

export const GLOOMSTALKER_TACTICS = [
  { tactic: 'Round 1 alpha strike', detail: 'L5: 3 attacks round 1 (Extra Attack + Dread Ambusher). With Hunter\'s Mark: 3×(1d8+DEX+1d6) + 1d8 = ~40 avg damage round 1.', rating: 'S' },
  { tactic: 'Darkness invisibility', detail: 'Fight in darkness. You\'re invisible to darkvision creatures. Attack with advantage, they attack with disadvantage. Dominant in dungeons.', rating: 'S' },
  { tactic: 'Sharpshooter + Dread Ambusher', detail: '3 Sharpshooter attacks round 1. Each at -5/+10. With advantage (darkness): high hit chance. Devastating burst.', rating: 'S' },
  { tactic: 'Multiclass: Fighter 3 (Assassin)', detail: 'Assassin 3 + Gloomstalker: surprised enemies = auto-crit on ALL Dread Ambusher attacks. 3 auto-crits round 1.', rating: 'S' },
  { tactic: 'Multiclass: Fighter 2 (Action Surge)', detail: 'Action Surge round 1: 3 attacks (normal) + 3 attacks (Action Surge) = 6 attacks round 1. With Dread Ambusher bonus on both.', rating: 'S' },
  { tactic: 'Rope Trick safe rest', detail: 'Cast Rope Trick. Party climbs up. Pull rope up. Invisible extradimensional space. Safe 1-hour short rest anywhere.', rating: 'A' },
];

export const GLOOMSTALKER_MULTICLASS_COMBOS = [
  { combo: 'Gloomstalker 5 / Fighter 2', levels: 7, benefit: 'Action Surge: 6 attacks round 1. Extra Fighting Style. Con save proficiency.', rating: 'S' },
  { combo: 'Gloomstalker 5 / Rogue 3 (Assassin)', levels: 8, benefit: 'Auto-crit surprised enemies + Sneak Attack. Dread Ambusher crits = massive damage.', rating: 'S' },
  { combo: 'Gloomstalker 5 / Rogue 3 (Scout)', levels: 8, benefit: 'Expertise, Skirmisher reaction movement. Good if not going for surprise builds.', rating: 'A' },
  { combo: 'Gloomstalker 5 / Cleric 1 (War)', levels: 6, benefit: 'Heavy armor, bonus action attack (War Priest). WIS synergy.', rating: 'A' },
];

export function dreadAmbusherRound1Attacks(hasExtraAttack, hasActionSurge) {
  const baseAttacks = hasExtraAttack ? 2 : 1;
  const dreadAmbusherExtra = 1;
  const total = baseAttacks + dreadAmbusherExtra;
  return hasActionSurge ? total * 2 : total;
}

export function round1DPR(dexMod, hasHuntersMark, hasSharpshooter, numberOfAttacks) {
  const weaponDmg = 4.5; // 1d8 longbow
  const dreadBonus = 4.5; // 1d8 extra on one attack
  const hmBonus = hasHuntersMark ? 3.5 * numberOfAttacks : 0;
  const ssBonus = hasSharpshooter ? 10 * numberOfAttacks : 0;
  const baseDPR = numberOfAttacks * (weaponDmg + dexMod) + dreadBonus + hmBonus + ssBonus;
  return baseDPR;
}
