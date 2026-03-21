/**
 * playerDevotionPaladinGuide.js
 * Player Mode: Oath of Devotion Paladin — the classic holy warrior
 * Pure JS — no React dependencies.
 */

export const DEVOTION_BASICS = {
  class: 'Paladin (Oath of Devotion)',
  source: 'Player\'s Handbook',
  theme: 'Classic holy knight. Sacred Weapon, charm immunity, and radiant damage.',
  note: 'The iconic Paladin. Sacred Weapon makes you never miss. Aura of Devotion grants charm immunity. Reliable and strong.',
};

export const DEVOTION_FEATURES = [
  { feature: 'Sacred Weapon', level: 3, effect: 'Channel Divinity, action: weapon gets +CHA to attack rolls for 1 minute. Emits bright light 20ft.', note: '+5 to attack rolls with 20 CHA. Stacks with GWM to negate the -5. Nearly guaranteed hits.' },
  { feature: 'Turn the Unholy', level: 3, effect: 'Channel Divinity: fiends and undead within 30ft must WIS save or be turned for 1 minute.', note: 'Turn Undead but also fiends. Good against undead/fiend encounters.' },
  { feature: 'Aura of Devotion', level: 7, effect: 'You and allies within 10ft (30ft at L18) can\'t be charmed.', note: 'CHARM IMMUNITY for the party. Passive. Always on. Covers Dominate Person, Charm Monster, etc.' },
  { feature: 'Purity of Spirit', level: 15, effect: 'Permanent Protection from Evil and Good (aberrations, celestials, elementals, fey, fiends, undead).', note: 'Permanent. No concentration. Can\'t be charmed/frightened/possessed by those types. Disadvantage on their attacks.' },
  { feature: 'Holy Nimbus', level: 20, effect: 'Transform for 1 minute: 30ft bright light, enemies in it take 10 radiant damage start of their turn. Advantage on saves vs fiend/undead spells.', note: '10 radiant per enemy per turn. No save. Just standing near you burns evil.' },
];

export const DEVOTION_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Protection from Evil and Good, Sanctuary', note: 'PfEaG is excellent. Sanctuary prevents targeting for a turn.' },
    { level: 2, spells: 'Lesser Restoration, Zone of Truth', note: 'Both utility spells. Zone of Truth for interrogations.' },
    { level: 3, spells: 'Beacon of Hope, Dispel Magic', note: 'Beacon of Hope: max healing rolls + advantage on WIS/death saves. Dispel Magic always useful.' },
    { level: 4, spells: 'Freedom of Movement, Guardian of Faith', note: 'Freedom of Movement prevents restraints. Guardian of Faith is free damage.' },
    { level: 5, spells: 'Commune, Flame Strike', note: 'Commune: ask the gods 3 yes/no questions. Flame Strike: AoE damage.' },
  ],
};

export const DEVOTION_TACTICS = [
  { tactic: 'Sacred Weapon + GWM', detail: 'Sacred Weapon: +CHA to attack. GWM: -5 to attack. Net: +CHA-5 = +0 with 20 CHA. But you still add proficiency + STR. Essentially negate GWM penalty.', rating: 'S' },
  { tactic: 'Charm immunity aura', detail: 'L7: allies within 10ft can\'t be charmed. Passive, always on. Dominate Person, Charm Monster, Hypnotic Pattern — all fail.', rating: 'S', note: 'Charm immunity is underrated. Many enemies rely on charm effects.' },
  { tactic: 'Sacred Weapon + Sharpshooter', detail: 'Works with ranged weapons too. +CHA to attack negates SS -5. Longbow Paladin.', rating: 'A' },
  { tactic: 'Purity of Spirit permanent', detail: 'L15: permanent Protection from Evil and Good. Disadvantage on attacks from 6 creature types. Can\'t be charmed/frightened by them.', rating: 'A' },
];

export function sacredWeaponAttackBonus(strMod, profBonus, chaMod) {
  return strMod + profBonus + chaMod;
}

export function sacredWeaponGWMNet(strMod, profBonus, chaMod) {
  return strMod + profBonus + chaMod - 5; // +CHA - GWM penalty
}

export function holyNimbusDamagePerTurn(enemiesInRange) {
  return enemiesInRange * 10; // 10 radiant per enemy, no save
}
