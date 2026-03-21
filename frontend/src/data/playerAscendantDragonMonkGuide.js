/**
 * playerAscendantDragonMonkGuide.js
 * Player Mode: Way of the Ascendant Dragon Monk — the dragon warrior
 * Pure JS — no React dependencies.
 */

export const ASCENDANT_DRAGON_BASICS = {
  class: 'Monk (Way of the Ascendant Dragon)',
  source: 'Fizban\'s Treasury of Dragons',
  theme: 'Dragon-themed monk. Elemental breath weapon. Frightful Presence. Draconic wings.',
  note: 'Solid monk subclass with ranged AoE options. Breath weapon gives Monks something they usually lack: AoE damage. Flight at L11 is excellent.',
};

export const ASCENDANT_DRAGON_FEATURES = [
  { feature: 'Draconic Disciple', level: 3, effect: 'Unarmed strikes can deal acid, cold, fire, lightning, or poison (choose each hit). Free language (Draconic or another). Reroll failed Intimidation/Persuasion once per LR.', note: 'Swap damage types per attack. Bypass resistances. Fire immune enemy? Switch to cold. Very flexible.' },
  { feature: 'Breath of the Dragon', level: 3, effect: 'Replace one attack with breath weapon: 20ft cone or 30ft line. DEX save (some types CON). 2 martial arts dice damage. Type chosen each use. Free PB times/LR, then 1 ki.', note: 'AoE damage for a Monk! 2d6-2d10 depending on level. Free uses = great resource economy. Scales with martial arts die.' },
  { feature: 'Wings Unfurled', level: 6, effect: 'When using Step of the Wind, gain fly speed = walking speed until end of turn.', note: 'Flight for 1 ki (Step of the Wind). Lasts until end of turn only — so fly in, attack, you\'re still in the air. Land next turn or keep spending ki.' },
  { feature: 'Aspect of the Wyrm', level: 11, effect: 'Bonus action (3 ki): 10ft aura for 1 minute. Choose: resistance to chosen element type for allies in aura, OR frightful presence (enemies entering/starting in aura: WIS save or frightened for 1 turn).', note: 'Party-wide elemental resistance OR AoE fear. Both excellent. 3 ki is steep but lasts 1 minute.' },
  { feature: 'Ascendant Dragon', level: 17, effect: 'Aspect of the Wyrm: both effects simultaneously (resistance + fear). Breath weapon: augment for 1 ki = 4 martial arts dice damage + additional effect (blind, fear, or prone on failed save).', note: 'Both aura effects at once. Breath weapon deals 4d10 + debuff. Very strong capstone.' },
];

export const ASCENDANT_DRAGON_TACTICS = [
  { tactic: 'Breath weapon opener', detail: 'Turn 1: Breath of the Dragon (free use). Hit 2-4 enemies in cone for 2d6+. Then bonus action Flurry of Blows on a single target.', rating: 'A' },
  { tactic: 'Damage type switching', detail: 'Unarmed strikes change element per hit. Enemy resistant to fire? Switch to cold mid-combo. Bypasses resistance easily.', rating: 'A' },
  { tactic: 'Wings + Stunning Strike', detail: 'Step of the Wind (fly) → close distance to backline caster → Stunning Strike. Monks lacked gap closing; now you fly.', rating: 'A' },
  { tactic: 'Aspect fear aura + positioning', detail: 'L11: Frightful Presence aura. Stand in melee — enemies starting turn near you must save or be frightened. Fear + Stunning Strike lockdown.', rating: 'S' },
  { tactic: 'Augmented breath at L17', detail: 'Breath weapon: 4d10 + blind/frighten/prone on failed save. Prone + follow-up melee = advantage. Blind shuts down casters.', rating: 'S' },
];

export function breathWeaponDamage(monkLevel) {
  const martialArtsDie = monkLevel >= 17 ? 10 : monkLevel >= 11 ? 8 : monkLevel >= 5 ? 6 : 4;
  const diceCount = monkLevel >= 17 ? 4 : 2; // Ascendant Dragon augments at L17
  return { dice: `${diceCount}d${martialArtsDie}`, avg: diceCount * (martialArtsDie / 2 + 0.5) };
}

export function breathWeaponFreeUses(proficiencyBonus) {
  return proficiencyBonus;
}
