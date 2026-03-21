/**
 * playerDeathClericGuide.js
 * Player Mode: Death Domain Cleric — the offensive caster
 * Pure JS — no React dependencies.
 */

export const DEATH_BASICS = {
  class: 'Cleric (Death Domain)',
  source: 'Dungeon Master\'s Guide',
  theme: 'Death and necromancy focused Cleric. Touch of Death for burst damage.',
  note: 'DMG subclass (check with DM). Reaper cantrip twin + Touch of Death burst = strong offensive Cleric. No heavy armor.',
};

export const DEATH_FEATURES = [
  { feature: 'Bonus Proficiency', level: 1, effect: 'Martial weapon proficiency.', note: 'Martial weapons. Use a longsword or warhammer.' },
  { feature: 'Reaper', level: 1, effect: 'Learn one necromancy cantrip from any list. When you cast a necromancy cantrip that targets one creature, target two creatures within 5ft of each other.', note: 'Twin Toll the Dead! Two targets take 1d12 each. Free extra cantrip damage every turn.' },
  { feature: 'Touch of Death', level: 2, effect: 'Channel Divinity: when you hit a creature with a melee attack, deal extra necrotic = 5 + 2× Cleric level.', note: 'At L5: 5+10=15 extra necrotic. At L10: 5+20=25. Massive one-shot burst. Like mini-Smite.' },
  { feature: 'Inescapable Destruction', level: 6, effect: 'Your necrotic damage from Cleric features ignores resistance to necrotic.', note: 'Your necrotic damage bypasses resistance. Many undead resist necrotic — you ignore that.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 necrotic on weapon hit (2d8 at L14).', note: 'Necrotic Divine Strike. Standard but combos with Inescapable Destruction.' },
  { feature: 'Improved Reaper', level: 17, effect: 'Necromancy spells of 1st-5th level that target one creature can target two creatures within 5ft.', note: 'Twin any necromancy spell up to 5th level. Two Inflict Wounds. Two Blight. Devastating.' },
];

export const DEATH_SPELLS = {
  domainSpells: [
    { level: 1, spells: 'False Life, Ray of Sickness', note: 'False Life for temp HP. Ray of Sickness for necrotic ranged damage + poisoned.' },
    { level: 2, spells: 'Blindness/Deafness, Ray of Enfeeblement', note: 'Blindness is great (no concentration, CON save). Ray of Enfeeblement is niche.' },
    { level: 3, spells: 'Animate Dead, Vampiric Touch', note: 'Animate Dead for undead army. Vampiric Touch for self-healing damage.' },
    { level: 4, spells: 'Blight, Death Ward', note: 'Blight: 8d8 necrotic (good with Improved Reaper). Death Ward: auto-survive lethal blow.' },
    { level: 5, spells: 'Antilife Shell, Cloudkill', note: 'Antilife Shell keeps melee away. Cloudkill for poison AoE.' },
  ],
};

export const DEATH_TACTICS = [
  { tactic: 'Twin Toll the Dead', detail: 'Toll the Dead two targets within 5ft. Each takes 1d12 necrotic (if damaged). Free. Every turn.', rating: 'S', note: 'Best cantrip trick for any Cleric. Two targets = 2d12 avg 13 damage per turn.' },
  { tactic: 'Touch of Death burst', detail: 'Melee hit + Touch of Death. At L5: weapon + 15 necrotic. At L10: weapon + 25. One-shot potential.', rating: 'A' },
  { tactic: 'Inflict Wounds + Touch of Death', detail: 'Inflict Wounds (3d10) + Touch of Death = massive burst on one target. Touch of Death adds on top of spell damage.', rating: 'S', note: 'At L5: 3d10 (16.5) + 15 = 31.5 average on a single melee hit.' },
  { tactic: 'Improved Reaper twin spells', detail: 'L17: Twin Inflict Wounds = 2 targets × 3d10. Twin Blight = 2 targets × 8d8. One spell slot, two targets.', rating: 'S' },
  { tactic: 'Bypass necrotic resistance', detail: 'L6: your necrotic damage ignores resistance. Fight undead without penalty. Not immunity — still blocked by immunity.', rating: 'A' },
];

export function touchOfDeathDamage(clericLevel) {
  return 5 + (2 * clericLevel);
}

export function twinTollTheDeadDamage(clericLevel) {
  const dieSize = clericLevel >= 17 ? 4 : clericLevel >= 11 ? 3 : clericLevel >= 5 ? 2 : 1;
  return dieSize * 6.5 * 2; // d12 per target, two targets
}

export function inflictWoundsPlusTouchDamage(spellLevel, clericLevel) {
  const inflictDice = 2 + spellLevel; // 3d10 at L1, 4d10 at L2, etc.
  return inflictDice * 5.5 + touchOfDeathDamage(clericLevel);
}
