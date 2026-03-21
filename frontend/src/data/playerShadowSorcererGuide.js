/**
 * playerShadowSorcererGuide.js
 * Player Mode: Shadow Magic Sorcerer — the darkness-wielding sorcerer
 * Pure JS — no React dependencies.
 */

export const SHADOW_SORCERER_BASICS = {
  class: 'Sorcerer (Shadow Magic)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Shadowfell powers. 120ft darkvision. Free Darkness. Strength of the Grave survival. Hound of Ill Omen.',
  note: 'Excellent subclass. Darkness + darkvision combo. Hound of Ill Omen is a powerful summoned creature. Shadow Walk at L14.',
};

export const SHADOW_FEATURES = [
  { feature: 'Eyes of the Dark', level: 1, effect: 'Darkvision 120ft.', note: 'Double range darkvision from L1. See in most dark environments.' },
  { feature: 'Eyes of the Dark (Darkness)', level: 3, effect: 'Cast Darkness for 2 SP (no slot). You can see through YOUR Darkness.', note: 'Free Darkness you can see through. Like Devil\'s Sight + Darkness combo but built-in. 2 SP cost.' },
  { feature: 'Strength of the Grave', level: 1, effect: 'When reduced to 0 HP (not radiant/crit): CHA save (DC 5 + damage taken). Success: drop to 1 HP instead. Once per long rest.', note: 'Free death save. CHA-based. At low damage, very reliable. At high damage, unlikely. Still great insurance.' },
  { feature: 'Hound of Ill Omen', level: 6, effect: '3 SP: summon dire wolf that targets one creature. Target has disadvantage on saves vs YOUR spells. Hound can only attack that creature.', note: 'Dire wolf stats. Target gets disadvantage on YOUR spell saves. Cast Hold Person → target saves with disadvantage. Incredible.' },
  { feature: 'Shadow Walk', level: 14, effect: 'Bonus action in dim light/darkness: teleport up to 120ft to another dim light/dark space.', note: 'Free 120ft teleport every turn in darkness. Cast Darkness → teleport freely forever. Insane mobility.' },
  { feature: 'Umbral Form', level: 18, effect: '6 SP: become shadow. Resistance to all damage except force/radiant. Move through objects. Lasts 1 minute.', note: 'Near-invulnerability. Move through walls. 6 SP is expensive but the effect is transformative.' },
];

export const SHADOW_TACTICS = [
  { tactic: 'Darkness + self-sight', detail: 'Cast Darkness (2 SP). You see through it. Enemies don\'t. Advantage on your attacks. Disadvantage on theirs.', rating: 'S', note: 'Careful: allies can\'t see either. Communicate with your party about positioning.' },
  { tactic: 'Hound + save-or-suck', detail: '3 SP: summon Hound → target has disadvantage on saves → cast Hold Person/Banishment. Much more likely to land.', rating: 'S' },
  { tactic: 'Shadow Walk repositioning', detail: 'L14: bonus action 120ft teleport in darkness. Cast Darkness → teleport every turn. Untouchable.', rating: 'S' },
  { tactic: 'Strength of the Grave survival', detail: 'Low damage hit drops you to 0? CHA save to stay at 1 HP. Keep concentration on your spell.', rating: 'A' },
  { tactic: 'Darkness ally coordination', detail: 'Warn allies before casting Darkness. Position them outside the sphere. Or: only Darkness over enemies.', rating: 'A' },
];

export const HOUND_OF_ILL_OMEN = {
  stats: 'Dire Wolf: AC 14, HP = half your sorcerer HP (min HP floor from dire wolf). Speed 50ft.',
  behavior: 'Appears within 30ft of target. Always moves toward target. Can only attack that target.',
  duration: '5 minutes or until it drops to 0 HP or target drops to 0 HP.',
  keyBenefit: 'Target has disadvantage on saves vs YOUR sorcerer spells while within 5ft of hound.',
  cost: '3 SP',
  note: 'The hound is primarily a debuff, not a damage source. Its purpose is to make your spells land.',
};

export function strengthOfTheGraveDC(damageTaken) {
  return 5 + damageTaken;
}

export function strengthOfTheGraveChance(chaMod, damageTaken) {
  const dc = 5 + damageTaken;
  return Math.min(0.95, Math.max(0.05, (21 - (dc - chaMod)) / 20));
}

export function houndHP(sorcererLevel) {
  return Math.max(37, Math.floor(sorcererLevel * 3.5)); // half sorcerer HP approximation, min dire wolf HP
}
