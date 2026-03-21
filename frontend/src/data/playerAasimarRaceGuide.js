/**
 * playerAasimarRaceGuide.js
 * Player Mode: Aasimar — the celestial-touched
 * Pure JS — no React dependencies.
 */

export const AASIMAR_BASICS = {
  race: 'Aasimar',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 CHA, +1 any (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Celestial heritage. Healing Hands for free healing. Resistance to necrotic and radiant. Three subraces (legacy) or one transformation (MotM). Excellent for Paladins, Clerics, and CHA casters.',
};

export const AASIMAR_TRAITS = [
  { trait: 'Celestial Resistance', effect: 'Resistance to necrotic and radiant damage.', note: 'Radiant is rare from enemies but necrotic is common. Two resistances is great.' },
  { trait: 'Healing Hands', effect: 'Action: touch creature, heal HP = your level. Once per long rest.', note: 'Free healing. Scales with level. At L10: heal 10 HP. Not amazing but free.' },
  { trait: 'Light Bearer', effect: 'Know the Light cantrip.', note: 'Free cantrip. Minor utility.' },
  { trait: 'Celestial Revelation (MotM)', effect: 'At L3: once per long rest, transform for 1 minute. Choose one form each time.', note: 'All three forms available. Choose based on situation.' },
];

export const AASIMAR_TRANSFORMATIONS = {
  legacy: [
    { subrace: 'Protector', effect: 'Wings (30ft fly). Once per turn: extra radiant = level to one damage roll.', note: 'Flight + damage. Best overall legacy subrace.' },
    { subrace: 'Scourge', effect: 'Radiant aura: end of your turn, you and each creature within 10ft take half your level radiant.', note: 'AoE damage but hurts you too. Synergizes with high HP builds.' },
    { subrace: 'Fallen', effect: 'Shadowy wings (no flight). Creatures within 10ft frightened (CHA save). Extra necrotic = level to one damage.', note: 'Fear aura + necrotic damage. Thematic for dark characters.' },
  ],
  motm: [
    { form: 'Necrotic Shroud', effect: 'Creatures within 10ft: CHA save or frightened. Extra necrotic = PB to one damage roll/turn.', note: 'Fear + extra damage. Good for melee.' },
    { form: 'Radiant Consumption', effect: 'End of each turn: each creature within 10ft takes PB radiant. You take half PB radiant.', note: 'AoE damage. Hits allies. Self-damage. Niche.' },
    { form: 'Radiant Soul', effect: '30ft fly speed. Extra radiant = PB to one damage roll/turn.', note: 'Flight + damage bonus. Best general-purpose form.' },
  ],
};

export const AASIMAR_CLASS_SYNERGY = [
  { class: 'Paladin', priority: 'S', reason: 'CHA synergy. Necrotic resistance. Healing Hands + Lay on Hands. Radiant Soul flight. Thematically perfect.' },
  { class: 'Cleric', priority: 'A', reason: 'Healing Hands supplements healing. Necrotic resistance for frontline. WIS not boosted (MotM fixes this).' },
  { class: 'Warlock', priority: 'A', reason: 'CHA caster. Radiant Soul for flight. Necrotic Shroud for Hexblade melee. Great combo.' },
  { class: 'Sorcerer', priority: 'A', reason: 'CHA caster. Divine Soul Sorcerer + Aasimar = full celestial flavor. Radiant Soul for emergency flight.' },
  { class: 'Bard', priority: 'A', reason: 'CHA synergy. Healing Hands + Bard healing. Radiant Soul for performance flair.' },
];

export const AASIMAR_TACTICS = [
  { tactic: 'Radiant Soul + ranged attacks', detail: 'Fly 30ft up + add PB radiant to one attack/turn. Paladin: fly + Smite from above.', rating: 'S' },
  { tactic: 'Necrotic Shroud opener', detail: 'Transform turn 1. Fear enemies within 10ft. Then attack with advantage (frightened imposes disadvantage on their attacks, not your saves, but flavor).', rating: 'A' },
  { tactic: 'Healing Hands emergency', detail: 'Free action heal. Use on unconscious ally. Level HP = reliable pickup.', rating: 'B' },
  { tactic: 'Save transformation', detail: 'Don\'t transform immediately. Save for boss fights or emergencies. 1 minute duration = most combats.', rating: 'A' },
];

export function healingHandsHP(characterLevel) {
  return characterLevel;
}

export function transformationDamage(profBonus) {
  return { extraDamage: profBonus, type: 'radiant or necrotic', perTurn: true };
}
