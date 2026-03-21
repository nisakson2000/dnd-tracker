/**
 * playerHealerFeatGuide.js
 * Player Mode: Healer feat — non-magical healing
 * Pure JS — no React dependencies.
 */

export const HEALER_FEAT_BASICS = {
  feat: 'Healer',
  source: 'Player\'s Handbook',
  benefit1: 'Stabilize a creature at 0 HP: they regain 1 HP. Uses healer\'s kit.',
  benefit2: 'Use healer\'s kit to restore 1d6+4+creature\'s HD HP. Once per creature per short/long rest.',
  healersKit: 'Healer\'s Kit: 5 gp, 10 uses. No proficiency needed. 10 charges per kit.',
  note: 'Free healing without magic. Incredible for parties without dedicated healers. Scales with creature\'s level (HD = Hit Dice = level).',
};

export const HEALER_FEAT_MATH = [
  { creatureLevel: 1, healing: '1d6+4+1 = avg 8.5', note: 'At L1, that\'s almost full HP for most characters.' },
  { creatureLevel: 5, healing: '1d6+4+5 = avg 12.5', note: 'Solid healing. Equivalent to a L2 Cure Wounds.' },
  { creatureLevel: 10, healing: '1d6+4+10 = avg 17.5', note: 'Very good. Better than a L3 Cure Wounds without modifier.' },
  { creatureLevel: 15, healing: '1d6+4+15 = avg 22.5', note: 'Excellent. Equivalent to a well-cast Cure Wounds.' },
  { creatureLevel: 20, healing: '1d6+4+20 = avg 27.5', note: 'Fantastic. Free Cure Wounds-level healing every short rest.' },
];

export const HEALER_FEAT_USES = [
  { use: 'Pick up downed allies', detail: 'Stabilize at 0 HP → they regain 1 HP → they\'re conscious. No spell slot. No action economy cost beyond "use an object."', rating: 'S' },
  { use: 'Between-combat healing', detail: 'After a fight: heal each party member 1d6+4+level HP. Free. Saves Hit Dice for emergencies.', rating: 'S' },
  { use: 'No-healer parties', detail: 'Party has no Cleric/Druid/Bard? One character takes Healer feat. Problem solved.', rating: 'S' },
  { use: 'Supplement existing healing', detail: 'Even with a Cleric, Healer feat saves spell slots. Cleric can focus on offense.', rating: 'A' },
];

export const HEALER_FEAT_BEST_CLASSES = [
  { class: 'Thief Rogue', priority: 'S', reason: 'Fast Hands: Use healer\'s kit as BONUS ACTION. Heal as bonus action, attack as action. Best Healer user.' },
  { class: 'Fighter', priority: 'A', reason: 'Gets extra ASIs. Can spare a feat slot. Tanky enough to reach downed allies.' },
  { class: 'Ranger', priority: 'A', reason: 'WIS-based class but no great healing spells. Healer feat supplements.' },
  { class: 'Any non-caster', priority: 'A', reason: 'If your party lacks healing, any character can take this. 5gp kit + feat = party healer.' },
];

export function healerFeatHealing(creatureLevel) {
  return { dice: `1d6+${4 + creatureLevel}`, avg: 3.5 + 4 + creatureLevel };
}

export function healerKitChargesPerDay(partySize, encountersPerDay) {
  // ~1 charge per creature per short rest interval
  return partySize * (1 + Math.floor(encountersPerDay / 3)); // assume healing after every 2-3 fights
}
