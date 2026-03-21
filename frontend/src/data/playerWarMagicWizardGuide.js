/**
 * playerWarMagicWizardGuide.js
 * Player Mode: School of War Magic Wizard — combat-ready wizard
 * Pure JS — no React dependencies.
 */

export const WAR_MAGIC_BASICS = {
  class: 'Wizard (School of War Magic)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Battle Wizard. Defensive reactions and initiative bonus.',
  note: 'Best defensive Wizard (after Bladesinger). Arcane Deflection is free Shield/Absorb. +INT to initiative.',
};

export const WAR_MAGIC_FEATURES = [
  { feature: 'Arcane Deflection', level: 2, effect: 'Reaction: +2 AC against one attack, OR +4 to one saving throw. If used: can only cast cantrips until end of next turn.', note: 'Free Shield/Absorb Elements (sort of). No spell slot cost. But limits you to cantrips next turn.' },
  { feature: 'Tactical Wit', level: 2, effect: 'Add INT modifier to initiative rolls.', note: '+5 initiative at 20 INT. Go first and control the battlefield.' },
  { feature: 'Power Surge', level: 6, effect: 'Store energy from countered/dispelled spells (max = INT mod). Spend on damage: +half Wizard level force damage to one creature hit by your spell.', note: 'Bonus force damage. Not huge but free when you have charges. Builds from Counterspell/Dispel.' },
  { feature: 'Durable Magic', level: 10, effect: 'While maintaining concentration: +2 AC and +2 to all saving throws.', note: '+2 AC and +2 saves while concentrating. Since you\'re almost always concentrating, it\'s nearly permanent.' },
  { feature: 'Deflecting Shroud', level: 14, effect: 'When you use Arcane Deflection, up to 3 creatures within 60ft take force damage = half Wizard level.', note: 'Arcane Deflection now also damages enemies. Reaction defense + AoE retaliation.' },
];

export const WAR_MAGIC_TACTICS = [
  { tactic: 'Arcane Deflection efficiency', detail: 'Use when attacked and it would hit. +2 AC = miss. Cost: cantrips only next turn. If it\'s end of round, minimal cost.', rating: 'A', note: 'Best used late in the round. Cantrip restriction is less painful if your next turn has a concentration spell already running.' },
  { tactic: 'Durable Magic stacking', detail: 'Maintain concentration (which you should anyway). +2 AC + +2 saves. With Shield: 25+ AC spikes.', rating: 'S', note: 'Always have a concentration spell up. Haste, Wall of Force, Hypnotic Pattern — all keep Durable Magic active.' },
  { tactic: 'INT initiative', detail: '+5 initiative. Go first. Cast Hypnotic Pattern/Web before enemies act. Control the fight from turn 1.', rating: 'A' },
  { tactic: 'Arcane Deflection + Deflecting Shroud', detail: 'L14: use Arcane Deflection → defend yourself AND deal half level force damage to 3 enemies. Punish attackers.', rating: 'A' },
  { tactic: 'Power Surge from Counterspell', detail: 'Counterspell enemy → gain Power Surge charge → next spell: +bonus force damage. Counterspelling fuels your offense.', rating: 'B' },
];

export const WAR_MAGIC_VS_ABJURATION = {
  warMagic: { pros: ['Free +2 AC/+4 save reaction', '+INT to initiative', '+2 AC/saves while concentrating', 'Retaliatory damage'], cons: ['Cantrip restriction on Deflection', 'Power Surge is underwhelming', 'Less ward protection'] },
  abjuration: { pros: ['Arcane Ward (absorbs damage)', 'Ward recharges on abjuration cast', 'Deep Gnome infinite ward combo', 'Better pure defense'], cons: ['No initiative bonus', 'No concentration AC bonus', 'Ward can be depleted'] },
  verdict: 'War Magic for proactive defense + initiative. Abjuration for reactive ward-based tanking.',
};

export function arcaneDeflectionAC(baseAC) {
  return baseAC + 2; // Reaction: +2 AC
}

export function arcaneDeflectionSave(baseSave) {
  return baseSave + 4; // Reaction: +4 to save
}

export function durableMagicBonus() {
  return { ac: 2, saves: 2 }; // While concentrating
}

export function tacticalWitInitiative(dexMod, intMod) {
  return dexMod + intMod;
}
